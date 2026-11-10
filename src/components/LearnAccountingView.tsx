import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ArrowRight, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  CheckCircle,
  HelpCircle as QuizIcon,
  Compass,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { THEORY_LESSONS, TheoryLesson } from '../data/theoryLessons';
import { CHART_OF_ACCOUNTS, getAccount } from '../data/accounts';
import { TheoryQuizSection } from './TheoryQuizSection';

interface LearnAccountingViewProps {
  onOpenAiTutor: () => void;
  onGoToPracticeTopic?: (topic: string) => void;
}

type LearnSubView = 'quiz' | 'lessons' | 'explorer' | 'all';

export const LearnAccountingView: React.FC<LearnAccountingViewProps> = ({
  onOpenAiTutor,
  onGoToPracticeTopic
}) => {
  const [activeSubView, setActiveSubView] = useState<LearnSubView>('quiz');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(THEORY_LESSONS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('unearned_service_revenue');

  const selectedLesson = THEORY_LESSONS.find(l => l.id === selectedLessonId) || THEORY_LESSONS[0];
  const selectedAccount = getAccount(selectedAccountId) || CHART_OF_ACCOUNTS[0];

  const filteredLessons = THEORY_LESSONS.filter(l =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Section Heading */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                Theory
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Theory
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Learn accounting concepts and test your understanding.
            </p>
          </div>
        </div>
      </div>

      {/* Top Section Navigation Switcher */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 sm:p-2.5 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveSubView('quiz')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubView === 'quiz'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <QuizIcon className="w-4 h-4 text-amber-300" />
            <span>Multiple-Choice Practice</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
              activeSubView === 'quiz' ? 'bg-indigo-800 text-indigo-100' : 'bg-indigo-50 text-indigo-700'
            }`}>
              Dynamic
            </span>
          </button>

          <button
            onClick={() => setActiveSubView('lessons')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubView === 'lessons'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Theory Lessons & Guides</span>
            <span className="text-[10px] text-slate-400 font-mono-num">
              ({THEORY_LESSONS.length})
            </span>
          </button>

          <button
            onClick={() => setActiveSubView('explorer')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubView === 'explorer'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Account Quick Finder</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setActiveSubView(activeSubView === 'all' ? 'quiz' : 'all')}
            className={`text-xs px-2.5 py-1.5 rounded font-medium border transition-colors cursor-pointer ${
              activeSubView === 'all'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {activeSubView === 'all' ? 'Show Focused View' : 'View All on Single Page'}
          </button>
        </div>
      </div>

      {/* 1. DEDICATED MULTIPLE-CHOICE PRACTICE SECTION */}
      {(activeSubView === 'quiz' || activeSubView === 'all') && (
        <section id="multiple-choice-practice" className="space-y-4">
          <TheoryQuizSection
            onOpenAiTutor={onOpenAiTutor}
          />
        </section>
      )}

      {/* 2. INTERACTIVE ACCOUNT & NORMAL BALANCE EXPLORER */}
      {(activeSubView === 'explorer' || activeSubView === 'all') && (
        <section id="account-explorer" className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  Interactive Reference Tool
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                Normal Balance & Account Quick Finder
              </h2>
              <p className="text-xs text-slate-500">
                Select any account to inspect its classification, normal balance side, and financial statement location.
              </p>
            </div>

            <div className="w-full sm:w-72">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                Choose an Account:
              </label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CHART_OF_ACCOUNTS.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.code} — {a.name} ({a.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected Account Diagnostic Card */}
          <div className="bg-slate-50/70 rounded-xl border border-slate-200/80 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <div className="text-xs text-slate-500 font-mono-num">Account #{selectedAccount.code}</div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">{selectedAccount.name}</h3>
                <p className="text-xs text-slate-600 mt-0.5">{selectedAccount.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    selectedAccount.normalBalance === 'Debit'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  Normal Balance: {selectedAccount.normalBalance}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Classification</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedAccount.category}</div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Increased By</div>
                <div className="font-bold text-emerald-700 text-sm mt-0.5">
                  {selectedAccount.normalBalance === 'Debit' ? 'DEBIT (Left)' : 'CREDIT (Right)'}
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Decreased By</div>
                <div className="font-bold text-rose-700 text-sm mt-0.5">
                  {selectedAccount.normalBalance === 'Debit' ? 'CREDIT (Right)' : 'DEBIT (Left)'}
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Financial Statement</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">
                  {selectedAccount.statement === 'BalanceSheet'
                    ? 'Balance Sheet'
                    : selectedAccount.statement === 'IncomeStatement'
                    ? 'Income Statement'
                    : 'Retained Earnings'}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. MAIN THEORY READER & TABLE OF CONTENTS */}
      {(activeSubView === 'lessons' || activeSubView === 'all') && (
        <section id="theory-lessons" className="space-y-4">
          {/* Quick Quiz Callout Banner when in Lessons mode */}
          {activeSubView === 'lessons' && (
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <QuizIcon className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-indigo-950">
                    Ready to test what you have learned?
                  </h4>
                  <p className="text-xs text-indigo-800">
                    Practice with continuous, dynamically generated multiple-choice questions at randomized difficulty levels.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSubView('quiz')}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
              >
                <span>Go to Multiple-Choice Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar: Table of Contents */}
            <div className="lg:col-span-4 space-y-3">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    Theory Modules
                  </span>
                  <span className="text-xs text-slate-400 font-mono-num">{THEORY_LESSONS.length} Guides</span>
                </div>

                {/* Quick Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search concepts, accruals, rules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* List */}
                <div className="space-y-1 pt-1">
                  {filteredLessons.map((lesson) => {
                    const isActive = lesson.id === selectedLesson.id;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setSelectedLessonId(lesson.id)}
                        className={`w-full p-2.5 rounded-lg text-left transition-colors cursor-pointer flex items-start gap-2.5 ${
                          isActive
                            ? 'bg-indigo-50 border border-indigo-200 text-indigo-950 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                            isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {lesson.number}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate leading-snug">{lesson.title}</div>
                          <div className="text-[11px] text-slate-500 truncate">{lesson.readTime}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick AI Help box */}
              <div className="bg-indigo-900 text-white rounded-xl p-4 shadow-xs space-y-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-300" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                    Have an accounting question?
                  </h4>
                </div>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  Ask our Socratic AI Tutor for conceptual breakdowns, textbook clarification, or custom examples!
                </p>
                <button
                  onClick={onOpenAiTutor}
                  className="w-full py-2 text-xs font-semibold rounded-lg bg-white hover:bg-slate-100 text-indigo-900 transition-colors cursor-pointer shadow-xs"
                >
                  Ask AI Accounting Professor
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              {/* Lesson Header */}
              <div className="border-b border-slate-200 pb-5">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-indigo-600">Module {selectedLesson.number}</span>
                  <span>·</span>
                  <span>{selectedLesson.readTime}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {selectedLesson.title}
                </h1>
                <p className="text-sm text-slate-600 mt-1">{selectedLesson.subtitle}</p>

                {/* Key Rule Callout */}
                <div className="mt-4 p-3 rounded-lg bg-slate-900 text-white font-mono-num text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                  <span>Key Rule: {selectedLesson.keyRule}</span>
                </div>
              </div>

              {/* Lesson Sections */}
              <div className="space-y-8">
                {selectedLesson.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="text-base font-bold text-slate-900 border-l-3 border-indigo-600 pl-3">
                      {sec.heading}
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">{sec.content}</p>

                    {/* Formula Highlight */}
                    {sec.formula && (
                      <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg text-center font-mono-num text-sm font-bold text-indigo-900">
                        {sec.formula}
                      </div>
                    )}

                    {/* Bullet Points */}
                    {sec.bulletPoints && (
                      <ul className="space-y-1.5 pl-2 text-xs sm:text-sm text-slate-700">
                        {sec.bulletPoints.map((bp, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></span>
                            <span className="leading-relaxed">{bp}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Tables if any */}
                    {sec.table && (
                      <div className="overflow-x-auto my-3 border border-slate-200 rounded-lg">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                              {sec.table.headers.map((h, hIdx) => (
                                <th key={hIdx} className="py-2 px-3">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {sec.table.rows.map((r, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-50">
                                {r.map((cell, cIdx) => (
                                  <td key={cIdx} className="py-2 px-3 font-mono-num text-slate-800">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Tip */}
                    {sec.tip && (
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="leading-relaxed">
                          <strong>Pro Study Tip:</strong> {sec.tip}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
