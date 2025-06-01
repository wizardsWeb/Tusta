"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Activity, Settings, Bell, Search, User, Wallet } from "lucide-react"

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  TradePro
                </h1>
                <p className="text-slate-400 text-sm">Professional Trading Platform</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                <Wallet className="h-4 w-4 mr-2" />
                Portfolio
              </Button>
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Markets
              </Button>
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Analysis
              </Button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search stocks..."
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <Bell className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-green-400 border-green-400 bg-green-400/10">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-white text-sm font-medium">Trader</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
