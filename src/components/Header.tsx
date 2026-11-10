import React from 'react';
import { BookOpen, Calculator, FileSpreadsheet, History, Sparkles, ShieldCheck } from 'lucide-react';

export type ActiveTab = 'home' | 'learn' | 'practice' | 'cycle' | 'ifrs' | 'progress';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenAiTutor: () => void;
  completedCount: number;
  streakCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenAiTutor,
  completedCount,
  streakCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner / Platform Info */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-wide uppercase text-[11px] bg-indigo-600/90 px-2 py-0.5 rounded shadow-xs">
              Accounting Practice Hub
            </span>
            <span className="hidden sm:inline text-slate-300">Financial Accounting Practice & Simulation Platform</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-slate-300 text-[11px] sm:text-xs shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{completedCount} <span className="hidden sm:inline">Transactions</span> Mastered</span>
            </span>
            {streakCount > 0 && (
              <span className="hidden md:inline font-mono-num text-amber-300 font-medium">
                ★ {streakCount} Streak
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none group cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-indigo-700 transition-colors shrink-0">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm sm:text-base leading-tight tracking-tight flex items-center gap-1.5">
                Accounting Practice Hub
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Double-Entry & Cycle Simulation
              </div>
            </div>
          </button>

          {/* Nav Tabs for Desktop: 1. Theory, 2. Practice, 3. Cycle Flow, 4. IFRS Application, 5. Review & Progress */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onSelectTab('learn')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'learn'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              Theory
            </button>

            <button
              onClick={() => onSelectTab('practice')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'practice'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calculator className="w-4 h-4 text-indigo-600" />
              Practice
            </button>

            <button
              onClick={() => onSelectTab('cycle')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'cycle'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Cycle Flow
            </button>

            <button
              onClick={() => onSelectTab('ifrs')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'ifrs'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              IFRS Application
            </button>

            <button
              onClick={() => onSelectTab('progress')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'progress'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4 text-purple-600" />
              Review & Progress
            </button>
          </nav>

          {/* Right Action: AI Socratic Tutor button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAiTutor}
              className="px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Open AI Socratic Accounting Tutor for questions or tips"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Ask AI Tutor</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar: 1. Theory, 2. Practice, 3. Cycle Flow, 4. IFRS Application, 5. Review & Progress */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-100 text-xs scrollbar-none">
          <button
            onClick={() => onSelectTab('learn')}
            className={`px-2.5 py-1.5 font-medium rounded whitespace-nowrap cursor-pointer shrink-0 transition-colors ${
              activeTab === 'learn' ? 'bg-slate-200 text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Theory
          </button>
          <button
            onClick={() => onSelectTab('practice')}
            className={`px-2.5 py-1.5 font-medium rounded whitespace-nowrap cursor-pointer shrink-0 transition-colors ${
              activeTab === 'practice' ? 'bg-slate-200 text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Practice
          </button>
          <button
            onClick={() => onSelectTab('cycle')}
            className={`px-2.5 py-1.5 font-medium rounded whitespace-nowrap cursor-pointer shrink-0 transition-colors ${
              activeTab === 'cycle' ? 'bg-slate-200 text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cycle Flow
          </button>
          <button
            onClick={() => onSelectTab('ifrs')}
            className={`px-2.5 py-1.5 font-medium rounded whitespace-nowrap cursor-pointer shrink-0 transition-colors ${
              activeTab === 'ifrs' ? 'bg-slate-200 text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            IFRS Application
          </button>
          <button
            onClick={() => onSelectTab('progress')}
            className={`px-2.5 py-1.5 font-medium rounded whitespace-nowrap cursor-pointer shrink-0 transition-colors ${
              activeTab === 'progress' ? 'bg-slate-200 text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Review & Progress
          </button>
        </div>
      </div>
    </header>
  );
};
