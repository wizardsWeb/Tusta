"use client"

import type { TrendlineData } from "@/types/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, TrendingUp, TrendingDown } from "lucide-react"
import { formatPrice, formatTimestamp } from "@/utils/formatters"

interface CoordinateDisplayProps {
  selectedTrendline: TrendlineData | null
}

export default function CoordinateDisplay({ selectedTrendline }: CoordinateDisplayProps) {
  if (!selectedTrendline) {
    return (
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-lg flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Coordinates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-slate-400">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Select a trendline to view coordinates</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const priceChange = selectedTrendline.endPoint.price - selectedTrendline.startPoint.price
  const isUptrend = priceChange > 0
  const priceChangePercent = (priceChange / selectedTrendline.startPoint.price) * 100

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Trendline Coordinates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trendline Info */}
        <div className="flex items-center justify-between">
          <span className="text-slate-300 text-sm">Trendline ID:</span>
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            #{selectedTrendline.id.split("-")[1]?.slice(-4)}
          </Badge>
        </div>

        {/* Start Point */}
        <div className="space-y-2">
          <h4 className="text-white font-medium flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            Start Point
          </h4>
          <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Time:</span>
              <span className="text-white font-mono">
                {new Date(selectedTrendline.startPoint.time * 1000).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Price:</span>
              <span className="text-white font-mono">{formatPrice(selectedTrendline.startPoint.price)}</span>
            </div>
          </div>
        </div>

        {/* End Point */}
        <div className="space-y-2">
          <h4 className="text-white font-medium flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
            End Point
          </h4>
          <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Time:</span>
              <span className="text-white font-mono">
                {new Date(selectedTrendline.endPoint.time * 1000).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Price:</span>
              <span className="text-white font-mono">{formatPrice(selectedTrendline.endPoint.price)}</span>
            </div>
          </div>
        </div>

        {/* Analysis */}
        <div className="space-y-2">
          <h4 className="text-white font-medium">Analysis</h4>
          <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Direction:</span>
              <div className="flex items-center">
                {isUptrend ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={isUptrend ? "text-green-500" : "text-red-500"}>
                  {isUptrend ? "Uptrend" : "Downtrend"}
                </span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Price Change:</span>
              <span className={`font-mono ${isUptrend ? "text-green-500" : "text-red-500"}`}>
                {isUptrend ? "+" : ""}
                {formatPrice(priceChange)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Change %:</span>
              <span className={`font-mono ${isUptrend ? "text-green-500" : "text-red-500"}`}>
                {isUptrend ? "+" : ""}
                {priceChangePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Created Time */}
        <div className="text-xs text-slate-400 text-center pt-2 border-t border-slate-700">
          Created: {formatTimestamp(selectedTrendline.createdAt)}
        </div>
      </CardContent>
    </Card>
  )
}
