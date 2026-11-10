import { AccountingScenario, AccountingTopic, PracticeDifficultyCategory } from '../types/accounting';
import { generateUniqueCanadianCompany } from './canadianCompanyGenerator';
import { CHART_OF_ACCOUNTS } from '../data/accounts';

// Helper functions for procedural generation
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step);
  return min + Math.floor(Math.random() * (steps + 1)) * step;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function getRandomDate(year = 2026): { dateStr: string; monthName: string; day: number; year: number } {
  const monthName = pickRandom(MONTHS);
  const day = getRandomInt(1, 28);
  const dayStr = day < 10 ? `0${day}` : `${day}`;
  return {
    dateStr: `${monthName.substring(0, 3)} ${dayStr}, ${year}`,
    monthName,
    day,
    year
  };
}

// ============================================================================
// 1. BEGINNER GENERATORS
// Extremely basic journal entries:
// - expenses paid with cash
// - purchases of assets with cash
// - cash received for sales or services
// Focus on fundamental debit/credit rules. Absolutely NO adjusting entries.
// Calculations are not revealed in initial prompt; inputs are provided.
// Hints & calculation details do NOT reveal account names or debit/credit selections.
// ============================================================================

function generateBeginnerExpensesPaidWithCash(companyName: string, dateStr: string): AccountingScenario {
  const expenseTypes = [
    {
      name: 'Office Rent',
      account: 'rent_expense',
      months: getRandomInt(2, 4, 1),
      rate: getRandomInt(1500, 3200, 100),
      payee: 'commercial realty landlord',
      desc: (months: number, rate: number) => `${months} months of office space rent at $${rate.toLocaleString()} per month`,
      calcTitle: 'Office Rent Expense Calculation',
      formula: 'Number of Months × Monthly Rent Rate'
    },
    {
      name: 'Employee Wages',
      account: 'salaries_expense',
      staff: getRandomInt(3, 6, 1),
      hours: 35,
      rate: getRandomInt(22, 35, 1),
      payee: 'office staff members',
      desc: (staff: number, rate: number) => `bi-weekly wages for ${staff} staff members who each worked 35 hours at $${rate} per hour`,
      calcTitle: 'Gross Salaries and Wages Calculation',
      formula: 'Number of Employees × Hours per Employee × Hourly Wage Rate'
    },
    {
      name: 'Digital Advertising Campaign',
      account: 'advertising_expense',
      placements: getRandomInt(2, 5, 1),
      rate: getRandomInt(450, 950, 50),
      payee: 'online marketing agency',
      desc: (placements: number, rate: number) => `${placements} regional digital advertising campaigns at $${rate.toLocaleString()} per campaign`,
      calcTitle: 'Advertising Campaign Cost Calculation',
      formula: 'Number of Ad Campaigns × Cost per Campaign'
    },
    {
      name: 'Facility Utilities',
      account: 'utilities_expense',
      base: getRandomInt(400, 700, 50),
      usage: getRandomInt(250, 650, 50),
      payee: 'local provincial utility provider',
      desc: (base: number, usage: number) => `electricity and heating utilities consisting of a $${base.toLocaleString()} standard service fee plus $${usage.toLocaleString()} metered usage charges`,
      calcTitle: 'Total Utilities Expense Calculation',
      formula: 'Base Service Fee + Metered Usage Charges'
    }
  ];

  const item = pickRandom(expenseTypes);
  let amount = 0;
  let narrativeDesc = '';
  let inputsList: { label: string; value: string }[] = [];
  let stepsList: string[] = [];

  if (item.name === 'Office Rent') {
    amount = item.months! * item.rate!;
    narrativeDesc = item.desc(item.months!, item.rate!);
    inputsList = [
      { label: 'Rental Period', value: `${item.months} months` },
      { label: 'Monthly Rent', value: `$${item.rate!.toLocaleString()}/month` }
    ];
    stepsList = [`Total Rent = ${item.months} months × $${item.rate!.toLocaleString()} = $${amount.toLocaleString()}`];
  } else if (item.name === 'Employee Wages') {
    const totalHours = item.staff! * item.hours!;
    amount = totalHours * item.rate!;
    narrativeDesc = item.desc(item.staff!, item.rate!);
    inputsList = [
      { label: 'Staff Count', value: `${item.staff} employees` },
      { label: 'Hours per Employee', value: `${item.hours} hours` },
      { label: 'Hourly Wage Rate', value: `$${item.rate}/hour` }
    ];
    stepsList = [
      `Total Hours = ${item.staff} employees × ${item.hours} hours = ${totalHours} hours`,
      `Total Wages = ${totalHours} hours × $${item.rate} = $${amount.toLocaleString()}`
    ];
  } else if (item.name === 'Digital Advertising Campaign') {
    amount = item.placements! * item.rate!;
    narrativeDesc = item.desc(item.placements!, item.rate!);
    inputsList = [
      { label: 'Ad Placements', value: `${item.placements} campaigns` },
      { label: 'Cost per Placement', value: `$${item.rate!.toLocaleString()}/campaign` }
    ];
    stepsList = [`Total Advertising = ${item.placements} × $${item.rate!.toLocaleString()} = $${amount.toLocaleString()}`];
  } else {
    amount = item.base! + item.usage!;
    narrativeDesc = item.desc(item.base!, item.usage!);
    inputsList = [
      { label: 'Base Service Fee', value: `$${item.base!.toLocaleString()}` },
      { label: 'Metered Usage Charge', value: `$${item.usage!.toLocaleString()}` }
    ];
    stepsList = [`Total Utilities = $${item.base!.toLocaleString()} + $${item.usage!.toLocaleString()} = $${amount.toLocaleString()}`];
  }

  return {
    id: `beg-exp-${Date.now()}-${getRandomInt(100, 999)}`,
    title: `${item.name} Paid in Cash`,
    companyName,
    date: dateStr,
    narrative: `${companyName} paid cash to the ${item.payee} for ${narrativeDesc} incurred during the current period. Record the transaction.`,
    topic: 'Operating Expenses',
    difficulty: 'Beginner',
    hints: [
      "Operating expenses reduce shareholders' equity, while paying cash reduces an economic asset.",
      "Recall the DEALER rules: Expenses and Assets increase with Debits and decrease with Credits.",
      "Calculate the total dollar amount using the transaction units provided."
    ],
    calculationDetail: {
      title: item.calcTitle,
      formula: item.formula,
      inputs: inputsList,
      steps: stepsList,
      calculatedAmount: `$${amount.toLocaleString()}`,
      explanation: `Multiply the transaction units to determine the total cash expenditure of $${amount.toLocaleString()}.`
    },
    correctLines: [
      { accountId: item.account, debit: amount, credit: 0 },
      { accountId: 'cash', debit: 0, credit: amount }
    ],
    explanation: `Under Canadian accounting standards, incurring an operational expense decreases shareholders' equity. Expenses have a normal debit balance, so ${item.account.replace(/_/g, ' ')} is debited for $${amount.toLocaleString()}. Paying cash decreases an asset, requiring a credit to Cash for $${amount.toLocaleString()}.`,
    accountAnalysis: [
      { accountId: item.account, action: 'Debit', amount, reason: "Expense increases on the Debit side (reducing shareholders' equity)." },
      { accountId: 'cash', action: 'Credit', amount, reason: 'Cash is an Asset. Paying out cash decreases assets on the Credit side.' }
    ],
    equationImpact: {
      assets: -amount,
      liabilities: 0,
      equity: -amount,
      explanation: `Assets decrease by $${amount.toLocaleString()} (Cash outflow) = Shareholders' Equity decreases by $${amount.toLocaleString()} (${item.name}).`
    }
  };
}

function generateBeginnerAssetPurchaseWithCash(companyName: string, dateStr: string): AccountingScenario {
  const assetTypes = [
    {
      name: 'Desktop Workstations',
      account: 'equipment',
      qty: getRandomInt(3, 8, 1),
      unitPrice: getRandomInt(1200, 2200, 100),
      desc: (qty: number, price: number) => `${qty} high-performance desktop workstations at a price of $${price.toLocaleString()} each`,
      calcTitle: 'Equipment Acquisition Cost Calculation',
      formula: 'Quantity Purchased × Unit Purchase Price'
    },
    {
      name: 'Office Supplies',
      account: 'supplies',
      qty: getRandomInt(12, 25, 1),
      unitPrice: getRandomInt(45, 80, 5),
      desc: (qty: number, price: number) => `${qty} cartons of premium printer toner and paper packs at $${price} per carton`,
      calcTitle: 'Supplies Acquisition Cost Calculation',
      formula: 'Cartons Purchased × Price per Carton'
    },
    {
      name: 'Commercial Land Parcel',
      account: 'land',
      lotA: getRandomInt(35000, 65000, 5000),
      lotB: getRandomInt(25000, 45000, 5000),
      desc: (a: number, b: number) => `a commercial land parcel consisting of Lot A ($${a.toLocaleString()}) and adjacent Lot B ($${b.toLocaleString()})`,
      calcTitle: 'Total Land Acquisition Cost Calculation',
      formula: 'Cost of Lot A + Cost of Lot B'
    },
    {
      name: 'Merchandise Inventory',
      account: 'inventory',
      qty: getRandomInt(50, 150, 10),
      unitPrice: getRandomInt(60, 140, 10),
      desc: (qty: number, price: number) => `${qty} packaged inventory units for resale at an acquisition cost of $${price} each`,
      calcTitle: 'Merchandise Inventory Cost Calculation',
      formula: 'Units Purchased × Cost per Unit'
    }
  ];

  const item = pickRandom(assetTypes);
  let amount = 0;
  let narrativeDesc = '';
  let inputsList: { label: string; value: string }[] = [];
  let stepsList: string[] = [];

  if (item.name === 'Commercial Land Parcel') {
    amount = item.lotA! + item.lotB!;
    narrativeDesc = item.desc(item.lotA!, item.lotB!);
    inputsList = [
      { label: 'Lot A Price', value: `$${item.lotA!.toLocaleString()}` },
      { label: 'Lot B Price', value: `$${item.lotB!.toLocaleString()}` }
    ];
    stepsList = [`Total Land Cost = $${item.lotA!.toLocaleString()} + $${item.lotB!.toLocaleString()} = $${amount.toLocaleString()}`];
  } else {
    amount = item.qty! * item.unitPrice!;
    narrativeDesc = item.desc(item.qty!, item.unitPrice!);
    inputsList = [
      { label: 'Quantity Purchased', value: `${item.qty} units` },
      { label: 'Unit Purchase Price', value: `$${item.unitPrice!.toLocaleString()}/unit` }
    ];
    stepsList = [`Total Cost = ${item.qty} units × $${item.unitPrice!.toLocaleString()} = $${amount.toLocaleString()}`];
  }

  return {
    id: `beg-asset-${Date.now()}-${getRandomInt(100, 999)}`,
    title: `Purchase of ${item.name} for Cash`,
    companyName,
    date: dateStr,
    narrative: `${companyName} purchased ${narrativeDesc} for operational use, paying the entire amount in cash. Record the transaction.`,
    topic: 'Supplies & Equipment',
    difficulty: 'Beginner',
    hints: [
      "This transaction represents an asset exchange where one productive asset is acquired in exchange for liquid cash.",
      "Apply the DEALER framework: Acquired assets increase with Debits, while surrendered assets decrease with Credits.",
      "Multiply the quantity by the unit price to determine the total acquisition cost."
    ],
    calculationDetail: {
      title: item.calcTitle,
      formula: item.formula,
      inputs: inputsList,
      steps: stepsList,
      calculatedAmount: `$${amount.toLocaleString()}`,
      explanation: `Compute the total acquisition cost: $${amount.toLocaleString()} based on unit price and quantity.`
    },
    correctLines: [
      { accountId: item.account, debit: amount, credit: 0 },
      { accountId: 'cash', debit: 0, credit: amount }
    ],
    explanation: `This transaction is an asset exchange. One asset (${item.name}) increases by $${amount.toLocaleString()} and is debited. Another asset (Cash) decreases by $${amount.toLocaleString()} and is credited. Total assets remain unchanged.`,
    accountAnalysis: [
      { accountId: item.account, action: 'Debit', amount, reason: `${item.name} is an Asset. Acquiring physical assets increases the account with a Debit.` },
      { accountId: 'cash', action: 'Credit', amount, reason: 'Cash is an Asset. Outflow of cash decreases the asset with a Credit.' }
    ],
    equationImpact: {
      assets: 0,
      liabilities: 0,
      equity: 0,
      explanation: `Asset exchange: +$${amount.toLocaleString()} ${item.name}, -$${amount.toLocaleString()} Cash. Net change in total assets is $0.`
    }
  };
}

function generateBeginnerCashReceivedForRevenue(companyName: string, dateStr: string): AccountingScenario {
  const revTypes = [
    {
      title: 'Cash Received for IT Consulting Services',
      account: 'service_revenue',
      units: getRandomInt(25, 60, 5),
      rate: getRandomInt(120, 180, 10),
      desc: (units: number, rate: number) => `completed ${units} hours of IT systems consulting for a client at a billing rate of $${rate} per hour, collecting the full payment in cash upon delivery`,
      calcTitle: 'Consulting Service Revenue Calculation',
      formula: 'Billed Hours × Hourly Billing Rate',
      unitLabel: 'hours'
    },
    {
      title: 'Cash Received for Architectural Drafting',
      account: 'service_revenue',
      units: getRandomInt(2, 6, 1),
      rate: getRandomInt(1400, 2400, 100),
      desc: (units: number, rate: number) => `delivered ${units} complete commercial architectural design sets at $${rate.toLocaleString()} per set, collecting the full payment in cash upon delivery`,
      calcTitle: 'Architectural Drafting Revenue Calculation',
      formula: 'Number of Design Sets × Price per Set',
      unitLabel: 'design sets'
    },
    {
      title: 'Cash Received for Merchandise Sales',
      account: 'sales_revenue',
      units: getRandomInt(30, 80, 5),
      rate: getRandomInt(50, 120, 10),
      desc: (units: number, rate: number) => `sold ${units} retail product units directly to walk-in customers at a selling price of $${rate} each, collecting the full payment in cash`,
      calcTitle: 'Merchandise Sales Revenue Calculation',
      formula: 'Units Sold × Selling Price per Unit',
      unitLabel: 'units'
    },
    {
      title: 'Founder Cash Investment for Common Shares',
      account: 'common_shares',
      units: getRandomInt(2000, 6000, 500),
      rate: getRandomInt(10, 25, 1),
      desc: (units: number, rate: number) => `issued ${units.toLocaleString()} common shares to founding shareholders in exchange for cash capital at an issue price of $${rate} per share`,
      calcTitle: 'Common Share Capital Proceeds Calculation',
      formula: 'Common Shares Issued × Price per Share',
      unitLabel: 'shares'
    }
  ];

  const item = pickRandom(revTypes);
  const amount = item.units * item.rate;

  return {
    id: `beg-rev-${Date.now()}-${getRandomInt(100, 999)}`,
    title: item.title,
    companyName,
    date: dateStr,
    narrative: `${companyName} ${item.desc(item.units, item.rate)}. Record the transaction.`,
    topic: item.account === 'common_shares' ? 'Investments & Capital' : 'Revenues & Receivables',
    difficulty: 'Beginner',
    hints: [
      "Cash received increases liquid company assets.",
      "Earning revenues or issuing equity increases shareholders' equity on the balance sheet.",
      "Multiply the units or hours delivered by the agreed rate to calculate the total cash proceeds."
    ],
    calculationDetail: {
      title: item.calcTitle,
      formula: item.formula,
      inputs: [
        { label: `Quantity (${item.unitLabel})`, value: `${item.units.toLocaleString()} ${item.unitLabel}` },
        { label: 'Unit Price / Rate', value: `$${item.rate.toLocaleString()}/${item.unitLabel.replace(/s$/, '')}` }
      ],
      steps: [`Total Cash Received = ${item.units.toLocaleString()} × $${item.rate.toLocaleString()} = $${amount.toLocaleString()}`],
      calculatedAmount: `$${amount.toLocaleString()}`,
      explanation: `Calculate the total proceeds received: ${item.units.toLocaleString()} × $${item.rate} = $${amount.toLocaleString()}.`
    },
    correctLines: [
      { accountId: 'cash', debit: amount, credit: 0 },
      { accountId: item.account, debit: 0, credit: amount }
    ],
    explanation: `When a business receives cash for earning revenue or issuing equity, Cash increases on the debit side ($${amount.toLocaleString()}), and ${item.account.replace(/_/g, ' ')} increases on the credit side ($${amount.toLocaleString()}).`,
    accountAnalysis: [
      { accountId: 'cash', action: 'Debit', amount, reason: 'Cash is an Asset. When cash is received, assets increase with a Debit.' },
      { accountId: item.account, action: 'Credit', amount, reason: `${item.account.replace(/_/g, ' ')} increases with a Credit, reflecting increased equity.` }
    ],
    equationImpact: {
      assets: amount,
      liabilities: 0,
      equity: amount,
      explanation: `Assets increase by $${amount.toLocaleString()} (Cash) = Shareholders' Equity increases by $${amount.toLocaleString()} (${item.account.replace(/_/g, ' ')}).`
    }
  };
}

// ============================================================================
// 2. INTRO ACCOUNTING GENERATORS
// Includes Beginner basic topics plus larger proportion of adjusting entries:
// - Accrued expenses (salaries, interest, utilities)
// - Accrued revenues (unbilled services, interest receivable)
// - Prepaid expenses (insurance expiration, supplies consumed, prepaid rent)
// - Unearned revenues (customer advances & revenue earned)
// - Depreciation (straight-line equipment & building with contra-asset)
// Calculations are not revealed in initial prompt; inputs are provided.
// Hints & calculation details do NOT reveal account names or debit/credit selections.
// ============================================================================

