import { generateUniqueCanadianCompany } from './canadianCompanyGenerator';

export type TheoryDifficulty = 
  | 'Beginner' 
  | 'Intro Accounting' 
  | 'Intermediate Accounting 1' 
  | 'Intermediate Accounting 2';

export interface TheoryOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface TheoryQuestion {
  id: string;
  topic: string;
  difficulty: TheoryDifficulty;
  difficultyBadge: string;
  question: string;
  scenarioContext?: string;
  options: TheoryOption[];
  correctOptionId: string;
  explanation: string;
  cpaReference: string;
  signature: string;
}

export interface TheoryDifficultyConfig {
  id: TheoryDifficulty;
  name: string;
  badge: string;
  description: string;
  topicsSummary: string[];
  accentColor: string;
}

export const THEORY_DIFFICULTY_CONFIGS: TheoryDifficultyConfig[] = [
  {
    id: 'Beginner',
    name: 'Beginner',
    badge: 'Level 1',
    description: 'Fundamental debits & credits, cash expenses, cash asset purchases, and cash sales/services. Basic accounting equation and DEALER framework.',
    topicsSummary: ['Cash Expenses', 'Cash Asset Purchases', 'Cash Sales & Services', 'Fundamental Debit/Credit Rules'],
    accentColor: 'border-emerald-500 text-emerald-700 bg-emerald-50'
  },
  {
    id: 'Intro Accounting',
    name: 'Intro Accounting',
    badge: 'Level 2',
    description: 'Accruals, deferrals, prepaid expenses, unearned revenues, straight-line depreciation, contra-assets, and the 9-step accounting cycle.',
    topicsSummary: ['Accrued Expenses & Revenues', 'Prepaid Expenses', 'Unearned Revenues', 'Depreciation & Contra-Assets'],
    accentColor: 'border-blue-500 text-blue-700 bg-blue-50'
  },
  {
    id: 'Intermediate Accounting 1',
    name: 'Intermediate Accounting 1',
    badge: 'Level 3',
    description: 'LCNRV inventory valuation, LIFO prohibition, discontinued operations, OCI, IFRS 15 revenue recognition, warranties, discounts, bad debts, and impairment.',
    topicsSummary: ['LCNRV & Impairment', 'IFRS 15 & % of Completion', 'OCI & Equity Method', 'Warranties, Discounts & Bad Debts'],
    accentColor: 'border-indigo-500 text-indigo-700 bg-indigo-50'
  },
  {
    id: 'Intermediate Accounting 2',
    name: 'Intermediate Accounting 2',
    badge: 'Level 4',
    description: 'Asset Retirement Obligations (ARO), present value notes, bonds payable effective interest, stock dividends, derivatives, deferred taxes, pensions, and IFRS 16 leases.',
    topicsSummary: ['ARO & PV Notes', 'Bonds (Discount/Premium PV)', 'Derivatives & Deferred Taxes', 'Pensions & Leases (IFRS 16)'],
    accentColor: 'border-purple-500 text-purple-700 bg-purple-50'
  }
];

function getRandomInt(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step);
  return min + Math.floor(Math.random() * (steps + 1)) * step;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function assignOptionLetters(
  correctText: string,
  incorrectTexts: string[]
): { options: TheoryOption[]; correctOptionId: string } {
  // Take 3 distinct incorrect options
  const distinctIncorrect = Array.from(new Set(incorrectTexts)).slice(0, 3);
  const rawList = [
    { text: correctText, isCorrect: true },
    ...distinctIncorrect.map(t => ({ text: t, isCorrect: false }))
  ];

  const shuffled = shuffle(rawList);
  const letters = ['A', 'B', 'C', 'D'];
  let correctLetter = 'A';

  const options: TheoryOption[] = shuffled.map((item, idx) => {
    const letter = letters[idx];
    if (item.isCorrect) {
      correctLetter = letter;
    }
    return {
      id: letter,
      text: item.text
    };
  });

  return { options, correctOptionId: correctLetter };
}

// =========================================================================
// 1. BEGINNER GENERATORS (Cash Expenses, Asset Purchases, Sales & DEALER)
// =========================================================================

