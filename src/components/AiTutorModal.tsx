import React, { useState, useEffect } from 'react';
import { X, Sparkles, BookOpen, HelpCircle } from 'lucide-react';
import { AccountingScenario, JournalEntryLine } from '../types/accounting';
import { generateEducationalExplanation, ACCOUNTING_FAQS, TutorFaq } from '../utils/tutorEngine';

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextScenario?: AccountingScenario | null;
  contextUserLines?: JournalEntryLine[];
  contextCorrectLines?: any;
}

const FAQ_CATEGORIES = [
  'All',
  'Journal Entries',
  'Adjusting Entries',
  'Financial Statements',
  'Depreciation',
  'Inventory',
  'Revenue Recognition',
  'Liabilities',
  'Assets',
  'Standards'
] as const;

// Helper to convert inline markdown and symbols
function renderInlineFormatting(text: string): string {
  let formatted = text
    // Normalize LaTeX and symbol arrows
    .replace(/\\right\s*arrow/gi, '→')
    .replace(/\\rightarrow/gi, '→')
    .replace(/\\to\b/gi, '→')
    .replace(/\\longrightarrow/gi, '→')
    .replace(/\\Rightarrow/gi, '⇒')
    .replace(/-->/g, '→')
    .replace(/(^|\s)->(\s|$)/g, '$1→$2')
    .replace(/\\leftarrow/gi, '←')
    .replace(/\\Delta\b/gi, 'Δ')
    .replace(/\\times\b/gi, '×')
    .replace(/\\div\b/gi, '÷')
    .replace(/\\approx\b/gi, '≈')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/'''[a-z]*/gi, '')
    .replace(/'''/g, '');

  // Strip math delimiters around words while preserving currency amounts like $1,000 or $30,000
  formatted = formatted.replace(/\$([A-Za-z][^\$]*?)\$/g, '$1');

  // Convert **bold**
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-slate-950">$1</strong>');
  
  // Convert *italic*
  formatted = formatted.replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, '$1<em class="italic text-slate-800">$2</em>$3');

  // Style arrow symbol
  formatted = formatted.replace(/→/g, '<span class="inline-flex items-center text-indigo-600 font-bold mx-1">→</span>');

  return formatted;
}

// Helper to parse markdown table
function parseMarkdownTable(tableText: string): { headers: string[]; rows: string[][] } | null {
  const lines = tableText
    .trim()
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('|') && l.endsWith('|'));

  if (lines.length < 2) return null;

  const parseRow = (line: string) =>
    line.split('|').slice(1, -1).map(c => c.trim());

  const headers = parseRow(lines[0]);
  // Filter out divider line (| :--- | :--- |)
  const dataLines = lines.slice(1).filter(l => !l.replace(/[\s|:-]/g, '').length ? false : true);
  const rows = dataLines.map(parseRow);

  return { headers, rows };
}