function generateIntroAdjustingAccruedExpense(companyName: string, dateStr: string): AccountingScenario {
  const isInterest = Math.random() < 0.5;

  if (isInterest) {
    const principal = getRandomInt(40000, 120000, 10000);
    const annualRatePct = pickRandom([6, 8, 9, 12]);
    const monthlyInterest = Math.round((principal * (annualRatePct / 100)) / 12);

    return {
      id: `intro-acc-int-${Date.now()}-${getRandomInt(100, 999)}`,
      title: 'Month-End Adjusting Entry: Accrued Interest on Bank Note',
      companyName,
      date: dateStr,
      narrative: `${companyName} holds an outstanding bank promissory note with a principal balance of $${principal.toLocaleString()} bearing interest at ${annualRatePct}% per annum. Interest is payable quarterly. Record the month-end adjusting entry for 1 month of accrued, unpaid interest.`,
      topic: 'Accruals & Deferrals',
      difficulty: 'Intro Accounting',
      hints: [
        "Under accrual accounting, borrowing costs accumulate over time even before cash interest is paid.",
        "An unpaid expense incurred during the period increases liabilities owed to lenders.",
        "Calculate 1 month of interest using: Principal × Annual Rate × (1 ÷ 12)."
      ],
      calculationDetail: {
        title: 'Monthly Accrued Interest Expense Calculation',
        formula: 'Principal × Annual Interest Rate × (Time / 12 Months)',
        inputs: [
          { label: 'Promissory Note Principal', value: `$${principal.toLocaleString()}` },
          { label: 'Annual Interest Rate', value: `${annualRatePct}%` },
          { label: 'Time Fraction', value: '1 month (1/12 of a year)' }
        ],
        steps: [
          `Annual Interest = $${principal.toLocaleString()} × ${annualRatePct}% = $${((principal * annualRatePct) / 100).toLocaleString()}`,
          `1 Month Accrued Interest = $${((principal * annualRatePct) / 100).toLocaleString()} ÷ 12 = $${monthlyInterest.toLocaleString()}`
        ],
        calculatedAmount: `$${monthlyInterest.toLocaleString()}`,
        explanation: `Prorate the annual interest for one month: $${principal.toLocaleString()} × ${annualRatePct}% ÷ 12 = $${monthlyInterest.toLocaleString()}.`
      },
      correctLines: [
        { accountId: 'interest_expense', debit: monthlyInterest, credit: 0 },
        { accountId: 'interest_payable', debit: 0, credit: monthlyInterest }
      ],
      explanation: `Under accrual accounting (ASPE / IFRS), interest incurred during the month must be matched to the current period. Debit Interest Expense $${monthlyInterest.toLocaleString()} and credit Interest Payable $${monthlyInterest.toLocaleString()}.`,
      accountAnalysis: [
        { accountId: 'interest_expense', action: 'Debit', amount: monthlyInterest, reason: 'Interest Expense increases on the Debit side, reducing net income.' },
        { accountId: 'interest_payable', action: 'Credit', amount: monthlyInterest, reason: 'Interest Payable liability increases on the Credit side.' }
      ],
      equationImpact: {
        assets: 0,
        liabilities: monthlyInterest,
        equity: -monthlyInterest,
        explanation: `Liabilities increase by $${monthlyInterest.toLocaleString()} (Interest Payable) = Shareholders' Equity decreases by $${monthlyInterest.toLocaleString()} (Interest Expense).`
      }
    };
  } else {
    const staff = getRandomInt(4, 8, 1);
    const unpaidDays = getRandomInt(2, 4, 1);
    const dailyWage = getRandomInt(180, 240, 10);
    const totalAccruedWages = staff * unpaidDays * dailyWage;

    return {
      id: `intro-acc-wages-${Date.now()}-${getRandomInt(100, 999)}`,
      title: 'Month-End Adjusting Entry: Accrued Unpaid Salaries and Wages',
      companyName,
      date: dateStr,
      narrative: `At month-end, ${staff} office employees of ${companyName} have worked ${unpaidDays} days for which they have not yet been paid. Each employee earns $${dailyWage} per day. Payroll disbursements will be issued early next month. Record the month-end adjusting entry.`,
      topic: 'Accruals & Deferrals',
      difficulty: 'Intro Accounting',
      hints: [
        "Employees have performed services during the period, requiring the labour cost to be matched to current revenues.",
        "Unpaid labour creates a short-term liability owed to personnel at period-end.",
        "Calculate accrued wages by multiplying employee count, unpaid days worked, and daily rate."
      ],
      calculationDetail: {
        title: 'Accrued Salaries and Wages Calculation',
        formula: 'Number of Employees × Days Worked × Daily Wage Rate',
        inputs: [
          { label: 'Number of Employees', value: `${staff} staff members` },
          { label: 'Unpaid Days Worked', value: `${unpaidDays} days` },
          { label: 'Daily Wage Rate', value: `$${dailyWage}/day per employee` }
        ],
        steps: [
          `Total Employee-Days = ${staff} × ${unpaidDays} = ${staff * unpaidDays} days`,
          `Total Accrued Wages = ${staff * unpaidDays} days × $${dailyWage} = $${totalAccruedWages.toLocaleString()}`
        ],
        calculatedAmount: `$${totalAccruedWages.toLocaleString()}`,
        explanation: `Calculate total unpaid wages: ${staff} employees × ${unpaidDays} days × $${dailyWage} = $${totalAccruedWages.toLocaleString()}.`
      },
      correctLines: [
        { accountId: 'salaries_expense', debit: totalAccruedWages, credit: 0 },
        { accountId: 'salaries_payable', debit: 0, credit: totalAccruedWages }
      ],
      explanation: `Under the matching principle, expenses incurred to produce revenue must be recognized in the period the labour was performed. Debit Salaries Expense $${totalAccruedWages.toLocaleString()} and credit Salaries Payable $${totalAccruedWages.toLocaleString()}.`,
      accountAnalysis: [
        { accountId: 'salaries_expense', action: 'Debit', amount: totalAccruedWages, reason: 'Salaries Expense increases on the Debit side.' },
        { accountId: 'salaries_payable', action: 'Credit', amount: totalAccruedWages, reason: 'Salaries Payable liability increases on the Credit side.' }
      ],
      equationImpact: {
        assets: 0,
        liabilities: totalAccruedWages,
        equity: -totalAccruedWages,
        explanation: `Liabilities increase by $${totalAccruedWages.toLocaleString()} (Salaries Payable) = Shareholders' Equity decreases by $${totalAccruedWages.toLocaleString()} (Salaries Expense).`
      }
    };
  }
}

function generateIntroAdjustingPrepaidExpense(companyName: string, dateStr: string): AccountingScenario {
  const isInsurance = Math.random() < 0.5;

  if (isInsurance) {
    const monthly = getRandomInt(300, 750, 50);
    const months = 12;
    const totalPolicy = monthly * months;

    return {
      id: `intro-prepaid-ins-${Date.now()}-${getRandomInt(100, 999)}`,
      title: 'Month-End Adjusting Entry: Insurance Expense',
      companyName,
      date: dateStr,
      narrative: `${companyName} previously paid $${totalPolicy.toLocaleString()} for a 1-year (${months}-month) commercial insurance policy, debited to Prepaid Insurance. Record the month-end adjusting entry for 1 month of coverage expired.`,
      topic: 'Accruals & Deferrals',
      difficulty: 'Intro Accounting',
      hints: [
        "As time passes, a portion of the prepaid economic benefit expires and becomes an operational expense.",
        "The remaining unexpired insurance asset is reduced on the statement of financial position.",
        "Divide the total prepaid policy payment by the total term in months to calculate the monthly cost."
      ],
      calculationDetail: {
        title: 'Monthly Insurance Expense Calculation',
        formula: 'Total Prepaid Premium ÷ Policy Term in Months',
        inputs: [
          { label: 'Total 1-Year Policy Cost', value: `$${totalPolicy.toLocaleString()}` },
          { label: 'Policy Coverage Term', value: `${months} months` }
        ],
        steps: [`Monthly Expired Insurance = $${totalPolicy.toLocaleString()} ÷ ${months} = $${monthly.toLocaleString()}`],
        calculatedAmount: `$${monthly.toLocaleString()}`,
        explanation: `Divide the total policy premium by 12 months: $${totalPolicy.toLocaleString()} ÷ ${months} = $${monthly.toLocaleString()}.`
      },
      correctLines: [
        { accountId: 'insurance_expense', debit: monthly, credit: 0 },
        { accountId: 'prepaid_insurance', debit: 0, credit: monthly }
      ],
      explanation: `As time passes, prepaid benefits expire. Debit Insurance Expense $${monthly.toLocaleString()} and credit Prepaid Insurance $${monthly.toLocaleString()} to reduce the carrying value of the asset.`,
      accountAnalysis: [
        { accountId: 'insurance_expense', action: 'Debit', amount: monthly, reason: 'Expense increases with a Debit.' },
        { accountId: 'prepaid_insurance', action: 'Credit', amount: monthly, reason: 'Asset decreases with a Credit.' }
      ],
      equationImpact: {
        assets: -monthly,
        liabilities: 0,
        equity: -monthly,
        explanation: `Assets decrease by $${monthly.toLocaleString()} (Prepaid Insurance) = Shareholders' Equity decreases by $${monthly.toLocaleString()} (Insurance Expense).`
      }
    };
  } else {
    const beginning = getRandomInt(2500, 5500, 100);
    const endingCount = getRandomInt(700, 1500, 50);
    const consumed = beginning - endingCount;

    return {
      id: `intro-supplies-${Date.now()}-${getRandomInt(100, 999)}`,
      title: 'Month-End Adjusting Entry: Office Supplies Consumed',
      companyName,
      date: dateStr,
      narrative: `${companyName} had an unadjusted Office Supplies balance of $${beginning.toLocaleString()} on its trial balance. A physical count at month-end reveals $${endingCount.toLocaleString()} of supplies remaining on hand. Record the month-end adjusting entry for supplies consumed during the period.`,
      topic: 'Accruals & Deferrals',
      difficulty: 'Intro Accounting',
      hints: [
        "Supplies consumed during daily operations represent an expired asset that must be recognized as an expense.",
        "The supplies asset balance must be reduced to reflect the physical count on hand at month-end.",
        "Calculate supplies consumed by subtracting the physical count on hand from the unadjusted balance."
      ],
      calculationDetail: {
        title: 'Office Supplies Consumed Calculation',
        formula: 'Unadjusted Beginning Supplies Balance - Physical Ending Count on Hand',
        inputs: [
          { label: 'Unadjusted Trial Balance Supplies', value: `$${beginning.toLocaleString()}` },
          { label: 'Physical Count on Hand at Month-End', value: `$${endingCount.toLocaleString()}` }
        ],
        steps: [`Supplies Consumed = $${beginning.toLocaleString()} - $${endingCount.toLocaleString()} = $${consumed.toLocaleString()}`],
        calculatedAmount: `$${consumed.toLocaleString()}`,
        explanation: `Determine supplies consumed during the period: $${beginning.toLocaleString()} - $${endingCount.toLocaleString()} = $${consumed.toLocaleString()}.`
      },
      correctLines: [
        { accountId: 'supplies_expense', debit: consumed, credit: 0 },
        { accountId: 'supplies', debit: 0, credit: consumed }
      ],
      explanation: `Supplies used during the month represent an expired asset. Debit Supplies Expense $${consumed.toLocaleString()} and credit Office Supplies $${consumed.toLocaleString()}.`,
      accountAnalysis: [
        { accountId: 'supplies_expense', action: 'Debit', amount: consumed, reason: 'Supplies Expense increases on the Debit side.' },
        { accountId: 'supplies', action: 'Credit', amount: consumed, reason: 'Office Supplies asset decreases on the Credit side.' }
      ],
      equationImpact: {
        assets: -consumed,
        liabilities: 0,
        equity: -consumed,
        explanation: `Assets decrease by $${consumed.toLocaleString()} (Office Supplies) = Shareholders' Equity decreases by $${consumed.toLocaleString()} (Supplies Expense).`
      }
    };
  }
}

function generateIntroAdjustingDepreciation(companyName: string, dateStr: string): AccountingScenario {
  const cost = getRandomInt(24000, 72000, 6000);
  const salvage = getRandomInt(0, 4000, 1000);
  const years = pickRandom([4, 5]);
  const months = years * 12;
  const monthlyDep = Math.round((cost - salvage) / months);

  return {
    id: `intro-dep-${Date.now()}-${getRandomInt(100, 999)}`,
    title: 'Month-End Adjusting Entry: Equipment Depreciation',
    companyName,
    date: dateStr,
    narrative: `${companyName} acquired operating equipment costing $${cost.toLocaleString()} with an estimated salvage value of $${salvage.toLocaleString()} and a ${years}-year (${months}-month) useful life. Record the month-end adjusting entry for 1 month of straight-line depreciation.`,
    topic: 'Accruals & Deferrals',
    difficulty: 'Intro Accounting',
    hints: [
      "Depreciation allocates the depreciable cost of physical capital assets over their estimated useful lives.",
      "Under Canadian accounting standards, preserve historical cost by recording accumulated depreciation in a contra-asset account.",
      "Straight-line depreciation formula: (Acquisition Cost - Salvage Value) ÷ Useful Life in Months."
    ],
    calculationDetail: {
      title: 'Monthly Straight-Line Depreciation Calculation',
      formula: '(Historical Cost - Residual Salvage Value) ÷ Useful Life in Months',
      inputs: [
        { label: 'Equipment Cost', value: `$${cost.toLocaleString()}` },
        { label: 'Residual Salvage Value', value: `$${salvage.toLocaleString()}` },
        { label: 'Useful Life', value: `${months} months (${years} years)` }
      ],
      steps: [
        `Depreciable Base = $${cost.toLocaleString()} - $${salvage.toLocaleString()} = $${(cost - salvage).toLocaleString()}`,
        `Monthly Depreciation = $${(cost - salvage).toLocaleString()} ÷ ${months} months = $${monthlyDep.toLocaleString()}`
      ],
      calculatedAmount: `$${monthlyDep.toLocaleString()}`,
      explanation: `Compute monthly depreciation: ($${cost.toLocaleString()} - $${salvage.toLocaleString()}) ÷ ${months} = $${monthlyDep.toLocaleString()}.`
    },
    correctLines: [
      { accountId: 'depreciation_expense', debit: monthlyDep, credit: 0 },
      { accountId: 'accumulated_depreciation_equipment', debit: 0, credit: monthlyDep }
    ],
    explanation: `Straight-line depreciation systematically allocates asset cost. Debit Depreciation Expense $${monthlyDep.toLocaleString()} to recognize operating expense in profit or loss. Credit Accumulated Depreciation - Equipment $${monthlyDep.toLocaleString()} (contra-asset) to reduce book value while preserving historical cost on the balance sheet.`,
    accountAnalysis: [
      { accountId: 'depreciation_expense', action: 'Debit', amount: monthlyDep, reason: 'Depreciation Expense increases on the Debit side.' },
      { accountId: 'accumulated_depreciation_equipment', action: 'Credit', amount: monthlyDep, reason: 'Contra-asset Accumulated Depreciation increases on the Credit side.' }
    ],
    equationImpact: {
      assets: -monthlyDep,
      liabilities: 0,
      equity: -monthlyDep,
      explanation: `Assets decrease by $${monthlyDep.toLocaleString()} (via contra-asset Accumulated Depreciation) = Shareholders' Equity decreases by $${monthlyDep.toLocaleString()} (Depreciation Expense).`
    }
  };
}

function generateIntroAdjustingUnearnedRevenue(companyName: string, dateStr: string): AccountingScenario {
  const isReceipt = Math.random() < 0.5;

  if (isReceipt) {
    const hours = getRandomInt(20, 60, 5);
    const ratePerHour = getRandomInt(120, 180, 10);
    const retainer = hours * ratePerHour;

    return {
      id: `intro-unearned-rec-${Date.now()}-${getRandomInt(100, 999)}`,
      title: 'Cash Advance Received from Client (Unearned Revenue)',
      companyName,
      date: dateStr,
      narrative: `${companyName} received a cash advance retainer deposit from a corporate client for ${hours} hours of scheduled IT advisory services at a contracted rate of $${ratePerHour} per hour. The services will be delivered over the next 60 days. Record the cash receipt.`,
      topic: 'Accruals & Deferrals',
      difficulty: 'Intro Accounting',
      hints: [
        "Collecting cash in advance of performing services creates an obligation to deliver services in the future.",
        "Revenues cannot be recognized until performance obligations are satisfied.",
        "Multiply contracted hours by the hourly rate to determine the advance cash receipt."
      ],
      calculationDetail: {
        title: 'Customer Retainer Deposit Calculation',
        formula: 'Contracted Service Hours × Hourly Billing Rate',
        inputs: [
          { label: 'Contracted Hours', value: `${hours} hours` },
          { label: 'Hourly Rate', value: `$${ratePerHour}/hour` }
        ],
        steps: [`Total Cash Deposit = ${hours} hours × $${ratePerHour} = $${retainer.toLocaleString()}`],
        calculatedAmount: `$${retainer.toLocaleString()}`,
        explanation: `Calculate total advance received: ${hours} hours × $${ratePerHour} = $${retainer.toLocaleString()}.`
      },
      correctLines: [
        { accountId: 'cash', debit: retainer, credit: 0 },
        { accountId: 'unearned_service_revenue', debit: 0, credit: retainer }
      ],
      explanation: `Under the revenue recognition principle, revenue is only recognized when performance obligations are satisfied. Receiving cash in advance creates an obligation to perform services, recorded as a liability in Unearned Service Revenue.`,
      accountAnalysis: [
        { accountId: 'cash', action: 'Debit', amount: retainer, reason: 'Cash increases with a Debit.' },
        { accountId: 'unearned_service_revenue', action: 'Credit', amount: retainer, reason: 'Unearned Service Revenue liability increases with a Credit.' }
      ],
      equationImpact: {
        assets: retainer,
        liabilities: retainer,
        equity: 0,
        explanation: `Assets increase by $${retainer.toLocaleString()} (Cash) = Liabilities increase by $${retainer.toLocaleString()} (Unearned Service Revenue). Equity is unchanged.`
      }
    };
  } else {
    const totalHours = 40;
    const hourlyRate = getRandomInt(120, 180, 10);
    const retainer = totalHours * hourlyRate;
    const completedHours = getRandomInt(10, 28, 2);
    const earned = completedHours * hourlyRate;

    return {
      id: `intro-unearned-adj-${Date.now()}-${getRandomInt(100, 999)}`,
      title: 'Month-End Adjusting Entry: Unearned Revenue Earned',
      companyName,
      date: dateStr,
      narrative: `${companyName} had an unadjusted balance of $${retainer.toLocaleString()} in Unearned Service Revenue from client deposits for a ${totalHours}-hour contracted project ($${hourlyRate}/hour). By month-end, the company completed ${completedHours} hours of the contracted services. Record the month-end adjusting entry.`,
      topic: 'Accruals & Deferrals',
      difficulty: 'Intro Accounting',
      hints: [
        "As contracted services are completed, the performance obligation liability is reduced and revenue is recognized.",
        "Determine the earned portion based on hours delivered during the month.",
        "Multiply hours completed by the hourly contract rate."
      ],
      calculationDetail: {
        title: 'Earned Service Revenue Calculation',
        formula: 'Hours Completed × Contracted Hourly Rate',
        inputs: [
          { label: 'Hours Completed', value: `${completedHours} hours` },
          { label: 'Contracted Hourly Rate', value: `$${hourlyRate}/hour` },
          { label: 'Total Initial Retainer', value: `$${retainer.toLocaleString()} (${totalHours} hours)` }
        ],
        steps: [`Earned Revenue = ${completedHours} hours × $${hourlyRate} = $${earned.toLocaleString()}`],
        calculatedAmount: `$${earned.toLocaleString()}`,
        explanation: `Calculate earned revenue: ${completedHours} hours × $${hourlyRate} = $${earned.toLocaleString()}.`
      },
      correctLines: [
        { accountId: 'unearned_service_revenue', debit: earned, credit: 0 },
        { accountId: 'service_revenue', debit: 0, credit: earned }
      ],
      explanation: `As services are completed, the liability to perform is fulfilled and revenue is recognized. Debit Unearned Service Revenue $${earned.toLocaleString()} (decreasing liabilities) and credit Service Revenue $${earned.toLocaleString()} (increasing revenue and equity).`,
      accountAnalysis: [
        { accountId: 'unearned_service_revenue', action: 'Debit', amount: earned, reason: 'Liability decreases with a Debit.' },
        { accountId: 'service_revenue', action: 'Credit', amount: earned, reason: 'Service Revenue increases with a Credit.' }
      ],
      equationImpact: {
        assets: 0,
        liabilities: -earned,
        equity: earned,
        explanation: `Liabilities decrease by $${earned.toLocaleString()} (Unearned Service Revenue) = Shareholders' Equity increases by $${earned.toLocaleString()} (Service Revenue). Assets are unchanged.`
      }
    };
  }
}

