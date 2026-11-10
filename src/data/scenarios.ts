import { AccountingScenario, AccountingTopic, DifficultyLevel } from '../types/accounting';

export const STATIC_SCENARIOS: AccountingScenario[] = [
  // 1. Owner Investment
  {
    id: 'sc-inv-01',
    title: 'Owner Cash Investment',
    companyName: 'Horizon Software Solutions Inc.',
    date: 'Sept 01, 2026',
    narrative: 'Horizon Software Solutions Inc. was formed. The founders contributed $30,000 in cash to the business in exchange for 3,000 common shares.',
    topic: 'Investments & Capital',
    difficulty: 'Beginner',
    hints: [
      'Cash is an asset account. Did the business gain or lose cash?',
      'Common Shares represent the owners equity stake. Does shareholders equity increase or decrease with investment?'
    ],
    correctLines: [
      { accountId: 'cash', debit: 30000, credit: 0 },
      { accountId: 'common_shares', debit: 0, credit: 30000 }
    ],
    explanation: 'Under Canadian corporate statutes (e.g., CBCA) and accounting standards (ASPE / IFRS), when founders invest cash into a corporation, the company receives an asset (Cash) and issues shareholders\' equity (Common Shares). Assets increase on the debit side; Shareholders\' Equity increases on the credit side.',
    accountAnalysis: [
      { accountId: 'cash', action: 'Debit', amount: 30000, reason: 'Cash is an Asset. When the company receives cash, assets increase with a Debit.' },
      { accountId: 'common_shares', action: 'Credit', amount: 30000, reason: 'Common Shares is an Equity account under Canadian standards. When owners invest capital, equity increases with a Credit.' }
    ],
    equationImpact: {
      assets: 30000,
      liabilities: 0,
      equity: 30000,
      explanation: 'Assets increase by $30,000 (Cash) = Liabilities ($0) + Shareholders\' Equity (+$30,000 Common Shares). The accounting equation remains perfectly balanced.'
    }
  },

  // 2. Service Revenue - Cash
  {
    id: 'sc-rev-01',
    title: 'Cash Received for Services Provided',
    companyName: 'Summit Web Design LLC',
    date: 'Sept 04, 2026',
    narrative: 'Summit Web Design performed website development work for a client and immediately received $4,500 cash upon completion of the project.',
    topic: 'Revenues & Receivables',
    difficulty: 'Beginner',
    hints: [
      'Cash was collected immediately.',
      'Revenue earned from providing services belongs in Service Revenue.'
    ],
    correctLines: [
      { accountId: 'cash', debit: 4500, credit: 0 },
      { accountId: 'service_revenue', debit: 0, credit: 4500 }
    ],
    explanation: 'Under the revenue recognition principle, revenue is recognized when services are performed. Since cash was received immediately, we debit Cash (increase asset) and credit Service Revenue (increase revenue/equity).',
    accountAnalysis: [
      { accountId: 'cash', action: 'Debit', amount: 4500, reason: 'Cash is an Asset. Cash inflow increases the asset, which requires a Debit.' },
      { accountId: 'service_revenue', action: 'Credit', amount: 4500, reason: 'Service Revenue is a Revenue account. Revenues increase shareholders\' equity, which requires a Credit.' }
    ],
    equationImpact: {
      assets: 4500,
      liabilities: 0,
      equity: 4500,
      explanation: 'Assets increase by $4,500 (Cash) = Shareholders\' Equity increases by $4,500 via Net Income (Service Revenue).'
    }
  },

  // 3. Service Revenue - On Account
  {
    id: 'sc-rev-02',
    title: 'Services Rendered on Account (Credit)',
    companyName: 'Apex Architectural Studio',
    date: 'Sept 08, 2026',
    narrative: 'Apex Architectural Studio completed blueprints for a client and billed them $6,200. The invoice terms allow payment within 30 days (on account). No cash has been collected yet.',
    topic: 'Revenues & Receivables',
    difficulty: 'Beginner',
    hints: [
      'The company has the right to collect payment in the future. Which asset represents amounts owed by customers?',
      'Even though no cash was received, were services performed?'
    ],
    correctLines: [
      { accountId: 'accounts_receivable', debit: 6200, credit: 0 },
      { accountId: 'service_revenue', debit: 0, credit: 6200 }
    ],
    explanation: 'Under accrual basis accounting, revenue is recognized when earned, regardless of when cash is collected. The right to receive future payment is an asset called Accounts Receivable.',
    accountAnalysis: [
      { accountId: 'accounts_receivable', action: 'Debit', amount: 6200, reason: 'Accounts Receivable is an Asset. When customers owe the firm money, receivables increase with a Debit.' },
      { accountId: 'service_revenue', action: 'Credit', amount: 6200, reason: 'Service Revenue is a Revenue account. Revenue increases net income and equity with a Credit.' }
    ],
    equationImpact: {
      assets: 6200,
      liabilities: 0,
      equity: 6200,
      explanation: 'Assets increase by $6,200 (Accounts Receivable) = Equity increases by $6,200 (Service Revenue).'
    }
  },

  // 4. Cash Collection on Account
  {
    id: 'sc-rev-03',
    title: 'Collection of Accounts Receivable',
    companyName: 'Apex Architectural Studio',
    date: 'Sept 22, 2026',
    narrative: 'Apex received $3,500 cash from the client who was previously billed on Sept 08 as partial payment on their outstanding balance.',
    topic: 'Revenues & Receivables',
    difficulty: 'Intermediate',
    hints: [
      'Cash was received today. Which asset increases?',
      'Was revenue already recognized when the client was originally billed? Should you recognize revenue again or reduce the receivable?'
    ],
    correctLines: [
      { accountId: 'cash', debit: 3500, credit: 0 },
      { accountId: 'accounts_receivable', debit: 0, credit: 3500 }
    ],
    explanation: 'This transaction is an asset exchange: Cash increases and Accounts Receivable decreases. Revenue was already recognized when the work was completed on Sept 08, so recognizing revenue again would improperly double-count revenue!',
    accountAnalysis: [
      { accountId: 'cash', action: 'Debit', amount: 3500, reason: 'Cash increases by $3,500 (Asset increase = Debit).' },
      { accountId: 'accounts_receivable', action: 'Credit', amount: 3500, reason: 'Accounts Receivable decreases because the customer fulfilled part of their debt (Asset decrease = Credit).' }
    ],
    equationImpact: {
      assets: 0,
      liabilities: 0,
      equity: 0,
      explanation: 'Net change in total assets is $0 (+3,500 Cash, -3,500 Accounts Receivable). Liabilities and Equity remain unchanged.'
    }
  },

  // 5. Operating Expense - Rent paid in Cash
  {
    id: 'sc-exp-01',
    title: 'Monthly Office Rent Paid in Cash',
    companyName: 'Beacon Legal Partners',
    date: 'Sept 02, 2026',
    narrative: 'Beacon Legal Partners paid $2,400 cash for current month office rent to Metro Realty.',
    topic: 'Operating Expenses',
    difficulty: 'Beginner',
    hints: [
      'Rent for the current period is an operating expense.',
      'Cash was paid out from the bank account.'
    ],
    correctLines: [
      { accountId: 'rent_expense', debit: 2400, credit: 0 },
      { accountId: 'cash', debit: 0, credit: 2400 }
    ],
    explanation: 'Incurring an expense for the current month reduces net income and equity. Expenses have a normal debit balance. Paying cash reduces an asset, which is credited.',
    accountAnalysis: [
      { accountId: 'rent_expense', action: 'Debit', amount: 2400, reason: 'Rent Expense is an Expense. Expenses increase on the Debit side (reducing equity).' },
      { accountId: 'cash', action: 'Credit', amount: 2400, reason: 'Cash is an Asset. Paying out cash decreases assets with a Credit.' }
    ],
    equationImpact: {
      assets: -2400,
      liabilities: 0,
      equity: -2400,
      explanation: 'Assets decrease by $2,400 (Cash) = Equity decreases by $2,400 (Rent Expense).'
    }
  },

  // 6. Operating Expense - Incurred on Credit (Accounts Payable)
  {
    id: 'sc-exp-02',
    title: 'Advertising Bill Received (To Be Paid Later)',
    companyName: 'BrightPulse Media',
    date: 'Sept 14, 2026',
    narrative: 'BrightPulse Media received a $950 bill from Daily Gazette for promotional newspaper advertising published this week. The bill will be paid next month.',
    topic: 'Operating Expenses',
    difficulty: 'Intermediate',
    hints: [
      'The advertising service was already used/benefited from this week.',
      'Cash was not paid yet; the company owes money to a vendor.'
    ],
    correctLines: [
      { accountId: 'advertising_expense', debit: 950, credit: 0 },
      { accountId: 'accounts_payable', debit: 0, credit: 950 }
    ],
    explanation: 'Under the expense recognition (matching) principle, expenses must be recorded in the period incurred regardless of when cash is paid. The unpaid vendor obligation is recorded as Accounts Payable (liability).',
    accountAnalysis: [
      { accountId: 'advertising_expense', action: 'Debit', amount: 950, reason: 'Advertising Expense increases on the Debit side.' },
      { accountId: 'accounts_payable', action: 'Credit', amount: 950, reason: 'Accounts Payable is a Liability. An increase in liabilities is recorded with a Credit.' }
    ],
    equationImpact: {
      assets: 0,
      liabilities: 950,
      equity: -950,
      explanation: 'Assets = $0. Liabilities increase by $950 (Accounts Payable) and Equity decreases by $950 (Advertising Expense). The equation balances: 0 = +950 - 950.'
    }
  },

  // 7. Purchase Equipment - Compound Entry (Cash + Note Payable)
  {
    id: 'sc-equip-01',
    title: 'Equipment Purchase with Partial Cash & Note Payable',
    companyName: 'Vanguard Engineering',
    date: 'Sept 10, 2026',
    narrative: 'Vanguard Engineering purchased $18,000 of high-precision diagnostic equipment. The company paid $5,000 in cash and signed a 6-month, 6% promissory note for the remaining $13,000 balance.',
    topic: 'Supplies & Equipment',
    difficulty: 'Intermediate',
    hints: [
      'This is a compound entry with 1 debit and 2 credits.',
      'Equipment is recorded at total acquisition cost ($18,000).',
      'The cash outflow is $5,000, and a written promissory note represents Notes Payable.'
    ],
    correctLines: [
      { accountId: 'equipment', debit: 18000, credit: 0 },
      { accountId: 'cash', debit: 0, credit: 5000 },
      { accountId: 'notes_payable', debit: 0, credit: 13000 }
    ],
    explanation: 'The equipment asset is debited for its full purchase price ($18,000). The cash outflow ($5,000) credits Cash, and the remaining obligation ($13,000) is credited to Notes Payable.',
    accountAnalysis: [
      { accountId: 'equipment', action: 'Debit', amount: 18000, reason: 'Equipment is an Asset. Increase in equipment requires a Debit of $18,000.' },
      { accountId: 'cash', action: 'Credit', amount: 5000, reason: 'Cash is an Asset. Decrease in cash requires a Credit of $5,000.' },
      { accountId: 'notes_payable', action: 'Credit', amount: 13000, reason: 'Notes Payable is a Liability. Obligation increases with a Credit of $13,000.' }
    ],
    equationImpact: {
      assets: 13000,
      liabilities: 13000,
      equity: 0,
      explanation: 'Net change in assets: +$18,000 (Equipment) - $5,000 (Cash) = +$13,000. Liabilities increase by $13,000 (Notes Payable). Equity is unchanged.'
    }
  },

  // 8. Purchase Office Supplies on Account
  {
    id: 'sc-supp-01',
    title: 'Purchase Office Supplies on Credit',
    companyName: 'Metro Logistics LLC',
    date: 'Sept 05, 2026',
    narrative: 'Metro Logistics purchased $1,800 of printer paper, toner, and office stationery from Office Depot on account (payable in 30 days).',
    topic: 'Supplies & Equipment',
    difficulty: 'Beginner',
    hints: [
      'Supplies are items to be used in future operations, not an expense yet.',
      'They were bought on account, meaning the company has not paid cash yet.'
    ],
    correctLines: [
      { accountId: 'supplies', debit: 1800, credit: 0 },
      { accountId: 'accounts_payable', debit: 0, credit: 1800 }
    ],
    explanation: 'Supplies are physical items held for future consumption and are initially recorded as an Asset (Office Supplies). The obligation to pay the supplier is Accounts Payable (Liability).',
    accountAnalysis: [
      { accountId: 'supplies', action: 'Debit', amount: 1800, reason: 'Office Supplies is an Asset. Assets increase on the Debit side.' },
      { accountId: 'accounts_payable', action: 'Credit', amount: 1800, reason: 'Accounts Payable is a Liability. Liabilities increase on the Credit side.' }
    ],
    equationImpact: {
      assets: 1800,
      liabilities: 1800,
      equity: 0,
      explanation: 'Assets increase by $1,800 (Supplies) = Liabilities increase by $1,800 (Accounts Payable).'
    }
  },

  // 9. Payment of Accounts Payable
  {
    id: 'sc-pay-01',
    title: 'Payment of Vendor Accounts Payable',
    companyName: 'Metro Logistics LLC',
    date: 'Sept 25, 2026',
    narrative: 'Metro Logistics paid $1,200 cash to Office Depot to settle a portion of the accounts payable incurred on Sept 05.',
    topic: 'Supplies & Equipment',
    difficulty: 'Beginner',
    hints: [
      'A liability is being reduced because the debt is paid.',
      'Cash was paid out to the supplier.'
    ],
    correctLines: [
      { accountId: 'accounts_payable', debit: 1200, credit: 0 },
      { accountId: 'cash', debit: 0, credit: 1200 }
    ],
    explanation: 'Paying an existing account payable decreases the liability (debit Accounts Payable) and decreases the cash asset (credit Cash). It does not create an expense because the expense or asset was recognized when supplies were purchased.',
    accountAnalysis: [
      { accountId: 'accounts_payable', action: 'Debit', amount: 1200, reason: 'Accounts Payable is a Liability. Decreases in liabilities are Debited.' },
      { accountId: 'cash', action: 'Credit', amount: 1200, reason: 'Cash is an Asset. Decreases in assets are Credited.' }
    ],
    equationImpact: {
      assets: -1200,
      liabilities: -1200,
      equity: 0,
      explanation: 'Assets decrease by $1,200 (Cash) = Liabilities decrease by $1,200 (Accounts Payable).'
    }
  },

  // 10. Adjusting Entry - Prepaid Insurance Expiration
  {
    id: 'sc-adj-01',
    title: 'Adjusting Entry: Expired Insurance Premium',
    companyName: 'Riverstone Advisory Inc.',
    date: 'Sept 30, 2026',
    narrative: 'On Sept 01, Riverstone Advisory paid $3,600 cash for a 12-month commercial insurance policy (recorded initially to Prepaid Insurance). Prepare the adjusting journal entry on Sept 30 for one month of expired insurance.',
    topic: 'Accruals & Deferrals',
    difficulty: 'Intermediate',
    hints: [
      'Monthly insurance cost = $3,600 / 12 months = $300.',
      'One month of coverage has now been used up (incurred as an expense).',
      'The asset Prepaid Insurance must be reduced.'
    ],
    correctLines: [
      { accountId: 'insurance_expense', debit: 300, credit: 0 },
      { accountId: 'prepaid_insurance', debit: 0, credit: 300 }
    ],
    explanation: 'During September, 1 month of coverage ($3,600 / 12 = $300) expired. Under the matching principle, this portion becomes an Insurance Expense (debit), and Prepaid Insurance is reduced (credit).',
    accountAnalysis: [
      { accountId: 'insurance_expense', action: 'Debit', amount: 300, reason: 'Insurance Expense increases with a Debit of $300.' },
      { accountId: 'prepaid_insurance', action: 'Credit', amount: 300, reason: 'Prepaid Insurance is an Asset. Asset decreases with a Credit of $300.' }
    ],
    equationImpact: {
      assets: -300,
      liabilities: 0,
      equity: -300,
      explanation: 'Assets decrease by $300 (Prepaid Insurance) = Equity decreases by $300 (Insurance Expense).'
    }
  },

  // 11. Adjusting Entry - Office Supplies Used
  {
    id: 'sc-adj-02',
    title: 'Adjusting Entry: Supplies Consumed During Month',
    companyName: 'Beacon Legal Partners',
    date: 'Sept 30, 2026',
    narrative: 'The unadjusted balance of Office Supplies on Sept 30 was $2,400. A physical count of supplies in the supply room on Sept 30 reveals that only $700 of supplies remain on hand. Prepare the month-end adjusting entry.',
    topic: 'Accruals & Deferrals',
    difficulty: 'Intermediate',
    hints: [
      'Supplies used = Beginning/Unadjusted Balance ($2,400) - Ending on hand ($700) = $1,700.',
      'Supplies used up during operations are an expense.',
      'The asset Office Supplies must be reduced to equal the $700 on hand.'
    ],
    correctLines: [
      { accountId: 'supplies_expense', debit: 1700, credit: 0 },
      { accountId: 'supplies', debit: 0, credit: 1700 }
    ],
    explanation: 'The cost of supplies used during the period is $2,400 - $700 = $1,700. We record this used amount as Supplies Expense (debit) and decrease Office Supplies asset (credit) by $1,700.',
    accountAnalysis: [
      { accountId: 'supplies_expense', action: 'Debit', amount: 1700, reason: 'Supplies Expense increases on the Debit side by $1,700.' },
      { accountId: 'supplies', action: 'Credit', amount: 1700, reason: 'Office Supplies decreases on the Credit side by $1,700, leaving a $700 ending balance.' }
    ],
    equationImpact: {
      assets: -1700,
      liabilities: 0,
      equity: -1700,
      explanation: 'Assets decrease by $1,700 (Supplies) = Equity decreases by $1,700 (Supplies Expense).'
    }
  },

  // 12. Unearned Revenue Receipt
  {
    id: 'sc-unearn-01',
    title: 'Advance Cash Received for Future Services',
    companyName: 'CloudPeak Hosting Corp.',
    date: 'Sept 15, 2026',
    narrative: 'CloudPeak received $6,000 cash in advance from a enterprise client for 6 months of cloud hosting starting in October. No service has been delivered yet.',
    topic: 'Accruals & Deferrals',
    difficulty: 'Intermediate',
    hints: [
      'Cash was received today.',
      'Can revenue be recognized if the service has not been performed yet?',
      'The company has a legal obligation/liability to perform the service in the future.'
    ],
    correctLines: [
      { accountId: 'cash', debit: 6000, credit: 0 },
      { accountId: 'unearned_service_revenue', debit: 0, credit: 6000 }
    ],
    explanation: 'Under the revenue recognition principle, revenue cannot be recorded until earned. Receiving cash before performing services creates a liability called Unearned Service Revenue.',
    accountAnalysis: [
      { accountId: 'cash', action: 'Debit', amount: 6000, reason: 'Cash is an Asset. Receiving cash increases assets with a Debit of $6,000.' },
      { accountId: 'unearned_service_revenue', action: 'Credit', amount: 6000, reason: 'Unearned Service Revenue is a Liability. An increase in liabilities requires a Credit of $6,000.' }
    ],
    equationImpact: {
      assets: 6000,
      liabilities: 6000,
      equity: 0,
      explanation: 'Assets increase by $6,000 (Cash) = Liabilities increase by $6,000 (Unearned Service Revenue).'
    }
  },

  // 13. Adjusting Entry - Unearned Revenue Earned
  {
    id: 'sc-adj-03',
    title: 'Adjusting Entry: Recognizing Earned Revenue from Advance',
    companyName: 'CloudPeak Hosting Corp.',
    date: 'Oct 31, 2026',
    narrative: 'On Sept 15, CloudPeak received $6,000 cash in advance from an enterprise client for 6 months of cloud hosting (October through March) and recorded it as Unearned Service Revenue. As of Oct 31, the first full month of service has been successfully completed. Record the month-end adjusting journal entry to recognize earned revenue ($6,000 ÷ 6 months = $1,000).',
    topic: 'Accruals & Deferrals',
    difficulty: 'Intermediate',
    hints: [
      'Monthly earned revenue = $6,000 ÷ 6 months = $1,000.',
      'Unearned Service Revenue (Liability) is reduced with a DEBIT of $1,000.',
      'Service Revenue (Revenue) is recognized with a CREDIT of $1,000.'
    ],
    correctLines: [
      { accountId: 'unearned_service_revenue', debit: 1000, credit: 0 },
      { accountId: 'service_revenue', debit: 0, credit: 1000 }
    ],
    explanation: 'Now that one month of service has been performed, $1,000 of the unearned liability is fulfilled. We debit Unearned Service Revenue $1,000 to reduce the liability and credit Service Revenue $1,000 to recognize the earned revenue.',
    accountAnalysis: [
      { accountId: 'unearned_service_revenue', action: 'Debit', amount: 1000, reason: 'Unearned Service Revenue is a Liability. Fulfilling 1 month of service decreases the liability with a Debit.' },
      { accountId: 'service_revenue', action: 'Credit', amount: 1000, reason: 'Service Revenue increases equity with a Credit now that service is performed.' }
    ],
    equationImpact: {
      assets: 0,
      liabilities: -1000,
      equity: 1000,
      explanation: 'Liabilities decrease by $1,000 (Unearned Service Revenue) and Equity increases by $1,000 (Service Revenue). Assets are unaffected. Equation remains in balance: 0 = -1,000 + 1,000.'
    }
  },

  // 14. Adjusting Entry - Accrued Salaries
  {
    id: 'sc-adj-04',
    title: 'Adjusting Entry: Accrued Salaries & Wages Expense',
    companyName: 'Highline Consulting',
    date: 'Sept 30, 2026',
    narrative: 'Highline Consulting pays its employees bi-weekly on Fridays. As of Wednesday, Sept 30, employees have worked 3 days since the last payday, earning $2,100 in wages that will not be paid until the next regular payday on Friday, Oct 02. Record the year-end/month-end adjusting entry.',
    topic: 'Accruals & Deferrals',
    difficulty: 'Intermediate',
    hints: [
      'Employees performed work in September; the expense belongs in September.',
      'Cash has not been paid yet, so a liability to employees is created.'
    ],
    correctLines: [
      { accountId: 'salaries_expense', debit: 2100, credit: 0 },
      { accountId: 'salaries_payable', debit: 0, credit: 2100 }
    ],
    explanation: 'Under the matching principle, wages earned by employees in September must be recorded in September even if payday is in October. We debit Salaries and Wages Expense and credit Salaries and Wages Payable.',
    accountAnalysis: [
      { accountId: 'salaries_expense', action: 'Debit', amount: 2100, reason: 'Salaries Expense increases on the Debit side.' },
      { accountId: 'salaries_payable', action: 'Credit', amount: 2100, reason: 'Salaries Payable is a Liability. Increases in liabilities are Credited.' }
    ],
    equationImpact: {
      assets: 0,
      liabilities: 2100,
      equity: -2100,
      explanation: 'Liabilities increase by $2,100 (Salaries Payable) and Equity decreases by $2,100 (Salaries Expense).'
    }
  },

  // 15. Adjusting Entry - Depreciation Expense
  {
    id: 'sc-adj-05',
    title: 'Adjusting Entry: Monthly Equipment Depreciation',
    companyName: 'Falcon Delivery Services',
    date: 'Sept 30, 2026',
    narrative: 'On Sept 01, Falcon Delivery purchased delivery fleet equipment costing $36,000 with an estimated 3-year (36-month) useful life and zero salvage value. Using the straight-line method, calculate and record the adjusting entry for one month of depreciation ($36,000 ÷ 36 months = $1,000/month).',
    topic: 'Accruals & Deferrals',
    difficulty: 'Intermediate',
    hints: [
      'Monthly straight-line depreciation = Cost ($36,000) ÷ Useful Life in Months (36 months) = $1,000.',
      'Debit Depreciation Expense for $1,000.',
      'Credit Accumulated Depreciation - Equipment (contra-asset) for $1,000.'
    ],
    correctLines: [
      { accountId: 'depreciation_expense', debit: 1000, credit: 0 },
      { accountId: 'accumulated_depreciation_equipment', debit: 0, credit: 1000 }
    ],
    explanation: 'Depreciation allocates the cost of an asset over its useful life. We debit Depreciation Expense $1,000 and credit Accumulated Depreciation - Equipment (a contra-asset) $1,000. We do not credit Equipment directly so its historical acquisition cost remains visible.',
    accountAnalysis: [
      { accountId: 'depreciation_expense', action: 'Debit', amount: 1000, reason: 'Depreciation Expense increases on the Debit side by $1,000.' },
      { accountId: 'accumulated_depreciation_equipment', action: 'Credit', amount: 1000, reason: 'Accumulated Depreciation is a Contra-Asset account with a normal credit balance. Credit increases the contra-asset, reducing net book value.' }
    ],
    equationImpact: {
      assets: -1000,
      liabilities: 0,
      equity: -1000,
      explanation: 'Net Assets decrease by $1,000 (via Accumulated Depreciation contra-asset) = Equity decreases by $1,000 (Depreciation Expense). Equation remains in balance: -1,000 = 0 + (-1,000).'
    }
  },

  // 16. Merchandising - Perpetual Inventory Sale (Two-part Entry)
  {
    id: 'sc-merch-01',
    title: 'Merchandise Sale on Account with COGS',
    companyName: 'Nordic Outfitters Inc.',
    date: 'Sept 18, 2026',
    narrative: 'Nordic Outfitters sold outdoor gear to a customer on account for $3,200. The merchandise had originally cost Nordic Outfitters $1,800. Record the complete sales transaction under the perpetual inventory system.',
    topic: 'Merchandising & Inventory',
    difficulty: 'Advanced',
    hints: [
      'Under the perpetual system, a sale requires two entries (or 4 lines in total):',
      '1. Record the sales revenue and customer receivable at selling price ($3,200).',
      '2. Record the cost of goods sold expense and remove the inventory at cost ($1,800).'
    ],
    correctLines: [
      { accountId: 'accounts_receivable', debit: 3200, credit: 0 },
      { accountId: 'sales_revenue', debit: 0, credit: 3200 },
      { accountId: 'cost_of_goods_sold', debit: 1800, credit: 0 },
      { accountId: 'inventory', debit: 0, credit: 1800 }
    ],
    explanation: 'Under perpetual inventory, every sale requires recording: (1) The revenue generated at retail price (Debit Accounts Receivable, Credit Sales Revenue for $3,200), and (2) The outflow of inventory at historical cost (Debit Cost of Goods Sold, Credit Merchandise Inventory for $1,800). Gross profit on this sale is $3,200 - $1,800 = $1,400.',
    accountAnalysis: [
      { accountId: 'accounts_receivable', action: 'Debit', amount: 3200, reason: 'Accounts Receivable increases by $3,200 (Asset debit).' },
      { accountId: 'sales_revenue', action: 'Credit', amount: 3200, reason: 'Sales Revenue increases by $3,200 (Revenue credit).' },
      { accountId: 'cost_of_goods_sold', action: 'Debit', amount: 1800, reason: 'COGS is an Expense representing cost of merchandise sold (Expense debit).' },
      { accountId: 'inventory', action: 'Credit', amount: 1800, reason: 'Merchandise Inventory is an Asset. When goods leave the warehouse, inventory decreases with a Credit.' }
    ],
    equationImpact: {
      assets: 1400,
      liabilities: 0,
      equity: 1400,
      explanation: 'Net change in assets: +$3,200 (A/R) - $1,800 (Inventory) = +$1,400. Equity increases by $1,400 (Sales Revenue $3,200 - COGS $1,800 = Gross Profit $1,400).'
    }
  },

  // 17. Dividends Declared and Paid
  {
    id: 'sc-div-01',
    title: 'Declaration and Cash Payment of Dividends',
    companyName: 'Horizon Software Solutions Inc.',
    date: 'Sept 28, 2026',
    narrative: 'The board of directors declared and immediately paid a $2,500 cash dividend to corporate shareholders.',
    topic: 'Dividends & Closing',
    difficulty: 'Intermediate',
    hints: [
      'Dividends distribute earnings back to owners. They are not an expense on the income statement!',
      'Dividends have a normal debit balance because they reduce retained earnings.'
    ],
    correctLines: [
      { accountId: 'dividends', debit: 2500, credit: 0 },
      { accountId: 'cash', debit: 0, credit: 2500 }
    ],
    explanation: 'Under Canadian accounting standards (ASPE / IFRS), dividends represent a distribution of retained earnings to shareholders. Dividends increase on the debit side (reducing shareholders\' equity) and cash decreases with a credit.',
    accountAnalysis: [
      { accountId: 'dividends', action: 'Debit', amount: 2500, reason: 'Dividends has a normal Debit balance, representing a reduction of shareholders\' equity.' },
      { accountId: 'cash', action: 'Credit', amount: 2500, reason: 'Cash is paid out, reducing the asset with a Credit.' }
    ],
    equationImpact: {
      assets: -2500,
      liabilities: 0,
      equity: -2500,
      explanation: 'Assets decrease by $2,500 (Cash) = Shareholders\' Equity decreases by $2,500 (Dividends paid).'
    }
  },

  // 18. Accrued Interest on Notes Payable
  {
    id: 'sc-adj-06',
    title: 'Adjusting Entry: Accrued Interest on Note Payable',
    companyName: 'Vanguard Engineering',
    date: 'Sept 30, 2026',
    narrative: 'On Sept 10, Vanguard Engineering signed a $13,000, 6%, 6-month promissory note. As of Sept 30, 20 days of interest have accrued: ($13,000 × 6% × 20/360 days = $43.33, rounded to $45). Prepare the month-end interest accrual entry.',
    topic: 'Accruals & Deferrals',
    difficulty: 'Advanced',
    hints: [
      'Interest has built up as time passed, creating an expense for the current month.',
      'The interest has not yet been paid in cash, creating a liability.'
    ],
    correctLines: [
      { accountId: 'interest_expense', debit: 45, credit: 0 },
      { accountId: 'interest_payable', debit: 0, credit: 45 }
    ],
    explanation: 'Under accrual accounting, interest expense accumulates with the passage of time. We debit Interest Expense and credit Interest Payable.',
    accountAnalysis: [
      { accountId: 'interest_expense', action: 'Debit', amount: 45, reason: 'Interest Expense increases on the Debit side.' },
      { accountId: 'interest_payable', action: 'Credit', amount: 45, reason: 'Interest Payable is a Liability. Increases in liabilities are Credited.' }
    ],
    equationImpact: {
      assets: 0,
      liabilities: 45,
      equity: -45,
      explanation: 'Liabilities increase by $45 (Interest Payable) and Equity decreases by $45 (Interest Expense).'
    }
  }
];

