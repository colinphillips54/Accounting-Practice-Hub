import React from 'react';
import { Plus, Trash2, RotateCcw, CheckCircle2, AlertTriangle, ArrowRight, CornerDownRight } from 'lucide-react';
import { JournalEntryLine } from '../types/accounting';
import { CHART_OF_ACCOUNTS, getAccount } from '../data/accounts';

interface JournalEntryFormProps {
  lines: JournalEntryLine[];
  onChangeLines: (lines: JournalEntryLine[]) => void;
  onSubmit: () => void;
  onClear: () => void;
  isEvaluating?: boolean;
}

export const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  lines,
  onChangeLines,
  onSubmit,
  onClear,
  isEvaluating = false
}) => {
  // Group accounts by category for clean dropdown selection
  const accountsByCategory = React.useMemo(() => {
    const map: Record<string, typeof CHART_OF_ACCOUNTS> = {
      'Assets': [],
      'Liabilities': [],
      'Shareholders\' Equity': [],
      'Revenues': [],
      'Expenses': []
    };

    CHART_OF_ACCOUNTS.forEach(acc => {
      if (acc.category === 'Asset' || acc.category === 'ContraAsset') {
        map['Assets'].push(acc);
      } else if (acc.category === 'Liability' || acc.category === 'ContraLiability') {
        map['Liabilities'].push(acc);
      } else if (acc.category === 'Equity' || acc.category === 'Dividend') {
        map['Shareholders\' Equity'].push(acc);
      } else if (acc.category === 'Revenue' || acc.category === 'ContraRevenue') {
        map['Revenues'].push(acc);
      } else if (acc.category === 'Expense') {
        map['Expenses'].push(acc);
      }
    });

    return map;
  }, []);

  const handleLineChange = (index: number, field: keyof JournalEntryLine, value: any) => {
    const updated = [...lines];
    if (field === 'debit') {
      const num = value === '' ? null : Math.max(0, parseFloat(value) || 0);
      updated[index] = { ...updated[index], debit: num, credit: num && num > 0 ? null : updated[index].credit };
    } else if (field === 'credit') {
      const num = value === '' ? null : Math.max(0, parseFloat(value) || 0);
      updated[index] = { ...updated[index], credit: num, debit: num && num > 0 ? null : updated[index].debit };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    onChangeLines(updated);
  };

  const handleAddLine = () => {
    const newLine: JournalEntryLine = {
      id: `line-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      accountId: '',
      debit: null,
      credit: null
    };
    onChangeLines([...lines, newLine]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length <= 2) {
      // Keep at least 2 lines by resetting the line
      const updated = [...lines];
      updated[index] = { ...updated[index], accountId: '', debit: null, credit: null };
      onChangeLines(updated);
      return;
    }
    const updated = lines.filter((_, i) => i !== index);
    onChangeLines(updated);
  };

  // Calculations
  const totalDebits = lines.reduce((sum, l) => sum + (l.debit || 0), 0);
  const totalCredits = lines.reduce((sum, l) => sum + (l.credit || 0), 0);
  const difference = Math.abs(totalDebits - totalCredits);
  const isBalanced = totalDebits > 0 && totalCredits > 0 && difference < 0.01;
  const hasAccounts = lines.some(l => l.accountId !== '');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header / Title */}
      <div className="px-4 sm:px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
            General Journal Worksheet
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Enter debit and credit accounts. Credits are indented.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddLine}
            className="px-2.5 py-1.5 text-xs font-semibold rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1 transition-colors cursor-pointer min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
          <button
            type="button"
            onClick={onClear}
            className="px-2.5 py-1.5 text-xs font-medium rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center gap-1 transition-colors cursor-pointer min-h-[36px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* MOBILE-FRIENDLY CARD VIEW (Visible on small phone screens) */}
      <div className="block sm:hidden divide-y divide-slate-100 p-3 space-y-3">
        {lines.map((line, idx) => {
          const selectedAcc = getAccount(line.accountId);
          const isCreditRow = Boolean(line.credit && line.credit > 0);

          return (
            <div
              key={line.id}
              className={`pt-3 first:pt-0 space-y-2.5 ${
                isCreditRow ? 'pl-2 border-l-3 border-indigo-400' : ''
              }`}
            >
              {/* Account Row */}
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-mono-num text-[10px] shrink-0 font-bold">
                  {idx + 1}
                </span>

                <div className="flex-1">
                  <select
                    value={line.accountId}
                    onChange={(e) => handleLineChange(idx, 'accountId', e.target.value)}
                    className="w-full px-2.5 py-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                    aria-label={`Account for line ${idx + 1}`}
                  >
                    <option value="">Select an account...</option>
                    {Object.entries(accountsByCategory).map(([category, accs]) => (
                      <optgroup key={category} label={category}>
                        {accs.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.code} - {a.name} ({a.category})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveLine(idx)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded cursor-pointer min-h-[44px] min-w-[36px] flex items-center justify-center"
                  aria-label={`Remove line ${idx + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {selectedAcc && (
                <div className="text-[10px] text-slate-500 pl-7 flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700">{selectedAcc.category}</span>
                  <span>·</span>
                  <span>Normal Balance: {selectedAcc.normalBalance}</span>
                  {isCreditRow && (
                    <span className="text-indigo-600 font-bold ml-auto flex items-center gap-0.5">
                      <CornerDownRight className="w-3 h-3" /> Credited
                    </span>
                  )}
                </div>
              )}

              {/* Debit & Credit Inputs Side-by-Side */}
              <div className="grid grid-cols-2 gap-2 pl-7">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Debit ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={line.debit !== null && line.debit !== undefined ? Math.round(line.debit) : ''}
                      disabled={Boolean(line.credit && line.credit > 0)}
                      onChange={(e) => handleLineChange(idx, 'debit', e.target.value)}
                      className={`w-full pl-6 pr-2 py-2 text-right font-mono-num text-xs rounded-lg border min-h-[44px] ${
                        line.credit && line.credit > 0
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                      }`}
                      aria-label={`Debit amount for line ${idx + 1}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Credit ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={line.credit !== null && line.credit !== undefined ? Math.round(line.credit) : ''}
                      disabled={Boolean(line.debit && line.debit > 0)}
                      onChange={(e) => handleLineChange(idx, 'credit', e.target.value)}
                      className={`w-full pl-6 pr-2 py-2 text-right font-mono-num text-xs rounded-lg border min-h-[44px] ${
                        line.debit && line.debit > 0
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-indigo-500'
                      }`}
                      aria-label={`Credit amount for line ${idx + 1}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Mobile Totals Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-semibold">
          <div className="text-slate-600">
            Debits: <span className="font-mono-num text-slate-900 font-bold">${Math.round(totalDebits).toLocaleString()}</span>
          </div>
          <div className="text-slate-600">
            Credits: <span className="font-mono-num text-slate-900 font-bold">${Math.round(totalCredits).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW (Visible on tablet & desktop screens sm+) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
              <th className="py-2.5 px-3 sm:px-4 w-12 text-center">#</th>
              <th className="py-2.5 px-3 sm:px-4">Account Title & Description</th>
              <th className="py-2.5 px-3 sm:px-4 w-28 sm:w-36 text-right">Debit ($)</th>
              <th className="py-2.5 px-3 sm:px-4 w-28 sm:w-36 text-right">Credit ($)</th>
              <th className="py-2.5 px-2 w-10 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lines.map((line, idx) => {
              const selectedAcc = getAccount(line.accountId);
              const isCreditRow = Boolean(line.credit && line.credit > 0);

              return (
                <tr
                  key={line.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isCreditRow ? 'bg-slate-50/40' : ''
                  }`}
                >
                  {/* Line Index */}
                  <td className="py-3 px-3 sm:px-4 text-center text-slate-400 font-mono-num text-xs">
                    {idx + 1}
                  </td>

                  {/* Account Selector */}
                  <td className="py-2 px-3 sm:px-4">
                    <div className="flex items-center gap-2">
                      {isCreditRow && (
                        <span className="hidden sm:inline-block w-6 text-slate-400 text-right font-mono text-xs">
                          ↳
                        </span>
                      )}
                      <div className="flex-1">
                        <select
                          value={line.accountId}
                          onChange={(e) => handleLineChange(idx, 'accountId', e.target.value)}
                          className={`w-full px-3 py-2 text-xs sm:text-sm rounded-md border transition-colors bg-white ${
                            line.accountId
                              ? 'border-slate-300 text-slate-900 font-medium'
                              : 'border-slate-300 text-slate-400 italic'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                          aria-label={`Account for line ${idx + 1}`}
                        >
                          <option value="">Select an account...</option>
                          {Object.entries(accountsByCategory).map(([category, accs]) => (
                            <optgroup key={category} label={category}>
                              {accs.map((a) => (
                                <option key={a.id} value={a.id}>
                                  {a.code} - {a.name} ({a.category})
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        {selectedAcc && (
                          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="font-semibold text-slate-700">{selectedAcc.category}</span>
                            <span>·</span>
                            <span>Normal Balance: {selectedAcc.normalBalance}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Debit Input */}
                  <td className="py-2 px-3 sm:px-4">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        value={line.debit !== null && line.debit !== undefined ? Math.round(line.debit) : ''}
                        disabled={Boolean(line.credit && line.credit > 0)}
                        onChange={(e) => handleLineChange(idx, 'debit', e.target.value)}
                        className={`w-full pl-6 pr-2.5 py-1.5 text-right font-mono-num text-xs sm:text-sm rounded border transition-colors ${
                          line.credit && line.credit > 0
                            ? 'bg-slate-100 text-slate-400 border-transparent cursor-not-allowed'
                            : 'bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                        aria-label={`Debit amount for line ${idx + 1}`}
                      />
                    </div>
                  </td>

                  {/* Credit Input */}
                  <td className="py-2 px-3 sm:px-4">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        value={line.credit !== null && line.credit !== undefined ? Math.round(line.credit) : ''}
                        disabled={Boolean(line.debit && line.debit > 0)}
                        onChange={(e) => handleLineChange(idx, 'credit', e.target.value)}
                        className={`w-full pl-6 pr-2.5 py-1.5 text-right font-mono-num text-xs sm:text-sm rounded border transition-colors ${
                          line.debit && line.debit > 0
                            ? 'bg-slate-100 text-slate-400 border-transparent cursor-not-allowed'
                            : 'bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                        aria-label={`Credit amount for line ${idx + 1}`}
                      />
                    </div>
                  </td>

                  {/* Delete Row */}
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveLine(idx)}
                      title="Remove row"
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      aria-label={`Remove row ${idx + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Running Totals Footer */}
          <tfoot>
            <tr className="bg-slate-100/90 border-t-2 border-slate-300 font-semibold text-xs sm:text-sm">
              <td colSpan={2} className="py-3 px-4 text-right text-slate-700">
                Total Columns:
              </td>
              <td className="py-3 px-4 text-right font-mono-num border-accounting-single text-slate-900">
                ${Math.round(totalDebits).toLocaleString()}
              </td>
              <td className="py-3 px-4 text-right font-mono-num border-accounting-single text-slate-900">
                ${Math.round(totalCredits).toLocaleString()}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Balance Diagnostics & Submit Action Bar */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Indicator */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {isBalanced ? (
            <div className="flex items-center gap-2 text-emerald-700 font-medium text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Debits equal Credits ($ {Math.round(totalDebits).toLocaleString()}). Ready to evaluate!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-800 text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              {totalDebits === 0 && totalCredits === 0 ? (
                <span>Enter debit and credit amounts for each account. Round all answers to the nearest whole dollar.</span>
              ) : (
                <span>
                  Entry is out of balance by{' '}
                  <strong className="font-mono-num text-amber-900 font-bold">
                    ${Math.round(difference).toLocaleString()}
                  </strong>
                  . Double-entry rule requires Debits = Credits.
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isEvaluating}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer min-h-[44px] ${
              isEvaluating
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : isBalanced
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
            }`}
          >
            <span>{isEvaluating ? 'Evaluating...' : 'Submit Journal Entry'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
