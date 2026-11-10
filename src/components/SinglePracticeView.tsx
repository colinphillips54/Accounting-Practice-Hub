import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  Tag, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight,
  BookOpen,
  GraduationCap,
  Layers,
  Scale,
  Calculator
} from 'lucide-react';
import { 
  AccountingScenario, 
  PracticeDifficultyCategory, 
  JournalEntryLine, 
  EvaluationResult 
} from '../types/accounting';
import { generatePracticeScenario } from '../utils/practiceQuestionGenerator';
import { JournalEntryForm } from './JournalEntryForm';
import { FeedbackCard } from './FeedbackCard';
import { evaluateJournalEntry } from '../utils/accountingEngine';
import { saveCompletedScenario, recordTopicAttempt, saveMistake, recordPracticeDifficultyAttempt } from '../utils/storage';
import { getAccount } from '../data/accounts';

interface SinglePracticeViewProps {
  onOpenAiTutorWithContext: (scenario: AccountingScenario, userLines: JournalEntryLine[], correctLines: any) => void;
  onRefreshStats: () => void;
  initialTopic?: string;
}

interface DifficultyCategoryConfig {
  id: PracticeDifficultyCategory;
  name: string;
  badge: string;
  description: string;
  topicsSummary: string[];
  accentColor: string;
}

const DIFFICULTY_CATEGORIES: DifficultyCategoryConfig[] = [
  {
    id: 'Beginner',
    name: 'Beginner',
    badge: 'Level 1',
    description: 'Fundamental debits and credits: cash expenses, cash asset purchases, and cash received for sales/services. No adjusting entries.',
    topicsSummary: ['Cash Expenses', 'Cash Asset Purchases', 'Cash Sales & Services', 'Fundamental Debit/Credit Rules'],
    accentColor: 'border-emerald-500 text-emerald-700 bg-emerald-50'
  },
  {
    id: 'Intro Accounting',
    name: 'Intro Accounting',
    badge: 'Level 2',
    description: 'Basic entries plus a larger proportion of adjusting entries: accruals, deferrals, prepaid expenses, unearned revenues, and depreciation.',
    topicsSummary: ['Accrued Expenses & Revenues', 'Prepaid Expenses', 'Unearned Revenues', 'Depreciation & Contra-Assets'],
    accentColor: 'border-blue-500 text-blue-700 bg-blue-50'
  },
  {
    id: 'Intermediate Accounting 1',
    name: 'Intermediate Accounting 1',
    badge: 'Level 3',
    description: 'Advanced financial reporting: LCNRV, Discontinued Operations, OCI, IFRS 15, Warranties, % of Completion, Discounts, Bad Debts, Equity Method, Revaluation, Impairment.',
    topicsSummary: ['LCNRV & Impairment', 'IFRS 15 & % of Completion', 'OCI & Equity Method', 'Warranties, Discounts & Bad Debts'],
    accentColor: 'border-indigo-500 text-indigo-700 bg-indigo-50'
  },
  {
    id: 'Intermediate Accounting 2',
    name: 'Intermediate Accounting 2',
    badge: 'Level 4',
    description: 'Complex financial instruments & liabilities: Asset Retirement Obligations (ARO), Present Value Note Calculations, Bonds (Discounts & Premiums), Stock/Liquidating Dividends, Derivatives, Deferred Taxes, Pensions, Leases (IFRS 16).',
    topicsSummary: ['ARO & PV Notes', 'Bonds (Discount/Premium PV)', 'Derivatives & Deferred Taxes', 'Pensions & Leases (IFRS 16)'],
    accentColor: 'border-purple-500 text-purple-700 bg-purple-50'
  }
];

