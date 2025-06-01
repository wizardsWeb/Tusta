"use client"

import type { TrendlineData } from "@/types/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Eye, Trash } from "lucide-react"
import { formatPrice, formatTimestamp } from "@/utils/formatters"

interface TrendlineManagerProps {
  trendlines: TrendlineData[]
  selectedTrendline: TrendlineData | null
  onTrendlineSelect: (trendline: TrendlineData) => void
  onTrendlineDelete: (id: string) => void
  onClearAll: () => void
}

export default function TrendlineManager({
  trendlines,
  selectedTrendline,
  onTrendlineSelect,
  onTrendlineDelete,
  onClearAll,
}: TrendlineManagerProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg">Trendlines</CardTitle>
          {trendlines.length > 0 && (
            <Button
              onClick={onClearAll}
              variant="outline"
              size="sm"
              className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
            >
              <Trash className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {trendlines.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No trendlines drawn yet</p>
            <p className="text-xs mt-1">Enable drawing mode and click two points on the chart</p>
          </div>
        ) : (
          trendlines.map((trendline) => (
            <div
              key={trendline.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedTrendline?.id === trendline.id
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
              }`}
              onClick={() => onTrendlineSelect(trendline)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: trendline.color }} />
                  <span className="text-white text-sm font-medium">
                    Trendline #{trendline.id.split("-")[1]?.slice(-4)}
                  </span>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    onTrendlineDelete(trendline.id)
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-6 w-6 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Start:</span>
                  <span>{formatPrice(trendline.startPoint.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span>End:</span>
                  <span>{formatPrice(trendline.endPoint.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{formatTimestamp(trendline.createdAt)}</span>
                </div>
              </div>

              <div className="mt-2 flex space-x-1">
                <Badge variant="outline" className="text-xs">
                  Width: {trendline.width}px
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
