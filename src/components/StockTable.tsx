import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Share2, TrendingUp, Info, Activity, Shield, TrendingDown } from 'lucide-react';
import { StockRecommendation } from '../types';

interface StockTableProps {
  stocks: StockRecommendation[];
  theme?: string;
}

export default function StockTable({ stocks, theme }: StockTableProps) {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter(item => item !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  return (
    <div className="w-full font-secondary mt-4 text-slate-100 select-none">
      {/* 1. Mobile Card List Layout */}
      <div className="block md:hidden space-y-3.5">
        {stocks.map((stock, index) => {
          const stockId = stock.id || stock.ticker || `stock-${index}`;
          const isExpanded = expandedIds.includes(stockId);
          const isBuy = stock.action === 'BUY';

          return (
            <div 
              key={stockId} 
              className={`rounded-2xl border p-4.5 transition-all duration-300 ${
                theme === 'light'
                  ? 'bg-white border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-slate-800'
                  : 'bg-white/[0.02] border-white/5 shadow-lg text-slate-100 backdrop-blur-[6px]'
              }`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start gap-3 mb-4">
                <div className="flex flex-col min-w-0">
                  <span className={`font-bold text-[14px] font-sans tracking-tight leading-snug ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    {stock.stockName}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-md font-semibold ${
                      theme === 'light' 
                        ? 'bg-slate-100 text-slate-600 border border-slate-200/50' 
                        : 'bg-white/5 text-slate-400 border border-white/5'
                    }`}>
                      {stock.ticker}
                    </span>
                    <span className={`text-[9.5px] font-semibold font-mono px-1.5 py-0.5 rounded ${
                      theme === 'light'
                        ? 'bg-indigo-50 text-[#4f46e5]/90 border border-indigo-100'
                        : 'bg-indigo-950/20 text-[#818cf8] border border-indigo-500/10'
                    }`}>
                      Approved Advice
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {isBuy ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/15">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      BUY
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider bg-rose-500/10 text-rose-600 border border-rose-500/15">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      SHORT
                    </span>
                  )}
                  <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/10">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span className="text-[11px] font-mono font-extrabold text-emerald-500">
                      {stock.targetUpside}
                    </span>
                  </div>
                </div>
              </div>

              {/* Core Metrics Grid */}
              <div className={`grid grid-cols-2 gap-3.5 p-3.5 rounded-xl border ${
                theme === 'light' 
                  ? 'bg-slate-50 border-slate-200/50' 
                  : 'bg-white/[0.015] border-white/[0.03]'
              }`}>
                <div>
                  <span className={`text-[9px] font-mono uppercase block tracking-wider ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Price Range</span>
                  <span className={`text-[12px] font-bold font-mono ${theme === 'light' ? 'text-slate-700' : 'text-indigo-300'}`}>{stock.priceRange}</span>
                </div>
                <div>
                  <span className={`text-[9px] font-mono uppercase block tracking-wider ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Target Price</span>
                  <span className="text-[12px] font-extrabold font-mono text-emerald-400">{stock.targetPrice}</span>
                </div>
                <div>
                  <span className={`text-[9px] font-mono uppercase block tracking-wider ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Stop Loss</span>
                  <span className="text-[12px] font-semibold font-mono text-rose-400">{stock.stopLoss}</span>
                </div>
                <div>
                  <span className={`text-[9px] font-mono uppercase block tracking-wider ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Tenure</span>
                  <span className={`text-[12px] font-semibold font-mono ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>{stock.tenure}</span>
                </div>
              </div>

              {/* Bottom Card Toggle Controls */}
              <div className="mt-4 flex items-center justify-end border-t border-white/5 pt-3">
                <button
                  onClick={() => toggleExpand(stockId)}
                  className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[10px] font-bold tracking-tight transition-all cursor-pointer border ${
                    isExpanded 
                      ? theme === 'light'
                        ? 'bg-slate-200 text-slate-800 border-slate-300'
                        : 'bg-white/10 text-white border-white/10' 
                      : theme === 'light'
                        ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
                        : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 border-white/5'
                  }`}
                >
                  {isExpanded ? 'Less' : 'Analysis Detail'}
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Mobile Expanded indicators block */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 mt-4 pt-4 border-t border-[#fff1]/10">
                      {/* Thesis */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono font-extrabold uppercase text-amber-500 tracking-wider flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-amber-500" />
                          INVESTMENT THESIS
                        </span>
                        <p className={`text-[11.5px] leading-relaxed italic ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                          "{stock.thesis}"
                        </p>
                      </div>

                      {/* Technical */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono font-extrabold uppercase text-[#6bb6f3] tracking-wider flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-[#6bb6f3]" />
                          TECHNICAL INDICATORS
                        </span>
                        <div className={`grid grid-cols-2 gap-y-2.5 gap-x-4 font-mono text-[10.5px] p-3 rounded-xl border ${
                          theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-white/[0.015] border-white/5 text-slate-300'
                        }`}>
                          <div className="flex justify-between">
                            <span className="text-slate-500">RDX Score:</span>
                            <span className={`font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{stock.technical.rdxScore} <span className="text-slate-500 font-normal">/ 5</span></span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span className="text-slate-500">RSI Weekly:</span>
                            <span className={theme === 'light' ? 'text-slate-900' : 'text-emerald-400'}>{stock.technical.rsiWeekly}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">ADX Weekly:</span>
                            <span>{stock.technical.adxWeekly}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">EMA 50/200:</span>
                            <span>{stock.technical.ema50_200}</span>
                          </div>
                          <div className="flex justify-between col-span-2 border-t border-white/5 pt-2.5 mt-0.5">
                            <span className="text-slate-500">3M Return:</span>
                            <span className="text-emerald-500 font-bold">{stock.technical.return3M}</span>
                          </div>
                        </div>
                      </div>

                      {/* Fundamental */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono font-extrabold uppercase text-emerald-400 tracking-wider flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-emerald-400" />
                          FUNDAMENTAL RATIOS
                        </span>
                        <div className={`grid grid-cols-2 gap-y-2.5 gap-x-4 font-mono text-[10.5px] p-3 rounded-xl border ${
                          theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-white/[0.015] border-white/5 text-slate-300'
                        }`}>
                          <div className="flex justify-between">
                            <span className="text-slate-500">PE Ratio:</span>
                            <span>{stock.fundamental.peRatio}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">ROE %:</span>
                            <span>{stock.fundamental.roe}</span>
                          </div>
                          <div className="flex justify-between col-span-2 border-t border-white/5 pt-2.5 mt-0.5">
                            <span className="text-slate-500">Sales Growth 3Y:</span>
                            <span className="text-emerald-400 font-bold">{stock.fundamental.profitGrowth3Y}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 2. Desktop Table Layout with Extreme Polish */}
      <div className={`hidden md:block overflow-hidden rounded-2xl border ${
        theme === 'light'
          ? 'bg-white border-slate-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.02)]'
          : 'bg-white/[0.01] border-white/5 shadow-2xl backdrop-blur-md'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className={`border-b text-[10px] tracking-widest font-extrabold uppercase font-sans ${
                theme === 'light'
                  ? 'bg-slate-50 border-slate-200 text-slate-500'
                  : 'bg-white/[0.025] border-white/10 text-indigo-200/80'
              }`}>
                <th className="py-4.5 px-5 text-center w-14 font-extrabold font-mono opacity-80">#</th>
                <th className="py-4.5 px-5 min-w-[220px] font-extrabold">Company / Symbol</th>
                <th className="py-4.5 px-5 text-center font-extrabold w-32">Call Action</th>
                <th className="py-4.5 px-5 text-center font-extrabold">Trigger Zone</th>
                <th className="py-4.5 px-5 text-center font-extrabold">Target Target</th>
                <th className="py-4.5 px-5 text-center font-extrabold">Protective SL</th>
                <th className="py-4.5 px-5 text-center font-extrabold min-w-[130px]">Target Upside</th>
                <th className="py-4.5 px-5 text-center font-extrabold">Horizon Tenure</th>
                <th className="py-4.5 px-5 text-center w-32 font-extrabold">Details</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-[12.5px] font-secondary ${
              theme === 'light'
                ? 'divide-slate-100 text-slate-700'
                : 'divide-white/5 text-slate-300'
            }`}>
              {stocks.map((stock, index) => {
                const stockId = stock.id || stock.ticker || `stock-${index}`;
                const isExpanded = expandedIds.includes(stockId);
                const isBuy = stock.action === 'BUY';

                return (
                  <React.Fragment key={stockId}>
                    <tr className={`transition-all duration-300 ${
                      theme === 'light'
                        ? `hover:bg-slate-50 ${isExpanded ? 'bg-indigo-50/15' : ''}`
                        : `hover:bg-white/[0.035] ${isExpanded ? 'bg-white/[0.015]' : ''}`
                    }`}>
                      {/* 1. Monospace Index */}
                      <td className={`py-4.5 px-5 text-center font-mono font-semibold ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      
                      {/* 2. Company / Symbol */}
                      <td className="py-4.5 px-5">
                        <div className="flex flex-col">
                          <span className={`font-semibold tracking-tight text-[13.5px] font-sans ${theme === 'light' ? 'text-slate-900 font-bold' : 'text-white'}`}>
                            {stock.stockName}
                          </span>
                          <span className={`text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded border mt-1.5 self-start ${
                            theme === 'light' 
                              ? 'bg-slate-100 border-slate-200/50 text-slate-600' 
                              : 'bg-white/5 border-white/5 text-slate-400'
                          }`}>
                            {stock.ticker}
                          </span>
                        </div>
                      </td>

                      {/* 3. Call Action */}
                      <td className="py-4.5 px-5 text-center">
                        {isBuy ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.08)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            BUY
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_12px_rgba(239,68,68,0.08)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            SHORT
                          </span>
                        )}
                      </td>

                      {/* 4. Trigger Zone */}
                      <td className="py-4.5 px-5 text-center font-mono font-semibold text-[#428fdc] dark:text-[#6bb6f3]">
                        {stock.priceRange}
                      </td>

                      {/* 5. Target Price */}
                      <td className="py-4.5 px-5 text-center font-mono font-bold text-emerald-500">
                        {stock.targetPrice}
                      </td>

                      {/* 6. Protective SL */}
                      <td className="py-4.5 px-5 text-center font-mono font-semibold text-rose-400">
                        {stock.stopLoss}
                      </td>

                      {/* 7. Target Upside */}
                      <td className="py-4.5 px-5 text-center">
                        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-bold font-mono">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{stock.targetUpside}</span>
                        </div>
                      </td>

                      {/* 8. Horizon Tenure */}
                      <td className={`py-4.5 px-5 text-center font-mono font-semibold text-[11px] ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                        {stock.tenure}
                      </td>

                      {/* 9. Details Toggle */}
                      <td className="py-4.5 px-5 text-center">
                        <button
                          onClick={() => toggleExpand(stockId)}
                          className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-[10.5px] font-bold tracking-tight transition-all cursor-pointer border ${
                            isExpanded 
                              ? theme === 'light'
                                ? 'bg-slate-200 text-slate-800 border-slate-300'
                                : 'bg-white/10 text-white border-white/15' 
                              : theme === 'light'
                                ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
                                : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 border-white/5'
                          }`}
                        >
                          <span>{isExpanded ? 'Hide' : 'Analyze'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </td>
                    </tr>

                    {/* 10. Secondary Expanded Analytical Drawer Grid */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <tr>
                          <td colSpan={9} className={`p-0 border-t bg-transparent ${theme === 'light' ? 'border-slate-200' : 'border-white/5'}`}>
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 p-6 font-secondary divide-y md:divide-y-0 md:divide-x ${
                                theme === 'light' ? 'divide-slate-200 bg-slate-50/30' : 'divide-white/5 bg-[#000]/10'
                              }`}>
                                {/* Column A: Technical Indicators */}
                                <div className="space-y-3.5 pb-4 md:pb-0">
                                  <h4 className={`text-[10px] font-extrabold uppercase tracking-widest font-sans border-b pb-2 flex items-center gap-2 ${
                                    theme === 'light' ? 'border-slate-200 text-indigo-700' : 'text-[#6bb6f3] border-white/5'
                                  }`}>
                                    <Activity className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>TECHNICAL MATRIX</span>
                                  </h4>
                                  <div className={`space-y-2 font-mono text-[11px] ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                                    <div className="flex justify-between items-center py-0.5">
                                      <span>RDX Confidence Score</span>
                                      <span className={`font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{stock.technical.rdxScore} <span className="text-slate-500 font-normal">/ 5</span></span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                      <span>RSI Indicator (Weekly)</span>
                                      <span className="text-emerald-400 font-bold">{stock.technical.rsiWeekly}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                      <span>ADX Strength (Weekly)</span>
                                      <span className={theme === 'light' ? 'text-slate-900 font-medium' : 'text-white'}>{stock.technical.adxWeekly}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                      <span>EMA Ribbon Convergence</span>
                                      <span className={theme === 'light' ? 'text-slate-900 font-medium' : 'text-white'}>{stock.technical.ema50_200}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5 border-t border-white/5 pt-2 mt-1">
                                      <span>1 Month Trailing Return</span>
                                      <span className="text-emerald-500 font-bold">{stock.technical.return1M}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                      <span>3 Month Trailing Return</span>
                                      <span className="text-emerald-500 font-bold">{stock.technical.return3M}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                      <span>1 Year Trailing Return</span>
                                      <span className="text-emerald-500 font-extrabold">{stock.technical.return1Y}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                      <span>Volatility index (30D)</span>
                                      <span className="text-rose-400 font-bold">{stock.technical.volatility30D}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Column B: Fundamental ratios */}
                                <div className="space-y-3.5 pt-4 md:pt-0 pb-4 md:pb-0 md:pl-6">
                                  <h4 className={`text-[10px] font-extrabold uppercase tracking-widest font-sans border-b pb-2 flex items-center gap-2 ${
                                    theme === 'light' ? 'border-slate-200 text-emerald-700' : 'border-white/5 text-emerald-400'
                                  }`}>
                                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>FUNDAMENTAL SHIELD</span>
                                  </h4>
                                  <div className={`space-y-2 font-mono text-[11px] ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                                    <div className="flex justify-between items-center py-0.5">
                                      <span>Price-to-Earnings (PE)</span>
                                      <span className={theme === 'light' ? 'text-slate-900 font-medium' : 'text-white'}>{stock.fundamental.peRatio}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                      <span>Price-to-Book (PB)</span>
                                      <span className={theme === 'light' ? 'text-slate-900 font-medium' : 'text-white'}>{stock.fundamental.pbRatio}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                      <span>Return on Equity (ROE %)</span>
                                      <span className={theme === 'light' ? 'text-slate-900 font-medium' : 'text-white'}>{stock.fundamental.roe}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                      <span>Return on Capital (ROCE %)</span>
                                      <span className={theme === 'light' ? 'text-slate-900 font-medium' : 'text-white'}>{stock.fundamental.roce}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                      <span>Debt / Equity ratio</span>
                                      <span className={theme === 'light' ? 'text-slate-900 font-medium' : 'text-white'}>{stock.fundamental.debtEquity}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                      <span>Foreign Institutional (FII)</span>
                                      <span className={theme === 'light' ? 'text-slate-900 font-medium' : 'text-white'}>{stock.fundamental.fiiHolding}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                      <span>Operating profit growth</span>
                                      <span className={theme === 'light' ? 'text-slate-900 font-medium' : 'text-white'}>{stock.fundamental.opm}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5 border-t border-white/5 pt-2 mt-1">
                                      <span>Profit Growth 3Y CAGR</span>
                                      <span className={`font-bold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>{stock.fundamental.profitGrowth3Y}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Column C: Core thesis & Export tools */}
                                <div className="space-y-3.5 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
                                  <div className="space-y-2.5">
                                    <h4 className={`text-[10px] font-extrabold uppercase tracking-widest font-sans border-b pb-2 flex items-center gap-2 ${
                                      theme === 'light' ? 'border-slate-200 text-amber-700' : 'border-white/5 text-amber-500'
                                    }`}>
                                      <Info className="w-3.5 h-3.5 text-amber-500" />
                                      <span>INVESTMENT THESIS</span>
                                    </h4>
                                    <div className={`text-[12px] leading-relaxed font-secondary font-normal italic select-text p-3 rounded-lg ${
                                      theme === 'light' ? 'text-slate-700 bg-slate-100/40 border border-slate-200/50' : 'text-slate-300 bg-white/[0.015] border border-white/5'
                                    }`}>
                                      "{stock.thesis}"
                                    </div>
                                  </div>

                                  <div className={`pt-4 border-t mt-auto flex items-center justify-between ${
                                    theme === 'light' ? 'border-slate-200' : 'border-white/5'
                                  }`}>
                                    <span className={`text-[9px] font-bold tracking-widest font-mono uppercase px-2 py-1 rounded flex items-center gap-1.5 border ${
                                      theme === 'light'
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                        : 'bg-indigo-950/20 border border-indigo-505/10 text-[#818cf8]'
                                    }`}>
                                      <Info className="w-3 h-3 text-indigo-400" /> Advisory Signed
                                    </span>
                                    <button 
                                      className={`flex items-center gap-1 text-[11px] font-medium transition cursor-pointer ${
                                        theme === 'light' ? 'text-[#333] hover:text-indigo-600' : 'text-slate-400 hover:text-white'
                                      }`}
                                      onClick={() => console.log(`Recommendation metadata exported for ticker ${stock.ticker}`)}
                                    >
                                      <Share2 className="w-3 h-3 text-indigo-400" /> Export recommendation
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
