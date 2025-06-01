# TradePro - Professional Trading Platform

![TradePro Dashboard](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eG51FyYyoZENFYwwxki9yROizn33Dr.png)

A modern, professional trading platform built with Next.js featuring advanced candlestick charting, interactive trendline drawing, and comprehensive portfolio management tools.

## 🚀 Features

### 📊 Advanced Charting System
- **Custom Canvas-Based Candlestick Charts**: High-performance rendering using HTML5 Canvas API
- **Interactive Trendline Drawing**: Two-click trendline creation with professional visual feedback
- **Multiple Timeframe Support**: 1D, 1W, 1M, 3M, 6M, 1Y chart intervals
- **Real-time Data Visualization**: Dynamic price movements with green/red candlestick coloring
- **Responsive Grid System**: Professional grid lines and axis labeling

### 🎯 Trendline Functionality
- **Two-Click Drawing**: Click start point → Click end point to create trendlines
- **Drag & Drop Interaction**: 
  - Drag entire trendlines by clicking the line
  - Drag individual endpoints for precise adjustments
  - Visual feedback with different cursor states (grab/move)
- **Coordinate Logging**: 
  - Double-click any trendline to display detailed coordinates
  - Automatic logging on creation, modification, and deletion
  - Rich notifications with timestamps, prices, and trend analysis
- **Multiple Trendlines**: Support for unlimited simultaneous trendlines
- **Smart Delete System**: Hover-activated delete buttons with confirmation
- **Persistent Storage**: Automatic save/restore using localStorage with error handling

### 💼 Portfolio Management
- **Real-time Portfolio Overview**: Total value, daily P&L, active positions, available cash
- **Performance Tracking**: Comprehensive profit/loss calculations with percentage changes
- **Position Management**: Active position monitoring and quick stats display

### 📈 Trading Interface
- **Buy/Sell Panel**: Professional order entry with quantity and price controls
- **Order Types**: Support for Delivery, MTE, and Intraday trading
- **Market Data**: Real-time stock prices with exchange information
- **Order Validation**: Built-in validation and exchange watch notifications

### 🌐 Market Overview
- **Multi-Market Tracking**: S&P 500, NASDAQ, DOW JONES, VIX monitoring
- **Real-time Updates**: Live market data with percentage changes
- **Professional Styling**: Color-coded gains/losses with trend indicators

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15.2.4**: React framework with App Router for optimal performance
- **React 19**: Latest React with concurrent features and improved performance
- **TypeScript 5**: Full type safety and enhanced developer experience

### UI/UX Libraries
- **Tailwind CSS 3.4.17**: Utility-first CSS framework for rapid styling
- **Radix UI**: Comprehensive component library for accessible UI elements
  - Dialog, Dropdown, Popover, Tooltip, and 15+ other components
- **Lucide React**: Modern icon library with 1000+ SVG icons
- **Class Variance Authority**: Type-safe component variants
- **Tailwind Merge**: Intelligent Tailwind class merging

### Chart & Visualization
- **Custom Canvas Implementation**: High-performance charting without external dependencies
- **HTML5 Canvas API**: Direct rendering for optimal performance
- **Real-time Coordinate System**: Precise mouse interaction and coordinate conversion
- **Recharts**: Recharts is a composable charting library built with React and D3, designed for creating responsive and customizable data visualizations.

### Data Management
- **React Hooks**: useState, useEffect, useCallback for state management
- **LocalStorage Integration**: Persistent data storage with error handling
- **Type-safe Data Models**: Comprehensive TypeScript interfaces

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (or yarn/pnpm equivalent)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd my-v0-project
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

\`\`\`bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint for code quality
\`\`\`

## 🎮 How to Use

### Drawing Trendlines
1. **Enable Drawing Mode**: Click "Drawing OFF" to toggle to "Drawing ON"
2. **Create Trendline**: Click two points on the chart (start → end)
3. **View Coordinates**: Automatic notification displays with timestamps and prices

### Interacting with Trendlines
1. **Select**: Click any trendline to select it
2. **Drag**: Click and drag trendlines or their endpoints to move them
3. **View Details**: Double-click any trendline to see detailed coordinates
4. **Delete**: Hover over a trendline and click the red trash icon

### Trading Operations
1. **Select Stock**: Choose from available stocks (AMD shown as example)
2. **Set Parameters**: Adjust quantity, price, and order type
3. **Place Order**: Click BUY or SELL button
4. **Monitor**: Track positions in the Quick Stats panel

## 🏗️ Architecture & Design Decisions

### Canvas-Based Charting
- **Performance**: Direct Canvas rendering for smooth 60fps interactions
- **Flexibility**: Custom implementation allows for precise trendline functionality
- **Scalability**: Handles large datasets without performance degradation

### State Management
- **React Hooks**: Leverages built-in React state management for simplicity
- **Local Storage**: Persistent trendline storage with data validation
- **Type Safety**: Comprehensive TypeScript interfaces prevent runtime errors

### Component Architecture
- **Modular Design**: Each feature is a separate, reusable component
- **Props Interface**: Clear data flow with well-defined prop interfaces
- **Event Handling**: Centralized event management for chart interactions

### Responsive Design
- **Mobile-First**: Tailwind CSS ensures mobile compatibility
- **Flexible Layouts**: CSS Grid and Flexbox for adaptive layouts
- **Touch Support**: Canvas events work on both desktop and mobile

## 🎨 Styling & Theming

### Design System
- **Color Palette**: Professional dark theme with blue/purple gradients
- **Typography**: System fonts with monospace for financial data
- **Spacing**: Consistent 4px grid system via Tailwind
- **Animations**: Smooth transitions and hover effects

### Responsive Breakpoints
- **Mobile**: < 768px - Stacked layout
- **Tablet**: 768px - 1024px - Adjusted grid
- **Desktop**: > 1024px - Full feature layout

## 🔒 Data Persistence

### LocalStorage Implementation
- **Automatic Saving**: Trendlines saved on every change
- **Error Handling**: Graceful fallback for storage failures
- **Data Validation**: Ensures data integrity on load
- **Migration Support**: Handles data structure changes

## 📝 Development Notes

### Assumptions Made
1. **Mock Data**: Using generated candlestick data for demonstration
2. **Single Asset**: Currently focused on one stock (AMD) for simplicity
3. **Browser Support**: Modern browsers with Canvas API support
4. **Local Storage**: Client-side persistence sufficient for demo purposes

### Design Decisions
1. **Canvas over SVG**: Chosen for better performance with complex interactions
2. **No External Chart Library**: Custom implementation for maximum control
3. **TypeScript**: Ensures type safety and better developer experience
4. **Modular Architecture**: Easy to extend and maintain

### Code Standards
- **TypeScript**: All new code must be typed
- **ESLint**: Follow the established linting rules
- **Component Structure**: Follow the existing patterns
- **Documentation**: Update README for new features
