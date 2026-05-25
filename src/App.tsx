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
import { ChatHistory, ChatMessage, UserProfile, SurveyQuestion, StockRecommendation } from './types';

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

// Preset real mock database for WayaX offline mode
const MOCK_REC_GOKUL: StockRecommendation = {
  id: 'gokul',
  stockName: 'Gokul Agro Resources Ltd',
  ticker: 'GOKULAGRO',
  action: 'BUY',
  priceRange: '₹234.88 – ₹239.62',
  targetPrice: '₹308.43',
  stopLoss: '₹166.08',
  targetUpside: '30%',
  tenure: '3mo – 6mo',
  technical: {
    rdxScore: 5,
    rsiWeekly: 72,
    adxWeekly: 32.2,
    ema50_200: '211.4 / 182.7',
    return1M: '15.1%',
    return3M: '41.6%',
    return1Y: '91.9%',
    volatility30D: '39%'
  },
  fundamental: {
    peRatio: 18.9,
    pbRatio: 4.9,
    roe: '5.0%',
    roce: '13.2%',
    debtEquity: '0.4',
    fiiHolding: '1.5%',
    opm: '2.8%',
    profitGrowth3Y: '40.8%'
  },
  thesis: 'Technically, Gokul Agro Resources Ltd shows RDX score of 5; RSI at 72 (strong upward momentum); ADX at 32.2 — trend is strong and directional. Fundamentally: ROE of 5% (moderate capital efficiency), PE of 18.9 — attractively valued, 3Y profit growth of 40.8%, low leverage. Entry zone ₹234.88–₹239.62 targeting ₹308.43 (30% upside) with stop loss at ₹166.08 — 1:1 risk-reward, solid setup over 3mo – 6mo.'
};

const MOCK_REC_SKM: StockRecommendation = {
  id: 'skm',
  stockName: 'SKM Egg Products Export (India) Ltd',
  ticker: 'SKMEGGPROD',
  action: 'BUY',
  priceRange: '₹194.63 – ₹198.57',
  targetPrice: '₹255.58',
  stopLoss: '₹137.62',
  targetUpside: '30%',
  tenure: '6mo – 1.0y',
  technical: {
    rdxScore: 4,
    rsiWeekly: 68,
    adxWeekly: 28.5,
    ema50_200: '178.2 / 164.1',
    return1M: '8.4%',
    return3M: '26.1%',
    return1Y: '64.5%',
    volatility30D: '32%'
  },
  fundamental: {
    peRatio: 14.5,
    pbRatio: 3.2,
    roe: '22.4%',
    roce: '27.1%',
    debtEquity: '0.1',
    fiiHolding: '0.8%',
    opm: '12.4%',
    profitGrowth3Y: '35.4%'
  },
  thesis: 'Technical indicators show a strong base building above its crucial 200 EMA with RSI turning upwards in the weekly chart. Fundamentally, company has outstanding return ratios with ROE of 22.4% and highly conservative debt (D/E of 0.1). 30% upside is highly achievable over 6mo to a year as global food export demands stabilize.'
};

const MOCK_REC_ROUTE: StockRecommendation = {
  id: 'route',
  stockName: 'Route Mobile Ltd',
  ticker: 'ROUTE',
  action: 'BUY',
  priceRange: '₹515.44 – ₹525.86',
  targetPrice: '₹676.85',
  stopLoss: '₹364.46',
  targetUpside: '30%',
  tenure: '3mo – 6mo',
  technical: {
    rdxScore: 5,
    rsiWeekly: 74,
    adxWeekly: 35.1,
    ema50_200: '475.4 / 432.1',
    return1M: '18.2%',
    return3M: '48.9%',
    return1Y: '82.3%',
    volatility30D: '27%'
  },
  fundamental: {
    peRatio: 28.1,
    pbRatio: 6.8,
    roe: '18.2%',
    roce: '21.5%',
    debtEquity: '0.2',
    fiiHolding: '21.4%',
    opm: '14.8%',
    profitGrowth3Y: '24.2%'
  },
  thesis: 'Strong technical breakout backed by high institutional volume. High FII holding at 21.4% highlights massive global confidence. Strong OPM at 14.8% and steady 3-year profit growth of 24.2% support digital communications market expansion.'
};

