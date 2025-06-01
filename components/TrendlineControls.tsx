"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash, Target } from "lucide-react"

interface TrendlineControlsProps {
  isDrawingMode: boolean
  onDrawingModeChange: (enabled: boolean) => void
  trendlineCount: number
  onClearAll: () => void
  selectedTimeframe: string
  onTimeframeChange: (timeframe: string) => void
}

export default function TrendlineControls({
  isDrawingMode,
  onDrawingModeChange,
  trendlineCount,
  onClearAll,
  selectedTimeframe,
  onTimeframeChange,
}: TrendlineControlsProps) {
  const timeframes = ["1D", "1W", "1M", "3M", "6M", "1Y"]

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-white font-semibold">Performance Chart</h3>
            <div className="flex items-center space-x-1">
              {timeframes.map((tf) => (
                <Button
                  key={tf}
                  onClick={() => onTimeframeChange(tf)}
                  variant={selectedTimeframe === tf ? "default" : "ghost"}
                  size="sm"
                  className={`h-8 px-3 text-xs ${
                    selectedTimeframe === tf ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tf}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              <Target className="h-3 w-3 mr-1" />
              {trendlineCount} Trendlines
            </Badge>
            <Button
              onClick={() => onDrawingModeChange(!isDrawingMode)}
              variant={isDrawingMode ? "default" : "outline"}
              size="sm"
              className={`${
                isDrawingMode ? "bg-blue-600 text-white" : "border-slate-600 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Pencil className="h-4 w-4 mr-2" />
              {isDrawingMode ? "Drawing ON" : "Drawing OFF"}
            </Button>

            {trendlineCount > 0 && (
              <Button
                onClick={onClearAll}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                <Trash className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