// Dynamic Scenario Generator to create endless unique randomized transactions
const RANDOM_COMPANIES = [
  'Blue Horizon Media', 'Apex Cloud Solutions', 'Crestview Consulting',
  'Metro Tech Innovations', 'Starlight Logistics', 'Pinnacle Creative Agency',
  'Silverline Manufacturing', 'Emerald Coast Catering', 'Atlas Legal Group',
  'Terra Nova Analytics', 'Quantum Robotics Corp.', 'Timberline Outfitters'
];

const RANDOM_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function generateUnearnedRevenueEarnedScenario(company: string, dateStr: string): AccountingScenario {
  const options = [
    { advance: 3600, months: 6, monthly: 600, service: 'cloud hosting' },
    { advance: 4800, months: 4, monthly: 1200, service: 'IT infrastructure support' },
    { advance: 6000, months: 6, monthly: 1000, service: 'digital marketing services' },
    { advance: 7200, months: 6, monthly: 1200, service: 'enterprise software licensing' },
    { advance: 9000, months: 6, monthly: 1500, service: 'legal retainer services' },
    { advance: 12000, months: 6, monthly: 2000, service: 'cybersecurity monitoring' },
    { advance: 15000, months: 5, monthly: 3000, service: 'consulting advisory retainers' },
    { advance: 24000, months: 12, monthly: 2000, service: 'data center colocation' },
  ];
  const opt = options[Math.floor(Math.random() * options.length)];
  const narrative = `On the 15th of last month, ${company} received $${opt.advance.toLocaleString()} cash in advance from an enterprise client for ${opt.months} months of ${opt.service} and recorded it as Unearned Service Revenue. As of ${dateStr}, the first full month of service has been successfully completed. Record the month-end adjusting journal entry to recognize earned revenue ($${opt.advance.toLocaleString()} ÷ ${opt.months} months = $${opt.monthly.toLocaleString()}).`;
  return {
    id: `rand-adj03-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: 'Adjusting Entry: Recognizing Earned Revenue from Advance',
    companyName: company,
    date: dateStr,
    narrative,
    topic: 'Accruals & Deferrals',
    difficulty: 'Intermediate',
    hints: [
      `Monthly earned revenue = Total Advance ($${opt.advance.toLocaleString()}) ÷ ${opt.months} months = $${opt.monthly.toLocaleString()}.`,
      `Unearned Service Revenue (Liability) is reduced with a DEBIT of $${opt.monthly.toLocaleString()}.`,
      `Service Revenue (Revenue) is recognized with a CREDIT of $${opt.monthly.toLocaleString()}.`
    ],
    correctLines: [
      { accountId: 'unearned_service_revenue', debit: opt.monthly, credit: 0 },
      { accountId: 'service_revenue', debit: 0, credit: opt.monthly }
    ],
    explanation: `Now that 1 month of service has been performed, $${opt.monthly.toLocaleString()} of the advance liability has been fulfilled and earned. We debit Unearned Service Revenue $${opt.monthly.toLocaleString()} to reduce the liability and credit Service Revenue $${opt.monthly.toLocaleString()} to recognize earned revenue on the income statement.`,
    accountAnalysis: [
      {
        accountId: 'unearned_service_revenue',
        action: 'Debit',
        amount: opt.monthly,
        reason: `Unearned Service Revenue is a Liability. Fulfilling 1 month of service decreases the liability with a Debit of $${opt.monthly.toLocaleString()}.`
      },
      {
        accountId: 'service_revenue',
        action: 'Credit',
        amount: opt.monthly,
        reason: `Service Revenue is a Revenue account. Recognizing earned revenue increases shareholders' equity with a Credit of $${opt.monthly.toLocaleString()}.`
      }
    ],
    equationImpact: {
      assets: 0,
      liabilities: -opt.monthly,
      equity: opt.monthly,
      explanation: `Liabilities decrease by $${opt.monthly.toLocaleString()} (Unearned Service Revenue) and Shareholders' Equity increases by $${opt.monthly.toLocaleString()} (Service Revenue via Net Income). Assets are unaffected. Accounting equation remains balanced: 0 = -$${opt.monthly.toLocaleString()} + $${opt.monthly.toLocaleString()}.`
    }
  };
}

