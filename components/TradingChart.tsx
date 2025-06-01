"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"
import type { TrendlineData, ChartPoint } from "@/types/chart"
import { generateMockData } from "@/utils/mockData"
import { Trash2 } from "lucide-react"

interface TradingChartProps {
  trendlines: TrendlineData[]
  onTrendlineAdd: (trendline: TrendlineData) => void
  onTrendlineUpdate: (trendline: TrendlineData) => void
  onTrendlineDelete: (id: string) => void
  onTrendlineSelect: (trendline: TrendlineData) => void
  isDrawingMode: boolean
  timeframe: string
}

export default function TradingChart({
  trendlines,
  onTrendlineAdd,
  onTrendlineUpdate,
  onTrendlineDelete,
  onTrendlineSelect,
  isDrawingMode,
  timeframe,
}: TradingChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<any[]>([])
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 })
  const [isChartReady, setIsChartReady] = useState(false)

  // Drawing state
  const [drawingState, setDrawingState] = useState({
    isDrawing: false,
    startPoint: null as ChartPoint | null,
  })

  // Selection and interaction state
  const [selectedTrendlineId, setSelectedTrendlineId] = useState<string | null>(null)
  const [hoveredTrendlineId, setHoveredTrendlineId] = useState<string | null>(null)
  const [hoveredDeleteButton, setHoveredDeleteButton] = useState<string | null>(null)

  // Dragging state
  const [dragState, setDragState] = useState({
    isDragging: false,
    trendlineId: null as string | null,
    dragType: null as "start" | "end" | "line" | null,
    startPos: null as { x: number; y: number } | null,
    originalTrendline: null as TrendlineData | null,
  })

  // Chart configuration
  const margin = { top: 20, right: 60, bottom: 40, left: 60 }
  const chartWidth = dimensions.width - margin.left - margin.right
  const chartHeight = dimensions.height - margin.top - margin.bottom

  // Utility functions
  const generateId = () => `trendline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const getRandomColor = () => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const orderByTime = (a: ChartPoint, b: ChartPoint): [ChartPoint, ChartPoint] => {
    return a.time <= b.time ? [a, b] : [b, a]
  }

  // Log coordinates function
  const logCoordinates = useCallback((trendline: TrendlineData, action: string) => {
    const startDate = new Date(trendline.startPoint.time * 1000)
    const endDate = new Date(trendline.endPoint.time * 1000)

    const coordinateData = {
      id: trendline.id,
      action: action,
      startPoint: {
        timestamp: startDate.toLocaleString(),
        price: `$${trendline.startPoint.price.toFixed(2)}`,
        time: trendline.startPoint.time,
      },
      endPoint: {
        timestamp: endDate.toLocaleString(),
        price: `$${trendline.endPoint.price.toFixed(2)}`,
        time: trendline.endPoint.time,
      },
      priceChange: `$${(trendline.endPoint.price - trendline.startPoint.price).toFixed(2)}`,
      direction: trendline.endPoint.price > trendline.startPoint.price ? "Bullish" : "Bearish",
    }

    console.log(`📊 Trendline ${action}:`, coordinateData)

    // Enhanced UI notification
    const message = `🎯 Trendline ${action}\n📍 Start: ${startDate.toLocaleString()}\n💰 Price: ${coordinateData.startPoint.price}\n\n📍 End: ${endDate.toLocaleString()}\n💰 Price: ${coordinateData.endPoint.price}\n\n📈 Change: ${coordinateData.priceChange} (${coordinateData.direction})`

    // Create enhanced notification
    const notification = document.createElement("div")
    notification.className =
      "fixed top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg shadow-xl z-50 max-w-sm border border-blue-400"
    notification.style.whiteSpace = "pre-line"
    notification.style.fontFamily = "monospace"
    notification.style.fontSize = "12px"
    notification.style.animation = "slideIn 0.3s ease-out"
    notification.textContent = message

    // Add close button
    const closeBtn = document.createElement("button")
    closeBtn.innerHTML = "×"
    closeBtn.className = "absolute top-1 right-2 text-white hover:text-gray-300 text-lg font-bold"
    closeBtn.onclick = () => document.body.removeChild(notification)
    notification.appendChild(closeBtn)

    document.body.appendChild(notification)

    // Auto remove after 8 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 8000)
  }, [])

  // Initialize data
  useEffect(() => {
    console.log("🚀 Loading chart data...")
    const mockData = generateMockData(timeframe)
    setData(mockData)
    setIsChartReady(true)
    console.log("✅ Chart data loaded:", mockData.length, "candles")
  }, [timeframe])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: 500 })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Create scales
  const getTimeScale = useCallback(() => {
    if (data.length === 0) return { min: 0, max: 1, scale: (t: number) => 0 }

    const minTime = data[0].time
    const maxTime = data[data.length - 1].time
    const timeRange = maxTime - minTime

    return {
      min: minTime,
      max: maxTime,
      scale: (time: number) => ((time - minTime) / timeRange) * chartWidth,
    }
  }, [data, chartWidth])

  const getPriceScale = useCallback(() => {
    if (data.length === 0) return { min: 0, max: 1, scale: (p: number) => 0, invert: (y: number) => 0 }

    const prices = data.flatMap((d) => [d.high, d.low])
    const minPrice = Math.min(...prices) * 0.99
    const maxPrice = Math.max(...prices) * 1.01
    const priceRange = maxPrice - minPrice

    return {
      min: minPrice,
      max: maxPrice,
      scale: (price: number) => chartHeight - ((price - minPrice) / priceRange) * chartHeight,
      invert: (y: number) => minPrice + ((chartHeight - y) / chartHeight) * priceRange,
    }
  }, [data, chartHeight])

  // Convert screen coordinates to chart coordinates
  const screenToChart = useCallback(
    (x: number, y: number): ChartPoint | null => {
      const timeScale = getTimeScale()
      const priceScale = getPriceScale()

      const chartX = x - margin.left
      const chartY = y - margin.top

      if (chartX < 0 || chartX > chartWidth || chartY < 0 || chartY > chartHeight) {
        return null
      }

      const time = timeScale.min + (chartX / chartWidth) * (timeScale.max - timeScale.min)
      const price = priceScale.invert(chartY)

      return { time, price }
    },
    [getTimeScale, getPriceScale, margin, chartWidth, chartHeight],
  )

  // Convert chart coordinates to screen coordinates
  const chartToScreen = useCallback(
    (point: ChartPoint): { x: number; y: number } | null => {
      const timeScale = getTimeScale()
      const priceScale = getPriceScale()

      const x = timeScale.scale(point.time) + margin.left
      const y = priceScale.scale(point.price) + margin.top

      return { x, y }
    },
    [getTimeScale, getPriceScale, margin],
  )

  // Distance from point to line
  const distanceToLine = (px: number, py: number, x1: number, y1: number, x2: number, y2: number): number => {
    const A = px - x1
    const B = py - y1
    const C = x2 - x1
    const D = y2 - y1

    const dot = A * C + B * D
    const lenSq = C * C + D * D

    if (lenSq === 0) return Math.sqrt(A * A + B * B)

    let param = dot / lenSq
    param = Math.max(0, Math.min(1, param))

    const xx = x1 + param * C
    const yy = y1 + param * D

    const dx = px - xx
    const dy = py - yy

    return Math.sqrt(dx * dx + dy * dy)
  }

  // Distance from point to point
  const distanceToPoint = (px: number, py: number, x: number, y: number): number => {
    return Math.sqrt((px - x) ** 2 + (py - y) ** 2)
  }

  // Draw the chart
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !isChartReady || data.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = dimensions.width * window.devicePixelRatio
    canvas.height = dimensions.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.fillStyle = "transparent"
    ctx.fillRect(0, 0, dimensions.width, dimensions.height)

    const timeScale = getTimeScale()
    const priceScale = getPriceScale()

    // Draw grid
    ctx.strokeStyle = "#334155"
    ctx.lineWidth = 1
    ctx.setLineDash([2, 2])

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = margin.left + (i / 10) * chartWidth
      ctx.beginPath()
      ctx.moveTo(x, margin.top)
      ctx.lineTo(x, margin.top + chartHeight)
      ctx.stroke()
    }

    // Horizontal grid lines
    for (let i = 0; i <= 8; i++) {
      const y = margin.top + (i / 8) * chartHeight
      ctx.beginPath()
      ctx.moveTo(margin.left, y)
      ctx.lineTo(margin.left + chartWidth, y)
      ctx.stroke()
    }

    ctx.setLineDash([])

    // Draw candlesticks
    const candleWidth = Math.max(2, (chartWidth / data.length) * 0.8)

    data.forEach((candle) => {
      const x = timeScale.scale(candle.time) + margin.left
      const openY = priceScale.scale(candle.open) + margin.top
      const closeY = priceScale.scale(candle.close) + margin.top
      const highY = priceScale.scale(candle.high) + margin.top
      const lowY = priceScale.scale(candle.low) + margin.top

      const isGreen = candle.close > candle.open
      const color = isGreen ? "#10b981" : "#ef4444"

      // Draw wick
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, highY)
      ctx.lineTo(x, lowY)
      ctx.stroke()

      // Draw body
      ctx.fillStyle = color
      const bodyHeight = Math.abs(closeY - openY)
      const bodyY = Math.min(openY, closeY)
      ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight)
    })

    // Draw axes
    ctx.fillStyle = "#9ca3af"
    ctx.font = "12px sans-serif"

    // Y-axis labels (prices)
    for (let i = 0; i <= 8; i++) {
      const price = priceScale.min + (i / 8) * (priceScale.max - priceScale.min)
      const y = margin.top + chartHeight - (i / 8) * chartHeight
      ctx.fillText(`$${price.toFixed(0)}`, margin.left + chartWidth + 5, y + 4)
    }

    // X-axis labels (time)
    for (let i = 0; i <= 5; i++) {
      const time = timeScale.min + (i / 5) * (timeScale.max - timeScale.min)
      const x = margin.left + (i / 5) * chartWidth
      const date = new Date(time * 1000)
      ctx.fillText(date.toLocaleDateString(), x - 20, margin.top + chartHeight + 20)
    }

    // Draw trendlines
    trendlines.forEach((trendline) => {
      const start = chartToScreen(trendline.startPoint)
      const end = chartToScreen(trendline.endPoint)

      if (start && end) {
        const isSelected = trendline.id === selectedTrendlineId
        const isHovered = trendline.id === hoveredTrendlineId
        const isDragging = dragState.isDragging && dragState.trendlineId === trendline.id

        ctx.strokeStyle = trendline.color
        ctx.lineWidth = isSelected || isHovered || isDragging ? 3 : trendline.width
        ctx.setLineDash([])

        // Draw main line
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()

        // Draw control points when hovered, selected, or dragging
        if (isHovered || isSelected || isDragging) {
          ctx.fillStyle = trendline.color
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 2

          // Start point
          ctx.beginPath()
          ctx.arc(start.x, start.y, 6, 0, 2 * Math.PI)
          ctx.fill()
          ctx.stroke()

          // End point
          ctx.beginPath()
          ctx.arc(end.x, end.y, 6, 0, 2 * Math.PI)
          ctx.fill()
          ctx.stroke()

          // Draw trendline ID label
          const midX = (start.x + end.x) / 2
          const midY = (start.y + end.y) / 2
          ctx.fillStyle = "#ffffff"
          ctx.font = "10px sans-serif"
          ctx.fillText(`#${trendline.id.slice(-4)}`, midX + 10, midY - 10)
        }
      }
    })

    // Draw drawing preview
    if (drawingState.isDrawing && drawingState.startPoint) {
      const start = chartToScreen(drawingState.startPoint)
      if (start) {
        ctx.fillStyle = "#3b82f6"
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(start.x, start.y, 6, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
      }
    }
  }, [
    dimensions,
    isChartReady,
    data,
    getTimeScale,
    getPriceScale,
    margin,
    chartWidth,
    chartHeight,
    trendlines,
    selectedTrendlineId,
    hoveredTrendlineId,
    dragState,
    drawingState,
    chartToScreen,
  ])

  // Draw chart when dependencies change
  useEffect(() => {
    drawChart()
  }, [drawChart])

  // Handle mouse down for dragging
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (!isChartReady || isDrawingMode) return

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // Check if we're clicking on a trendline or its control points
      for (const trendline of trendlines) {
        const start = chartToScreen(trendline.startPoint)
        const end = chartToScreen(trendline.endPoint)

        if (start && end) {
          const startDist = distanceToPoint(x, y, start.x, start.y)
          const endDist = distanceToPoint(x, y, end.x, end.y)
          const lineDist = distanceToLine(x, y, start.x, start.y, end.x, end.y)

          if (startDist <= 10) {
            // Dragging start point
            setDragState({
              isDragging: true,
              trendlineId: trendline.id,
              dragType: "start",
              startPos: { x, y },
              originalTrendline: { ...trendline },
            })
            setSelectedTrendlineId(trendline.id)
            onTrendlineSelect(trendline)
            return
          } else if (endDist <= 10) {
            // Dragging end point
            setDragState({
              isDragging: true,
              trendlineId: trendline.id,
              dragType: "end",
              startPos: { x, y },
              originalTrendline: { ...trendline },
            })
            setSelectedTrendlineId(trendline.id)
            onTrendlineSelect(trendline)
            return
          } else if (lineDist <= 8) {
            // Dragging entire line
            setDragState({
              isDragging: true,
              trendlineId: trendline.id,
              dragType: "line",
              startPos: { x, y },
              originalTrendline: { ...trendline },
            })
            setSelectedTrendlineId(trendline.id)
            onTrendlineSelect(trendline)
            return
          }
        }
      }
    },
    [isChartReady, isDrawingMode, trendlines, chartToScreen, onTrendlineSelect],
  )

  // Handle mouse move for dragging
  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!isChartReady) return

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      if (dragState.isDragging && dragState.trendlineId && dragState.startPos && dragState.originalTrendline) {
        // Handle dragging
        const dx = x - dragState.startPos.x
        const dy = y - dragState.startPos.y

        const trendline = trendlines.find((t) => t.id === dragState.trendlineId)
        if (!trendline) return

        let updatedTrendline: TrendlineData

        if (dragState.dragType === "start") {
          const newPoint = screenToChart(x, y)
          if (newPoint) {
            const [start, end] = orderByTime(newPoint, trendline.endPoint)
            updatedTrendline = { ...trendline, startPoint: start, endPoint: end }
          } else return
        } else if (dragState.dragType === "end") {
          const newPoint = screenToChart(x, y)
          if (newPoint) {
            const [start, end] = orderByTime(trendline.startPoint, newPoint)
            updatedTrendline = { ...trendline, startPoint: start, endPoint: end }
          } else return
        } else {
          // Move entire line
          const originalStart = chartToScreen(dragState.originalTrendline.startPoint)
          const originalEnd = chartToScreen(dragState.originalTrendline.endPoint)

          if (originalStart && originalEnd) {
            const newStart = screenToChart(originalStart.x + dx, originalStart.y + dy)
            const newEnd = screenToChart(originalEnd.x + dx, originalEnd.y + dy)

            if (newStart && newEnd) {
              const [start, end] = orderByTime(newStart, newEnd)
              updatedTrendline = { ...trendline, startPoint: start, endPoint: end }
            } else return
          } else return
        }

        onTrendlineUpdate(updatedTrendline)
      } else if (!isDrawingMode) {
        // Handle hover detection
        let hoveredId: string | null = null
        let cursor = "default"

        for (const trendline of trendlines) {
          const start = chartToScreen(trendline.startPoint)
          const end = chartToScreen(trendline.endPoint)

          if (start && end) {
            const startDist = distanceToPoint(x, y, start.x, start.y)
            const endDist = distanceToPoint(x, y, end.x, end.y)
            const lineDist = distanceToLine(x, y, start.x, start.y, end.x, end.y)

            if (startDist <= 10 || endDist <= 10) {
              hoveredId = trendline.id
              cursor = "grab"
              break
            } else if (lineDist <= 8) {
              hoveredId = trendline.id
              cursor = "move"
              break
            }
          }
        }

        setHoveredTrendlineId(hoveredId)

        // Update cursor
        if (canvasRef.current) {
          canvasRef.current.style.cursor = isDrawingMode ? "crosshair" : cursor
        }
      }
    },
    [isChartReady, isDrawingMode, dragState, trendlines, chartToScreen, screenToChart, onTrendlineUpdate],
  )

  // Handle mouse up for dragging
  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging && dragState.trendlineId) {
      const trendline = trendlines.find((t) => t.id === dragState.trendlineId)
      if (trendline) {
        logCoordinates(trendline, "Dragged")
      }
    }

    setDragState({
      isDragging: false,
      trendlineId: null,
      dragType: null,
      startPos: null,
      originalTrendline: null,
    })
  }, [dragState, trendlines, logCoordinates])

  // Handle chart click
  const handleChartClick = useCallback(
    (event: React.MouseEvent) => {
      if (!isChartReady || dragState.isDragging) return

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      if (isDrawingMode) {
        const chartPoint = screenToChart(x, y)
        if (!chartPoint) return

        console.log("📍 Chart point:", chartPoint)

        if (!drawingState.isDrawing) {
          // Start drawing
          console.log("🎨 Starting to draw trendline")
          setDrawingState({
            isDrawing: true,
            startPoint: chartPoint,
          })
        } else if (drawingState.startPoint) {
          // Finish drawing
          console.log("✅ Finishing trendline")

          const [start, end] = orderByTime(drawingState.startPoint, chartPoint)
          const newTrendline: TrendlineData = {
            id: generateId(),
            startPoint: start,
            endPoint: end,
            color: getRandomColor(),
            width: 2,
            style: 0,
            createdAt: new Date().toISOString(),
          }

          onTrendlineAdd(newTrendline)
          setSelectedTrendlineId(newTrendline.id)
          logCoordinates(newTrendline, "Created")

          setDrawingState({
            isDrawing: false,
            startPoint: null,
          })

          console.log("🎉 Trendline created:", newTrendline.id)
        }
      } else {
        // Handle selection in non-drawing mode
        let clickedTrendline: string | null = null

        // Check if we clicked on a trendline
        for (const trendline of trendlines) {
          const start = chartToScreen(trendline.startPoint)
          const end = chartToScreen(trendline.endPoint)

          if (start && end) {
            const distance = distanceToLine(x, y, start.x, start.y, end.x, end.y)
            if (distance <= 8) {
              clickedTrendline = trendline.id
              break
            }
          }
        }

        if (clickedTrendline) {
          const trendline = trendlines.find((t) => t.id === clickedTrendline)
          if (trendline) {
            setSelectedTrendlineId(clickedTrendline)
            onTrendlineSelect(trendline)
            console.log("🎯 Trendline selected:", clickedTrendline)
          }
        } else {
          setSelectedTrendlineId(null)
          console.log("🔄 Selection cleared")
        }
      }
    },
    [
      isChartReady,
      dragState.isDragging,
      isDrawingMode,
      drawingState,
      screenToChart,
      chartToScreen,
      trendlines,
      onTrendlineAdd,
      onTrendlineSelect,
      logCoordinates,
    ],
  )

  // Handle double click for coordinate logging
  const handleDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      if (isDrawingMode || dragState.isDragging) return

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // Check if we double-clicked on a trendline
      for (const trendline of trendlines) {
        const start = chartToScreen(trendline.startPoint)
        const end = chartToScreen(trendline.endPoint)

        if (start && end) {
          const distance = distanceToLine(x, y, start.x, start.y, end.x, end.y)
          if (distance <= 8) {
            logCoordinates(trendline, "Double-clicked")
            setSelectedTrendlineId(trendline.id)
            onTrendlineSelect(trendline)
            return
          }
        }
      }
    },
    [isDrawingMode, dragState.isDragging, trendlines, chartToScreen, logCoordinates, onTrendlineSelect],
  )

  // Reset drawing state when mode changes
  useEffect(() => {
    if (!isDrawingMode && drawingState.isDrawing) {
      console.log("🔄 Resetting drawing state")
      setDrawingState({
        isDrawing: false,
        startPoint: null,
      })
    }
  }, [isDrawingMode, drawingState])

  // Add global mouse up listener for dragging
  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp)
    return () => document.removeEventListener("mouseup", handleMouseUp)
  }, [handleMouseUp])

  return (
    <div ref={containerRef} className="relative w-full">
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className={`w-full h-full ${isDrawingMode ? "cursor-crosshair" : "cursor-default"}`}
        onClick={handleChartClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onDoubleClick={handleDoubleClick}
        style={{ height: "500px" }}
      />

      {/* Enhanced delete buttons for hovered trendlines */}
      {hoveredTrendlineId &&
        !isDrawingMode &&
        !dragState.isDragging &&
        (() => {
          const trendline = trendlines.find((t) => t.id === hoveredTrendlineId)
          if (!trendline) return null

          const start = chartToScreen(trendline.startPoint)
          const end = chartToScreen(trendline.endPoint)
          if (!start || !end) return null

          const midX = (start.x + end.x) / 2
          const midY = (start.y + end.y) / 2

          return (
            <div className="absolute z-20" style={{ left: `${midX - 12}px`, top: `${midY - 12}px` }}>
              <button
                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition-all duration-200 transform hover:scale-110 border-2 border-white"
                onClick={(e) => {
                  e.stopPropagation()
                  const trendlineToDelete = trendlines.find((t) => t.id === hoveredTrendlineId)
                  if (trendlineToDelete) {
                    logCoordinates(trendlineToDelete, "Deleted")
                  }
                  onTrendlineDelete(hoveredTrendlineId)
                  setHoveredTrendlineId(null)
                  if (selectedTrendlineId === hoveredTrendlineId) {
                    setSelectedTrendlineId(null)
                  }
                }}
                title={`Delete Trendline #${hoveredTrendlineId.slice(-4)}`}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          )
        })()}

      {/* Loading indicator */}
      {!isChartReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white font-medium">Loading chart...</p>
          </div>
        </div>
      )}

      {/* Drawing indicators */}
      {isChartReady && drawingState.isDrawing && (
        <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg border border-blue-500/50 z-10">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>Click to set end point</span>
          </div>
        </div>
      )}

      {isChartReady && isDrawingMode && !drawingState.isDrawing && (
        <div className="absolute top-4 left-4 bg-slate-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm border border-slate-600/50 z-10">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Click two points to draw a trendline</span>
          </div>
        </div>
      )}

      {/* Enhanced interaction help with coordinate display */}
      {isChartReady && !isDrawingMode && (
        <div className="absolute bottom-4 left-4 space-y-2">
          <div className="bg-slate-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-xs border border-slate-600/50 z-10">
            <div className="font-semibold mb-2 text-blue-400">📊 Trendline Controls</div>
            <ul className="space-y-1">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Click and drag to move trendlines</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Double-click to log coordinates</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span>Hover and click 🗑️ to delete</span>
              </li>
            </ul>
          </div>

          {selectedTrendlineId &&
            (() => {
              const selectedTrendline = trendlines.find((t) => t.id === selectedTrendlineId)
              if (!selectedTrendline) return null

              return (
                <div className="bg-green-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-xs border border-green-600/50 z-10">
                  <div className="font-semibold mb-2 text-green-400">
                    🎯 Selected Trendline #{selectedTrendlineId.slice(-4)}
                  </div>
                  <div className="space-y-1 font-mono text-xs">
                    <div>Start: ${selectedTrendline.startPoint.price.toFixed(2)}</div>
                    <div>End: ${selectedTrendline.endPoint.price.toFixed(2)}</div>
                    <div
                      className={
                        selectedTrendline.endPoint.price > selectedTrendline.startPoint.price
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {selectedTrendline.endPoint.price > selectedTrendline.startPoint.price ? "📈" : "📉"}$
                      {Math.abs(selectedTrendline.endPoint.price - selectedTrendline.startPoint.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              )
            })()}
        </div>
      )}

      {/* Status indicators */}
      {isChartReady && (
        <>
          {/* Trendline count */}
          {trendlines.length > 0 && (
            <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs border border-slate-600/50 z-10">
              {trendlines.length} trendline{trendlines.length !== 1 ? "s" : ""} active
            </div>
          )}

          {/* Drawing mode indicator */}
          {isDrawingMode && (
            <div className="absolute top-16 right-4 bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs border border-blue-500/50 z-10">
              Drawing Mode ON
            </div>
          )}

          {/* Selected trendline indicator */}
          {selectedTrendlineId && (
            <div className="absolute top-28 right-4 bg-green-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs border border-green-500/50 z-10">
              Selected: #{selectedTrendlineId.slice(-4)}
            </div>
          )}

          {/* Dragging indicator */}
          {dragState.isDragging && (
            <div className="absolute top-40 right-4 bg-orange-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs border border-orange-500/50 z-10">
              Dragging {dragState.dragType}
            </div>
          )}
        </>
      )}
    </div>
  )
}
