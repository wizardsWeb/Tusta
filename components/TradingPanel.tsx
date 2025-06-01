"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Settings } from "lucide-react"

export default function TradingPanel() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy")
  const [quantity, setQuantity] = useState(400)
  const [price, setPrice] = useState(260)

  return (
    <div className="space-y-6">
      {/* Buy/Sell Panel */}
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Buy/Sell Stock</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stock Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AMD</span>
              </div>
              <div>
                <p className="text-white font-medium">AMD</p>
                <p className="text-slate-400 text-sm">NSE $227.13 • BSE $227.27 (-6.521%)</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white">
              <Settings className="h-4 w-4" />
            </button>
          </div>

          {/* Buy/Sell Tabs */}
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("buy")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "buy" ? "bg-green-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setActiveTab("sell")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "sell" ? "bg-red-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Sell
            </button>
          </div>

          {/* Order Type */}
          <div className="flex space-x-2">
            {["Delivery", "MTE", "Intraday"].map((type) => (
              <button
                key={type}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  type === "Delivery" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
            <button className="p-1 text-slate-400 hover:text-white">
              <Settings className="h-3 w-3" />
            </button>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="text-slate-400 text-sm">Quantity</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Minus className="h-4 w-4 text-slate-400" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">
                BSE
              </Badge>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-slate-400 text-sm">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number.parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
            <div className="text-right">
              <Badge variant="outline" className="text-slate-400 border-slate-600 text-xs">
                Limit
              </Badge>
            </div>
          </div>

          {/* Order Validity */}
          <div className="space-y-2">
            <label className="text-slate-400 text-sm">Order Validity</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500">
              <option>GTC</option>
              <option>DAY</option>
              <option>IOC</option>
            </select>
          </div>

          {/* Disclosure */}
          <div className="text-xs text-slate-400 flex items-center space-x-1">
            <span>Stock is under watch by exchange</span>
            <button className="text-blue-400">ⓘ</button>
          </div>

          {/* Buy Button */}
          <Button
            className={`w-full py-3 font-semibold ${
              activeTab === "buy"
                ? "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
            } text-white`}
          >
            {activeTab === "buy" ? "BUY" : "SELL"} ⚡
          </Button>
        </CardContent>
      </Card>

      {/* Holdings Summary */}
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-sm">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Day P&L</span>
            <span className="text-green-400 font-medium">+$1,247.32</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Total P&L</span>
            <span className="text-green-400 font-medium">+$5,837.45</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Available Margin</span>
            <span className="text-white font-medium">$12,450.00</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
