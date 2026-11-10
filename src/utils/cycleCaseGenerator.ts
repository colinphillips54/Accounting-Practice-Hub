import { MultiTransactionScenario, AccountingScenario } from '../types/accounting';
import { CHART_OF_ACCOUNTS } from '../data/accounts';

import { generateUniqueCanadianCompany, CanadianCompanyProfile } from './canadianCompanyGenerator';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function getRandomInt(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step);
  return min + Math.floor(Math.random() * (steps + 1)) * step;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Validates that all account IDs in the case exist in CHART_OF_ACCOUNTS
 * and that every transaction balances (Total Debits === Total Credits).
 */
export function validateCycleCase(cycleCase: MultiTransactionScenario): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const validAccountIds = new Set(CHART_OF_ACCOUNTS.map(a => a.id));

  if (!cycleCase.id || typeof cycleCase.id !== 'string') {
    errors.push('Case is missing a valid unique ID.');
  }
  if (!cycleCase.title || typeof cycleCase.title !== 'string') {
    errors.push('Case is missing a title.');
  }
  if (!cycleCase.companyName || typeof cycleCase.companyName !== 'string') {
    errors.push('Case is missing a company name.');
  }
  if (!Array.isArray(cycleCase.transactions) || cycleCase.transactions.length < 5) {
    errors.push('Case must have at least 5 transactions.');
    return { isValid: false, errors };
  }

  cycleCase.transactions.forEach((tx, idx) => {
    if (!tx.id || !tx.title || !tx.date || !tx.narrative) {
      errors.push(`Transaction #${idx + 1} has missing metadata (id, title, date, or narrative).`);
    }

    if (!Array.isArray(tx.correctLines) || tx.correctLines.length < 2) {
      errors.push(`Transaction #${idx + 1} must have at least 2 journal entry lines.`);
      return;
    }

    let totalDebit = 0;
    let totalCredit = 0;

    tx.correctLines.forEach(line => {
      if (!validAccountIds.has(line.accountId)) {
        errors.push(`Transaction #${idx + 1} uses invalid account ID: "${line.accountId}".`);
      }
      totalDebit += line.debit || 0;
      totalCredit += line.credit || 0;
    });

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      errors.push(`Transaction #${idx + 1} does not balance: Debits ($${totalDebit}) ≠ Credits ($${totalCredit}).`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Procedurally generates a complete, mathematically pristine, genuinely unique Canadian Accounting Cycle Case.
 * Guaranteed to produce balanced entries, Canadian ASPE/IFRS terminology, unique entity branding, and non-repeating content.
 */
export function generateCycleCase(caseNumber = 3, excludeNames?: Set<string> | string[]): MultiTransactionScenario {
  const seed = generateUniqueCanadianCompany(excludeNames);
  const year = 2027;
  const monthIdx = getRandomInt(0, 11);
  const monthName = MONTH_NAMES[monthIdx];
  const shortMonth = monthName.substring(0, 3);
  const daysInMonth = [3, 5, 8, 10, 11].includes(monthIdx) ? 30 : monthIdx === 1 ? 28 : 31;
  const caseId = `gen-cycle-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  // Calibrated monetary figures for clean monthly division
  // Capital contribution
  const capitalAmount = getRandomInt(30000, 70000, 5000);
  const shareCount = capitalAmount / 10;

  // Equipment purchase
  // Cost divisible by 60 months (5 years) or 48 months (4 years)
  const equipmentUsefulYears = pickRandom([4, 5]);
  const equipmentUsefulMonths = equipmentUsefulYears * 12;
  const monthlyDepreciation = pickRandom([200, 250, 300, 400, 500, 600]);
  const salvageValue = pickRandom([0, 1000, 2000]);
  const equipmentCost = monthlyDepreciation * equipmentUsefulMonths + salvageValue;
  
  // Down payment vs Note or AP
  const equipFinancingType = pickRandom(['note', 'ap', 'partial_cash']);
  let equipCashDown = 0;
  let equipCreditAcc = 'accounts_payable';
  let equipDebtAmount = equipmentCost;

  if (equipFinancingType === 'partial_cash') {
    equipCashDown = getRandomInt(4000, Math.floor(equipmentCost * 0.4), 1000);
    equipDebtAmount = equipmentCost - equipCashDown;
    equipCreditAcc = 'notes_payable';
  } else if (equipFinancingType === 'note') {
    equipCashDown = 0;
    equipDebtAmount = equipmentCost;
    equipCreditAcc = 'notes_payable';
  } else {
    equipCashDown = 0;
    equipDebtAmount = equipmentCost;
    equipCreditAcc = 'accounts_payable';
  }

  // Prepaid Insurance (1-year policy)
  const monthlyInsurance = pickRandom([150, 200, 250, 300, 350]);
  const totalInsurance = monthlyInsurance * 12;

  // Supplies on account
  const suppliesPurchased = getRandomInt(1200, 3200, 200);

  // Cash services performed
  const cashRevenue = getRandomInt(3500, 7500, 500);

  // Billed service on account
  const billedRevenue = getRandomInt(4000, 8500, 500);

  // Partial cash collection on account
  const collectedReceivable = getRandomInt(2000, billedRevenue - 1000, 500);

  // Operating expense: rent or utilities or salaries
  const salariesPaid = getRandomInt(2200, 4500, 100);
  const utilitiesPaid = getRandomInt(300, 650, 50);

  // Customer Advance (Unearned Revenue)
  const retainerMonths = pickRandom([3, 4, 6]);
  const monthlyRetainer = pickRandom([800, 1000, 1200, 1500]);
  const totalAdvanceRetainer = monthlyRetainer * retainerMonths;
  const earnedRetainerMonthEnd = monthlyRetainer; // 1 month fulfilled

  // Partial payment to supplier
  const supplierPayment = Math.min(suppliesPurchased, getRandomInt(1000, suppliesPurchased, 200));

  // Build the ordered transaction scenarios
  const transactions: AccountingScenario[] = [];

  // Tx 1: Capital Contribution
  transactions.push({
    id: `${caseId}-tx01`,
    title: 'Transaction 1: Founding Shareholders Capital Contribution',
    companyName: seed.companyName,
    date: `${shortMonth} 01, ${year}`,
    narrative: `Founders deposited $${capitalAmount.toLocaleString()} cash into the corporate bank account at ${seed.bankName} in exchange for ${shareCount.toLocaleString()} common shares.`,
    topic: 'Investments & Capital',
    difficulty: 'Beginner',
    hints: [
      'Cash is an Asset account and increases with a DEBIT.',
      'Under Canadian accounting standards (ASPE / IFRS), capital contributed by owners is credited to Common Shares (Shareholders\' Equity).'
    ],
    correctLines: [
      { accountId: 'cash', debit: capitalAmount, credit: 0 },
      { accountId: 'common_shares', debit: 0, credit: capitalAmount }
    ],
    explanation: `Founders invest equity capital into the corporation. Debit Cash (Asset) $${capitalAmount.toLocaleString()} and credit Common Shares (Shareholders' Equity) $${capitalAmount.toLocaleString()} under Canadian ASPE / IFRS.`,
    accountAnalysis: [
      { accountId: 'cash', action: 'Debit', amount: capitalAmount, reason: 'Cash increases on the Debit side.' },
      { accountId: 'common_shares', action: 'Credit', amount: capitalAmount, reason: 'Common Shares equity increases on the Credit side.' }
    ],
    equationImpact: {
      assets: capitalAmount,
      liabilities: 0,
      equity: capitalAmount,
      explanation: `Assets increase by $${capitalAmount.toLocaleString()} (Cash) = Shareholders' Equity increases by $${capitalAmount.toLocaleString()} (Common Shares).`
    }
  });

  // Tx 2: Operational Equipment Purchase
  if (equipFinancingType === 'partial_cash') {
    transactions.push({
      id: `${caseId}-tx02`,
      title: 'Transaction 2: Purchased Operational Equipment (Cash & Note)',
      companyName: seed.companyName,
      date: `${shortMonth} 03, ${year}`,
      narrative: `Purchased ${seed.equipmentType} for $${equipmentCost.toLocaleString()}. Paid $${equipCashDown.toLocaleString()} cash down and signed a $${equipDebtAmount.toLocaleString()} formal promissory Note Payable due in 24 months.`,
      topic: 'Supplies & Equipment',
      difficulty: 'Intermediate',
      hints: [
        `Equipment asset is recorded at total acquisition cost ($${equipmentCost.toLocaleString()}) with a DEBIT.`,
        `Cash paid out is credited ($${equipCashDown.toLocaleString()}).`,
        `The promissory note liability is credited ($${equipDebtAmount.toLocaleString()} to Notes Payable).`
      ],
      correctLines: [
        { accountId: 'equipment', debit: equipmentCost, credit: 0 },
        { accountId: 'cash', debit: 0, credit: equipCashDown },
        { accountId: 'notes_payable', debit: 0, credit: equipDebtAmount }
      ],
      explanation: `Equipment asset is recorded at total cost ($${equipmentCost.toLocaleString()}). Cash decreases by $${equipCashDown.toLocaleString()} and Notes Payable liability increases by $${equipDebtAmount.toLocaleString()}.`,
      accountAnalysis: [
        { accountId: 'equipment', action: 'Debit', amount: equipmentCost, reason: 'Equipment asset increases by full purchase cost.' },
        { accountId: 'cash', action: 'Credit', amount: equipCashDown, reason: 'Cash asset decreases with a Credit.' },
        { accountId: 'notes_payable', action: 'Credit', amount: equipDebtAmount, reason: 'Notes Payable liability increases with a Credit.' }
      ],
      equationImpact: {
        assets: equipmentCost - equipCashDown,
        liabilities: equipDebtAmount,
        equity: 0,
        explanation: `Net Assets increase by $${(equipmentCost - equipCashDown).toLocaleString()} (+$${equipmentCost.toLocaleString()} Equipment, -$${equipCashDown.toLocaleString()} Cash) = Liabilities increase by $${equipDebtAmount.toLocaleString()} (Notes Payable).`
      }
    });
  } else {
    transactions.push({
      id: `${caseId}-tx02`,
      title: 'Transaction 2: Purchased Equipment on Account',
      companyName: seed.companyName,
      date: `${shortMonth} 03, ${year}`,
      narrative: `Acquired ${seed.equipmentType} from ${seed.supplierName} for $${equipmentCost.toLocaleString()} on credit, with payment terms net 30 days.`,
      topic: 'Supplies & Equipment',
      difficulty: 'Beginner',
      hints: [
        'Equipment is an Asset and increases with a DEBIT.',
        'Purchasing on account creates a liability: Credit Accounts Payable.'
      ],
      correctLines: [
        { accountId: 'equipment', debit: equipmentCost, credit: 0 },
        { accountId: 'accounts_payable', debit: 0, credit: equipmentCost }
      ],
      explanation: `Debit Equipment (Asset) $${equipmentCost.toLocaleString()} and credit Accounts Payable (Liability) $${equipmentCost.toLocaleString()}.`,
      accountAnalysis: [
        { accountId: 'equipment', action: 'Debit', amount: equipmentCost, reason: 'Equipment asset increases with a Debit.' },
        { accountId: 'accounts_payable', action: 'Credit', amount: equipmentCost, reason: 'Accounts Payable increases with a Credit.' }
      ],
      equationImpact: {
        assets: equipmentCost,
        liabilities: equipmentCost,
        equity: 0,
        explanation: `Assets increase by $${equipmentCost.toLocaleString()} (Equipment) = Liabilities increase by $${equipmentCost.toLocaleString()} (Accounts Payable).`
      }
    });
  }

  // Tx 3: Prepaid Commercial Insurance
  transactions.push({
    id: `${caseId}-tx03`,
    title: 'Transaction 3: Prepaid 1-Year Commercial Liability Insurance',
    companyName: seed.companyName,
    date: `${shortMonth} 05, ${year}`,
    narrative: `Paid $${totalInsurance.toLocaleString()} cash in advance for a 1-year general commercial liability insurance policy providing coverage starting immediately ($${monthlyInsurance}/month).`,
    topic: 'Accruals & Deferrals',
    difficulty: 'Beginner',
    hints: [
      'Future insurance coverage benefit is an Asset: Debit Prepaid Insurance.',
      'Cash outflow decreases with a CREDIT.'
    ],
    correctLines: [
      { accountId: 'prepaid_insurance', debit: totalInsurance, credit: 0 },
      { accountId: 'cash', debit: 0, credit: totalInsurance }
    ],
    explanation: `Payment in advance provides future economic benefits and must be capitalized as an asset. Debit Prepaid Insurance $${totalInsurance.toLocaleString()} and credit Cash $${totalInsurance.toLocaleString()}.`,
    accountAnalysis: [
      { accountId: 'prepaid_insurance', action: 'Debit', amount: totalInsurance, reason: 'Prepaid Insurance asset increases with a Debit.' },
      { accountId: 'cash', action: 'Credit', amount: totalInsurance, reason: 'Cash asset decreases with a Credit.' }
    ],
    equationImpact: {
      assets: 0,
      liabilities: 0,
      equity: 0,
      explanation: `Asset exchange: +$${totalInsurance.toLocaleString()} Prepaid Insurance and -$${totalInsurance.toLocaleString()} Cash. Total assets and equity remain unchanged.`
    }
  });

  // Tx 4: Office Supplies on Account
  transactions.push({
    id: `${caseId}-tx04`,
    title: 'Transaction 4: Purchased Office Supplies on Account',
    companyName: seed.companyName,
    date: `${shortMonth} 08, ${year}`,
    narrative: `Purchased operational and office supplies for $${suppliesPurchased.toLocaleString()} on credit from ${seed.supplierName}, due in 30 days. The supplies are stored for future consumption.`,
    topic: 'Supplies & Equipment',
    difficulty: 'Beginner',
    hints: [
      'Supplies on hand represent an Asset: Debit Office Supplies.',
      'Purchased on credit: Credit Accounts Payable.'
    ],
    correctLines: [
      { accountId: 'supplies', debit: suppliesPurchased, credit: 0 },
      { accountId: 'accounts_payable', debit: 0, credit: suppliesPurchased }
    ],
    explanation: `Debit Office Supplies (Asset) $${suppliesPurchased.toLocaleString()} and credit Accounts Payable (Liability) $${suppliesPurchased.toLocaleString()}.`,
    accountAnalysis: [
      { accountId: 'supplies', action: 'Debit', amount: suppliesPurchased, reason: 'Office Supplies increases with a Debit.' },
      { accountId: 'accounts_payable', action: 'Credit', amount: suppliesPurchased, reason: 'Accounts Payable increases with a Credit.' }
    ],
    equationImpact: {
      assets: suppliesPurchased,
      liabilities: suppliesPurchased,
      equity: 0,
      explanation: `Assets increase by $${suppliesPurchased.toLocaleString()} (Office Supplies) = Liabilities increase by $${suppliesPurchased.toLocaleString()} (Accounts Payable).`
    }
  });

  // Tx 5: Cash Revenue Earned
  transactions.push({
    id: `${caseId}-tx05`,
    title: 'Transaction 5: Completed Client Services for Immediate Cash',
    companyName: seed.companyName,
    date: `${shortMonth} 12, ${year}`,
    narrative: `Delivered specialized ${seed.businessType} services to a local corporate client and collected $${cashRevenue.toLocaleString()} cash on completion.`,
    topic: 'Revenues & Receivables',
    difficulty: 'Beginner',
    hints: [
      'Cash collected increases with a DEBIT.',
      'Revenue earned from services provided increases with a CREDIT to Service Revenue.'
    ],
    correctLines: [
      { accountId: 'cash', debit: cashRevenue, credit: 0 },
      { accountId: 'service_revenue', debit: 0, credit: cashRevenue }
    ],
    explanation: `Debit Cash $${cashRevenue.toLocaleString()} and credit Service Revenue $${cashRevenue.toLocaleString()}. Revenue increases net income and shareholders' equity.`,
    accountAnalysis: [
      { accountId: 'cash', action: 'Debit', amount: cashRevenue, reason: 'Cash increases with a Debit of $' + cashRevenue.toLocaleString() + '.' },
      { accountId: 'service_revenue', action: 'Credit', amount: cashRevenue, reason: 'Service Revenue increases with a Credit of $' + cashRevenue.toLocaleString() + '.' }
    ],
    equationImpact: {
      assets: cashRevenue,
      liabilities: 0,
      equity: cashRevenue,
      explanation: `Assets increase by $${cashRevenue.toLocaleString()} (Cash) = Shareholders' Equity increases by $${cashRevenue.toLocaleString()} (Service Revenue).`
    }
  });

  // Tx 6: Services Billed on Account
  transactions.push({
    id: `${caseId}-tx06`,
    title: 'Transaction 6: Billed Client for Services Performed on Account',
    companyName: seed.companyName,
    date: `${shortMonth} 16, ${year}`,
    narrative: `Completed an extensive consulting project for ${seed.clientType} and issued an invoice for $${billedRevenue.toLocaleString()} on credit, terms net 30 days.`,
    topic: 'Revenues & Receivables',
    difficulty: 'Intermediate',
    hints: [
      'Under accrual accounting, revenue is recognized when services are performed, even if cash has not arrived.',
      'Debit Accounts Receivable for the right to collect.',
      'Credit Service Revenue for the earned income.'
    ],
    correctLines: [
      { accountId: 'accounts_receivable', debit: billedRevenue, credit: 0 },
      { accountId: 'service_revenue', debit: 0, credit: billedRevenue }
    ],
    explanation: `Under Canadian ASPE / IFRS accrual accounting, revenue is recognized when earned. Debit Accounts Receivable $${billedRevenue.toLocaleString()} and credit Service Revenue $${billedRevenue.toLocaleString()}.`,
    accountAnalysis: [
      { accountId: 'accounts_receivable', action: 'Debit', amount: billedRevenue, reason: 'Accounts Receivable increases with a Debit.' },
      { accountId: 'service_revenue', action: 'Credit', amount: billedRevenue, reason: 'Service Revenue increases with a Credit.' }
    ],
    equationImpact: {
      assets: billedRevenue,
      liabilities: 0,
      equity: billedRevenue,
      explanation: `Assets increase by $${billedRevenue.toLocaleString()} (Accounts Receivable) = Shareholders' Equity increases by $${billedRevenue.toLocaleString()} (Service Revenue).`
    }
  });

  // Tx 7: Customer Advance (Unearned Revenue)
  transactions.push({
    id: `${caseId}-tx07`,
    title: 'Transaction 7: Advance Retainer Received from Customer',
    companyName: seed.companyName,
    date: `${shortMonth} 20, ${year}`,
    narrative: `Received $${totalAdvanceRetainer.toLocaleString()} cash in advance from an enterprise client for a ${retainerMonths}-month service retainer ($${monthlyRetainer.toLocaleString()}/month). No services have been rendered yet.`,
    topic: 'Accruals & Deferrals',
    difficulty: 'Intermediate',
    hints: [
      'Cash is received: Debit Cash.',
      'Because work is not yet performed, this is a liability (unearned revenue): Credit Unearned Service Revenue.'
    ],
    correctLines: [
      { accountId: 'cash', debit: totalAdvanceRetainer, credit: 0 },
      { accountId: 'unearned_service_revenue', debit: 0, credit: totalAdvanceRetainer }
    ],
    explanation: `Collecting cash prior to satisfying performance obligations creates a contractual liability. Debit Cash $${totalAdvanceRetainer.toLocaleString()} and credit Unearned Service Revenue $${totalAdvanceRetainer.toLocaleString()}.`,
    accountAnalysis: [
      { accountId: 'cash', action: 'Debit', amount: totalAdvanceRetainer, reason: 'Cash increases with a Debit of $' + totalAdvanceRetainer.toLocaleString() + '.' },
      { accountId: 'unearned_service_revenue', action: 'Credit', amount: totalAdvanceRetainer, reason: 'Unearned Service Revenue liability increases with a Credit.' }
    ],
    equationImpact: {
      assets: totalAdvanceRetainer,
      liabilities: totalAdvanceRetainer,
      equity: 0,
      explanation: `Assets increase by $${totalAdvanceRetainer.toLocaleString()} (Cash) = Liabilities increase by $${totalAdvanceRetainer.toLocaleString()} (Unearned Service Revenue).`
    }
  });

  // Tx 8: Operating Expenses Paid in Cash (Compound Entry: Salaries & Utilities)
  const totalExpensePaid = salariesPaid + utilitiesPaid;
  transactions.push({
    id: `${caseId}-tx08`,
    title: 'Transaction 8: Paid Staff Salaries and Utility Bills in Cash',
    companyName: seed.companyName,
    date: `${shortMonth} 24, ${year}`,
    narrative: `Paid $${salariesPaid.toLocaleString()} cash for staff salaries and $${utilitiesPaid.toLocaleString()} cash for current monthly utilities (total cash disbursed $${totalExpensePaid.toLocaleString()}).`,
    topic: 'Operating Expenses',
    difficulty: 'Intermediate',
    hints: [
      'Expenses increase on the DEBIT side.',
      'Debit Salaries and Wages Expense and Debit Utilities Expense.',
      'Cash decreases with a CREDIT for the total amount.'
    ],
    correctLines: [
      { accountId: 'salaries_expense', debit: salariesPaid, credit: 0 },
      { accountId: 'utilities_expense', debit: utilitiesPaid, credit: 0 },
      { accountId: 'cash', debit: 0, credit: totalExpensePaid }
    ],
    explanation: `Debit Salaries and Wages Expense $${salariesPaid.toLocaleString()} and Utilities Expense $${utilitiesPaid.toLocaleString()} (total expenses $${totalExpensePaid.toLocaleString()}). Credit Cash $${totalExpensePaid.toLocaleString()}.`,
    accountAnalysis: [
      { accountId: 'salaries_expense', action: 'Debit', amount: salariesPaid, reason: 'Salaries Expense increases with a Debit.' },
      { accountId: 'utilities_expense', action: 'Debit', amount: utilitiesPaid, reason: 'Utilities Expense increases with a Debit.' },
      { accountId: 'cash', action: 'Credit', amount: totalExpensePaid, reason: 'Cash decreases with a Credit for total payout.' }
    ],
    equationImpact: {
      assets: -totalExpensePaid,
      liabilities: 0,
      equity: -totalExpensePaid,
      explanation: `Assets decrease by $${totalExpensePaid.toLocaleString()} (Cash) = Shareholders' Equity decreases by $${totalExpensePaid.toLocaleString()} (Total Expenses).`
    }
  });

  // Tx 9: Customer Partial Payment on Account
  transactions.push({
    id: `${caseId}-tx09`,
    title: 'Transaction 9: Collected Cash on Account from Client',
    companyName: seed.companyName,
    date: `${shortMonth} 28, ${year}`,
    narrative: `Collected $${collectedReceivable.toLocaleString()} cash from the client billed on ${shortMonth} 16 in partial settlement of their account balance.`,
    topic: 'Revenues & Receivables',
    difficulty: 'Beginner',
    hints: [
      'Cash increases: Debit Cash.',
      'Customer owed balance is reduced: Credit Accounts Receivable.'
    ],
    correctLines: [
      { accountId: 'cash', debit: collectedReceivable, credit: 0 },
      { accountId: 'accounts_receivable', debit: 0, credit: collectedReceivable }
    ],
    explanation: `Collecting cash from a credit customer increases Cash (debit $${collectedReceivable.toLocaleString()}) and reduces Accounts Receivable (credit $${collectedReceivable.toLocaleString()}). No revenue is recognized now because revenue was already recognized when billed.`,
    accountAnalysis: [
      { accountId: 'cash', action: 'Debit', amount: collectedReceivable, reason: 'Cash increases with a Debit.' },
      { accountId: 'accounts_receivable', action: 'Credit', amount: collectedReceivable, reason: 'Accounts Receivable decreases with a Credit.' }
    ],
    equationImpact: {
      assets: 0,
      liabilities: 0,
      equity: 0,
      explanation: `Asset exchange: +$${collectedReceivable.toLocaleString()} Cash, -$${collectedReceivable.toLocaleString()} Accounts Receivable. Total assets remain unchanged.`
    }
  });

  // Tx 10: Adjusting Entry - Insurance Expiration
  transactions.push({
    id: `${caseId}-tx10`,
    title: 'Transaction 10: Month-End Adjusting Entry: Insurance Expense',
    companyName: seed.companyName,
    date: `${shortMonth} ${daysInMonth}, ${year}`,
    narrative: `Record the month-end adjusting journal entry for 1 month of insurance expired from the $${totalInsurance.toLocaleString()} 1-year policy purchased on ${shortMonth} 05 ($${totalInsurance.toLocaleString()} ÷ 12 months = $${monthlyInsurance.toLocaleString()}).`,
    topic: 'Accruals & Deferrals',
    difficulty: 'Intermediate',
    hints: [
      `Monthly insurance cost = $${totalInsurance.toLocaleString()} ÷ 12 = $${monthlyInsurance.toLocaleString()}.`,
      'Debit Insurance Expense to recognize the cost of coverage used.',
      'Credit Prepaid Insurance to reduce the asset.'
    ],
    correctLines: [
      { accountId: 'insurance_expense', debit: monthlyInsurance, credit: 0 },
      { accountId: 'prepaid_insurance', debit: 0, credit: monthlyInsurance }
    ],
    explanation: `One month of insurance protection has expired. Debit Insurance Expense $${monthlyInsurance.toLocaleString()} and credit Prepaid Insurance $${monthlyInsurance.toLocaleString()}.`,
    accountAnalysis: [
      { accountId: 'insurance_expense', action: 'Debit', amount: monthlyInsurance, reason: 'Insurance Expense increases with a Debit of $' + monthlyInsurance.toLocaleString() + '.' },
      { accountId: 'prepaid_insurance', action: 'Credit', amount: monthlyInsurance, reason: 'Prepaid Insurance asset decreases with a Credit of $' + monthlyInsurance.toLocaleString() + '.' }
    ],
    equationImpact: {
      assets: -monthlyInsurance,
      liabilities: 0,
      equity: -monthlyInsurance,
      explanation: `Assets decrease by $${monthlyInsurance.toLocaleString()} (Prepaid Insurance) = Shareholders' Equity decreases by $${monthlyInsurance.toLocaleString()} (Insurance Expense).`
    }
  });

  // Tx 11: Adjusting Entry - Unearned Revenue Earned
  transactions.push({
    id: `${caseId}-tx11`,
    title: 'Transaction 11: Month-End Adjusting Entry: Unearned Revenue Earned',
    companyName: seed.companyName,
    date: `${shortMonth} ${daysInMonth}, ${year}`,
    narrative: `During the final week of the month, ${seed.companyName} fulfilled and completed 1 month of the retainer contract for which an advance of $${totalAdvanceRetainer.toLocaleString()} was received on ${shortMonth} 20 ($${totalAdvanceRetainer.toLocaleString()} ÷ ${retainerMonths} months = $${earnedRetainerMonthEnd.toLocaleString()}). Record the adjusting entry to recognize earned revenue.`,
    topic: 'Accruals & Deferrals',
    difficulty: 'Intermediate',
    hints: [
      `The unearned obligation is fulfilled by $${earnedRetainerMonthEnd.toLocaleString()}: Debit Unearned Service Revenue.`,
      `Service Revenue is earned: Credit Service Revenue for $${earnedRetainerMonthEnd.toLocaleString()}.`
    ],
    correctLines: [
      { accountId: 'unearned_service_revenue', debit: earnedRetainerMonthEnd, credit: 0 },
      { accountId: 'service_revenue', debit: 0, credit: earnedRetainerMonthEnd }
    ],
    explanation: `Fulfilling the service satisfies $${earnedRetainerMonthEnd.toLocaleString()} of the advance liability. Debit Unearned Service Revenue $${earnedRetainerMonthEnd.toLocaleString()} and credit Service Revenue $${earnedRetainerMonthEnd.toLocaleString()}.`,
    accountAnalysis: [
      { accountId: 'unearned_service_revenue', action: 'Debit', amount: earnedRetainerMonthEnd, reason: 'Unearned Service Revenue liability decreases with a Debit.' },
      { accountId: 'service_revenue', action: 'Credit', amount: earnedRetainerMonthEnd, reason: 'Service Revenue increases with a Credit.' }
    ],
    equationImpact: {
      assets: 0,
      liabilities: -earnedRetainerMonthEnd,
      equity: earnedRetainerMonthEnd,
      explanation: `Liabilities decrease by $${earnedRetainerMonthEnd.toLocaleString()} (Unearned Service Revenue) and Shareholders' Equity increases by $${earnedRetainerMonthEnd.toLocaleString()} (Service Revenue). Assets are unchanged.`
    }
  });

  // Tx 12: Adjusting Entry - Equipment Depreciation
  transactions.push({
    id: `${caseId}-tx12`,
    title: 'Transaction 12: Month-End Adjusting Entry: Equipment Depreciation',
    companyName: seed.companyName,
    date: `${shortMonth} ${daysInMonth}, ${year}`,
    narrative: `Record 1 month of straight-line depreciation on the ${seed.equipmentType} acquired on ${shortMonth} 03 (Cost: $${equipmentCost.toLocaleString()}, Salvage Value: $${salvageValue.toLocaleString()}, Useful Life: ${equipmentUsefulYears} years / ${equipmentUsefulMonths} months). Formula: ($${equipmentCost.toLocaleString()} - $${salvageValue.toLocaleString()}) ÷ ${equipmentUsefulMonths} = $${monthlyDepreciation.toLocaleString()}/month.`,
    topic: 'Accruals & Deferrals',
    difficulty: 'Intermediate',
    hints: [
      `Monthly Depreciation = ($${equipmentCost.toLocaleString()} - $${salvageValue.toLocaleString()}) ÷ ${equipmentUsefulMonths} = $${monthlyDepreciation.toLocaleString()}.`,
      'Debit Depreciation Expense to record the operating expense.',
      'Under Canadian ASPE / IFRS, credit the contra-asset Accumulated Depreciation - Equipment, NOT Equipment directly.'
    ],
    correctLines: [
      { accountId: 'depreciation_expense', debit: monthlyDepreciation, credit: 0 },
      { accountId: 'accumulated_depreciation_equipment', debit: 0, credit: monthlyDepreciation }
    ],
    explanation: `Debit Depreciation Expense $${monthlyDepreciation.toLocaleString()} to recognize the operational cost of the equipment. Credit Accumulated Depreciation - Equipment $${monthlyDepreciation.toLocaleString()} (contra-asset) to reflect accumulated usage while maintaining historical acquisition cost on the Statement of Financial Position.`,
    accountAnalysis: [
      { accountId: 'depreciation_expense', action: 'Debit', amount: monthlyDepreciation, reason: 'Depreciation Expense increases on the Debit side.' },
      { accountId: 'accumulated_depreciation_equipment', action: 'Credit', amount: monthlyDepreciation, reason: 'Accumulated Depreciation contra-asset increases on the Credit side.' }
    ],
    equationImpact: {
      assets: -monthlyDepreciation,
      liabilities: 0,
      equity: -monthlyDepreciation,
      explanation: `Assets decrease by $${monthlyDepreciation.toLocaleString()} (via contra-asset Accumulated Depreciation) = Shareholders' Equity decreases by $${monthlyDepreciation.toLocaleString()} (Depreciation Expense).`
    }
  });

  const generatedCase: MultiTransactionScenario = {
    id: caseId,
    title: `Case ${caseNumber}: ${seed.companyName} — Opening Cycle Flow`,
    companyName: seed.companyName,
    businessType: seed.businessType,
    description: `Complete the initial operating month for ${seed.companyName} in ${seed.location}. As you journalize each event, observe the ledger T-accounts, trial balance, and financial statements updating in real time.`,
    transactions
  };

  // Self-validation
  const validation = validateCycleCase(generatedCase);
  if (!validation.isValid) {
    console.error('Generated case validation failed:', validation.errors);
  }

  return generatedCase;
}
