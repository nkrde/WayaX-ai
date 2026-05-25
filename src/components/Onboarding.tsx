import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, TrendingUp, Sun, Moon } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  theme?: 'dark' | 'light';
  setTheme?: (theme: 'dark' | 'light') => void;
}

export default function Onboarding({ onComplete, theme = 'dark', setTheme }: OnboardingProps) {
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [riskTolerance, setRiskTolerance] = useState<UserProfile['riskTolerance']>('Moderate');
  const [investmentHorizon, setInvestmentHorizon] = useState<UserProfile['investmentHorizon']>('Short-Term');
  const [step, setStep] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 0) {
      if (loginMethod === 'otp') {
        if (!phone.trim()) return;
        if (!otpSent) {
          setOtpSent(true);
          return;
        }
        if (!otp.trim()) return;
      } else {
        if (!phone.trim() || !password.trim()) return;
      }
      setStep(1);
    } else if (step === 1) {
      if (!name.trim()) return;
      setStep(2);
    } else {
      onComplete({
        name: name.trim(),
        riskTolerance,
        investmentHorizon,
        targetUpside: '30%+',
        preferredSectors: ['Technology', 'FMCG'],
        hasSetPreferences: true
      });
    }
  };

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen text-[#f1f5f9] flex flex-col md:flex-row font-secondary select-none w-full overflow-hidden relative transition-all duration-350 ${
      isLight ? 'bg-white' : 'bg-[#0b0c10]'
    }`}>

      {/* Background is clean and solid as requested */}


      {/* Left Half: Aesthetic Container displaying the Brand Mark */}
      <div className="flex-1 min-h-[28vh] sm:min-h-[40vh] md:min-h-screen relative flex items-center justify-center z-10 bg-transparent mb-[-33px] md:mb-0">
        
        {/* Sharp High-End Brand Symbol */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-25 select-none cursor-default group flex flex-col items-center justify-center p-4 sm:p-8 active:scale-[0.98] transition-transform duration-300 animate-float"
        >
          <img 
            src="https://reduced-beige-7hamqau4r6.edgeone.app/a.png" 
            alt="WayaX Logo Large" 
            className={`w-24 h-24 sm:w-56 sm:h-56 md:w-80 md:h-80 -mb-5 sm:-mb-10 object-contain ${isLight ? 'opacity-90 drop-shadow-[0_10px_25px_rgba(0,0,0,0.15)] filter brightness-[0.95]' : 'opacity-95 drop-shadow-[0_10px_40px_rgba(0,0,0,0.85)] filter brightness-[1.05] contrast-[1.05]'} transition-transform duration-1000 ease-out group-hover:scale-[1.03] mix-blend-normal`}
            referrerPolicy="no-referrer"
          />
          <p style={{ fontFamily: 'Sora, sans-serif' }} className="text-[20px] sm:text-[31px] font-bold text-white tracking-tight mt-1 sm:mt-1.5">
            WayaX
          </p>
          <div className="text-[10px] sm:text-[11px] text-zinc-400 font-sans text-center leading-relaxed mt-1.5 sm:mt-3 max-w-[240px] opacity-80">
            SEBI-compliant AI research assistant<br />
            RA: INH000010876
          </div>
        </motion.div>
      </div>

      {/* Right Half: Interactive Onboarding Panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-12 md:p-16 relative bg-transparent z-10 mt-[-20px] md:mt-0">
        {/* Subtle background aura on the right pane */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/2 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-sm relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: 'easeOut' }}
            id="onboarding-card"
            className={`w-full rounded-2xl md:rounded-[24px] p-4.5 sm:p-8 relative z-10 border shadow-2xl backdrop-blur-3xl transition-all duration-300 ${
              isLight
                ? 'bg-gradient-to-b from-white/95 via-white/45 to-white/10 border-white/80'
                : 'bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent border-white/[0.05]'
            }`}
          >
            {step === 0 ? (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="text-center space-y-1.5 md:space-y-2">
                  <h2 className={`text-xl md:text-2xl font-bold tracking-tight ${isLight ? 'text-slate-800 font-sans' : 'text-white font-sans'}`}>
                    Get Started
                  </h2>
                  <p className={`text-xs md:text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    Access your personalized advisory.
                  </p>
                  <p className={`text-[10px] md:text-[11px] font-semibold tracking-wider uppercase ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`}>
                    Sign in with Waya Account
                  </p>
                </div>

                <div className="space-y-2.5 md:space-y-3">
                  <div className="relative">
                    <input
                      autoFocus
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number"
                      className={`w-full liquid-glass-input focus:outline-none rounded-lg md:rounded-xl px-3.5 md:px-4 py-2.5 md:py-3.5 ${
                        isLight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-slate-500'
                      } text-xs md:text-sm transition-all`}
                    />
                  </div>
                  {loginMethod === 'password' && (
                    <div className="relative">
                      <input
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className={`w-full liquid-glass-input focus:outline-none rounded-lg md:rounded-xl px-3.5 md:px-4 py-2.5 md:py-3.5 ${
                          isLight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-slate-500'
                        } text-xs md:text-sm transition-all`}
                      />
                    </div>
                  )}
                  {loginMethod === 'otp' && otpSent && (
                    <div className="relative">
                      <input
                        autoFocus
                        required
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className={`w-full liquid-glass-input focus:outline-none rounded-lg md:rounded-xl px-3.5 md:px-4 py-2.5 md:py-3.5 ${
                          isLight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-slate-500'
                        } text-xs md:text-sm transition-all`}
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2.5 md:gap-3">
                  <button
                    type="submit"
                    disabled={loginMethod === 'otp' ? (!phone.trim() || (otpSent && !otp.trim())) : (!phone.trim() || !password.trim())}
                    className={`w-full liquid-glass-button ${isLight ? 'text-slate-800 hover:text-slate-950' : 'text-white'} rounded-lg md:rounded-xl py-2.5 md:py-3.5 text-xs md:text-sm font-semibold transition-all duration-200 border border-white/10 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-lg`}
                  >
                    {loginMethod === 'otp' ? (otpSent ? 'Verify OTP & Continue' : 'Send OTP') : 'Continue with Waya account'}
                    <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod(loginMethod === 'otp' ? 'password' : 'otp');
                      setOtpSent(false);
                      setOtp('');
                    }}
                    className={`text-[11px] md:text-xs text-center transition-colors cursor-pointer block w-full ${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    {loginMethod === 'otp' ? 'Sign in with Password instead' : 'Sign in with OTP instead'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (phone.trim() && (loginMethod === 'otp' ? (otpSent && otp.trim()) : password.trim())) setStep(1);
                    }}
                    disabled={loginMethod === 'otp' ? (!phone.trim() || (otpSent && !otp.trim())) : (!phone.trim() || !password.trim())}
                    className={`w-full bg-transparent hover:bg-black/5 ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'} rounded-lg md:rounded-xl py-2.5 md:py-3.5 text-xs md:text-sm font-semibold transition-colors duration-200 border border-transparent disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center`}
                  >
                    Register
                  </button>
                </div>
              </form>
            ) : step === 1 ? (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="text-center space-y-1.5 md:space-y-2">
                  <h2 id="onboarding-title" className={`text-xl md:text-2xl font-bold tracking-tight ${isLight ? 'text-slate-800 font-sans' : 'text-white font-sans'}`}>
                    What should I call you?
                  </h2>
                  <p className={`text-xs md:text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    This helps me personalize your investment experience.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <input
                      autoFocus
                      required
                      id="onboarding-name-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className={`w-full liquid-glass-input focus:outline-none rounded-lg md:rounded-xl px-3.5 md:px-4 py-2.5 md:py-3.5 ${
                        isLight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-slate-500'
                      } text-xs md:text-sm transition-all`}
                    />
                  </div>
                </div>

                <button
                  id="onboarding-continue-button"
                  type="submit"
                  disabled={!name.trim()}
                  className={`w-full liquid-glass-button ${isLight ? 'text-slate-800 hover:text-slate-950' : 'text-white'} rounded-lg md:rounded-xl py-2.5 md:py-3.5 text-xs md:text-sm font-semibold transition-all duration-200 border border-white/10 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-lg`}
                >
                  Continue
                  <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-500" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="text-center space-y-1.5 md:space-y-2">
                  <h2 className={`text-xl md:text-2xl font-bold tracking-tight ${isLight ? 'text-slate-800' : 'text-white'} flex items-center justify-center gap-2 font-sans`}>
                    Configure Memory
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-indigo-500 animate-pulse" />
                  </h2>
                  <p className={`text-xs md:text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    Hi <span className={`font-semibold ${isLight ? 'text-indigo-600' : 'text-indigo-300'}`}>{name}</span>! Set your guidelines.
                  </p>
                </div>

                {/* Risk Selection */}
                <div className="space-y-1.5 md:space-y-2">
                  <label className={`text-[9px] md:text-[10px] font-extrabold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'} block px-1`}>
                    Risk Tolerance
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                    {(['Low', 'Moderate', 'High', 'Aggressive'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRiskTolerance(r)}
                        className={`px-2.5 py-1.5 md:py-2.5 text-[10px] md:text-xs rounded-lg md:rounded-xl border font-semibold transition-all duration-300 cursor-pointer ${
                          riskTolerance === r
                            ? isLight 
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_4px_15px_rgba(79,70,229,0.25)] scale-[1.02]' 
                              : 'bg-white/10 border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.12)] scale-[1.02]'
                            : isLight 
                              ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800' 
                              : 'bg-black/25 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Horizon Selection */}
                <div className="space-y-1.5 md:space-y-2">
                  <label className={`text-[9px] md:text-[10px] font-extrabold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'} block px-1`}>
                    Investment Horizon
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                    {(['Quick Trade', 'Short-Term', 'Medium-Term', 'Long-Term'] as const).map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setInvestmentHorizon(h)}
                        className={`px-2.5 py-1.5 md:py-2.5 text-[10px] md:text-xs rounded-lg md:rounded-xl border font-semibold transition-all duration-300 cursor-pointer ${
                          investmentHorizon === h
                            ? isLight 
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_4px_15px_rgba(79,70,229,0.25)] scale-[1.02]' 
                              : 'bg-white/10 border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.12)] scale-[1.02]'
                            : isLight 
                              ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800' 
                              : 'bg-black/25 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-1 md:pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className={`w-1/3 bg-transparent hover:bg-black/5 ${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'} rounded-lg md:rounded-xl py-2.5 md:py-3.5 text-xs md:text-sm font-semibold transition-colors border border-transparent cursor-pointer`}
                  >
                    Back
                  </button>
                  <button
                    id="onboarding-setup-complete-button"
                    type="submit"
                    className={`w-2/3 liquid-glass-button ${isLight ? 'text-slate-800 hover:text-slate-950' : 'text-white'} rounded-lg md:rounded-xl py-2.5 md:py-3.5 text-xs md:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg`}
                  >
                    Access Dashboard
                    <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-500" />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
          {step > 0 && (
            <div className="mt-4 md:mt-6 text-center">
              <button 
                type="button" 
                onClick={() => setStep(step - 1)} 
                className={`text-[11px] md:text-xs transition-colors cursor-pointer ${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