// ============================================================================
// 3. INTERMEDIATE ACCOUNTING 1 GENERATORS
// Topics:
// - Inventory adjustments using lower of cost and net realizable value (LCNRV)
// - Discontinued operations
// - Other comprehensive income (OCI)
// - IFRS revenue recognition
// - Warranties and variable consideration
// - Percentage-of-completion and completed-contract accounting
// - Sales with discounts (e.g., 2/10, n/30)
// - Bad debts and allowance for expected credit losses
// - Equity method and cost model investments
// - Revaluation model versus cost model for equipment
// - Straight-line, diminishing-balance, and units-of-production depreciation methods
// - Impairment
// Calculations are not revealed in initial prompt; inputs are provided.
// Hints & calculation details do NOT reveal account names or debit/credit selections.
// ============================================================================

function generateLcnrvInventoryAdjustment(companyName: string, dateStr: string): AccountingScenario {
  const cost = getRandomInt(45000, 90000, 5000);
  const writeDown = getRandomInt(4000, 12000, 500);
  const nrv = cost - writeDown;
  const sellingCosts = getRandomInt(1500, 3500, 500);
  const estSellingPrice = nrv + sellingCosts;

  return {
    id: `int1-lcnrv-${Date.now()}-${getRandomInt(100, 999)}`,
    title: 'Year-End Inventory Valuation: Lower of Cost and Net Realizable Value (LCNRV)',
    companyName,
    date: dateStr,
    narrative: `At year-end, ${companyName} holds ending inventory with an original cost of $${cost.toLocaleString()}. Due to market price declines, management estimates the future selling price of this inventory at $${estSellingPrice.toLocaleString()} and estimated disposal/selling costs at $${sellingCosts.toLocaleString()}. Under IAS 2 / ASPE 3031, determine the Net Realizable Value (NRV) and record the required inventory write-down, if any.`,
    topic: 'Inventories & LCNRV',
    difficulty: 'Intermediate Accounting 1',
    hints: [
      "Under IAS 2 and ASPE 3031, inventories must be measured at the lower of cost and net realizable value (LCNRV).",
      "Net Realizable Value (NRV) equals estimated selling price minus estimated costs of completion and disposal.",
      "If NRV is below cost, an inventory write-down loss must be recognized to reduce the carrying amount."
    ],
    calculationDetail: {
      title: 'Lower of Cost and Net Realizable Value (LCNRV) Calculation',
      formula: 'NRV = Estimated Selling Price - Estimated Disposal Costs; Write-Down = Cost - NRV',
      inputs: [
        { label: 'Original Inventory Cost', value: `$${cost.toLocaleString()}` },
        { label: 'Estimated Selling Price', value: `$${estSellingPrice.toLocaleString()}` },
        { label: 'Estimated Selling/Disposal Costs', value: `$${sellingCosts.toLocaleString()}` }
      ],
      steps: [
        `Net Realizable Value (NRV) = $${estSellingPrice.toLocaleString()} - $${sellingCosts.toLocaleString()} = $${nrv.toLocaleString()}`,
        `LCNRV Test: NRV ($${nrv.toLocaleString()}) is lower than Cost ($${cost.toLocaleString()})`,
        `Required Write-Down = $${cost.toLocaleString()} - $${nrv.toLocaleString()} = $${writeDown.toLocaleString()}`
      ],
      calculatedAmount: `$${writeDown.toLocaleString()}`,
      explanation: `Calculate NRV = $${estSellingPrice.toLocaleString()} - $${sellingCosts.toLocaleString()} = $${nrv.toLocaleString()}. Since NRV is below cost, the required write-down is $${writeDown.toLocaleString()}.`
    },
    correctLines: [
      { accountId: 'loss_on_inventory_writedown', debit: writeDown, credit: 0 },
      { accountId: 'inventory', debit: 0, credit: writeDown }
    ],
    explanation: `Under IAS 2 and ASPE 3031, inventories must be measured at the lower of cost and net realizable value (LCNRV). When NRV is lower than cost, a write-down of $${writeDown.toLocaleString()} is required. Debit Loss on Inventory Write-Down (or COGS) $${writeDown.toLocaleString()} in profit or loss, and credit Merchandise Inventory $${writeDown.toLocaleString()} to reduce the balance sheet carrying value.`,
    accountAnalysis: [
      { accountId: 'loss_on_inventory_writedown', action: 'Debit', amount: writeDown, reason: 'Operating Loss/Expense increases on the Debit side.' },
      { accountId: 'inventory', action: 'Credit', amount: writeDown, reason: 'Inventory asset decreases on the Credit side.' }
    ],
    equationImpact: {
      assets: -writeDown,
      liabilities: 0,
      equity: -writeDown,
      explanation: `Assets decrease by $${writeDown.toLocaleString()} (Merchandise Inventory) = Shareholders' Equity decreases by $${writeDown.toLocaleString()} (Loss on Inventory Write-Down).`
    }
  };
}

function generateDiscontinuedOperations(companyName: string, dateStr: string): AccountingScenario {
  const originalCost = getRandomInt(80000, 160000, 10000);
  const accDep = getRandomInt(30000, 60000, 5000);
  const bookValue = originalCost - accDep;
  const proceeds = getRandomInt(Math.round(bookValue * 0.6), Math.round(bookValue * 0.85), 2000);
  const loss = bookValue - proceeds;

  return {
    id: `int1-disc-ops-${Date.now()}-${getRandomInt(100, 999)}`,
    title: 'Disposal of Equipment in Discontinued Operations (IFRS 5)',
    companyName,
    date: dateStr,
    narrative: `${companyName} formally approved the abandonment and sale of its manufacturing division, qualifying as a discontinued operation under IFRS 5. The division's operating equipment had a historical cost of $${originalCost.toLocaleString()} and accumulated depreciation of $${accDep.toLocaleString()}. The equipment was sold for $${proceeds.toLocaleString()} cash. Record the asset disposal and resulting loss on discontinued operations.`,
    topic: 'Discontinued Operations',
    difficulty: 'Intermediate Accounting 1',
    hints: [
      "Under IFRS 5, disposing of an abandoned component requires derecognizing the asset and its accumulated depreciation.",
      "Compare the carrying book value against cash proceeds to calculate the pre-tax gain or loss on discontinued operations.",
      "Calculate carrying book value by subtracting accumulated depreciation from historical cost."
    ],
    calculationDetail: {
      title: 'Discontinued Operations Loss on Disposal Calculation',
      formula: 'Carrying Book Value = Historical Cost - Accumulated Depreciation; Loss = Carrying Book Value - Cash Proceeds',
      inputs: [
        { label: 'Equipment Historical Cost', value: `$${originalCost.toLocaleString()}` },
        { label: 'Accumulated Depreciation', value: `$${accDep.toLocaleString()}` },
        { label: 'Cash Proceeds Received', value: `$${proceeds.toLocaleString()}` }
      ],
      steps: [
        `Equipment Carrying Book Value = $${originalCost.toLocaleString()} - $${accDep.toLocaleString()} = $${bookValue.toLocaleString()}`,
        `Pre-Tax Loss on Discontinued Operations = $${bookValue.toLocaleString()} - $${proceeds.toLocaleString()} = $${loss.toLocaleString()}`
      ],
      calculatedAmount: `$${loss.toLocaleString()} Loss`,
      explanation: `Calculate book value: $${originalCost.toLocaleString()} - $${accDep.toLocaleString()} = $${bookValue.toLocaleString()}. Compare with $${proceeds.toLocaleString()} proceeds to determine the pre-tax loss of $${loss.toLocaleString()}.`
    },
    correctLines: [
      { accountId: 'cash', debit: proceeds, credit: 0 },
      { accountId: 'accumulated_depreciation_equipment', debit: accDep, credit: 0 },
      { accountId: 'loss_on_discontinued_operations', debit: loss, credit: 0 },
      { accountId: 'equipment', debit: 0, credit: originalCost }
    ],
    explanation: `Under IFRS 5 and IAS 16, disposing of a component's PP&E requires derecognizing the asset cost ($${originalCost.toLocaleString()}) and its accumulated depreciation ($${accDep.toLocaleString()}), recording the cash proceeds ($${proceeds.toLocaleString()}), and recognizing the pre-tax loss on discontinued operations ($${loss.toLocaleString()}).`,
    accountAnalysis: [
      { accountId: 'cash', action: 'Debit', amount: proceeds, reason: 'Cash asset increases by proceeds received.' },
      { accountId: 'accumulated_depreciation_equipment', action: 'Debit', amount: accDep, reason: 'Contra-asset removed with a Debit.' },
      { accountId: 'loss_on_discontinued_operations', action: 'Debit', amount: loss, reason: 'Loss on discontinued operations increases on the Debit side.' },
      { accountId: 'equipment', action: 'Credit', amount: originalCost, reason: 'Equipment cost derecognized with a Credit.' }
    ],
    equationImpact: {
      assets: proceeds - bookValue,
      liabilities: 0,
      equity: -loss,
      explanation: `Net assets decrease by $${loss.toLocaleString()} ($${proceeds.toLocaleString()} Cash - $${bookValue.toLocaleString()} Book Value) = Shareholders' Equity decreases by $${loss.toLocaleString()} (Loss on Discontinued Operations).`
    }
  };
}

function generateOciGainLoss(companyName: string, dateStr: string): AccountingScenario {
  const cost = getRandomInt(50000, 120000, 5000);
  const gain = getRandomInt(6000, 18000, 1000);
  const fairValue = cost + gain;

  return {
    id: `int1-oci-${Date.now()}-${getRandomInt(100, 999)}`,
    title: 'FVTOCI Equity Investment Fair Value Adjustment (IFRS 9 / OCI)',
    companyName,
    date: dateStr,
    narrative: `${companyName} holds an equity investment in publicly traded TSX shares designated at Fair Value Through Other Comprehensive Income (FVTOCI) under IFRS 9. The carrying value before year-end adjustment was $${cost.toLocaleString()}. At December 31, the market fair value was determined to be $${fairValue.toLocaleString()}. Record the year-end fair value adjustment under IFRS 9.`,
    topic: 'Other Comprehensive Income',
    difficulty: 'Intermediate Accounting 1',
    hints: [
      "Under IFRS 9, equity investments irrevocably designated at FVTOCI are remeasured to fair value at each reporting date.",
      "Unrealized fair value gains and losses on FVTOCI equity instruments bypass profit/loss and are recognized in Other Comprehensive Income (OCI).",
      "Calculate the adjustment by finding the difference between year-end fair value and prior carrying value."
    ],
    calculationDetail: {
      title: 'FVTOCI Fair Value Adjustment (OCI) Calculation',
      formula: 'Fair Value Adjustment = Ending Fair Market Value - Carrying Value Before Adjustment',
      inputs: [
        { label: 'Prior Carrying Amount', value: `$${cost.toLocaleString()}` },
        { label: 'Ending Market Fair Value', value: `$${fairValue.toLocaleString()}` }
      ],
      steps: [`Unrealized OCI Gain = $${fairValue.toLocaleString()} - $${cost.toLocaleString()} = $${gain.toLocaleString()}`],
      calculatedAmount: `$${gain.toLocaleString()}`,
      explanation: `Calculate the unrealized fair value gain: $${fairValue.toLocaleString()} - $${cost.toLocaleString()} = $${gain.toLocaleString()}.`
    },
    correctLines: [
      { accountId: 'investment_fvtoci', debit: gain, credit: 0 },
      { accountId: 'unrealized_gain_loss_oci', debit: 0, credit: gain }
    ],
    explanation: `Under IFRS 9, when an entity irrevocably designates an equity investment at FVTOCI, fair value gains and losses are recognized in Other Comprehensive Income (OCI) and accumulated in equity (AOCI), rather than in Net Income. Debit Investment at FVTOCI $${gain.toLocaleString()} and credit Unrealized Gain/Loss - OCI $${gain.toLocaleString()}.`,
    accountAnalysis: [
      { accountId: 'investment_fvtoci', action: 'Debit', amount: gain, reason: 'Asset value increases to fair value on the Debit side.' },
      { accountId: 'unrealized_gain_loss_oci', action: 'Credit', amount: gain, reason: 'Other Comprehensive Income gain increases Equity on the Credit side.' }
    ],
    equationImpact: {
      assets: gain,
      liabilities: 0,
      equity: gain,
      explanation: `Assets increase by $${gain.toLocaleString()} (Investment at FVTOCI) = Shareholders' Equity increases by $${gain.toLocaleString()} (AOCI / Unrealized Gain - OCI).`
    }
  };
}

function generateIfrs15Revenue(companyName: string, dateStr: string): AccountingScenario {
  const modules = getRandomInt(3, 8, 1);
  const ratePerModule = getRandomInt(4500, 8500, 500);
  const earnedAmt = modules * ratePerModule;

  return {
    id: `int1-ifrs15-${Date.now()}-${getRandomInt(100, 999)}`,
    title: 'IFRS 15 Performance Obligation Satisfied: Contract Asset Recognition',
    companyName,
    date: dateStr,
    narrative: `${companyName} entered into a multi-phase software integration contract governed by IFRS 15. The company satisfied its first performance obligation by delivering and installing ${modules} customized server modules valued at $${ratePerModule.toLocaleString()} each. Invoicing the client is conditional upon final user acceptance testing next month. Record the revenue earned and contract asset under IFRS 15.`,
    topic: 'IFRS Revenue Recognition',
    difficulty: 'Intermediate Accounting 1',
    hints: [
      "Under IFRS 15, when performance obligations are satisfied before an unconditional right to invoice arises, a contract asset is recognized.",
      "Revenue is recognized as performance obligations are transferred to the customer.",
      "Multiply delivered modules by the contract rate per module."
    ],
    calculationDetail: {
      title: 'IFRS 15 Contract Asset and Revenue Calculation',
      formula: 'Delivered Server Modules × Contracted Rate per Module',
      inputs: [
        { label: 'Completed Modules', value: `${modules} modules` },
        { label: 'Rate per Module', value: `$${ratePerModule.toLocaleString()}/module` }
      ],
      steps: [`Total Earned Revenue = ${modules} modules × $${ratePerModule.toLocaleString()} = $${earnedAmt.toLocaleString()}`],
      calculatedAmount: `$${earnedAmt.toLocaleString()}`,
      explanation: `Calculate total revenue and contract asset: ${modules} modules × $${ratePerModule.toLocaleString()} = $${earnedAmt.toLocaleString()}.`
    },
    correctLines: [
      { accountId: 'contract_asset', debit: earnedAmt, credit: 0 },
      { accountId: 'service_revenue', debit: 0, credit: earnedAmt }
    ],
    explanation: `Under IFRS 15.105, if an entity performs by transferring goods or services to a customer before the customer pays consideration or before payment is due, the entity shall present the contract as a Contract Asset (excluding any amounts presented as a receivable). Debit Contract Asset $${earnedAmt.toLocaleString()} and credit Service Revenue $${earnedAmt.toLocaleString()}.`,
    accountAnalysis: [
      { accountId: 'contract_asset', action: 'Debit', amount: earnedAmt, reason: 'Contract Asset represents conditional right to consideration (Debit).' },
      { accountId: 'service_revenue', action: 'Credit', amount: earnedAmt, reason: 'Service Revenue recognized upon satisfying performance obligation (Credit).' }
    ],
    equationImpact: {
      assets: earnedAmt,
      liabilities: 0,
      equity: earnedAmt,
      explanation: `Assets increase by $${earnedAmt.toLocaleString()} (Contract Asset) = Shareholders' Equity increases by $${earnedAmt.toLocaleString()} (Service Revenue).`
    }
  };
}