const MOCK_REC_CEINSYS: StockRecommendation = {
  id: 'ceinsys',
  stockName: 'Ceinsys Tech Ltd',
  ticker: 'CEINSYS',
  action: 'BUY',
  priceRange: '₹907.29 – ₹925.61',
  targetPrice: '₹1,191.39',
  stopLoss: '₹641.52',
  targetUpside: '30%',
  tenure: '3mo – 6mo',
  technical: {
    rdxScore: 4,
    rsiWeekly: 65,
    adxWeekly: 24.8,
    ema50_200: '840.1 / 790.6',
    return1M: '12.3%',
    return3M: '31.4%',
    return1Y: '110.2%',
    volatility30D: '41%'
  },
  fundamental: {
    peRatio: 22.5,
    pbRatio: 5.1,
    roe: '14.2%',
    roce: '18.9%',
    debtEquity: '0.3',
    fiiHolding: '3.2%',
    opm: '11.5%',
    profitGrowth3Y: '18.4%'
  },
  thesis: 'Steady structural software demand and high-margin geospatial services. Breakout above high-volume nodes and 50 EMA is confirmed. A tight stop loss at ₹641.52 guarantees great risk-reward ratio.'
};

const MOCK_REC_DYNACONS: StockRecommendation = {
  id: 'dynacons',
  stockName: 'Dynacons Systems & Solutions Ltd',
  ticker: 'DSSL',
  action: 'BUY',
  priceRange: '₹1,536.73 – ₹1,567.77',
  targetPrice: '₹2,017.93',
  stopLoss: '₹1,086.57',
  targetUpside: '30%',
  tenure: '3mo – 6mo',
  technical: {
    rdxScore: 5,
    rsiWeekly: 76,
    adxWeekly: 38.4,
    ema50_200: '1410.2 / 1215.4',
    return1M: '21.5%',
    return3M: '54.2%',
    return1Y: '145.8%',
    volatility30D: '34%'
  },
  fundamental: {
    peRatio: 24.2,
    pbRatio: 7.4,
    roe: '28.1%',
    roce: '32.4%',
    debtEquity: '0.05',
    fiiHolding: '1.2%',
    opm: '8.4%',
    profitGrowth3Y: '52.6%'
  },
  thesis: 'Outstanding fundamentals with nearly zero debt, 28.1% ROE and spectacular 3Y average profit growth of 52.6%. Technical momentum is extremely bullish with ADX at 38.4 and RSI maintaining clean supportive structures.'
};

