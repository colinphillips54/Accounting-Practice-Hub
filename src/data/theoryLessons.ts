export interface TheoryLesson {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  readTime: string;
  summary: string;
  keyRule: string;
  sections: {
    heading: string;
    content: string;
    bulletPoints?: string[];
    formula?: string;
    table?: {
      headers: string[];
      rows: string[][];
    };
    tip?: string;
  }[];
}

export const THEORY_LESSONS: TheoryLesson[] = [
  {
    id: 'lesson-equation',
    number: 1,
    title: 'The Accounting Equation & Dual-Aspect Principle',
    subtitle: 'The cornerstone of all double-entry bookkeeping',
    readTime: '4 min read',
    summary: 'Every economic transaction affects at least two accounts in a way that keeps the fundamental balance sheet equation in perfect equilibrium.',
    keyRule: 'Assets = Liabilities + Shareholders\' Equity',
    sections: [
      {
        heading: 'The Foundational Formula & Canadian Framework',
        content: 'In Canadian financial accounting, businesses report under either IFRS (Part I of the CPA Canada Handbook, mandatory for publicly accountable enterprises) or ASPE (Accounting Standards for Private Enterprises, Part II). The fundamental accounting equation reflects resources owned (Assets) and claims against them: creditors (Liabilities) and owners (Shareholders\' Equity). Under Canadian corporate law (e.g. CBCA), companies issue Common Shares (without par value) rather than U.S. common stock.',
        formula: 'Assets = Liabilities + Shareholders\' Equity',
        bulletPoints: [
          'Assets: Resources owned or controlled with future economic benefit (Cash, Accounts Receivable, Inventory, Equipment).',
          'Liabilities: Obligations owed to external creditors or suppliers (Accounts Payable, Notes Payable, Unearned Service Revenue).',
          'Shareholders\' Equity: Residual interest of owners in company assets after deducting liabilities (Common Shares + Retained Earnings).'
        ]
      },
      {
        heading: 'The Expanded Accounting Equation',
        content: 'Retained Earnings changes over time through three components: Revenues increase it, Expenses decrease it, and Dividends declared decrease it.',
        formula: 'Assets = Liabilities + Common Shares + Beginning Retained Earnings + Revenues - Expenses - Dividends',
        tip: 'Whenever a company earns net income (Revenues > Expenses), shareholders\' equity grows! When dividends are distributed to shareholders, equity decreases.'
      },
      {
        heading: 'Dual-Aspect Principle in Action',
        content: 'Every transaction has two sides. If an asset increases, either another asset must decrease (asset exchange), a liability must increase, or shareholders\' equity must increase.',
        table: {
          headers: ['Transaction', 'Assets', 'Liabilities', 'Shareholders\' Equity'],
          rows: [
            ['Owner invests $10,000 cash', '+$10,000 (Cash)', '$0', '+$10,000 (Common Shares)'],
            ['Buy $2,000 supplies on credit', '+$2,000 (Supplies)', '+$2,000 (A/P)', '$0'],
            ['Perform $3,500 service for cash', '+$3,500 (Cash)', '$0', '+$3,500 (Revenue)'],
            ['Pay $1,200 rent in cash', '-$1,200 (Cash)', '$0', '-$1,200 (Expense)'],
            ['Pay $800 to supplier on account', '-$800 (Cash)', '-$800 (A/P)', '$0']
          ]
        }
      }
    ]
  },
  {
    id: 'lesson-debits-credits',
    number: 2,
    title: 'The Rules of Debit and Credit (DEALER Framework)',
    subtitle: 'Master normal balances without memorizing random tables',
    readTime: '5 min read',
    summary: 'Debit simply means LEFT, and Credit simply means RIGHT. Whether a debit increases or decreases an account depends entirely on its account category.',
    keyRule: 'Debits on the Left = Credits on the Right. Always in Balance.',
    sections: [
      {
        heading: 'The Meaning of Debit and Credit',
        content: 'In Italian Renaissance accounting (Luca Pacioli, 1494), "debere" (debt) and "credere" (trust) simply marked the left and right sides of ledger T-accounts. In modern accounting:',
        bulletPoints: [
          'Debit (Dr.) = Left-hand side entry.',
          'Credit (Cr.) = Right-hand side entry.',
          'Debit does NOT automatically mean "increase" or "good".',
          'Credit does NOT automatically mean "decrease" or "bad".'
        ]
      },
      {
        heading: 'The DEALER Mnemonic',
        content: 'The easiest way to remember which accounts increase with debits and which with credits is the word DEALER, split into two equal halves:',
        formula: 'D · E · A  |  L · E · R',
        table: {
          headers: ['Letter', 'Category', 'Normal Balance', 'Increased by', 'Decreased by'],
          rows: [
            ['D', 'Dividends', 'Debit (Left)', 'Debit', 'Credit'],
            ['E', 'Expenses', 'Debit (Left)', 'Debit', 'Credit'],
            ['A', 'Assets', 'Debit (Left)', 'Debit', 'Credit'],
            ['L', 'Liabilities', 'Credit (Right)', 'Credit', 'Debit'],
            ['E', 'Owner Equity', 'Credit (Right)', 'Credit', 'Debit'],
            ['R', 'Revenues', 'Credit (Right)', 'Credit', 'Debit']
          ]
        },
        tip: 'Accounts on the left side of DEALER (Dividends, Expenses, Assets) increase with DEBITS. Accounts on the right side (Liabilities, Equity, Revenues) increase with CREDITS.'
      },
      {
        heading: 'The Golden Rule of Journal Entries',
        content: 'For every single journal entry: Total Debits must equal Total Credits. Debits are always written first (flush left), and Credits are listed below and slightly indented to the right.'
      }
    ]
  },
  {
    id: 'lesson-cycle',
    number: 3,
    title: 'The 9 Steps of the Accounting Cycle',
    subtitle: 'How a financial transaction travels from invoice to annual report',
    readTime: '6 min read',
    summary: 'The accounting cycle is the standardized sequence of accounting procedures repeated during each reporting period.',
    keyRule: 'Journalize → Post to Ledger → Trial Balance → Adjustments → Financial Statements → Close Temporary Accounts',
    sections: [
      {
        heading: 'Step-by-Step Cycle Breakdown',
        content: 'The full 9-step cycle guarantees that every operational event is recorded accurately and verified before publishing financial statements:',
        bulletPoints: [
          'Step 1: Analyze business source documents (receipts, invoices, bank checks).',
          'Step 2: Journalize transactions in chronological order in the General Journal.',
          'Step 3: Post journal entries to individual T-Accounts in the General Ledger.',
          'Step 4: Prepare an Unadjusted Trial Balance to verify equality of debits and credits.',
          'Step 5: Gather adjustment data and record Adjusting Journal Entries (accruals & deferrals).',
          'Step 6: Prepare the Adjusted Trial Balance confirming all ledger balances reflect accrual basis.',
          'Step 7: Prepare Financial Statements (Income Statement → Retained Earnings → Balance Sheet).',
          'Step 8: Journalize and post Closing Entries to transfer temporary accounts to Retained Earnings.',
          'Step 9: Prepare a Post-Closing Trial Balance containing only permanent balance sheet accounts.'
        ]
      },
      {
        heading: 'Permanent vs. Temporary Accounts',
        content: 'Accounts are divided into two fundamental classifications:',
        table: {
          headers: ['Account Classification', 'Included Accounts', 'Carried Forward?', 'Closed at Period End?'],
          rows: [
            ['Permanent (Real)', 'Assets, Liabilities, Common Shares, Retained Earnings', 'Yes (Balances roll over)', 'No'],
            ['Temporary (Nominal)', 'Revenues, Expenses, Dividends', 'No (Reset to $0)', 'Yes (Closed into Retained Earnings)']
          ]
        }
      }
    ]
  },
  {
    id: 'lesson-adjusting',
    number: 4,
    title: 'Adjusting Entries Masterclass (Accruals & Deferrals)',
    subtitle: 'Recognizing revenues when earned and matching expenses when incurred',
    readTime: '7 min read',
    summary: 'Adjusting entries are non-cash entries made at the end of the accounting period to bring account balances into compliance with Canadian accounting standards (ASPE / IFRS) accrual principles.',
    keyRule: 'Adjusting entries NEVER involve Cash! They always involve 1 Balance Sheet / Statement of Financial Position account and 1 Income Statement account.',
    sections: [
      {
        heading: 'The Four Types of Adjusting Entries',
        content: 'Adjusting entries fall into four distinct categories based on whether cash happened before or after the economic event:',
        table: {
          headers: ['Type', 'When Cash Moved', 'Economic Event', 'Example Entry'],
          rows: [
            ['Prepaid Expense (Deferral)', 'Cash moved FIRST (before expense)', 'Asset used up over time', 'Dr. Insurance Expense / Cr. Prepaid Insurance'],
            ['Unearned Revenue (Deferral)', 'Cash received FIRST (before service)', 'Service performed later', 'Dr. Unearned Revenue / Cr. Service Revenue'],
            ['Accrued Expense (Accrual)', 'Cash will move LATER', 'Expense incurred now, unpaid', 'Dr. Salaries Expense / Cr. Salaries Payable'],
            ['Accrued Revenue (Accrual)', 'Cash will arrive LATER', 'Revenue earned now, unbilled', 'Dr. Accounts Receivable / Cr. Service Revenue']
          ]
        }
      },
      {
        heading: 'Depreciation & Contra-Assets',
        content: 'Long-term assets (equipment, vehicles, buildings) provide benefits over several years. Depreciation (or amortization of capital assets under ASPE) is the systematic allocation of asset cost over its useful life.',
        formula: 'Straight-Line Depreciation = (Cost - Salvage Value) / Useful Life in Years',
        bulletPoints: [
          'We debit Depreciation Expense (an Income Statement expense).',
          'We credit Accumulated Depreciation (a Statement of Financial Position Contra-Asset account).',
          'Why not credit Equipment directly? Canadian accounting standards (IFRS / ASPE) require preserving the original historical cost intact on the Statement of Financial Position (Balance Sheet) so investors and analysts know what the asset originally cost!',
          'Carrying Amount (Book Value) = Cost of Asset - Accumulated Depreciation.'
        ],
        tip: 'Contra-assets have normal Credit balances and directly reduce the reported balance of their companion asset on the Statement of Financial Position.'
      }
    ]
  },
  {
    id: 'lesson-statements',
    number: 5,
    title: 'Financial Statements Interconnections',
    subtitle: 'The exact mathematical flow connecting the Big 4 financial statements',
    readTime: '5 min read',
    summary: 'Financial statements are not isolated reports; they are interconnected like gears in a clock. Net Income flows into Retained Earnings, which then anchors the Statement of Financial Position.',
    keyRule: 'Income Statement (Net Income) → Statement of Retained Earnings (Ending R/E) → Statement of Financial Position (Shareholders\' Equity)',
    sections: [
      {
        heading: '1. The Income Statement (Performance)',
        content: 'Reports revenues earned and expenses incurred over a period of time to calculate profitability under IFRS / ASPE.',
        formula: 'Net Income = Revenues - Expenses',
        tip: 'If Revenues exceed Expenses, the company has Net Income. If Expenses exceed Revenues, the company has a Net Loss.'
      },
      {
        heading: '2. Statement of Retained Earnings (Accumulation)',
        content: 'Reports how accumulated corporate earnings changed over the period through net income and dividend distributions (under ASPE Section 3250; reported within Statement of Changes in Equity under IFRS).',
        formula: 'Ending Retained Earnings = Beginning Retained Earnings + Net Income - Dividends Declared'
      },
      {
        heading: '3. Statement of Financial Position / Balance Sheet (Position at a Point in Time)',
        content: 'Reports the resources owned (Assets) and claims against them (Liabilities + Shareholders\' Equity) at a specific calendar date.',
        bulletPoints: [
          'Assets: Classified into Current Assets (Cash, A/R, Inventory, Supplies, Prepaid) and Long-Term Assets / PPE (Equipment, Vehicles net of Accumulated Depreciation).',
          'Liabilities: Classified into Current Liabilities (A/P, Salaries Payable, Unearned Service Revenue) and Long-Term Debt (Notes Payable).',
          'Shareholders\' Equity: Contains Common Shares plus the Ending Retained Earnings calculated on the Retained Earnings statement!',
          'Total Assets MUST equal Total Liabilities + Total Shareholders\' Equity.'
        ]
      }
    ]
  },
  {
    id: 'lesson-merchandising',
    number: 6,
    title: 'Merchandising Operations & Inventory',
    subtitle: 'The perpetual inventory method and Canadian inventory standards',
    readTime: '6 min read',
    summary: 'Merchandising companies buy ready-made goods and resell them to customers at a markup. Managing inventory and recording Cost of Goods Sold is critical.',
    keyRule: 'Perpetual Sale: (1) Dr. Cash or A/R & Cr. Sales Revenue at retail; (2) Dr. Cost of Goods Sold & Cr. Inventory at cost.',
    sections: [
      {
        heading: 'The Two-Step Perpetual Entry',
        content: 'Under a perpetual inventory system, the inventory records are updated continuously with every single transaction. When a sale occurs, TWO parallel entries must be made:',
        bulletPoints: [
          'Step 1 (The Sale at Retail Price): Record the inflow of cash or customer receivable and recognize revenue. [Dr. Cash or Accounts Receivable / Cr. Sales Revenue]',
          'Step 2 (The Inventory Cost at Cost): Record the outflow of goods from the warehouse and recognize the expense. [Dr. Cost of Goods Sold / Cr. Merchandise Inventory]'
        ]
      },
      {
        heading: 'Canadian Inventory Standards (LIFO Prohibition)',
        content: 'Under Canadian accounting standards (both IFRS IAS 2 and ASPE Section 3031), the LIFO (Last-In, First-Out) method is strictly PROHIBITED. Canadian companies must value inventory using either FIFO (First-In, First-Out) or Weighted Average Cost, measured at the Lower of Cost and Net Realizable Value (LCNRV).',
        formula: 'Gross Profit = Sales Revenue - Cost of Goods Sold',
        tip: 'Gross Profit - Operating Expenses (Salaries, Rent, Utilities, Depreciation) = Operating Income (Net Income).'
      }
    ]
  }
];