function genBeginnerQuestion(company: string): TheoryQuestion {
  const expAmount = getRandomInt(1200, 6500, 100);
  const assetAmount = getRandomInt(4000, 35000, 1000);
  const revenueAmount = getRandomInt(3000, 18000, 500);

  const templates = [
    // Topic: Cash Expenses
    {
      topic: 'Operating Expenses (Cash Expenses)',
      question: `${company} paid $${expAmount.toLocaleString()} in cash to settle monthly commercial office rent and utility expenses. What is the fundamental accounting effect of this cash expense transaction?`,
      correct: `Cash (an Asset) decreases by $${expAmount.toLocaleString()}, and Operating Expenses increase by $${expAmount.toLocaleString()}, which directly reduces Shareholders' Equity by $${expAmount.toLocaleString()}.`,
      incorrect: [
        `Cash (an Asset) decreases by $${expAmount.toLocaleString()}, and Liabilities decrease by $${expAmount.toLocaleString()}, with zero impact on Shareholders' Equity.`,
        `Operating Expenses increase on the Credit side, while Cash increases on the Debit side to reflect operational activity.`,
        `Total Assets remain unchanged because paying an operational expense is treated as a temporary asset exchange under Canadian accounting standards.`
      ],
      explanation: `Paying cash for an incurred expense reduces liquid assets (Cash decreases with a Credit) and increases expenses (Rent/Utilities Expense increases with a Debit). Under the expanded accounting equation, expenses reduce Net Income, which directly reduces ending Retained Earnings within Shareholders' Equity.`,
      cpaReference: 'ASPE 1000.19 / IFRS Conceptual Framework (Elements of Financial Statements)'
    },
    // Topic: Cash Asset Purchases
    {
      topic: 'Supplies & Equipment (Cash Asset Purchases)',
      question: `${company} purchased $${assetAmount.toLocaleString()} of specialized operational machinery and equipment, paying the full amount immediately in cash. What is the net impact on the company's total assets and accounting equation?`,
      correct: `This is an asset exchange transaction: Equipment increases by $${assetAmount.toLocaleString()} and Cash decreases by $${assetAmount.toLocaleString()}, resulting in zero net change to Total Assets, Total Liabilities, or Shareholders' Equity.`,
      incorrect: [
        `Total Assets increase by $${assetAmount.toLocaleString()}, and Shareholders' Equity decreases by $${assetAmount.toLocaleString()} due to the cash outflow.`,
        `Total Assets increase by $${assetAmount.toLocaleString()}, and Total Liabilities increase by $${assetAmount.toLocaleString()} to reflect the acquired capital asset.`,
        `Equipment Expense is immediately debited for $${assetAmount.toLocaleString()}, reducing current period Net Income to zero.`
      ],
      explanation: `When a business acquires a productive physical asset for cash, one asset (Equipment) replaces another asset (Cash) of identical value. Because the asset provides future economic benefit across multiple operating periods, it is capitalized on the Statement of Financial Position rather than expensed immediately.`,
      cpaReference: 'IAS 16 Property, Plant and Equipment / ASPE 3061 Capital Assets'
    },
    // Topic: Cash Sales & Services
    {
      topic: 'Revenues & Receivables (Cash Sales & Services)',
      question: `${company} completed commercial consulting and maintenance services for a client, collecting $${revenueAmount.toLocaleString()} cash immediately upon completion. How is this transaction recorded under double-entry accounting?`,
      correct: `Debit Cash for $${revenueAmount.toLocaleString()} (increasing an Asset) and Credit Service Revenue for $${revenueAmount.toLocaleString()} (increasing Revenue and Shareholders' Equity).`,
      incorrect: [
        `Credit Cash for $${revenueAmount.toLocaleString()} (decreasing an Asset) and Debit Service Revenue for $${revenueAmount.toLocaleString()} (decreasing Revenue).`,
        `Debit Cash for $${revenueAmount.toLocaleString()} and Credit Unearned Revenue for $${revenueAmount.toLocaleString()} as a deferred liability.`,
        `Debit Accounts Receivable for $${revenueAmount.toLocaleString()} and Credit Cash for $${revenueAmount.toLocaleString()} to balance the transaction.`
      ],
      explanation: `Because services were fully rendered, the revenue is earned. Collecting cash immediately requires a Debit to Cash (Assets increase on the Debit side). Revenues increase with a Credit under the DEALER framework, which increases Net Income and ultimately expands Shareholders' Equity.`,
      cpaReference: 'IFRS 15 / ASPE 3400 Revenue Recognition'
    },
    // Topic: Investments & Capital (Common Shares under CBCA)
    {
      topic: 'Investments & Capital (CBCA Share Structure)',
      question: `Under Canadian corporate statutes (such as the Canada Business Corporations Act - CBCA), an entrepreneur invests $${getRandomInt(10000, 50000, 5000).toLocaleString()} cash into ${company} in exchange for newly issued common shares. What is the correct accounting treatment?`,
      correct: `Debit Cash (Assets increase) and Credit Common Shares (Shareholders' Equity increases), with the shares issued without par or nominal value.`,
      incorrect: [
        `Debit Cash and Credit Common Stock at par value, with any excess recorded in Additional Paid-in Capital.`,
        `Debit Cash and Credit Service Revenue, recognizing the capital contribution as operating income.`,
        `Debit Common Shares and Credit Retained Earnings to record equity contributed to the business.`
      ],
      explanation: `Under Canadian corporate legislation (e.g., CBCA Section 24), Canadian corporations issue shares without par value. When an owner contributes cash capital, Cash is debited (Asset increases) and Common Shares is credited for the entire proceeds (Equity increases). Contributed capital is never recognized as revenue.`,
      cpaReference: 'CBCA Section 24 / ASPE 3250 Shareholders\' Equity'
    },
    // Topic: Fundamental Debit/Credit Rules (DEALER Framework)
    {
      topic: 'Fundamental Debit/Credit Rules (DEALER Framework)',
      question: `According to the DEALER framework of double-entry bookkeeping, which three categories of accounts have normal DEBIT balances and increase with a DEBIT entry?`,
      correct: `Dividends, Expenses, and Assets (D-E-A).`,
      incorrect: [
        `Liabilities, Equity, and Revenues (L-E-R).`,
        `Assets, Liabilities, and Revenues (A-L-R).`,
        `Dividends, Equity, and Assets (D-E-A).`
      ],
      explanation: `The DEALER mnemonic divides accounts into two balanced groups: The left side (Dividends, Expenses, Assets) carry normal Debit balances and increase with Debits. The right side (Liabilities, Equity, Revenues) carry normal Credit balances and increase with Credits.`,
      cpaReference: 'DEALER Accounting Framework / Double-Entry Standard'
    }
  ];

  const item = pick(templates);
  const { options, correctOptionId } = assignOptionLetters(item.correct, item.incorrect);

  return {
    id: `theory-beg-${Date.now()}-${getRandomInt(100, 999)}`,
    topic: item.topic,
    difficulty: 'Beginner',
    difficultyBadge: 'Level 1: Beginner',
    question: item.question,
    options,
    correctOptionId,
    explanation: item.explanation,
    cpaReference: item.cpaReference,
    signature: item.question.slice(0, 45)
  };
}

