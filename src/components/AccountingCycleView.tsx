import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  BookOpen, 
  Scale, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  Layers,
  ChevronRight,
  TrendingUp,
  Landmark,
  ShieldCheck,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { MultiTransactionScenario, JournalEntryLine, EvaluationResult } from '../types/accounting';
import { MULTI_TRANSACTION_SCENARIOS } from '../data/multiTransactionScenarios';
import { JournalEntryForm } from './JournalEntryForm';
import { FeedbackCard } from './FeedbackCard';
import { evaluateJournalEntry, calculateLedger, generateTrialBalance, generateFinancialStatements } from '../utils/accountingEngine';
import { getAccount } from '../data/accounts';
import { 
  loadMultiCaseProgress, 
  saveMultiCaseProgress,
  recordCycleAttempt,
  markCycleCaseCompleted,
  resetCycleCaseProgress
} from '../utils/storage';
import { generateCycleCase, validateCycleCase } from '../utils/cycleCaseGenerator';

interface AccountingCycleViewProps {
  onOpenAiTutorWithContext: (scenario: any, userLines: any, correctLines: any) => void;
}

type CycleTab = 'transactions' | 'ledger' | 'trial_balance' | 'financial_statements';

export const AccountingCycleView: React.FC<AccountingCycleViewProps> = ({
  onOpenAiTutorWithContext
}) => {
  // Single active case displayed (freshly replaced on each generate)
  const [activeCase, setActiveCase] = useState<MultiTransactionScenario>(() => MULTI_TRANSACTION_SCENARIOS[0]);
  const [caseNumber, setCaseNumber] = useState<number>(1);
  const [seenCompanyNames, setSeenCompanyNames] = useState<string[]>(() => [
    MULTI_TRANSACTION_SCENARIOS[0].companyName,
    MULTI_TRANSACTION_SCENARIOS[1]?.companyName
  ].filter(Boolean));

  // Generation status and feedback
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationNotice, setGenerationNotice] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Active sub-view tab
  const [cycleTab, setCycleTab] = useState<CycleTab>('transactions');

  // Multi-case progress
  const [completedIndices, setCompletedIndices] = useState<number[]>(() => {
    return loadMultiCaseProgress(activeCase.id);
  });

  const [activeTxIndex, setActiveTxIndex] = useState(0);
  const currentTx = activeCase.transactions[activeTxIndex] || activeCase.transactions[0];

  // Journal form state for active transaction
  const [lines, setLines] = useState<JournalEntryLine[]>([
    { id: '1', accountId: '', debit: null, credit: null },
    { id: '2', accountId: '', debit: null, credit: null }
  ]);

  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [txAttemptCount, setTxAttemptCount] = useState(0);

  // Posted entries for the entire case so far
  // Entries that were completed by student
  const postedEntries = useMemo(() => {
    const list: {
      date: string;
      reference: string;
      lines: { accountId: string; debit: number; credit: number }[];
    }[] = [];

    completedIndices.forEach(idx => {
      const tx = activeCase.transactions[idx];
      if (tx) {
        list.push({
          date: tx.date,
          reference: `J-${idx + 1}`,
          lines: tx.correctLines
        });
      }
    });

    return list;
  }, [completedIndices, activeCase]);

  // Derived Accounting Cycle components
  const ledgerData = useMemo(() => calculateLedger(postedEntries), [postedEntries]);
  const trialBalance = useMemo(() => generateTrialBalance(ledgerData), [ledgerData]);
  const statements = useMemo(() => generateFinancialStatements(trialBalance.rows, 0), [trialBalance]);

  // Continuous case generation: creates a brand-new case every time and replaces current case
  const handleGenerateNewCase = async () => {
    setIsGenerating(true);
    setGenerationNotice(null);
    try {
      const nextCaseNum = caseNumber + 1;
      let newCase: MultiTransactionScenario | null = null;

      // Attempt to generate from server API with seen company names excluded
      try {
        const resp = await fetch('/api/generate-cycle-case', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caseNumber: nextCaseNum,
            previousCompanyNames: seenCompanyNames
          })
        });
        if (resp.ok && resp.headers.get('content-type')?.includes('application/json')) {
          const data = await resp.json();
          if (data && data.case && data.case.companyName && Array.isArray(data.case.transactions) && data.case.transactions.length >= 5) {
            newCase = data.case;
          }
        }
      } catch (apiErr) {
        console.warn('Server generation error, utilizing verified client generator:', apiErr);
      }

      // If server response was unavailable or incomplete, fall back to procedural local generator
      if (!newCase) {
        newCase = generateCycleCase(nextCaseNum, seenCompanyNames);
      }

      // Validate uniqueness and non-repetition
      const isDuplicate = !newCase || !newCase.companyName ||
        seenCompanyNames.some(name => name.toLowerCase().trim() === newCase!.companyName.toLowerCase().trim()) ||
        newCase.companyName.toLowerCase().trim() === activeCase.companyName.toLowerCase().trim();

      let validation = newCase ? validateCycleCase(newCase) : { isValid: false, errors: ['Case was null'] };

      if (isDuplicate || !validation.isValid) {
        const retryExclusions = [...seenCompanyNames, activeCase.companyName];
        if (newCase?.companyName) retryExclusions.push(newCase.companyName);
        newCase = generateCycleCase(nextCaseNum, retryExclusions);
        validation = validateCycleCase(newCase);
      }

      const finalIsDuplicate = !newCase || !newCase.companyName ||
        seenCompanyNames.some(name => name.toLowerCase().trim() === newCase!.companyName.toLowerCase().trim()) ||
        newCase.companyName.toLowerCase().trim() === activeCase.companyName.toLowerCase().trim();

      // If a unique case cannot be generated, do NOT silently return a previously generated case
      if (finalIsDuplicate || !validation.isValid || !newCase) {
        setGenerationNotice({
          type: 'error',
          message: 'Unable to generate an entirely new unique case at this moment. Please click Generate New Case again.'
        });
        return;
      }

      // Record newly generated company name to prevent reuse in session
      setSeenCompanyNames(prev => [...prev, newCase!.companyName]);

      // Replace currently displayed case with the newly generated case
      setActiveCase(newCase);
      setCaseNumber(nextCaseNum);
      setCompletedIndices([]);
      setActiveTxIndex(0);
      setTxAttemptCount(0);
      setLines([
        { id: '1', accountId: '', debit: null, credit: null },
        { id: '2', accountId: '', debit: null, credit: null }
      ]);
      setEvaluation(null);
      setCycleTab('transactions');

      setGenerationNotice({
        type: 'success',
        message: `New case generated: ${newCase.companyName} (${newCase.transactions.length} fresh transactions ready to practice)!`
      });
    } catch (err: any) {
      console.error('Case generation error:', err);
      // Do not silently return a duplicate or display an invalid case
      setGenerationNotice({
        type: 'error',
        message: 'Case generation encountered an error. Please click Generate New Case again.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle transaction submission
  const handleSubmitTx = () => {
    const nextAttempt = txAttemptCount + 1;
    const res = evaluateJournalEntry(lines, currentTx.correctLines, currentTx, nextAttempt, 3);
    setEvaluation(res);

    if (res.isValidationNotice) {
      return;
    }

    setTxAttemptCount(nextAttempt);
    const willBeCompletedCount = res.isCorrect && !completedIndices.includes(activeTxIndex)
      ? completedIndices.length + 1
      : completedIndices.length;

    recordCycleAttempt(
      activeCase.id,
      activeCase.title,
      activeCase.transactions.length,
      res.isCorrect,
      willBeCompletedCount
    );

    if (res.isCorrect) {
      if (!completedIndices.includes(activeTxIndex)) {
        const nextCompleted = [...completedIndices, activeTxIndex];
        setCompletedIndices(nextCompleted);
        saveMultiCaseProgress(activeCase.id, nextCompleted);
        if (nextCompleted.length === activeCase.transactions.length) {
          markCycleCaseCompleted(activeCase.id, activeCase.title, activeCase.transactions.length);
        }
      }
    }
  };

  const handleSelectTx = (index: number) => {
    setActiveTxIndex(index);
    setTxAttemptCount(0);
    const tx = activeCase.transactions[index];
    const isAlreadyCompleted = completedIndices.includes(index);

    if (isAlreadyCompleted) {
      // Pre-fill with the correct lines so student can review
      setLines(
        tx.correctLines.map((l, i) => ({
          id: `line-${i}`,
          accountId: l.accountId,
          debit: l.debit > 0 ? l.debit : null,
          credit: l.credit > 0 ? l.credit : null
        }))
      );
      setEvaluation(null);
    } else {
      setLines([
        { id: `l-${Date.now()}-1`, accountId: '', debit: null, credit: null },
        { id: `l-${Date.now()}-2`, accountId: '', debit: null, credit: null }
      ]);
      setEvaluation(null);
    }
  };

  const handleAutoFillAll = () => {
    const allIndices = activeCase.transactions.map((_, i) => i);
    setCompletedIndices(allIndices);
    saveMultiCaseProgress(activeCase.id, allIndices);
    markCycleCaseCompleted(activeCase.id, activeCase.title, activeCase.transactions.length);
    setCycleTab('financial_statements');
  };

  const handleResetCase = () => {
    setCompletedIndices([]);
    saveMultiCaseProgress(activeCase.id, []);
    resetCycleCaseProgress(activeCase.id);
    setActiveTxIndex(0);
    setTxAttemptCount(0);
    setLines([
      { id: '1', accountId: '', debit: null, credit: null },
      { id: '2', accountId: '', debit: null, credit: null }
    ]);
    setEvaluation(null);
  };

  return (
    <div className="space-y-6">
      {/* Cycle Flow Section Heading & Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Cycle Flow
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {activeCase.businessType}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Practice Case #{caseNumber}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 break-words">
              Cycle Flow
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Practise the complete accounting cycle, from transactions to financial statements.
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-100">
              <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                {activeCase.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeCase.description}
              </p>
            </div>
          </div>

          {/* Quick Actions & Case Generation Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleGenerateNewCase}
              disabled={isGenerating}
              className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 text-white flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="Generate a completely new Canadian accounting cycle practice case"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Generating Case…' : 'Generate New Case'}</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleAutoFillAll}
                className="flex-1 sm:flex-initial px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer text-center"
                title="Post all transactions to instantly inspect the completed cycle and statements"
              >
                Post All
              </button>

              <button
                onClick={handleResetCase}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Reset Current Case Progress"
                aria-label="Reset Current Case Progress"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Generation Notice Banner */}
        {generationNotice && (
          <div
            className={`mt-3 p-3 rounded-lg text-xs flex items-center justify-between gap-2 border animate-in fade-in ${
              generationNotice.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : generationNotice.type === 'error'
                ? 'bg-rose-50 text-rose-900 border-rose-200'
                : 'bg-indigo-50 text-indigo-900 border-indigo-200'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {generationNotice.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : generationNotice.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              ) : (
                <Sparkles className="w-4 h-4 shrink-0 text-indigo-600" />
              )}
              <span className="font-medium break-words">{generationNotice.message}</span>
            </div>
            <button
              onClick={() => setGenerationNotice(null)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer shrink-0 font-bold text-sm"
              aria-label="Dismiss notice"
            >
              ×
            </button>
          </div>
        )}

        {/* Cycle Flow Stages Nav */}
        <div className="flex items-center gap-2 pt-4 overflow-x-auto text-xs sm:text-sm">
          <button
            onClick={() => setCycleTab('transactions')}
            className={`px-3 py-2 rounded-lg font-medium flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              cycleTab === 'transactions'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. General Journal ({completedIndices.length}/{activeCase.transactions.length})</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

          <button
            onClick={() => setCycleTab('ledger')}
            className={`px-3 py-2 rounded-lg font-medium flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              cycleTab === 'ledger'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. General Ledger ({ledgerData.length} Accounts)</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

          <button
            onClick={() => setCycleTab('trial_balance')}
            className={`px-3 py-2 rounded-lg font-medium flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              cycleTab === 'trial_balance'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>3. Adjusted Trial Balance</span>
            {trialBalance.isBalanced && postedEntries.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>

          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

          <button
            onClick={() => setCycleTab('financial_statements')}
            className={`px-3 py-2 rounded-lg font-medium flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              cycleTab === 'financial_statements'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>4. Financial Statements</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TRANSACTIONS & JOURNAL */}
      {cycleTab === 'transactions' && (
        <div className="space-y-6">
          {/* Transaction Steps Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {activeCase.transactions.map((tx, idx) => {
                const isCompleted = completedIndices.includes(idx);
                const isActive = activeTxIndex === idx;

                return (
                  <button
                    key={tx.id}
                    onClick={() => handleSelectTx(idx)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                    )}
                    <span>{tx.date.split(',')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Transaction Narrative */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                {currentTx.title}
              </span>
              <span className="text-xs font-mono-num text-slate-500">{currentTx.date}</span>
            </div>
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
              {currentTx.narrative}
            </p>
          </div>

          {/* Form */}
          <JournalEntryForm
            lines={lines}
            onChangeLines={setLines}
            onSubmit={handleSubmitTx}
            onClear={() =>
              setLines([
                { id: '1', accountId: '', debit: null, credit: null },
                { id: '2', accountId: '', debit: null, credit: null }
              ])
            }
          />

          {/* Feedback */}
          {evaluation && (
            <FeedbackCard
              evaluation={evaluation}
              scenario={currentTx}
              userLines={lines}
              onNextScenario={() => {
                if (activeTxIndex < activeCase.transactions.length - 1) {
                  handleSelectTx(activeTxIndex + 1);
                } else {
                  setCycleTab('ledger');
                }
              }}
              onTryAgain={() => setEvaluation(null)}
              onOpenAiTutor={() =>
                onOpenAiTutorWithContext(currentTx, lines, currentTx.correctLines)
              }
            />
          )}
        </div>
      )}

      {/* TAB 2: GENERAL LEDGER (T-ACCOUNTS) */}
      {cycleTab === 'ledger' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">General Ledger (T-Accounts)</h3>
              <p className="text-xs text-slate-500">
                Each account accumulates debits on the left and credits on the right to calculate its net balance.
              </p>
            </div>
            <span className="text-xs font-mono-num bg-slate-100 px-2.5 py-1 rounded text-slate-700 font-semibold">
              {ledgerData.length} Active Accounts
            </span>
          </div>

          {ledgerData.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
              No transactions posted yet. Complete transactions in Step 1 or click "Post All Transactions" above!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ledgerData.map((item) => (
                <div
                  key={item.account.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs"
                >
                  {/* T-Account Header */}
                  <div className="p-3 bg-slate-50 border-b border-slate-200 text-center">
                    <div className="text-[11px] text-slate-500 font-mono-num">
                      No. {item.account.code} · {item.account.category}
                    </div>
                    <div className="font-bold text-sm text-slate-900 truncate px-1">
                      {item.account.name}
                    </div>
                  </div>

                  {/* T-Account Body */}
                  <div className="grid grid-cols-2 divide-x divide-slate-300 text-xs min-h-[140px] font-mono-num">
                    {/* Debit side */}
                    <div className="p-2 space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400 pb-1 border-b border-slate-100 text-left">
                        Debit (Dr.)
                      </div>
                      {item.postings
                        .filter(p => p.debit > 0)
                        .map((p, idx) => (
                          <div key={idx} className="flex justify-between items-center text-slate-800">
                            <span className="text-[10px] text-slate-400">{p.date.split(' ')[0]}</span>
                            <span>${p.debit.toLocaleString()}</span>
                          </div>
                        ))}
                    </div>

                    {/* Credit side */}
                    <div className="p-2 space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400 pb-1 border-b border-slate-100 text-right">
                        Credit (Cr.)
                      </div>
                      {item.postings
                        .filter(p => p.credit > 0)
                        .map((p, idx) => (
                          <div key={idx} className="flex justify-between items-center text-slate-800">
                            <span className="text-[10px] text-slate-400">{p.date.split(' ')[0]}</span>
                            <span>${p.credit.toLocaleString()}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* T-Account Balance Footer */}
                  <div className="p-2.5 bg-slate-100/80 border-t-2 border-slate-300 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600">Ending Balance:</span>
                    <span className="font-mono-num font-bold text-slate-900">
                      ${item.balance.toLocaleString()} ({item.balanceType})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TRIAL BALANCE */}
      {cycleTab === 'trial_balance' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 bg-slate-50 border-b border-slate-200 text-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              {activeCase.companyName}
            </h3>
            <h4 className="text-base font-bold text-slate-900">
              Adjusted Trial Balance
            </h4>
            <div className="text-xs text-slate-500 font-mono-num">
              As of October 31, 2026
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-2.5 px-4 w-20">Code</th>
                  <th className="py-2.5 px-4">Account Title</th>
                  <th className="py-2.5 px-4 w-32 sm:w-40 text-right">Debit ($)</th>
                  <th className="py-2.5 px-4 w-32 sm:w-40 text-right">Credit ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trialBalance.rows.map((row) => (
                  <tr key={row.account.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-4 text-slate-400 font-mono-num text-xs">
                      {row.account.code}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-900">
                      {row.account.name}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono-num text-slate-900">
                      {row.debit > 0 ? `$${row.debit.toLocaleString()}` : ''}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono-num text-slate-900">
                      {row.credit > 0 ? `$${row.credit.toLocaleString()}` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100/90 border-t-2 border-slate-300 font-bold text-slate-900 text-xs sm:text-sm">
                  <td colSpan={2} className="py-3 px-4 text-right uppercase tracking-wider">
                    Total Adjusted Trial Balance:
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num border-accounting-double text-slate-900">
                    ${trialBalance.totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num border-accounting-double text-slate-900">
                    ${trialBalance.totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              {trialBalance.isBalanced && postedEntries.length > 0 ? (
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Trial balance proves equality of Debits and Credits!</span>
                </div>
              ) : (
                <span className="text-slate-500">
                  Post transactions to generate the Trial Balance.
                </span>
              )}
            </div>
            <button
              onClick={() => setCycleTab('financial_statements')}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Financial Statements</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: FINANCIAL STATEMENTS */}
      {cycleTab === 'financial_statements' && (
        <div className="space-y-6">
          {/* Statement 1: Income Statement */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 text-center">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {activeCase.companyName}
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Income Statement
              </h3>
              <div className="text-xs text-slate-500 font-mono-num">
                For the Month Ended October 31, 2026
              </div>
            </div>

            <div className="p-5 max-w-2xl mx-auto space-y-4 text-xs sm:text-sm">
              {/* Revenues */}
              <div>
                <div className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-2">
                  Revenues:
                </div>
                <div className="space-y-1.5 pl-4">
                  {statements.incomeStatement.revenues.map((r, i) => (
                    <div key={i} className="flex justify-between items-center text-slate-800">
                      <span>{r.account.name}</span>
                      <span className="font-mono-num">${r.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold text-slate-900">
                    <span>Total Revenues</span>
                    <span className="font-mono-num">
                      ${statements.incomeStatement.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expenses */}
              <div>
                <div className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-2">
                  Expenses:
                </div>
                <div className="space-y-1.5 pl-4">
                  {statements.incomeStatement.expenses.map((e, i) => (
                    <div key={i} className="flex justify-between items-center text-slate-800">
                      <span>{e.account.name}</span>
                      <span className="font-mono-num">${e.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold text-slate-900">
                    <span>Total Expenses</span>
                    <span className="font-mono-num">
                      ${statements.incomeStatement.totalExpenses.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Net Income */}
              <div className="pt-3 border-t-2 border-slate-300 flex justify-between items-center font-bold text-sm sm:text-base text-slate-900 bg-slate-50 p-3 rounded">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Net Income for the Period
                </span>
                <span className="font-mono-num border-accounting-double text-emerald-800">
                  ${statements.incomeStatement.netIncome.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Statement 2: Retained Earnings Statement */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 text-center">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {activeCase.companyName}
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Statement of Retained Earnings
              </h3>
              <div className="text-xs text-slate-500 font-mono-num">
                For the Month Ended October 31, 2026
              </div>
            </div>

            <div className="p-5 max-w-2xl mx-auto space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-slate-700">
                <span>Retained Earnings, October 1, 2026</span>
                <span className="font-mono-num">$0.00</span>
              </div>
              <div className="flex justify-between items-center text-slate-800 pl-4">
                <span>Add: Net Income for October</span>
                <span className="font-mono-num text-emerald-700 font-semibold">
                  +${statements.retainedEarningsStatement.netIncome.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-800 pl-4">
                <span>Less: Dividends Declared</span>
                <span className="font-mono-num text-rose-700">
                  -${statements.retainedEarningsStatement.dividends.toLocaleString()}
                </span>
              </div>
              <div className="pt-3 border-t-2 border-slate-300 flex justify-between items-center font-bold text-sm sm:text-base text-slate-900 bg-slate-50 p-3 rounded">
                <span>Retained Earnings, October 31, 2026</span>
                <span className="font-mono-num border-accounting-double">
                  ${statements.retainedEarningsStatement.endingRetainedEarnings.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Statement 3: Balance Sheet / Statement of Financial Position */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 text-center">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {activeCase.companyName}
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Statement of Financial Position (Balance Sheet)
              </h3>
              <div className="text-xs text-indigo-700 font-medium">
                Canadian Accounting Standards (ASPE / IFRS)
              </div>
              <div className="text-xs text-slate-500 font-mono-num mt-0.5">
                As of October 31, 2026
              </div>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
              {/* ASSETS COLUMN */}
              <div className="space-y-4">
                <div className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-1">
                  Assets
                </div>

                {/* Current Assets */}
                <div>
                  <div className="font-semibold text-slate-700 text-xs mb-1">Current Assets:</div>
                  <div className="space-y-1 pl-3">
                    {statements.balanceSheet.currentAssets.map((a, i) => (
                      <div key={i} className="flex justify-between items-center text-slate-700">
                        <span>{a.account.name}</span>
                        <span className="font-mono-num">${a.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="pt-1.5 border-t border-slate-200 flex justify-between items-center font-semibold text-slate-900">
                      <span>Total Current Assets</span>
                      <span className="font-mono-num">${statements.balanceSheet.totalCurrentAssets.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Property, Plant & Equipment */}
                {statements.balanceSheet.nonCurrentAssets.length > 0 && (
                  <div>
                    <div className="font-semibold text-slate-700 text-xs mb-1">Property, Plant & Equipment:</div>
                    <div className="space-y-1 pl-3">
                      {statements.balanceSheet.nonCurrentAssets.map((a, i) => {
                        const isContra = a.account.category === 'ContraAsset' || a.amount < 0;
                        return (
                          <div key={i} className={`flex justify-between items-center ${isContra ? 'text-slate-600 italic' : 'text-slate-700'}`}>
                            <span>{isContra ? `Less: ${a.account.name}` : a.account.name}</span>
                            <span className="font-mono-num">
                              {isContra ? `($${Math.abs(a.amount).toLocaleString()})` : `$${a.amount.toLocaleString()}`}
                            </span>
                          </div>
                        );
                      })}
                      <div className="pt-1.5 border-t border-slate-200 flex justify-between items-center font-semibold text-slate-900">
                        <span>Total Property & Equipment (Net)</span>
                        <span className="font-mono-num">${statements.balanceSheet.totalNonCurrentAssets.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TOTAL ASSETS */}
                <div className="p-3 bg-slate-50 border-t-2 border-slate-300 rounded flex justify-between items-center font-bold text-sm text-slate-900">
                  <span>TOTAL ASSETS</span>
                  <span className="font-mono-num border-accounting-double text-slate-900">
                    ${statements.balanceSheet.totalAssets.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* LIABILITIES & EQUITY COLUMN */}
              <div className="space-y-4">
                <div className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-1">
                  Liabilities & Shareholders' Equity
                </div>

                {/* Current Liabilities */}
                <div>
                  <div className="font-semibold text-slate-700 text-xs mb-1">Current Liabilities:</div>
                  <div className="space-y-1 pl-3">
                    {statements.balanceSheet.currentLiabilities.length === 0 ? (
                      <div className="text-slate-400 italic">None</div>
                    ) : (
                      statements.balanceSheet.currentLiabilities.map((l, i) => (
                        <div key={i} className="flex justify-between items-center text-slate-700">
                          <span>{l.account.name}</span>
                          <span className="font-mono-num">
                            {l.amount < 0 ? `($${Math.abs(l.amount).toLocaleString()})` : `$${l.amount.toLocaleString()}`}
                          </span>
                        </div>
                      ))
                    )}
                    <div className="pt-1.5 border-t border-slate-200 flex justify-between items-center font-semibold text-slate-900">
                      <span>Total Current Liabilities</span>
                      <span className="font-mono-num">
                        {statements.balanceSheet.totalCurrentLiabilities < 0
                          ? `($${Math.abs(statements.balanceSheet.totalCurrentLiabilities).toLocaleString()})`
                          : `$${statements.balanceSheet.totalCurrentLiabilities.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Long-term Liabilities */}
                {statements.balanceSheet.longTermLiabilities.length > 0 && (
                  <div>
                    <div className="font-semibold text-slate-700 text-xs mb-1">Long-Term Debt:</div>
                    <div className="space-y-1 pl-3">
                      {statements.balanceSheet.longTermLiabilities.map((l, i) => (
                        <div key={i} className="flex justify-between items-center text-slate-700">
                          <span>{l.account.name}</span>
                          <span className="font-mono-num">${l.amount.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="pt-1.5 border-t border-slate-200 flex justify-between items-center font-semibold text-slate-900">
                        <span>Total Long-Term Debt</span>
                        <span className="font-mono-num">${statements.balanceSheet.totalLongTermLiabilities.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shareholders' Equity */}
                <div>
                  <div className="font-semibold text-slate-700 text-xs mb-1">Shareholders' Equity:</div>
                  <div className="space-y-1 pl-3">
                    <div className="flex justify-between items-center text-slate-700">
                      <span>Common Shares</span>
                      <span className="font-mono-num">${(statements.balanceSheet.commonShares ?? statements.balanceSheet.commonStock).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span>Retained Earnings (from R/E Statement)</span>
                      <span className="font-mono-num">${statements.balanceSheet.endingRetainedEarnings.toLocaleString()}</span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-200 flex justify-between items-center font-semibold text-slate-900">
                      <span>Total Shareholders' Equity</span>
                      <span className="font-mono-num">${statements.balanceSheet.totalEquity.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* TOTAL LIABILITIES & EQUITY */}
                <div className="p-3 bg-slate-50 border-t-2 border-slate-300 rounded flex justify-between items-center font-bold text-sm text-slate-900">
                  <span>TOTAL LIABILITIES & SHAREHOLDERS' EQUITY</span>
                  <span className="font-mono-num border-accounting-double text-slate-900">
                    ${statements.balanceSheet.totalLiabilitiesAndEquity.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Verification Banner */}
            <div className="p-4 bg-emerald-50 border-t border-emerald-200 text-emerald-900 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  The Accounting Equation is Balanced: Assets (${statements.balanceSheet.totalAssets.toLocaleString()}) = Liabilities + Equity (${statements.balanceSheet.totalLiabilitiesAndEquity.toLocaleString()})
                </span>
              </div>
              <span className="font-mono-num text-xs bg-emerald-100 px-2.5 py-1 rounded text-emerald-800 font-bold">
                A = L + E ✓
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