function generateWarrantyProvision(companyName: string, dateStr: string): AccountingScenario {
  const sales = getRandomInt(120000, 280000, 10000);
  const warrantyRate = pickRandom([0.02, 0.03, 0.04]);
  const provision = Math.round(sales * warrantyRate);

  return {
    id: `int1-warranty-${Date.now()}-${getRandomInt(100, 999)}`,
    title: 'Assurance-Type Warranty Provision Accrual (IAS 37 / IFRS 15)',
    companyName,
    date: dateStr,
    narrative: `During the fiscal period, ${companyName} made product sales of $${sales.toLocaleString()}. Management provides a 1-year assurance-type warranty on all sales and estimates historical warranty repair costs at ${(warrantyRate * 100).toFixed(0)}% of sales. Record the warranty expense provision under IAS 37 / IFRS 15.`,
    topic: 'Warranties & Provisions',
    difficulty: 'Intermediate Accounting 1',
    hints: [
      "Under IAS 37 and IFRS 15, assurance-type warranties require accruing estimated future repair costs in the period of sale.",
      "Estimate the warranty liability using historical repair cost percentages applied to current period sales.",
      "Multiply total product sales by the warranty rate percentage."
    ],
    calculationDetail: {
      title: 'Warranty Provision Calculation (IAS 37 / IFRS 15)',
      formula: 'Warranty Provision = Total Product Sales × Estimated Warranty Rate (%)',
      inputs: [
        { label: 'Total Product Sales', value: `$${sales.toLocaleString()}` },
        { label: 'Estimated Warranty Rate', value: `${(warrantyRate * 100).toFixed(0)}%` }
      ],
      steps: [`Warranty Expense Provision = $${sales.toLocaleString()} × ${(warrantyRate * 100).toFixed(0)}% = $${provision.toLocaleString()}`],
      calculatedAmount: `$${provision.toLocaleString()}`,
      explanation: `Calculate the estimated warranty obligation: $${sales.toLocaleString()} × ${(warrantyRate * 100).toFixed(0)}% = $${provision.toLocaleString()}.`
    },
    correctLines: [
      { accountId: 'warranty_expense', debit: provision, credit: 0 },
      { accountId: 'warranty_liability', debit: 0, credit: provision }
    ],
    explanation: `Under IAS 37 and IFRS 15, assurance-type warranties represent a liability for latent defects existing at the time of sale. Under the matching principle, the estimated warranty cost must be expensed in the period of sale: Debit Warranty Expense $${provision.toLocaleString()} and credit Warranty Liability $${provision.toLocaleString()}.`,
    accountAnalysis: [
      { accountId: 'warranty_expense', action: 'Debit', amount: provision, reason: 'Warranty Expense increases on the Debit side.' },
      { accountId: 'warranty_liability', action: 'Credit', amount: provision, reason: 'Warranty Liability provision increases on the Credit side.' }
    ],
    equationImpact: {
      assets: 0,
      liabilities: provision,
      equity: -provision,
      explanation: `Liabilities increase by $${provision.toLocaleString()} (Warranty Liability) = Shareholders' Equity decreases by $${provision.toLocaleString()} (Warranty Expense).`
    }
  };
}

function generatePercentageOfCompletion(companyName: string, dateStr: string): AccountingScenario {
  const totalContract = getRandomInt(180000, 300000, 20000);
  const estCosts = Math.round(totalContract * 0.75);
  const completionRate = pickRandom([0.30, 0.40, 0.50]);
  const cost = Math.round(estCosts * completionRate);
  const totalRev = Math.round(totalContract * completionRate);
  const profit = totalRev - cost;

  return {
    id: `int1-poc-${Date.now()}-${getRandomInt(100, 999)}`,
    title: 'Long-Term Construction: Recognition of Revenue and Gross Profit (IFRS 15)',
    companyName,
    date: dateStr,
    narrative: `${companyName} is constructing a commercial processing facility under a long-term contract of $${totalContract.toLocaleString()} that satisfies performance obligations over time under IFRS 15. Total estimated contract costs are $${estCosts.toLocaleString()}. During the current year, construction costs incurred were $${cost.toLocaleString()}. Record the entry to recognize revenue, cost, and gross profit in Construction in Progress.`,
    topic: 'Long-Term Contracts',
    difficulty: 'Intermediate Accounting 1',
    hints: [
      "Under IFRS 15 over-time recognition, degree of completion is measured by actual incurred costs divided by total estimated contract costs.",
      "Recognized revenue equals the total contract price multiplied by the percentage of completion.",
      "Recognized gross profit equals recognized revenue minus actual incurred contract costs."
    ],
    calculationDetail: {
      title: 'Percentage-of-Completion Calculations (IFRS 15)',
      formula: 'Completion % = Costs to Date ÷ Total Estimated Costs; Revenue = Total Contract × Completion %; Gross Profit = Revenue - Costs',
      inputs: [
        { label: 'Total Contract Price', value: `$${totalContract.toLocaleString()}` },
        { label: 'Total Estimated Costs', value: `$${estCosts.toLocaleString()}` },
        { label: 'Actual Costs Incurred This Period', value: `$${cost.toLocaleString()}` }
      ],
      steps: [
        `Degree of Completion = $${cost.toLocaleString()} ÷ $${estCosts.toLocaleString()} = ${(completionRate * 100).toFixed(1)}%`,
        `Recognized Construction Revenue = $${totalContract.toLocaleString()} × ${(completionRate * 100).toFixed(1)}% = $${totalRev.toLocaleString()}`,
        `Actual Construction Expense = $${cost.toLocaleString()}`,
        `Recognized Gross Profit (CIP) = $${totalRev.toLocaleString()} - $${cost.toLocaleString()} = $${profit.toLocaleString()}`
      ],
      calculatedAmount: `$${profit.toLocaleString()} Gross Profit / $${totalRev.toLocaleString()} Revenue`,
      explanation: `Calculate completion rate = ${(completionRate * 100).toFixed(0)}%, resulting in recognized revenue of $${totalRev.toLocaleString()} and recognized gross profit of $${profit.toLocaleString()}.`
    },
    correctLines: [
      { accountId: 'construction_in_progress', debit: profit, credit: 0 },
      { accountId: 'construction_expense', debit: cost, credit: 0 },
      { accountId: 'construction_revenue', debit: 0, credit: totalRev }
    ],
    explanation: `Under IFRS 15 over-time revenue recognition, the entity debits Construction in Progress for the recognized gross profit ($${profit.toLocaleString()}), debits Construction Expense for the actual incurred contract costs ($${cost.toLocaleString()}), and credits Construction Revenue for the sum ($${totalRev.toLocaleString()}).`,
    accountAnalysis: [
      { accountId: 'construction_in_progress', action: 'Debit', amount: profit, reason: 'Construction in Progress asset increases by recognized gross profit.' },
      { accountId: 'construction_expense', action: 'Debit', amount: cost, reason: 'Operating construction cost expensed on the Debit side.' },
      { accountId: 'construction_revenue', action: 'Credit', amount: totalRev, reason: 'Progress revenue recognized on the Credit side.' }
    ],
    equationImpact: {
      assets: profit,
      liabilities: 0,
      equity: profit,
      explanation: `Assets increase by $${profit.toLocaleString()} (Construction in Progress) = Shareholders' Equity increases by $${profit.toLocaleString()} (Net income: $${totalRev.toLocaleString()} Revenue - $${cost.toLocaleString()} Expense).`
    }
  };
}

function generateSalesDiscounts(companyName: string, dateStr: string): AccountingScenario {
  const invoice = getRandomInt(12000, 36000, 2000);
  const discountRate = 0.02; // 2/10, n/30
  const discount = Math.round(invoice * discountRate);
  const cashPaid = invoice - discount;

  return {
    id: `int1-discount-${Date.now()}-${getRandomInt(100, 999)}`,
    title: 'Customer Payment Within Cash Discount Period (2/10, n/30 - Gross Method)',
    companyName,
    date: dateStr,
    narrative: `${companyName} received payment from a credit customer for an outstanding $${invoice.toLocaleString()} invoice billed under credit terms 2/10, n/30 (gross method). The customer paid within the 10-day discount window and deducted the appropriate early payment discount. Record the cash collection.`,
    topic: 'Discounts & Receivables',
    difficulty: 'Intermediate Accounting 1',
    hints: [
      "Under credit terms 2/10, n/30 (gross method), customers taking advantage of prompt payment receive a 2% early cash discount.",
      "The discount is recognized as a contra-revenue adjustment against gross sales.",
      "Calculate the 2% discount on the gross invoice amount and subtract it to determine net cash received."
    ],
    calculationDetail: {
      title: 'Sales Cash Discount (2/10, n/30) Calculation',
      formula: 'Sales Discount = Gross Invoice Amount × Discount %; Cash Received = Gross Invoice - Sales Discount',
      inputs: [
        { label: 'Gross Invoice Amount', value: `$${invoice.toLocaleString()}` },
        { label: 'Discount Terms', value: '2/10, n/30 (2% early discount)' }
      ],
      steps: [
        `Cash Discount Amount = $${invoice.toLocaleString()} × 2% = $${discount.toLocaleString()}`,
        `Net Cash Collected = $${invoice.toLocaleString()} - $${discount.toLocaleString()} = $${cashPaid.toLocaleString()}`
      ],
      calculatedAmount: `$${discount.toLocaleString()} Discount / $${cashPaid.toLocaleString()} Cash`,
      explanation: `Calculate early settlement discount: $${invoice.toLocaleString()} × 2% = $${discount.toLocaleString()}, resulting in net cash proceeds of $${cashPaid.toLocaleString()}.`
    },
    correctLines: [
      { accountId: 'cash', debit: cashPaid, credit: 0 },
      { accountId: 'sales_discounts', debit: discount, credit: 0 },
      { accountId: 'accounts_receivable', debit: 0, credit: invoice }
    ],
    explanation: `Under the gross method of accounting for sales discounts, sales are originally recorded at full invoice price. When the customer takes advantage of the early settlement discount, the discount is recorded in the contra-revenue account Sales Discounts: Debit Cash $${cashPaid.toLocaleString()}, Debit Sales Discounts $${discount.toLocaleString()}, and Credit Accounts Receivable $${invoice.toLocaleString()}.`,
    accountAnalysis: [
      { accountId: 'cash', action: 'Debit', amount: cashPaid, reason: 'Cash asset increases by net cash received.' },
      { accountId: 'sales_discounts', action: 'Debit', amount: discount, reason: 'Contra-revenue increases on the Debit side (reducing net sales).' },
      { accountId: 'accounts_receivable', action: 'Credit', amount: invoice, reason: 'Accounts Receivable decreases to clear customer account balance.' }
    ],
    equationImpact: {
      assets: -discount,
      liabilities: 0,
      equity: -discount,
      explanation: `Total assets decrease by $${discount.toLocaleString()} (+$${cashPaid.toLocaleString()} Cash, -$${invoice.toLocaleString()} AR) = Shareholders' Equity decreases by $${discount.toLocaleString()} (Sales Discounts).`
    }
  };
}

function generateBadDebtsEcl(companyName: string, dateStr: string): AccountingScenario {
  const targetAllowance = getRandomInt(7500, 16000, 500);
  const unadjustedCredit = getRandomInt(2000, 5000, 250);
  const adjustment = targetAllowance - unadjustedCredit;

  return {
    id: `int1-bad-debt-${Date.now()}-${getRandomInt(100, 999)}`,
    title: 'Allowance for Expected Credit Losses: Year-End Aging Adjustment',
    companyName,
    date: dateStr,
    narrative: `At fiscal year-end, ${companyName} performed an aging analysis of accounts receivable under IFRS 9 / ASPE 3052 and determined a required ending Allowance for Doubtful Accounts balance of $${targetAllowance.toLocaleString()}. The unadjusted credit balance in the allowance account is currently $${unadjustedCredit.toLocaleString()}. Record the year-end bad debt adjusting entry.`,
    topic: 'Discounts & Receivables',
    difficulty: 'Intermediate Accounting 1',
    hints: [
      "Under the balance sheet aging approach (IFRS 9 / ASPE 3052), the allowance contra-asset is adjusted to a target ending balance.",
      "The current period bad debt expense represents the adjustment needed to reach the target allowance.",
      "Subtract the existing unadjusted credit balance from the required target ending allowance."
    ],
    calculationDetail: {
      title: 'Allowance for Doubtful Accounts Adjustment Calculation',
      formula: 'Bad Debt Expense Adjustment = Target Ending Allowance - Existing Unadjusted Credit Balance',
      inputs: [
        { label: 'Required Target Ending Allowance', value: `$${targetAllowance.toLocaleString()}` },
        { label: 'Existing Unadjusted Credit Balance', value: `$${unadjustedCredit.toLocaleString()}` }
      ],
      steps: [`Adjustment Amount = $${targetAllowance.toLocaleString()} - $${unadjustedCredit.toLocaleString()} = $${adjustment.toLocaleString()}`],
      calculatedAmount: `$${adjustment.toLocaleString()}`,
      explanation: `Compute the required adjustment: $${targetAllowance.toLocaleString()} target - $${unadjustedCredit.toLocaleString()} existing = $${adjustment.toLocaleString()}.`
    },
    correctLines: [
      { accountId: 'bad_debt_expense', debit: adjustment, credit: 0 },
      { accountId: 'allowance_doubtful_accounts', debit: 0, credit: adjustment }
    ],
    explanation: `Under the balance sheet aging approach, the objective is to bring the contra-asset Allowance for Doubtful Accounts to the target ending balance of $${targetAllowance.toLocaleString()}. With an existing credit balance of $${unadjustedCredit.toLocaleString()}, an adjustment of $${adjustment.toLocaleString()} is needed: Debit Bad Debt Expense $${adjustment.toLocaleString()} and credit Allowance for Doubtful Accounts $${adjustment.toLocaleString()}.`,
    accountAnalysis: [
      { accountId: 'bad_debt_expense', action: 'Debit', amount: adjustment, reason: 'Bad Debt Expense increases on the Debit side.' },
      { accountId: 'allowance_doubtful_accounts', action: 'Credit', amount: adjustment, reason: 'Contra-asset Allowance increases on the Credit side.' }
    ],
    equationImpact: {
      assets: -adjustment,
      liabilities: 0,
      equity: -adjustment,
      explanation: `Net assets decrease by $${adjustment.toLocaleString()} (via contra-asset Allowance) = Shareholders' Equity decreases by $${adjustment.toLocaleString()} (Bad Debt Expense).`
    }
  };
}

function generateEquityMethodInvestment(companyName: string, dateStr: string): AccountingScenario {
  const isIncome = Math.random() < 0.5;
  const associateNetIncome = getRandomInt(100000, 250000, 25000);
  const shareRate = 0.30;
  const shareAmount = Math.round(associateNetIncome * shareRate);

  if (isIncome) {
    return {
      id: `int1-eq-inc-${Date.now()}-${getRandomInt(100, 999)}`,
      title: 'Equity Method: Recognition of Share of Associate Net Income (IAS 28)',
      companyName,
      date: dateStr,
      narrative: `${companyName} holds a 30% voting equity interest with significant influence in an associate company, accounted for using the equity method under IAS 28. For the current fiscal year, the associate reported total net income of $${associateNetIncome.toLocaleString()}. Record ${companyName}'s proportionate share of the associate's net income.`,
      topic: 'Investments (Equity & Cost)',
      difficulty: 'Intermediate Accounting 1',
      hints: [
        "Under IAS 28, the equity method requires the investor to adjust the investment carrying amount for its share of associate net income.",
        "The investor recognizes its proportionate share of the associate's net income as investment earnings.",
        "Multiply associate net income by the investor's ownership percentage."
      ],
      calculationDetail: {
        title: 'Share of Associate Net Income Calculation (IAS 28)',
        formula: 'Investor Share of Earnings = Associate Net Income × Ownership %',
        inputs: [
          { label: 'Associate Total Net Income', value: `$${associateNetIncome.toLocaleString()}` },
          { label: 'Ownership Percentage', value: '30%' }
        ],
        steps: [`Investor Share = $${associateNetIncome.toLocaleString()} × 30% = $${shareAmount.toLocaleString()}`],
        calculatedAmount: `$${shareAmount.toLocaleString()}`,
        explanation: `Calculate 30% proportionate share of net income: $${associateNetIncome.toLocaleString()} × 30% = $${shareAmount.toLocaleString()}.`
      },
      correctLines: [
        { accountId: 'investment_in_associate', debit: shareAmount, credit: 0 },
        { accountId: 'investment_income', debit: 0, credit: shareAmount }
      ],
      explanation: `Under IAS 28, the equity method requires the investor to adjust the carrying amount of the investment upwards for its proportionate share of the investee's profit or loss: Debit Investment in Associate $${shareAmount.toLocaleString()} and credit Investment Income $${shareAmount.toLocaleString()}.`,
      accountAnalysis: [
        { accountId: 'investment_in_associate', action: 'Debit', amount: shareAmount, reason: 'Investment asset carrying value increases with a Debit.' },
        { accountId: 'investment_income', action: 'Credit', amount: shareAmount, reason: 'Investment Income increases equity with a Credit.' }
      ],
      equationImpact: {
        assets: shareAmount,
        liabilities: 0,
        equity: shareAmount,
        explanation: `Assets increase by $${shareAmount.toLocaleString()} (Investment in Associate) = Shareholders' Equity increases by $${shareAmount.toLocaleString()} (Investment Income).`
      }
    };
  } else {
    const divPaid = getRandomInt(40000, 100000, 10000);
    const divShare = Math.round(divPaid * shareRate);

    return {
      id: `int1-eq-div-${Date.now()}-${getRandomInt(100, 999)}`,
      title: 'Equity Method: Cash Dividend Received from Associate (IAS 28)',
      companyName,
      date: dateStr,
      narrative: `${companyName} holds a 30% significant influence equity investment in an associate. The associate declared and paid a total cash dividend of $${divPaid.toLocaleString()}. ${companyName} received its 30% share in cash. Record the receipt under the equity method.`,
      topic: 'Investments (Equity & Cost)',
      difficulty: 'Intermediate Accounting 1',
      hints: [
        "Under IAS 28, cash dividends received from an equity method associate represent a return of investment.",
        "Dividends reduce the carrying value of the investment asset rather than being recorded as revenue.",
        "Multiply the total dividend declared by the investor's ownership percentage."
      ],
      calculationDetail: {
        title: 'Equity Method Cash Dividend Received Calculation',
        formula: 'Dividend Proceeds = Total Associate Dividend × Ownership %',
        inputs: [
          { label: 'Total Associate Dividend Paid', value: `$${divPaid.toLocaleString()}` },
          { label: 'Ownership Percentage', value: '30%' }
        ],
        steps: [`Proportionate Cash Dividend = $${divPaid.toLocaleString()} × 30% = $${divShare.toLocaleString()}`],
        calculatedAmount: `$${divShare.toLocaleString()}`,
        explanation: `Calculate 30% dividend proceeds: $${divPaid.toLocaleString()} × 30% = $${divShare.toLocaleString()}.`
      },
      correctLines: [
        { accountId: 'cash', debit: divShare, credit: 0 },
        { accountId: 'investment_in_associate', debit: 0, credit: divShare }
      ],
      explanation: `Under IAS 28 paragraph 10, distributions received from an investee reduce the carrying amount of the investment. Because the investor already recognized its share of earnings when earned by the associate, treating dividends as income would improperly double-count revenue! Debit Cash $${divShare.toLocaleString()} and credit Investment in Associate $${divShare.toLocaleString()}.`,
      accountAnalysis: [
        { accountId: 'cash', action: 'Debit', amount: divShare, reason: 'Cash asset increases by dividend cash received.' },
        { accountId: 'investment_in_associate', action: 'Credit', amount: divShare, reason: 'Investment carrying value is reduced on the Credit side.' }
      ],
      equationImpact: {
        assets: 0,
        liabilities: 0,
        equity: 0,
        explanation: `Asset exchange: +$${divShare.toLocaleString()} Cash, -$${divShare.toLocaleString()} Investment in Associate. Net change in assets is $0; Equity is unchanged.`
      }
    };
  }
}

