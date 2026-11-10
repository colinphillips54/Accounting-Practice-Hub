import {
  Account,
  EvaluationResult,
  FinancialStatements,
  JournalEntryLine,
  LedgerPosting,
  TAccountData,
  TrialBalanceRow,
  AccountingScenario,
  GuidedHint
} from '../types/accounting';
import { CHART_OF_ACCOUNTS, getAccount } from '../data/accounts';

/**
 * Evaluates a student's submitted journal entry against the target solution.
 */
/**
 * Evaluates a student's submitted journal entry against the target solution.
 * Handles validation notices without consuming attempts, and generates progressive
 * guided hints for attempts 1 and 2 before revealing the full solution on attempt 3.
 */
export function evaluateJournalEntry(
  userLines: JournalEntryLine[],
  correctLines: { accountId: string; debit: number; credit: number }[],
  scenario?: AccountingScenario,
  attemptNumber = 1,
  maxAttempts = 3
): EvaluationResult {
  // 1. VALIDATION CHECKS (Incomplete, Empty, or Unbalanced entries)
  // These DO NOT count as an attempt!

  // A. Check for completely blank form
  const hasAnyInput = userLines.some(
    l => (l.accountId && l.accountId.trim() !== '') || (l.debit !== null && l.debit > 0) || (l.credit !== null && l.credit > 0)
  );

  if (!hasAnyInput) {
    return {
      isCorrect: false,
      score: 0,
      isValidationNotice: true,
      validationTitle: 'Empty Journal Entry',
      issues: [
        'No accounts or amounts were entered. Please select account titles and enter debit and credit amounts for each side of the transaction.'
      ],
      lineFeedback: [],
      missingLines: []
    };
  }

  // B. Check for rows with an account selected but missing an amount
  const missingAmountIndices: number[] = [];
  userLines.forEach((l, idx) => {
    if (l.accountId && (!l.debit || l.debit <= 0) && (!l.credit || l.credit <= 0)) {
      missingAmountIndices.push(idx + 1);
    }
  });

  if (missingAmountIndices.length > 0) {
    return {
      isCorrect: false,
      score: 0,
      isValidationNotice: true,
      validationTitle: 'Missing Amount',
      issues: [
        `Line ${missingAmountIndices.join(', ')} has an account selected, but no amount was entered. Please enter a debit or credit amount.`
      ],
      lineFeedback: [],
      missingLines: []
    };
  }

  // C. Check for rows with an amount entered but no account selected
  const missingAccountIndices: number[] = [];
  userLines.forEach((l, idx) => {
    if (!l.accountId && ((l.debit && l.debit > 0) || (l.credit && l.credit > 0))) {
      missingAccountIndices.push(idx + 1);
    }
  });

  if (missingAccountIndices.length > 0) {
    return {
      isCorrect: false,
      score: 0,
      isValidationNotice: true,
      validationTitle: 'Missing Account Title',
      issues: [
        `Line ${missingAccountIndices.join(', ')} has a dollar amount entered, but no account title is selected. Please choose the appropriate account.`
      ],
      lineFeedback: [],
      missingLines: []
    };
  }

  // Active lines that have both an account and an amount
  const activeUserLines = userLines.filter(
    line => line.accountId && ((line.debit && line.debit > 0) || (line.credit && line.credit > 0))
  );

  // D. Check for fewer than 2 active lines (not a double entry)
  if (activeUserLines.length < 2) {
    return {
      isCorrect: false,
      score: 0,
      isValidationNotice: true,
      validationTitle: 'Incomplete Double-Entry Transaction',
      issues: [
        'Double-entry accounting requires at least two accounts (at least one debit and one credit). Please complete both sides of the transaction before evaluating.'
      ],
      lineFeedback: [],
      missingLines: []
    };
  }

  // E. Check for unbalanced debits and credits
  const totalUserDebit = activeUserLines.reduce((sum, l) => sum + (l.debit || 0), 0);
  const totalUserCredit = activeUserLines.reduce((sum, l) => sum + (l.credit || 0), 0);
  const roundedUserDebit = Math.round(totalUserDebit);
  const roundedUserCredit = Math.round(totalUserCredit);
  const diff = Math.abs(roundedUserDebit - roundedUserCredit);

  if (diff >= 1) {
    return {
      isCorrect: false,
      score: 0,
      isValidationNotice: true,
      validationTitle: 'Unbalanced Journal Entry (Debits ≠ Credits)',
      issues: [
        `Total Debits ($${roundedUserDebit.toLocaleString()}) do not equal Total Credits ($${roundedUserCredit.toLocaleString()}). Difference is $${diff.toLocaleString()}. Round all answers to the nearest whole dollar and ensure total debits equal total credits.`
      ],
      lineFeedback: [],
      missingLines: []
    };
  }

  // 2. SUBSTANTIVE EVALUATION (Complete & Balanced Entry)
  const matchedTargetIndices = new Set<number>();
  const lineFeedback: EvaluationResult['lineFeedback'] = [];
  const issues: string[] = [];

  activeUserLines.forEach((userLine, uIdx) => {
    const userDebit = userLine.debit || 0;
    const userCredit = userLine.credit || 0;
    const account = getAccount(userLine.accountId);
    const accountName = account ? account.name : userLine.accountId;

    // Try to find exact match in target lines that hasn't been matched yet
    let exactTargetIdx = -1;
    for (let tIdx = 0; tIdx < correctLines.length; tIdx++) {
      if (matchedTargetIndices.has(tIdx)) continue;
      const tLine = correctLines[tIdx];

      const userRoundedDebit = Math.round(userDebit);
      const userRoundedCredit = Math.round(userCredit);
      const targetRoundedDebit = Math.round(tLine.debit);
      const targetRoundedCredit = Math.round(tLine.credit);

      const debitMatches =
        (tLine.debit === 0 && userDebit === 0) ||
        (tLine.debit > 0 && (
          Math.abs(tLine.debit - userDebit) < 0.01 ||
          targetRoundedDebit === userRoundedDebit ||
          Math.abs(tLine.debit - userDebit) <= 0.51
        ));

      const creditMatches =
        (tLine.credit === 0 && userCredit === 0) ||
        (tLine.credit > 0 && (
          Math.abs(tLine.credit - userCredit) < 0.01 ||
          targetRoundedCredit === userRoundedCredit ||
          Math.abs(tLine.credit - userCredit) <= 0.51
        ));

      if (
        tLine.accountId === userLine.accountId &&
        debitMatches &&
        creditMatches
      ) {
        exactTargetIdx = tIdx;
        break;
      }
    }

    if (exactTargetIdx !== -1) {
      matchedTargetIndices.add(exactTargetIdx);
      const dispAmt = Math.round(userDebit > 0 ? userDebit : userCredit);
      lineFeedback.push({
        userLineIndex: uIdx,
        status: 'correct',
        message: `✓ Correct: ${accountName} ${userDebit > 0 ? `Debited $${dispAmt.toLocaleString()}` : `Credited $${dispAmt.toLocaleString()}`}`
      });
      return;
    }

    // Check if account matches but side or amount is wrong
    let accountTargetIdx = -1;
    for (let tIdx = 0; tIdx < correctLines.length; tIdx++) {
      if (matchedTargetIndices.has(tIdx)) continue;
      if (correctLines[tIdx].accountId === userLine.accountId) {
        accountTargetIdx = tIdx;
        break;
      }
    }

    if (accountTargetIdx !== -1) {
      const target = correctLines[accountTargetIdx];
      matchedTargetIndices.add(accountTargetIdx);

      // Reversed debit/credit check
      if (
        (userDebit > 0 && target.credit > 0) ||
        (userCredit > 0 && target.debit > 0)
      ) {
        lineFeedback.push({
          userLineIndex: uIdx,
          status: 'wrong-side',
          message: `Inverted Side: ${accountName} was entered on the incorrect side.`
        });
        issues.push(`You inverted the entry for ${accountName}. Check whether this account should be debited or credited.`);
      } else {
        // Wrong amount
        const targetAmt = Math.round(target.debit || target.credit);
        const userAmt = Math.round(userDebit || userCredit);
        lineFeedback.push({
          userLineIndex: uIdx,
          status: 'wrong-amount',
          message: `Amount Mismatch: ${accountName} was entered as $${userAmt.toLocaleString()}, which does not match the expected whole-dollar amount ($${targetAmt.toLocaleString()}).`
        });
        issues.push(`The dollar amount entered for ${accountName} is incorrect. Round all answers to the nearest whole dollar.`);
      }
      return;
    }

    // Account does not belong in this entry
    lineFeedback.push({
      userLineIndex: uIdx,
      status: 'unneeded',
      message: `Incorrect Account: ${accountName} is not the expected account for this transaction.`
    });
    issues.push(`${accountName} is not used in this transaction.`);
  });

  // Check missing lines
  const missingLines: EvaluationResult['missingLines'] = [];
  correctLines.forEach((tLine, tIdx) => {
    if (!matchedTargetIndices.has(tIdx)) {
      missingLines.push(tLine);
      const acc = getAccount(tLine.accountId);
      const accName = acc ? acc.name : tLine.accountId;
      issues.push(`Missing entry for ${accName}.`);
    }
  });

  const totalLines = correctLines.length;
  const correctlyMatchedLines = lineFeedback.filter(f => f.status === 'correct').length;
  const isCorrect = correctlyMatchedLines === totalLines && activeUserLines.length === totalLines;

  let score = 0;
  if (isCorrect) {
    score = 100;
  } else {
    const lineRatio = correctlyMatchedLines / totalLines;
    score = Math.max(0, Math.round(lineRatio * 75));
  }

  // 3. GENERATE SOCRATIC GUIDED HINTS (for attempt 1)
  const guidedHints: GuidedHint[] = [];

  if (!isCorrect && attemptNumber === 1) {
    // Attempt 1: Conceptual DEALER guidance only - NO account names, NO debit/credit solutions
    guidedHints.push({
      type: 'general',
      title: 'Analyze the Business Transaction',
      hint: 'Identify what economic resources were received, delivered, or consumed. For each element, determine whether it represents an Asset, Liability, Equity, Revenue, or Expense.'
    });

    guidedHints.push({
      type: 'side',
      title: 'Apply the DEALER Framework',
      hint: 'Recall normal balances: Dividends, Expenses, and Assets (DEA) increase with Debits. Liabilities, Equity, and Revenues (LER) increase with Credits.'
    });

    guidedHints.push({
      type: 'amount',
      title: 'Perform Calculations Independently',
      hint: 'Carefully compute amounts such as monthly allocations, interest, or discounts using the numbers provided in the scenario. The relevant calculation breakdown unlocks after attempt 2.'
    });
  }

  return {
    isCorrect,
    score,
    isValidationNotice: false,
    attemptNumber,
    maxAttempts,
    guidedHints,
    issues,
    lineFeedback,
    missingLines,
    calculationDetail: attemptNumber >= 2 ? scenario?.calculationDetail : undefined
  };
}

