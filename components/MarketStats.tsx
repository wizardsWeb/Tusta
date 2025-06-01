"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Globe } from "lucide-react"

export default function MarketStats() {
  const marketData = [
    {
      name: "S&P 500",
      value: "4,567.89",
      change: "+23.45",
      changePercent: "+0.52%",
      isPositive: true,
    },
    {
      name: "NASDAQ",
      value: "14,234.56",
      change: "-45.67",
      changePercent: "-0.32%",
      isPositive: false,
    },
    {
      name: "DOW JONES",
      value: "34,567.12",
      change: "+156.78",
      changePercent: "+0.45%",
      isPositive: true,
    },
    {
      name: "VIX",
      value: "18.45",
      change: "-1.23",
      changePercent: "-6.25%",
      isPositive: false,
    },
  ]

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center">
          <Globe className="h-5 w-5 mr-2" />
          Market Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketData.map((market) => (
            <div key={market.name} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-medium">{market.name}</span>
                {market.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
              </div>
              <div className="text-xl font-bold text-white mb-1">{market.value}</div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${market.isPositive ? "text-green-400" : "text-red-400"}`}>
                  {market.change}
                </span>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    market.isPositive
                      ? "text-green-400 border-green-400 bg-green-400/10"
                      : "text-red-400 border-red-400 bg-red-400/10"
                  }`}
                >
                  {market.changePercent}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
