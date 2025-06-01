"use client"

import { useState, useEffect } from "react"
import TradingDashboard from "@/components/TradingDashboard"
import type { TrendlineData } from "@/types/chart"

export default function Home() {
  const [trendlines, setTrendlines] = useState<TrendlineData[]>([])
  const [selectedTrendline, setSelectedTrendline] = useState<TrendlineData | null>(null)

  // Load trendlines from localStorage with enhanced error handling
  useEffect(() => {
    try {
      const saved = localStorage.getItem("trading-trendlines")
      if (saved) {
        const parsed = JSON.parse(saved)
        // Validate the data structure
        if (
          Array.isArray(parsed) &&
          parsed.every((item) => item.id && item.startPoint && item.endPoint && item.color)
        ) {
          setTrendlines(parsed)
          console.log("✅ Loaded", parsed.length, "trendlines from localStorage")
        } else {
          console.warn("⚠️ Invalid trendline data in localStorage, starting fresh")
          localStorage.removeItem("trading-trendlines")
        }
      }
    } catch (error) {
      console.error("❌ Error loading trendlines from localStorage:", error)
      localStorage.removeItem("trading-trendlines")
    }
  }, [])

  // Save trendlines to localStorage with enhanced logging
  useEffect(() => {
    try {
      localStorage.setItem("trading-trendlines", JSON.stringify(trendlines))
      if (trendlines.length > 0) {
        console.log("💾 Saved", trendlines.length, "trendlines to localStorage")
      }
    } catch (error) {
      console.error("❌ Error saving trendlines to localStorage:", error)
    }
  }, [trendlines])

  const handleTrendlineAdd = (trendline: TrendlineData) => {
    setTrendlines((prev) => [...prev, trendline])
    setSelectedTrendline(trendline)
  }

  const handleTrendlineUpdate = (updatedTrendline: TrendlineData) => {
    setTrendlines((prev) => prev.map((t) => (t.id === updatedTrendline.id ? updatedTrendline : t)))
    setSelectedTrendline(updatedTrendline)
  }

  const handleTrendlineDelete = (id: string) => {
    setTrendlines((prev) => prev.filter((t) => t.id !== id))
    if (selectedTrendline?.id === id) {
      setSelectedTrendline(null)
    }
  }

  return (
    <TradingDashboard
      trendlines={trendlines}
      selectedTrendline={selectedTrendline}
      onTrendlineAdd={handleTrendlineAdd}
      onTrendlineUpdate={handleTrendlineUpdate}
      onTrendlineDelete={handleTrendlineDelete}
      onTrendlineSelect={setSelectedTrendline}
    />
  )
}
