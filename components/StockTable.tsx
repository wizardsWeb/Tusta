"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, MoreHorizontal, Star } from "lucide-react"

export default function StockTable() {
  const stockData = [
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      quantity: 29,
      marketPrice: 387,
      invested: 2023,
      current: 9343,
      returns: 2173,
      returnsPercent: 107.4,
      isPositive: true,
      logo: "🚗",
    },
    {
      symbol: "AMD",
      name: "Advanced Micro Devices",
      quantity: 4,
      marketPrice: 660,
      invested: 7569,
      current: 3603,
      returns: -4981,
      returnsPercent: -65.8,
      isPositive: false,
      logo: "💻",
    },
    {
      symbol: "SKYLINE",
      name: "Skyline Corporation",
      quantity: 39,
      marketPrice: 858,
      invested: 4916,
      current: 2282,
      returns: 3415,
      returnsPercent: 149.6,
      isPositive: true,
      logo: "🏢",
    },
  ]

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Holdings</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-slate-400 border-slate-600">
              Page 1 of 10
            </Badge>
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                Previous
              </Button>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Company</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Qty.</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Mkt. Price</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Invested</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Current</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Returns</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((stock) => (
                <tr key={stock.symbol} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-lg">
                        {stock.logo}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{stock.symbol}</div>
                        <div className="text-slate-400 text-sm">{stock.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-white">{stock.quantity}</td>
                  <td className="py-4 px-4 text-right text-white">${stock.marketPrice}</td>
                  <td className="py-4 px-4 text-right text-white">${stock.invested.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right text-white">${stock.current.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {stock.isPositive ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      )}
                      <div className={`${stock.isPositive ? "text-green-400" : "text-red-400"}`}>
                        <div className="font-semibold">
                          {stock.isPositive ? "+" : ""}${Math.abs(stock.returns).toLocaleString()}
                        </div>
                        <div className="text-sm">
                          {stock.isPositive ? "+" : ""}
                          {stock.returnsPercent}%
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
