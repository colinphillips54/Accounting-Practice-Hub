export type AccountCategory = 
  | 'Asset' 
  | 'ContraAsset'
  | 'Liability' 
  | 'ContraLiability'
  | 'Equity' 
  | 'Dividend'
  | 'Revenue' 
  | 'ContraRevenue'
  | 'Expense';

export type NormalBalance = 'Debit' | 'Credit';

export interface Account {
  id: string;
  code: string;
  name: string;
  category: AccountCategory;
  normalBalance: NormalBalance;
  description: string;
  statement: 'BalanceSheet' | 'IncomeStatement' | 'RetainedEarnings';
}

export interface JournalEntryLine {
  id: string;
  accountId: string;
  debit: number | null;
  credit: number | null;
}

export type PracticeDifficultyCategory = 
  | 'Beginner'
  | 'Intro Accounting'
  | 'Intermediate Accounting 1'
  | 'Intermediate Accounting 2';

export type DifficultyLevel = 
  | PracticeDifficultyCategory
  | 'Intermediate'
  | 'Advanced';

export type AccountingTopic = 
  | 'Investments & Capital'
  | 'Revenues & Receivables'
  | 'Operating Expenses'
  | 'Supplies & Equipment'
  | 'Accruals & Deferrals'
  | 'Merchandising & Inventory'
  | 'Dividends & Closing'
  | 'Inventories & LCNRV'
  | 'Discontinued Operations'
  | 'Other Comprehensive Income'
  | 'IFRS Revenue Recognition'
  | 'Warranties & Provisions'
  | 'Long-Term Contracts'
  | 'Discounts & Receivables'
  | 'Investments (Equity & Cost)'
  | 'Property, Plant & Revaluation'
  | 'Depreciation & Impairment'
  | 'Asset Retirement Obligations'
  | 'Non-Interest Bearing Notes'
  | 'Bonds Payable & Effective Interest'
  | 'Equipment & Note Present Value'
  | 'Stock & Liquidating Dividends'
  | 'Derivatives & Hedging'
  | 'Deferred Income Taxes'
  | 'Pensions & Employee Benefits'
  | 'Leases (IFRS 16 & ASPE)';


export interface CalculationInput {
  label: string;
  value: string | number;
}

export interface CalculationDetail {
  title: string;
  formula: string;
  inputs: CalculationInput[];
  steps?: string[];
  calculatedAmount: string | number;
  explanation: string;
}

export interface AccountingScenario {
  id: string;
  title: string;
  companyName: string;
  date: string;
  narrative: string;
  topic: AccountingTopic;
  difficulty: DifficultyLevel;
  hints: string[];
  calculationDetail?: CalculationDetail;
  correctLines: {
    accountId: string;
    debit: number;
    credit: number;
  }[];
  explanation: string;
  accountAnalysis: {
    accountId: string;
    action: 'Debit' | 'Credit';
    amount: number;
    reason: string;
  }[];
  equationImpact: {
    assets: number;
    liabilities: number;
    equity: number;
    explanation: string;
  };
}

export interface MultiTransactionScenario {
  id: string;
  title: string;
  companyName: string;
  businessType: string;
  description: string;
  transactions: AccountingScenario[];
}

export interface LedgerPosting {
  date: string;
  reference: string;
  description: string;
  debit: number;
  credit: number;
}

export interface TAccountData {
  account: Account;
  postings: LedgerPosting[];
  totalDebits: number;
  totalCredits: number;
  balance: number;
  balanceType: NormalBalance;
}

export interface TrialBalanceRow {
  account: Account;
  debit: number;
  credit: number;
}

export interface FinancialStatements {
  incomeStatement: {
    revenues: { account: Account; amount: number }[];
    totalRevenue: number;
    expenses: { account: Account; amount: number }[];
    totalExpenses: number;
    netIncome: number;
  };
  retainedEarningsStatement: {
    beginningRetainedEarnings: number;
    netIncome: number;
    dividends: number;
    endingRetainedEarnings: number;
  };
  balanceSheet: {
    currentAssets: { account: Account; amount: number }[];
    totalCurrentAssets: number;
    nonCurrentAssets: { account: Account; amount: number }[];
    totalNonCurrentAssets: number;
    totalAssets: number;
    currentLiabilities: { account: Account; amount: number }[];
    totalCurrentLiabilities: number;
    longTermLiabilities: { account: Account; amount: number }[];
    totalLongTermLiabilities: number;
    totalLiabilities: number;
    commonShares: number;
    commonStock: number;
    endingRetainedEarnings: number;
    totalEquity: number;
    totalLiabilitiesAndEquity: number;
    isBalanced: boolean;
  };
}

export interface GuidedHint {
  type: 'account' | 'side' | 'amount' | 'general';
  title: string;
  hint: string;
}

export interface EvaluationResult {
  isCorrect: boolean;
  score: number; // 0 to 100
  isValidationNotice?: boolean;
  validationTitle?: string;
  attemptNumber?: number; // 1, 2, 3+
  maxAttempts?: number; // default 3
  guidedHints?: GuidedHint[];
  issues: string[];
  lineFeedback: {
    userLineIndex: number;
    status: 'correct' | 'wrong-amount' | 'wrong-side' | 'wrong-account' | 'unneeded';
    message: string;
  }[];
  missingLines: {
    accountId: string;
    debit: number;
    credit: number;
  }[];
  calculationDetail?: CalculationDetail;
}

export interface MistakeRecord {
  id: string;
  timestamp: number;
  scenarioId: string;
  scenarioTitle: string;
  topic: AccountingTopic;
  studentSummary: string;
  correctSummary: string;
  feedback: string;
}

export interface MockExamQuestion {
  id: string;
  topic: AccountingTopic;
  prompt: string;
  type: 'multiple_choice' | 'journal_entry';
  options?: string[];
  correctOptionIndex?: number;
  journalScenario?: AccountingScenario;
  explanation: string;
}

export interface MockExam {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  estimatedMinutes: number;
  questions: MockExamQuestion[];
}

export interface ExamSubmission {
  examId: string;
  date: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: {
    questionId: string;
    isCorrect: boolean;
    userAnswer: number | JournalEntryLine[];
  }[];
  topicBreakdown: Record<string, { total: number; correct: number }>;
}