// =========================================================================
// 2. INTRO ACCOUNTING GENERATORS (Accruals, Deferrals, Depreciation, Cycle)
// =========================================================================

function genIntroAccountingQuestion(company: string): TheoryQuestion {
  const policyAmount = getRandomInt(6000, 24000, 1200);
  const months = 12;
  const monthlyInsurance = Math.round(policyAmount / months);
  const advanceAmount = getRandomInt(5000, 30000, 2500);

  const templates = [
    // Topic: Prepaid Expenses (Deferrals)
    {
      topic: 'Accruals & Deferrals (Prepaid Expenses)',
      question: `${company} paid $${policyAmount.toLocaleString()} cash on January 1 for a 1-year (${months}-month) commercial liability insurance policy, initially recorded as Prepaid Insurance. On January 31, what adjusting entry is required under accrual accounting?`,
      correct: `Debit Insurance Expense $${monthlyInsurance.toLocaleString()} and Credit Prepaid Insurance $${monthlyInsurance.toLocaleString()} to recognize 1 month of expired insurance coverage.`,
      incorrect: [
        `Debit Insurance Expense $${monthlyInsurance.toLocaleString()} and Credit Cash $${monthlyInsurance.toLocaleString()} to record the monthly disbursement.`,
        `Debit Prepaid Insurance $${monthlyInsurance.toLocaleString()} and Credit Insurance Expense $${monthlyInsurance.toLocaleString()} to increase the asset balance.`,
        `No adjusting entry is required until the full 12-month policy term expires and the renewal invoice arrives.`
      ],
      explanation: `Prepaid insurance is a deferral where cash was paid before the benefit was consumed. At the end of each month, 1/12th of the benefit has expired ($${policyAmount.toLocaleString()} ÷ 12 = $${monthlyInsurance.toLocaleString()}). The adjusting entry debits Insurance Expense (matching expense to current operations) and credits Prepaid Insurance (reducing the asset). Cash is NEVER credited in an adjusting entry.`,
      cpaReference: 'ASPE 1000 / IFRS IAS 1 Accrual Basis of Accounting'
    },
    // Topic: Unearned Revenues (Deferrals)
    {
      topic: 'Accruals & Deferrals (Unearned Revenues)',
      question: `${company} received an advance cash retainer of $${advanceAmount.toLocaleString()} from a client for architectural design services to be performed over the subsequent 4 months. Why is this advance initially credited to a Liability (Unearned Service Revenue) rather than Revenue?`,
      correct: `Because revenue cannot be recognized until performance obligations are satisfied; the advance creates an economic obligation to perform services or refund the cash.`,
      incorrect: [
        `Because Canadian corporate income tax law mandates that all cash receipts over $5,000 must be sequestered as liabilities for 90 days.`,
        `Because Unearned Revenue is an equity reserve account that accumulates until audited at fiscal year-end.`,
        `Because cash was received via wire transfer rather than a certified commercial bank draft.`
      ],
      explanation: `Under both IFRS 15 and ASPE 3400, revenue is recognized only when (or as) the seller satisfies its performance obligations. When cash is received prior to delivery, the company has an unfulfilled obligation to provide services. It must be credited to Unearned Service Revenue (Liability) and only transferred to Service Revenue as the work is actually performed.`,
      cpaReference: 'IFRS 15 / ASPE 3400 Revenue Recognition'
    },
    // Topic: Accrued Expenses (Unpaid Salaries & Interest)
    {
      topic: 'Accruals & Deferrals (Accrued Expenses)',
      question: `At fiscal year-end on December 31, ${company} employees have earned $${getRandomInt(3000, 9000, 500).toLocaleString()} in wages that will not be paid until the next regular payroll on January 7. What adjusting entry is necessary?`,
      correct: `Debit Salaries Expense and Credit Salaries Payable, recognizing the expense in the period the labour was performed and establishing a current liability.`,
      incorrect: [
        `Debit Salaries Expense and Credit Cash, because wages must be recorded as cash outflows immediately upon calculation.`,
        `Debit Salaries Payable and Credit Salaries Expense, deferring the recognition of payroll costs into the new fiscal year.`,
        `No entry is made on December 31 because cash accounting requires waiting until paycheques are physically disbursed.`
      ],
      explanation: `Under the accrual basis matching principle, expenses must be matched to the accounting period in which the economic benefit (employee labour) was utilized to generate revenue. The adjusting entry debits Salaries Expense (increasing current period expenses) and credits Salaries Payable (creating a current liability owed to workers).`,
      cpaReference: 'ASPE 1000.17 / IAS 19 Employee Benefits'
    },
    // Topic: Depreciation & Contra-Assets
    {
      topic: 'Depreciation & Contra-Assets',
      question: `Under Canadian accounting standards (ASPE 3061 / IAS 16), which of the following accurately describes straight-line depreciation and the function of the Accumulated Depreciation account?`,
      correct: `Depreciation systematically allocates the depreciable cost of an asset over its useful life; Accumulated Depreciation is a contra-asset account with a normal credit balance that reduces the carrying amount of the asset on the balance sheet.`,
      incorrect: [
        `Depreciation measures the physical decline in market resale value; Accumulated Depreciation is a liability account that tracks debt owed to equipment vendors.`,
        `Depreciation is an optional tax deduction recorded only when a company generates excess positive net income.`,
        `Accumulated Depreciation has a normal debit balance and increases the historical cost of capital assets on the Statement of Financial Position.`
      ],
      explanation: `In financial accounting, depreciation is not a valuation technique for market appraisal; it is a cost allocation process. Straight-line depreciation = (Cost - Residual Value) ÷ Useful Life. Accumulated Depreciation is paired with the asset as a contra-asset (normal credit balance), allowing the original acquisition cost to remain visible while reporting Net Book Value (Cost - Accumulated Depreciation).`,
      cpaReference: 'IAS 16 Property, Plant and Equipment / ASPE 3061 Capital Assets'
    },
    // Topic: 9-Step Accounting Cycle
    {
      topic: 'The 9 Steps of the Accounting Cycle',
      question: `Which sequence correctly illustrates the first five consecutive steps of the standardized 9-step Canadian accounting cycle?`,
      correct: `1. Analyze source documents → 2. Journalize transactions → 3. Post to General Ledger T-accounts → 4. Prepare Unadjusted Trial Balance → 5. Journalize and post Adjusting Entries.`,
      incorrect: [
        `1. Prepare Financial Statements → 2. Journalize transactions → 3. Prepare Trial Balance → 4. Post to Ledger → 5. Close accounts.`,
        `1. Post to Ledger → 2. Analyze source documents → 3. Journalize transactions → 4. Close temporary accounts → 5. Prepare Trial Balance.`,
        `1. Journalize transactions → 2. Close temporary accounts → 3. Prepare Adjusted Trial Balance → 4. Audit ledger → 5. Prepare Income Statement.`
      ],
      explanation: `The accounting cycle begins with source documents (invoices, receipts), followed by chronological entry in the General Journal (Step 2), posting debits and credits to General Ledger T-accounts (Step 3), testing mathematical equality with the Unadjusted Trial Balance (Step 4), and applying period-end Adjusting Journal Entries (Step 5).`,
      cpaReference: 'CPA Canada Competency Map / Accounting Cycle Sequence'
    }
  ];

  const item = pick(templates);
  const { options, correctOptionId } = assignOptionLetters(item.correct, item.incorrect);

  return {
    id: `theory-intro-${Date.now()}-${getRandomInt(100, 999)}`,
    topic: item.topic,
    difficulty: 'Intro Accounting',
    difficultyBadge: 'Level 2: Intro Accounting',
    question: item.question,
    options,
    correctOptionId,
    explanation: item.explanation,
    cpaReference: item.cpaReference,
    signature: item.question.slice(0, 45)
  };
}