function generateRevaluationModel(companyName: string, dateStr: string): AccountingScenario {
  const cost = getRandomInt(60000, 120000, 10000);
  const revalGain = getRandomInt(10000, 25000, 2500);
  const fairValue = cost + revalGain;

  return {
    id: `int1-reval-${Date.now()}-${getRandomInt(100, 999)}`,
    title: 'IAS 16 Revaluation Model: Upward Revaluation of Equipment to Fair Value',
    companyName,
    date: dateStr,
    narrative: `${companyName} applies the revaluation model under IAS 16 for its specialized equipment class. The asset carrying value prior to revaluation is $${cost.toLocaleString()} (with zero accumulated depreciation following elimination). An independent certified appraisal determines the current fair market value is $${fairValue.toLocaleString()}. Record the upward revaluation under IAS 16.`,
    topic: 'Property, Plant & Revaluation',
    difficulty: 'Intermediate Accounting 1',
    hints: [
      "Under the IAS 16 revaluation model, PP&E is adjusted to appraised fair market value at the revaluation date.",
      "Initial upward revaluation gains are recognized in Other Comprehensive Income and accumulated in Revaluation Surplus.",
      "Subtract the carrying value before revaluation from the appraised fair market value."
    ],
    calculationDetail: {
      title: 'IAS 16 Upward Revaluation Surplus Calculation',
      formula: 'Revaluation Surplus = Appraised Fair Market Value - Carrying Value Prior to Revaluation',
      inputs: [
        { label: 'Prior Carrying Cost', value: `$${cost.toLocaleString()}` },
        { label: 'Appraised Fair Market Value', value: `$${fairValue.toLocaleString()}` }
      ],
      steps: [`Upward Revaluation Surplus = $${fairValue.toLocaleString()} - $${cost.toLocaleString()} = $${revalGain.toLocaleString()}`],
      calculatedAmount: `$${revalGain.toLocaleString()}`,
      explanation: `Calculate upward revaluation surplus: $${fairValue.toLocaleString()} - $${cost.toLocaleString()} = $${revalGain.toLocaleString()}.`
    },
    correctLines: [
      { accountId: 'equipment', debit: revalGain, credit: 0 },
      { accountId: 'revaluation_surplus', debit: 0, credit: revalGain }
    ],
    explanation: `Under IAS 16 paragraph 39, if an asset's carrying amount is increased as a result of a revaluation, the increase shall be recognized in Other Comprehensive Income and accumulated in equity under the heading of Revaluation Surplus. Debit Equipment $${revalGain.toLocaleString()} and credit Revaluation Surplus $${revalGain.toLocaleString()}.`,
    accountAnalysis: [
      { accountId: 'equipment', action: 'Debit', amount: revalGain, reason: 'Equipment asset increases to fair value on the Debit side.' },
      { accountId: 'revaluation_surplus', action: 'Credit', amount: revalGain, reason: 'Revaluation Surplus (OCI equity) increases on the Credit side.' }
    ],
    equationImpact: {
      assets: revalGain,
      liabilities: 0,
      equity: revalGain,
      explanation: `Assets increase by $${revalGain.toLocaleString()} (Equipment) = Shareholders' Equity increases by $${revalGain.toLocaleString()} (Revaluation Surplus).`
    }
  };
}

function generateImpairmentLoss(companyName: string, dateStr: string): AccountingScenario {
  const carryingValue = getRandomInt(80000, 150000, 10000);
  const fvLessCosts = getRandomInt(50000, carryingValue - 15000, 5000);
  const valueInUse = fvLessCosts + getRandomInt(2000, 6000, 1000);
  const recoverableAmount = Math.max(fvLessCosts, valueInUse); // higher of FVLCD and VIU
  const impairment = carryingValue - recoverableAmount;

  return {
    id: `int1-impair-${Date.now()}-${getRandomInt(100, 999)}`,
    title: 'IAS 36 Asset Impairment Test and Loss Recognition',
    companyName,
    date: dateStr,
    narrative: `${companyName} performed an impairment test under IAS 36 on a Cash-Generating Unit (CGU) with carrying value $${carryingValue.toLocaleString()}. Fair value less costs of disposal is $${fvLessCosts.toLocaleString()} and Value in Use (discounted future cash flows) is $${valueInUse.toLocaleString()}. Determine whether the asset is impaired and record any necessary impairment loss.`,
    topic: 'Depreciation & Impairment',
    difficulty: 'Intermediate Accounting 1',
    hints: [
      "Under IAS 36, Recoverable Amount is defined as the higher of Fair Value Less Costs of Disposal and Value in Use.",
      "An impairment loss is recognized when the carrying amount of a CGU exceeds its recoverable amount.",
      "Calculate recoverable amount first, then compute impairment loss as Carrying Amount minus Recoverable Amount."
    ],
    calculationDetail: {
      title: 'IAS 36 Recoverable Amount and Impairment Loss Calculation',
      formula: 'Recoverable Amount = Max(FVLCD, Value in Use); Impairment Loss = Carrying Value - Recoverable Amount',
      inputs: [
        { label: 'CGU Carrying Value', value: `$${carryingValue.toLocaleString()}` },
        { label: 'Fair Value Less Costs of Disposal (FVLCD)', value: `$${fvLessCosts.toLocaleString()}` },
        { label: 'Value in Use (Discounted Cash Flows)', value: `$${valueInUse.toLocaleString()}` }
      ],
      steps: [
        `Recoverable Amount = Max($${fvLessCosts.toLocaleString()}, $${valueInUse.toLocaleString()}) = $${recoverableAmount.toLocaleString()}`,
        `Impairment Loss = $${carryingValue.toLocaleString()} (Carrying Value) - $${recoverableAmount.toLocaleString()} (Recoverable Amount) = $${impairment.toLocaleString()}`
      ],
      calculatedAmount: `$${impairment.toLocaleString()}`,
      explanation: `Recoverable amount is the higher of FVLCD ($${fvLessCosts.toLocaleString()}) and VIU ($${valueInUse.toLocaleString()}) = $${recoverableAmount.toLocaleString()}, resulting in an impairment loss of $${impairment.toLocaleString()}.`
    },
    correctLines: [
      { accountId: 'loss_on_impairment', debit: impairment, credit: 0 },
      { accountId: 'accumulated_impairment_losses', debit: 0, credit: impairment }
    ],
    explanation: `Under IAS 36 paragraph 59, if the recoverable amount of an asset is less than its carrying amount, the carrying amount of the asset shall be reduced to its recoverable amount. That reduction is an impairment loss recognized immediately in profit or loss: Debit Loss on Impairment $${impairment.toLocaleString()} and credit Accumulated Impairment Losses $${impairment.toLocaleString()}.`,
    accountAnalysis: [
      { accountId: 'loss_on_impairment', action: 'Debit', amount: impairment, reason: 'Impairment loss recognized in profit or loss on the Debit side.' },
      { accountId: 'accumulated_impairment_losses', action: 'Credit', amount: impairment, reason: 'Contra-asset Accumulated Impairment increases on the Credit side.' }
    ],
    equationImpact: {
      assets: -impairment,
      liabilities: 0,
      equity: -impairment,
      explanation: `Net assets decrease by $${impairment.toLocaleString()} (Accumulated Impairment Losses) = Shareholders' Equity decreases by $${impairment.toLocaleString()} (Loss on Impairment).`
    }
  };
}

function generateDiminishingBalanceAndUnitsDepreciation(companyName: string, dateStr: string): AccountingScenario {
  const isDDB = Math.random() < 0.5;

  if (isDDB) {
    const cost = getRandomInt(40000, 100000, 10000);
    const lifeYears = pickRandom([4, 5, 10]);
    const ddbRate = 2 / lifeYears;
    const year1Dep = Math.round(cost * ddbRate);

    return {
      id: `int1-dep-ddb-${Date.now()}-${getRandomInt(100, 999)}`,
      title: 'Diminishing-Balance (Double-Declining Balance) Depreciation',
      companyName,
      date: dateStr,
      narrative: `${companyName} acquired heavy operating equipment costing $${cost.toLocaleString()} with an estimated useful life of ${lifeYears} years and a residual salvage value of $${Math.round(cost * 0.1).toLocaleString()}. Management adopts the diminishing-balance (double-declining balance) method under IAS 16. Record Year 1 depreciation expense.`,
      topic: 'Depreciation & Impairment',
      difficulty: 'Intermediate Accounting 1',
      hints: [
        "Under the double-declining balance method (IAS 16 / ASPE 3061), an accelerated rate (2 ÷ Useful Life) is applied to beginning carrying value.",
        "Residual salvage value is ignored when computing the depreciable base for Year 1.",
        "Calculate the double-declining rate and multiply it by historical asset cost."
      ],
      calculationDetail: {
        title: 'Double-Declining Balance (DDB) Year 1 Depreciation Calculation',
        formula: 'Straight-Line Rate = 100% ÷ Useful Life; DDB Rate = 2 × Straight-Line Rate; Year 1 Dep = Cost × DDB Rate',
        inputs: [
          { label: 'Equipment Historical Cost', value: `$${cost.toLocaleString()}` },
          { label: 'Useful Life', value: `${lifeYears} years` },
          { label: 'Residual Salvage Value (ignored in Year 1 base)', value: `$${Math.round(cost * 0.1).toLocaleString()}` }
        ],
        steps: [
          `Straight-Line Rate = 100% ÷ ${lifeYears} years = ${(100 / lifeYears).toFixed(0)}%`,
          `Double-Declining Rate = 2 × ${(100 / lifeYears).toFixed(0)}% = ${(ddbRate * 100).toFixed(0)}%`,
          `Year 1 Depreciation = $${cost.toLocaleString()} × ${(ddbRate * 100).toFixed(0)}% = $${year1Dep.toLocaleString()}`
        ],
        calculatedAmount: `$${year1Dep.toLocaleString()}`,
        explanation: `Calculate DDB rate = 2 ÷ ${lifeYears} = ${(ddbRate * 100).toFixed(0)}%, giving Year 1 depreciation of $${cost.toLocaleString()} × ${(ddbRate * 100).toFixed(0)}% = $${year1Dep.toLocaleString()}.`
      },
      correctLines: [
        { accountId: 'depreciation_expense', debit: year1Dep, credit: 0 },
        { accountId: 'accumulated_depreciation_equipment', debit: 0, credit: year1Dep }
      ],
      explanation: `Under the diminishing-balance method (IAS 16 / ASPE 3061), an accelerated depreciation rate is applied to the carrying amount of the asset. Under double-declining balance, the rate is 2 / Life = ${(ddbRate * 100).toFixed(0)}%. Salvage value is ignored when computing the Year 1 base. Debit Depreciation Expense $${year1Dep.toLocaleString()} and credit Accumulated Depreciation - Equipment $${year1Dep.toLocaleString()}.`,
      accountAnalysis: [
        { accountId: 'depreciation_expense', action: 'Debit', amount: year1Dep, reason: 'Depreciation Expense increases on the Debit side.' },
        { accountId: 'accumulated_depreciation_equipment', action: 'Credit', amount: year1Dep, reason: 'Contra-asset Accumulated Depreciation increases on the Credit side.' }
      ],
      equationImpact: {
        assets: -year1Dep,
        liabilities: 0,
        equity: -year1Dep,
        explanation: `Assets decrease by $${year1Dep.toLocaleString()} (Accumulated Depreciation) = Shareholders' Equity decreases by $${year1Dep.toLocaleString()} (Depreciation Expense).`
      }
    };
  } else {
    const cost = getRandomInt(60000, 150000, 10000);
    const salvage = getRandomInt(5000, 15000, 5000);
    const totalLifetimeUnits = getRandomInt(200000, 500000, 50000);
    const ratePerUnit = (cost - salvage) / totalLifetimeUnits;
    const unitsThisPeriod = getRandomInt(20000, 50000, 5000);
    const depAmount = Math.round(unitsThisPeriod * ratePerUnit);

    return {
      id: `int1-dep-units-${Date.now()}-${getRandomInt(100, 999)}`,
      title: 'Units-of-Production Depreciation Method (IAS 16 / ASPE 3061)',
      companyName,
      date: dateStr,
      narrative: `${companyName} purchased industrial machinery costing $${cost.toLocaleString()} with an estimated residual salvage value of $${salvage.toLocaleString()} and an expected total lifetime production capacity of ${totalLifetimeUnits.toLocaleString()} units. During the current period, the machine produced ${unitsThisPeriod.toLocaleString()} units. Record depreciation expense for the period under the units-of-production method (IAS 16 / ASPE 3061).`,
      topic: 'Depreciation & Impairment',
      difficulty: 'Intermediate Accounting 1',
      hints: [
        "Under the units-of-production method, depreciation is based on actual asset usage rather than time elapsed.",
        "Compute the per-unit rate as (Cost - Salvage Value) ÷ Total Lifetime Units.",
        "Multiply the per-unit rate by actual units produced during the period."
      ],
      calculationDetail: {
        title: 'Units-of-Production Depreciation Calculation',
        formula: 'Rate per Unit = (Cost - Salvage Value) ÷ Lifetime Output; Period Dep = Units Produced × Rate',
        inputs: [
          { label: 'Machinery Cost', value: `$${cost.toLocaleString()}` },
          { label: 'Residual Salvage Value', value: `$${salvage.toLocaleString()}` },
          { label: 'Total Lifetime Output', value: `${totalLifetimeUnits.toLocaleString()} units` },
          { label: 'Units Produced This Period', value: `${unitsThisPeriod.toLocaleString()} units` }
        ],
        steps: [
          `Depreciable Base = $${cost.toLocaleString()} - $${salvage.toLocaleString()} = $${(cost - salvage).toLocaleString()}`,
          `Depreciation Rate per Unit = $${(cost - salvage).toLocaleString()} ÷ ${totalLifetimeUnits.toLocaleString()} units = $${ratePerUnit.toFixed(2)}/unit`,
          `Period Depreciation = ${unitsThisPeriod.toLocaleString()} units × $${ratePerUnit.toFixed(2)} = $${depAmount.toLocaleString()}`
        ],
        calculatedAmount: `$${depAmount.toLocaleString()}`,
        explanation: `Per-unit rate = ($${cost.toLocaleString()} - $${salvage.toLocaleString()}) ÷ ${totalLifetimeUnits.toLocaleString()} = $${ratePerUnit.toFixed(2)}/unit, giving period depreciation of $${depAmount.toLocaleString()}.`
      },
      correctLines: [
        { accountId: 'depreciation_expense', debit: depAmount, credit: 0 },
        { accountId: 'accumulated_depreciation_equipment', debit: 0, credit: depAmount }
      ],
      explanation: `Under the units-of-production method (IAS 16.60), depreciation is based on actual asset output rather than the mere passage of time: Rate = ($${cost.toLocaleString()} - $${salvage.toLocaleString()}) ÷ ${totalLifetimeUnits.toLocaleString()} = $${ratePerUnit.toFixed(2)}/unit. Period depreciation = ${unitsThisPeriod.toLocaleString()} units × $${ratePerUnit.toFixed(2)} = $${depAmount.toLocaleString()}. Debit Depreciation Expense $${depAmount.toLocaleString()} and credit Accumulated Depreciation - Equipment $${depAmount.toLocaleString()}.`,
      accountAnalysis: [
        { accountId: 'depreciation_expense', action: 'Debit', amount: depAmount, reason: 'Depreciation Expense increases on the Debit side.' },
        { accountId: 'accumulated_depreciation_equipment', action: 'Credit', amount: depAmount, reason: 'Contra-asset Accumulated Depreciation increases on the Credit side.' }
      ],
      equationImpact: {
        assets: -depAmount,
        liabilities: 0,
        equity: -depAmount,
        explanation: `Assets decrease by $${depAmount.toLocaleString()} (Accumulated Depreciation) = Shareholders' Equity decreases by $${depAmount.toLocaleString()} (Depreciation Expense).`
      }
    };
  }
}

// ============================================================================
// 4. INTERMEDIATE ACCOUNTING 2 GENERATORS
// Topics:
// - Asset retirement obligations (ARO / Decommissioning provisions)
// - Present value calculations for non-interest-bearing notes payable
// - Bond entries involving premiums and discounts (with PV calculations)
// - Equipment purchases involving cash and a note payable at present value
// - Stock dividends and liquidating dividends
// - Derivatives (forward contracts, swaps, gain/loss)
// - Deferred income taxes (temporary differences, DTA/DTL)
// - Pensions (defined benefit pension expense)
// - Leases (IFRS 16 ROU asset & lease liability)
// Calculations are not revealed in initial prompt; inputs are provided.
// Hints & calculation details do NOT reveal account names or debit/credit selections.
// ============================================================================

