import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  RotateCcw, 
  Lightbulb,
  Info,
  Compass,
  Calculator
} from 'lucide-react';
import { EvaluationResult, AccountingScenario, JournalEntryLine } from '../types/accounting';
import { getAccount } from '../data/accounts';

interface FeedbackCardProps {
  evaluation: EvaluationResult;
  scenario: AccountingScenario;
  userLines: JournalEntryLine[];
  onNextScenario: () => void;
  onTryAgain?: () => void;
  onOpenAiTutor: () => void;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  evaluation,
  scenario,
  userLines,
  onNextScenario,
  onTryAgain,
  onOpenAiTutor
}) => {
  const isCorrect = evaluation.isCorrect;
  const isValidation = Boolean(evaluation.isValidationNotice);
  const attemptNumber = evaluation.attemptNumber || 1;
  const maxAttempts = evaluation.maxAttempts || 3;
  const shouldRevealSolution = isCorrect || attemptNumber >= maxAttempts;

  // 1. VALIDATION NOTICE (Empty, Incomplete, Unbalanced - Does NOT count as an attempt)
  if (isValidation) {
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-4 sm:p-5 shadow-xs text-amber-950 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-1 flex-1">
            <h4 className="font-bold text-sm sm:text-base text-amber-900 leading-tight">
              {evaluation.validationTitle || 'Please Check Your Entry'}
            </h4>
            <div className="space-y-1 text-xs sm:text-sm text-amber-800 leading-relaxed">
              {evaluation.issues.map((issue, idx) => (
                <p key={idx}>{issue}</p>
              ))}
            </div>
            <p className="text-[11px] text-amber-700 font-medium pt-1">
              ℹ️ This check did not count against your 3 practice attempts. Complete or balance your entry and try submitting again.
            </p>
          </div>
        </div>

        {onTryAgain && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={onTryAgain}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-lg bg-amber-700 hover:bg-amber-800 text-white transition-colors cursor-pointer"
            >
              Adjust Entry
            </button>
          </div>
        )}
      </div>
    );
  }

  // 2. GUIDED FEEDBACK MODE (Attempts 1 and 2: Helpful hints WITHOUT revealing the solution table)
  if (!shouldRevealSolution) {
    // ATTEMPT 2 OF 3: Display ONLY the calculation for the relevant account amount.
    // Keep account names, debit and credit selections, and complete journal entry solution hidden.
    if (attemptNumber === 2) {
      const calc = evaluation.calculationDetail || scenario.calculationDetail;
      return (
        <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-4 sm:p-6 shadow-xs space-y-5 animate-in fade-in duration-200">
          {/* Header with Attempt Tracker */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-200/80">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                <Calculator className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 font-mono">
                    Attempt 2 of {maxAttempts} · Calculation Unlocked
                  </span>
                  <span className="text-xs text-amber-800 font-medium">
                    1 attempt remaining before answer and complete solution are revealed
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-amber-950 mt-1">
                  Incorrect Attempt 2 of 3 — Calculation Hint
                </h3>
                <p className="text-xs text-amber-900/80 mt-0.5">
                  Here is the calculation for the relevant account amount. Account names, debit/credit selections, and the complete solution remain hidden.
                </p>
              </div>
            </div>

            {/* Quick Action */}
            {onTryAgain && (
              <button
                onClick={onTryAgain}
                className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-amber-700 hover:bg-amber-800 text-white flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Adjust & Try Again</span>
              </button>
            )}
          </div>

          {/* Relevant Calculation Card (Only calculation, formula, inputs, and calculated amount) */}
          {calc ? (
            <div className="rounded-xl border border-amber-200/80 bg-white/95 p-4 sm:p-5 shadow-2xs space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-mono">
                    Relevant Amount Calculation
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                    {calc.title}
                  </h4>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Calculated Amount:</div>
                  <div className="text-base font-bold text-amber-900 font-mono-num">{calc.calculatedAmount}</div>
                </div>
              </div>

              {/* Formula */}
              <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/70 text-xs sm:text-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 mr-2">Formula:</span>
                <span className="font-mono font-semibold text-amber-950">{calc.formula}</span>
              </div>

              {/* Inputs & Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-1.5">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-semibold">Inputs from Scenario:</div>
                  <ul className="space-y-1 text-slate-700">
                    {calc.inputs.map((inp, idx) => (
                      <li key={idx} className="flex justify-between gap-2 border-b border-slate-100 pb-0.5 last:border-0 last:pb-0">
                        <span className="text-slate-600">{inp.label}:</span>
                        <span className="font-semibold text-slate-900 font-mono-num">{inp.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {calc.steps && calc.steps.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-1.5">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-semibold">Step-by-Step Math:</div>
                    <ul className="space-y-1 text-slate-800 font-mono text-[11px]">
                      {calc.steps.map((st, idx) => (
                        <li key={idx} className="leading-relaxed">
                          • {st}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Calculation explanation (pure math, no account names/sides) */}
              <div className="text-xs text-slate-700 leading-relaxed pt-1 border-t border-slate-100">
                <span className="font-semibold text-slate-900">Calculation Overview: </span>
                {calc.explanation}
              </div>
            </div>
          ) : null}

          {/* Student task reminder note */}
          <div className="p-3 rounded-lg bg-white/80 border border-amber-200 text-xs text-amber-950 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Your Task:</strong> Use this calculated amount to complete your entry. Round all answers to the nearest whole dollar. You must independently determine which accounts are affected and whether each account is debited or credited. Account titles, debit/credit sides, and the full journal entry solution will only be revealed if needed on attempt 3.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-amber-200/80">
            <span className="text-amber-900/80">
              Attempt 2 of {maxAttempts}. You have 1 attempt remaining before the full solution is revealed.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAiTutor}
                className="text-xs font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-amber-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Ask AI Tutor for a clue</span>
              </button>
              {onTryAgain && (
                <button
                  onClick={onTryAgain}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-700 hover:bg-amber-800 text-white transition-colors cursor-pointer"
                >
                  Adjust Entry & Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // ATTEMPT 1 OF 3: Conceptual Guidance (No calculation, No solution)
    return (
      <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4 sm:p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
        {/* Header with Attempt Tracker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-200/80 text-indigo-900 font-mono">
                  Attempt {attemptNumber} of {maxAttempts}
                </span>
                <span className="text-xs text-indigo-700 font-medium">
                  {maxAttempts - attemptNumber} attempts remaining before answer is revealed
                </span>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-indigo-950 mt-1">
                Not quite — Attempt 1 of 3
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Review which accounts are affected and whether they are increasing or decreasing. Round all answers to the nearest whole dollar.
              </p>
            </div>
          </div>

          {/* Quick Action */}
          {onTryAgain && (
            <button
              onClick={onTryAgain}
              className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Adjust & Try Again</span>
            </button>
          )}
        </div>

        {/* Conceptual Guidance Cards (No account names or debit/credit leaks) */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Guiding Concepts:</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3.5 bg-white rounded-lg border border-indigo-100 shadow-2xs space-y-1 text-xs sm:text-sm">
              <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                Apply the DEALER Framework
              </div>
              <p className="text-slate-700 leading-relaxed pl-3 text-xs sm:text-sm">
                Recall normal balances: Dividends, Expenses, and Assets (DEA) increase with Debits. Liabilities, Equity, and Revenues (LER) increase with Credits.
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-lg border border-indigo-100 shadow-2xs space-y-1 text-xs sm:text-sm">
              <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                Perform Calculations Independently
              </div>
              <p className="text-slate-700 leading-relaxed pl-3 text-xs sm:text-sm">
                Calculate amounts such as monthly portions, discounts, or interest directly from the numbers given in the narrative. Round all answers to the nearest whole dollar. If you need assistance, the calculation formula and steps will unlock on attempt 2.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-indigo-100">
          <span className="text-slate-500">
            Attempt {attemptNumber} of {maxAttempts}. You have {maxAttempts - attemptNumber} attempts left before the solution is revealed.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAiTutor}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Tutor for a clue</span>
            </button>
            {onTryAgain && (
              <button
                onClick={onTryAgain}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. FULL SOLUTION REVEALED MODE (Either Correct OR Attempt 3 reached)
  return (
    <div
      className={`rounded-xl border p-4 sm:p-6 transition-all shadow-sm space-y-5 animate-in fade-in duration-200 ${
        isCorrect
          ? 'bg-emerald-50/70 border-emerald-200'
          : 'bg-slate-50 border-slate-300'
      }`}
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/70">
        <div className="flex items-center gap-3">
          {isCorrect ? (
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider font-mono ${
                  isCorrect
                    ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-slate-200 text-slate-800'
                }`}
              >
                {isCorrect ? `Solved on Attempt ${attemptNumber}` : `3 Attempts Completed · Solution Revealed`}
              </span>
            </div>
            <h3
              className={`font-bold text-base sm:text-lg mt-0.5 ${
                isCorrect ? 'text-emerald-900' : 'text-slate-900'
              }`}
            >
              {isCorrect
                ? 'Excellent! Journal Entry is 100% Correct.'
                : 'Here is the Standard Solution & Accounting Analysis'}
            </h3>
            <p className="text-xs text-slate-600">
              {isCorrect
                ? 'All accounts, debit/credit sides, and amounts are accurate.'
                : 'Study the standard journal entry below and review the DEALER rules.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {!isCorrect && onTryAgain && (
            <button
              onClick={onTryAgain}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Review My Entry
            </button>
          )}
          <button
            onClick={onNextScenario}
            className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Generate Next Question in this Category"
          >
            <span>Next Question</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Underlying Calculation Breakdown (Solution Mode) */}
      {(evaluation.calculationDetail || scenario.calculationDetail) && (() => {
        const calc = evaluation.calculationDetail || scenario.calculationDetail!;
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-2 text-xs">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                Underlying Calculation: {calc.title}
              </span>
              <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                Result: {calc.calculatedAmount}
              </span>
            </div>
            <div className="text-slate-700">
              <span className="font-semibold text-slate-900">Formula: </span>
              <span className="font-mono text-slate-800">{calc.formula}</span>
            </div>
            {calc.steps && calc.steps.length > 0 && (
              <div className="text-[11px] font-mono text-slate-600 space-y-0.5">
                {calc.steps.map((st, idx) => (
                  <div key={idx}>• {st}</div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* Comparison: Solution vs Student */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* The Standard Correct Solution */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              Standard Canadian Accounting Entry (IFRS / ASPE)
            </span>
            <span className="text-[11px] text-slate-400 font-mono-num">{scenario.date}</span>
          </div>

          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 pb-1">
                <th className="text-left font-medium pb-1">Account Title</th>
                <th className="text-right font-medium pb-1 w-20">Debit</th>
                <th className="text-right font-medium pb-1 w-20">Credit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {scenario.correctLines.map((line, idx) => {
                const acc = getAccount(line.accountId);
                const isCredit = line.credit > 0;
                return (
                  <tr key={idx} className="py-1.5">
                    <td className={`py-1.5 ${isCredit ? 'pl-4 text-slate-700' : 'font-medium text-slate-900'}`}>
                      {acc ? `${acc.name}` : line.accountId}
                    </td>
                    <td className="py-1.5 text-right font-mono-num text-slate-900">
                      {line.debit > 0 ? `$${Math.round(line.debit).toLocaleString()}` : ''}
                    </td>
                    <td className="py-1.5 text-right font-mono-num text-slate-900">
                      {line.credit > 0 ? `$${Math.round(line.credit).toLocaleString()}` : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Account-by-Account Pedagogical Reasoning */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              Why This Entry Works (DEALER Rules)
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700">
            {scenario.accountAnalysis.map((item, idx) => {
              const acc = getAccount(item.accountId);
              return (
                <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-100">
                  <div className="font-semibold text-slate-900 flex items-center justify-between">
                    <span>{acc?.name || item.accountId}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                        item.action === 'Debit'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.action} ${item.amount.toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-600 leading-relaxed text-[11px]">{item.reason}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Financial Statement & Accounting Equation Impact */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
          Accounting Equation Effect: Assets = Liabilities + Shareholders' Equity
        </h4>

        <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
          <div className="p-2 rounded bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-500 uppercase tracking-wide">Assets</div>
            <div
              className={`font-bold font-mono-num text-sm ${
                scenario.equationImpact.assets > 0
                  ? 'text-emerald-700'
                  : scenario.equationImpact.assets < 0
                  ? 'text-rose-700'
                  : 'text-slate-700'
              }`}
            >
              {scenario.equationImpact.assets > 0 ? '+' : ''}
              ${scenario.equationImpact.assets.toLocaleString()}
            </div>
          </div>

          <div className="p-2 rounded bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-500 uppercase tracking-wide">Liabilities</div>
            <div
              className={`font-bold font-mono-num text-sm ${
                scenario.equationImpact.liabilities > 0
                  ? 'text-emerald-700'
                  : scenario.equationImpact.liabilities < 0
                  ? 'text-rose-700'
                  : 'text-slate-700'
              }`}
            >
              {scenario.equationImpact.liabilities > 0 ? '+' : ''}
              ${scenario.equationImpact.liabilities.toLocaleString()}
            </div>
          </div>

          <div className="p-2 rounded bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-500 uppercase tracking-wide">Shareholders' Equity</div>
            <div
              className={`font-bold font-mono-num text-sm ${
                scenario.equationImpact.equity > 0
                  ? 'text-emerald-700'
                  : scenario.equationImpact.equity < 0
                  ? 'text-rose-700'
                  : 'text-slate-700'
              }`}
            >
              {scenario.equationImpact.equity > 0 ? '+' : ''}
              ${scenario.equationImpact.equity.toLocaleString()}
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {scenario.equationImpact.explanation}
        </p>

        {/* AI Tutor Assistant CTA */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-slate-500">
            Want to explore why this transaction behaves this way?
          </span>
          <button
            onClick={onOpenAiTutor}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI Accounting Professor to explain this</span>
          </button>
        </div>
      </div>
    </div>
  );
};