const MOCK_REC_SHORT_TATA: StockRecommendation = {
  id: 'short_tata',
  stockName: 'Short Idea: Heavy Industry Corp',
  ticker: 'HVIC',
  action: 'SHORT',
  priceRange: '₹450.20 – ₹458.10',
  targetPrice: '₹315.00',
  stopLoss: '₹510.40',
  targetUpside: '30%',
  tenure: '1mo – 3mo',
  technical: {
    rdxScore: 2,
    rsiWeekly: 32,
    adxWeekly: 24.1,
    ema50_200: '430.5 / 462.8',
    return1M: '-12.1%',
    return3M: '-24.8%',
    return1Y: '-5.2%',
    volatility30D: '45%'
  },
  fundamental: {
    peRatio: 48.2,
    pbRatio: 12.3,
    roe: '-2.4%',
    roce: '1.8%',
    debtEquity: '2.4',
    fiiHolding: '0.5%',
    opm: '1.2%',
    profitGrowth3Y: '-15.4%'
  },
  thesis: 'Negative earnings surprise and extensive short builds in futures open interest. The stock is trading well below its 200 daily and weekly EMA. Fundamentally suffering from heavy leverage (D/E 2.4) and negative profit growth.'
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
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(true);
  const [isQuestionsOpen, setIsQuestionsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'buy' | 'short' | 'long' | 'track' | 'about'>('buy');
  const [showAllQuestions, setShowAllQuestions] = useState<boolean>(true);
  
  const getMobilePaddingBottom = () => {
    if (!isDropdownOpen) return 'pb-[90px]';
    if (isQuestionsOpen) return 'pb-[320px]';
    return 'pb-[180px]';
  };

  const getChatMobilePaddingBottom = (msgs: ChatMessage[]) => {
    const activeSurveyMsg = msgs.length > 0 && msgs[msgs.length - 1].isSurvey 
      ? msgs[msgs.length - 1] 
      : null;
    if (activeSurveyMsg) {
      return 'pb-[460px] md:pb-6';
    }
    return 'pb-[120px] md:pb-6';
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
    setIsSidebarOpen(false);
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

    // Simulated offline/local network delay for realistic high-fidelity prototype response
    setTimeout(() => {
      let answerText = '';
      let responseStocks: StockRecommendation[] | undefined = undefined;

      if (normalizedQuery.includes('list of stocks') || normalizedQuery.includes('stocks i can buy') || normalizedQuery.includes('stocks currently in the buy zone') || normalizedQuery.includes('buy zone') || normalizedQuery.includes('picks')) {
        answerText = `Based on WayaX's automated daily scan of BSE/NSE equities, we have discovered several companies crossing critical visual buy triggers. These correspond to solid RDX momentum structures and extremely low leverage levels. These picks match your **${userProfile.riskTolerance} Risk** memory.`;
        responseStocks = [MOCK_REC_GOKUL, MOCK_REC_SKM, MOCK_REC_ROUTE, MOCK_REC_CEINSYS, MOCK_REC_DYNACONS];
      } else if (normalizedQuery.includes('fmcg') || normalizedQuery.includes('food') || normalizedQuery.includes('consumer')) {
        answerText = `FMCG sector analysis: Defensive positioning is strengthening as domestic margins recover from price stabilization. We select consumer food and services showing high return ratios and low supply-chain volatility over the mid-term.`;
        responseStocks = [MOCK_REC_SKM, MOCK_REC_ROUTE];
      } else if (normalizedQuery.includes('short') || normalizedQuery.includes('bearish') || normalizedQuery.includes('sell')) {
        answerText = `Short-selling opportunities identified via RDX visual and mathematical indicators. These selections are currently exhibiting heavy volume breakdown structures below major long-term moving averages. Use strict stops as shorting carries asymmetric risks.`;
        responseStocks = [MOCK_REC_SHORT_TATA];
      } else if (normalizedQuery.includes('it sector') || normalizedQuery.includes('tech') || normalizedQuery.includes('software')) {
        answerText = `IT and Software Sector Update: Enterprise technology contracts show massive pipeline expansion. Standard high-potential mid-cap tech picks with zero debt have been short-listed.`;
        responseStocks = [MOCK_REC_ROUTE, MOCK_REC_CEINSYS, MOCK_REC_DYNACONS];
      } else if (normalizedQuery.includes('long-term') || normalizedQuery.includes('multibagger') || normalizedQuery.includes('wealth creation') || normalizedQuery.includes('3x')) {
        answerText = `Long-term wealth building opportunities feature companies with strong compounded sales growth, massive return on capital employed (ROCE > 20%), and zero or negligible debt profiles. These fit a **${userProfile.investmentHorizon}** outlook.`;
        responseStocks = [MOCK_REC_DYNACONS, MOCK_REC_ROUTE, MOCK_REC_SKM];
      } else if (normalizedQuery.includes('track record') || normalizedQuery.includes('profitable') || normalizedQuery.includes('win rate')) {
        answerText = `### WayaX Historical Track Record & Advisory Veracity
        
Our audited SEBI research performance details demonstrate a persistent statistical advantage across market cycles:
- **Cumulative Win Rate on Closed Recommendations**: **74.8%** over the past 24 months.
- **Average Win Margin per Call**: **+18.4%** above the NSE Nifty 50 benchmark.
- **Total Closed Recommendations**: **342** (256 profitable, 86 stopped out).
- **Average Holding Period**: 94 calendar days.

* Past performance is not a guarantee of future returns. Detailed Excel spreadsheets with SEBI registration metrics can be obtained upon request from support.`;
      } else if (normalizedQuery.includes('buy zone') || normalizedQuery.includes('what is a buy zone')) {
        answerText = `### Understanding WayaX "Buy Zones"

A WayaX **Buy Zone** represents a mathematically and visually backed price hallway where the risk-to-reward ratio is optimal (typically 1:2 or higher).
- **Entry Protocol**: We locate visual support zones (e.g., strong volume nodes, key moving averages like the weekly 50 EMA, and structural trendline bases).
- **Execution Strategy**: Orders should be scaled incrementally within the specified price hallway rather than bought as a single lump-sum.
- **Stop Loss Enforcement**: If a stock trades daily or weekly below the Stop Loss price, our advisory rules dictate an immediate manual or algorithmic exit to preserve capital.`;
      } else {
        answerText = `Hello! I have integrated your personalized WayaX settings (**${userProfile.riskTolerance} risk** with a **${userProfile.investmentHorizon} horizon**). 

If you are requesting specific equity recommendations, feel free to choose one of our predefined preset questions on the right panel, or ask me about:
1. **IT or Tech sector buys**
2. **Short selling opportunities**
3. **Consumer, Food or FMCG picks**
4. **Our general track record and win margins**

Alternatively, how can I advise you on specific investment choices today?`;
      }

      const endTime = performance.now();
      const calculatedDurationMs = Math.round(endTime - startTime) + 120;

      const assistantMsg: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'assistant',
        text: answerText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stocks: responseStocks,
        latency: `${calculatedDurationMs} ms`
      };

      const updatedWithAI = [...updatedMessages, assistantMsg];

      setChatHistories(prev => {
        const next = prev.map(chat => {
          if (chat.id === activeChatId) {
            return { ...chat, messages: updatedWithAI };
          }
          return chat;
        });
        saveChatsToLocalStorage(next);
        return next;
      });
      setIsLoading(false);
    }, 750);
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
        className="w-full max-w-5xl md:max-w-[971px] relative group/search mx-auto pointer-events-auto"
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      >
        {/* Animated Gradient Glow (Outside only via mask) */}
        <div className={`absolute -inset-[3px] ${isCompact ? 'rounded-[23px]' : 'rounded-[19px] md:rounded-[27px]'} pointer-events-none z-0 mask-gradient-glow p-[3px] group-focus-within/search:opacity-100 transition-opacity duration-500`}>
           <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{ 
              background: theme === 'light'
                ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.4))'
                : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.04))'
            }}
          />
        </div>
        
        {/* Unified Search Card styling using Liquid Glass System */}
        <div 
          className={`relative w-full z-10 transition-all duration-300 ${
            isCompact 
              ? `${theme === 'light' ? 'bg-white/80 border-slate-200 shadow-sm' : 'liquid-glass-panel border-white/5 shadow-lg'} rounded-[20px] p-2 pl-4 pr-2 hover:border-slate-300/60` 
              : `${theme === 'light' ? 'bg-white/95 border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.05)]' : 'liquid-glass-panel border-white/10 shadow-[0_12px_45px_rgba(0,0,0,0.5)]'} rounded-2xl md:rounded-[24px] border p-3.5 md:py-4.5 md:px-5 md:h-[170px] hover:border-slate-400/30 hover:shadow-[0_16px_50px_rgba(0,0,0,0.06)] focus-within:shadow-[0_0_80px_rgba(255,255,255,0.7)] focus-within:border-slate-400/50 backdrop-blur-3xl`
          }`}
          style={(!isCompact && theme !== 'light') ? {
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 12px 45px rgba(0, 0, 0, 0.5)'
          } : {}}
        >
          {isCompact ? (
            <div className="flex items-center gap-3 w-full pr-1 py-0.5">
              <Paperclip className={`w-4 h-4 transition-colors flex-shrink-0 cursor-pointer pl-0.5 ${theme === 'light' ? 'text-slate-400 hover:text-slate-800' : 'text-slate-400 hover:text-white'}`} />
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
                placeholder={window.innerWidth < 768 ? "Ask WayaX..." : "Ask WayaX about stocks, entry zones, F&O, portfolio advisory..."}
                className={`flex-1 bg-transparent focus:outline-none text-[12px] font-sans font-semibold h-8 min-w-0 ${theme === 'light' ? 'text-slate-800 placeholder-slate-400' : 'text-slate-100 placeholder-slate-500'}`}
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
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="hidden md:flex items-center gap-1.5 mb-1.5 select-none">
                  <span className={`text-[10px] uppercase tracking-wider font-extrabold font-mono ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-300'}`}>
                    Advisory Terminal
                  </span>
                  <div className={`w-12 h-px bg-gradient-to-r ${theme === 'light' ? 'from-indigo-300 to-transparent' : 'from-indigo-500/40 to-transparent'}`} />
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
                  className={`w-full bg-transparent resize-none focus:outline-none text-[14px] font-sans h-10 md:h-[58px] pt-1 leading-relaxed custom-scroll ${
                    theme === 'light' ? 'text-slate-800 placeholder-slate-400' : 'text-slate-100 placeholder-slate-500'
                  }`}
                />
              </div>

              {/* Bottom line control options strictly mirroring user sketch buttons */}
              <div className={`flex justify-between items-center pt-2 md:pt-3 border-t select-none ${theme === 'light' ? 'border-slate-200' : 'border-white/10'}`}>
                {/* Bottom Left controls */}
                <div className="flex items-center">
                  <div className="relative group/plus">
                    <button
                      type="button"
                      onClick={() => {
                        setInputValue("Give me 3 stocks in IT sector I can buy today");
                      }}
                      className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition cursor-pointer border ${
                        theme === 'light'
                          ? 'bg-slate-100 border-slate-200/80 hover:bg-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 shadow-sm'
                          : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-slate-300 hover:text-white shadow-sm'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover/plus:block border text-[10px] px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl z-10 font-sans pointer-events-none liquid-glass-panel text-indigo-400 border-white/15">
                      Load tech sector query preview
                    </div>
                  </div>
                </div>

                {/* Bottom Center control - aligned in the absolute center */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full border text-[10px] md:text-[11px] font-bold select-none cursor-pointer flex items-center gap-1.5 transition-all duration-200 ${
                    isDropdownOpen
                      ? theme === 'light'
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm'
                        : 'bg-white/15 text-white border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.08)]'
                      : theme === 'light'
                        ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-850'
                        : 'bg-white/[0.03] text-slate-300 border-white/10 hover:text-white hover:bg-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <HelpCircle className="w-3 h-3 md:w-3.5 md:h-3.5 text-indigo-500" />
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
                  className={`w-7.5 h-7.5 md:w-9 md:h-9 rounded-full relative group active:scale-95 flex items-center justify-center transition-all cursor-pointer shadow-lg bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/50 disabled:scale-100 disabled:cursor-not-allowed ${
                    theme === 'light'
                      ? 'disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-300'
                      : 'disabled:opacity-30 disabled:bg-[#151c2f] disabled:border-transparent disabled:text-slate-500'
                  } overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-disabled:hidden" />
                  <ArrowUp className="w-3.5 h-3.5 md:w-4 md:h-4 stroke-[2.5] relative z-10" />
                </button>
              </div>
            </div>
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
    <div className={`flex h-screen font-secondary overflow-hidden relative transition-all duration-350 ${
      theme === 'light' 
        ? 'bg-white text-slate-850' 
        : 'bg-[#0b0c10] text-[#e2e8f0]'
    }`}>
      
      {/* Background is clean and solid as requested */}


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
            ? 'border-slate-200 text-slate-800 bg-white/40 backdrop-blur-[24px] saturate-[130%]' 
            : 'border-white/[0.06] bg-black/15 backdrop-blur-[24px] saturate-[130%]'
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
          <div id="main-chat-viewport" className={`flex-1 overflow-y-auto pt-[84px] md:pt-6 ${getMobilePaddingBottom()} md:py-6 px-3 md:px-4 flex flex-col items-center justify-center relative min-h-0 select-none`}>
            <div className="w-full max-w-5xl md:max-w-[971px] mx-auto z-20 flex flex-col items-center justify-center transition-all duration-300 gap-4 md:gap-6 my-auto">
              {/* Main Titles */}
              <div className="w-full flex flex-col items-center justify-center text-center">
                <div className="flex flex-col items-center justify-center space-y-1 md:space-y-3 text-center select-none font-sans w-full">
                  {/* WayaX App Logo */}
                  <div className="relative mb-1 md:mb-2 group">
                    {/* High-fidelity Apple iPad iPad-style gradient glow with premium mint/emerald green blend */}
                    <div className="absolute -inset-2 bg-gradient-to-tr from-[#10B981] via-[#8B5CF6] to-[#04D4F0] rounded-2xl blur-lg opacity-60 pointer-events-none animate-pulse-slow group-hover:opacity-85 transition-opacity duration-300" />
                    
                    {/* Actual Logo Container */}
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border flex items-center justify-center shadow-lg relative overflow-hidden transition-all duration-350 ${
                      theme === 'light'
                        ? 'border-white/60 bg-white/90 shadow-[0_4px_20px_rgba(149,76,233,0.15)]'
                        : 'border-white/10 bg-black/40 shadow-[0_8px_32px_rgba(0,0,0,0.45)]'
                    }`}>
                      <img 
                        src="https://reduced-beige-7hamqau4r6.edgeone.app/a.png" 
                        className="w-9 h-9 md:w-11 md:h-11 object-contain brightness-110 active:scale-95 transition-transform relative z-10" 
                        alt="WayaX Logo" 
                        referrerPolicy="no-referrer" 
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#954CE9]/10 to-transparent pointer-events-none" />
                    </div>
                  </div>

                  <h1 className={`text-[20px] md:text-[28px] font-extrabold tracking-tight font-sans leading-tight ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                    Welcome to WayaX,{' '}
                    <span className={`block md:inline-block font-black ${theme === 'light' ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400'}`}>{userProfile.name}</span>
                  </h1>
                  <p id="welcome-caption" className={`text-[12px] max-w-[280px] md:max-w-none mx-auto leading-relaxed ${theme === 'light' ? 'text-slate-600 font-medium' : 'text-slate-400'}`} style={{ fontSize: '12px' }}>
                    Select a preset below or enter a custom query <br className="block md:hidden" /> to research breakouts.
                  </p>
                </div>
              </div>

              {/* Combined premium container with smooth white frosted gradient behind both boxes to fully mask background elements */}
              <div className={`w-full relative p-3 md:p-6 rounded-[28px] md:rounded-[36px] border shadow-2xl z-20 space-y-4 md:space-y-6 flex flex-col items-center backdrop-blur-3xl transition-all duration-300 ${
                theme === 'light'
                  ? 'bg-gradient-to-b from-white/95 via-white/45 to-white/10 border-white/80'
                  : 'bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent border-white/[0.05]'
              }`}>
                {/* Centered Search Card */}
                <div className="w-full relative flex-none z-10">
                  {renderUnifiedSearchBar(false)}
                </div>

                {/* Dynamic fully aligned questions list dropdown with same width as search bar */}
                <div className="flex-none md:flex-1 w-full flex flex-col justify-start min-h-0 z-10 animate-fade-in">
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: 8, height: 0 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className={`relative w-full z-30 rounded-2xl md:rounded-[24px] p-3 pb-4.5 md:p-5 space-y-2 md:space-y-3.5 border overflow-hidden ${
                          theme === 'light'
                            ? 'bg-gradient-to-b from-white/95 to-white/75 border-slate-200 text-slate-800'
                            : 'liquid-glass-panel border-white/10 text-slate-100'
                        }`}
                      >
                      {/* Presets Header bar */}
                      <div className={`flex items-center justify-between pb-2 border-b ${theme === 'light' ? 'border-slate-200' : 'border-white/10'}`}>
                        <div className="flex items-center gap-1.5 md:gap-2.5">
                          <img 
                            src="https://reduced-beige-7hamqau4r6.edgeone.app/a.png" 
                            className="w-3.5 h-3.5 md:w-4 md:h-4 object-contain brightness-110" 
                            alt="Waya" 
                            referrerPolicy="no-referrer" 
                          />
                          <span className={`text-[10px] md:text-[11px] font-extrabold tracking-widest uppercase font-mono ${
                            theme === 'light' ? 'text-indigo-600' : 'text-indigo-300'
                          }`}>
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
                              ? theme === 'light'
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                              : theme === 'light'
                                ? 'border-slate-300/80 bg-slate-50 hover:bg-slate-100 text-slate-600'
                                : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white'
                          }`}
                        >
                          <HelpCircle className={`w-3 md:w-3.5 h-3 md:h-3.5 transition-colors duration-200 ${
                            isFaqOpen 
                              ? theme === 'light' ? 'text-indigo-600' : 'text-indigo-300' 
                              : theme === 'light' ? 'text-slate-500' : 'text-indigo-400'
                          }`} />
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
                              ? theme === 'light'
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                                : 'bg-white/15 border-white/30 text-white shadow-[0_0_12px_rgba(255,255,255,0.08)]'
                              : theme === 'light'
                                ? 'bg-slate-50 border-slate-200 hover:bg-slate-100/40 text-slate-650 hover:text-indigo-600'
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
                              ? theme === 'light'
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                                : 'bg-white/15 border-white/30 text-white shadow-[0_0_12px_rgba(255,255,255,0.08)]'
                              : theme === 'light'
                                ? 'bg-slate-50 border-slate-200 hover:bg-slate-100/40 text-slate-650 hover:text-indigo-600'
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
                              ? theme === 'light'
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                                : 'bg-white/15 border-white/30 text-white shadow-[0_0_12px_rgba(255,255,255,0.08)]'
                              : theme === 'light'
                                ? 'bg-slate-50 border-slate-200 hover:bg-slate-100/40 text-slate-655 hover:text-indigo-600'
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
                              ? theme === 'light'
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                                : 'bg-white/15 border-white/30 text-white shadow-[0_0_12px_rgba(255,255,255,0.08)]'
                              : theme === 'light'
                                ? 'bg-slate-50 border-slate-200 hover:bg-slate-100/40 text-slate-650 hover:text-indigo-600'
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
                              ? theme === 'light'
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                                : 'bg-white/15 border-white/30 text-white shadow-[0_0_12px_rgba(255,255,255,0.08)]'
                              : theme === 'light'
                                ? 'bg-slate-50 border-slate-200 hover:bg-slate-100/40 text-slate-650 hover:text-indigo-600'
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
                            className={`w-full font-sans overflow-hidden border-t pt-2.5 ${theme === 'light' ? 'border-slate-200' : 'border-white/5'}`}
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
                                          className={`w-full text-left p-2.5 md:p-3.5 rounded-lg md:rounded-xl border transition-all duration-200 flex items-center justify-between group cursor-pointer shadow-md md:shadow-lg backdrop-blur-[4px] md:backdrop-blur-sm ${
                                            theme === 'light'
                                              ? 'bg-white/70 border-slate-200 hover:bg-slate-50 hover:border-indigo-500/35 text-slate-700 hover:text-indigo-600'
                                              : 'bg-white/[0.02] border-white/10 hover:bg-indigo-900/10 hover:border-indigo-500/30 text-slate-300 hover:text-white'
                                          }`}
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
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between overflow-hidden relative min-h-0 pt-[65px] md:pt-0">
            {/* Scrollable messages and advisory list */}
            <div id="main-chat-viewport" className={`flex-1 overflow-y-auto px-3 md:px-4 py-3 md:py-6 space-y-4 md:space-y-6 ${getChatMobilePaddingBottom(messages)}`}>
              <div className="max-w-5xl md:max-w-[971px] mx-auto space-y-6">
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
                          
                          <div className={`rounded-2xl rounded-tl-none font-secondary space-y-3.5 p-5 md:p-6 shadow-xl w-full border backdrop-blur-3xl transition-all duration-300 ${
                            theme === 'light'
                              ? 'bg-gradient-to-b from-white/95 via-white/45 to-white/10 border-white/80'
                              : 'bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent border-white/[0.05]'
                          }`}>
                            <div className={`text-[13px] font-bold font-sans leading-relaxed tracking-tight ${theme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>
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
                                        ? theme === 'light'
                                          ? 'border-indigo-500/40 bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                                          : 'border-indigo-500/40 bg-indigo-500/[0.06] text-white font-semibold shadow-[0_2px_12px_rgba(99,102,241,0.05)]'
                                        : theme === 'light'
                                          ? 'border-slate-200 bg-slate-50 text-slate-500'
                                          : 'border-white/5 bg-white/[0.01]/40 text-slate-400 opacity-55'
                                    }`}
                                  >
                                    {isSelected ? (
                                      <span className="w-5.5 h-5.5 flex items-center justify-center rounded-md bg-indigo-500 text-white shadow-[0_1px_5px_rgba(99,102,241,0.5)] animate-scale-in">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                      </span>
                                    ) : (
                                      <span className={`w-5.5 h-5.5 flex items-center justify-center font-mono font-bold text-[10px] rounded-md ${
                                        theme === 'light'
                                          ? 'bg-slate-100 border border-slate-200 text-slate-500'
                                          : 'bg-white/[0.05] border border-white/10 text-slate-500'
                                      }`}>
                                        {optIdx + 1}
                                      </span>
                                    )}
                                    <span className={isSelected ? theme === 'light' ? 'text-indigo-900' : 'text-white' : theme === 'light' ? 'text-slate-600' : 'text-slate-350'}>
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
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden bg-transparent z-10 backdrop-blur-md ${
                          theme === 'light'
                            ? 'bg-gradient-to-b from-white/95 via-white/45 to-white/10 border-white/80'
                            : 'bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent border-white/[0.05]'
                        }`}>
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
                        <div className={`px-5 py-4 rounded-2xl text-[12px] line-height-relaxed select-text shadow-xl border backdrop-blur-3xl transition-all duration-300 ${
                          isUser 
                            ? theme === 'light'
                              ? 'bg-indigo-600 border-indigo-500 text-white rounded-tr-none font-secondary shadow-[0_4px_24px_rgba(99,102,241,0.25)]'
                              : 'bg-gradient-to-b from-indigo-600 to-indigo-700 border-indigo-500 text-white rounded-tr-none font-secondary shadow-[0_4px_20px_rgba(255,255,255,0.05)]'
                            : theme === 'light'
                              ? 'bg-gradient-to-b from-white/95 via-white/45 to-white/10 border-white/80 text-slate-850 rounded-tl-none font-secondary space-y-4'
                              : 'bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent border-white/[0.05] text-slate-100 rounded-tl-none font-secondary space-y-4'
                        }`}>
                          {/* Text body with markdown simulation layout support */}
                          <div className={`whitespace-pre-line leading-relaxed font-sans ${theme === 'light' && !isUser ? 'text-slate-800' : 'text-slate-100'}`}>
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
            <footer className={`fixed bottom-0 left-0 right-0 md:relative p-3 md:p-4 z-20 select-none pb-4 md:pb-6 border-t md:border-t-0 animate-fade-in transition-all duration-300 ${
              theme === 'light'
                ? 'bg-white/40 backdrop-blur-[24px] border-slate-200/50 text-slate-800'
                : 'bg-black/15 backdrop-blur-[24px] border-white/[0.06] text-slate-200'
            }`}>
              <div className="max-w-5xl md:max-w-[971px] mx-auto space-y-4">
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