function generateAroInitialAndAccretion(companyName: string, dateStr: string): AccountingScenario {
  const isAccretion = Math.random() < 0.5;
  const futureCost = getRandomInt(60000, 150000, 10000);
  const discountRate = 0.06;
  const pvFactor = 0.55839; // 10 years at 6%
  const pv = Math.round(futureCost * pvFactor);
  const accretion = Math.round(pv * discountRate);

  if (!isAccretion) {
    return {
      id: `int2-aro-init-${Date.now()}-${getRandomInt(100, 999)}`,
      title: 'Asset Retirement Obligation (ARO) Initial Capitalization (IAS 37 / IAS 16)',
      companyName,
      date: dateStr,
      narrative: `${companyName} constructed an industrial extraction facility. Environmental regulations require the site to be restored at the end of its 10-year useful life at an estimated cost of $${futureCost.toLocaleString()}. The applicable market discount rate is 6% per annum (10-year present value factor at 6%: ${pvFactor.toFixed(5)}). Record the initial capitalization of the Asset Retirement Obligation under IAS 37 / IAS 16.`,
      topic: 'Asset Retirement Obligations',
      difficulty: 'Intermediate Accounting 2',
      hints: [
        "Under IAS 16.16(c) and IAS 37, the present value of future site restoration costs is capitalized into the asset cost.",
        "The corresponding obligation is recognized at present value as an Asset Retirement Obligation provision.",
        "Multiply the estimated future dismantling cost by the present value factor."
      ],
      calculationDetail: {
        title: 'Asset Retirement Obligation (ARO) Present Value Calculation',
        formula: 'Initial Capitalized ARO = Estimated Future Restoration Cost × Present Value Factor',
        inputs: [
          { label: 'Future Estimated Restoration Cost', value: `$${futureCost.toLocaleString()}` },
          { label: 'Discount Rate', value: '6% per annum' },
          { label: '10-Year PV Factor (at 6%)', value: `${pvFactor.toFixed(5)}` }
        ],
        steps: [`Present Value of ARO = $${futureCost.toLocaleString()} × ${pvFactor.toFixed(5)} = $${pv.toLocaleString()}`],
        calculatedAmount: `$${pv.toLocaleString()}`,
        explanation: `Discount the future restoration cost to present value: $${futureCost.toLocaleString()} × ${pvFactor.toFixed(5)} = $${pv.toLocaleString()}.`
      },
      correctLines: [
        { accountId: 'equipment', debit: pv, credit: 0 },
        { accountId: 'asset_retirement_obligation', debit: 0, credit: pv }
      ],
      explanation: `Under IAS 16.16(c) and IAS 37, the initial estimate of the costs of dismantling and removing the item and restoring the site on which it is located is included in the cost of the asset. Debit Equipment $${pv.toLocaleString()} and credit Asset Retirement Obligation $${pv.toLocaleString()}.`,
      accountAnalysis: [
        { accountId: 'equipment', action: 'Debit', amount: pv, reason: 'Equipment cost is capitalized to include present value of future restoration cost.' },
        { accountId: 'asset_retirement_obligation', action: 'Credit', amount: pv, reason: 'Long-term liability obligation increases on the Credit side.' }
      ],
      equationImpact: {
        assets: pv,
        liabilities: pv,
        equity: 0,
        explanation: `Assets increase by $${pv.toLocaleString()} (Equipment) = Liabilities increase by $${pv.toLocaleString()} (Asset Retirement Obligation). Equity is unchanged.`
      }
    };
  } else {
    return {
      id: `int2-aro-accretion-${Date.now()}-${getRandomInt(100, 999)}`,
      title: 'Asset Retirement Obligation: Annual Accretion Expense (IAS 37)',
      companyName,
      date: dateStr,
      narrative: `${companyName} carries an Asset Retirement Obligation with a beginning carrying value of $${pv.toLocaleString()}. The discount rate used is 6% per annum. Record the year-end accretion expense adjustment representing the unwinding of the discount under IAS 37.`,
      topic: 'Asset Retirement Obligations',
      difficulty: 'Intermediate Accounting 2',
      hints: [
        "Accretion expense represents the unwinding of the discount on a long-term provision due to the passage of time.",
        "The provision liability increases each period toward its ultimate settlement value.",
        "Multiply beginning ARO carrying value by the annual discount rate."
      ],
      calculationDetail: {
        title: 'Annual ARO Accretion Expense Calculation',
        formula: 'Accretion Expense = Beginning ARO Carrying Value × Annual Discount Rate',
        inputs: [
          { label: 'Beginning ARO Carrying Value', value: `$${pv.toLocaleString()}` },
          { label: 'Annual Discount Rate', value: '6%' }
        ],
        steps: [`Annual Accretion Expense = $${pv.toLocaleString()} × 6% = $${accretion.toLocaleString()}`],
        calculatedAmount: `$${accretion.toLocaleString()}`,
        explanation: `Calculate annual accretion expense: $${pv.toLocaleString()} × 6% = $${accretion.toLocaleString()}.`
      },
      correctLines: [
        { accountId: 'accretion_expense', debit: accretion, credit: 0 },
        { accountId: 'asset_retirement_obligation', debit: 0, credit: accretion }
      ],
      explanation: `Under IAS 37.60, where a provision is discounted, the carrying amount of a provision increases in each period to reflect the passage of time. This increase is recognized as borrowing/accretion expense: Debit Accretion Expense $${accretion.toLocaleString()} and credit Asset Retirement Obligation $${accretion.toLocaleString()}.`,
      accountAnalysis: [
        { accountId: 'accretion_expense', action: 'Debit', amount: accretion, reason: 'Accretion/finance expense increases on the Debit side.' },
        { accountId: 'asset_retirement_obligation', action: 'Credit', amount: accretion, reason: 'ARO liability increases towards future value on the Credit side.' }
      ],
      equationImpact: {
        assets: 0,
        liabilities: accretion,
        equity: -accretion,
        explanation: `Liabilities increase by $${accretion.toLocaleString()} (Asset Retirement Obligation) = Shareholders' Equity decreases by $${accretion.toLocaleString()} (Accretion Expense).`
      }
    };
  }
}

function generateNonInterestBearingNotePV(companyName: string, dateStr: string): AccountingScenario {
  const face = getRandomInt(60000, 120000, 10000);
  const pvFactor = 0.79383; // 3 years at 8%
  const pv = Math.round(face * pvFactor);
  const discount = face - pv;

  return {
    id: `int2-note-pv-${Date.now()}-${getRandomInt(100, 999)}`,
    title: 'Land Acquisition with Non-Interest-Bearing Note at Present Value',
    companyName,
    date: dateStr,
    narrative: `${companyName} acquired a commercial land parcel by issuing a 3-year, non-interest-bearing promissory note with a face value of $${face.toLocaleString()}. The prevailing market interest rate for similar debt is 8% per annum (3-year present value factor: 0.79383). Under Canadian ASPE / IFRS, record the purchase of the land and the issuance of the note.`,
    topic: 'Non-Interest Bearing Notes',
    difficulty: 'Intermediate Accounting 2',
    hints: [
      "Under Canadian ASPE and IFRS, non-interest-bearing notes and acquired assets must be initially recorded at present value.",
      "The difference between face value and present value represents unamortized financing discount (deferred interest).",
      "Multiply note face value by the PV factor to determine present value; subtract present value from face value to find the discount."
    ],
    calculationDetail: {
      title: 'Present Value & Discount on Non-Interest-Bearing Note',
      formula: 'Present Value = Face Value × PV Factor; Discount = Face Value - Present Value',
      inputs: [
        { label: 'Note Face Value', value: `$${face.toLocaleString()}` },
        { label: 'Market Interest Rate', value: '8%' },
        { label: '3-Year PV Factor (at 8%)', value: '0.79383' }
      ],
      steps: [
        `Present Value of Note = $${face.toLocaleString()} × 0.79383 = $${pv.toLocaleString()}`,
        `Unamortized Note Discount = $${face.toLocaleString()} - $${pv.toLocaleString()} = $${discount.toLocaleString()}`,
        `Capitalized Asset Cost = $${pv.toLocaleString()}`
      ],
      calculatedAmount: `$${pv.toLocaleString()} PV / $${discount.toLocaleString()} Discount`,
      explanation: `Calculate present value: $${face.toLocaleString()} × 0.79383 = $${pv.toLocaleString()}, leaving an unamortized discount of $${discount.toLocaleString()}.`
    },
    correctLines: [
      { accountId: 'land', debit: pv, credit: 0 },
      { accountId: 'discount_on_notes_payable', debit: discount, credit: 0 },
      { accountId: 'notes_payable', debit: 0, credit: face }
    ],
    explanation: `Under IFRS 9 and ASPE 3856, non-interest-bearing notes must be initially recorded at present value using the market rate of interest. The difference between face value and present value is recorded as Discount on Notes Payable (a contra-liability): Debit Land $${pv.toLocaleString()}, Debit Discount on Notes Payable $${discount.toLocaleString()}, and Credit Notes Payable $${face.toLocaleString()}.`,
    accountAnalysis: [
      { accountId: 'land', action: 'Debit', amount: pv, reason: 'Land asset recorded at transaction present value.' },
      { accountId: 'discount_on_notes_payable', action: 'Debit', amount: discount, reason: 'Contra-liability Discount on Notes Payable carries normal Debit balance.' },
      { accountId: 'notes_payable', action: 'Credit', amount: face, reason: 'Notes Payable liability recorded at legal face amount.' }
    ],
    equationImpact: {
      assets: pv,
      liabilities: pv,
      equity: 0,
      explanation: `Assets increase by $${pv.toLocaleString()} (Land) = Net Liabilities increase by $${pv.toLocaleString()} ($${face.toLocaleString()} Notes Payable - $${discount.toLocaleString()} Discount).`
    }
  };
}

function generateBondsPayablePV(companyName: string, dateStr: string): AccountingScenario {
  const isDiscount = Math.random() < 0.5;
  const face = getRandomInt(100000, 300000, 50000);

  if (isDiscount) {
    const issuePrice = Math.round(face * 0.94);
    const discount = face - issuePrice;

    return {
      id: `int2-bond-disc-${Date.now()}-${getRandomInt(100, 999)}`,
      title: 'Bonds Payable Issued at a Discount (Present Value Measurement)',
      companyName,
      date: dateStr,
      narrative: `${companyName} issued $${face.toLocaleString()} face value, 5% annual bonds. Based on prevailing market interest rates, the bonds were issued at 94% of face value (priced at 94.00). Record the bond issuance, including cash proceeds and unamortized bond discount.`,
      topic: 'Bonds Payable & Effective Interest',
      difficulty: 'Intermediate Accounting 2',
      hints: [
        "When market interest rates exceed the coupon rate, bonds issue at a discount below face value.",
        "Cash proceeds equal face value multiplied by the issue price percentage.",
        "The difference between face value and cash proceeds is the bond discount."
      ],
      calculationDetail: {
        title: 'Bond Issuance at a Discount (Present Value) Calculation',
        formula: 'Cash Proceeds = Face Value × Issue Price %; Discount = Face Value - Cash Proceeds',
        inputs: [
          { label: 'Bond Face Value', value: `$${face.toLocaleString()}` },
          { label: 'Issue Price Rate', value: '94% of face value (priced at 94.00)' }
        ],
        steps: [
          `Cash Proceeds Received = $${face.toLocaleString()} × 94% = $${issuePrice.toLocaleString()}`,
          `Discount on Bonds Payable = $${face.toLocaleString()} - $${issuePrice.toLocaleString()} = $${discount.toLocaleString()}`
        ],
        calculatedAmount: `$${issuePrice.toLocaleString()} Cash / $${discount.toLocaleString()} Discount`,
        explanation: `Calculate cash proceeds: $${face.toLocaleString()} × 94% = $${issuePrice.toLocaleString()}, leaving an unamortized bond discount of $${discount.toLocaleString()}.`
      },
      correctLines: [
        { accountId: 'cash', debit: issuePrice, credit: 0 },
        { accountId: 'discount_on_bonds_payable', debit: discount, credit: 0 },
        { accountId: 'bonds_payable', debit: 0, credit: face }
      ],
      explanation: `When the market rate exceeds the coupon rate, bonds sell at a discount. The cash received is debited, the contra-liability Discount on Bonds Payable is debited for the difference, and Bonds Payable is credited at face value. Over the life of the bond, the discount is amortized to interest expense under the effective interest method.`,
      accountAnalysis: [
        { accountId: 'cash', action: 'Debit', amount: issuePrice, reason: 'Cash increases by gross issue proceeds received.' },
        { accountId: 'discount_on_bonds_payable', action: 'Debit', amount: discount, reason: 'Contra-liability Discount on Bonds Payable increases on the Debit side.' },
        { accountId: 'bonds_payable', action: 'Credit', amount: face, reason: 'Bonds Payable liability recorded at face/par value.' }
      ],
      equationImpact: {
        assets: issuePrice,
        liabilities: issuePrice,
        equity: 0,
        explanation: `Assets increase by $${issuePrice.toLocaleString()} (Cash) = Net Liabilities increase by $${issuePrice.toLocaleString()} ($${face.toLocaleString()} Bonds Payable - $${discount.toLocaleString()} Discount).`
      }
    };
  } else {
    const issuePrice = Math.round(face * 1.06);
    const premium = issuePrice - face;

    return {
      id: `int2-bond-prem-${Date.now()}-${getRandomInt(100, 999)}`,
      title: 'Bonds Payable Issued at a Premium (Present Value Measurement)',
      companyName,
      date: dateStr,
      narrative: `${companyName} issued $${face.toLocaleString()} face value, 8% annual bonds. Because the coupon rate exceeded the market rate of interest, the bonds were issued at 106% of face value (priced at 106.00). Record the bond issuance, including cash proceeds and premium on bonds payable.`,
      topic: 'Bonds Payable & Effective Interest',
      difficulty: 'Intermediate Accounting 2',
      hints: [
        "When coupon interest rates exceed the prevailing market rate, bonds issue at a premium above face value.",
        "Cash proceeds equal face value multiplied by the issue price percentage.",
        "The excess of cash proceeds over face value represents the bond premium."
      ],
      calculationDetail: {
        title: 'Bond Issuance at a Premium (Present Value) Calculation',
        formula: 'Cash Proceeds = Face Value × Issue Price %; Premium = Cash Proceeds - Face Value',
        inputs: [
          { label: 'Bond Face Value', value: `$${face.toLocaleString()}` },
          { label: 'Issue Price Rate', value: '106% of face value (priced at 106.00)' }
        ],
        steps: [
          `Cash Proceeds Received = $${face.toLocaleString()} × 106% = $${issuePrice.toLocaleString()}`,
          `Premium on Bonds Payable = $${issuePrice.toLocaleString()} - $${face.toLocaleString()} = $${premium.toLocaleString()}`
        ],
        calculatedAmount: `$${issuePrice.toLocaleString()} Cash / $${premium.toLocaleString()} Premium`,
        explanation: `Calculate cash proceeds: $${face.toLocaleString()} × 106% = $${issuePrice.toLocaleString()}, creating a bond premium of $${premium.toLocaleString()}.`
      },
      correctLines: [
        { accountId: 'cash', debit: issuePrice, credit: 0 },
        { accountId: 'bonds_payable', debit: 0, credit: face },
        { accountId: 'premium_on_bonds_payable', debit: 0, credit: premium }
      ],
      explanation: `When coupon interest exceeds the market rate, bonds issue at a premium. Debit Cash $${issuePrice.toLocaleString()}, credit Bonds Payable $${face.toLocaleString()} at par, and credit Premium on Bonds Payable $${premium.toLocaleString()} as an adjunct liability adding to carrying value.`,
      accountAnalysis: [
        { accountId: 'cash', action: 'Debit', amount: issuePrice, reason: 'Cash increases by premium proceeds received.' },
        { accountId: 'bonds_payable', action: 'Credit', amount: face, reason: 'Bonds Payable liability recorded at face value.' },
        { accountId: 'premium_on_bonds_payable', action: 'Credit', amount: premium, reason: 'Premium on Bonds Payable adjunct liability increases on Credit side.' }
      ],
      equationImpact: {
        assets: issuePrice,
        liabilities: issuePrice,
        equity: 0,
        explanation: `Assets increase by $${issuePrice.toLocaleString()} (Cash) = Net Liabilities increase by $${issuePrice.toLocaleString()} ($${face.toLocaleString()} Bonds Payable + $${premium.toLocaleString()} Premium).`
      }
    };
  }
}