/**
 * Calculates General Ledger T-Accounts from a collection of posted journal entries.
 */
export function calculateLedger(
  postedEntries: { date: string; reference: string; lines: { accountId: string; debit: number; credit: number }[] }[]
): TAccountData[] {
  const accountPostingsMap = new Map<string, LedgerPosting[]>();

  // Initialize accounts with empty postings
  CHART_OF_ACCOUNTS.forEach(acc => {
    accountPostingsMap.set(acc.id, []);
  });

  // Post each entry
  postedEntries.forEach(entry => {
    entry.lines.forEach(line => {
      const postings = accountPostingsMap.get(line.accountId) || [];
      postings.push({
        date: entry.date,
        reference: entry.reference,
        description: line.debit > 0 ? 'Debit Posting' : 'Credit Posting',
        debit: line.debit,
        credit: line.credit
      });
      accountPostingsMap.set(line.accountId, postings);
    });
  });

  const ledgerData: TAccountData[] = [];

  CHART_OF_ACCOUNTS.forEach(account => {
    const postings = accountPostingsMap.get(account.id) || [];
    if (postings.length === 0) return; // Skip inactive accounts

    const totalDebits = postings.reduce((sum, p) => sum + p.debit, 0);
    const totalCredits = postings.reduce((sum, p) => sum + p.credit, 0);

    let balance = 0;
    let balanceType: 'Debit' | 'Credit' = account.normalBalance;

    if (account.normalBalance === 'Debit') {
      balance = totalDebits - totalCredits;
      if (balance < 0) {
        balance = Math.abs(balance);
        balanceType = 'Credit'; // Abnormal balance
      }
    } else {
      balance = totalCredits - totalDebits;
      if (balance < 0) {
        balance = Math.abs(balance);
        balanceType = 'Debit'; // Abnormal balance
      }
    }

    ledgerData.push({
      account,
      postings,
      totalDebits,
      totalCredits,
      balance,
      balanceType
    });
  });

  return ledgerData;
}