function generateDepreciationScenario(company: string, dateStr: string): AccountingScenario {
  const options = [
    { cost: 18000, years: 3, months: 36, monthly: 500, asset: 'delivery van' },
    { cost: 24000, years: 4, months: 48, monthly: 500, asset: 'office equipment' },
    { cost: 30000, years: 5, months: 60, monthly: 500, asset: 'server hardware' },
    { cost: 36000, years: 3, months: 36, monthly: 1000, asset: 'delivery fleet truck' },
    { cost: 48000, years: 4, months: 48, monthly: 1000, asset: 'specialized printing presses' },
    { cost: 60000, years: 5, months: 60, monthly: 1000, asset: 'commercial packaging machinery' },
    { cost: 72000, years: 6, months: 72, monthly: 1000, asset: 'manufacturing equipment' },
    { cost: 96000, years: 4, months: 48, monthly: 2000, asset: 'fleet delivery vehicles' },
  ];
  const opt = options[Math.floor(Math.random() * options.length)];
  const narrative = `On the first day of the month, ${company} purchased a ${opt.asset} costing $${opt.cost.toLocaleString()} with an estimated ${opt.years}-year (${opt.months}-month) useful life and zero salvage value. Using the straight-line method, calculate and record the adjusting entry for one month of depreciation ($${opt.cost.toLocaleString()} ÷ ${opt.months} months = $${opt.monthly.toLocaleString()}/month).`;
  return {
    id: `rand-adj05-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: 'Adjusting Entry: Monthly Equipment Depreciation',
    companyName: company,
    date: dateStr,
    narrative,
    topic: 'Accruals & Deferrals',
    difficulty: 'Intermediate',
    hints: [
      `Monthly straight-line depreciation = Cost ($${opt.cost.toLocaleString()}) ÷ Useful Life in Months (${opt.months} months) = $${opt.monthly.toLocaleString()}.`,
      `Debit Depreciation Expense for $${opt.monthly.toLocaleString()} to recognize the cost of using the asset.`,
      `Credit Accumulated Depreciation - Equipment (contra-asset) for $${opt.monthly.toLocaleString()}.`
    ],
    correctLines: [
      { accountId: 'depreciation_expense', debit: opt.monthly, credit: 0 },
      { accountId: 'accumulated_depreciation_equipment', debit: 0, credit: opt.monthly }
    ],
    explanation: `Depreciation allocates the historical cost of physical equipment over its useful life. Under Canadian accounting standards (ASPE / IFRS), we debit Depreciation Expense $${opt.monthly.toLocaleString()} and credit Accumulated Depreciation - Equipment $${opt.monthly.toLocaleString()} (a contra-asset). We never credit Equipment directly so its original acquisition cost remains visible on the Statement of Financial Position (Balance Sheet).`,
    accountAnalysis: [
      {
        accountId: 'depreciation_expense',
        action: 'Debit',
        amount: opt.monthly,
        reason: `Depreciation Expense is an operating expense. Expenses increase on the Debit side by $${opt.monthly.toLocaleString()}.`
      },
      {
        accountId: 'accumulated_depreciation_equipment',
        action: 'Credit',
        amount: opt.monthly,
        reason: `Accumulated Depreciation is a Contra-Asset with a normal Credit balance. Crediting it by $${opt.monthly.toLocaleString()} reduces total net assets (book value).`
      }
    ],
    equationImpact: {
      assets: -opt.monthly,
      liabilities: 0,
      equity: -opt.monthly,
      explanation: `Net Assets decrease by $${opt.monthly.toLocaleString()} (via contra-asset Accumulated Depreciation) = Shareholders' Equity decreases by $${opt.monthly.toLocaleString()} (via Depreciation Expense). Liabilities remain $0. Equation remains balanced: -$${opt.monthly.toLocaleString()} = -$${opt.monthly.toLocaleString()}.`
    }
  };
}