function generateEquipmentCashAndNotePV(companyName: string, dateStr: string): AccountingScenario {
  const cashDown = getRandomInt(15000, 40000, 5000);
  const noteFace = getRandomInt(50000, 100000, 10000);
  const pvFactor = 0.82645; // 2 years at 10%
  const notePV = Math.round(noteFace * pvFactor);
  const noteDiscount = noteFace - notePV;
  const totalEquipCost = cashDown + notePV;

  return {
    id: `int2-equip-cash-note-${Date.now()}-${getRandomInt(100, 999)}`,
    title: 'Equipment Acquisition: Cash Down Payment and Present Value Note Payable',
    companyName,
    date: dateStr,
    narrative: `${companyName} purchased industrial machinery by paying $${cashDown.toLocaleString()} cash down and signing a 2-year, non-interest-bearing promissory note with a face value of $${noteFace.toLocaleString()}. The present value factor for 2 years at the market interest rate of 10% is 0.82645. Record the equipment acquisition, note payable, and discount on notes payable.`,
    topic: 'Equipment & Note Present Value',
    difficulty: 'Intermediate Accounting 2',
    hints: [
      "The capitalized cost of equipment equals the cash down payment plus the present value of the promissory note.",
      "The unamortized discount on the note represents the difference between face value and present value.",
      "Multiply note face value by the PV factor, then add cash down to find total asset cost."
    ],
    calculationDetail: {
      title: 'Equipment Purchase with Cash Down and PV Note Calculation',
      formula: 'Note PV = Face × PV Factor; Discount = Face - Note PV; Total Equipment Cost = Cash Down + Note PV',
      inputs: [
        { label: 'Cash Down Payment', value: `$${cashDown.toLocaleString()}` },
        { label: 'Note Face Value', value: `$${noteFace.toLocaleString()}` },
        { label: '2-Year PV Factor (at 10%)', value: '0.82645' }
      ],
      steps: [
        `Note Present Value = $${noteFace.toLocaleString()} × 0.82645 = $${notePV.toLocaleString()}`,
        `Discount on Notes Payable = $${noteFace.toLocaleString()} - $${notePV.toLocaleString()} = $${noteDiscount.toLocaleString()}`,
        `Total Capitalized Equipment Cost = $${cashDown.toLocaleString()} (Cash) + $${notePV.toLocaleString()} (Note PV) = $${totalEquipCost.toLocaleString()}`
      ],
      calculatedAmount: `$${totalEquipCost.toLocaleString()} Equipment Cost`,
      explanation: `Note PV = $${notePV.toLocaleString()} and Discount = $${noteDiscount.toLocaleString()}. Total capitalized equipment cost = $${cashDown.toLocaleString()} + $${notePV.toLocaleString()} = $${totalEquipCost.toLocaleString()}.`
    },
    correctLines: [
      { accountId: 'equipment', debit: totalEquipCost, credit: 0 },
      { accountId: 'discount_on_notes_payable', debit: noteDiscount, credit: 0 },
      { accountId: 'cash', debit: 0, credit: cashDown },
      { accountId: 'notes_payable', debit: 0, credit: noteFace }
    ],
    explanation: `Under IAS 16 and ASPE 3061, the initial cost of equipment is its cash price equivalent at recognition date. When non-interest-bearing financing is used, equipment is debited for the cash paid ($${cashDown.toLocaleString()}) plus the present value of the note ($${notePV.toLocaleString()}) = $${totalEquipCost.toLocaleString()}. The note discount is debited for $${noteDiscount.toLocaleString()}, Cash is credited for $${cashDown.toLocaleString()}, and Notes Payable is credited for $${noteFace.toLocaleString()}.`,
    accountAnalysis: [
      { accountId: 'equipment', action: 'Debit', amount: totalEquipCost, reason: 'Equipment capitalized at cash equivalent purchase price.' },
      { accountId: 'discount_on_notes_payable', action: 'Debit', amount: noteDiscount, reason: 'Contra-liability Discount on Notes Payable increases on Debit side.' },
      { accountId: 'cash', action: 'Credit', amount: cashDown, reason: 'Cash outflow decreases asset on Credit side.' },
      { accountId: 'notes_payable', action: 'Credit', amount: noteFace, reason: 'Notes Payable liability recorded at face amount.' }
    ],
    equationImpact: {
      assets: totalEquipCost - cashDown,
      liabilities: notePV,
      equity: 0,
      explanation: `Net Assets increase by $${notePV.toLocaleString()} ($${totalEquipCost.toLocaleString()} Equipment - $${cashDown.toLocaleString()} Cash) = Net Liabilities increase by $${notePV.toLocaleString()} ($${noteFace.toLocaleString()} Note - $${noteDiscount.toLocaleString()} Discount).`
    }
  };
}

function generateStockAndLiquidatingDividends(companyName: string, dateStr: string): AccountingScenario {
  const isStockDiv = Math.random() < 0.5;

  if (isStockDiv) {
    const shares = getRandomInt(1000, 5000, 500);
    const fmv = getRandomInt(12, 35, 1);
    const totalDiv = shares * fmv;

    return {
      id: `int2-stock-div-${Date.now()}-${getRandomInt(100, 999)}`,
      title: 'Declaration of Small Stock Dividend at Fair Market Value',
      companyName,
      date: dateStr,
      narrative: `The Board of Directors of ${companyName} declared a small 5% stock dividend consisting of ${shares.toLocaleString()} common shares. At the declaration date, the shares have a quoted fair market value of $${fmv} per share. Record the declaration of the stock dividend.`,
      topic: 'Stock & Liquidating Dividends',
      difficulty: 'Intermediate Accounting 2',
      hints: [
        "Under corporate reporting standards, small stock dividends are measured at quoted market fair value.",
        "The dividend fair value is reclassified from retained earnings to contributed capital accounts within equity.",
        "Multiply the number of shares declared by the quoted market fair value per share."
      ],
      calculationDetail: {
        title: 'Small Stock Dividend Fair Value Calculation',
        formula: 'Total Stock Dividend Value = Number of Shares Declared × Quoted Fair Market Value per Share',
        inputs: [
          { label: 'Common Shares Declared', value: `${shares.toLocaleString()} shares` },
          { label: 'Market Fair Value per Share', value: `$${fmv}/share` }
        ],
        steps: [`Total Stock Dividend = ${shares.toLocaleString()} shares × $${fmv} = $${totalDiv.toLocaleString()}`],
        calculatedAmount: `$${totalDiv.toLocaleString()}`,
        explanation: `Calculate total stock dividend fair value: ${shares.toLocaleString()} shares × $${fmv} = $${totalDiv.toLocaleString()}.`
      },
      correctLines: [
        { accountId: 'stock_dividends', debit: totalDiv, credit: 0 },
        { accountId: 'common_shares_distributable', debit: 0, credit: totalDiv }
      ],
      explanation: `For small stock dividends, accounting standards require transferring the fair market value of the shares from Retained Earnings to contributed capital accounts: Debit Stock Dividends Declared $${totalDiv.toLocaleString()} and credit Common Shares Distributable $${totalDiv.toLocaleString()}. Both accounts reside in Shareholders' Equity.`,
      accountAnalysis: [
        { accountId: 'stock_dividends', action: 'Debit', amount: totalDiv, reason: 'Dividend temporary equity reduction increases on Debit side.' },
        { accountId: 'common_shares_distributable', action: 'Credit', amount: totalDiv, reason: 'Common Shares Distributable equity increases on Credit side.' }
      ],
      equationImpact: {
        assets: 0,
        liabilities: 0,
        equity: 0,
        explanation: `Pure equity reclassification within Shareholders' Equity ($${totalDiv.toLocaleString()} Stock Dividends debited, $${totalDiv.toLocaleString()} Shares Distributable credited). Total Equity is unchanged.`
      }
    };
  } else {
    const totalDiv = getRandomInt(50000, 100000, 10000);
    const retainedEarningsPortion = Math.round(totalDiv * 0.6);
    const liquidatingPortion = totalDiv - retainedEarningsPortion;

    return {
      id: `int2-liq-div-${Date.now()}-${getRandomInt(100, 999)}`,
      title: 'Declaration of Liquidating Cash Dividend (Return of Contributed Capital)',
      companyName,
      date: dateStr,
      narrative: `The Board of Directors of ${companyName} declared a total cash dividend of $${totalDiv.toLocaleString()}. However, accumulated Retained Earnings only has an available credit balance of $${retainedEarningsPortion.toLocaleString()}. The remaining portion represents a liquidating dividend (return of contributed capital to shareholders). Record the dividend declaration.`,
      topic: 'Stock & Liquidating Dividends',
      difficulty: 'Intermediate Accounting 2',
      hints: [
        "Dividends declared in excess of accumulated retained earnings represent a liquidating return of contributed capital.",
        "The liquidating portion reduces contributed surplus rather than retained earnings.",
        "Subtract available retained earnings from the total dividend declared to find the liquidating portion."
      ],
      calculationDetail: {
        title: 'Liquidating Dividend Capital Allocation Calculation',
        formula: 'Liquidating Portion (Contributed Surplus) = Total Dividend Declared - Available Retained Earnings',
        inputs: [
          { label: 'Total Dividend Declared', value: `$${totalDiv.toLocaleString()}` },
          { label: 'Available Retained Earnings', value: `$${retainedEarningsPortion.toLocaleString()}` }
        ],
        steps: [
          `Retained Earnings Portion = $${retainedEarningsPortion.toLocaleString()}`,
          `Liquidating Return of Capital (Contributed Surplus) = $${totalDiv.toLocaleString()} - $${retainedEarningsPortion.toLocaleString()} = $${liquidatingPortion.toLocaleString()}`
        ],
        calculatedAmount: `$${liquidatingPortion.toLocaleString()} Liquidating Portion`,
        explanation: `Calculate liquidating capital portion: $${totalDiv.toLocaleString()} total - $${retainedEarningsPortion.toLocaleString()} retained earnings = $${liquidatingPortion.toLocaleString()}.`
      },
      correctLines: [
        { accountId: 'retained_earnings', debit: retainedEarningsPortion, credit: 0 },
        { accountId: 'contributed_surplus', debit: liquidatingPortion, credit: 0 },
        { accountId: 'dividends_payable', debit: 0, credit: totalDiv }
      ],
      explanation: `When a dividend exceeds accumulated retained earnings, the excess is a liquidating dividend that returns paid-in capital to owners: Debit Retained Earnings $${retainedEarningsPortion.toLocaleString()}, Debit Contributed Surplus $${liquidatingPortion.toLocaleString()}, and Credit Dividends Payable $${totalDiv.toLocaleString()}.`,
      accountAnalysis: [
        { accountId: 'retained_earnings', action: 'Debit', amount: retainedEarningsPortion, reason: 'Retained Earnings reduced on Debit side.' },
        { accountId: 'contributed_surplus', action: 'Debit', amount: liquidatingPortion, reason: 'Contributed Surplus capital reduced on Debit side.' },
        { accountId: 'dividends_payable', action: 'Credit', amount: totalDiv, reason: 'Current liability Dividends Payable increases on Credit side.' }
      ],
      equationImpact: {
        assets: 0,
        liabilities: totalDiv,
        equity: -totalDiv,
        explanation: `Liabilities increase by $${totalDiv.toLocaleString()} (Dividends Payable) = Shareholders' Equity decreases by $${totalDiv.toLocaleString()} (-$${retainedEarningsPortion.toLocaleString()} Retained Earnings, -$${liquidatingPortion.toLocaleString()} Contributed Surplus).`
      }
    };
  }
}

function generateDerivatives(companyName: string, dateStr: string): AccountingScenario {
  const isGain = Math.random() < 0.5;
  const priorFv = getRandomInt(10000, 30000, 2000);
  const fvChange = getRandomInt(4000, 15000, 500);

  if (isGain) {
    const currentFv = priorFv + fvChange;

    return {
      id: `int2-deriv-gain-${Date.now()}-${getRandomInt(100, 999)}`,
      title: 'Derivative Financial Instrument: Mark-to-Market Fair Value Gain (IFRS 9)',
      companyName,
      date: dateStr,
      narrative: `${companyName} holds a foreign currency forward exchange contract. At the reporting date, exchange rate movements increased the fair value of the contract from $${priorFv.toLocaleString()} to $${currentFv.toLocaleString()} into an asset position. Under IFRS 9, record the mark-to-market fair value gain.`,
      topic: 'Derivatives & Hedging',
      difficulty: 'Intermediate Accounting 2',
      hints: [
        "Under IFRS 9, derivative financial instruments are measured at fair value through profit or loss (FVTPL).",
        "Favorable fair value movements increase the derivative financial asset and are recognized as gains in profit or loss.",
        "Subtract the prior carrying value from ending fair market value to calculate the gain."
      ],
      calculationDetail: {
        title: 'Derivative Mark-to-Market Gain Calculation',
        formula: 'Mark-to-Market Gain = Ending Fair Value - Prior Carrying Value',
        inputs: [
          { label: 'Prior Carrying Value', value: `$${priorFv.toLocaleString()}` },
          { label: 'Ending Market Fair Value', value: `$${currentFv.toLocaleString()}` }
        ],
        steps: [`Fair Value Gain = $${currentFv.toLocaleString()} - $${priorFv.toLocaleString()} = $${fvChange.toLocaleString()}`],
        calculatedAmount: `$${fvChange.toLocaleString()}`,
        explanation: `Calculate mark-to-market fair value gain: $${currentFv.toLocaleString()} - $${priorFv.toLocaleString()} = $${fvChange.toLocaleString()}.`
      },
      correctLines: [
        { accountId: 'derivative_financial_asset', debit: fvChange, credit: 0 },
        { accountId: 'gain_on_derivative', debit: 0, credit: fvChange }
      ],
      explanation: `Under IFRS 9 paragraph 5.2.1, derivatives are measured at fair value through profit or loss (FVTPL). Favorable fair value changes are recognized as an asset and a gain in profit or loss: Debit Derivative Financial Asset $${fvChange.toLocaleString()} and credit Gain on Derivative $${fvChange.toLocaleString()}.`,
      accountAnalysis: [
        { accountId: 'derivative_financial_asset', action: 'Debit', amount: fvChange, reason: 'Derivative Financial Asset increases on Debit side.' },
        { accountId: 'gain_on_derivative', action: 'Credit', amount: fvChange, reason: 'Gain on Derivative increases profit/loss on Credit side.' }
      ],
      equationImpact: {
        assets: fvChange,
        liabilities: 0,
        equity: fvChange,
        explanation: `Assets increase by $${fvChange.toLocaleString()} (Derivative Financial Asset) = Shareholders' Equity increases by $${fvChange.toLocaleString()} (Gain on Derivative).`
      }
    };
  } else {
    const priorLiab = getRandomInt(8000, 20000, 2000);
    const currentLiab = priorLiab + fvChange;

    return {
      id: `int2-deriv-loss-${Date.now()}-${getRandomInt(100, 999)}`,
      title: 'Derivative Financial Instrument: Mark-to-Market Fair Value Loss (IFRS 9)',
      companyName,
      date: dateStr,
      narrative: `${companyName} entered an interest rate swap agreement. At fiscal year-end, interest rate changes caused the fair value liability of the derivative to increase from $${priorLiab.toLocaleString()} to $${currentLiab.toLocaleString()} in an unfavorable position. Record the mark-to-market fair value loss under IFRS 9.`,
      topic: 'Derivatives & Hedging',
      difficulty: 'Intermediate Accounting 2',
      hints: [
        "Under IFRS 9, derivative financial instruments not designated in hedges are marked to market through profit or loss.",
        "Unfavorable movements increase derivative liabilities and are recognized as losses in profit or loss.",
        "Subtract the prior liability balance from ending fair value to calculate the loss."
      ],
      calculationDetail: {
        title: 'Derivative Mark-to-Market Loss Calculation',
        formula: 'Mark-to-Market Loss = Ending Liability Fair Value - Prior Liability Carrying Value',
        inputs: [
          { label: 'Prior Liability Balance', value: `$${priorLiab.toLocaleString()}` },
          { label: 'Ending Liability Fair Value', value: `$${currentLiab.toLocaleString()}` }
        ],
        steps: [`Fair Value Loss = $${currentLiab.toLocaleString()} - $${priorLiab.toLocaleString()} = $${fvChange.toLocaleString()}`],
        calculatedAmount: `$${fvChange.toLocaleString()}`,
        explanation: `Calculate mark-to-market fair value loss: $${currentLiab.toLocaleString()} - $${priorLiab.toLocaleString()} = $${fvChange.toLocaleString()}.`
      },
      correctLines: [
        { accountId: 'loss_on_derivative', debit: fvChange, credit: 0 },
        { accountId: 'derivative_financial_liability', debit: 0, credit: fvChange }
      ],
      explanation: `Under IFRS 9, derivative instruments not designated in an effective hedge are remeasured at fair value through profit or loss. An unfavorable movement requires recognizing a loss in profit or loss and a liability on the statement of financial position: Debit Loss on Derivative $${fvChange.toLocaleString()} and credit Derivative Financial Liability $${fvChange.toLocaleString()}.`,
      accountAnalysis: [
        { accountId: 'loss_on_derivative', action: 'Debit', amount: fvChange, reason: 'Loss on Derivative recognized in profit or loss on Debit side.' },
        { accountId: 'derivative_financial_liability', action: 'Credit', amount: fvChange, reason: 'Derivative Financial Liability increases on Credit side.' }
      ],
      equationImpact: {
        assets: 0,
        liabilities: fvChange,
        equity: -fvChange,
        explanation: `Liabilities increase by $${fvChange.toLocaleString()} (Derivative Financial Liability) = Shareholders' Equity decreases by $${fvChange.toLocaleString()} (Loss on Derivative).`
      }
    };
  }
}