// =========================================================================
// 3. INTERMEDIATE ACCOUNTING 1 GENERATORS (LCNRV, OCI, IFRS 15, Warranties)
// =========================================================================

function genIntermediate1Question(company: string): TheoryQuestion {
  const cost = getRandomInt(500, 900, 50);
  const estSale = cost - getRandomInt(80, 160, 20);
  const sellingCost = getRandomInt(15, 35, 5);
  const nrv = estSale - sellingCost;
  const writeDown = cost - nrv;

  const templates = [
    // Topic: LCNRV & Canadian Inventory Standards (LIFO Prohibition)
    {
      topic: 'Inventories & LCNRV (Canadian Standards)',
      question: `Under Canadian accounting standards (both IFRS IAS 2 and ASPE Section 3031), which of the following is true regarding inventory cost formulas and inventory valuation?`,
      correct: `LIFO (Last-In, First-Out) is strictly prohibited; inventory must be measured at the Lower of Cost and Net Realizable Value (LCNRV) using FIFO or Weighted Average.`,
      incorrect: [
        `LIFO is permitted for Canadian private corporations under ASPE but strictly prohibited for public corporations under IFRS.`,
        `Inventory is always measured at fair market value, and any write-down must be recognized directly in Other Comprehensive Income (OCI).`,
        `Companies may freely switch between FIFO, LIFO, and Specific Identification quarterly without note disclosure.`
      ],
      explanation: `Both IFRS (IAS 2.25) and ASPE (Section 3031.14) strictly prohibit the LIFO method because LIFO does not represent the real physical flow of goods and results in outdated historical carrying values on the Statement of Financial Position. Inventories must be valued at the lower of historical cost and net realizable value (LCNRV).`,
      cpaReference: 'IAS 2 Inventories / ASPE 3031 Inventories'
    },
    // Topic: LCNRV Calculation
    {
      topic: 'Inventories & Lower of Cost and Net Realizable Value (LCNRV)',
      question: `${company} holds inventory units with an original cost of $${cost.toLocaleString()} each. Due to market obsolescence, expected selling price has dropped to $${estSale.toLocaleString()}, and estimated selling costs are $${sellingCost.toLocaleString()} per unit. What is the Net Realizable Value (NRV) per unit and the required write-down under IAS 2 / ASPE 3031?`,
      correct: `Net Realizable Value is $${nrv.toLocaleString()} ($${estSale.toLocaleString()} - $${sellingCost.toLocaleString()}), requiring an inventory write-down of $${writeDown.toLocaleString()} per unit to Cost of Goods Sold.`,
      incorrect: [
        `Net Realizable Value is $${estSale.toLocaleString()}, requiring a write-down of only $${(cost - estSale).toLocaleString()} per unit without deducting selling costs.`,
        `Net Realizable Value is $${(estSale + sellingCost).toLocaleString()}, requiring zero write-down because selling price exceeds estimated disposal costs.`,
        `Under Canadian standards, no write-down is recorded until the goods are physically sold and delivered to customers.`
      ],
      explanation: `Net Realizable Value (NRV) = Estimated selling price in the ordinary course of business less estimated costs of completion and estimated costs necessary to make the sale ($${estSale.toLocaleString()} - $${sellingCost.toLocaleString()} = $${nrv.toLocaleString()}). Since NRV ($${nrv.toLocaleString()}) is below Cost ($${cost.toLocaleString()}), the asset must be written down by $${writeDown.toLocaleString()} (Debit Cost of Goods Sold / Credit Inventory).`,
      cpaReference: 'IAS 2.28-33 / ASPE 3031.11'
    },
    // Topic: Discontinued Operations (IFRS 5)
    {
      topic: 'Discontinued Operations (IFRS 5)',
      question: `Under IFRS 5 (Non-current Assets Held for Sale and Discontinued Operations), how must the operating results of a discontinued component of an entity be presented on the Statement of Comprehensive Income?`,
      correct: `Reported as a single aggregate net amount (net of applicable income taxes) displayed below income from continuing operations.`,
      incorrect: [
        `Consolidated item-by-item into ongoing operating revenues and operating expenses without separate disclosure.`,
        `Reported as a direct charge to Retained Earnings bypassing the Income Statement completely.`,
        `Presented as an extraordinary item within continuing operations before income tax expense.`
      ],
      explanation: `To prevent distortion of ongoing operational performance, IFRS 5 and ASPE 3475 require the results of discontinued operations (both operational earnings and the gain/loss on disposal) to be presented net of tax as a single line item below continuing operations on the Income Statement.`,
      cpaReference: 'IFRS 5 Discontinued Operations / ASPE 3475'
    },
    // Topic: Other Comprehensive Income (OCI) & FVTOCI (IFRS 9)
    {
      topic: 'Other Comprehensive Income (OCI & FVTOCI)',
      question: `Under IFRS 9, when ${company} elects to designate an investment in non-trading equity shares as Fair Value through Other Comprehensive Income (FVTOCI), where are unrealized fair value gains and losses reported?`,
      correct: `They bypass Net Income and are recognized in Other Comprehensive Income (OCI), accumulating within Accumulated Other Comprehensive Income (AOCI) in Shareholders' Equity.`,
      incorrect: [
        `They are recognized immediately as operating revenues on the main Income Statement.`,
        `They are recognized as a direct reduction of cash on the Statement of Cash Flows.`,
        `They are recorded in Contributed Surplus as a common capital contribution.`
      ],
      explanation: `Under IFRS 9, an entity may make an irrevocable election at initial recognition to present subsequent changes in the fair value of an investment in an equity instrument in OCI. Fair value gains/losses bypass Net Income, accumulating in AOCI, and under IFRS are not recycled to profit or loss upon disposal.`,
      cpaReference: 'IFRS 9 Financial Instruments / IAS 1 Presentation of Financial Statements'
    },
    // Topic: IFRS 15 Revenue Recognition & Percentage of Completion
    {
      topic: 'IFRS 15 Revenue Recognition (% of Completion)',
      question: `Under IFRS 15, when a long-term construction or software development contract qualifies for revenue recognition over time, how is the degree of completion typically measured under the input method?`,
      correct: `Cumulative contract costs incurred to date divided by total estimated contract costs (Cost-to-Cost method).`,
      incorrect: [
        `Total customer cash billings to date divided by the total contracted price.`,
        `The passage of calendar months divided by the total expected project duration.`,
        `Management's subjective quarterly estimate of client satisfaction.`
      ],
      explanation: `Under IFRS 15 input methods (such as the cost-to-cost approach), the progress toward complete satisfaction of a performance obligation is measured as: Costs Incurred to Date ÷ Total Estimated Project Costs. This completion percentage is multiplied by the total transaction price to determine cumulative revenue recognized.`,
      cpaReference: 'IFRS 15.B15-B19 Input Methods / CPA Canada Handbook'
    },
    // Topic: Warranties & Provisions (IAS 37 / IFRS 15)
    {
      topic: 'Warranties & Provisions (IAS 37 / IFRS 15)',
      question: `What is the crucial distinction between an "Assurance-Type Warranty" and a "Service-Type Warranty" under IFRS 15 and IAS 37?`,
      correct: `An assurance-type warranty promises the product meets agreed specifications (accrued as an expense provision at the date of sale); a service-type warranty provides an additional distinct service beyond agreed specifications (treated as a separate performance obligation with deferred revenue).`,
      incorrect: [
        `An assurance-type warranty is illegal under Canadian provincial consumer protection statutes.`,
        `A service-type warranty is expensed immediately at sale, while an assurance warranty is never recorded until claims occur.`,
        `There is no accounting distinction; both types are credited directly to Contributed Surplus.`
      ],
      explanation: `Under IFRS 15.B28-B33, assurance-type warranties simply assure that the product functions as promised; they are accounted for under IAS 37 by accruing Warranty Expense and Warranty Provision at the point of sale. Service-type warranties provide an extra service beyond baseline assurance, requiring allocation of the transaction price to Unearned Warranty Revenue, recognized over the warranty coverage period.`,
      cpaReference: 'IFRS 15.B28-B33 / IAS 37 Provisions'
    },
    // Topic: Bad Debts & Allowance Aging (IFRS 9 / ASPE 3052)
    {
      topic: 'Bad Debts & Allowance Aging (IFRS 9 / ASPE 3052)',
      question: `Under the balance sheet aging method (IFRS 9 Expected Credit Loss / ASPE 3052), how is the year-end Bad Debt Expense adjusting entry calculated?`,
      correct: `Bad Debt Expense equals the amount needed to adjust the existing Allowance for Doubtful Accounts balance to the required ending target balance based on accounts receivable aging.`,
      incorrect: [
        `Bad Debt Expense is calculated as a fixed percentage of total credit sales without regard to the existing allowance balance.`,
        `Accounts Receivable is credited directly and removed from the ledger without using a contra-asset allowance.`,
        `Bad Debt Expense is recognized only in the future fiscal year when a customer officially declares bankruptcy.`
      ],
      explanation: `The aging method focuses on the balance sheet: management estimates the uncollectible target balance required in the Allowance for Doubtful Accounts (contra-asset). The Bad Debt Expense entry is the plug amount needed to bring the unadjusted allowance balance (taking into account any existing debit or credit balance) to the target ending credit balance.`,
      cpaReference: 'IFRS 9 Financial Instruments / ASPE 3052 Receivables'
    }
  ];

  const item = pick(templates);
  const { options, correctOptionId } = assignOptionLetters(item.correct, item.incorrect);

  return {
    id: `theory-int1-${Date.now()}-${getRandomInt(100, 999)}`,
    topic: item.topic,
    difficulty: 'Intermediate Accounting 1',
    difficultyBadge: 'Level 3: Intermediate 1',
    question: item.question,
    options,
    correctOptionId,
    explanation: item.explanation,
    cpaReference: item.cpaReference,
    signature: item.question.slice(0, 45)
  };
}