function generateUnearnedAdvanceScenario(company: string, dateStr: string): AccountingScenario {
  const options = [3000, 4500, 6000, 7500, 9000, 12000, 15000];
  const amt = options[Math.floor(Math.random() * options.length)];
  const narrative = `${company} received $${amt.toLocaleString()} cash in advance from an enterprise client for 6 months of cloud hosting services starting next month. No services have been delivered yet.`;
  return {
    id: `rand-unearn01-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: 'Advance Cash Received for Future Services',
    companyName: company,
    date: dateStr,
    narrative,
    topic: 'Accruals & Deferrals',
    difficulty: 'Intermediate',
    hints: [
      `Cash of $${amt.toLocaleString()} was received today (Debit Cash).`,
      `Because no service has been performed yet, revenue cannot be recognized; instead, record an obligation/liability (Credit Unearned Service Revenue for $${amt.toLocaleString()}).`
    ],
    correctLines: [
      { accountId: 'cash', debit: amt, credit: 0 },
      { accountId: 'unearned_service_revenue', debit: 0, credit: amt }
    ],
    explanation: `Under the revenue recognition principle, revenue is only recognized when performance obligations are satisfied. Receiving cash in advance creates a liability called Unearned Service Revenue. We debit Cash $${amt.toLocaleString()} and credit Unearned Service Revenue $${amt.toLocaleString()}.`,
    accountAnalysis: [
      { accountId: 'cash', action: 'Debit', amount: amt, reason: `Cash is an Asset. Inflow of cash increases assets with a Debit of $${amt.toLocaleString()}.` },
      { accountId: 'unearned_service_revenue', action: 'Credit', amount: amt, reason: `Unearned Service Revenue is a Liability. Obligation to provide future services increases with a Credit of $${amt.toLocaleString()}.` }
    ],
    equationImpact: {
      assets: amt,
      liabilities: amt,
      equity: 0,
      explanation: `Assets increase by $${amt.toLocaleString()} (Cash) = Liabilities increase by $${amt.toLocaleString()} (Unearned Service Revenue). Shareholders' equity is unchanged until services are actually performed.`
    }
  };
}

