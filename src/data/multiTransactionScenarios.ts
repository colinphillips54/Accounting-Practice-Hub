import { MultiTransactionScenario } from '../types/accounting';

export const MULTI_TRANSACTION_SCENARIOS: MultiTransactionScenario[] = [
  {
    id: 'multi-pinnacle-month1',
    title: 'Pinnacle Creative Studio — Month 1 Comprehensive Accounting Cycle',
    companyName: 'Pinnacle Creative Studio Inc.',
    businessType: 'Graphic Design & Digital Branding Agency',
    description: 'Complete the first month of operations for Pinnacle Creative Studio. As you journalize each transaction, post to ledger T-accounts and observe how every dollar flows through the Trial Balance, Income Statement, Retained Earnings, and Balance Sheet.',
    transactions: [
      {
        id: 'pin-01',
        title: 'Transaction 1: Owner Capital Contribution',
        companyName: 'Pinnacle Creative Studio Inc.',
        date: 'Oct 01, 2026',
        narrative: 'Founders deposited $25,000 cash into the corporate bank account in exchange for 2,500 common shares.',
        topic: 'Investments & Capital',
        difficulty: 'Beginner',
        hints: ['Cash asset increases', 'Common shares equity increases'],
        correctLines: [
          { accountId: 'cash', debit: 25000, credit: 0 },
          { accountId: 'common_shares', debit: 0, credit: 25000 }
        ],
        explanation: 'Owners contribute cash capital to fund the business. Debit Cash (Asset) $25,000 and credit Common Shares (Shareholders\' Equity) $25,000 under Canadian ASPE / IFRS.',
        accountAnalysis: [
          { accountId: 'cash', action: 'Debit', amount: 25000, reason: 'Cash increases with a Debit.' },
          { accountId: 'common_shares', action: 'Credit', amount: 25000, reason: 'Common Shares increases with a Credit.' }
        ],
        equationImpact: {
          assets: 25000,
          liabilities: 0,
          equity: 25000,
          explanation: 'Assets increase by $25,000 (Cash) = Shareholders\' Equity increases by $25,000 (Common Shares).'
        }
      },
      {
        id: 'pin-02',
        title: 'Transaction 2: Prepaid 1-Year Commercial Insurance',
        companyName: 'Pinnacle Creative Studio Inc.',
        date: 'Oct 02, 2026',
        narrative: 'Paid $2,400 cash in advance for a 1-year general business liability insurance policy with Hartford Underwriters.',
        topic: 'Accruals & Deferrals',
        difficulty: 'Beginner',
        hints: ['Cash is paid out', 'Future economic benefit of insurance is an asset (Prepaid Insurance)'],
        correctLines: [
          { accountId: 'prepaid_insurance', debit: 2400, credit: 0 },
          { accountId: 'cash', debit: 0, credit: 2400 }
        ],
        explanation: 'Insurance paid in advance provides future economic benefits and is recorded as an Asset (Prepaid Insurance). Cash is credited.',
        accountAnalysis: [
          { accountId: 'prepaid_insurance', action: 'Debit', amount: 2400, reason: 'Prepaid Insurance is an Asset, increased with a Debit.' },
          { accountId: 'cash', action: 'Credit', amount: 2400, reason: 'Cash decreases with a Credit.' }
        ],
        equationImpact: {
          assets: 0,
          liabilities: 0,
          equity: 0,
          explanation: 'Asset exchange: +$2,400 Prepaid Insurance, -$2,400 Cash. Total assets remain unchanged.'
        }
      },
      {
        id: 'pin-03',
        title: 'Transaction 3: Purchased Design Equipment on Credit',
        companyName: 'Pinnacle Creative Studio Inc.',
        date: 'Oct 05, 2026',
        narrative: 'Purchased Apple workstation computers and 4K monitors for $6,000 from TechSupply Co. on account (payment due in 30 days).',
        topic: 'Supplies & Equipment',
        difficulty: 'Beginner',
        hints: ['Computers/monitors are long-term operational assets (Equipment)', 'Purchased on account creates Accounts Payable'],
        correctLines: [
          { accountId: 'equipment', debit: 6000, credit: 0 },
          { accountId: 'accounts_payable', debit: 0, credit: 6000 }
        ],
        explanation: 'Equipment asset is debited for $6,000. Accounts Payable liability is credited for $6,000.',
        accountAnalysis: [
          { accountId: 'equipment', action: 'Debit', amount: 6000, reason: 'Equipment is an Asset. Increase = Debit.' },
          { accountId: 'accounts_payable', action: 'Credit', amount: 6000, reason: 'Accounts Payable is a Liability. Increase = Credit.' }
        ],
        equationImpact: {
          assets: 6000,
          liabilities: 6000,
          equity: 0,
          explanation: 'Assets increase by $6,000 (Equipment) = Liabilities increase by $6,000 (Accounts Payable).'
        }
      },
      {
        id: 'pin-04',
        title: 'Transaction 4: Performed Design Services for Cash',
        companyName: 'Pinnacle Creative Studio Inc.',
        date: 'Oct 12, 2026',
        narrative: 'Completed a logo and brand identity package for a retail client and collected $4,800 cash on the spot.',
        topic: 'Revenues & Receivables',
        difficulty: 'Beginner',
        hints: ['Cash collected immediately', 'Revenue earned from providing service'],
        correctLines: [
          { accountId: 'cash', debit: 4800, credit: 0 },
          { accountId: 'service_revenue', debit: 0, credit: 4800 }
        ],
        explanation: 'Debit Cash (Asset) $4,800 and credit Service Revenue (Revenue/Equity) $4,800.',
        accountAnalysis: [
          { accountId: 'cash', action: 'Debit', amount: 4800, reason: 'Cash increases with a Debit of $4,800.' },
          { accountId: 'service_revenue', action: 'Credit', amount: 4800, reason: 'Service Revenue increases with a Credit of $4,800.' }
        ],
        equationImpact: {
          assets: 4800,
          liabilities: 0,
          equity: 4800,
          explanation: 'Assets increase by $4,800 (Cash) = Equity increases by $4,800 (Service Revenue).'
        }
      },
      {
        id: 'pin-05',
        title: 'Transaction 5: Billed Client for Services Performed on Account',
        companyName: 'Pinnacle Creative Studio Inc.',
        date: 'Oct 18, 2026',
        narrative: 'Billed a corporate client $3,500 for a website redesign completed this week. The client has 30 days to pay.',
        topic: 'Revenues & Receivables',
        difficulty: 'Intermediate',
        hints: ['Services completed, so revenue must be recognized now', 'Customer billed on account creates Accounts Receivable'],
        correctLines: [
          { accountId: 'accounts_receivable', debit: 3500, credit: 0 },
          { accountId: 'service_revenue', debit: 0, credit: 3500 }
        ],
        explanation: 'Under accrual accounting, revenue is recognized when earned. Debit Accounts Receivable (Asset) $3,500 and credit Service Revenue $3,500.',
        accountAnalysis: [
          { accountId: 'accounts_receivable', action: 'Debit', amount: 3500, reason: 'Accounts Receivable increases with a Debit.' },
          { accountId: 'service_revenue', action: 'Credit', amount: 3500, reason: 'Service Revenue increases with a Credit.' }
        ],
        equationImpact: {
          assets: 3500,
          liabilities: 0,
          equity: 3500,
          explanation: 'Assets increase by $3,500 (Accounts Receivable) = Equity increases by $3,500 (Service Revenue).'
        }
      },
      {
        id: 'pin-06',
        title: 'Transaction 6: Paid Current Month Office Rent & Utilities',
        companyName: 'Pinnacle Creative Studio Inc.',
        date: 'Oct 24, 2026',
        narrative: 'Paid $1,800 cash for October studio rent and $350 cash for electric utilities (total cash payment $2,150).',
        topic: 'Operating Expenses',
        difficulty: 'Intermediate',
        hints: ['Rent and utilities are current operating expenses', 'Compound entry with two debits and one credit to Cash'],
        correctLines: [
          { accountId: 'rent_expense', debit: 1800, credit: 0 },
          { accountId: 'utilities_expense', debit: 350, credit: 0 },
          { accountId: 'cash', debit: 0, credit: 2150 }
        ],
        explanation: 'Debit Rent Expense $1,800 and Utilities Expense $350 (total expenses $2,150). Credit Cash $2,150.',
        accountAnalysis: [
          { accountId: 'rent_expense', action: 'Debit', amount: 1800, reason: 'Rent Expense increases with a Debit of $1,800.' },
          { accountId: 'utilities_expense', action: 'Debit', amount: 350, reason: 'Utilities Expense increases with a Debit of $350.' },
          { accountId: 'cash', action: 'Credit', amount: 2150, reason: 'Cash decreases with a Credit of $2,150.' }
        ],
        equationImpact: {
          assets: -2150,
          liabilities: 0,
          equity: -2150,
          explanation: 'Assets decrease by $2,150 (Cash) = Equity decreases by $2,150 (Total Expenses).'
        }
      },
      {
        id: 'pin-07',
        title: 'Transaction 7: Partial Payment to TechSupply Co. on Account',
        companyName: 'Pinnacle Creative Studio Inc.',
        date: 'Oct 28, 2026',
        narrative: 'Paid $2,500 cash to TechSupply Co. on account for the equipment purchased on Oct 05.',
        topic: 'Supplies & Equipment',
        difficulty: 'Beginner',
        hints: ['Accounts Payable is reduced', 'Cash is paid out'],
        correctLines: [
          { accountId: 'accounts_payable', debit: 2500, credit: 0 },
          { accountId: 'cash', debit: 0, credit: 2500 }
        ],
        explanation: 'Paying a supplier reduces the liability Accounts Payable (debit $2,500) and decreases Cash (credit $2,500).',
        accountAnalysis: [
          { accountId: 'accounts_payable', action: 'Debit', amount: 2500, reason: 'Accounts Payable decreases with a Debit of $2,500.' },
          { accountId: 'cash', action: 'Credit', amount: 2500, reason: 'Cash decreases with a Credit of $2,500.' }
        ],
        equationImpact: {
          assets: -2500,
          liabilities: -2500,
          equity: 0,
          explanation: 'Assets decrease by $2,500 (Cash) = Liabilities decrease by $2,500 (Accounts Payable).'
        }
      },
      {
        id: 'pin-08',
        title: 'Transaction 8: Month-End Adjusting Entry for Insurance Expiration',
        companyName: 'Pinnacle Creative Studio Inc.',
        date: 'Oct 31, 2026',
        narrative: 'Record the adjusting entry for 1 month of insurance expired from the $2,400 1-year policy purchased on Oct 02 ($2,400 / 12 = $200).',
        topic: 'Accruals & Deferrals',
        difficulty: 'Intermediate',
        hints: ['Insurance Expense increases for the 1 month used ($200)', 'Prepaid Insurance asset decreases ($200)'],
        correctLines: [
          { accountId: 'insurance_expense', debit: 200, credit: 0 },
          { accountId: 'prepaid_insurance', debit: 0, credit: 200 }
        ],
        explanation: 'One month of insurance protection has expired. Debit Insurance Expense $200 and credit Prepaid Insurance $200.',
        accountAnalysis: [
          { accountId: 'insurance_expense', action: 'Debit', amount: 200, reason: 'Insurance Expense increases with a Debit of $200.' },
          { accountId: 'prepaid_insurance', action: 'Credit', amount: 200, reason: 'Prepaid Insurance decreases with a Credit of $200.' }
        ],
        equationImpact: {
          assets: -200,
          liabilities: 0,
          equity: -200,
          explanation: 'Assets decrease by $200 (Prepaid Insurance) = Equity decreases by $200 (Insurance Expense).'
        }
      },
      {
        id: 'pin-09',
        title: 'Transaction 9: Cash Advance Received for 3-Month Retainer',
        companyName: 'Pinnacle Creative Studio Inc.',
        date: 'Oct 28, 2026',
        narrative: 'Received $3,600 cash in advance from Apex Holdings for a 3-month design retainer ($1,200/month). No service has been performed yet.',
        topic: 'Accruals & Deferrals',
        difficulty: 'Intermediate',
        hints: ['Cash asset increases with a Debit of $3,600', 'Advance customer payment creates an obligation: Credit Unearned Service Revenue $3,600'],
        correctLines: [
          { accountId: 'cash', debit: 3600, credit: 0 },
          { accountId: 'unearned_service_revenue', debit: 0, credit: 3600 }
        ],
        explanation: 'Receiving cash before services are performed creates a liability. Debit Cash $3,600 and credit Unearned Service Revenue $3,600.',
        accountAnalysis: [
          { accountId: 'cash', action: 'Debit', amount: 3600, reason: 'Cash increases with a Debit of $3,600.' },
          { accountId: 'unearned_service_revenue', action: 'Credit', amount: 3600, reason: 'Unearned Service Revenue liability increases with a Credit of $3,600.' }
        ],
        equationImpact: {
          assets: 3600,
          liabilities: 3600,
          equity: 0,
          explanation: 'Assets increase by $3,600 (Cash) = Liabilities increase by $3,600 (Unearned Service Revenue).'
        }
      },
      {
        id: 'pin-10',
        title: 'Transaction 10: Month-End Adjusting Entry: Unearned Revenue Earned',
        companyName: 'Pinnacle Creative Studio Inc.',
        date: 'Oct 31, 2026',
        narrative: 'During the final days of October, Pinnacle completed an urgent initial brand sprint for Apex Holdings, fulfilling and earning $1,200 of the $3,600 retainer. Record the month-end adjusting journal entry ($3,600 ÷ 3 months = $1,200).',
        topic: 'Accruals & Deferrals',
        difficulty: 'Intermediate',
        hints: [
          'Unearned Service Revenue liability is reduced with a DEBIT of $1,200',
          'Service Revenue is recognized with a CREDIT of $1,200 now that service was provided'
        ],
        correctLines: [
          { accountId: 'unearned_service_revenue', debit: 1200, credit: 0 },
          { accountId: 'service_revenue', debit: 0, credit: 1200 }
        ],
        explanation: 'Fulfilling the service satisfies $1,200 of the obligation. Debit Unearned Service Revenue $1,200 to reduce the liability and credit Service Revenue $1,200 to recognize earned revenue.',
        accountAnalysis: [
          { accountId: 'unearned_service_revenue', action: 'Debit', amount: 1200, reason: 'Unearned Service Revenue decreases with a Debit of $1,200.' },
          { accountId: 'service_revenue', action: 'Credit', amount: 1200, reason: 'Service Revenue increases with a Credit of $1,200.' }
        ],
        equationImpact: {
          assets: 0,
          liabilities: -1200,
          equity: 1200,
          explanation: 'Liabilities decrease by $1,200 (Unearned Service Revenue) and Equity increases by $1,200 (Service Revenue). Assets are unaffected.'
        }
      },
      {
        id: 'pin-11',
        title: 'Transaction 11: Month-End Adjusting Entry: Equipment Depreciation',
        companyName: 'Pinnacle Creative Studio Inc.',
        date: 'Oct 31, 2026',
        narrative: 'Record 1 month of straight-line depreciation on the $6,000 design workstations purchased on Oct 05. The workstations have an estimated 5-year (60-month) useful life and zero salvage value ($6,000 ÷ 60 months = $100/month).',
        topic: 'Accruals & Deferrals',
        difficulty: 'Intermediate',
        hints: [
          'Monthly depreciation = $6,000 ÷ 60 months = $100',
          'Debit Depreciation Expense $100',
          'Credit Accumulated Depreciation - Equipment $100'
        ],
        correctLines: [
          { accountId: 'depreciation_expense', debit: 100, credit: 0 },
          { accountId: 'accumulated_depreciation_equipment', debit: 0, credit: 100 }
        ],
        explanation: 'Debit Depreciation Expense $100 to record the operating expense of using the equipment. Credit Accumulated Depreciation - Equipment $100 (contra-asset) to reduce net equipment book value without removing historical cost.',
        accountAnalysis: [
          { accountId: 'depreciation_expense', action: 'Debit', amount: 100, reason: 'Depreciation Expense increases on the Debit side by $100.' },
          { accountId: 'accumulated_depreciation_equipment', action: 'Credit', amount: 100, reason: 'Accumulated Depreciation contra-asset increases on the Credit side by $100.' }
        ],
        equationImpact: {
          assets: -100,
          liabilities: 0,
          equity: -100,
          explanation: 'Assets decrease by $100 (via contra-asset Accumulated Depreciation) = Equity decreases by $100 (Depreciation Expense).'
        }
      }
    ]
  },
  {
    id: 'multi-solaris-logistics',
    title: 'Solaris Courier & Logistics — Opening Cycle',
    companyName: 'Solaris Courier Services LLC',
    businessType: 'Same-day Medical & Package Delivery',
    description: 'Track the full launch month of Solaris Courier Services, from fleet financing and customer deliveries to driver payroll accruals.',
    transactions: [
      {
        id: 'sol-01',
        title: 'Transaction 1: Initial Capital Investment',
        companyName: 'Solaris Courier Services LLC',
        date: 'Nov 01, 2026',
        narrative: 'Solaris received $40,000 cash from founding shareholders in exchange for common shares.',
        topic: 'Investments & Capital',
        difficulty: 'Beginner',
        hints: ['Debit Cash', 'Credit Common Shares'],
        correctLines: [
          { accountId: 'cash', debit: 40000, credit: 0 },
          { accountId: 'common_shares', debit: 0, credit: 40000 }
        ],
        explanation: 'Debit Cash $40,000 and credit Common Shares $40,000 under Canadian ASPE / IFRS.',
        accountAnalysis: [
          { accountId: 'cash', action: 'Debit', amount: 40000, reason: 'Cash increases with a Debit.' },
          { accountId: 'common_shares', action: 'Credit', amount: 40000, reason: 'Common Shares increases with a Credit.' }
        ],
        equationImpact: { assets: 40000, liabilities: 0, equity: 40000, explanation: 'Assets +$40k = Shareholders\' Equity +$40k.' }
      },
      {
        id: 'sol-02',
        title: 'Transaction 2: Delivery Van Purchase with Down Payment & Note',
        companyName: 'Solaris Courier Services LLC',
        date: 'Nov 04, 2026',
        narrative: 'Purchased a delivery van (Equipment) for $32,000. Paid $8,000 cash down and signed a $24,000 promissory Note Payable.',
        topic: 'Supplies & Equipment',
        difficulty: 'Intermediate',
        hints: ['Debit Equipment for full $32,000', 'Credit Cash for $8,000', 'Credit Notes Payable for $24,000'],
        correctLines: [
          { accountId: 'equipment', debit: 32000, credit: 0 },
          { accountId: 'cash', debit: 0, credit: 8000 },
          { accountId: 'notes_payable', debit: 0, credit: 24000 }
        ],
        explanation: 'Equipment asset is recorded at total cost $32,000. Cash outflow is credited $8,000, and long-term liability Notes Payable is credited $24,000.',
        accountAnalysis: [
          { accountId: 'equipment', action: 'Debit', amount: 32000, reason: 'Equipment increases by $32,000.' },
          { accountId: 'cash', action: 'Credit', amount: 8000, reason: 'Cash decreases by $8,000.' },
          { accountId: 'notes_payable', action: 'Credit', amount: 24000, reason: 'Notes Payable increases by $24,000.' }
        ],
        equationImpact: { assets: 24000, liabilities: 24000, equity: 0, explanation: 'Net Assets increase +$24,000 = Liabilities increase +$24,000.' }
      },
      {
        id: 'sol-03',
        title: 'Transaction 3: Cash Received in Advance (Unearned Revenue)',
        companyName: 'Solaris Courier Services LLC',
        date: 'Nov 10, 2026',
        narrative: 'Received $3,000 cash from Metro Labs for guaranteed daily sample courier runs to be completed during December.',
        topic: 'Accruals & Deferrals',
        difficulty: 'Intermediate',
        hints: ['Cash received today', 'Service is in December, so it is Unearned Revenue (liability)'],
        correctLines: [
          { accountId: 'cash', debit: 3000, credit: 0 },
          { accountId: 'unearned_service_revenue', debit: 0, credit: 3000 }
        ],
        explanation: 'Advance customer payment creates an obligation to perform in the future. Debit Cash $3,000 and credit Unearned Service Revenue $3,000.',
        accountAnalysis: [
          { accountId: 'cash', action: 'Debit', amount: 3000, reason: 'Cash increases with a Debit of $3,000.' },
          { accountId: 'unearned_service_revenue', action: 'Credit', amount: 3000, reason: 'Unearned Service Revenue increases with a Credit.' }
        ],
        equationImpact: { assets: 3000, liabilities: 3000, equity: 0, explanation: 'Assets increase $3,000 = Liabilities increase $3,000.' }
      },
      {
        id: 'sol-04',
        title: 'Transaction 4: Performed Delivery Services on Account',
        companyName: 'Solaris Courier Services LLC',
        date: 'Nov 18, 2026',
        narrative: 'Delivered urgent legal documents for City Law Firm and sent an invoice for $5,400 due in 15 days.',
        topic: 'Revenues & Receivables',
        difficulty: 'Beginner',
        hints: ['Debit Accounts Receivable', 'Credit Service Revenue'],
        correctLines: [
          { accountId: 'accounts_receivable', debit: 5400, credit: 0 },
          { accountId: 'service_revenue', debit: 0, credit: 5400 }
        ],
        explanation: 'Debit Accounts Receivable $5,400 and credit Service Revenue $5,400.',
        accountAnalysis: [
          { accountId: 'accounts_receivable', action: 'Debit', amount: 5400, reason: 'Accounts Receivable increases with a Debit.' },
          { accountId: 'service_revenue', action: 'Credit', amount: 5400, reason: 'Service Revenue increases with a Credit.' }
        ],
        equationImpact: { assets: 5400, liabilities: 0, equity: 5400, explanation: 'Assets +$5,400 = Equity +$5,400.' }
      },
      {
        id: 'sol-05',
        title: 'Transaction 5: Paid Driver Salaries in Cash',
        companyName: 'Solaris Courier Services LLC',
        date: 'Nov 25, 2026',
        narrative: 'Paid $2,800 cash to courier drivers for bi-weekly wages earned.',
        topic: 'Operating Expenses',
        difficulty: 'Beginner',
        hints: ['Debit Salaries Expense', 'Credit Cash'],
        correctLines: [
          { accountId: 'salaries_expense', debit: 2800, credit: 0 },
          { accountId: 'cash', debit: 0, credit: 2800 }
        ],
        explanation: 'Debit Salaries and Wages Expense $2,800 and credit Cash $2,800.',
        accountAnalysis: [
          { accountId: 'salaries_expense', action: 'Debit', amount: 2800, reason: 'Salaries Expense increases with a Debit.' },
          { accountId: 'cash', action: 'Credit', amount: 2800, reason: 'Cash decreases with a Credit.' }
        ],
        equationImpact: { assets: -2800, liabilities: 0, equity: -2800, explanation: 'Assets -$2,800 = Equity -$2,800.' }
      },
      {
        id: 'sol-06',
        title: 'Transaction 6: Month-End Adjusting Entry for Van Depreciation',
        companyName: 'Solaris Courier Services LLC',
        date: 'Nov 30, 2026',
        narrative: 'Record 1 month of straight-line depreciation on the delivery van ($32,000 cost, 5-year useful life with $2,000 salvage value = $30,000 ÷ 60 months = $500 per month).',
        topic: 'Accruals & Deferrals',
        difficulty: 'Intermediate',
        hints: ['Debit Depreciation Expense $500', 'Credit Accumulated Depreciation - Equipment $500'],
        correctLines: [
          { accountId: 'depreciation_expense', debit: 500, credit: 0 },
          { accountId: 'accumulated_depreciation_equipment', debit: 0, credit: 500 }
        ],
        explanation: 'Debit Depreciation Expense $500 and credit Accumulated Depreciation - Equipment (contra-asset) $500.',
        accountAnalysis: [
          { accountId: 'depreciation_expense', action: 'Debit', amount: 500, reason: 'Depreciation Expense increases with a Debit.' },
          { accountId: 'accumulated_depreciation_equipment', action: 'Credit', amount: 500, reason: 'Accumulated Depreciation increases with a Credit.' }
        ],
        equationImpact: { assets: -500, liabilities: 0, equity: -500, explanation: 'Net Assets -$500 = Equity -$500.' }
      },
      {
        id: 'sol-07',
        title: 'Transaction 7: Month-End Adjusting Entry: Earned Courier Revenue from Advance',
        companyName: 'Solaris Courier Services LLC',
        date: 'Nov 30, 2026',
        narrative: 'During the final week of November, Metro Labs requested expedited route dry-runs, fulfilling and earning $1,000 of the $3,000 advance received on Nov 10. Record the month-end adjusting journal entry to recognize earned revenue.',
        topic: 'Accruals & Deferrals',
        difficulty: 'Intermediate',
        hints: [
          'Unearned Service Revenue liability is reduced with a DEBIT of $1,000',
          'Service Revenue is recognized with a CREDIT of $1,000'
        ],
        correctLines: [
          { accountId: 'unearned_service_revenue', debit: 1000, credit: 0 },
          { accountId: 'service_revenue', debit: 0, credit: 1000 }
        ],
        explanation: 'Fulfilling part of the service contract reduces the liability (debit Unearned Service Revenue $1,000) and increases recognized revenue on the income statement (credit Service Revenue $1,000).',
        accountAnalysis: [
          { accountId: 'unearned_service_revenue', action: 'Debit', amount: 1000, reason: 'Unearned Service Revenue decreases with a Debit of $1,000.' },
          { accountId: 'service_revenue', action: 'Credit', amount: 1000, reason: 'Service Revenue increases with a Credit of $1,000.' }
        ],
        equationImpact: {
          assets: 0,
          liabilities: -1000,
          equity: 1000,
          explanation: 'Liabilities decrease by $1,000 (Unearned Service Revenue) and Equity increases by $1,000 (Service Revenue). Assets are unaffected.'
        }
      }
    ]
  }
];