// Formatted component for Journal Entry Table
const JournalEntryTable: React.FC<{ headers: string[]; rows: string[][] }> = ({ rows }) => {
  return (
    <div className="my-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="bg-slate-900 px-3.5 py-2 text-white flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Demonstrated Journal Entry</span>
        </div>
        <span className="text-[11px] text-slate-400">Canadian Standards (IFRS / ASPE)</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3.5">Account Title & Explanation</th>
              <th className="py-2.5 px-3.5 text-right w-24 sm:w-28">Debit</th>
              <th className="py-2.5 px-3.5 text-right w-24 sm:w-28">Credit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, rIdx) => {
              const rawAccount = row[0] || '';
              const debitAmt = row[1] || '';
              const creditAmt = row[2] || '';
              const isCreditRow = Boolean(creditAmt && !debitAmt) || rawAccount.startsWith('&nbsp;') || rawAccount.startsWith('    ') || rawAccount.toLowerCase().includes('credit:');
              const cleanAccount = rawAccount
                .replace(/^(&nbsp;|\s)+/, '')
                .replace(/^(Debit|Credit):\s*/i, '');

              // Check if row is an explanation note e.g. *(To record...)*
              const isNote = rawAccount.startsWith('*(') || rawAccount.startsWith('(');

              if (isNote) {
                return (
                  <tr key={rIdx} className="bg-slate-50/60">
                    <td colSpan={3} className="py-2 px-3.5 text-slate-500 italic text-[11px]">
                      <span dangerouslySetInnerHTML={{ __html: renderInlineFormatting(rawAccount) }} />
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={rIdx} className={isCreditRow ? "bg-slate-50/40" : "bg-white"}>
                  <td className={`py-2 px-3.5 ${isCreditRow ? "pl-7 sm:pl-9" : "pl-3.5 font-semibold text-slate-900"}`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${isCreditRow ? "bg-slate-200 text-slate-700" : "bg-indigo-100 text-indigo-700"}`}>
                        {isCreditRow ? "CR" : "DR"}
                      </span>
                      <span dangerouslySetInnerHTML={{ __html: renderInlineFormatting(cleanAccount) }} />
                    </div>
                  </td>
                  <td className="py-2 px-3.5 text-right font-mono font-medium text-slate-800">
                    {debitAmt || '—'}
                  </td>
                  <td className="py-2 px-3.5 text-right font-mono font-medium text-slate-800">
                    {creditAmt || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Formatted component for Structured Text Journal Entry (e.g. Debit: ... Credit: ...)
const StructuredJournalCard: React.FC<{ rawText: string }> = ({ rawText }) => {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="bg-slate-900 px-3.5 py-2 text-white flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Demonstrated Journal Entry</span>
        </div>
        <span className="text-[11px] text-slate-400">Canadian Standards (IFRS / ASPE)</span>
      </div>
      <div className="p-3.5 space-y-2 font-mono text-xs bg-slate-50/50">
        {lines.map((line, idx) => {
          const isDebit = line.toLowerCase().startsWith('debit:');
          const isCredit = line.toLowerCase().includes('credit:');
          
          if (isDebit) {
            return (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-indigo-50/70 border border-indigo-100">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-200 text-indigo-800">DR</span>
                  <span className="text-slate-900 font-semibold">{line.replace(/^debit:\s*/i, '')}</span>
                </div>
              </div>
            );
          }
          if (isCredit) {
            return (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-100/80 border border-slate-200 ml-5 sm:ml-8">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-300 text-slate-800">CR</span>
                  <span className="text-slate-800">{line.replace(/^.*?credit:\s*/i, '')}</span>
                </div>
              </div>
            );
          }
          return (
            <div key={idx} className="text-slate-500 italic text-[11px] pt-1">
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main formatted explanation renderer
const FormattedExplanation: React.FC<{ content: string }> = ({ content }) => {
  // Preprocess content: clean formatting artifacts, raw code blocks, and normalize line breaks
  let cleaned = content
    .replace(/'''(?:text|markdown)?/gi, '')
    .replace(/'''/g, '')
    .replace(/```(?:text|markdown)?/gi, '```')
    // Ensure headings have double newlines before them
    .replace(/([^\n])\n(#{1,4}\s)/g, '$1\n\n$2')
    // Ensure horizontal lines have double newlines
    .replace(/([^\n])\n([-*]{3,})\n/g, '$1\n\n$2\n\n')
    // Ensure tables are separated by double newlines
    .replace(/([^\n|])\n(\|)/g, '$1\n\n$2')
    .replace(/(\|\n)([^\n|])/g, '$1\n\n$2')
    // Clean up math markers
    .replace(/\\Delta\s*\\text\{([^}]+)\}/g, 'Change in $1')
    .replace(/\\Delta/g, 'Change in ')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    .replace(/\\text\{([^}]+)\}/g, '$1');

  // Split into content blocks
  const rawBlocks = cleaned.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);

  return (
    <div className="space-y-4 text-slate-800 text-xs sm:text-sm leading-relaxed">
      {rawBlocks.map((block, bIdx) => {
        // Horizontal divider (--- or ***)
        if (block.match(/^[-*]{3,}$/)) {
          return <hr key={bIdx} className="my-3 border-slate-200" />;
        }

        // Markdown Table Block
        if (block.includes('|') && block.split('\n').filter(l => l.trim().startsWith('|')).length >= 2) {
          const parsed = parseMarkdownTable(block);
          if (parsed) {
            const hStr = parsed.headers.join(' ').toLowerCase();
            if (hStr.includes('debit') || hStr.includes('credit') || hStr.includes('account')) {
              return <JournalEntryTable key={bIdx} headers={parsed.headers} rows={parsed.rows} />;
            }
            // Generic table
            return (
              <div key={bIdx} className="my-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold">
                      {parsed.headers.map((h, hIdx) => (
                        <th key={hIdx} className="py-2 px-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsed.rows.map((r, rIdx) => (
                      <tr key={rIdx} className={rIdx % 2 === 1 ? "bg-slate-50/50" : "bg-white"}>
                        {r.map((c, cIdx) => (
                          <td key={cIdx} className="py-2 px-3">{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
        }

        // Code block (Journal entries or text)
        if (block.startsWith('```')) {
          const innerLines = block.replace(/```[a-z]*/g, '').trim();
          if (innerLines.toLowerCase().includes('debit:') || innerLines.toLowerCase().includes('credit:')) {
            return <StructuredJournalCard key={bIdx} rawText={innerLines} />;
          }
          return (
            <div key={bIdx} className="my-2 p-3 bg-slate-900 text-emerald-300 font-mono text-xs rounded-lg overflow-x-auto border border-slate-800">
              <pre className="whitespace-pre">{innerLines}</pre>
            </div>
          );
        }

        // Non-code block that is a structured debit/credit entry
        if ((block.toLowerCase().startsWith('debit:') || block.toLowerCase().includes('\ndebit:')) && block.toLowerCase().includes('credit:')) {
          return <StructuredJournalCard key={bIdx} rawText={block} />;
        }

        // Heading 3
        if (block.startsWith('### ')) {
          return (
            <div key={bIdx} className="pt-2">
              <h4 className="text-sm font-bold text-indigo-950 pb-1.5 border-b border-indigo-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span>
                <span>{block.replace(/^###\s*/, '')}</span>
              </h4>
            </div>
          );
        }

        // Heading 2 or 1
        if (block.startsWith('## ') || block.startsWith('# ')) {
          return (
            <div key={bIdx} className="pt-2">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 pb-1 border-b border-slate-200">
                {block.replace(/^#+\s*/, '')}
              </h3>
            </div>
          );
        }

        // Bullet or Numbered List
        if (block.match(/^[*-]\s/) || block.match(/^\d+\.\s/) || block.includes('\n* ') || block.includes('\n- ')) {
          const items = block.split(/\n(?=[*-]\s|\d+\.\s)/);
          return (
            <ul key={bIdx} className="space-y-2 pl-1 list-none">
              {items.map((item, iIdx) => {
                const isNumbered = item.match(/^(\d+)\.\s+/);
                const numberPrefix = isNumbered ? isNumbered[1] : null;
                const itemText = item.replace(/^[*-]\s+|\d+\.\s+/, '').trim();

                return (
                  <li key={iIdx} className="flex items-start gap-2.5 text-slate-700">
                    {numberPrefix ? (
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {numberPrefix}
                      </span>
                    ) : (
                      <span className="text-indigo-500 font-bold mt-0.5 shrink-0 text-sm">•</span>
                    )}
                    <span
                      className="flex-1 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: renderInlineFormatting(itemText) }}
                    />
                  </li>
                );
              })}
            </ul>
          );
        }

        // Standard Paragraph: preserve internal line breaks so it NEVER collapses into a single continuous block
        const lines = block.split('\n').filter(Boolean);
        return (
          <p key={bIdx} className="text-slate-700 leading-relaxed">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                <span dangerouslySetInnerHTML={{ __html: renderInlineFormatting(line) }} />
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
};

export const AiTutorModal: React.FC<AiTutorModalProps> = ({
  isOpen,
  onClose,
  contextScenario,
  contextUserLines,
  contextCorrectLines
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);
  const [activeQuestionTitle, setActiveQuestionTitle] = useState<string>('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Set initial FAQ or context scenario explanation when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (contextScenario) {
      handleSelectCurrentScenario();
    } else {
      const defaultFaq = ACCOUNTING_FAQS[0];
      if (defaultFaq) {
        handleSelectFaq(defaultFaq);
      }
    }
  }, [isOpen, contextScenario]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectFaq = async (faq: TutorFaq) => {
    setActiveFaqId(faq.id);
    setActiveQuestionTitle(faq.question);
    setIsLoading(true);
    setResponse(null);

    const payload = {
      question: faq.question,
      scenarioTitle: contextScenario?.title,
      scenarioNarrative: contextScenario?.narrative,
      scenarioTopic: contextScenario?.topic,
      companyName: contextScenario?.companyName,
      userEntry: contextUserLines,
      correctEntry: contextCorrectLines
    };

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
        throw new Error(`Server returned non-JSON or status ${res.status}`);
      }

      const data = await res.json();
      if (data && data.reply) {
        setResponse(data.reply);
      } else {
        throw new Error('Empty reply in response');
      }
    } catch {
      // Direct high-fidelity response from our curated Canadian accounting engine
      const reply = faq.response || generateEducationalExplanation(payload);
      setResponse(reply);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCurrentScenario = async () => {
    if (!contextScenario) return;
    const promptText = `Can you explain why the journal entry for "${contextScenario.title}" uses these accounts and debits/credits?`;
    setActiveFaqId('context-scenario');
    setActiveQuestionTitle(promptText);
    setIsLoading(true);
    setResponse(null);

    const payload = {
      question: promptText,
      scenarioTitle: contextScenario.title,
      scenarioNarrative: contextScenario.narrative,
      scenarioTopic: contextScenario.topic,
      companyName: contextScenario.companyName,
      userEntry: contextUserLines,
      correctEntry: contextCorrectLines
    };

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
        throw new Error(`Server returned non-JSON or status ${res.status}`);
      }

      const data = await res.json();
      if (data && data.reply) {
        setResponse(data.reply);
      } else {
        throw new Error('Empty reply in response');
      }
    } catch {
      const fallbackReply = generateEducationalExplanation(payload);
      setResponse(fallbackReply);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFaqs = selectedCategory === 'All'
    ? ACCOUNTING_FAQS
    : ACCOUNTING_FAQS.filter(f => f.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutor-modal-title"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-400/30 shrink-0">
              <Sparkles className="w-4 h-4 text-indigo-300" />
            </div>
            <div>
              <h3 id="tutor-modal-title" className="font-bold text-sm sm:text-base leading-tight">
                Canadian Accounting Professor & Socratic AI Tutor
              </h3>
              <p className="text-xs text-slate-400">
                Detailed conceptual breakdowns & Canadian standards (IFRS & ASPE)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Active Scenario Context Banner */}
          {contextScenario && (
            <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs text-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-indigo-950">Active Practice Scenario:</span> {contextScenario.title}
                  <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">({contextScenario.topic})</span>
                </div>
              </div>
              <button
                onClick={handleSelectCurrentScenario}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer ${
                  activeFaqId === 'context-scenario'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white hover:bg-indigo-100/70 text-indigo-700 border border-indigo-300'
                }`}
              >
                Explain Current Scenario
              </button>
            </div>
          )}

          {/* FAQ Navigation & Category Filters */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>Frequently Asked Accounting Questions ({ACCOUNTING_FAQS.length} curated topics)</span>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {FAQ_CATEGORIES.map(category => {
                const count = category === 'All'
                  ? ACCOUNTING_FAQS.length
                  : ACCOUNTING_FAQS.filter(f => f.category === category).length;
                const isSelected = selectedCategory === category;

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {category} <span className={`text-[10px] ml-0.5 ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Questions List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-0.5 scrollbar-thin">
              {filteredFaqs.map(faq => {
                const isSelected = activeFaqId === faq.id;

                return (
                  <button
                    key={faq.id}
                    onClick={() => handleSelectFaq(faq)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-start gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-medium ring-1 ring-indigo-400/30'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 uppercase tracking-wider ${
                      isSelected ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {faq.category}
                    </span>
                    <span className="flex-1 leading-snug line-clamp-2">{faq.question}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Response Box */}
          {isLoading && (
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-500 text-xs sm:text-sm space-y-2">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p>Retrieving Canadian accounting standard breakdown...</p>
            </div>
          )}

          {response && !isLoading && (
            <div className="p-4 sm:p-5 bg-indigo-50/40 rounded-xl border border-indigo-100/80 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3 animate-in fade-in">
              <div className="border-b border-indigo-100 pb-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Canadian Accounting Professor Explanation</span>
                </div>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                  {activeQuestionTitle}
                </h4>
              </div>
              <FormattedExplanation content={response} />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span className="hidden sm:inline">Aligned with CPA Canada Standards (IFRS & ASPE)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