// =========================================================================
// 4. INTERMEDIATE ACCOUNTING 2 GENERATORS (ARO, PV Notes, Bonds, Leases, DTL)
// =========================================================================

function genIntermediate2Question(company: string): TheoryQuestion {
  const futureCost = getRandomInt(100000, 500000, 50000);
  const years = pick([10, 15, 20]);
  const faceVal = getRandomInt(100000, 1000000, 100000);

  const templates = [
    // Topic: Asset Retirement Obligations (ARO) / Decommissioning Provisions
    {
      topic: 'Asset Retirement Obligations (IAS 37 / IAS 16)',
      question: `${company} constructed an extraction facility and is legally required to restore the site in ${years} years at an estimated future cost of $${futureCost.toLocaleString()}. Under IAS 37 and IAS 16, how is this Asset Retirement Obligation initially recognized and subsequently handled?`,
      correct: `The obligation is discounted to present value, recognized as a provision (liability), and capitalized into the asset's cost; over time, accretion/interest expense is recognized to unwind the discount, while the capitalized asset is depreciated.`,
      incorrect: [
        `The entire future cost of $${futureCost.toLocaleString()} is expensed immediately in Year 1 as an environmental compliance cost.`,
        `No liability or asset is recognized until the ${years}th year when restoration work physically commences.`,
        `The future cost is deducted directly from Retained Earnings without any present value discounting.`
      ],
      explanation: `Under IAS 37 and IAS 16 (and ASPE 3110), an ARO is recognized when the obligation arises. The present value of the obligation is credited to Decommissioning Provision (Liability) and debited to the facility asset. Over time: (1) the liability increases toward face value through interest accretion expense; (2) the capitalized asset is depreciated over its productive life.`,
      cpaReference: 'IAS 37 Provisions / IAS 16 Property, Plant and Equipment'
    },
    // Topic: Non-Interest Bearing Notes (Present Value)
    {
      topic: 'Non-Interest Bearing Notes (Present Value Accounting)',
      question: `${company} acquired commercial land by issuing a 3-year non-interest-bearing promissory note with a face value of $${faceVal.toLocaleString()}. The prevailing market interest rate for similar credit is 8%. Under Canadian GAAP (ASPE 3856 / IFRS 9), how is this transaction recorded?`,
      correct: `The land is recorded at the present value of the note discounted at 8%; the difference between face value and present value is recorded as a Discount on Notes Payable (contra-liability) and amortized to interest expense over 3 years.`,
      incorrect: [
        `The land is recorded at the full face value of $${faceVal.toLocaleString()}, because no interest rate was explicitly stated in the legal contract.`,
        `The difference between face value and present value is recognized immediately as a financing gain in Net Income.`,
        `The note is classified as an equity instrument because it does not pay annual cash interest coupons.`
      ],
      explanation: `Economic substance over legal form requires recording debt and assets at fair value at the transaction date. When a note bears zero stated interest, the fair value is the present value of the face amount discounted at the market interest rate. The discount represents the total borrowing cost and is amortized to Interest Expense over the 3-year term.`,
      cpaReference: 'IFRS 9 Financial Instruments / ASPE 3856 Financial Instruments'
    },
    // Topic: Bonds Payable & Effective Interest Method
    {
      topic: 'Bonds Payable & Effective Interest Method (IFRS 9)',
      question: `When ${company} issues commercial bonds at a discount (market interest rate exceeds contractual coupon rate), what is the effect of using the effective interest method over the life of the bonds?`,
      correct: `Interest expense recognized each period exceeds the cash coupon paid; the bond carrying value increases over time toward face value at maturity.`,
      incorrect: [
        `Interest expense recognized each period is less than the cash coupon paid; the bond carrying value decreases over time.`,
        `Interest expense remains perfectly identical to the cash coupon paid in every period under IFRS 9.`,
        `The bond discount is expensed immediately on the issuance date as an underwriting financing loss.`
      ],
      explanation: `When bonds are issued at a discount, the issuer received less cash than the face amount it must repay at maturity. Under the effective interest method: Interest Expense = Carrying Value × Market Yield. Because market yield exceeds coupon rate, Interest Expense > Cash Coupon Paid. The difference amortizes the discount, steadily pulling the bond carrying value up to face value by maturity.`,
      cpaReference: 'IFRS 9 Financial Instruments / ASPE 3856'
    },
    // Topic: Leases under IFRS 16
    {
      topic: 'Leases (IFRS 16 Single Lessee Model)',
      question: `What fundamental balance sheet reform did IFRS 16 introduce for commercial lessees, and how does it alter financial reporting compared to traditional operating leases?`,
      correct: `It eliminated the off-balance-sheet operating lease category for lessees, requiring virtually all leases to be capitalized as a Right-of-Use (ROU) Asset and corresponding Lease Liability measured at the present value of lease payments.`,
      incorrect: [
        `It classified all commercial lease disbursements as operating expenses with zero balance sheet representation.`,
        `It required lessees to acquire full legal ownership title of leased machinery within the first 12 months.`,
        `It banned all commercial equipment leasing across Canadian corporations.`
      ],
      explanation: `IFRS 16 established a single lessee accounting model: all leases (with minor exceptions for short-term and low-value items) must be recognized on the Statement of Financial Position as a Right-of-Use (ROU) asset and a Lease Liability calculated at the present value of future lease payments. This eliminates off-balance-sheet lease structuring and increases financial leverage transparency.`,
      cpaReference: 'IFRS 16 Leases / CPA Canada Handbook Part I'
    },
    // Topic: Deferred Income Taxes (IAS 12 / ASPE 3465)
    {
      topic: 'Deferred Income Taxes (IAS 12 / ASPE 3465)',
      question: `For Canadian income tax purposes, ${company} claims Capital Cost Allowance (CCA) faster than its accounting straight-line depreciation. What does this temporary difference generate on the Statement of Financial Position under IAS 12 and ASPE 3465?`,
      correct: `A Deferred Tax Liability (DTL), because the asset's accounting carrying amount exceeds its tax base (UCC), meaning future accounting depreciation will exceed allowable tax deductions.`,
      incorrect: [
        `A Deferred Tax Asset (DTA), because the company paid excess cash income taxes to the CRA in the current fiscal period.`,
        `A permanent non-taxable difference that increases Net Income permanently with no balance sheet impact.`,
        `A direct credit to Contributed Surplus that bypasses income tax provision calculations entirely.`
      ],
      explanation: `When CCA exceeds accounting depreciation, the tax base (Undepreciated Capital Cost - UCC) is lower than the accounting carrying amount of the asset. Taxes are deferred today, but in future years accounting depreciation will exceed allowable CCA, resulting in higher taxable income and higher tax payments. This taxable temporary difference generates a Deferred Tax Liability (credit balance).`,
      cpaReference: 'IAS 12 Income Taxes / ASPE 3465 Income Taxes'
    },
    // Topic: Stock Dividends vs Liquidating Dividends
    {
      topic: 'Stock & Liquidating Dividends (ASPE 3250 / IAS 1)',
      question: `When a corporation declares and issues a proportional stock dividend to existing common shareholders, what is the net impact on the company's total assets and total shareholders' equity?`,
      correct: `Total Assets and Total Shareholders' Equity remain completely unchanged; retained earnings are reclassified into common shares.`,
      incorrect: [
        `Total Assets decrease by the fair market value of the distributed shares.`,
        `Total Shareholders' Equity increases by the fair market value of the newly issued share certificates.`,
        `Cash decreases and Dividends Payable increases until the share distribution date.`
      ],
      explanation: `A stock dividend is a capitalization of earnings: no assets leave the company, and no liabilities are incurred. A portion of Retained Earnings is transferred into Common Shares (contributed capital). Because every shareholder receives shares proportionally, total shareholders' equity and proportional ownership remain exactly identical.`,
      cpaReference: 'ASPE 3250 / IAS 1 Presentation of Financial Statements'
    },
    // Topic: Financial Instruments: Debt vs Equity (IAS 32)
    {
      topic: 'Debt vs. Equity Classification (IAS 32)',
      question: `Under IFRS (IAS 32 Financial Instruments: Presentation), why are preferred shares that are mandatorily redeemable for cash at a fixed future date classified as a Liability rather than Equity?`,
      correct: `Because the substance over form principle dictates that the issuer has an unavoidable contractual obligation to deliver cash to the holder.`,
      incorrect: [
        `Because preferred shares are never legally considered equity under Canadian provincial corporate laws.`,
        `Because the Canada Revenue Agency dictates balance sheet classifications under international standards.`,
        `Because all preferred shares issued by Canadian public companies must be backed by government bonds.`
      ],
      explanation: `IAS 32 enforces substance over form: an instrument is a financial liability if the issuer cannot avoid an obligation to deliver cash or another financial asset. Because mandatorily redeemable preferred shares legally obligate the company to redeem the shares for cash at a future date, they represent a financial liability, and any dividends paid on them are presented as interest expense!`,
      cpaReference: 'IAS 32 Financial Instruments: Presentation (Para 18)'
    },
    // Topic: Pensions & Employee Benefits (IAS 19 / ASPE 3462)
    {
      topic: 'Pensions & Employee Benefits (IAS 19 / ASPE 3462)',
      question: `In accounting for defined benefit pension plans under IFRS (IAS 19), how is the funded status of the plan presented on the Statement of Financial Position?`,
      correct: `As a net defined benefit liability (if the Defined Benefit Obligation exceeds plan assets) or a net defined benefit asset (if plan assets exceed the obligation).`,
      incorrect: [
        `Plan assets and pension obligations are strictly prohibited from appearing on the corporate balance sheet.`,
        `Pension obligations are expensed only when current employees reach the age of 65.`,
        `All defined benefit plans are treated identically to defined contribution plans with zero balance sheet presentation.`
      ],
      explanation: `Under IAS 19, an entity recognizes the net defined benefit liability or asset on the balance sheet: Fair Value of Plan Assets minus Present Value of Defined Benefit Obligation (DBO). Actuarial gains and losses from remeasurements are recognized immediately in Other Comprehensive Income (OCI) and cannot be recycled to profit or loss.`,
      cpaReference: 'IAS 19 Employee Benefits / ASPE 3462 Employee Future Benefits'
    }
  ];

  const item = pick(templates);
  const { options, correctOptionId } = assignOptionLetters(item.correct, item.incorrect);

  return {
    id: `theory-int2-${Date.now()}-${getRandomInt(100, 999)}`,
    topic: item.topic,
    difficulty: 'Intermediate Accounting 2',
    difficultyBadge: 'Level 4: Intermediate 2',
    question: item.question,
    options,
    correctOptionId,
    explanation: item.explanation,
    cpaReference: item.cpaReference,
    signature: item.question.slice(0, 45)
  };
}