/**
 * Generates an Adjusted Trial Balance from the Ledger data.
 */
export function generateTrialBalance(ledgerData: TAccountData[]): {
  rows: TrialBalanceRow[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
} {
  const rows: TrialBalanceRow[] = [];
  let totalDebit = 0;
  let totalCredit = 0;

  ledgerData.forEach(item => {
    if (item.balance === 0) return;

    if (item.balanceType === 'Debit') {
      rows.push({ account: item.account, debit: item.balance, credit: 0 });
      totalDebit += item.balance;
    } else {
      rows.push({ account: item.account, debit: 0, credit: item.balance });
      totalCredit += item.balance;
    }
  });

  return {
    rows,
    totalDebit,
    totalCredit,
    isBalanced: Math.abs(totalDebit - totalCredit) < 0.01
  };
}

/**
 * Compiles Financial Statements (Income Statement, Retained Earnings, Balance Sheet)
 * directly from the Trial Balance data.
 */
export function generateFinancialStatements(
  trialBalanceRows: TrialBalanceRow[],
  beginningRetainedEarnings = 0
): FinancialStatements {
  // Income Statement
  const revenues: { account: Account; amount: number }[] = [];
  const expenses: { account: Account; amount: number }[] = [];
  let dividends = 0;

  // Balance sheet containers
  const currentAssets: { account: Account; amount: number }[] = [];
  const nonCurrentAssets: { account: Account; amount: number }[] = [];
  const currentLiabilities: { account: Account; amount: number }[] = [];
  const longTermLiabilities: { account: Account; amount: number }[] = [];
  let commonShares = 0;

  trialBalanceRows.forEach(row => {
    const acc = row.account;
    const debit = row.debit;
    const credit = row.credit;

    if (acc.category === 'Revenue') {
      const netRev = credit - debit;
      revenues.push({ account: acc, amount: netRev });
    } else if (acc.category === 'Expense') {
      const netExp = debit - credit;
      expenses.push({ account: acc, amount: netExp });
    } else if (acc.category === 'Dividend') {
      dividends += (debit - credit);
    } else if (acc.category === 'Asset') {
      const netAsset = debit - credit;
      if (acc.id === 'equipment' || acc.id === 'building') {
        nonCurrentAssets.push({ account: acc, amount: netAsset });
      } else {
        currentAssets.push({ account: acc, amount: netAsset });
      }
    } else if (acc.category === 'ContraAsset') {
      // Contra asset carries credit normal balance and reduces non-current assets
      const netContra = credit - debit;
      nonCurrentAssets.push({ account: acc, amount: -netContra });
    } else if (acc.category === 'Liability') {
      // Liabilities carry credit normal balance; if debited, net liability decreases
      const netLiab = credit - debit;
      if (acc.id === 'notes_payable') {
        longTermLiabilities.push({ account: acc, amount: netLiab });
      } else {
        currentLiabilities.push({ account: acc, amount: netLiab });
      }
    } else if (acc.category === 'Equity') {
      const netEquity = credit - debit;
      if (acc.id === 'common_shares' || acc.id === 'common_stock') {
        commonShares += netEquity;
      }
    }
  });

  const totalRevenue = revenues.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

  // Retained Earnings Statement
  const endingRetainedEarnings = beginningRetainedEarnings + netIncome - dividends;

  // Balance Sheet Totals
  const totalCurrentAssets = currentAssets.reduce((s, a) => s + a.amount, 0);
  const totalNonCurrentAssets = nonCurrentAssets.reduce((s, a) => s + a.amount, 0);
  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

  const totalCurrentLiabilities = currentLiabilities.reduce((s, l) => s + l.amount, 0);
  const totalLongTermLiabilities = longTermLiabilities.reduce((s, l) => s + l.amount, 0);
  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

  const totalEquity = commonShares + endingRetainedEarnings;
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01;

  return {
    incomeStatement: {
      revenues,
      totalRevenue,
      expenses,
      totalExpenses,
      netIncome
    },
    retainedEarningsStatement: {
      beginningRetainedEarnings,
      netIncome,
      dividends,
      endingRetainedEarnings
    },
    balanceSheet: {
      currentAssets,
      totalCurrentAssets,
      nonCurrentAssets,
      totalNonCurrentAssets,
      totalAssets,
      currentLiabilities,
      totalCurrentLiabilities,
      longTermLiabilities,
      totalLongTermLiabilities,
      totalLiabilities,
      commonShares,
      commonStock: commonShares,
      endingRetainedEarnings,
      totalEquity,
      totalLiabilitiesAndEquity,
      isBalanced
    }
  };
}
