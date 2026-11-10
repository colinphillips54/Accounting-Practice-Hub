import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  History, 
  Trash2, 
  ArrowRight, 
  BookOpen, 
  Target, 
  GraduationCap, 
  Calculator, 
  FileSpreadsheet, 
  ShieldCheck, 
  Flame, 
  Layers, 
  TrendingUp, 
  Award
} from 'lucide-react';
import { MistakeRecord } from '../types/accounting';
import { 
  loadCompletedScenarios, 
  loadMistakeLog, 
  loadTopicStats, 
  removeMistake, 
  clearAllProgress,
  loadTheoryStats,
  loadPracticeDifficultyStats,
  loadCycleStats,
  loadIfrsCaseRecords,
  TheoryDifficultyStat,
  PracticeDifficultyStat,
  CycleCasePerformance,
  IfrsCaseRecord
} from '../utils/storage';

interface ProgressViewProps {
  onGoToPracticeTopic: (topic: string) => void;
  onRefresh: () => void;
  onNavigateTab?: (tab: 'home' | 'learn' | 'practice' | 'cycle' | 'ifrs' | 'progress') => void;
}

const THEORY_LEVELS = [
  { id: 'Beginner', name: 'Beginner', level: 'Level 1', desc: 'Rules of debit/credit, account types & fundamental accounting equation' },
  { id: 'Intro Accounting', name: 'Intro Accounting', level: 'Level 2', desc: 'Accruals, deferrals, depreciation concepts & unearned revenues' },
  { id: 'Intermediate Accounting 1', name: 'Intermediate Accounting 1', level: 'Level 3', desc: 'LCNRV, IFRS 15 revenue recognition, OCI & discontinued operations' },
  { id: 'Intermediate Accounting 2', name: 'Intermediate Accounting 2', level: 'Level 4', desc: 'ARO, complex bond amortizations, deferred taxes & IFRS 16 leases' }
] as const;

const PRACTICE_LEVELS = [
  { id: 'Beginner', name: 'Beginner', level: 'Level 1', desc: 'Cash expenses, asset purchases & sales journal entries' },
  { id: 'Intro Accounting', name: 'Intro Accounting', level: 'Level 2', desc: 'Adjusting entries, accruals, deferrals & depreciation contra-assets' },
  { id: 'Intermediate Accounting 1', name: 'Intermediate Accounting 1', level: 'Level 3', desc: 'LCNRV adjustments, warranties, % of completion & bad debt allowances' },
  { id: 'Intermediate Accounting 2', name: 'Intermediate Accounting 2', level: 'Level 4', desc: 'Present value note entries, bond discounts/premiums & lease entries' }
] as const;