function generateInsuranceExpirationScenario(company: string, dateStr: string): AccountingScenario {
  const options = [
    { total: 2400, months: 12, monthly: 200 },
    { total: 3600, months: 12, monthly: 300 },
    { total: 4800, months: 12, monthly: 400 },
    { total: 6000, months: 12, monthly: 500 },
    { total: 7200, months: 12, monthly: 600 },
  ];
  const opt = options[Math.floor(Math.random() * options.length)];
  const narrative = `On the first of the month, ${company} paid $${opt.total.toLocaleString()} cash for a 12-month commercial insurance policy (recorded initially to Prepaid Insurance). Prepare the month-end adjusting journal entry on ${dateStr} for one month of expired insurance ($${opt.total.toLocaleString()} ÷ 12 months = $${opt.monthly.toLocaleString()}).`;
  return {
    id: `rand-adj01-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: 'Adjusting Entry: Expired Insurance Premium',
    companyName: company,
    date: dateStr,
    narrative,
    topic: 'Accruals & Deferrals',
    difficulty: 'Intermediate',
    hints: [
      `Monthly insurance cost = Total Policy ($${opt.total.toLocaleString()}) ÷ 12 months = $${opt.monthly.toLocaleString()}.`,
      `One month of coverage has expired and is now an expense (Debit Insurance Expense $${opt.monthly.toLocaleString()}).`,
      `The asset Prepaid Insurance is reduced (Credit Prepaid Insurance $${opt.monthly.toLocaleString()}).`
    ],
    correctLines: [
      { accountId: 'insurance_expense', debit: opt.monthly, credit: 0 },
      { accountId: 'prepaid_insurance', debit: 0, credit: opt.monthly }
    ],
    explanation: `During the month, 1 month of insurance protection ($${opt.total.toLocaleString()} ÷ 12 = $${opt.monthly.toLocaleString()}) expired. Under the matching principle, this portion becomes an Insurance Expense (debit), and Prepaid Insurance is reduced (credit).`,
    accountAnalysis: [
      { accountId: 'insurance_expense', action: 'Debit', amount: opt.monthly, reason: `Insurance Expense increases with a Debit of $${opt.monthly.toLocaleString()}.` },
      { accountId: 'prepaid_insurance', action: 'Credit', amount: opt.monthly, reason: `Prepaid Insurance is an Asset. Asset decreases with a Credit of $${opt.monthly.toLocaleString()}.` }
    ],
    equationImpact: {
      assets: -opt.monthly,
      liabilities: 0,
      equity: -opt.monthly,
      explanation: `Assets decrease by $${opt.monthly.toLocaleString()} (Prepaid Insurance) = Equity decreases by $${opt.monthly.toLocaleString()} (Insurance Expense).`
    }
  };
}

function generateSuppliesConsumedScenario(company: string, dateStr: string): AccountingScenario {
  const options = [
    { unadj: 2400, onHand: 700, used: 1700 },
    { unadj: 3000, onHand: 800, used: 2200 },
    { unadj: 3500, onHand: 1100, used: 2400 },
    { unadj: 4200, onHand: 1200, used: 3000 },
    { unadj: 5000, onHand: 1500, used: 3500 },
  ];
  const opt = options[Math.floor(Math.random() * options.length)];
  const narrative = `The unadjusted balance of Office Supplies on ${dateStr} was $${opt.unadj.toLocaleString()}. A physical count of supplies in the supply closet at month-end reveals that $${opt.onHand.toLocaleString()} of supplies remain on hand. Prepare the month-end adjusting entry ($${opt.unadj.toLocaleString()} unadjusted - $${opt.onHand.toLocaleString()} on hand = $${opt.used.toLocaleString()} consumed).`;
  return {
    id: `rand-adj02-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: 'Adjusting Entry: Supplies Consumed During Month',
    companyName: company,
    date: dateStr,
    narrative,
    topic: 'Accruals & Deferrals',
    difficulty: 'Intermediate',
    hints: [
      `Supplies used = Unadjusted Balance ($${opt.unadj.toLocaleString()}) - Ending count ($${opt.onHand.toLocaleString()}) = $${opt.used.toLocaleString()}.`,
      `Supplies used up are an expense (Debit Supplies Expense $${opt.used.toLocaleString()}).`,
      `The asset Office Supplies is reduced (Credit Office Supplies $${opt.used.toLocaleString()}).`
    ],
    correctLines: [
      { accountId: 'supplies_expense', debit: opt.used, credit: 0 },
      { accountId: 'supplies', debit: 0, credit: opt.used }
    ],
    explanation: `The cost of supplies used during operations is $${opt.unadj.toLocaleString()} - $${opt.onHand.toLocaleString()} = $${opt.used.toLocaleString()}. We debit Supplies Expense $${opt.used.toLocaleString()} and credit Office Supplies asset $${opt.used.toLocaleString()} to leave an ending asset balance of $${opt.onHand.toLocaleString()}.`,
    accountAnalysis: [
      { accountId: 'supplies_expense', action: 'Debit', amount: opt.used, reason: `Supplies Expense increases on the Debit side by $${opt.used.toLocaleString()}.` },
      { accountId: 'supplies', action: 'Credit', amount: opt.used, reason: `Office Supplies decreases on the Credit side by $${opt.used.toLocaleString()}, leaving $${opt.onHand.toLocaleString()} ending balance.` }
    ],
    equationImpact: {
      assets: -opt.used,
      liabilities: 0,
      equity: -opt.used,
      explanation: `Assets decrease by $${opt.used.toLocaleString()} (Office Supplies) = Equity decreases by $${opt.used.toLocaleString()} (Supplies Expense).`
    }
  };
}

