import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Brain, Compass, PanelLeft, HelpCircle, User, Loader2, Sparkles, 
  RefreshCcw, AlertTriangle, Shield, CheckCircle, TrendingUp, Info,
  ArrowUp, Plus, ChevronDown, Clock, Search, BookOpen, ArrowUpRight, TrendingDown,
  Sun, Moon, Paperclip, ChevronLeft, ChevronRight, X, PenTool
} from 'lucide-react';

import Onboarding from './components/Onboarding';
import Splash from './components/Splash';
import Sidebar from './components/Sidebar';
import FAQDrawer from './components/FAQDrawer';
import StockTable from './components/StockTable';
import { ChatHistory, ChatMessage, UserProfile, SurveyQuestion } from './types';

const DROPDOWN_QUESTIONS = {
  buy: [
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
  ],
  short: [
    'Give me 1 stock that I can short',
    'Which stocks can I short right now?',
    'Give me a bearish call in the Power sector',
    'Show me 2 short selling opportunities in Finance',
    'Give me a short trade in the FMCG sector'
  ],
  long: [
    'Show me the multibagger portfolio picks',
    'What are your long-term wealth creation stock picks?',
    'Give me stocks that can give 3x returns in 3 years'
  ],
  track: [
    'What is your overall track record?',
    'How many of your past recommendations were profitable?',
    'Show me your best performing stock recommendations',
    'What is your win rate on closed calls?',
    'Show me recent closed trades and their returns'
  ],
  about: [
    'What is a BUY zone and how does it work?',
    'What is a short trade and how do I execute it?',
    'What is the Multibagger Portfolio?',
    'What are Stocks Under Radar?',
    'How many open calls do you have right now?',
    'How much should I invest in each recommendation?',
    'Can I use my own broker account to execute trades?',
    'How do I contact Waya support?'
  ]
};