function generateDeferredIncomeTaxes(companyName: string, dateStr: string): AccountingScenario {
  const currentTax = getRandomInt(20000, 50000, 2500);
  const timingDiff = getRandomInt(16000, 40000, 4000);
  const taxRate = 0.25; // 25% corporate tax rate
  const deferredTaxLiab = Math.round(timingDiff * taxRate);
  const totalTaxExp = currentTax + deferredTaxLiab;

  return {
    id: `int2-tax-${Date.now()}-${getRandomInt(100, 999)}`,
    title: 'Income Tax Provision: Current and Deferred Tax Liability (IAS 12 / ASPE 3465)',
    companyName,
    date: dateStr,
    narrative: `For the fiscal year, ${companyName} calculated current income taxes payable to the Canada Revenue Agency (CRA) of $${currentTax.toLocaleString()}. Additionally, Capital Cost Allowance (CCA) tax depreciation exceeded accounting depreciation by $${timingDiff.toLocaleString()}, creating a taxable temporary difference. The enacted corporate income tax rate is 25%. Under IAS 12 / ASPE 3465, calculate the Deferred Tax Liability and record the comprehensive income tax entry.`,
    topic: 'Deferred Income Taxes',
    difficulty: 'Intermediate Accounting 2',
    hints: [
      "Total income tax expense includes current tax payable plus deferred tax consequences of temporary differences.",
      "Deferred tax liabilities arise when taxable temporary differences will increase taxable income in future years.",
      "Multiply the taxable temporary difference by the enacted corporate tax rate, then add current tax."
    ],
    calculationDetail: {
      title: 'Current and Deferred Income Tax Provision Calculation (IAS 12)',
      formula: 'Deferred Tax Liability = Taxable Temporary Difference × Enacted Tax Rate; Total Expense = Current Tax + DTL',
      inputs: [
        { label: 'Current Tax Payable to CRA', value: `$${currentTax.toLocaleString()}` },
        { label: 'Taxable Temporary Difference (CCA > Depreciation)', value: `$${timingDiff.toLocaleString()}` },
        { label: 'Corporate Tax Rate', value: '25%' }
      ],
      steps: [
        `Deferred Tax Liability = $${timingDiff.toLocaleString()} × 25% = $${deferredTaxLiab.toLocaleString()}`,
        `Total Income Tax Expense = $${currentTax.toLocaleString()} (Current) + $${deferredTaxLiab.toLocaleString()} (Deferred) = $${totalTaxExp.toLocaleString()}`
      ],
      calculatedAmount: `$${deferredTaxLiab.toLocaleString()} DTL / $${totalTaxExp.toLocaleString()} Expense`,
      explanation: `Calculate DTL = $${timingDiff.toLocaleString()} × 25% = $${deferredTaxLiab.toLocaleString()}, giving total income tax expense of $${currentTax.toLocaleString()} + $${deferredTaxLiab.toLocaleString()} = $${totalTaxExp.toLocaleString()}.`
    },
    correctLines: [
      { accountId: 'income_tax_expense', debit: totalTaxExp, credit: 0 },
      { accountId: 'income_tax_payable', debit: 0, credit: currentTax },
      { accountId: 'deferred_tax_liability', debit: 0, credit: deferredTaxLiab }
    ],
    explanation: `Under IAS 12 and ASPE 3465, total income tax expense includes both current tax payable and deferred tax consequences of temporary differences: Debit Income Tax Expense $${totalTaxExp.toLocaleString()}, Credit Income Taxes Payable $${currentTax.toLocaleString()}, and Credit Deferred Tax Liability $${deferredTaxLiab.toLocaleString()}.`,
    accountAnalysis: [
      { accountId: 'income_tax_expense', action: 'Debit', amount: totalTaxExp, reason: 'Total tax expense recognized in profit or loss on Debit side.' },
      { accountId: 'income_tax_payable', action: 'Credit', amount: currentTax, reason: 'Current tax payable owed to tax authorities on Credit side.' },
      { accountId: 'deferred_tax_liability', action: 'Credit', amount: deferredTaxLiab, reason: 'Deferred Tax Liability reflects future taxable temporary difference.' }
    ],
    equationImpact: {
      assets: 0,
      liabilities: totalTaxExp,
      equity: -totalTaxExp,
      explanation: `Liabilities increase by $${totalTaxExp.toLocaleString()} (+$${currentTax.toLocaleString()} Current Tax, +$${deferredTaxLiab.toLocaleString()} Deferred Tax) = Shareholders' Equity decreases by $${totalTaxExp.toLocaleString()} (Income Tax Expense).`
    }
  };
}

function generatePensions(companyName: string, dateStr: string): AccountingScenario {
  const serviceCost = getRandomInt(35000, 70000, 5000);
  const netInterest = getRandomInt(4000, 10000, 1000);
  const totalPensionExp = serviceCost + netInterest;
  const fundingContribution = getRandomInt(30000, 65000, 5000);
  const liabilityChange = totalPensionExp - fundingContribution;

  return {
    id: `int2-pension-${Date.now()}-${getRandomInt(100, 999)}`,
    title: 'Defined Benefit Pension Plan: Annual Pension Expense and Funding (IAS 19)',
    companyName,
    date: dateStr,
    narrative: `${companyName} sponsors a defined benefit pension plan for employees. For the current year, the actuarial report indicates a current service cost of $${serviceCost.toLocaleString()} and net interest cost on the net defined benefit liability of $${netInterest.toLocaleString()}. During the year, ${companyName} contributed $${fundingContribution.toLocaleString()} in cash to the pension fund trustee. Record the pension expense, funding contribution, and net defined benefit liability change under IAS 19.`,
    topic: 'Pensions & Employee Benefits',
    difficulty: 'Intermediate Accounting 2',
    hints: [
      "Under IAS 19, defined benefit pension expense includes current service cost and net interest on the net pension liability.",
      "Funding cash contributions paid to the plan trustee reduce the net defined benefit pension liability.",
      "Calculate total pension expense by summing service cost and net interest cost, then compare against cash funded."
    ],
    calculationDetail: {
      title: 'Defined Benefit Pension Plan Calculations (IAS 19)',
      formula: 'Total Pension Expense = Current Service Cost + Net Interest Cost; Liability Change = Expense - Cash Funded',
      inputs: [
        { label: 'Current Service Cost', value: `$${serviceCost.toLocaleString()}` },
        { label: 'Net Interest on Pension Liability', value: `$${netInterest.toLocaleString()}` },
        { label: 'Cash Funding Contribution', value: `$${fundingContribution.toLocaleString()}` }
      ],
      steps: [
        `Total Pension Expense = $${serviceCost.toLocaleString()} + $${netInterest.toLocaleString()} = $${totalPensionExp.toLocaleString()}`,
        `Net Liability Adjustment = $${totalPensionExp.toLocaleString()} - $${fundingContribution.toLocaleString()} = $${Math.abs(liabilityChange).toLocaleString()}`
      ],
      calculatedAmount: `$${totalPensionExp.toLocaleString()} Pension Expense`,
      explanation: `Total pension expense = $${serviceCost.toLocaleString()} + $${netInterest.toLocaleString()} = $${totalPensionExp.toLocaleString()}. Net liability adjustment = $${totalPensionExp.toLocaleString()} - $${fundingContribution.toLocaleString()} = $${Math.abs(liabilityChange).toLocaleString()}.`
    },
    correctLines: [
      { accountId: 'pension_expense', debit: totalPensionExp, credit: 0 },
      { accountId: 'pension_asset_liability', debit: liabilityChange < 0 ? Math.abs(liabilityChange) : 0, credit: liabilityChange > 0 ? liabilityChange : 0 },
      { accountId: 'cash', debit: 0, credit: fundingContribution }
    ].filter(l => l.debit > 0 || l.credit > 0),
    explanation: `Under IAS 19, defined benefit pension expense includes current service cost and net interest on the net defined benefit liability/asset. The funding cash contribution reduces cash, with the net difference adjusting the balance sheet pension liability: Debit Pension Expense $${totalPensionExp.toLocaleString()}, Credit Cash $${fundingContribution.toLocaleString()}, and adjust Net Defined Benefit Pension Liability for the difference.`,
    accountAnalysis: [
      { accountId: 'pension_expense', action: 'Debit', amount: totalPensionExp, reason: 'Pension Expense recognized in profit or loss on Debit side.' },
      { accountId: 'cash', action: 'Credit', amount: fundingContribution, reason: 'Cash outflow funded to plan trustee on Credit side.' },
      { accountId: 'pension_asset_liability', action: liabilityChange > 0 ? 'Credit' : 'Debit', amount: Math.abs(liabilityChange), reason: 'Net defined benefit pension liability adjusted on balance sheet.' }
    ],
    equationImpact: {
      assets: -fundingContribution,
      liabilities: liabilityChange,
      equity: -totalPensionExp,
      explanation: `Assets decrease by $${fundingContribution.toLocaleString()} (Cash) + Liabilities change by $${liabilityChange.toLocaleString()} (Pension Liability) = Shareholders' Equity decreases by $${totalPensionExp.toLocaleString()} (Pension Expense).`
    }
  };
}

function generateLeasesIfrs16(companyName: string, dateStr: string): AccountingScenario {
  const isCommencement = Math.random() < 0.5;
  const annualPayment = getRandomInt(12000, 30000, 2000);
  const termYears = pickRandom([3, 4, 5]);
  const rate = 0.06; // 6% incremental borrowing rate
  // PV annuity factor
  const pvFactor = (1 - Math.pow(1 + rate, -termYears)) / rate;
  const pvLease = Math.round(annualPayment * pvFactor);

  if (isCommencement) {
    return {
      id: `int2-lease-init-${Date.now()}-${getRandomInt(100, 999)}`,
      title: 'IFRS 16 Lease Commencement: Right-of-Use Asset and Lease Liability',
      companyName,
      date: dateStr,
      narrative: `${companyName} signed a ${termYears}-year lease for commercial equipment with annual lease payments of $${annualPayment.toLocaleString()} payable at the end of each year. The company's incremental borrowing rate is 6% per annum (present value annuity factor for ${termYears} years at 6%: ${pvFactor.toFixed(4)}). Under IFRS 16, determine the present value of the lease liability and record the initial recognition of the right-of-use asset and lease liability.`,
      topic: 'Leases (IFRS 16 & ASPE)',
      difficulty: 'Intermediate Accounting 2',
      hints: [
        "Under IFRS 16, lessees recognize a right-of-use asset and lease liability measured at present value.",
        "Initial measurement reflects the present value of future lease payments discounted at the incremental borrowing rate.",
        "Multiply the annual lease payment by the present value annuity factor."
      ],
      calculationDetail: {
        title: 'IFRS 16 Lease Present Value Capitalization Calculation',
        formula: 'Initial Lease Liability & ROU Asset = Annual Lease Payment × Present Value Annuity Factor',
        inputs: [
          { label: 'Annual Lease Payment', value: `$${annualPayment.toLocaleString()}/year` },
          { label: 'Lease Term', value: `${termYears} years` },
          { label: 'Borrowing Rate', value: '6%' },
          { label: 'PV Annuity Factor (Ordinary Annuity)', value: `${pvFactor.toFixed(4)}` }
        ],
        steps: [`Present Value = $${annualPayment.toLocaleString()} × ${pvFactor.toFixed(4)} = $${pvLease.toLocaleString()}`],
        calculatedAmount: `$${pvLease.toLocaleString()}`,
        explanation: `Calculate present value of lease payments: $${annualPayment.toLocaleString()} × ${pvFactor.toFixed(4)} = $${pvLease.toLocaleString()}.`
      },
      correctLines: [
        { accountId: 'right_of_use_asset', debit: pvLease, credit: 0 },
        { accountId: 'lease_liability', debit: 0, credit: pvLease }
      ],
      explanation: `Under IFRS 16 paragraph 22, at the commencement date, a lessee shall recognize a right-of-use asset and a lease liability measured at the present value of the lease payments that are not paid at that date. Debit Right-of-Use Asset $${pvLease.toLocaleString()} and credit Lease Liability $${pvLease.toLocaleString()}.`,
      accountAnalysis: [
        { accountId: 'right_of_use_asset', action: 'Debit', amount: pvLease, reason: 'Right-of-Use leased asset increases on Debit side.' },
        { accountId: 'lease_liability', action: 'Credit', amount: pvLease, reason: 'Lease Liability obligation increases on Credit side.' }
      ],
      equationImpact: {
        assets: pvLease,
        liabilities: pvLease,
        equity: 0,
        explanation: `Assets increase by $${pvLease.toLocaleString()} (Right-of-Use Asset) = Liabilities increase by $${pvLease.toLocaleString()} (Lease Liability). Equity is unchanged.`
      }
    };
  } else {
    const interest = Math.round(pvLease * rate);
    const principal = annualPayment - interest;

    return {
      id: `int2-lease-pmt-${Date.now()}-${getRandomInt(100, 999)}`,
      title: 'IFRS 16 Annual Lease Payment: Interest Expense and Principal Reduction',
      companyName,
      date: dateStr,
      narrative: `${companyName} made its first annual lease payment of $${annualPayment.toLocaleString()} cash on its equipment lease. At the beginning of the year, the Lease Liability had a carrying value of $${pvLease.toLocaleString()} and an effective interest rate of 6% per annum. Under IFRS 16, record the lease payment, allocating between interest expense and principal reduction.`,
      topic: 'Leases (IFRS 16 & ASPE)',
      difficulty: 'Intermediate Accounting 2',
      hints: [
        "Under IFRS 16, lease payments are apportioned between finance interest expense and lease liability principal reduction.",
        "Interest expense is calculated by multiplying the beginning lease liability carrying amount by the borrowing rate.",
        "The remaining cash payment reduces the outstanding lease liability principal."
      ],
      calculationDetail: {
        title: 'IFRS 16 Lease Payment Allocation Calculation',
        formula: 'Interest Expense = Beginning Liability × Rate; Principal Reduction = Annual Payment - Interest Expense',
        inputs: [
          { label: 'Beginning Lease Liability Carrying Value', value: `$${pvLease.toLocaleString()}` },
          { label: 'Effective Interest Rate', value: '6% per annum' },
          { label: 'Annual Cash Payment', value: `$${annualPayment.toLocaleString()}` }
        ],
        steps: [
          `Interest Expense = $${pvLease.toLocaleString()} × 6% = $${interest.toLocaleString()}`,
          `Principal Reduction = $${annualPayment.toLocaleString()} - $${interest.toLocaleString()} = $${principal.toLocaleString()}`
        ],
        calculatedAmount: `$${interest.toLocaleString()} Interest / $${principal.toLocaleString()} Principal`,
        explanation: `Interest expense = $${pvLease.toLocaleString()} × 6% = $${interest.toLocaleString()}, leaving principal reduction of $${annualPayment.toLocaleString()} - $${interest.toLocaleString()} = $${principal.toLocaleString()}.`
      },
      correctLines: [
        { accountId: 'interest_expense', debit: interest, credit: 0 },
        { accountId: 'lease_liability', debit: principal, credit: 0 },
        { accountId: 'cash', debit: 0, credit: annualPayment }
      ],
      explanation: `Under IFRS 16 paragraph 36, each lease payment is apportioned between finance cost (Interest Expense) and the reduction of the outstanding Lease Liability: Debit Interest Expense $${interest.toLocaleString()}, Debit Lease Liability $${principal.toLocaleString()}, and Credit Cash $${annualPayment.toLocaleString()}.`,
      accountAnalysis: [
        { accountId: 'interest_expense', action: 'Debit', amount: interest, reason: 'Interest Expense recognized on Debit side.' },
        { accountId: 'lease_liability', action: 'Debit', amount: principal, reason: 'Lease Liability principal decreases on Debit side.' },
        { accountId: 'cash', action: 'Credit', amount: annualPayment, reason: 'Cash outflow decreases asset on Credit side.' }
      ],
      equationImpact: {
        assets: -annualPayment,
        liabilities: -principal,
        equity: -interest,
        explanation: `Assets decrease by $${annualPayment.toLocaleString()} (Cash) = Liabilities decrease by $${principal.toLocaleString()} (Lease Liability) + Equity decreases by $${interest.toLocaleString()} (Interest Expense).`
      }
    };
  }
}

// ============================================================================
// MAIN PROCEDURAL PRACTICE GENERATOR ROUTER
// Guaranteed to generate an unlimited supply of unique, non-repeating questions
// matching the user's four difficulty categories.
// ============================================================================

export function generatePracticeScenario(
  category: PracticeDifficultyCategory = 'Beginner',
  excludeSignatures?: Set<string> | string[]
): AccountingScenario {
  const excluded = new Set(
    Array.isArray(excludeSignatures)
      ? excludeSignatures
      : excludeSignatures ? Array.from(excludeSignatures) : []
  );

  // Attempt up to 50 generations to ensure uniqueness
  for (let attempt = 0; attempt < 50; attempt++) {
    const company = generateUniqueCanadianCompany(Array.from(excluded));
    const { dateStr } = getRandomDate(2026);

    let scenario: AccountingScenario;

    switch (category) {
      case 'Beginner': {
        const genChoice = pickRandom([
          generateBeginnerExpensesPaidWithCash,
          generateBeginnerAssetPurchaseWithCash,
          generateBeginnerCashReceivedForRevenue
        ]);
        scenario = genChoice(company.companyName, dateStr);
        break;
      }

      case 'Intro Accounting': {
        // Larger proportion of adjusting entries, mixed with basic entries
        const isAdjusting = Math.random() < 0.75;
        if (isAdjusting) {
          const genChoice = pickRandom([
            generateIntroAdjustingAccruedExpense,
            generateIntroAdjustingPrepaidExpense,
            generateIntroAdjustingDepreciation,
            generateIntroAdjustingUnearnedRevenue
          ]);
          scenario = genChoice(company.companyName, dateStr);
        } else {
          const genChoice = pickRandom([
            generateBeginnerExpensesPaidWithCash,
            generateBeginnerAssetPurchaseWithCash,
            generateBeginnerCashReceivedForRevenue
          ]);
          scenario = genChoice(company.companyName, dateStr);
          scenario.difficulty = 'Intro Accounting';
        }
        break;
      }

      case 'Intermediate Accounting 1': {
        const genChoice = pickRandom([
          generateLcnrvInventoryAdjustment,
          generateDiscontinuedOperations,
          generateOciGainLoss,
          generateIfrs15Revenue,
          generateWarrantyProvision,
          generatePercentageOfCompletion,
          generateSalesDiscounts,
          generateBadDebtsEcl,
          generateEquityMethodInvestment,
          generateRevaluationModel,
          generateDiminishingBalanceAndUnitsDepreciation,
          generateImpairmentLoss
        ]);
        scenario = genChoice(company.companyName, dateStr);
        break;
      }

      case 'Intermediate Accounting 2': {
        const genChoice = pickRandom([
          generateAroInitialAndAccretion,
          generateNonInterestBearingNotePV,
          generateBondsPayablePV,
          generateEquipmentCashAndNotePV,
          generateStockAndLiquidatingDividends,
          generateDerivatives,
          generateDeferredIncomeTaxes,
          generatePensions,
          generateLeasesIfrs16
        ]);
        scenario = genChoice(company.companyName, dateStr);
        break;
      }
    }

    // Prefix title with company name to guarantee uniqueness across every generated scenario
    if (!scenario.title.startsWith(scenario.companyName)) {
      scenario.title = `${scenario.companyName} — ${scenario.title}`;
    }

    // Generate a signature for uniqueness checking
    const sig = `${scenario.title}-${scenario.correctLines[0]?.debit || scenario.correctLines[0]?.credit}-${scenario.narrative.substring(0, 40)}`;

    if (!excluded.has(sig) && !excluded.has(scenario.title) && !excluded.has(scenario.companyName)) {
      return scenario;
    }
  }

  // Fallback guaranteed novel scenario if collisions occur
  const company = generateUniqueCanadianCompany(Array.from(excluded));
  const { dateStr } = getRandomDate(2027);
  const fallback = generateBeginnerExpensesPaidWithCash(company.companyName, dateStr);
  fallback.title = `${company.companyName} — ${fallback.title}`;
  return fallback;
}
