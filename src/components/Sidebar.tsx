import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, CandlestickChart, Trash2, Edit3, Check, X, Search, 
  Brain, ShieldCheck, HelpCircle, ChevronRight, Settings,
  PanelLeft, User
} from 'lucide-react';
import { ChatHistory, UserProfile } from '../types';

interface SidebarProps {
  chatHistories: ChatHistory[];
  activeChatId: string;
  userProfile: UserProfile;
  isOpen?: boolean;
  onChangeProfile: (profile: UserProfile) => void;
  onSelectChat: (id: string) => void;
  onCreateNewChat: () => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onDeleteChat: (id: string) => void;
  onToggleSidebar?: () => void;
  theme?: 'dark' | 'light';
  setTheme?: (theme: 'dark' | 'light') => void;
  onSignOut?: () => void;
}

export default function Sidebar({
  chatHistories,
  activeChatId,
  userProfile,
  isOpen = true,
  onChangeProfile,
  onSelectChat,
  onCreateNewChat,
  onRenameChat,
  onDeleteChat,
  onToggleSidebar,
  theme = 'dark',
  setTheme,
  onSignOut
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isMemoryExpanded, setIsMemoryExpanded] = useState(false);

  const isLight = theme === 'light';

  // Filtered histories based on search query
  const filteredHistories = chatHistories.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startRename = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(id);
    setEditTitle(currentTitle);
  };

  const saveRename = (id: string, e: React.FormEvent | React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameChat(id, editTitle.trim());
    }
    setEditingChatId(null);
  };

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(null);
  };

  if (!isOpen) {
    return (
      <div 
        id="side-chat-panel" 
        onClick={onToggleSidebar}
        className={`group/panel hidden md:flex w-[68px] flex flex-col items-center h-full select-none py-4 gap-4 cursor-pointer transition-all duration-300 border-r text-slate-100 animate-fade-in backdrop-blur-3xl shadow-2xl ${
          isLight
            ? 'bg-gradient-to-b from-white/95 via-white/45 to-white/10 border-white/80'
            : 'bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent border-white/[0.05]'
        }`}
      >
        {/* Toggle Button & Logo Area */}
        <div className="flex flex-col items-center w-full">
          {onToggleSidebar ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSidebar();
              }}
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                isLight 
                  ? 'bg-white border-slate-200 hover:bg-slate-100' 
                  : 'bg-[#1C1C1E] border-white/5 hover:bg-[#2C2C2E]'
              }`}
              title="Expand left panel"
            >
              {/* Logo (Default Visible, Hidden on Hover) */}
              <img 
                src="https://reduced-beige-7hamqau4r6.edgeone.app/a.png" 
                className="w-6 h-6 object-contain transition-all duration-200 group-hover/panel:scale-50 group-hover/panel:opacity-0 absolute" 
                alt="WayaX Logo" 
                referrerPolicy="no-referrer" 
              />
              
              {/* Expand Icon (Hidden by Default, Visible on Hover) */}
              <PanelLeft 
                className={`w-5 h-5 rotate-180 group-hover/panel:text-white transition-all duration-200 scale-50 opacity-0 group-hover/panel:scale-100 group-hover/panel:opacity-100 absolute ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`} 
              />
            </button>
          ) : (
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0d121d] border-slate-700/30'
            }`}>
              <img src="https://reduced-beige-7hamqau4r6.edgeone.app/a.png" className="w-6 h-6 object-contain" alt="WayaX Logo" referrerPolicy="no-referrer" />
            </div>
          )}
        </div>

        {/* Separator / Divider */}
        <div className={`w-8 h-[1px] ${isLight ? 'bg-slate-200' : 'bg-[#1e293b]'}`}></div>

        {/* New Advisory Chat Plus Icon */}
        <div className="px-2 w-full flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateNewChat();
              if (onToggleSidebar) onToggleSidebar();
            }}
            id="btn-new-chat-collapsed"
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
              isLight
                ? 'liquid-glass-button hover:bg-white/40 border-slate-200 text-slate-800 shadow-sm'
                : 'liquid-glass-button hover:bg-white/[0.08] border-white/10 text-white shadow-[0_2px_8px_rgba(0,0,0,0.2)]'
            }`}
            title="New Advisory Chat"
          >
            <Plus className="w-4 h-4 text-indigo-500" />
          </button>
        </div>

        {/* Chat History Icon List */}
        <div className="flex-1 w-full overflow-y-auto px-1 flex flex-col items-center gap-2 min-h-0 py-2 scrollbar-none">
          {chatHistories.map((chat) => {
            const isActive = chat.id === activeChatId;
            return (
              <button
                key={chat.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectChat(chat.id);
                  if (onToggleSidebar) onToggleSidebar();
                }}
                className={`group relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 border ${
                  isActive 
                    ? isLight 
                      ? 'liquid-glass-button border-slate-300 text-slate-900 shadow-sm' 
                      : 'liquid-glass-button border-white/20 text-white shadow-sm' 
                    : isLight 
                      ? 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800' 
                      : 'bg-transparent border-transparent text-slate-400 hover:bg-white/[0.05] hover:text-slate-100'
                }`}
                title={chat.title}
              >
                {/* Real-time active indicator bar at the left */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-indigo-500 rounded-r"></span>
                )}
                <CandlestickChart className={`w-4 h-4 ${isActive ? 'text-indigo-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
                
                {/* Micro tooltip */}
                <div className={`absolute left-14 text-[10px] px-2.5 py-1.5 rounded-md border whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 shadow-md ${
                  isLight 
                    ? 'bg-white text-slate-800 border-slate-200' 
                    : 'bg-[#0d121f] text-slate-200 border-[#1e293b]'
                }`}>
                  {chat.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Advisory Memory Mini Button at bottom */}
        <div className="w-full flex justify-center px-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleSidebar) onToggleSidebar();
            }}
            className={`group relative w-10 h-10 rounded-lg flex items-center justify-center transition-all border ${
              isLight 
                ? 'bg-white border-slate-200/80 hover:bg-slate-100 shadow-sm' 
                : 'bg-[#1C1C1E] border border-white/10 hover:bg-[#2C2C2E]'
            }`}
            title={`Advisory Profile: ${userProfile.name}`}
          >
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <User className="w-4 h-4 text-purple-500" />

            <div className={`absolute left-14 bottom-0 text-[10px] p-2.5 rounded-md border w-48 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 shadow-md text-left ${
              isLight 
                ? 'bg-white text-slate-800 border-slate-200' 
                : 'bg-[#0d121f] text-slate-200 border-[#1e293b]'
            }`}>
              <span className="font-semibold block text-indigo-600">Memory Profile</span>
              <p className={`text-[10px] mt-0.5 font-sans leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Invests as <span className={`font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{userProfile.name}</span> with a <span className={`font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{userProfile.riskTolerance}</span> risk profile. Click to customize.
              </p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="side-chat-panel" 
      className={`w-80 fixed md:relative left-0 top-0 bottom-0 z-45 flex flex-col h-full select-none transition-all duration-300 border-r shadow-2xl backdrop-blur-3xl ${
        isLight 
          ? 'text-slate-800 bg-gradient-to-b from-white/95 via-white/45 to-white/10 border-white/80' 
          : 'text-slate-100 bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent border-white/[0.05]'
      }`}
    >
      {/* Brand Header */}
      <div className={`p-4 h-[74px] flex items-center justify-between border-b ${isLight ? 'border-slate-200' : 'border-[#1e293b]'}`}>
        <div className="flex items-center gap-2">
          {/* Logo Shield */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0d121d] border-slate-700/30'
          }`}>
            <img src="https://reduced-beige-7hamqau4r6.edgeone.app/a.png" className="w-6 h-6 object-contain" alt="WayaX Logo" referrerPolicy="no-referrer" />
          </div>
          <div>
            <span className={`font-bold tracking-tight font-sans text-sm block ${isLight ? 'text-slate-800' : 'text-white'}`}>WayaX</span>
          </div>
        </div>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className={`p-1.5 rounded-lg border transition-all ${isLight ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-800 border-transparent' : 'bg-[#1C1C1E] border-white/5 text-white hover:bg-[#2C2C2E]'}`}
            title="Collapse left panel"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* New Chat Button & Search */}
      <div className="p-3 space-y-2">
        <button
          onClick={onCreateNewChat}
          id="btn-new-chat"
          className={`w-full rounded-lg py-2.5 px-4 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow border ${
            isLight
              ? 'liquid-glass-button border-slate-200 hover:bg-white/40 text-zinc-800'
              : 'liquid-glass-button border-white/10 text-white hover:bg-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.2)]'
          }`}
        >
          <Plus className="w-4 h-4 text-indigo-500 font-bold" />
          New Advisory Chat
        </button>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-450 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className={`w-full rounded-lg pl-9 pr-4 py-2 text-xs transition-colors border ${
              isLight 
                ? 'liquid-glass-button bg-white/50 border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400' 
                : 'liquid-glass-button bg-white/[0.02] border-white/5 text-white placeholder-slate-500 hover:border-white/10 focus:outline-none focus:border-indigo-500'
            }`}
          />
        </div>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 min-h-0 chat-history-list">
        <div className={`px-2 py-1 text-[10px] font-semibold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Advisory History
        </div>

        {filteredHistories.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No history found
          </div>
        ) : (
          filteredHistories.map((chat) => {
            const isActive = chat.id === activeChatId;
            const isEditing = chat.id === editingChatId;

            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer border ${
                  isActive 
                    ? isLight
                      ? 'liquid-glass-button border-slate-300 text-slate-900 shadow-sm font-semibold'
                      : 'liquid-glass-button border-white/20 text-white shadow-sm'
                    : isLight
                      ? 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                      : 'bg-transparent border-transparent text-slate-400 hover:bg-white/[0.05] hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <CandlestickChart className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-indigo-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  
                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className={`border rounded px-1.5 py-0.5 text-xs focus:outline-none w-full ${
                        isLight 
                          ? 'bg-white border-indigo-400 text-slate-900' 
                          : 'bg-[#0b0f19] border-indigo-500 text-white'
                      }`}
                      autoFocus
                    />
                  ) : (
                    <span className="truncate pr-1">{chat.title}</span>
                  )}
                </div>

                {/* Hover Action buttons */}
                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={(e) => saveRename(chat.id, e)}
                        className="p-0.5 hover:text-emerald-500 text-slate-450"
                        title="Save rename"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={cancelRename}
                        className="p-0.5 hover:text-rose-500 text-slate-450"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={(e) => startRename(chat.id, chat.title, e)}
                        className={`p-0.5 transition ${isLight ? 'hover:text-amber-650 hover:text-slate-800 text-slate-500' : 'hover:text-slate-200 text-slate-500'}`}
                        title="Rename"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                        className={`p-0.5 transition ${isLight ? 'hover:text-rose-600 hover:text-rose-700 text-slate-500' : 'hover:text-rose-450 text-slate-500'}`}
                        title="Delete chat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Memory & Preferences Drawer Container at bottom */}
      <div className={`border-t ${isLight ? 'border-slate-200 liquid-glass-panel' : 'border-white/10 liquid-glass-panel'}`}>
        <div 
          onClick={() => setIsMemoryExpanded(!isMemoryExpanded)} 
          className={`p-3 flex items-center justify-between cursor-pointer transition-all ${
            isLight ? 'hover:bg-white/40' : 'hover:bg-white/[0.04]'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-md flex items-center justify-center border ${
              isLight ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-[#1C1C1E] border-white/10'
            }`}>
              <User className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <span className={`text-xs font-semibold flex items-center gap-1 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                Profile
                <span className={`text-[9px] border px-1 rounded ${
                  isLight ? 'bg-indigo-50 text-indigo-650 border-indigo-200' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                }`}>Active</span>
              </span>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isMemoryExpanded ? 'rotate-90' : ''}`} />
        </div>

        <AnimatePresence>
          {isMemoryExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`px-3 pb-4 space-y-3 overflow-hidden text-xs border-t ${
                isLight ? 'liquid-glass-panel border-slate-200' : 'liquid-glass-panel border-white/5'
              }`}
            >
              <div className={`pt-2 text-[10px] font-mono tracking-wider uppercase flex items-center justify-between ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>Investor Memory Profile</span>
                <Settings className={`w-3 h-3 animate-spin ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`} style={{ animationDuration: '6s' }} />
              </div>

              {/* Memory Form Fields */}
              <div className="space-y-2 pt-1 font-sans">
                {/* Name */}
                <div>
                  <label className={`text-[10px] font-semibold uppercase block mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Name</label>
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => onChangeProfile({ ...userProfile, name: e.target.value })}
                    className={`w-full rounded py-1 px-2 text-xs focus:outline-none border ${
                      isLight 
                        ? 'bg-white border-slate-200 text-slate-900 focus:border-indigo-400' 
                        : 'bg-[#0d121f] border-[#1e293b] text-white focus:border-indigo-500'
                    }`}
                  />
                </div>

                {/* Risk */}
                <div>
                  <label className={`text-[10px] font-semibold uppercase block mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Risk Tolerance</label>
                  <select
                    value={userProfile.riskTolerance}
                    onChange={(e) => onChangeProfile({ ...userProfile, riskTolerance: e.target.value as any })}
                    className={`w-full rounded py-1 px-1.5 text-xs focus:outline-none border ${
                      isLight 
                        ? 'bg-white border-slate-200 text-slate-900 focus:border-indigo-400' 
                        : 'bg-[#0d121f] border-[#1e293b] text-white focus:border-indigo-500 font-sans'
                    }`}
                  >
                    <option value="Low">Low (Capital Preservation)</option>
                    <option value="Moderate">Moderate (Dividend + Growth)</option>
                    <option value="High">High (Momentum Breakouts)</option>
                    <option value="Aggressive">Aggressive (F&O / Microcaps)</option>
                  </select>
                </div>

                {/* Horizon */}
                <div>
                  <label className={`text-[10px] font-semibold uppercase block mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Investment Horizon</label>
                  <select
                    value={userProfile.investmentHorizon}
                    onChange={(e) => onChangeProfile({ ...userProfile, investmentHorizon: e.target.value as any })}
                    className={`w-full rounded py-1 px-1.5 text-xs focus:outline-none border ${
                      isLight 
                        ? 'bg-white border-slate-200 text-slate-900 focus:border-indigo-400' 
                        : 'bg-[#0d121f] border-[#1e293b] text-white focus:border-indigo-500 font-sans'
                    }`}
                  >
                    <option value="Quick Trade">Quick Trade (1-3 weeks)</option>
                    <option value="Short-Term">Short-Term (3-6 months)</option>
                    <option value="Medium-Term">Medium-Term (6-12 months)</option>
                    <option value="Long-Term">Long-Term (1-3 years)</option>
                  </select>
                </div>
              </div>

              <div className={`text-[10px] rounded p-2 flex items-center gap-1.5 mt-2 border ${
                isLight 
                  ? 'text-indigo-600 bg-indigo-50/50 border-indigo-100' 
                  : 'text-[#4f46e5]/80 bg-[#4f46e5]/15 border border-[#4f46e5]/10'
              }`}>
                <HelpCircle className="w-3.5 h-3.5 flex-shrink-0 text-indigo-500" />
                <span>Memory is attached to all outbound AI queries automatically.</span>
              </div>

              {onSignOut && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSignOut();
                  }}
                  className={`w-full mt-3 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-200 ${
                    isLight
                      ? 'bg-rose-50 border-rose-100 text-rose-650 hover:bg-rose-100'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                  }`}
                >
                  Sign Out & Reset
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
