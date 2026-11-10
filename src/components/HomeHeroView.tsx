import React from 'react';
import { 
  Calculator, 
  BookOpen, 
  ShieldCheck, 
  History, 
  ArrowRight, 
  FileSpreadsheet, 
  CheckCircle2, 
  Sparkles, 
  Shuffle, 
  Shield, 
  Scale,
  Zap
} from 'lucide-react';
import { ActiveTab } from './Header';

interface HomeHeroViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onQuickPractice: () => void;
  completedCount: number;
}

export const HomeHeroView: React.FC<HomeHeroViewProps> = ({
  onNavigate,
  onQuickPractice,
  completedCount
}) => {
  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs relative overflow-hidden">
        {/* Background decorative accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/60 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              For University & College Students
            </span>
            <span className="text-slate-500 font-medium">
              No sign-in · No paywalls · 100% Free Practice
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Master University Financial Accounting with Instant Feedback.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Textbook problems only show the final answer. The Accounting Practice Hub lets you journalize randomized business transactions, master debit and credit normal balances, and see your entries flow directly into live T-accounts, trial balances, and financial statements.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('practice')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-sm shadow-indigo-200 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Start Journal Entry Practice</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={() => onNavigate('cycle')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Full Cycle Simulation</span>
            </button>

            <button
              onClick={onQuickPractice}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Shuffle className="w-4 h-4 text-slate-500" />
              <span>Surprise Me (Random)</span>
            </button>
          </div>
        </div>

        {/* Live Equation Banner */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Scale className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>The Fundamental Equation:</span>
            <span className="font-bold text-slate-900 font-mono-num bg-slate-100 px-2.5 py-1 rounded">
              Assets = Liabilities + Shareholders' Equity
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              DEALER Framework
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Canadian Standards (IFRS & ASPE)
            </span>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars Navigation Grid */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
          Explore the Hub
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Theory */}
          <div
            onClick={() => onNavigate('learn')}
            className="group bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                Theory & MCQs
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Study accounting theory and test your knowledge with continuously generated multiple-choice practice questions across 4 difficulty tiers.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Theory & Practice Questions</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Practice */}
          <div
            onClick={() => onNavigate('practice')}
            className="group bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Calculator className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                Journal Practice
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete fictional business transactions, select accounts, enter debits and credits, and get immediate line-by-line feedback with error diagnosis.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
              <span>Practice Scenarios</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Cycle Flow */}
          <div
            onClick={() => onNavigate('cycle')}
            className="group bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-base text-slate-900 group-hover:text-emerald-600 transition-colors">
                Accounting Cycle Flow
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Experience the complete accounting cycle for a Canadian company. Watch your journal entries populate live T-accounts, trial balance, and Statement of Financial Position.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span>Simulate Full Cycle</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: IFRS Application */}
          <div
            onClick={() => onNavigate('ifrs')}
            className="group bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                IFRS Application Cases
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Analyze CPA Canada-style business narratives and appendices, evaluate technical IFRS/IAS criteria, and formulate recommendations with financial statement user impacts.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
              <span>Solve IFRS Cases</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Application of IFRS Feature Banner */}
      <div 
        onClick={() => onNavigate('ifrs')}
        className="group bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-indigo-800/40 hover:border-indigo-500 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
            <Scale className="w-3.5 h-3.5 text-indigo-400" />
            <span>New Feature: CPA Canada Case-Writing</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-indigo-200 transition-colors">
            Application of IFRS — Case Practice & Handbook Navigation
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Bridge the gap between textbook journal entries and professional CPA practice. Analyze detailed business narratives and authentic appendices (contracts, debt covenants, and engineering memos), identify accounting issues, navigate Part I of the CPA Canada Handbook, and formulate technical recommendations.
          </p>
        </div>

        <div className="shrink-0 flex items-center">
          <span className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs flex items-center gap-2">
            <span>Explore IFRS Cases</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>

      {/* Progress & Review Teaser Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <History className="w-4 h-4" />
            <span>Targeted Learning & Mistake Diagnostic</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Never Repeat the Same Journal Entry Mistake.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every time an entry is out of balance or an account is inverted, the platform logs the exact accounting trap in your private Mistake Log so you can re-practice until mastered.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('progress')}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            View Your Progress & Mistakes
          </button>
        </div>
      </div>
    </div>
  );
};