export function generateRandomScenario(topicFilter?: AccountingTopic, difficultyFilter?: DifficultyLevel): AccountingScenario {
  // Filter base scenarios if provided
  let pool = STATIC_SCENARIOS;
  if (topicFilter) {
    pool = pool.filter(s => s.topic === topicFilter);
  }
  if (difficultyFilter) {
    const diffPool = pool.filter(s => s.difficulty === difficultyFilter);
    if (diffPool.length > 0) pool = diffPool;
  }
  if (pool.length === 0) pool = STATIC_SCENARIOS;

  const base = pool[Math.floor(Math.random() * pool.length)];
  const randomCompany = RANDOM_COMPANIES[Math.floor(Math.random() * RANDOM_COMPANIES.length)];
  const randomMonth = RANDOM_MONTHS[Math.floor(Math.random() * RANDOM_MONTHS.length)];
  const randomDay = String(Math.floor(Math.random() * 26) + 1).padStart(2, '0');
  const dateStr = `${randomMonth} ${randomDay}, 2026`;

  // Route specialized formula scenarios to ensure 100% mathematical precision
  if (base.id === 'sc-adj-03') {
    return generateUnearnedRevenueEarnedScenario(randomCompany, dateStr);
  }
  if (base.id === 'sc-adj-05') {
    return generateDepreciationScenario(randomCompany, dateStr);
  }
  if (base.id === 'sc-unearn-01') {
    return generateUnearnedAdvanceScenario(randomCompany, dateStr);
  }
  if (base.id === 'sc-adj-01') {
    return generateInsuranceExpirationScenario(randomCompany, dateStr);
  }
  if (base.id === 'sc-adj-02') {
    return generateSuppliesConsumedScenario(randomCompany, dateStr);
  }

  // Scale multiplier: 0.8, 1.0, 1.2, 1.5, 2.0
  const multipliers = [0.8, 1.0, 1.2, 1.4, 1.5, 2.0, 2.5];
  const mult = multipliers[Math.floor(Math.random() * multipliers.length)];

  // Scale amounts cleanly rounded to nearest 50
  const scaledCorrectLines = base.correctLines.map(line => ({
    ...line,
    debit: line.debit > 0 ? Math.round((line.debit * mult) / 50) * 50 : 0,
    credit: line.credit > 0 ? Math.round((line.credit * mult) / 50) * 50 : 0,
  }));

  const scaledAnalysis = base.accountAnalysis.map(a => ({
    ...a,
    amount: Math.round((a.amount * mult) / 50) * 50
  }));

  // Replace company name and amounts in narrative
  let newNarrative = base.narrative.replace(new RegExp(base.companyName, 'g'), randomCompany);
  
  // Format numbers nicely in narrative
  base.correctLines.forEach((line, idx) => {
    const origAmt = line.debit || line.credit;
    const newAmt = scaledCorrectLines[idx].debit || scaledCorrectLines[idx].credit;
    if (origAmt > 0 && newAmt > 0) {
      newNarrative = newNarrative.replace(
        new RegExp(`\\$${origAmt.toLocaleString()}`, 'g'),
        `$${newAmt.toLocaleString()}`
      );
    }
  });

  return {
    ...base,
    id: `rand-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    companyName: randomCompany,
    date: dateStr,
    narrative: newNarrative,
    correctLines: scaledCorrectLines,
    accountAnalysis: scaledAnalysis,
    equationImpact: {
      ...base.equationImpact,
      assets: Math.round((base.equationImpact.assets * mult) / 50) * 50,
      liabilities: Math.round((base.equationImpact.liabilities * mult) / 50) * 50,
      equity: Math.round((base.equationImpact.equity * mult) / 50) * 50,
      explanation: base.equationImpact.explanation.replace(
        new RegExp(`\\$${(base.correctLines[0].debit || base.correctLines[0].credit).toLocaleString()}`, 'g'),
        `$${(scaledCorrectLines[0].debit || scaledCorrectLines[0].credit).toLocaleString()}`
      )
    }
  };
}