// =========================================================================
// MAIN GENERATOR ROUTER
// =========================================================================

const DIFFICULTY_LEVELS: TheoryDifficulty[] = [
  'Beginner',
  'Intro Accounting',
  'Intermediate Accounting 1',
  'Intermediate Accounting 2'
];

/**
 * Generates a brand-new, unique multiple-choice theory question.
 * If preferredDifficulty is specified, generates a question aligned with the
 * corresponding journal entry practice difficulty category.
 * If preferredDifficulty is 'random' or unspecified, selects a random difficulty level.
 */
export function generateTheoryQuestion(
  preferredDifficulty?: TheoryDifficulty | 'random',
  excludeSignatures: string[] = []
): TheoryQuestion {
  const companyProfile = generateUniqueCanadianCompany();
  const company = companyProfile.companyName;

  // Pick target difficulty
  const difficulty: TheoryDifficulty =
    !preferredDifficulty || preferredDifficulty === 'random'
      ? pick(DIFFICULTY_LEVELS)
      : preferredDifficulty;

  const excludeSet = new Set(excludeSignatures.map(s => s.toLowerCase().trim()));

  let attempts = 0;
  let q: TheoryQuestion | null = null;

  while (attempts < 60) {
    attempts++;
    if (difficulty === 'Beginner') {
      q = genBeginnerQuestion(company);
    } else if (difficulty === 'Intro Accounting') {
      q = genIntroAccountingQuestion(company);
    } else if (difficulty === 'Intermediate Accounting 1') {
      q = genIntermediate1Question(company);
    } else {
      q = genIntermediate2Question(company);
    }

    if (q && !excludeSet.has(q.signature.toLowerCase().trim())) {
      break;
    }
  }

  // Fallback if collision
  if (!q || excludeSet.has(q.signature.toLowerCase().trim())) {
    const freshCompany = generateUniqueCanadianCompany();
    if (difficulty === 'Beginner') {
      q = genBeginnerQuestion(freshCompany.companyName);
    } else if (difficulty === 'Intro Accounting') {
      q = genIntroAccountingQuestion(freshCompany.companyName);
    } else if (difficulty === 'Intermediate Accounting 1') {
      q = genIntermediate1Question(freshCompany.companyName);
    } else {
      q = genIntermediate2Question(freshCompany.companyName);
    }
  }

  return q;
}
