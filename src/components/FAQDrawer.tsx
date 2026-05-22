import React from 'react';
import { HelpCircle, ArrowUpRight, TrendingDown, Clock, Search, BookOpen, AlertCircle } from 'lucide-react';

interface FAQDrawerProps {
  onQuestionClick: (question: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  theme?: 'dark' | 'light';
}

export default function FAQDrawer({ onQuestionClick, isOpen, onToggle, theme = 'dark' }: FAQDrawerProps) {
  const FAQ_SECTIONS = [
    {
      title: 'STOCKS TO BUY',
      icon: <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />,
      questions: [
        'Give me list of stocks I can buy',
        'Give me list of stocks that can give 10% returns in 30 days',
        'Give me 3 stocks in IT sector I can buy today',
        'Show me Pharma stocks currently in the BUY zone',
        'Which Capital Goods stocks are in the BUY zone right now?',
        'Give me 2 Chemicals stocks to buy this week',
        'Show me FMCG stocks in the BUY zone',
        'Which Metals stocks can I buy right now?',
        'Give me a diversified portfolio of 10 stocks for 1 year',
        'Give me 5 Small Cap stocks with high growth potential'
      ]
    },
    {
      title: 'SHORT SELLING',
      icon: <TrendingDown className="w-3.5 h-3.5 text-rose-400" />,
      questions: [
        'Give me 1 stock that I can short',
        'Which stocks can I short right now?',
        'Give me a bearish call in the Power sector',
        'Show me 2 short selling opportunities in Finance',
        'Give me a short trade in the FMCG sector'
      ]
    },
    {
      title: 'LONG-TERM PICKS',
      icon: <Clock className="w-3.5 h-3.5 text-[#3b82f6]" />,
      questions: [
        'Show me the multibagger portfolio picks',
        'What are your long-term wealth creation stock picks?',
        'Give me stocks that can give 3x returns in 3 years'
      ]
    },
    {
      title: 'TRACK RECORD',
      icon: <Search className="w-3.5 h-3.5 text-purple-400" />,
      questions: [
        'What is your overall track record?',
        'How many of your past recommendations were profitable?',
        'Show me your best performing stock recommendations',
        'What is your win rate on closed calls?',
        'Show me recent closed trades and their returns'
      ]
    },
    {
      title: 'ABOUT WAYA',
      icon: <BookOpen className="w-3.5 h-3.5 text-indigo-400" />,
      questions: [
        'What is a BUY zone and how does it work?',
        'What is a short trade and how do I execute it?',
        'What is the Multibagger Portfolio?',
        'What are Stocks Under Radar?',
        'How many open calls do you have right now?',
        'How much should I invest in each recommendation?',
        'Can I use my own broker account to execute trades?',
        'How do I contact Waya support?'
      ]
    }
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      id="right-faq-panel" 
      className={`w-80 fixed md:relative right-0 top-0 bottom-0 z-45 flex flex-col h-full select-none transition-all duration-300 ${
        theme === 'light'
          ? 'bg-[#F2F2F7] md:bg-transparent text-slate-800'
          : 'text-slate-100'
      } liquid-glass-panel border-l border-white/5 md:border-white/10`}
      style={{
        backgroundColor: theme === 'light' ? undefined : '#1c1c1e'
      }}
    >
      {/* Header */}
      <div className={`p-4 flex items-center justify-between border-b ${theme === 'light' ? 'border-slate-200' : 'border-white/5'}`}>
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span className={`font-bold text-xs tracking-wider uppercase font-sans ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
            FREQUENTLY ASKED
          </span>
        </div>
        <button
          onClick={onToggle}
          className={`${theme === 'light' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-white/10'} p-1 rounded transition`}
        >
          <XButton />
        </button>
      </div>

      <div className={`p-3 text-[10px] flex items-center gap-2 border-b ${
        theme === 'light' 
          ? 'bg-indigo-50/50 border-slate-200 text-slate-600' 
          : 'bg-white/[0.02] border-white/5 text-slate-400'
      }`}>
        <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
        <span>Tap any query below to run instant SEBI-guided advisory analysis</span>
      </div>

      {/* Accordions scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 font-secondary max-h-[calc(100vh-140px)] select-text">
        {FAQ_SECTIONS.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center gap-1.5 px-1">
              {section.icon}
              <span className={`text-[10px] font-bold tracking-wider uppercase ${theme === 'light' ? 'text-slate-600 font-semibold' : 'text-slate-400'}`}>
                {section.title}
              </span>
            </div>
            
            <div className="space-y-1.5 pl-1">
              {section.questions.map((question, qIdx) => (
                <button
                  key={qIdx}
                  onClick={() => onQuestionClick(question)}
                  className={`w-full text-left rounded-xl px-3.5 py-2.5 text-xs font-secondary transition-all duration-150 shadow-sm cursor-pointer block truncate border ${
                    theme === 'light'
                      ? 'bg-white hover:bg-indigo-50/40 text-slate-700 border-slate-200 hover:border-slate-300'
                      : 'bg-white/[0.015] hover:bg-white/[0.05] hover:text-white border-white/5 hover:border-white/12 text-slate-300'
                  }`}
                  title={question}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function XButton() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
