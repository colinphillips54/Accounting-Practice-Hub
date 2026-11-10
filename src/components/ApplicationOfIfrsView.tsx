import React, { useState } from 'react';
import {
  FileText,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Building2,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Send,
  Plus,
  Trash2,
  Edit3,
  Award,
  Layers,
  Info
} from 'lucide-react';
import {
  IfrsCase,
  StudentCaseSubmission,
  StudentShortAnswerIssue,
  CaseEvaluationResult
} from '../types/ifrsCase';
import {
  generateRandomIfrsCase,
  ALL_IFRS_STANDARDS,
  CORE_IFRS_STANDARDS
} from '../utils/ifrsCaseGenerator';
import { isSubmissionBlank, evaluateStudentCaseSubmission, sanitizeEvaluationFeedback } from '../utils/ifrsCaseEvaluator';

interface ApplicationOfIfrsViewProps {
  onOpenAiTutorWithContext?: (scenario: any, userLines: any, correctLines: any) => void;
}

export const ApplicationOfIfrsView: React.FC<ApplicationOfIfrsViewProps> = ({
  onOpenAiTutorWithContext
}) => {
  // Single active case displayed (freshly replaced on each generate)
  const [activeCase, setActiveCase] = useState<IfrsCase>(() => generateRandomIfrsCase());
  const [caseNumber, setCaseNumber] = useState<number>(1);
  const [seenCompanyNames, setSeenCompanyNames] = useState<string[]>(() => [activeCase.companyName]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationNotice, setGenerationNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Active reading tab: 'narrative' or appendix id
  const [activeTab, setActiveTab] = useState<string>('narrative');

  // Current submission and evaluation for the displayed case
  const [currentSubmission, setCurrentSubmission] = useState<StudentCaseSubmission>(() => ({
    caseId: activeCase.id,
    issues: [
      {
        id: 'issue-1',
        identifiedIssueTitle: '',
        chosenStandard: '',
        handbookSection: '',
        analysisAndFacts: '',
        recommendation: '',
        userImpact: ''
      }
    ]
  }));
  const [currentEvaluation, setCurrentEvaluation] = useState<CaseEvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Model solution collapse state
  const [showModelSolution, setShowModelSolution] = useState<boolean>(false);

  // Helper to update current submission
  const updateSubmission = (updated: StudentCaseSubmission) => {
    setCurrentSubmission(updated);
    setValidationError(null);
  };

  // Add an accounting issue to short-answer response
  const handleAddIssue = () => {
    const newIssue: StudentShortAnswerIssue = {
      id: `issue-${Date.now()}-${currentSubmission.issues.length + 1}`,
      identifiedIssueTitle: '',
      chosenStandard: '',
      handbookSection: '',
      analysisAndFacts: '',
      recommendation: '',
      userImpact: ''
    };
    updateSubmission({
      ...currentSubmission,
      issues: [...currentSubmission.issues, newIssue]
    });
  };

  // Remove an issue
  const handleRemoveIssue = (id: string) => {
    if (currentSubmission.issues.length <= 1) {
      // Reset the single issue instead of deleting all
      updateSubmission({
        ...currentSubmission,
        issues: [
          {
            id: 'issue-1',
            identifiedIssueTitle: '',
            chosenStandard: '',
            handbookSection: '',
            analysisAndFacts: '',
            recommendation: '',
            userImpact: ''
          }
        ]
      });
      return;
    }
    updateSubmission({
      ...currentSubmission,
      issues: currentSubmission.issues.filter(i => i.id !== id)
    });
  };

  // Update specific field on an issue
  const handleIssueFieldChange = (
    id: string,
    field: keyof StudentShortAnswerIssue,
    value: string
  ) => {
    updateSubmission({
      ...currentSubmission,
      issues: currentSubmission.issues.map(issue =>
        issue.id === id ? { ...issue, [field]: value } : issue
      )
    });
  };

  // Quick select standard for an issue
  const handleSelectStandardSuggestion = (issueId: string, stdCode: string) => {
    const stdInfo = ALL_IFRS_STANDARDS.find(s => s.code.toLowerCase() === stdCode.toLowerCase());
    updateSubmission({
      ...currentSubmission,
      issues: currentSubmission.issues.map(issue => {
        if (issue.id === issueId) {
          return {
            ...issue,
            chosenStandard: stdCode,
            handbookSection: stdInfo ? stdInfo.handbookSection : issue.handbookSection
          };
        }
        return issue;
      })
    });
  };

  // Generate a brand new randomized case every time, replacing the current one completely
  const handleGenerateNewCase = async () => {
    setIsGenerating(true);
    setGenerationNotice(null);
    try {
      let newCase: IfrsCase | null = null;

      // 1. Attempt to generate via backend server route
      try {
        const resp = await fetch('/api/generate-ifrs-case', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ previousCompanyNames: seenCompanyNames })
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.case && data.case.companyName && Array.isArray(data.case.issues) && data.case.issues.length >= 2) {
            newCase = data.case;
          }
        }
      } catch (apiErr) {
        console.warn('Server IFRS case generation error, using local generator:', apiErr);
      }

      // 2. If server was unavailable or failed, generate client-side with exclusion list
      if (!newCase) {
        newCase = generateRandomIfrsCase(seenCompanyNames);
      }

      // 3. Strict verification of uniqueness and validity
      const isDuplicate = !newCase || !newCase.companyName || 
        seenCompanyNames.some(name => name.toLowerCase().trim() === newCase!.companyName.toLowerCase().trim()) ||
        newCase.companyName.toLowerCase().trim() === activeCase.companyName.toLowerCase().trim();

      const isValid = newCase && 
        Array.isArray(newCase.issues) && newCase.issues.length >= 2 &&
        Array.isArray(newCase.appendices) && newCase.appendices.length >= 2 &&
        Boolean(newCase.narrative);

      if (isDuplicate || !isValid) {
        const retryExclusions = [...seenCompanyNames, activeCase.companyName];
        if (newCase?.companyName) retryExclusions.push(newCase.companyName);
        newCase = generateRandomIfrsCase(retryExclusions);
      }

      const finalIsDuplicate = !newCase || !newCase.companyName || 
        seenCompanyNames.some(name => name.toLowerCase().trim() === newCase!.companyName.toLowerCase().trim()) ||
        newCase.companyName.toLowerCase().trim() === activeCase.companyName.toLowerCase().trim();

      const finalIsValid = newCase && 
        Array.isArray(newCase.issues) && newCase.issues.length >= 2 &&
        Array.isArray(newCase.appendices) && newCase.appendices.length >= 2 &&
        Boolean(newCase.narrative);

      // If a unique case cannot be generated, the application should not silently return a previously generated case
      if (finalIsDuplicate || !finalIsValid || !newCase) {
        setGenerationNotice({
          type: 'error',
          message: 'Unable to generate an entirely new unique case at this time. Please click Generate New Case again.'
        });
        return;
      }

      // Record newly generated company name to prevent reuse in session
      setSeenCompanyNames(prev => [...prev, newCase!.companyName]);

      // Replace current case
      setActiveCase(newCase);
      setCaseNumber(prev => prev + 1);
      setActiveTab('narrative');
      setValidationError(null);
      setShowModelSolution(false);
      setCurrentEvaluation(null);
      setCurrentSubmission({
        caseId: newCase.id,
        issues: [
          {
            id: `issue-${Date.now()}-1`,
            identifiedIssueTitle: '',
            chosenStandard: '',
            handbookSection: '',
            analysisAndFacts: '',
            recommendation: '',
            userImpact: ''
          }
        ]
      });
      setGenerationNotice({
        type: 'success',
        message: `Generated new case: ${newCase.companyName} (${newCase.industry}) — ${newCase.issues.length} technical IFRS issues ready to analyze!`
      });
    } catch (err) {
      console.error('Fatal error generating IFRS case:', err);
      // Do not silently return a duplicate or display an invalid case
      setGenerationNotice({
        type: 'error',
        message: 'Case generation encountered an error. Please click Generate New Case again.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle case evaluation submission
  const handleSubmitEvaluation = async () => {
    setValidationError(null);

    // Validate if completely blank or empty
    if (isSubmissionBlank(currentSubmission)) {
      setValidationError(
        'Submission Required: Please identify at least one accounting issue and enter your analysis before submitting. A blank submission cannot be evaluated.'
      );
      return;
    }

    setIsEvaluating(true);

    try {
      // Call backend API
      const res = await fetch('/api/evaluate-ifrs-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseData: activeCase,
          submission: currentSubmission
        })
      });

      if (res.ok) {
        const data: CaseEvaluationResult = await res.json();
        setCurrentEvaluation(sanitizeEvaluationFeedback(data));
      } else {
        // Fallback to local evaluation engine
        const fallback = evaluateStudentCaseSubmission(activeCase, currentSubmission);
        setCurrentEvaluation(fallback);
      }
    } catch {
      // On network failure, use deterministic local evaluator
      const fallback = evaluateStudentCaseSubmission(activeCase, currentSubmission);
      setCurrentEvaluation(fallback);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Reset or revise submission
  const handleReviseSubmission = () => {
    setCurrentEvaluation(null);
    setShowModelSolution(false);
    setValidationError(null);
  };

  // Featured standard shortcut badges
  const FEATURED_STANDARDS = [
    'IFRS 15', 'IFRS 16', 'IFRS 9', 'IFRS 2', 'IFRS 5', 'IFRS 11',
    'IAS 37', 'IAS 38', 'IAS 36', 'IAS 2', 'IAS 1', 'IAS 16',
    'IAS 20', 'IAS 23', 'IAS 10', 'IAS 40'
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Case Generator Controls */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-xl p-5 md:p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                Part I CPA Canada Handbook
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                All IFRS & IAS Standards Covered
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/40 text-indigo-200 border border-indigo-400/30">
                Practice Case #{caseNumber}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Application of IFRS — CPA Canada Practice Cases
            </h2>
            <p className="text-sm text-blue-200/90 max-w-3xl">
              Analyze multi-transaction business cases under International Financial Reporting Standards.
              Read the background and appendices, independently identify the accounting issues, apply Handbook criteria, formulate recommendations, and evaluate their impact on financial statement users.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleGenerateNewCase}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm cursor-pointer w-full sm:w-auto"
              title="Generate a completely new Canadian IFRS/IAS case"
            >
              <Sparkles className={`w-4 h-4 text-amber-300 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Generating Case…' : 'Generate New Case'}</span>
            </button>
          </div>
        </div>

        {/* Generation Notice Banner */}
        {generationNotice && (
          <div
            className={`mt-4 p-3 rounded-lg text-xs border flex items-center justify-between gap-2 animate-in fade-in ${
              generationNotice.type === 'error'
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                : 'bg-blue-500/20 border-blue-400/30 text-blue-100'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {generationNotice.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              )}
              <span className="font-medium break-words">{generationNotice.message}</span>
            </div>
            <button
              onClick={() => setGenerationNotice(null)}
              className="text-slate-300 hover:text-white p-0.5 rounded font-bold text-sm shrink-0 cursor-pointer"
              aria-label="Dismiss notice"
            >
              ×
            </button>
          </div>
        )}

        {/* Active Case Meta Bar */}
        <div className="mt-5 pt-4 border-t border-blue-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs md:text-sm">
          <div>
            <span className="text-blue-300/70 block text-[11px] uppercase tracking-wider font-semibold">Entity</span>
            <span className="font-semibold text-white">{activeCase.companyName} {activeCase.ticker ? `(${activeCase.ticker})` : ''}</span>
          </div>
          <div>
            <span className="text-blue-300/70 block text-[11px] uppercase tracking-wider font-semibold">Industry & HQ</span>
            <span className="text-slate-200">{activeCase.industry} • {activeCase.headquarters || 'Canada'}</span>
          </div>
          <div>
            <span className="text-blue-300/70 block text-[11px] uppercase tracking-wider font-semibold">Reporting Framework</span>
            <span className="text-emerald-300 font-medium">{activeCase.reportingFramework}</span>
          </div>
          <div>
            <span className="text-blue-300/70 block text-[11px] uppercase tracking-wider font-semibold">Your Role</span>
            <span className="text-slate-200">{activeCase.role}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Case Reader (Left) & Student Submission Workspace (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Case Narrative & Appendices Reader */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Tab navigation for narrative and appendices */}
            <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto scrollbar-thin">
              <button
                onClick={() => setActiveTab('narrative')}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs md:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'narrative'
                    ? 'border-blue-600 text-blue-700 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Case Narrative</span>
              </button>

              {activeCase.appendices.map(app => (
                <button
                  key={app.id}
                  onClick={() => setActiveTab(app.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs md:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === app.id
                      ? 'border-blue-600 text-blue-700 bg-white'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>{app.title.split(':')[0]}</span>
                </button>
              ))}
            </div>

            {/* Tab Content Display */}
            <div className="p-5 md:p-6 text-sm text-slate-800 leading-relaxed max-h-[720px] overflow-y-auto">
              {activeTab === 'narrative' ? (
                <div className="space-y-4">
                  <div className="bg-blue-50/70 border border-blue-200/80 rounded-lg p-3.5 text-xs text-blue-900">
                    <div className="font-semibold mb-1 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-blue-700" />
                      <span>CPA Canada Examination Mandate</span>
                    </div>
                    <p>
                      Read the case background and all supporting appendices below. The business events contain multiple technical accounting issues across IFRS and IAS standards.
                      Identify each issue, assess the criteria, formulate recommendations, and explain their impact on financial statement users.
                    </p>
                  </div>

                  <div className="prose prose-sm max-w-none text-slate-800 space-y-3 whitespace-pre-line">
                    {activeCase.narrative}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      Key Case Stakeholders & Financial Statement Users
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {activeCase.keyStakeholders.map((sh, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{sh}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                (() => {
                  const currentApp = activeCase.appendices.find(a => a.id === activeTab);
                  if (!currentApp) return null;
                  return (
                    <div className="space-y-4">
                      <div className="border-b border-slate-200 pb-2">
                        <span className="text-xs uppercase tracking-wider font-semibold text-blue-600">
                          {currentApp.type.replace('_', ' ')}
                        </span>
                        <h3 className="text-base md:text-lg font-bold text-slate-900">
                          {currentApp.title}
                        </h3>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg font-mono text-xs md:text-sm text-slate-800 whitespace-pre-line border border-slate-200 leading-relaxed overflow-x-auto">
                        {currentApp.content}
                      </div>

                      <p className="text-xs text-slate-500 italic">
                        Tip: Look for specific terms, dates, financial covenants, or contractual clauses that determine the correct accounting treatment under the CPA Canada Handbook.
                      </p>
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Student Case-Writing Workspace OR Evaluation Results */}
        <div className="lg:col-span-6 space-y-4">
          {!currentEvaluation ? (
            /* Student Short-Answer Case Writing Workspace */
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-5">
              <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-blue-600" />
                    <span>CPA Case Response Memo</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Draft your analysis for each accounting issue you identified in the case.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddIssue}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Identified Issue</span>
                </button>
              </div>

              {/* Validation Warning Alert */}
              {validationError && (
                <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-lg text-xs md:text-sm text-rose-800 flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold block">Incomplete Submission</span>
                    <span>{validationError}</span>
                  </div>
                </div>
              )}

              {/* Student Issues List */}
              <div className="space-y-5 max-h-[680px] overflow-y-auto pr-1">
                {currentSubmission.issues.map((issue, idx) => (
                  <div
                    key={issue.id}
                    className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3 text-xs md:text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] inline-flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span>Accounting Issue #{idx + 1}</span>
                      </span>

                      {currentSubmission.issues.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveIssue(issue.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                          title="Remove this issue"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Short Answer Issue Title */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Identified Issue Statement:
                      </label>
                      <input
                        type="text"
                        value={issue.identifiedIssueTitle}
                        onChange={e => handleIssueFieldChange(issue.id, 'identifiedIssueTitle', e.target.value)}
                        placeholder="e.g. Revenue recognition for customer contract; or Project Horizon R&D capitalization"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
                      />
                    </div>

                    {/* Chosen Standard & Quick Suggestion Pills */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-slate-700">
                          Applicable IFRS or IAS Standard:
                        </label>
                        <span className="text-[11px] text-slate-500 italic">Any IFRS / IAS standard</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2 max-h-20 overflow-y-auto">
                        {FEATURED_STANDARDS.map(code => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => handleSelectStandardSuggestion(issue.id, code)}
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                              issue.chosenStandard.toUpperCase().includes(code)
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-200/80 hover:bg-slate-300 text-slate-700'
                            }`}
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          list={`standards-list-${issue.id}`}
                          value={issue.chosenStandard}
                          onChange={e => handleIssueFieldChange(issue.id, 'chosenStandard', e.target.value)}
                          placeholder="Select or type any IFRS/IAS standard (e.g. IFRS 15, IAS 20, IFRS 9, IAS 38)..."
                          className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
                        />
                        <datalist id={`standards-list-${issue.id}`}>
                          {ALL_IFRS_STANDARDS.map(s => (
                            <option key={s.code} value={s.code}>
                              {s.code} — {s.name}
                            </option>
                          ))}
                        </datalist>
                      </div>
                    </div>

                    {/* CPA Handbook Paragraph Reference */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        CPA Canada Handbook Reference (Optional):
                      </label>
                      <input
                        type="text"
                        value={issue.handbookSection}
                        onChange={e => handleIssueFieldChange(issue.id, 'handbookSection', e.target.value)}
                        placeholder="e.g. Part I - IFRS 15, paras 22-38; or IAS 20.12"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
                      />
                    </div>

                    {/* Criteria Analysis vs Case Facts */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Analysis & Handbook Criteria Applied to Case Facts:
                      </label>
                      <textarea
                        rows={3}
                        value={issue.analysisAndFacts}
                        onChange={e => handleIssueFieldChange(issue.id, 'analysisAndFacts', e.target.value)}
                        placeholder="Walk through each Handbook criterion and apply it to the facts, dates, and amounts from the narrative and appendices..."
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
                      />
                    </div>

                    {/* Recommendation */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Recommendation:
                      </label>
                      <textarea
                        rows={2}
                        value={issue.recommendation}
                        onChange={e => handleIssueFieldChange(issue.id, 'recommendation', e.target.value)}
                        placeholder="Make your recommendation…"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
                      />
                    </div>

                    {/* User */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        User:
                      </label>
                      <textarea
                        rows={2}
                        value={issue.userImpact}
                        onChange={e => handleIssueFieldChange(issue.id, 'userImpact', e.target.value)}
                        placeholder="Explain the impact that your recommendation will have on the user of the financial statements…"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  {currentSubmission.issues.length} issue(s) drafted. Ready for evaluation?
                </p>

                <button
                  type="button"
                  onClick={handleSubmitEvaluation}
                  disabled={isEvaluating}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isEvaluating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Evaluating Case Response...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit for CPA Evaluation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* CPA Canada Evaluation Assessment Dashboard */
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-6">
              {/* Overall Score & Rating Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                    CPA Canada Assessment Result
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
                      {currentEvaluation.overallScore}/100
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        currentEvaluation.overallPerformance === 'Competent'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : currentEvaluation.overallPerformance === 'Reaching Competent'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {currentEvaluation.overallPerformance} (
                      {currentEvaluation.overallPerformance === 'Competent'
                        ? 'C'
                        : currentEvaluation.overallPerformance === 'Reaching Competent'
                        ? 'RC'
                        : 'NC'}
                      )
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReviseSubmission}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Revise Analysis</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateNewCase}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Next Case</span>
                  </button>
                </div>
              </div>

              {/* Summary Feedback */}
              <div className="text-xs md:text-sm text-slate-700 leading-relaxed bg-blue-50/50 p-3.5 rounded-lg border border-blue-200/60">
                <span className="font-semibold text-blue-900 block mb-1">Marker Summary:</span>
                {currentEvaluation.summaryFeedback}
              </div>

              {/* Strengths & Areas for Improvement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm">
                <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200/80">
                  <span className="font-semibold text-emerald-900 flex items-center gap-1.5 mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Strengths</span>
                  </span>
                  <ul className="space-y-1 text-emerald-800 text-xs">
                    {currentEvaluation.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200/80">
                  <span className="font-semibold text-amber-900 flex items-center gap-1.5 mb-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>Areas for Improvement</span>
                  </span>
                  <ul className="space-y-1 text-amber-800 text-xs">
                    {currentEvaluation.areasForImprovement.map((area, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Evaluated Issues Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Evaluation of Your Submitted Issues</span>
                </h4>

                <div className="space-y-3">
                  {currentEvaluation.evaluatedIssues.map((ei, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2 text-xs md:text-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-slate-900">
                          {ei.studentIssueTitle}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              ei.standardCorrect
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {ei.chosenStandard || 'No Standard'} {ei.standardCorrect ? '✓' : '✗'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              ei.status === 'Competent'
                                ? 'bg-emerald-600 text-white'
                                : ei.status === 'Reaching Competent'
                                ? 'bg-amber-500 text-white'
                                : 'bg-rose-600 text-white'
                            }`}
                          >
                            {ei.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-700 text-xs leading-relaxed">{ei.feedback}</p>

                      <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
                        <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                          <span className="font-semibold text-slate-800 block mb-0.5">Criteria Assessment:</span>
                          <span className="text-slate-600">{ei.criteriaAssessment}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                          <span className="font-semibold text-slate-800 block mb-0.5">Recommendation:</span>
                          <span className="text-slate-600">{ei.recommendationAssessment}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                          <span className="font-semibold text-slate-800 block mb-0.5">User Impact:</span>
                          <span className="text-slate-600">{ei.userImpactAssessment}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missed Accounting Issues Section */}
              {currentEvaluation.missedIssues && currentEvaluation.missedIssues.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                    <span>Missed Accounting Issues ({currentEvaluation.missedIssues.length})</span>
                  </div>
                  <p className="text-xs text-amber-800">
                    The following material accounting issues were present in the case facts and business transactions but were not addressed in your response:
                  </p>

                  <div className="space-y-3">
                    {currentEvaluation.missedIssues.map((missed, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-white rounded-lg border border-amber-200 space-y-2 text-xs md:text-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span className="font-bold text-slate-900">{missed.title}</span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                            {missed.standard} • {missed.handbookReference}
                          </span>
                        </div>
                        <p className="text-slate-700 text-xs">{missed.explanation}</p>

                        <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs space-y-1">
                          <span className="font-bold text-slate-900 block">
                            What a stronger response would have addressed:
                          </span>
                          <p className="text-slate-700 whitespace-pre-line text-[11px] leading-relaxed">
                            {missed.whatStrongerResponseWouldHaveAddressed}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Model Solutions Toggle */}
              <div className="pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModelSolution(!showModelSolution)}
                  className="w-full flex items-center justify-between p-3.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs md:text-sm transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>View Complete CPA Canada Model Solution & Financial Statement Impact</span>
                  </span>
                  {showModelSolution ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {showModelSolution && currentEvaluation.modelSolutions && (
                  <div className="mt-3 space-y-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs md:text-sm">
                    {currentEvaluation.modelSolutions.map((sol, idx) => (
                      <div key={idx} className="p-3.5 bg-white rounded-lg border border-slate-200 space-y-2.5">
                        <div className="border-b border-slate-200 pb-1.5 flex flex-wrap items-center justify-between gap-1">
                          <h5 className="font-bold text-slate-900 text-sm">{sol.title}</h5>
                          <span className="text-blue-700 font-mono text-xs">{sol.standard} ({sol.handbookReference})</span>
                        </div>

                        <div>
                          <span className="font-semibold text-slate-800 block text-xs">Criteria Analysis:</span>
                          <p className="text-slate-700 text-xs whitespace-pre-line">{sol.criteriaAnalysis}</p>
                        </div>

                        <div>
                          <span className="font-semibold text-slate-800 block text-xs">Recommended Accounting Treatment:</span>
                          <p className="text-slate-700 text-xs">{sol.recommendation}</p>
                        </div>

                        {sol.journalEntry && (
                          <div>
                            <span className="font-semibold text-slate-800 block text-xs">Required Adjusting Journal Entry:</span>
                            <pre className="p-2.5 bg-slate-900 text-emerald-300 rounded font-mono text-[11px] overflow-x-auto">
                              {sol.journalEntry}
                            </pre>
                          </div>
                        )}

                        <div>
                          <span className="font-semibold text-slate-800 block text-xs">Bank Covenant & Stakeholder Impact:</span>
                          <p className="text-slate-700 text-xs">{sol.covenantImpact}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
