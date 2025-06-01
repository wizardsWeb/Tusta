"use client"

import { useState } from "react"
import Header from "./Header"
import PortfolioOverview from "./PortfolioOverview"
import TradingChart from "./TradingChart"
import TradingPanel from "./TradingPanel"
import CoordinateDisplay from "./CoordinateDisplay"
import TrendlineManager from "./TrendlineManager"
import TrendlineControls from "./TrendlineControls"
import type { TrendlineData } from "@/types/chart"
import MarketStats from "./MarketStats"
import StockTable from "./StockTable"

interface TradingDashboardProps {
  trendlines: TrendlineData[]
  selectedTrendline: TrendlineData | null
  onTrendlineAdd: (trendline: TrendlineData) => void
  onTrendlineUpdate: (trendline: TrendlineData) => void
  onTrendlineDelete: (id: string) => void
  onTrendlineSelect: (trendline: TrendlineData | null) => void
}

export default function TradingDashboard({
  trendlines,
  selectedTrendline,
  onTrendlineAdd,
  onTrendlineUpdate,
  onTrendlineDelete,
  onTrendlineSelect,
}: TradingDashboardProps) {
  const [isDrawingMode, setIsDrawingMode] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D")

  const clearAllTrendlines = () => {
    trendlines.forEach((t) => onTrendlineDelete(t.id))
    onTrendlineSelect(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Portfolio Overview */}
        <PortfolioOverview />

        {/* Main Trading Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Chart Section */}
          <div className="xl:col-span-3 space-y-4">
            {/* Chart Controls */}
            <TrendlineControls
              isDrawingMode={isDrawingMode}
              onDrawingModeChange={setIsDrawingMode}
              trendlineCount={trendlines.length}
              onClearAll={clearAllTrendlines}
              selectedTimeframe={selectedTimeframe}
              onTimeframeChange={setSelectedTimeframe}
            />

            {/* Trading Chart with Lightweight Charts */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
              <TradingChart
                trendlines={trendlines}
                onTrendlineAdd={onTrendlineAdd}
                onTrendlineUpdate={onTrendlineUpdate}
                onTrendlineDelete={onTrendlineDelete}
                onTrendlineSelect={onTrendlineSelect}
                isDrawingMode={isDrawingMode}
                timeframe={selectedTimeframe}
              />
            </div>

          {/* Market Stats */}
          <MarketStats />

           {/* Stock Holdings Table */}
          <StockTable />

          </div>


          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Trading Panel */}
            <TradingPanel />

            {/* Coordinate Display */}
            <CoordinateDisplay selectedTrendline={selectedTrendline} />

            {/* Trendline Manager */}
            <TrendlineManager
              trendlines={trendlines}
              selectedTrendline={selectedTrendline}
              onTrendlineSelect={onTrendlineSelect}
              onTrendlineDelete={onTrendlineDelete}
              onClearAll={clearAllTrendlines}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