export const ProgressView: React.FC<ProgressViewProps> = ({
  onGoToPracticeTopic,
  onRefresh,
  onNavigateTab
}) => {
  const [completedScenarios, setCompletedScenarios] = useState(loadCompletedScenarios());
  const [mistakes, setMistakes] = useState(loadMistakeLog());
  const [topicStats, setTopicStats] = useState(loadTopicStats());
  const [theoryStats, setTheoryStats] = useState<Record<string, TheoryDifficultyStat>>(loadTheoryStats());
  const [practiceDiffStats, setPracticeDiffStats] = useState<Record<string, PracticeDifficultyStat>>(loadPracticeDifficultyStats());
  const [cycleStats, setCycleStats] = useState<Record<string, CycleCasePerformance>>(loadCycleStats());
  const [ifrsRecords, setIfrsRecords] = useState<IfrsCaseRecord[]>(loadIfrsCaseRecords());
  const [activeAreaFilter, setActiveAreaFilter] = useState<'all' | 'theory' | 'practice' | 'cycle' | 'ifrs'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Overall calculations across all practice areas
  // 1. Practice metrics
  const practiceAttempts = Object.values(topicStats).reduce((s, t) => s + t.totalAttempts, 0);
  const practiceCorrect = Object.values(topicStats).reduce((s, t) => s + t.correctAttempts, 0);

  // 2. Theory metrics
  const theoryAttempts = Object.values(theoryStats).reduce((s, t) => s + t.totalAttempts, 0);
  const theoryCorrect = Object.values(theoryStats).reduce((s, t) => s + t.correctAttempts, 0);

  // 3. Cycle Flow metrics
  const cycleCasesList = Object.values(cycleStats);
  const totalCycleAttempts = cycleCasesList.reduce((s, c) => s + c.totalAttempts, 0);
  const correctCycleAttempts = cycleCasesList.reduce((s, c) => s + c.correctAttempts, 0);
  const completedCycleTransactions = cycleCasesList.reduce((s, c) => s + c.completedTransactions, 0);
  const completedCycleCasesCount = cycleCasesList.filter(c => c.isCompleted).length;

  // 4. IFRS metrics
  const ifrsSubmissionsCount = ifrsRecords.length;
  const ifrsAverageScore = ifrsSubmissionsCount > 0
    ? Math.round(ifrsRecords.reduce((s, r) => s + r.overallScore, 0) / ifrsSubmissionsCount)
    : 0;

  // Combined overall accuracy across all interactive attempts
  const allAttempts = practiceAttempts + theoryAttempts + totalCycleAttempts;
  const allCorrect = practiceCorrect + theoryCorrect + correctCycleAttempts;
  const overallAccuracy = allAttempts > 0 ? Math.round((allCorrect / allAttempts) * 100) : 0;

  // Total activities completed count
  const totalCompletedActivities = completedScenarios.length + completedCycleTransactions + ifrsSubmissionsCount;

  const handleRemoveMistake = (id: string) => {
    removeMistake(id);
    setMistakes(loadMistakeLog());
    onRefresh();
  };

  const handleClearAll = () => {
    clearAllProgress();
    setCompletedScenarios([]);
    setMistakes([]);
    setTopicStats({});
    setTheoryStats({});
    setPracticeDiffStats({});
    setCycleStats({});
    setIfrsRecords([]);
    setShowClearConfirm(false);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Review & Progress Section Heading */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-purple-600" />
                Review & Progress
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Review & Progress
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Track your performance and identify areas for improvement.
            </p>
          </div>

          {/* Area Navigation Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
            <button
              onClick={() => setActiveAreaFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeAreaFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Hub Areas
            </button>
            <button
              onClick={() => setActiveAreaFilter('theory')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                activeAreaFilter === 'theory'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Theory
            </button>
            <button
              onClick={() => setActiveAreaFilter('practice')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                activeAreaFilter === 'practice'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              Practice
            </button>
            <button
              onClick={() => setActiveAreaFilter('cycle')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                activeAreaFilter === 'cycle'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Cycle Flow
            </button>
            <button
              onClick={() => setActiveAreaFilter('ifrs')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                activeAreaFilter === 'ifrs'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              IFRS Application
            </button>
          </div>
        </div>
      </div>

      {/* Top-Level KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Scenarios Mastered</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono-num">
            {completedScenarios.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Unique Transactions</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Overall Accuracy</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono-num">
            {allAttempts > 0 ? `${overallAccuracy}%` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono-num truncate">
            {allCorrect} of {allAttempts} Attempts Correct
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Active Practice Hub Areas</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono-num">
            {[
              theoryAttempts > 0,
              practiceAttempts > 0,
              totalCycleAttempts > 0,
              ifrsSubmissionsCount > 0
            ].filter(Boolean).length}/4
          </div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-1 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Curriculum Domains</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Diagnostic Log</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono-num">
            {mistakes.length}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Targeted Learning Traps</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. THEORY (MULTIPLE CHOICE QUESTIONS) BREAKDOWN */}
      {/* ========================================================= */}
      {(activeAreaFilter === 'all' || activeAreaFilter === 'theory') && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                <h3 className="text-base font-bold text-slate-900">
                  Theory Performance (Multiple-Choice Questions)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Track conceptual understanding across all four multiple-choice difficulty levels.
              </p>
            </div>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('learn')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                <span>Practice Theory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {THEORY_LEVELS.map(tier => {
              const stat = theoryStats[tier.id] || { totalAttempts: 0, correctAttempts: 0, bestStreak: 0 };
              const hasAttempts = stat.totalAttempts > 0;
              const pct = hasAttempts ? Math.round((stat.correctAttempts / stat.totalAttempts) * 100) : 0;

              return (
                <div 
                  key={tier.id} 
                  className={`p-3.5 rounded-xl border transition-all ${
                    hasAttempts ? 'bg-indigo-50/30 border-indigo-200/80' : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                      {tier.level}
                    </span>
                    {hasAttempts && stat.bestStreak > 0 && (
                      <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-0.5" title="Best streak">
                        <Flame className="w-3 h-3 text-amber-500" />
                        <span>{stat.bestStreak} streak</span>
                      </span>
                    )}
                  </div>

                  <div className="font-bold text-sm text-slate-900 leading-tight">
                    {tier.name}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {tier.desc}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 font-medium">
                        {hasAttempts ? `${stat.correctAttempts}/${stat.totalAttempts} correct` : 'Not yet attempted'}
                      </span>
                      <span className="font-bold text-slate-900 font-mono-num">
                        {hasAttempts ? `${pct}%` : '—'}
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          !hasAttempts 
                            ? 'bg-transparent'
                            : pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. PRACTICE (JOURNAL ENTRIES) BREAKDOWN */}
      {/* ========================================================= */}
      {(activeAreaFilter === 'all' || activeAreaFilter === 'practice') && (
        <div className="space-y-4">
          {/* Difficulty Tier Breakdown for Practice */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <h3 className="text-base font-bold text-slate-900">
                    Practice Performance (Journal Entry Questions)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Performance across all four difficulty levels, including correct and incorrect attempts.
                </p>
              </div>
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('practice')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <span>Practice Journal Entries</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PRACTICE_LEVELS.map(tier => {
                const stat = practiceDiffStats[tier.id] || { totalAttempts: 0, correctAttempts: 0, completedCount: 0 };
                const hasAttempts = stat.totalAttempts > 0;
                const incorrect = stat.totalAttempts - stat.correctAttempts;
                const pct = hasAttempts ? Math.round((stat.correctAttempts / stat.totalAttempts) * 100) : 0;

                return (
                  <div 
                    key={tier.id} 
                    className={`p-3.5 rounded-xl border transition-all ${
                      hasAttempts ? 'bg-blue-50/30 border-blue-200/80' : 'bg-slate-50/60 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                        {tier.level}
                      </span>
                      {hasAttempts && (
                        <span className="text-[11px] text-slate-500 font-mono-num">
                          {stat.totalAttempts} total attempts
                        </span>
                      )}
                    </div>

                    <div className="font-bold text-sm text-slate-900 leading-tight">
                      {tier.name}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {tier.desc}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Accuracy</span>
                        <span className="font-bold text-slate-900 font-mono-num">
                          {hasAttempts ? `${pct}%` : '—'}
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            !hasAttempts 
                              ? 'bg-transparent'
                              : pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 font-mono-num">
                        <span className="text-emerald-700 font-medium">✓ {stat.correctAttempts} Correct</span>
                        <span className="text-rose-600 font-medium">✕ {incorrect} Incorrect</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Topic Mastery & Proficiency Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Topic Mastery & Proficiency
                </h3>
                <p className="text-xs text-slate-500">
                  Track your performance across all fundamental accounting syllabus topics.
                </p>
              </div>
            </div>

            {Object.keys(topicStats).length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs sm:text-sm">
                No topic attempts recorded yet. Practice journal entries to see your topic breakdown!
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(topicStats).map(([topic, stat]) => {
                  const pct = Math.round((stat.correctAttempts / stat.totalAttempts) * 100);
                  return (
                    <div key={topic} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <div className="font-semibold text-xs sm:text-sm text-slate-900">
                          {topic}
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-slate-500 font-mono-num">
                            {stat.correctAttempts}/{stat.totalAttempts} ({pct}%)
                          </span>
                          <button
                            onClick={() => onGoToPracticeTopic(topic)}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Practice</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. CYCLE FLOW (ACCOUNTING CYCLE CASES) BREAKDOWN */}
      {/* ========================================================= */}
      {(activeAreaFilter === 'all' || activeAreaFilter === 'cycle') && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <h3 className="text-base font-bold text-slate-900">
                  Cycle Flow Performance (Accounting Cycle Cases)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete accounting cycle execution: journalizing, general ledger posting, and trial balance generation.
              </p>
            </div>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('cycle')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                <span>Open Cycle Flow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {cycleCasesList.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500 text-xs sm:text-sm">
              <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-800">No Accounting Cycle Cases Attempted Yet</p>
              <p className="text-xs text-slate-500 mt-0.5 max-w-md mx-auto">
                Head to Cycle Flow to practice the complete accounting cycle—from recording initial journal entries to posting to the general ledger and reviewing financial statements.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-2">
                <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <div className="text-[11px] text-slate-500">Cases Completed</div>
                  <div className="text-lg font-bold text-emerald-950 font-mono-num">{completedCycleCasesCount} / {cycleCasesList.length}</div>
                </div>
                <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <div className="text-[11px] text-slate-500">Transactions Solved</div>
                  <div className="text-lg font-bold text-slate-900 font-mono-num">{completedCycleTransactions}</div>
                </div>
                <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <div className="text-[11px] text-slate-500">Cycle Accuracy</div>
                  <div className="text-lg font-bold text-slate-900 font-mono-num">
                    {totalCycleAttempts > 0 ? `${Math.round((correctCycleAttempts / totalCycleAttempts) * 100)}%` : '—'}
                  </div>
                </div>
                <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <div className="text-[11px] text-slate-500">Cycle Attempts</div>
                  <div className="text-lg font-bold text-slate-900 font-mono-num">{totalCycleAttempts}</div>
                </div>
              </div>

              {cycleCasesList.map(c => {
                const pct = c.totalTransactions > 0
                  ? Math.round((c.completedTransactions / c.totalTransactions) * 100)
                  : 0;
                const accuracy = c.totalAttempts > 0
                  ? Math.round((c.correctAttempts / c.totalAttempts) * 100)
                  : 0;

                return (
                  <div key={c.caseId} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          c.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {c.isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                        <span className="font-bold text-xs sm:text-sm text-slate-900">{c.caseTitle}</span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono-num">
                        {c.completedTransactions} of {c.totalTransactions} Transactions Solved ({pct}%)
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span className="font-mono-num">
                        Accuracy: <strong className="text-slate-800">{accuracy}%</strong> ({c.correctAttempts}/{c.totalAttempts} attempts correct)
                      </span>
                      {onNavigateTab && (
                        <button
                          onClick={() => onNavigateTab('cycle')}
                          className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                        >
                          <span>{c.isCompleted ? 'Review Case' : 'Continue Case'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. IFRS APPLICATION (CPA-STYLE CASES) BREAKDOWN */}
      {/* ========================================================= */}
      {(activeAreaFilter === 'all' || activeAreaFilter === 'ifrs') && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                <h3 className="text-base font-bold text-slate-900">
                  IFRS Application Performance (CPA Case Scenarios)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluation of case submissions, average scores, CPA competency status, and recent case performance.
              </p>
            </div>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('ifrs')}
                className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                <span>Analyze IFRS Cases</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {ifrsSubmissionsCount === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500 text-xs sm:text-sm">
              <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-800">No IFRS Case Evaluations Submitted Yet</p>
              <p className="text-xs text-slate-500 mt-0.5 max-w-md mx-auto">
                Navigate to IFRS Application to draft a memo on a Canadian business case. Once submitted, your analysis will be graded and displayed here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-100">
                  <div className="text-[11px] text-slate-500">Cases Evaluated</div>
                  <div className="text-xl font-bold text-purple-950 font-mono-num">{ifrsSubmissionsCount}</div>
                </div>
                <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-100">
                  <div className="text-[11px] text-slate-500">Average Case Score</div>
                  <div className="text-xl font-bold text-purple-950 font-mono-num">{ifrsAverageScore}/100</div>
                </div>
                <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-100 col-span-2 sm:col-span-1">
                  <div className="text-[11px] text-slate-500">CPA Status Distribution</div>
                  <div className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-2">
                    <span className="text-emerald-700">
                      {ifrsRecords.filter(r => r.overallPerformance === 'Competent').length} Competent
                    </span>
                    <span>·</span>
                    <span className="text-amber-700">
                      {ifrsRecords.filter(r => r.overallPerformance === 'Reaching Competent').length} Reaching
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Evaluated Cases Log */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-semibold text-slate-700">Recent Evaluated Cases:</div>
                <div className="space-y-2">
                  {ifrsRecords.slice(0, 5).map(record => (
                    <div key={record.id} className="p-3 bg-white rounded-lg border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900">{record.caseTitle}</div>
                        <div className="text-[11px] text-slate-500 font-mono-num mt-0.5">
                          {new Date(record.timestamp).toLocaleDateString()} · {record.totalIssues} issue(s) evaluated
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          record.overallPerformance === 'Competent'
                            ? 'bg-emerald-100 text-emerald-800'
                            : record.overallPerformance === 'Reaching Competent'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {record.overallPerformance} ({record.overallScore}/100)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MISTAKE LOG & DIAGNOSTIC TRAPS */}
      {/* ========================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Mistake Log & Targeted Review</span>
            </h3>
            <p className="text-xs text-slate-500">
              Learn from your errors. Every mistake is diagnosed so you don't repeat it on your exams.
            </p>
          </div>

          {mistakes.length > 0 && (
            <button
              onClick={() => {
                mistakes.forEach(m => removeMistake(m.id));
                setMistakes([]);
                onRefresh();
              }}
              className="text-xs text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              Clear Mistake Log
            </button>
          )}
        </div>

        {mistakes.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-lg text-slate-500 text-xs sm:text-sm">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-800">Your Mistake Log is Empty!</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Great job! When you make an error during journal entry practice, it will be logged here with targeted feedback.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {mistakes.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                      {m.topic}
                    </span>
                    <span className="font-bold text-slate-900">{m.scenarioTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono-num">
                      {new Date(m.timestamp).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleRemoveMistake(m.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                      title="Dismiss this mistake"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                  <strong className="text-amber-900 block mb-0.5">Diagnostic Feedback:</strong>
                  {m.feedback}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500 font-mono-num text-[11px] truncate max-w-md">
                    Expected: {m.correctSummary}
                  </span>
                  <button
                    onClick={() => onGoToPracticeTopic(m.topic)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>Practice Topic</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* RESET ALL PROGRESS */}
      {/* ========================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Reset Local Progress</h4>
          <p className="text-xs text-slate-500">
            Clear all saved progress across Theory, Practice, Cycle Flow, and IFRS Application stored in this browser session.
          </p>
        </div>

        {!showClearConfirm ? (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Reset All Progress
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-rose-700 font-semibold">Are you sure?</span>
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
            >
              Yes, Reset Everything
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
