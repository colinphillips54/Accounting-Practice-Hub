/**
 * Types for Comprehensive CPA Canada-style "Application of IFRS" Cases
 * with Short-Answer Submissions and AI Evaluation
 */

export interface CaseAppendix {
  id: string;
  title: string;
  type: 'financial_statement' | 'contract' | 'email' | 'memo' | 'schedule' | 'report';
  content: string;
  dataRows?: Array<Record<string, string | number>>;
}

export interface AccountingCriterion {
  id: string;
  name: string;
  standardReference: string;
  description: string;
  expectedCaseFact: string;
}

export interface IfrsAccountingIssue {
  id: string;
  title: string;
  topic: string;
  standardCode: string; // e.g. "IFRS 15", "IAS 37", "IAS 38", "IAS 36", "IFRS 16", "IAS 2", "IAS 1", "IFRS 11", "IAS 16"
  standardName: string;
  handbookSection: string; // e.g. "Part I - IFRS 15, paras 31-38"
  description: string;
  criteria: AccountingCriterion[];
  modelRecommendation: {
    accountingTreatment: string;
    financialStatementImpact: string;
    journalEntry?: string;
    covenantOrBusinessImpact: string;
  };
  guidanceHints: {
    missingIssueHint: string;
    wrongStandardHint: string;
    incompleteAnalysisHint: string;
  };
}

export interface IfrsCase {
  id: string;
  title: string;
  companyName: string;
  ticker?: string;
  industry: string;
  headquarters?: string;
  fiscalYearEnd?: string;
  reportingFramework: 'IFRS (Part I CPA Canada Handbook)';
  role: string;
  date: string;
  estimatedTimeMinutes: number;
  overview: string;
  narrative: string;
  keyStakeholders: string[];
  userObjectives: string[];
  appendices: CaseAppendix[];
  // Hidden from the student case presentation — used strictly for evaluation!
  issues: IfrsAccountingIssue[];
}

export interface StudentShortAnswerIssue {
  id: string;
  identifiedIssueTitle: string;
  chosenStandard: string;
  handbookSection: string;
  analysisAndFacts: string;
  recommendation: string;
  userImpact: string;
  recommendationAndImpact?: string;
}

export interface StudentCaseSubmission {
  caseId: string;
  memoOverview?: string;
  issues: StudentShortAnswerIssue[];
}

export interface EvaluatedStudentIssue {
  studentIssueTitle: string;
  matchedExpectedIssueId?: string;
  chosenStandard: string;
  expectedStandard?: string;
  standardCorrect: boolean;
  issueIdentifiedCorrectly: boolean;
  status: 'Competent' | 'Reaching Competent' | 'Not Competent';
  feedback: string;
  criteriaAssessment: string;
  recommendationAssessment: string;
  userImpactAssessment: string;
}

export interface MissedAccountingIssue {
  title: string;
  standard: string;
  handbookReference: string;
  explanation: string;
  whatStrongerResponseWouldHaveAddressed: string;
}

export interface ModelIssueSolution {
  title: string;
  standard: string;
  handbookReference: string;
  criteriaAnalysis: string;
  recommendation: string;
  journalEntry?: string;
  covenantImpact: string;
}

export interface CaseEvaluationResult {
  overallScore: number; // 0 to 100
  overallPerformance: 'Competent' | 'Reaching Competent' | 'Not Competent';
  summaryFeedback: string;
  strengths: string[];
  areasForImprovement: string[];
  evaluatedIssues: EvaluatedStudentIssue[];
  missedIssues: MissedAccountingIssue[];
  modelSolutions: ModelIssueSolution[];
}