// Default welcome messaging and layout configuration
export default function App() {
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState('dark');
    localStorage.setItem('wayax-theme', 'dark');
  };

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  
  // UI Panels Toggles
  const [isFaqOpen, setIsFaqOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(true);
  const [isQuestionsOpen, setIsQuestionsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'buy' | 'short' | 'long' | 'track' | 'about'>('buy');
  const [showAllQuestions, setShowAllQuestions] = useState<boolean>(true);
  
  const getMobilePaddingBottom = () => {
    if (!isDropdownOpen) return 'pb-[90px]';
    if (isQuestionsOpen) return 'pb-[320px]';
    return 'pb-[180px]';
  };
  
  const [showSplash, setShowSplash] = useState<boolean>(true);
  
  // Typewriting animated placeholder logic for empty chat search input
  const [typedPlaceholder, setTypedPlaceholder] = useState<string>('');
  
  useEffect(() => {
    const questions = [
      'Give me stocks currently in the BUY zone?',
      'Which stocks can I short sell right now?',
      'Show me long-term multibagger stock picks?'
    ];
    
    let currentQuestionIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let timer: any;

    const tick = () => {
      const fullText = questions[currentQuestionIndex];
      
      if (!isDeleting) {
        currentText = fullText.substring(0, currentText.length + 1);
        setTypedPlaceholder(currentText);

        if (currentText === fullText) {
          isDeleting = true;
          timer = setTimeout(tick, 1500); // Wait 1.5s on complete question
          return;
        }
        timer = setTimeout(tick, 25); // Faster typing speed
      } else {
        currentText = fullText.substring(0, currentText.length - 1);
        setTypedPlaceholder(currentText);

        if (currentText === '') {
          isDeleting = false;
          currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
          timer = setTimeout(tick, 300); // Shorter pause before next question
          return;
        }
        timer = setTimeout(tick, 10); // Faster erasing speed
      }
    };

    timer = setTimeout(tick, 200);
    return () => clearTimeout(timer);
  }, []);
  
  // Active chat inline survey state
  const [activeSurvey, setActiveSurvey] = useState<SurveyQuestion | null>(null);
  const [surveyResponseProgress, setSurveyResponseProgress] = useState<{ horizon?: string; risk?: string }>({});
  const [surveyCustomText, setSurveyCustomText] = useState<string>('');
  const [tempSelectedOption, setTempSelectedOption] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  // Load state from local storage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('wayax-profile');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        localStorage.removeItem('wayax-profile');
      }
    }

    const savedChats = localStorage.getItem('wayax-chats');
    if (savedChats) {
      try {
        const chats = JSON.parse(savedChats);
        setChatHistories(chats);
        if (chats.length > 0) {
          setActiveChatId(chats[0].id);
        }
      } catch (e) {
        localStorage.removeItem('wayax-chats');
      }
    }

    // Determine initial sidebar open status responsively
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, []);

  // Sync state mutations back to local storage
  const saveProfileToLocalStorage = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('wayax-profile', JSON.stringify(profile));
  };

  const saveChatsToLocalStorage = (chats: ChatHistory[]) => {
    setChatHistories(chats);
    localStorage.setItem('wayax-chats', JSON.stringify(chats));
  };

  const handleSignOut = () => {
    localStorage.removeItem('wayax-profile');
    localStorage.removeItem('wayax-chats');
    setUserProfile(null);
    setChatHistories([]);
    setActiveChatId('');
  };

  // Safe scrolling helpers
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeChat = chatHistories.find(c => c.id === activeChatId);

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isLoading, activeSurvey]);

  // Actions
  const handleOnboardingComplete = (profile: UserProfile) => {
    saveProfileToLocalStorage(profile);
    
    // Create first advisory chat
    const firstChat: ChatHistory = {
      id: 'default-sec-' + Date.now(),
      title: 'Initial Advisory Consult',
      messages: [],
      timestamp: new Date().toLocaleTimeString()
    };
    saveChatsToLocalStorage([firstChat]);
    setActiveChatId(firstChat.id);
  };

  const handleCreateNewChat = () => {
    const newChat: ChatHistory = {
      id: 'chat-' + Date.now(),
      title: `Advisory Session #${chatHistories.length + 1}`,
      messages: [],
      timestamp: new Date().toLocaleTimeString()
    };
    const updated = [newChat, ...chatHistories];
    saveChatsToLocalStorage(updated);
    setActiveChatId(newChat.id);
    setActiveSurvey(null);
    setSurveyResponseProgress({});
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setActiveSurvey(null);
    setSurveyResponseProgress({});
  };

  const handleRenameChat = (id: string, newTitle: string) => {
    const updated = chatHistories.map(chat => {
      if (chat.id === id) {
        return { ...chat, title: newTitle };
      }
      return chat;
    });
    saveChatsToLocalStorage(updated);
  };

  const handleDeleteChat = (id: string) => {
    const remaining = chatHistories.filter(chat => chat.id !== id);
    saveChatsToLocalStorage(remaining);
    if (activeChatId === id && remaining.length > 0) {
      setActiveChatId(remaining[0].id);
    } else if (remaining.length === 0) {
      // Create empty fallback
      const freshChat: ChatHistory = {
        id: 'fallback-' + Date.now(),
        title: 'New Advisory Chat',
        messages: [],
        timestamp: new Date().toLocaleTimeString()
      };
      saveChatsToLocalStorage([freshChat]);
      setActiveChatId(freshChat.id);
    }
  };

  // Submit chat query to Express + Gemini Backend
  const submitQuery = async (queryText: string) => {
    if (!queryText.trim() || !activeChatId || !userProfile) return;

    const normalizedQuery = queryText.toLowerCase();
    const isStockQuery = normalizedQuery.includes('stock') || normalizedQuery.includes('buy');

    // Intercept and launch beautiful questionnaire flow when stock query is triggered
    if (isStockQuery && !surveyResponseProgress.horizon) {
      setInputValue('');
      setIsLoading(false);

      const userMsg: ChatMessage = {
        id: 'msg-user-' + Date.now(),
        sender: 'user',
        text: queryText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const assistantSurveyMsg: ChatMessage = {
        id: 'msg-ai-survey-1-' + Date.now(),
        sender: 'assistant',
        text: 'Before I dive in — how long are you thinking of staying invested? Whether it\'s a quick trade or the long game, this shapes everything I suggest for you.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSurvey: true,
        surveyQuestion: {
          id: 'horizon',
          text: 'Before I dive in — how long are you thinking of staying invested? Whether it\'s a quick trade or the long game, this shapes everything I suggest for you.',
          options: [
            'Short Term — quick wins, under 3 months',
            'Medium Term — steady growth, 3 to 12 months',
            'Long Term — wealth building, 1 year and beyond'
          ]
        }
      };

      const updatedMessages = [...(activeChat?.messages || []), userMsg, assistantSurveyMsg];
      const currentHistories = chatHistories.map(chat => {
        if (chat.id === activeChatId) {
          const title = chat.messages.length === 0 ? (queryText.length > 25 ? queryText.slice(0, 25) + '...' : queryText) : chat.title;
          return { ...chat, title, messages: updatedMessages };
        }
        return chat;
      });

      saveChatsToLocalStorage(currentHistories);
      return;
    }

    // Build the user message
    const userMsg: ChatMessage = {
      id: 'msg-user-' + Date.now(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Append to current chat
    const updatedMessages = [...(activeChat?.messages || []), userMsg];
    const currentHistories = chatHistories.map(chat => {
      if (chat.id === activeChatId) {
        // Automatically rename first session from default if empty
        const title = chat.messages.length === 0 ? (queryText.length > 25 ? queryText.slice(0, 25) + '...' : queryText) : chat.title;
        return { ...chat, title, messages: updatedMessages };
      }
      return chat;
    });

    saveChatsToLocalStorage(currentHistories);
    setInputValue('');
    setIsLoading(true);
    setErrorText(null);

    const startTime = performance.now();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          userProfile
        }),
      });

      if (!response.ok) {
        throw new Error('Express API or model proxy returned an error state');
      }

      const data = await response.json();
      const endTime = performance.now();
      const calculatedDurationMs = Math.round(endTime - startTime) + 300; // Adding minor network latency padding

      const assistantMsg: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'assistant',
        text: data.answer || "I could not resolve details for this sector. Please select another stock or sector advice category.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stocks: data.stocks || undefined,
        latency: `${calculatedDurationMs} ms`
      };

      const updatedWithAI = [...updatedMessages, assistantMsg];

      const finalizedHistories = chatHistories.map(chat => {
        if (chat.id === activeChatId) {
          return { ...chat, messages: updatedWithAI };
        }
        return chat;
      });

      saveChatsToLocalStorage(finalizedHistories);
    } catch (err: any) {
      console.error(err);
      setErrorText('Advisory connection error. Please verify the backend running state.');
      
      // Fallback message indicating error
      const assistantFallbackMsg: ChatMessage = {
        id: 'msg-ai-err-' + Date.now(),
        sender: 'assistant',
        text: `### ⚠️ Connection Diagnostic Notice

We experienced a brief handshake interruption with WayaX AI node. Please ensure API settings are correct.

**Current Active Profile Settings saved in Advisory Memory:**
- Investor Client Name: **${userProfile.name}**
- Risk Horizon Class: **${userProfile.riskTolerance}**
- Suggested Holding Tenure: **${userProfile.investmentHorizon}**

Click any standard preset queries on the right panel to test predefined cached analyses instantly!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalHistoriesWithError = chatHistories.map(chat => {
        if (chat.id === activeChatId) {
          return { ...chat, messages: [...updatedMessages, assistantFallbackMsg] };
        }
        return chat;
      });
      saveChatsToLocalStorage(finalHistoriesWithError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    submitQuery(inputValue);
  };

  // FAQ preset selection
  const handleFaqClick = (question: string) => {
    setInputValue('');
    submitQuery(question);
  };

  // Survey Option Clicked Handler (Screen 1 & 2 Conversational flow simulation)
  const handleSurveyOptionClick = (questionId: 'horizon' | 'risk', option: string) => {
    if (!activeChat) return;

    // 1. Post user response message
    const userResponseMsg: ChatMessage = {
      id: 'msg-user-ans-' + Date.now(),
      sender: 'user',
      text: option,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const currentMessages = [...activeChat.messages, userResponseMsg];

    if (questionId === 'horizon') {
      // Move to Risk Survey Question (Survey 2)
      const secSurveyMsg: ChatMessage = {
        id: 'msg-ai-survey-2-' + Date.now(),
        sender: 'assistant',
        text: 'Love it! One more thing — how comfortable are you with risk? There\'s no wrong answer here, just different flavours of investing.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSurvey: true,
        surveyQuestion: {
          id: 'risk',
          text: 'Love it! One more thing — how comfortable are you with risk? There\'s no wrong answer here, just different flavours of investing.',
          options: [
            'Large Cap — stable giants, lower risk',
            'Mid Cap — balanced risk and solid growth',
            'Small Cap — high growth, fasten your seatbelt!',
            'Mix it all — show me the best across the board'
          ]
        }
      };

      setSurveyResponseProgress({ ...surveyResponseProgress, horizon: option });
      setTempSelectedOption(null);
      
      const revisedHistories = chatHistories.map(chat => {
        if (chat.id === activeChatId) {
          return { ...chat, messages: [...currentMessages, secSurveyMsg] };
        }
        return chat;
      });
      saveChatsToLocalStorage(revisedHistories);
    } else {
      // Completed surveys, now query list of stocks immediately!
      setSurveyResponseProgress({ ...surveyResponseProgress, risk: option });
      setTempSelectedOption(null);
      setIsLoading(true);
      
      // Update state
      const revisedHistories = chatHistories.map(chat => {
        if (chat.id === activeChatId) {
          return { ...chat, messages: currentMessages };
        }
        return chat;
      });
      saveChatsToLocalStorage(revisedHistories);

      // Now query standard buy list since surveys are finalized
      setTimeout(() => {
        submitQuery('Give me list of stocks I can buy');
      }, 500);
    }
  };

  const handleSurveyGoBack = () => {
    if (!activeChat || activeChat.messages.length < 4) return;
    // Remove Step 2 survey card and User option answer text
    const revisedMessages = activeChat.messages.slice(0, activeChat.messages.length - 2);
    const revisedHistories = chatHistories.map(chat => {
      if (chat.id === activeChatId) {
        return { ...chat, messages: revisedMessages };
      }
      return chat;
    });
    const updatedProgress = { ...surveyResponseProgress };
    delete updatedProgress.horizon;
    setSurveyResponseProgress(updatedProgress);
    setTempSelectedOption(null);
    saveChatsToLocalStorage(revisedHistories);
  };

  const handleSurveySkip = () => {
    if (!activeChat) return;
    const latestMsg = activeChat.messages[activeChat.messages.length - 1];
    setTempSelectedOption(null);
    if (latestMsg && latestMsg.isSurvey && latestMsg.surveyQuestion) {
      if (latestMsg.surveyQuestion.id === 'horizon') {
        handleSurveyOptionClick('horizon', 'No specific preference');
      } else {
        handleSurveyOptionClick('risk', 'No specific preference');
      }
    }
  };

  const renderUnifiedSearchBar = (isCompact: boolean) => {
    return (
      <motion.div
        layoutId="unified-search-card"
        className="w-full max-w-5xl relative group/search mx-auto pointer-events-auto"
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      >
        {/* Animated Gradient Glow (Outside only via mask) */}
        <div className={`absolute -inset-[3px] ${isCompact ? 'rounded-[23px]' : 'rounded-[19px] md:rounded-[27px]'} pointer-events-none z-0 mask-gradient-glow p-[3px] animate-outline-breathing group-focus-within/search:opacity-100 transition-opacity duration-500`}>
           <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{ background: 'linear-gradient(-133.167deg, #C172F1 28%, #EDB168 81%)' }}
          />
        </div>
        
        {/* Unified Search Card styling using Liquid Glass System */}
        <div 
          className={`relative w-full z-10 transition-all duration-300 ${
            isCompact 
              ? 'liquid-glass-panel rounded-[20px] border border-white/5 shadow-lg p-2 pl-4 pr-2 hover:border-white/10' 
              : 'liquid-glass-panel rounded-2xl md:rounded-[24px] border border-white/10 shadow-[0_12px_45px_rgba(0,0,0,0.5)] p-3.5 md:p-5 hover:border-white/20 hover:shadow-[0_16px_50px_rgba(0,0,0,0.6)] focus-within:shadow-[0_0_80px_rgba(193,114,241,0.15)] focus-within:border-white/30 focus-within:bg-[#1a1b26]/60 backdrop-blur-3xl'
          }`}
          style={!isCompact ? {
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 12px 45px rgba(0, 0, 0, 0.5)'
          } : {}}
        >
          {isCompact ? (
            <div className="flex items-center gap-3 w-full pr-1 py-0.5">
              <Paperclip className="w-4 h-4 text-slate-400 hover:text-white transition-colors flex-shrink-0 cursor-pointer pl-0.5" />
              <input
                ref={textareaRef as React.RefObject<HTMLInputElement>}
                type="text"
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (inputValue.trim()) {
                      submitQuery(inputValue);
                    }
                  }
                }}
                placeholder={window.innerWidth < 768 ? "Ask WayaX..." : "Ask WayaX about stocks, entry zones, F&O, portfolio analysis, track record..."}
                className="flex-1 bg-transparent focus:outline-none text-[12px] font-sans font-semibold h-8 text-slate-100 placeholder-slate-500 min-w-0"
              />
              
              {/* Horizontal send arrow aligned right on the same row */}
              <button
                type="button"
                onClick={() => {
                  if (inputValue.trim()) {
                    submitQuery(inputValue);
                  }
                }}
                disabled={!inputValue.trim()}
                className="w-8 h-8 rounded-xl active:scale-95 flex items-center justify-center transition-all cursor-pointer flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/30 shadow-[0_0_12px_rgba(99,102,241,0.4)] disabled:opacity-20 disabled:scale-100 disabled:bg-[#151c2f] disabled:border-transparent disabled:text-slate-500"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-1.5 mb-2 select-none">
                <span className="text-[10px] uppercase tracking-wider font-extrabold font-mono text-indigo-300">
                  Ask WayaX
                </span>
                <div className="w-12 h-px bg-gradient-to-r from-indigo-500/50 to-transparent" />
              </div>

              <textarea
                ref={textareaRef as React.RefObject<HTMLTextAreaElement>}
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (inputValue.trim()) {
                      submitQuery(inputValue);
                    }
                  }
                }}
                placeholder={typedPlaceholder || "Ask WayaX..."}
                className="w-full bg-transparent resize-none focus:outline-none text-[13px] font-sans h-10 md:h-20 pt-1 text-slate-100 placeholder-slate-500 leading-relaxed custom-scroll"
              />

              {/* Bottom line control options strictly mirroring user sketch buttons */}
              <div className="flex justify-between items-center mt-2.5 pt-2.5 md:mt-3 md:pt-3 border-t border-white/10 select-none">
                {/* Bottom Left controls */}
                <div className="flex items-center">
                  <div className="relative group/plus">
                    <button
                      type="button"
                      onClick={() => {
                        setInputValue("Give me 3 stocks in IT sector I can buy today");
                      }}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition cursor-pointer bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-slate-300 hover:text-white shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover/plus:block border text-[10px] px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl z-10 font-sans pointer-events-none liquid-glass-panel text-indigo-200 border-white/15">
                      Load tech sector query preview
                    </div>
                  </div>
                </div>

                {/* Bottom Center control - aligned in the absolute center */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border text-[10px] md:text-[11px] font-bold select-none cursor-pointer flex items-center gap-1 md:gap-1.5 transition-all duration-200 ${
                    isDropdownOpen
                      ? 'bg-white/15 text-white border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.08)]'
                      : 'bg-white/[0.03] text-slate-300 border-white/10 hover:text-white hover:bg-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <HelpCircle className="w-3 h-3 md:w-3.5 md:h-3.5 text-indigo-400" />
                  <span>{isDropdownOpen ? 'Hide Presets' : 'Show Presets'}</span>
                  <ChevronDown className={`w-3 h-3 md:w-3.5 md:h-3.5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Bottom Right Arrow Up Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (inputValue.trim()) {
                      submitQuery(inputValue);
                    }
                  }}
                  disabled={!inputValue.trim()}
                  className="w-7.5 h-7.5 md:w-9 md:h-9 rounded-full relative group active:scale-95 flex items-center justify-center transition-all cursor-pointer shadow-lg bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/50 disabled:opacity-30 disabled:scale-100 disabled:bg-white/5 disabled:border-white/10 disabled:text-slate-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-disabled:hidden" />
                  <ArrowUp className="w-3.5 h-3.5 md:w-4 md:h-4 stroke-[2.5] relative z-10" />
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    );
  };

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  // If user profile does not exist, go to onboarding directly
  if (!userProfile) {
    return <Onboarding onComplete={handleOnboardingComplete} theme={theme} setTheme={setTheme} />;
  }

  const messages = activeChat?.messages || [];
  const isEmptyChat = messages.length === 0;

  return (
    <div className={`flex h-screen font-secondary overflow-hidden relative transition-colors duration-300 ${
      theme === 'light' 
        ? 'bg-[#F2F2F7] text-slate-850' 
        : 'bg-gradient-to-b from-[#1C1C1E] to-[#000000] text-[#e2e8f0]'
    }`}>
      
      {/* Liquid Glass Screen Background (Shining from behind panels) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {/* Dynamic Illicit Purple (#C172F1) Orb - Upper Right */}
        <div className={`absolute top-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full pointer-events-none filter blur-[120px] animate-soft-glow ${
          theme === 'light'
            ? 'bg-[radial-gradient(circle_at_center,rgba(193,114,241,0.12)_0%,rgba(193,114,241,0.04)_50%,transparent_100%)]'
            : 'bg-[radial-gradient(circle_at_center,rgba(193,114,241,0.20)_0%,rgba(193,114,241,0.05)_50%,transparent_100%)]'
        }`} />

        {/* Dynamic Salted Caramel (#EDB168) Orb - Bottom Left */}
        <div className={`absolute bottom-[-15%] left-[-15%] w-[80%] h-[80%] rounded-full pointer-events-none filter blur-[140px] animate-glow-wave ${
          theme === 'light'
            ? 'bg-[radial-gradient(circle_at_center,rgba(237,177,104,0.10)_0%,rgba(237,177,104,0.02)_55%,transparent_100%)]'
            : 'bg-[radial-gradient(circle_at_center,rgba(237,177,104,0.22)_0%,rgba(237,177,104,0.04)_55%,transparent_100%)]'
        }`} />

        {/* Dynamic White (#FFFFFF) Orb - Upper Left Center */}
        <div className={`absolute top-[-20%] left-[20%] w-[65%] h-[65%] rounded-full pointer-events-none filter blur-[110px] animate-soft-glow ${
          theme === 'light'
            ? 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.05)_45%,transparent_100%)]'
            : 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.02)_45%,transparent_100%)]'
        }`} />

        {/* Dynamic Caustic Rays using only the chosen palette */}
        {/* Salted Caramel Ray */}
        <div className="absolute top-0 left-[25%] w-[3px] h-[180%] bg-gradient-to-b from-white/0 via-[#EDB168]/18 to-white/0 transform -rotate-[22deg] blur-[4px] animate-caustic-right opacity-35" />
        
        {/* Illicit Purple Ray */}
        <div className="absolute top-0 left-[55%] w-[2px] h-[180%] bg-gradient-to-b from-white/0 via-[#C172F1]/15 to-white/0 transform -rotate-[22deg] blur-[3.5px] animate-caustic-left opacity-30" />
        
        {/* White Ray */}
        <div className="absolute top-0 left-[80%] w-[4px] h-[180%] bg-gradient-to-b from-white/0 via-white/12 to-white/0 transform -rotate-[22deg] blur-[5px] animate-caustic-right opacity-25" />

        {/* Water shimmer effect overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(255,255,255,0.015)_0%,transparent_50%)] animate-ripple bg-[size:140%_140%]" />

        {/* Subtle Dotted Grid Background Layer */}
        <div className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
          theme === 'light' ? 'bg-dotted-grid-light opacity-55' : 'bg-dotted-grid opacity-30'
        }`} />

        {/* Noise grain overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.025] mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilterMain">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilterMain)" />
        </svg>
      </div>

      {/* Sidebar mobile backdrop overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-35 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* FAQ drawer mobile backdrop overlay */}
      {isFaqOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-35 md:hidden"
          onClick={() => setIsFaqOpen(false)}
        />
      )}

      {/* 1. Left Chat Panel Drawer */}
      <Sidebar
        chatHistories={chatHistories}
        activeChatId={activeChatId}
        userProfile={userProfile}
        isOpen={isSidebarOpen}
        onChangeProfile={saveProfileToLocalStorage}
        onSelectChat={handleSelectChat}
        onCreateNewChat={handleCreateNewChat}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        theme={theme}
        onSignOut={handleSignOut}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">
        
        {/* Navigation Bar */}
        <header className={`fixed top-0 left-0 right-0 md:relative p-4 flex items-center justify-between border-b z-30 md:z-10 transition-all duration-300 ${
          theme === 'light' 
            ? 'border-slate-200 text-slate-800 bg-white/50 backdrop-blur-[24px] saturate-[130%]' 
            : 'border-white/5 bg-white/[0.015] backdrop-blur-[24px] saturate-[130%]'
        }`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-lg border transition-all cursor-pointer md:hidden flex items-center justify-center ${
                theme === 'light'
                  ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 text-slate-300'
              }`}
              title="Toggle sidebar"
            >
              <PanelLeft className="w-4 h-4 text-indigo-400" />
            </button>
            <div className="flex items-center">
              <span className={`font-bold text-[17px] tracking-wide font-sans ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`} style={{ fontFamily: 'Sora, sans-serif' }}>
                WayaX
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* FAQ Presets Drawer Toggle Button */}
            <button
              onClick={() => setIsFaqOpen(!isFaqOpen)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                isFaqOpen
                  ? (theme === 'light'
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                      : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]')
                  : (theme === 'light'
                      ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
                      : 'bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-slate-300 hover:text-white')
              }`}
              title="Toggle FAQ Panel"
            >
              <HelpCircle className={`w-4 h-4 transition-colors duration-200 ${isFaqOpen ? 'text-indigo-500' : 'text-indigo-400'}`} />
            </button>

            {/* Restart Splash Intro Animation */}
            <button
              onClick={() => setShowSplash(true)}
              className="group/refresh w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-indigo-400 hover:text-white"
              title="Restart Intro Animation"
            >
              <RefreshCcw className="w-3.5 h-3.5 transition-transform duration-750 ease-out group-hover/refresh:rotate-180" />
            </button>

            {/* Testing Reset Button */}
            <button
              onClick={() => {
                localStorage.removeItem('wayax-profile');
                localStorage.removeItem('wayax-chats');
                setUserProfile(null);
                setChatHistories([]);
                setActiveChatId('');
                setActiveSurvey(null);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-slate-300 hover:text-white"
              title="Reset configuration & profiles (Test mode)"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Workspace dynamic contents */}
        {isEmptyChat ? (
          <div id="main-chat-viewport" className={`flex-1 overflow-y-auto pt-[84px] ${getMobilePaddingBottom()} md:py-6 px-3 md:px-4 flex flex-col relative min-h-0 select-none justify-start md:justify-center`}>
            <div className="flex-1 w-full max-w-5xl mx-auto z-20 flex flex-col items-center justify-start md:justify-center my-0 md:my-auto transition-all duration-300">
              {/* Main Titles */}
              <div className={`flex-none md:flex-1 flex flex-col justify-center md:justify-end w-full ${isDropdownOpen ? 'mt-1 mb-3.5 xs:mb-4 md:mb-6' : 'mt-2 md:mt-0 mb-4 xs:mb-5 md:mb-8'} min-h-0`}>
                <div className="flex flex-col items-center justify-center space-y-1 md:space-y-4 text-center select-none font-sans w-full">
                  <h1 className={`text-[22px] md:text-[28px] font-extrabold tracking-tight font-sans leading-tight ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                    Welcome to WayaX,{' '}
                    <span className={`block md:inline-block font-black ${theme === 'light' ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400'}`}>{userProfile.name}</span>
                  </h1>
                  <p id="welcome-caption" className={`text-[12px] max-w-[280px] md:max-w-none mx-auto leading-relaxed ${theme === 'light' ? 'text-slate-600 font-medium' : 'text-slate-400'}`} style={{ fontSize: '12px' }}>
                    Select a preset below or enter a custom query <br className="block md:hidden" /> to research breakouts.
                  </p>
                </div>
              </div>

              {/* Centered Search Card */}
              <div className="w-full relative flex-none">
                {renderUnifiedSearchBar(false)}
              </div>

              {/* Dynamic fully aligned questions list dropdown with same width as search bar */}
              <div className="flex-none md:flex-1 w-full flex flex-col justify-start pt-3 md:pt-4 min-h-0">
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: 8, height: 0 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="fixed bottom-3 left-3 right-3 z-40 rounded-2xl p-3 pb-4.5 space-y-2 border border-white/10 shadow-[0_12px_45px_rgba(0,0,0,0.5)] liquid-glass-panel backdrop-blur-3xl overflow-hidden md:relative md:bottom-auto md:left-auto md:right-auto md:z-30 md:rounded-[24px] md:p-5 md:space-y-3.5 md:max-w-5xl"
                    >
                    {/* Presets Header bar */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-1.5 md:gap-2.5">
                        <img 
                          src="https://reduced-beige-7hamqau4r6.edgeone.app/a.png" 
                          className="w-3.5 h-3.5 md:w-4 md:h-4 object-contain brightness-110" 
                          alt="Waya" 
                          referrerPolicy="no-referrer" 
                        />
                        <span className="text-[10px] md:text-[11px] font-extrabold tracking-widest uppercase font-mono text-indigo-300">
                          CHAT PRESET
                        </span>
                      </div>
                      
                      {/* FAQ Presets Button transferring the FAQ panel click link and styling dynamically */}
                      <button
                        onClick={() => {
                          setIsFaqOpen(!isFaqOpen);
                        }}
                        className={`text-[9px] md:text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full font-bold uppercase tracking-wider focus:outline-none border ${
                          isFaqOpen
                            ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                            : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white'
                        }`}
                      >
                        <HelpCircle className={`w-3 md:w-3.5 h-3 md:h-3.5 transition-colors duration-200 ${isFaqOpen ? 'text-indigo-300' : 'text-indigo-400'}`} />
                        <span>CHECK ALL QUESTIONS</span>
                      </button>
                    </div>

                    {/* Monochromatic category switcher menu with subtle background and crisp outline */}
                    <div className="flex md:flex-wrap items-center gap-1.5 md:gap-2 overflow-x-auto md:overflow-x-visible pb-1.5 md:pb-0 scrollbar-none select-none w-full -mx-1 px-1">
                      {/* 1. Stocks to Buy */}
                      <button
                        onClick={() => {
                          if (activeTab === 'buy') {
                            setIsQuestionsOpen(!isQuestionsOpen);
                          } else {
                            setActiveTab('buy');
                            setIsQuestionsOpen(true);
                          }
                          setShowAllQuestions(true);
                        }}
                        className={`px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-semibold rounded-full border flex items-center gap-1 md:gap-1.5 cursor-pointer flex-shrink-0 whitespace-nowrap transition-all ${
                          activeTab === 'buy' && isQuestionsOpen
                            ? 'bg-white/15 border-white/30 text-white shadow-[0_0_12px_rgba(255,255,255,0.08)]'
                            : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/15 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <TrendingUp className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        <span>Stocks to Buy</span>
                        <ChevronDown className={`w-2.5 h-2.5 md:w-3 md:h-3 transition-transform duration-200 text-slate-400 ${activeTab === 'buy' && isQuestionsOpen ? 'rotate-180 text-white' : ''}`} />
                      </button>

                      {/* 2. Short Selling */}
                      <button
                        onClick={() => {
                          if (activeTab === 'short') {
                            setIsQuestionsOpen(!isQuestionsOpen);
                          } else {
                            setActiveTab('short');
                            setIsQuestionsOpen(true);
                          }
                          setShowAllQuestions(true);
                        }}
                        className={`px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-semibold rounded-full border flex items-center gap-1 md:gap-1.5 cursor-pointer flex-shrink-0 whitespace-nowrap transition-all ${
                          activeTab === 'short' && isQuestionsOpen
                            ? 'bg-white/15 border-white/30 text-white shadow-[0_0_12px_rgba(255,255,255,0.08)]'
                            : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/15 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <AlertTriangle className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        <span>Short selling</span>
                        <ChevronDown className={`w-2.5 h-2.5 md:w-3 md:h-3 transition-transform duration-200 text-slate-400 ${activeTab === 'short' && isQuestionsOpen ? 'rotate-180 text-white' : ''}`} />
                      </button>

                      {/* 3. Long Term Picks */}
                      <button
                        onClick={() => {
                          if (activeTab === 'long') {
                            setIsQuestionsOpen(!isQuestionsOpen);
                          } else {
                            setActiveTab('long');
                            setIsQuestionsOpen(true);
                          }
                          setShowAllQuestions(true);
                        }}
                        className={`px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-semibold rounded-full border flex items-center gap-1 md:gap-1.5 cursor-pointer flex-shrink-0 whitespace-nowrap transition-all ${
                          activeTab === 'long' && isQuestionsOpen
                            ? 'bg-white/15 border-white/30 text-white shadow-[0_0_12px_rgba(255,255,255,0.08)]'
                            : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/15 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        <span>Long term picks</span>
                        <ChevronDown className={`w-2.5 h-2.5 md:w-3 md:h-3 transition-transform duration-200 text-slate-400 ${activeTab === 'long' && isQuestionsOpen ? 'rotate-180 text-white' : ''}`} />
                      </button>

                      {/* 4. Track Record */}
                      <button
                        onClick={() => {
                          if (activeTab === 'track') {
                            setIsQuestionsOpen(!isQuestionsOpen);
                          } else {
                            setActiveTab('track');
                            setIsQuestionsOpen(true);
                          }
                          setShowAllQuestions(true);
                        }}
                        className={`px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-semibold rounded-full border flex items-center gap-1 md:gap-1.5 cursor-pointer flex-shrink-0 whitespace-nowrap transition-all ${
                          activeTab === 'track' && isQuestionsOpen
                            ? 'bg-white/15 border-white/30 text-white shadow-[0_0_12px_rgba(255,255,255,0.08)]'
                            : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/15 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Search className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        <span>Track record</span>
                        <ChevronDown className={`w-2.5 h-2.5 md:w-3 md:h-3 transition-transform duration-200 text-slate-400 ${activeTab === 'track' && isQuestionsOpen ? 'rotate-180 text-white' : ''}`} />
                      </button>

                      {/* 5. About Waya */}
                      <button
                        onClick={() => {
                          if (activeTab === 'about') {
                            setIsQuestionsOpen(!isQuestionsOpen);
                          } else {
                            setActiveTab('about');
                            setIsQuestionsOpen(true);
                          }
                          setShowAllQuestions(true);
                        }}
                        className={`px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-semibold rounded-full border flex items-center gap-1 md:gap-1.5 cursor-pointer flex-shrink-0 whitespace-nowrap transition-all ${
                          activeTab === 'about' && isQuestionsOpen
                            ? 'bg-white/15 border-white/30 text-white shadow-[0_0_12px_rgba(255,255,255,0.08)]'
                            : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/15 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <img 
                          src="https://reduced-beige-7hamqau4r6.edgeone.app/a.png" 
                          className="w-3 h-3 md:w-3.5 md:h-3.5 object-contain" 
                          alt="Waya" 
                          referrerPolicy="no-referrer" 
                        />
                        <span>About Waya</span>
                        <ChevronDown className={`w-2.5 h-2.5 md:w-3 md:h-3 transition-transform duration-200 text-slate-400 ${activeTab === 'about' && isQuestionsOpen ? 'rotate-180 text-white' : ''}`} />
                      </button>
                    </div>

                    {/* Rendered list of questions with fully monochromatic styling folded based on state */}
                    <AnimatePresence>
                      {isQuestionsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="w-full font-sans overflow-hidden border-t border-white/5 pt-2.5"
                        >
                          {(() => {
                            const allListed = DROPDOWN_QUESTIONS[activeTab] || [];
                            const displayedQuestions = allListed;
                            
                            return (
                              <>
                                <div className="space-y-1 md:space-y-2 max-h-[120px] md:max-h-[240px] overflow-y-auto pr-1 md:pr-2 custom-scroll">
                                  {displayedQuestions.map((q, idx) => {
                                    const bulletColor = "bg-indigo-400";
                                    
                                    return (
                                      <motion.button
                                        key={`${activeTab}-${idx}`}
                                        initial={{ opacity: 0, y: 3 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.1, delay: idx * 0.02 }}
                                        onClick={() => handleFaqClick(q)}
                                        className="w-full text-left p-2.5 md:p-3.5 rounded-lg md:rounded-xl border transition-all duration-200 flex items-center justify-between group cursor-pointer shadow-md md:shadow-lg bg-white/[0.02] border-white/10 hover:bg-indigo-900/10 hover:border-indigo-500/30 hover:shadow-[0_4px_24px_rgba(79,70,229,0.15)] text-slate-300 hover:text-white backdrop-blur-[4px] md:backdrop-blur-sm"
                                      >
                                        <div className="flex items-center gap-2 md:gap-3 min-w-0 pr-2 md:pr-4 w-full">
                                          <span className={`w-1 md:w-1.5 h-1 md:h-1.5 rounded-full ${bulletColor} group-hover:scale-[1.3] group-hover:shadow-[0_0_8px_rgba(129,140,248,0.8)] transition-all duration-300 select-none flex-shrink-0`} />
                                          <span className="font-sans font-medium break-words text-[10.5px] md:text-[13px]" title={q}>{q}</span>
                                        </div>
                                        <span className="hidden sm:inline-flex text-[10px] group-hover:translate-x-1 transition-all font-mono duration-200 select-none whitespace-nowrap items-center gap-1.5 flex-shrink-0 text-slate-500 group-hover:text-indigo-300">
                                          Select <span className="transform translate-x-0 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                                        </span>
                                      </motion.button>
                                    );
                                  })}
                                </div>
                              </>
                            );
                          })()}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between overflow-hidden relative min-h-0 pt-[65px] md:pt-0">
            {/* Scrollable messages and advisory list */}
            <div id="main-chat-viewport" className="flex-1 overflow-y-auto px-3 md:px-4 py-3 md:py-6 space-y-4 md:space-y-6">
              <div className="max-w-5xl mx-auto space-y-6">
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  
                  if (msg.isSurvey) {
                    const activeSurveyMsg = messages.length > 0 && messages[messages.length - 1].isSurvey 
                      ? messages[messages.length - 1] 
                      : null;
                      
                    if (msg.id === activeSurveyMsg?.id) {
                      return null; // Keep active survey animated in the footer only
                    }
                    
                    // Render historical/completed survey inside the viewport
                    const msgIdx = messages.findIndex(m => m.id === msg.id);
                    const nextMsg = msgIdx !== -1 && msgIdx < messages.length - 1 ? messages[msgIdx + 1] : null;
                    const selectedOption = nextMsg && nextMsg.sender === 'user' ? nextMsg.text : null;
                    
                    return (
                      <div 
                        key={msg.id}
                        className="flex gap-3 justify-start animate-fade-in"
                      >
                        <div className="w-9 h-9 rounded-xl liquid-glass-panel border-white/5 border flex items-center justify-center flex-shrink-0 shadow-sm bg-[#121420]/30 overflow-hidden">
                          <img 
                            src="https://reduced-beige-7hamqau4r6.edgeone.app/a.png" 
                            className="w-5 h-5 object-contain brightness-110" 
                            alt="Waya" 
                            referrerPolicy="no-referrer" 
                          />
                        </div>
                        
                        <div className="max-w-[88%] space-y-1.5 text-left w-full">
                          <span className="text-[10px] text-slate-500 tracking-wider font-mono uppercase block px-1">
                            WayaX • {msg.timestamp}
                          </span>
                          
                          <div className="liquid-glass-panel text-slate-100 rounded-2xl rounded-tl-none font-secondary space-y-3.5 border-white/5 p-5 md:p-6 shadow-xl w-full">
                            <div className="text-[13px] font-bold text-slate-100 font-sans leading-relaxed tracking-tight">
                              {msg.text}
                            </div>
                            
                            <div className="space-y-2 mt-3.5">
                              {msg.surveyQuestion?.options.map((option, optIdx) => {
                                const isSelected = selectedOption === option;
                                
                                return (
                                  <div
                                    key={optIdx}
                                    className={`rounded-xl px-4 py-3 flex items-center gap-3 border text-[12px] transition-all duration-300 ${
                                      isSelected
                                        ? 'border-indigo-500/40 bg-indigo-500/[0.06] text-white font-semibold shadow-[0_2px_12px_rgba(99,102,241,0.05)]'
                                        : 'border-white/5 bg-white/[0.01]/40 text-slate-400 opacity-55'
                                    }`}
                                  >
                                    {isSelected ? (
                                      <span className="w-5.5 h-5.5 flex items-center justify-center rounded-md bg-indigo-500 text-white shadow-[0_1px_5px_rgba(99,102,241,0.5)] animate-scale-in">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                      </span>
                                    ) : (
                                      <span className="w-5.5 h-5.5 flex items-center justify-center font-mono font-bold text-[10px] bg-white/[0.05] border border-white/10 text-slate-500 rounded-md">
                                        {optIdx + 1}
                                      </span>
                                    )}
                                    <span className={isSelected ? 'text-white' : 'text-slate-350'}>
                                      {option}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={msg.id}
                      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* User profile / Bot shield indicators */}
                      {!isUser && (
                        <div className="w-9 h-9 rounded-xl liquid-glass-panel border-white/5 border flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden bg-[#121420]/30">
                          <img 
                            src="https://reduced-beige-7hamqau4r6.edgeone.app/a.png" 
                            className="w-5 h-5 object-contain brightness-110" 
                            alt="Waya" 
                            referrerPolicy="no-referrer" 
                          />
                        </div>
                      )}

                      <div className="max-w-[88%] space-y-1.5 text-left">
                        {/* Name Header */}
                        <span className="text-[10px] text-slate-500 tracking-wider font-mono uppercase block px-1">
                          {isUser ? userProfile.name : 'WayaX'} • {msg.timestamp}
                        </span>

                        {/* Msg text block */}
                        <div className={`px-5 py-4 rounded-2xl text-[12px] line-height-relaxed select-text shadow-xl ${
                          isUser 
                            ? 'liquid-glass-panel border-white/20 text-white rounded-tr-none font-secondary shadow-[0_4px_20px_rgba(255,255,255,0.05)]' 
                            : 'liquid-glass-panel text-slate-100 rounded-tl-none font-secondary space-y-4 border-[#fff1]/5 border-white/5'
                        }`}>
                          {/* Text body with markdown simulation layout support */}
                          <div className="whitespace-pre-line leading-relaxed font-sans text-slate-100">
                            {msg.text}
                          </div>

                          {/* Rendering Expanded stock recommendations table inside this specific bubble response */}
                          {msg.stocks && msg.stocks.length > 0 && (
                            <div className="mt-4">
                              <StockTable stocks={msg.stocks} theme={theme} />
                            </div>
                          )}
                          
                          {/* Advisory Badge bar below assistant bubbles */}
                          {!isUser && (
                            <div className={`flex items-center gap-1.5 mt-2.5 pt-2 border-t flex-wrap ${
                              theme === 'light' ? 'border-slate-200' : 'border-[#1e293b]/70'
                            }`}>
                              <span className="bg-[#1017df]/20 hover:bg-[#1017df]/30 text-indigo-400 text-[10px] font-extrabold tracking-widest uppercase border border-indigo-500/25 px-2 py-0.5 rounded font-mono">
                                ANSWER
                              </span>
                              <span className="bg-[#052d1c]/40 text-emerald-400 text-[10px] font-extrabold tracking-widest uppercase border border-emerald-500/15 px-2 py-0.5 rounded font-mono">
                                ADVISORY
                              </span>
                              {msg.latency && (
                                <span className={`text-[10px] font-mono border px-2 py-0.5 rounded ${
                                  theme === 'light'
                                    ? 'bg-slate-100 border-slate-200 text-slate-500 font-semibold'
                                    : 'bg-slate-800/40 text-slate-400 border-slate-700/20'
                                }`}>
                                  {msg.latency}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-9 h-9 rounded-xl liquid-glass-panel border-white/5 border flex items-center justify-center flex-shrink-0 font-bold text-indigo-400 text-xs shadow-sm select-none">
                          {userProfile.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Dynamic typing loader feedback */}
                {isLoading && (
                  <div className="flex gap-3 justify-start items-start animate-fade-in relative">
                    <div className="w-9 h-9 rounded-xl liquid-glass-panel border border-white/10 flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-sm">
                      <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <div className="space-y-1.5 font-sans leading-none">
                      <span className="text-[10px] text-zinc-500 tracking-wider font-mono uppercase block text-left flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" /> WayaX • Analyzing Markets
                      </span>
                      <div className={`border px-4 py-3 rounded-2xl rounded-tl-none font-secondary flex items-center gap-2 text-xs shadow-md text-left ${
                        theme === 'light'
                          ? 'liquid-glass-panel border-slate-200 text-slate-700'
                          : 'liquid-glass-panel border-white/10 text-slate-300'
                      }`}>
                        <div className="flex gap-0.5 mt-1 font-bold text-lg text-indigo-400">
                          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                          <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                          <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                        </div>
                        <span className="ml-2">Formulating advisory thesis, auditing guidelines...</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Warnings and Disclaimers block if stocks listed */}
                {messages.some(m => m.stocks && m.stocks.length > 0) && (
                  <p className={`text-[10px] font-secondary tracking-wide leading-relaxed p-4 border rounded-lg text-center font-normal select-none max-w-3xl mx-auto ${
                    theme === 'light'
                      ? 'bg-slate-100/50 border-slate-200 text-slate-505 text-slate-500 shadow-sm'
                      : 'bg-[#070b13] border border-[#182335]/40 text-zinc-500'
                  }`}>
                    All recommendations are for informational purposes only. Past performance does not guarantee future results. Invest according to your own risk appetite and financial situation. Execute trades through your own SEBI-registered broker. Waya Financial Technologies | SEBI RA: INH00010876 | PMS: INP000008987
                  </p>
                )}

                {/* Handle error notification alerts */}
                {errorText && (
                  <div className="p-3 bg-amber-950/40 border border-amber-500/20 text-amber-300 text-xs rounded-lg flex items-center gap-2 select-none mx-auto max-w-xl">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>{errorText}</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Seamless Active search bar anchored down on screen with beautiful backdrop shadow and space */}
            <footer className={`p-3 md:p-4 z-20 select-none pb-3 md:pb-6 border-t md:border-t-0 animate-fade-in transition-all duration-300 ${
              theme === 'light'
                ? 'bg-[#F2F2F7] md:bg-transparent border-slate-200/60 text-slate-800'
                : 'bg-[#1c1c1e] md:bg-transparent border-white/5 text-slate-200'
            }`}>
              <div className="max-w-5xl mx-auto space-y-4">
                {(() => {
                  const activeSurveyMsg = messages.length > 0 && messages[messages.length - 1].isSurvey 
                    ? messages[messages.length - 1] 
                    : null;
                    
                  return (
                    <AnimatePresence>
                      {activeSurveyMsg && (
                        <motion.div
                          initial={{ opacity: 0, y: 30, scale: 0.99 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 20, scale: 0.99 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className="w-full relative z-20 text-left mb-1.5 md:mb-2"
                        >
                          <div className="liquid-glass-panel rounded-xl md:rounded-3xl p-3 md:p-6 lg:p-8 border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-3xl relative">
                            {/* Header containing text and step indicators */}
                            <div className="flex flex-row justify-between items-center gap-3 pb-2.5 border-b border-white/5 select-none text-left w-full">
                              <div className="flex-1 min-w-0 pr-1">
                                <h3 className="text-[11.5px] md:text-[15px] font-bold text-slate-100 font-sans leading-snug tracking-tight whitespace-normal break-words">
                                  {activeSurveyMsg.text}
                                </h3>
                              </div>
                              
                              {/* Navigation & Action Controls on Right */}
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="flex items-center gap-1.5">
                                  <button 
                                    onClick={() => {
                                      if (activeSurveyMsg.surveyQuestion?.id === 'risk') {
                                        handleSurveyGoBack();
                                      }
                                    }}
                                    disabled={activeSurveyMsg.surveyQuestion?.id === 'horizon'}
                                    className={`w-6 h-6 md:w-7 md:h-7 rounded-md md:rounded-lg flex items-center justify-center border transition-all ${
                                      activeSurveyMsg.surveyQuestion?.id === 'horizon' 
                                        ? 'opacity-20 border-white/5 text-slate-600 cursor-not-allowed' 
                                        : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-slate-300 hover:text-white cursor-pointer'
                                    }`}
                                    title="Previous step"
                                  >
                                    <ChevronLeft className="w-3 md:w-4 h-3 md:h-4" />
                                  </button>
                                  
                                  <span className="text-[9px] md:text-[11px] font-mono font-bold text-slate-400 select-none px-0.5 tracking-wider whitespace-nowrap">
                                    {activeSurveyMsg.surveyQuestion?.id === 'horizon' ? '1 / 2' : '2 / 2'}
                                  </span>
                                  
                                  <button 
                                    onClick={() => {
                                      if (activeSurveyMsg.surveyQuestion?.id === 'horizon') {
                                        const opt = tempSelectedOption || 'Short Term — quick wins, under 3 months';
                                        handleSurveyOptionClick('horizon', opt);
                                      }
                                    }}
                                    disabled={activeSurveyMsg.surveyQuestion?.id === 'risk'}
                                    className={`w-6 h-6 md:w-7 md:h-7 rounded-md md:rounded-lg flex items-center justify-center border transition-all ${
                                      activeSurveyMsg.surveyQuestion?.id === 'risk' 
                                        ? 'opacity-20 border-white/5 text-slate-600 cursor-not-allowed' 
                                        : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-slate-300 hover:text-white cursor-pointer'
                                    }`}
                                    title="Next step"
                                  >
                                    <ChevronRight className="w-3 md:w-4 h-3 md:h-4" />
                                  </button>
                                </div>
                                
                                <div className="w-px h-3.5 bg-white/10 hidden md:block" />
                                
                                {/* Close cross X button */}
                                <button 
                                  onClick={() => handleSurveySkip()}
                                  className="w-6 h-6 md:w-7 md:h-7 rounded-md md:rounded-lg flex items-center justify-center bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all cursor-pointer"
                                  title="Dismiss survey"
                                >
                                  <X className="w-3 md:w-3.5 h-3 md:h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Options List layout matching user sketch vertically stacked with badges */}
                            <div className="mt-2.5 space-y-1.5 md:space-y-2.5">
                              {activeSurveyMsg.surveyQuestion?.options.map((option, optIdx) => {
                                const isSelected = tempSelectedOption === option || (
                                  activeSurveyMsg.surveyQuestion?.id === 'horizon' 
                                    ? surveyResponseProgress.horizon === option 
                                    : surveyResponseProgress.risk === option
                                );

                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => {
                                      setTempSelectedOption(option);
                                      setTimeout(() => {
                                        handleSurveyOptionClick(activeSurveyMsg.surveyQuestion!.id, option);
                                      }, 550);
                                    }}
                                    className={`w-full text-left rounded-lg md:rounded-2xl p-2 md:p-3.5 transition-all duration-300 flex items-center gap-2.5 md:gap-4 group cursor-pointer border ${
                                      isSelected 
                                        ? 'border-indigo-500/40 bg-indigo-500/[0.06] shadow-[0_4px_24px_rgba(99,102,241,0.1)] font-semibold' 
                                        : 'border-white/5 bg-white/[0.01]/75 hover:bg-white/[0.06] hover:border-white/15'
                                    }`}
                                  >
                                    {isSelected ? (
                                      <span className="w-5 h-5 md:w-7 md:h-7 flex-shrink-0 flex items-center justify-center rounded-md md:rounded-lg bg-indigo-500 text-white shadow-[0_2px_10px_rgba(99,102,241,0.5)] transition-all animate-scale-in">
                                        <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                      </span>
                                    ) : (
                                      <span className="w-5 h-5 md:w-7 md:h-7 flex-shrink-0 flex items-center justify-center font-mono font-bold text-[9px] md:text-[11px] bg-white/[0.05] border border-white/10 text-slate-300 rounded-md md:rounded-lg group-hover:bg-white/10 group-hover:text-white transition-colors">
                                        {optIdx + 1}
                                      </span>
                                    )}
                                    
                                    <span className={`font-sans font-medium text-[11px] md:text-[13px] transition-colors ${
                                      isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                                    }`}>
                                      {option}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Something else / Skip text row at bottom */}
                            <div className="mt-3 md:mt-6 pt-2.5 md:pt-5 border-t border-white/5 flex flex-row items-center gap-2 md:gap-4 justify-between w-full">
                              {/* custom input row */}
                              <div className="flex items-center gap-2 md:gap-3 bg-white/[0.02] border border-white/5 focus-within:border-white/20 px-3 md:px-4 h-8 md:h-11 rounded-lg md:rounded-xl transition-all flex-1 min-w-0">
                                <PenTool className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-300 flex-shrink-0" />
                                <input 
                                  type="text"
                                  placeholder="Something else..."
                                  value={surveyCustomText}
                                  onChange={(e) => setSurveyCustomText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && surveyCustomText.trim()) {
                                      setTempSelectedOption(surveyCustomText.trim());
                                      setTimeout(() => {
                                        handleSurveyOptionClick(activeSurveyMsg.surveyQuestion!.id, surveyCustomText.trim());
                                        setSurveyCustomText('');
                                      }, 550);
                                    }
                                  }}
                                  className="bg-transparent focus:outline-none text-[10px] md:text-xs font-sans font-medium text-slate-100 placeholder-slate-500 w-full"
                                />
                              </div>
                              
                              {/* Skip Button */}
                              <button 
                                onClick={() => handleSurveySkip()}
                                className="text-[10px] md:text-xs font-bold px-3 md:px-5 h-8 md:h-11 rounded-lg md:rounded-xl border border-white/10 bg-[#fff]/[0.04] text-slate-300 hover:text-white hover:bg-[#fff]/[0.08] hover:border-white/20 transition-all cursor-pointer shadow-md select-none flex-shrink-0"
                              >
                                Skip
                              </button>
                            </div>
                          </div>
                          
                          {/* Centered label block: "Or reply directly..." */}
                          <div className="hidden sm:flex mt-3 text-center flex-col items-center gap-3 select-none">
                            <span className="text-[10px] uppercase tracking-widest font-extrabold font-mono text-slate-500 bg-black/10 px-3 py-1 rounded-full border border-white/[0.02]">
                              Or reply directly...
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  );
                })()}

                {/* Active compact unified search bar with layoutId shared animation */}
                {renderUnifiedSearchBar(true)}

                <div className="text-center text-[9px] text-zinc-500 mt-2 font-secondary flex items-center justify-center gap-1.5">
                  <span className="hidden md:inline">Enter to send · Shift+Enter for new line</span>
                  <span className="hidden md:inline text-zinc-650 text-zinc-600 font-mono">|</span>
                  <span className="text-zinc-500 font-semibold uppercase font-secondary tracking-wide">Advisory only — not direct financial advice</span>
                </div>
              </div>
            </footer>
          </div>
        )}
      </div>

      {/* 2. Right FAQ Presets Drawer Panel */}
      <FAQDrawer
        isOpen={isFaqOpen}
        onToggle={() => setIsFaqOpen(!isFaqOpen)}
        onQuestionClick={handleFaqClick}
        theme={theme}
      />

    </div>
  );
}
