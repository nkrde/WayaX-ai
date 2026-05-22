export interface StockRecommendation {
  id: string;
  stockName: string;
  ticker: string;
  action: 'BUY' | 'SHORT' | 'HOLD';
  priceRange: string;
  targetPrice: string;
  stopLoss: string;
  targetUpside: string;
  tenure: string;
  technical: {
    rdxScore: number;
    rsiWeekly: number;
    adxWeekly: number;
    ema50_200: string;
    return1M: string;
    return3M: string;
    return1Y: string;
    volatility30D: string;
  };
  fundamental: {
    peRatio: number;
    pbRatio: number;
    roe: string;
    roce: string;
    debtEquity: string;
    fiiHolding: string;
    opm: string;
    profitGrowth3Y: string;
  };
  thesis: string;
}

export interface UserProfile {
  name: string;
  riskTolerance: 'Low' | 'Moderate' | 'High' | 'Aggressive';
  investmentHorizon: 'Quick Trade' | 'Short-Term' | 'Medium-Term' | 'Long-Term';
  targetUpside: string;
  preferredSectors: string[];
  hasSetPreferences: boolean;
}

export interface SurveyQuestion {
  id: 'horizon' | 'risk';
  text: string;
  options: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  stocks?: StockRecommendation[];
  latency?: string;
  isSurvey?: boolean;
  surveyQuestion?: SurveyQuestion;
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: string;
}