export const SinglePracticeView: React.FC<SinglePracticeViewProps> = ({
  onOpenAiTutorWithContext,
  onRefreshStats
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PracticeDifficultyCategory>('Beginner');
  
  // Track seen signatures so questions NEVER repeat or cycle through a finite set
  const [seenSignatures, setSeenSignatures] = useState<string[]>([]);
  
  // Current active scenario
  const [currentScenario, setCurrentScenario] = useState<AccountingScenario>(() => {
    const sc = generatePracticeScenario('Beginner', []);
    return sc;
  });

  const [lines, setLines] = useState<JournalEntryLine[]>([
    { id: '1', accountId: '', debit: null, credit: null },
    { id: '2', accountId: '', debit: null, credit: null }
  ]);

  const [showHints, setShowHints] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  // Success celebration banner with details of previous question solved
  const [solvedBanner, setSolvedBanner] = useState<{
    scenario: AccountingScenario;
    explanation: string;
    correctLines: { accountId: string; debit: number; credit: number }[];
  } | null>(null);
  const [showSolvedBreakdown, setShowSolvedBreakdown] = useState(false);

  // Switch category
  const handleSelectCategory = (category: PracticeDifficultyCategory) => {
    if (category === selectedCategory) return;
    setSelectedCategory(category);
    const newSc = generatePracticeScenario(category, seenSignatures);
    setSeenSignatures(prev => [...prev, newSc.title]);
    setCurrentScenario(newSc);
    setLines([
      { id: `l-${Date.now()}-1`, accountId: '', debit: null, credit: null },
      { id: `l-${Date.now()}-2`, accountId: '', debit: null, credit: null }
    ]);
    setEvaluation(null);
    setAttemptCount(0);
    setShowHints(false);
    setSolvedBanner(null);
  };

  // Generate a brand new unique question within the selected category
  const handleGenerateNextQuestion = () => {
    const newSc = generatePracticeScenario(selectedCategory, seenSignatures);
    setSeenSignatures(prev => [...prev, newSc.title]);
    setCurrentScenario(newSc);
    setLines([
      { id: `l-${Date.now()}-1`, accountId: '', debit: null, credit: null },
      { id: `l-${Date.now()}-2`, accountId: '', debit: null, credit: null }
    ]);
    setEvaluation(null);
    setAttemptCount(0);
    setShowHints(false);
  };

  const handleSubmit = () => {
    const nextAttempt = attemptCount + 1;
    const evalResult = evaluateJournalEntry(
      lines,
      currentScenario.correctLines,
      currentScenario,
      nextAttempt,
      3
    );

    // If it's a validation notice (empty, incomplete, or unbalanced), do NOT count as an attempt!
    if (evalResult.isValidationNotice) {
      setEvaluation(evalResult);
      return;
    }

    // Substantive attempt
    setAttemptCount(nextAttempt);
    recordTopicAttempt(currentScenario.topic, evalResult.isCorrect);
    recordPracticeDifficultyAttempt(selectedCategory, evalResult.isCorrect, evalResult.isCorrect);

    if (evalResult.isCorrect) {
      // 1. Save completed progress
      saveCompletedScenario(currentScenario.id);
      onRefreshStats();

      // 2. Capture details for the solved banner
      setSolvedBanner({
        scenario: currentScenario,
        explanation: currentScenario.explanation,
        correctLines: currentScenario.correctLines
      });
      setShowSolvedBreakdown(false);

      // 3. Immediately generate a brand-new unique question in the selected category
      const nextSc = generatePracticeScenario(selectedCategory, [...seenSignatures, currentScenario.title]);
      setSeenSignatures(prev => [...prev, currentScenario.title, nextSc.title]);
      setCurrentScenario(nextSc);
      setLines([
        { id: `l-${Date.now()}-1`, accountId: '', debit: null, credit: null },
        { id: `l-${Date.now()}-2`, accountId: '', debit: null, credit: null }
      ]);
      setEvaluation(null);
      setAttemptCount(0);
      setShowHints(false);
    } else {
      // Incorrect attempt: keep current scenario and show guided feedback
      setEvaluation(evalResult);

      if (nextAttempt >= 3) {
        saveMistake({
          id: `mistake-${Date.now()}`,
          timestamp: Date.now(),
          scenarioId: currentScenario.id,
          scenarioTitle: currentScenario.title,
          topic: currentScenario.topic,
          studentSummary: lines
            .filter(l => l.accountId)
            .map(l => `${l.accountId} (${l.debit ? `Dr $${l.debit}` : `Cr $${l.credit}`})`)
            .join(', '),
          correctSummary: currentScenario.correctLines
            .map(l => `${l.accountId} (${l.debit ? `Dr $${l.debit}` : `Cr $${l.credit}`})`)
            .join(', '),
          feedback: evalResult.issues[0] || 'Entry was not solved within 3 attempts; solution was revealed.'
        });
        onRefreshStats();
      }
    }
  };

  const handleClear = () => {
    setLines([
      { id: `l-${Date.now()}-1`, accountId: '', debit: null, credit: null },
      { id: `l-${Date.now()}-2`, accountId: '', debit: null, credit: null }
    ]);
    setEvaluation(null);
  };

  return (
    <div className="space-y-6">
      {/* Practice Section Header & Category Selection */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                Practice
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Continuous Dynamic Generation
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Practice
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Improve your journal entry skills through interactive questions.
            </p>
          </div>

          {/* Quick Generate New Question Button */}
          <button
            onClick={handleGenerateNextQuestion}
            className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0"
            title="Generate another completely unique question in the selected category"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate New Question</span>
          </button>
        </div>

        {/* 4 Difficulty Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DIFFICULTY_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <span className="text-xs font-bold text-slate-900 leading-tight">
                      {cat.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed mb-2.5 line-clamp-3">
                    {cat.description}
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Key Topics:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cat.topicsSummary.map((top, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100/90 text-slate-700 font-medium"
                      >
                        {top}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Solved Banner: Shown immediately after a student answers correctly */}
      {solvedBanner && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50/90 p-4 sm:p-5 shadow-sm space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-200 text-emerald-900 font-mono">
                    Entry 100% Correct (+1 Solved)
                  </span>
                  <span className="text-xs font-medium text-emerald-800">
                    A brand-new question is ready below!
                  </span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-emerald-950 mt-0.5">
                  Great work! You correctly solved "{solvedBanner.scenario.title}"
                </h3>
              </div>
            </div>

            <button
              onClick={() => setShowSolvedBreakdown(!showSolvedBreakdown)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-100 text-emerald-900 transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>{showSolvedBreakdown ? 'Hide Solution Breakdown' : 'View Solved Journal Entry & Explanation'}</span>
              {showSolvedBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Collapsible Solution Review for Solved Question */}
          {showSolvedBreakdown && (
            <div className="pt-3 border-t border-emerald-200/80 space-y-3 text-xs">
              <div className="bg-white rounded-lg border border-emerald-200 p-3.5 shadow-2xs">
                <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-emerald-600" />
                  Standard Balanced Canadian Journal Entry (ASPE / IFRS):
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-100 pb-1">
                      <th className="text-left font-medium pb-1">Account Title</th>
                      <th className="text-right font-medium pb-1 w-24">Debit</th>
                      <th className="text-right font-medium pb-1 w-24">Credit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {solvedBanner.correctLines.map((line, idx) => {
                      const acc = getAccount(line.accountId);
                      const isCredit = line.credit > 0;
                      return (
                        <tr key={idx} className="py-1">
                          <td className={`py-1 ${isCredit ? 'pl-4 text-slate-700' : 'font-medium text-slate-900'}`}>
                            {acc ? acc.name : line.accountId}
                          </td>
                          <td className="py-1 text-right font-mono-num text-slate-900">
                            {line.debit > 0 ? `$${Math.round(line.debit).toLocaleString()}` : ''}
                          </td>
                          <td className="py-1 text-right font-mono-num text-slate-900">
                            {line.credit > 0 ? `$${Math.round(line.credit).toLocaleString()}` : ''}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-lg bg-emerald-100/60 border border-emerald-200 text-emerald-950 leading-relaxed">
                <span className="font-bold">Accounting Rationale: </span>
                {solvedBanner.explanation}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Scenario Narrative Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-600" />
              {currentScenario.topic}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                currentScenario.difficulty === 'Beginner'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : currentScenario.difficulty === 'Intro Accounting'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : currentScenario.difficulty === 'Intermediate Accounting 1'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'bg-purple-50 text-purple-700 border border-purple-200'
              }`}
            >
              {currentScenario.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 font-mono-num">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-700">{currentScenario.companyName}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {currentScenario.date}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
            {currentScenario.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            {currentScenario.narrative}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200/90 px-3 py-1.5 rounded-lg w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0"></span>
            <span>Round all answers to the nearest whole dollar.</span>
          </div>
        </div>

        {/* Hints Toggle */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => setShowHints(!showHints)}
            className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>{showHints ? 'Hide Guiding Hints' : 'Need a Guiding Hint?'}</span>
            {showHints ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showHints && (
            <div className="mt-2.5 p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
              <div className="font-semibold text-amber-950">Pedagogical Guiding Hints:</div>
              <ul className="list-disc list-inside space-y-1 pl-1">
                {currentScenario.hints.map((hint, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {hint}
                  </li>
                ))}
              </ul>
              {attemptCount < 2 && currentScenario.calculationDetail && (
                <div className="text-[11px] text-amber-800/90 pt-1.5 border-t border-amber-200/70 flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    Use the inputs provided in the question to perform calculations independently. Round all answers to the nearest whole dollar. If needed, the relevant calculation unlocks after 2 incorrect attempts.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Calculation Hint Unlocked Banner (After 2 Incorrect Attempts) */}
      {attemptCount >= 2 && currentScenario.calculationDetail && (
        <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-4 sm:p-5 shadow-xs space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                <Calculator className="w-4 h-4 text-amber-800" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded font-mono">
                    Calculation Hint (Attempt 2 of 3)
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-amber-950 mt-0.5">
                  {currentScenario.calculationDetail.title}
                </h3>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Calculated Value:</div>
              <div className="text-sm sm:text-base font-bold text-amber-950 font-mono-num">
                {currentScenario.calculationDetail.calculatedAmount}
              </div>
            </div>
          </div>

          {/* Formula */}
          <div className="p-2.5 rounded-lg bg-white/95 border border-amber-200 text-xs sm:text-sm">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 mr-2">Formula:</span>
            <span className="font-mono font-semibold text-amber-950">{currentScenario.calculationDetail.formula}</span>
          </div>

          {/* Inputs & Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-white/90 border border-amber-200 space-y-1.5">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-semibold">Inputs from Scenario:</div>
              <ul className="space-y-1 text-slate-700">
                {currentScenario.calculationDetail.inputs.map((inp, idx) => (
                  <li key={idx} className="flex justify-between gap-2 border-b border-slate-50 pb-0.5 last:border-0 last:pb-0">
                    <span className="text-slate-600">{inp.label}:</span>
                    <span className="font-semibold text-slate-900 font-mono-num">{inp.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {currentScenario.calculationDetail.steps && currentScenario.calculationDetail.steps.length > 0 && (
              <div className="p-2.5 rounded-lg bg-white/90 border border-amber-200 space-y-1.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-semibold">Step-by-Step Calculation:</div>
                <ul className="space-y-1 text-slate-800 font-mono text-[11px]">
                  {currentScenario.calculationDetail.steps.map((st, idx) => (
                    <li key={idx} className="text-amber-950 leading-relaxed">
                      • {st}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="text-xs text-amber-900 leading-relaxed pt-1">
            <span className="font-semibold text-amber-950">Calculation Overview: </span>
            {currentScenario.calculationDetail.explanation}
          </div>
        </div>
      )}

      {/* Interactive Journal Entry Form */}
      <JournalEntryForm
        lines={lines}
        onChangeLines={setLines}
        onSubmit={handleSubmit}
        onClear={handleClear}
      />

      {/* Feedback Card if evaluated and not yet solved */}
      {evaluation && (
        <FeedbackCard
          evaluation={evaluation}
          scenario={currentScenario}
          userLines={lines}
          onNextScenario={handleGenerateNextQuestion}
          onTryAgain={() => setEvaluation(null)}
          onOpenAiTutor={() =>
            onOpenAiTutorWithContext(currentScenario, lines, currentScenario.correctLines)
          }
        />
      )}
    </div>
  );
};
