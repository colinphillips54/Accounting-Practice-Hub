/**
 * Educational Accounting Knowledge & Socratic Reasoning Engine
 * Aligned with Canadian Accounting Standards (IFRS & ASPE)
 */

export interface TutorContext {
  question: string;
  scenarioTitle?: string;
  scenarioNarrative?: string;
  scenarioTopic?: string;
  companyName?: string;
  userEntry?: Array<{ accountId: string; debit: number | null; credit: number | null }> | any[];
  correctEntry?: Array<{ accountId: string; debit: number | null; credit: number | null }> | any[];
}

/**
 * Builds a comprehensive, expert pedagogical prompt for Gemini models.
 */
export function buildGeminiTutorPrompt(context: TutorContext): string {
  const { question, scenarioTitle, scenarioNarrative, scenarioTopic, companyName, userEntry, correctEntry } = context;

  return `You are a distinguished Canadian university accounting professor providing one-on-one Socratic tutoring for introductory financial accounting.
The curriculum adheres strictly to Canadian Accounting Standards:
- IFRS (Part I of CPA Canada Handbook, mandatory for publicly accountable enterprises)
- ASPE (Accounting Standards for Private Enterprises, Part II of CPA Canada Handbook)

STUDENT'S INQUIRY:
"${question}"

PRACTICE CONTEXT (if applicable):
- Topic: ${scenarioTopic || 'General Financial Accounting'}
- Entity / Company: ${companyName || 'Not specified'}
- Scenario Title: ${scenarioTitle || 'N/A'}
- Scenario Narrative: ${scenarioNarrative || 'N/A'}
- Student's Current Journal Entry: ${userEntry && userEntry.length > 0 ? JSON.stringify(userEntry) : 'No entry attempted yet'}
- Reference Correct Entry: ${correctEntry && correctEntry.length > 0 ? JSON.stringify(correctEntry) : 'N/A'}

YOUR INSTRUCTIONS:
1. DIRECT & RELEVANT: Address the student's specific question directly in the very first sentence. Do NOT provide a generic accounting overview or recite general mnemonics (like DEALER) unless the student explicitly asks about normal balances or mnemonics.
2. CONCEPTUAL & ECONOMIC REASONING: Explain the underlying accounting treatment and economic reality. Why does this accounting treatment exist? (e.g., accrual accounting, revenue recognition principle under IFRS 15 / ASPE 3400, matching/cost allocation principle under IAS 16 / ASPE 3061).
3. ACCOUNTS & CLASSIFICATION: Explicitly identify the specific accounts involved and their balance sheet / income statement classification (Asset, Liability, Shareholders' Equity, Revenue, Expense, or Contra-Asset).
4. DEMONSTRATE JOURNAL ENTRY: Format the journal entry as a clean markdown table:
| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Account to Debit** | $Amount | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Account to Credit (indented)** | | $Amount |
5. FINANCIAL STATEMENT IMPACTS: Detail how this entry flows through:
   - Income Statement: Impact on Net Income (Revenues / Expenses).
   - Statement of Financial Position (Balance Sheet): Impact on Assets, Liabilities, and Shareholders' Equity, showing that Assets = Liabilities + Shareholders' Equity remains perfectly balanced.
6. CANADIAN STANDARDS TERMINOLOGY:
   - Use "Shareholders' Equity" (never "Stockholders' Equity").
   - Use "Common Shares" (never "Common Stock", noting that under Canadian corporate statutes like the CBCA, shares are without nominal or par value).
   - Use "Statement of Financial Position (Balance Sheet)" or "Statement of Financial Position".
   - If inventory is discussed, note that LIFO is strictly prohibited under IAS 2 and ASPE 3031.
7. CRITICAL FORMATTING RULES:
   - DO NOT USE LATEX COMMANDS: Never output LaTeX syntax such as \\rightarrow, \\to, \\Delta, \\text, \\mathbf, or $. Use clean plain text and standard symbols (→, =, Δ, ×).
   - DO NOT USE SINGLE-QUOTE CODE BLOCKS: Never write '''text or '''. Use standard markdown tables or bold lists.
   - USE DOUBLE NEWLINES: Place an empty blank line (\\n\\n) between every heading, paragraph, table, and bullet list so sections are clearly separated with proper breathing room.`;
}

export interface TutorFaq {
  id: string;
  category: 'Journal Entries' | 'Adjusting Entries' | 'Financial Statements' | 'Depreciation' | 'Inventory' | 'Revenue Recognition' | 'Liabilities' | 'Assets' | 'Standards';
  question: string;
  response: string;
}

export const ACCOUNTING_FAQS: TutorFaq[] = [
  // 1. Journal Entries
  {
    id: 'faq-expenses-debit',
    category: 'Journal Entries',
    question: 'Why do expenses have a normal debit balance if they decrease Shareholders\' Equity?',
    response: `### Why Expenses Have a Normal Debit Balance

**1. The Accounting Logic of Debits and Equity Reductions**

Students often find it counterintuitive that expenses have a **Debit normal balance** when Shareholders' Equity has a **Credit normal balance**. Here is the mathematical and economic explanation:

* **The Expanded Accounting Equation:**
  $$\\text{Assets} + \\text{Expenses} + \\text{Dividends} = \\text{Liabilities} + \\text{Common Shares} + \\text{Revenues}$$
  In Canadian standard notation:
  **Assets + Expenses + Dividends (Left Side / DEBIT increases)** = **Liabilities + Equity + Revenues (Right Side / CREDIT increases)**
* Because Net Income = Revenues − Expenses, an increase in an expense **reduces** Net Income, which in turn **reduces** ending Retained Earnings in Shareholders' Equity.
* In double-entry bookkeeping, to **decrease** an account with a normal Credit balance (like Shareholders' Equity), you must record a **Debit**. Therefore, all expenses naturally accumulate as Debits during the period!

**2. Demonstrated Flow to Financial Statements**

| Account Category | Normal Balance | To Increase | To Decrease | Effect on Shareholders' Equity |
| :--- | :--- | :--- | :--- | :--- |
| **Revenues** | Credit | Credit | Debit | **Increases Equity** |
| **Expenses** | Debit | Debit | Credit | **Decreases Equity** |

**3. Closing Process Connection**

At the end of the accounting period, all temporary expense accounts (which carry Debit balances) are closed by **Crediting** each expense account and **Debiting** Income Summary or Retained Earnings directly. This debit to Retained Earnings officially decreases Shareholders' Equity on the Statement of Financial Position.`
  },
  {
    id: 'faq-dealer-framework',
    category: 'Journal Entries',
    question: 'Why do debits always equal credits in double-entry bookkeeping (the DEALER framework)?',
    response: `### Rules of Debits and Credits & Normal Balances

**1. The DEALER Framework**

The easiest way to master debits and credits under Canadian accounting standards is the **DEALER** acronym:

| Letter | Category | Normal Balance | To Increase | To Decrease |
| :--- | :--- | :--- | :--- | :--- |
| **D** | **Dividends** | **Debit** | Debit | Credit |
| **E** | **Expenses** | **Debit** | Debit | Credit |
| **A** | **Assets** | **Debit** | Debit | Credit |
| **L** | **Liabilities** | **Credit** | Credit | Debit |
| **E** | **Equity (Common Shares / Retained Earnings)** | **Credit** | Credit | Debit |
| **R** | **Revenues** | **Credit** | Credit | Debit |

**2. The Fundamental Accounting Equation**

$$\\text{Assets} = \\text{Liabilities} + \\text{Shareholders' Equity}$$

* **Debit:** Simply means the **left side** of an account.
* **Credit:** Simply means the **right side** of an account.
* Every transaction must have at least one debit and one credit, and the total dollar amount of debits must **always equal** total credits.`
  },
  {
    id: 'faq-cbca-common-shares',
    category: 'Journal Entries',
    question: 'How do Common Shares work under Canadian corporate law (CBCA/OBCA) without par value?',
    response: `### Common Shares Under Canadian Corporate Law (CBCA / OBCA)

**1. Underlying Corporate Statute & Accounting Framework**

Under Canadian federal corporate law (the *Canada Business Corporations Act* — CBCA) and provincial counterparts (such as the *Ontario Business Corporations Act* — OBCA), Canadian corporations issue **Common Shares** rather than the American concept of "Common Stock."

* **Key Canadian Statute Requirement:** All common and preferred shares issued by CBCA and OBCA corporations must be issued **without nominal or par value**.
* Under Canadian accounting standards (**IFRS & ASPE Section 3251**), there are no separate accounts for "Common Stock" and "Additional Paid-in Capital / Contributed Surplus" upon initial cash issuance. The **entire consideration received** is credited directly to **Common Shares**.

**2. Accounts Involved and Classifications**

* **Cash** (*Current Asset*, Normal Debit Balance): The liquid capital received from shareholders increases total corporate resources (**Debit**).
* **Common Shares** (*Shareholders' Equity*, Normal Credit Balance): Represents the ownership equity interest contributed by founders or investors (**Credit**).

**3. Demonstrated Journal Entry**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Cash** | $25,000 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Common Shares** | | $25,000 |

*(To record issuance of 10,000 common shares without par value for cash)*

**4. Financial Statement Impacts**

* **Income Statement:** Zero effect. Share issuances are financing capital transactions, not operational revenues.
* **Statement of Financial Position:** Assets increase (+Cash) and Shareholders' Equity increases (+Common Shares) by the exact same dollar amount. The fundamental accounting equation remains perfectly balanced.`
  },
  {
    id: 'faq-dividends-accounting',
    category: 'Journal Entries',
    question: 'How do you record dividends declared and paid, and why are dividends not an operating expense?',
    response: `### Accounting for Dividends Declared and Paid

**1. Underlying Accounting Treatment**

Under Canadian accounting standards (**ASPE Section 3251** and **IAS 1**), dividends represent a voluntary distribution of accumulated corporate wealth back to the company's **shareholders**.

* **Crucial Student Distinction:** Dividends are **never** an expense on the Income Statement! Expenses are costs incurred to generate revenue; dividends are an allocation of profits already earned.

**2. Accounts Involved and Classifications**

* **Dividends** (*Contra-Equity / Temporary Account*, Normal Debit Balance): Tracks distributions declared during the period. It increases on the **Debit** side because it directly reduces Retained Earnings.
* **Cash** (*Current Asset*, Normal Debit Balance): Asset paid out to shareholders, reduced with a **Credit**.

**3. Demonstrated Journal Entry**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Dividends** | $2,500 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Cash** | | $2,500 |

*(To record cash dividend declared and paid to shareholders)*

**4. Financial Statement Impacts**

* **Income Statement:** No effect. Net Income is not reduced by dividends.
* **Statement of Retained Earnings:** Deducted from (Beginning Retained Earnings + Net Income) to determine **Ending Retained Earnings**.
* **Statement of Financial Position:** Assets decrease (-Cash) and Shareholders' Equity decreases (-Retained Earnings). The accounting equation remains balanced.`
  },

  // 2. Adjusting Entries
  {
    id: 'faq-cash-never-adjusting',
    category: 'Adjusting Entries',
    question: 'Why is Cash never included in an adjusting journal entry?',
    response: `### Why Cash is Never Included in an Adjusting Journal Entry

**1. The Core Purpose of Adjusting Entries**

Under the **accrual basis of accounting** (**IFRS / ASPE**), adjusting entries are made strictly at the **end of an accounting period** to align revenues with the period earned and expenses with the period incurred.

* **THE GOLDEN RULE:** **Cash is NEVER part of an adjusting entry!**
* If cash is being received or paid today, it is a routine daily transaction recorded through the cash receipts or cash disbursements journal—not a period-end adjusting entry.
* Adjusting entries always involve **one Balance Sheet account** (an asset or liability) and **one Income Statement account** (a revenue or expense), never Cash.

**2. The Four Adjusting Scenarios**

* **1. Accrued Revenue:** Work done now, cash collected later (DR Receivable, CR Revenue).
* **2. Accrued Expense:** Cost incurred now, cash paid later (DR Expense, CR Payable).
* **3. Deferred/Unearned Revenue:** Cash collected in the past, earned now (DR Unearned Revenue, CR Revenue).
* **4. Deferred/Prepaid Expense:** Cash paid in the past, expired/consumed now (DR Expense, CR Prepaid Asset).

**3. Summary Table**

| Adjustment Type | Prior Cash Event | Adjusting Entry Debit | Adjusting Entry Credit | Cash Involved? |
| :--- | :--- | :--- | :--- | :--- |
| **Accrued Expense** | Cash will occur in future | Expense | Liability | **No** |
| **Accrued Revenue** | Cash will occur in future | Asset (Receivable) | Revenue | **No** |
| **Prepaid Expense** | Cash occurred in past | Expense | Asset (Prepaid) | **No** |
| **Unearned Revenue** | Cash occurred in past | Liability (Unearned) | Revenue | **No** |`
  },
  {
    id: 'faq-accruals-vs-deferrals',
    category: 'Adjusting Entries',
    question: 'What is the difference between accruals and deferrals, and what are the 4 main types of adjusting entries?',
    response: `### Accruals vs. Deferrals: The 4 Adjusting Entry Types

**1. The Fundamental Difference**

The difference between accruals and deferrals comes down to **when cash moves relative to when the economic event occurs**:

* **Accruals (Action First, Cash Later):** The service is performed or the expense is incurred **before** any cash changes hands.
* **Deferrals (Cash First, Action Later):** Cash is received or paid **in advance**, and recognition of revenue or expense is postponed (deferred) to a future period.

**2. The 4 Main Types of Adjusting Entries**

* **Type 1 — Accrued Revenues:** Revenues earned for services performed but not yet billed or collected.
  * *Example:* Accrued interest on a note receivable.
  * *Entry:* **Debit** Interest Receivable, **Credit** Interest Revenue.
* **Type 2 — Accrued Expenses:** Expenses incurred during the period but not yet paid or recorded.
  * *Example:* Employee salaries earned at month-end, paid next week.
  * *Entry:* **Debit** Salaries Expense, **Credit** Salaries Payable.
* **Type 3 — Deferred (Unearned) Revenues:** Cash received before performance obligations are satisfied.
  * *Example:* Client deposit for a 3-month consulting project.
  * *Entry:* **Debit** Unearned Service Revenue, **Credit** Service Revenue.
* **Type 4 — Deferred (Prepaid) Expenses:** Expenses paid in cash and recorded as assets before they are used or consumed.
  * *Example:* 12-month insurance policy paid in advance.
  * *Entry:* **Debit** Insurance Expense, **Credit** Prepaid Insurance.`
  },
  {
    id: 'faq-prepaid-expenses',
    category: 'Adjusting Entries',
    question: 'How do you account for prepaid expenses when insurance or rent expires?',
    response: `### Accounting for Prepaid Expenses & Expirations

**1. Underlying Accounting Treatment**

When an operating cost (such as insurance or rent) is paid in advance, it is initially recorded as an **Asset (Prepaid Expense)** because it provides future economic benefits.

* At the end of each accounting period, an adjusting entry must be made under **ASPE / IFRS** to recognize the portion of coverage that has expired during the period as an **Expense**.

**2. Accounts Involved and Classifications**

* **Insurance / Rent Expense** (*Operating Expense*): Reflects the expired benefit. Increases with a **Debit**.
* **Prepaid Insurance / Rent** (*Current Asset*): Reflects the reduction in future benefits. Decreases with a **Credit**.

**3. Demonstrated Journal Entry**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Insurance Expense** | $400 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Prepaid Insurance** | | $400 |

*(To record one month of expired insurance coverage)*

**4. Financial Statement Impacts**

* **Income Statement:** Operating expenses increase → **Net Income decreases**.
* **Statement of Financial Position:** Assets decrease (-Prepaid Insurance) and Shareholders' Equity decreases by the exact same amount (-Retained Earnings via lower Net Income).`
  },
  {
    id: 'faq-omitted-adjustments',
    category: 'Adjusting Entries',
    question: 'What are the financial statement consequences of omitting period-end adjusting entries?',
    response: `### Financial Statement Consequences of Omitting Adjusting Entries

**1. The Ripple Effect of Missing Adjustments**

If period-end adjusting entries are omitted, financial statements under Canadian standards (**IFRS / ASPE**) become materially misstated. Because every adjusting entry connects a Balance Sheet account with an Income Statement account, omitting an entry misstates **both statements simultaneously**:

**2. Error Matrix for the 4 Adjusting Scenarios**

| Omitted Adjusting Entry | Income Statement Impact | Balance Sheet Impact |
| :--- | :--- | :--- |
| **1. Accrued Expense** (e.g., unpaid salaries or interest) | Expenses understated → **Net Income overstated** | Liabilities understated, **Equity overstated** |
| **2. Accrued Revenue** (e.g., unbilled consulting or interest) | Revenues understated → **Net Income understated** | Assets understated, **Equity understated** |
| **3. Prepaid Expense Expiration** (e.g., expired insurance/rent) | Expenses understated → **Net Income overstated** | Assets overstated, **Equity overstated** |
| **4. Unearned Revenue Earned** (e.g., completed service deposit) | Revenues understated → **Net Income understated** | Liabilities overstated, **Equity understated** |
| **5. Depreciation Expense** | Expenses understated → **Net Income overstated** | Assets (Carrying Value) overstated, **Equity overstated** |

**3. CPA Exam Takeaway**

Whenever an exam problem asks "What is the effect of failing to record...?", look at whether the adjusting entry debits an expense or credits a revenue:
* **Missed Expense Debit:** Net Income is ALWAYS **overstated**.
* **Missed Revenue Credit:** Net Income is ALWAYS **understated**.`
  },

  // 3. Financial Statements
  {
    id: 'faq-financial-statements-articulation',
    category: 'Financial Statements',
    question: 'How do the four financial statements connect and articulate in Canadian financial reporting?',
    response: `### How the Four Financial Statements Articulate

**1. The Sequence of Financial Statements**

Under Canadian accounting standards (**IAS 1** under IFRS and **ASPE Section 1400**), financial statements must be prepared in a specific sequential order because the output of one statement serves as the direct input to the next:

1. **Income Statement (or Statement of Profit or Loss):**
   * Revenues − Expenses = **Net Income**.
2. **Statement of Retained Earnings (or Statement of Changes in Equity):**
   * Beginning Retained Earnings + **Net Income** − Dividends Declared = **Ending Retained Earnings**.
3. **Statement of Financial Position (Balance Sheet):**
   * Assets = Liabilities + Shareholders' Equity (where Shareholders' Equity includes **Ending Retained Earnings** and Common Shares).
4. **Statement of Cash Flows:**
   * Reconciles cash from Operating, Investing, and Financing activities. The ending cash figure matches **Cash and Cash Equivalents** on the Statement of Financial Position.

**2. Visual Articulation Flow**

$$\\text{Net Income (Income Statement)} \\longrightarrow \\text{Retained Earnings (Equity Statement)} \\longrightarrow \\text{Equity (Balance Sheet)}$$

$$\\text{Ending Cash (Cash Flow Statement)} = \\text{Cash Asset (Balance Sheet)}$$`
  },
  {
    id: 'faq-trial-balance-stages',
    category: 'Financial Statements',
    question: 'What is the difference between an unadjusted, adjusted, and post-closing trial balance?',
    response: `### Unadjusted vs. Adjusted vs. Post-Closing Trial Balance

**1. Overview of the Three Stages**

In the accounting cycle under Canadian standards, three distinct trial balances are prepared at different milestones:

| Stage | Milestone in Accounting Cycle | Accounts Included | Purpose |
| :--- | :--- | :--- | :--- |
| **1. Unadjusted Trial Balance** | After posting all daily routine transactions | All active accounts (Assets, Liabilities, Equity, Revenues, Expenses) | Checks initial equality of debits and credits before period-end adjustments. |
| **2. Adjusted Trial Balance** | After journalizing and posting period-end adjusting entries | All updated accounts (including accruals, deferrals, depreciation) | **Primary source used to prepare the formal Financial Statements.** |
| **3. Post-Closing Trial Balance** | After temporary accounts have been closed | **Permanent (Real) Balance Sheet accounts only** (Assets, Liabilities, Common Shares, Retained Earnings) | Proves that debits equal credits and that all revenue/expense/dividend accounts are at zero before the new year starts. |

**2. Key Exam Rule**

The **Post-Closing Trial Balance** will NEVER contain:
* Sales Revenue or Service Revenue
* Cost of Goods Sold or Operating Expenses
* Dividends Declared
* Income Summary`
  },
  {
    id: 'faq-trial-balance-errors',
    category: 'Financial Statements',
    question: 'What types of errors are caught by a trial balance, and which errors remain undetected?',
    response: `### The Trial Balance: Error Detection Limitations

**1. What a Trial Balance Proves**

A trial balance proves only one thing: that **total debits equal total credits**. It does not guarantee that transactions were recorded correctly.

**2. Errors That CAUSE an Unequal Trial Balance (Detected)**

* **Transposition error in one account:** $5,400 entered as $4,500 on one side only.
* **Slide error:** $1,000 recorded as $100 on one side.
* **Posting only one side:** A debit was posted to Cash, but the credit to Revenue was forgotten.
* **Double debiting:** An entry posted with two debits instead of one debit and one credit.

**3. Errors That DO NOT Affect Equality (Undetected by Trial Balance)**

* **Complete Omission:** A transaction was never recorded in the journal.
* **Wrong Account:** A debit was posted to Supplies instead of Equipment (both are assets, so debits still equal credits).
* **Compensating Errors:** An error of +$500 in one debit offset by an unrelated error of +$500 in another credit.
* **Reversal of Accounts:** Debiting Revenue and crediting Cash (wrong accounts, but debits still equal credits).`
  },
  {
    id: 'faq-closing-entries',
    category: 'Financial Statements',
    question: 'How does the temporary account closing process work into Retained Earnings?',
    response: `### The Closing Process & Retained Earnings

**1. Temporary vs. Permanent Accounts**

Under Canadian accounting standards (**IFRS / ASPE**):
* **Temporary (Nominal) Accounts:** Track activity for a single accounting period. At period-end, they must be closed to a zero balance so the next period starts fresh.
  * Includes: **Revenues**, **Expenses**, and **Dividends**.
* **Permanent (Real) Accounts:** Balances carry forward cumulatively into the next accounting period.
  * Includes: **Assets**, **Liabilities**, and **Shareholders' Equity** (Common Shares, Retained Earnings).

**2. The 4-Step Closing Process**

* **Step 1: Close Revenues to Income Summary**
  * **Debit:** All Revenue accounts (to zero their credit balances).
  * **Credit:** Income Summary.
* **Step 2: Close Expenses to Income Summary**
  * **Debit:** Income Summary (total expenses).
  * **Credit:** All Expense accounts (to zero their debit balances).
* **Step 3: Close Income Summary to Retained Earnings**
  * If Net Income: **Debit** Income Summary, **Credit** Retained Earnings.
  * If Net Loss: **Debit** Retained Earnings, **Credit** Income Summary.
* **Step 4: Close Dividends to Retained Earnings**
  * **Debit:** Retained Earnings.
  * **Credit:** Dividends (to zero out its debit balance).

**3. Demonstrated Closing Entry (Alternative Direct to Retained Earnings)**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Sales Revenue** | $40,000 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Operating Expenses (various)** | | $28,000 |
| &nbsp;&nbsp;&nbsp;&nbsp;**Retained Earnings (Net Income plug)** | | $12,000 |

*(To close revenues and expenses directly into Retained Earnings)*`
  },

  // 4. Depreciation
  {
    id: 'faq-diminishing-balance',
    category: 'Depreciation',
    question: 'How do you calculate depreciation using the diminishing-balance (declining-balance) method?',
    response: `### Calculating Depreciation Using the Diminishing-Balance (Declining-Balance) Method

**1. Conceptual Rationale & Canadian Accounting Standards**

Under Canadian accounting standards (**IAS 16** *Property, Plant and Equipment* under IFRS and **ASPE Section 3061**), the **Diminishing-Balance Method** (also known as the Declining-Balance method) is an accelerated depreciation technique.
* **The Economic Principle:** Assets often produce greater utility, efficiency, and revenue in their early service years. Furthermore, maintenance and repair costs rise as assets age; pairing higher early depreciation with lower early repairs provides a more stable total asset cost over time.

**2. The Calculation Formula**

$$\\text{Annual Depreciation Expense} = \\text{Beginning Carrying Amount (Net Book Value)} \\times \\text{Depreciation Rate}$$

* **Beginning Carrying Amount:** $\\text{Cost} - \\text{Accumulated Depreciation to Date}$.
* **Depreciation Rate:** Often specified as a fixed percentage, or as **Double-Declining-Balance (DDB)**:
  $$\\text{Straight-Line Rate} = \\frac{100\\%}{\\text{Useful Life in Years}}$$
  $$\\text{DDB Rate} = \\text{Straight-Line Rate} \\times 2$$

**3. Crucial Canadian Rule Regarding Residual (Salvage) Value**

* In the diminishing-balance method, **residual value is NOT subtracted from cost** to determine the depreciation base in initial years!
* **However, residual value acts as a strict floor:** The asset's carrying amount can **never be depreciated below its estimated residual value**. In the final year, depreciation expense is limited to the amount needed to bring carrying amount down to residual value.

**4. Step-by-Step Numerical Example**

Suppose equipment is purchased on Jan 1 for **$20,000**, with a **5-year useful life** and a **$2,000 residual value**.
* Straight-Line Rate = $100\\% / 5 = 20\\%$.
* Double-Declining-Balance Rate = $20\\% \\times 2 = 40\\%$.

* **Year 1:**
  * Carrying Amount: $20,000
  * Depreciation Expense: $\$20,000 \\times 40\\% = \\mathbf{\\$8,000}$
  * Ending Carrying Amount: $\$20,000 - \\$8,000 = \\$12,000$

* **Year 2:**
  * Beginning Carrying Amount: $12,000
  * Depreciation Expense: $\$12,000 \\times 40\\% = \\mathbf{\\$4,800}$
  * Ending Carrying Amount: $\$12,000 - \\$4,800 = \\$7,200$

* **Year 3:**
  * Beginning Carrying Amount: $7,200
  * Depreciation Expense: $\$7,200 \\times 40\\% = \\mathbf{\\$2,880}$
  * Ending Carrying Amount: $\$7,200 - \\$2,880 = \\$4,320$

**5. Demonstrated Journal Entry**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Depreciation Expense** | $8,000 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Accumulated Depreciation — Equipment** | | $8,000 |

*(To record Year 1 diminishing-balance depreciation expense)*

**6. Financial Statement Impact**

* **Income Statement:** Operating expenses increase by the calculated amount → **Net Income decreases**.
* **Statement of Financial Position:** Equipment gross cost remains intact at $20,000; Accumulated Depreciation increases with a credit, reducing net carrying amount. Shareholders' Equity decreases by the exact same amount via Net Income.`
  },
  {
    id: 'faq-accumulated-depreciation',
    category: 'Depreciation',
    question: 'Why is Accumulated Depreciation a credit balance contra-asset instead of crediting Equipment directly?',
    response: `### Understanding Accumulated Depreciation as a Contra-Asset

**1. Underlying Accounting Treatment (Cost Allocation & Matching)**

Under Canadian standards (**IAS 16** *Property, Plant and Equipment* under IFRS, and **ASPE Section 3061**), depreciation is **not** a valuation technique to determine what an asset could be sold for today. Rather, it is a systematic **allocation of the historical acquisition cost** of a tangible capital asset over its estimated useful service life.

* The matching principle dictates that the expense of utilizing the equipment must be recognized in the same accounting periods during which the equipment helps generate revenue.

**2. Accounts Involved and Classifications**

* **Depreciation Expense** (*Operating Expense / Income Statement*): Represents the portion of the asset's economic benefits consumed during the current operating period. Expenses increase on the **Debit** side.
* **Accumulated Depreciation — Equipment** (*Contra-Asset / Statement of Financial Position*): Represents the cumulative depreciation recognized on the asset since acquisition. As a contra-asset, it carries a **Credit** normal balance and directly offsets the original Equipment cost.

**3. Demonstrated Journal Entry**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Depreciation Expense** | $500 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Accumulated Depreciation — Equipment** | | $500 |

*(To record monthly depreciation of productive equipment)*

*Why not credit Equipment directly?* Canadian accounting standards require keeping the original historical acquisition cost intact in the Equipment asset account. Crediting Accumulated Depreciation allows financial statement users to see both original cost and cumulative usage.

**4. Impact on the Financial Statements**

* **Income Statement:** Depreciation Expense increases operating expenses → **Net Income decreases**.
* **Statement of Retained Earnings:** Lower Net Income reduces ending **Retained Earnings** in **Shareholders' Equity**.
* **Statement of Financial Position (Balance Sheet):**
  * **Equipment (Gross Cost):** Remains at historical acquisition cost.
  * **Less: Accumulated Depreciation:** Increases with a credit, reducing **Carrying Amount (Net Book Value)**.
  * **Net Assets:** Decrease by the depreciation amount.
  * **Shareholders' Equity:** Decreases by the exact same amount via Net Income.
  * **Equation:** Change in Assets (-$500 via Contra-Asset) = Change in Liabilities ($0) + Change in Shareholders' Equity (-$500). Perfect balance!`
  },
  {
    id: 'faq-depreciation-fs-impact',
    category: 'Depreciation',
    question: 'How does depreciation affect the Statement of Financial Position and Net Income?',
    response: `### How Depreciation Affects Financial Statements

**1. The Dual Impact of Depreciation**

When a depreciation adjusting entry is recorded at the end of an accounting period, it has an immediate, simultaneous impact on both the **Income Statement** and the **Statement of Financial Position**:

**2. Impact on the Income Statement**

* **Depreciation Expense** increases operating expenses for the period.
* Higher operating expenses directly cause **Operating Income and Net Income to decrease**.
* Cash is **not affected** — depreciation is a non-cash expense that allocates past cash spent on capital assets.

**3. Impact on the Statement of Financial Position (Balance Sheet)**

* **Gross Asset Cost:** Remains completely unchanged in the **Equipment** or **Building** account to preserve historical cost under IAS 16 / ASPE 3061.
* **Accumulated Depreciation:** Increases on the credit side as a **contra-asset**.
* **Carrying Amount (Net Book Value):** Decreases ($Cost - Accumulated Depreciation$). Total assets decrease.
* **Shareholders' Equity:** Decreases by the exact same dollar amount because lower Net Income reduces ending **Retained Earnings**.

**4. Visual Equation Impact**

$$\\Delta \\text{Assets} (-\\text{Carrying Amount}) = \\Delta \\text{Liabilities} ($0) + \\Delta \\text{Shareholders' Equity} (-\\text{Retained Earnings})$$
Total Assets and Total Liabilities plus Shareholders' Equity remain in perfect equilibrium.`
  },
  {
    id: 'faq-straight-line-vs-units',
    category: 'Depreciation',
    question: 'How do you calculate straight-line depreciation versus units-of-production under IAS 16 / ASPE 3061?',
    response: `### Straight-Line vs. Units-of-Production Depreciation

**1. Straight-Line Depreciation Formula**

$$\\text{Annual Depreciation Expense} = \\frac{\\text{Cost} - \\text{Estimated Residual Value}}{\\text{Estimated Useful Life in Years}}$$

* **Depreciable Amount:** $\\text{Cost} - \\text{Residual Value}$.
* Expense is identical for every full year of service.
* Best suited for assets that decline in utility primarily due to the passage of time (buildings, office furniture).

**2. Units-of-Production (Units-of-Activity) Formula**

$$\\text{Depreciation Rate per Unit} = \\frac{\\text{Cost} - \\text{Estimated Residual Value}}{\\text{Total Estimated Operating Units or Hours}}$$
$$\\text{Depreciation Expense for Period} = \\text{Units Produced in Period} \\times \\text{Depreciation Rate per Unit}$$

* Expense varies directly with actual usage. In periods of high production, depreciation is higher; in idle periods, depreciation is lower.
* Best suited for machinery, delivery vehicles (kilometres driven), or mining equipment (operating hours).

**3. Demonstrated Journal Entry**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Depreciation Expense — Vehicles** | $3,200 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Accumulated Depreciation — Vehicles** | | $3,200 |

*(To record annual depreciation under straight-line or units-of-production)*`
  },

  // 5. Inventory
  {
    id: 'faq-perpetual-2step',
    category: 'Inventory',
    question: 'Explain the 2-step perpetual inventory sales entry under Canadian standards (IFRS / ASPE).',
    response: `### Perpetual Inventory System & Canadian Standards

**1. The 2-Step Perpetual Sales Entry**

In a perpetual inventory system under Canadian standards, recording a merchandise sale requires **two simultaneous entries**:

* **Entry A (Record Sale to Customer at Retail Price):**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Cash (or Accounts Receivable)** | $1,200 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Sales Revenue** | | $1,200 |

*(To record revenue earned from merchandise sale)*

* **Entry B (Record Inventory Outflow & Wholesale Cost):**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Cost of Goods Sold (COGS)** | $700 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Merchandise Inventory** | | $700 |

*(To transfer cost of goods sold from asset inventory to operating expense)*

**2. Crucial Canadian Accounting Rule: LIFO is Prohibited!**

Under both **IFRS (IAS 2)** and **ASPE (Section 3031)**, the **Last-In, First-Out (LIFO)** inventory valuation method is **strictly prohibited** in Canada.

* Canadian companies must choose between **FIFO (First-In, First-Out)** or **Weighted Average Cost**.
* Inventory must be valued at the **Lower of Cost and Net Realizable Value (LCNRV)**.`
  },
  {
    id: 'faq-fifo-vs-weighted-average',
    category: 'Inventory',
    question: 'What is the difference between FIFO and Weighted Average cost flow assumptions in a period of inflation?',
    response: `### FIFO vs. Weighted Average Cost Flow in Inflationary Periods

**1. The Cost Flow Assumptions**

Under Canadian GAAP (**IAS 2 / ASPE 3031**):
* **FIFO (First-In, First-Out):** Oldest inventory purchase costs are assigned to Cost of Goods Sold; most recent costs remain in Ending Inventory.
* **Weighted Average Cost:** A weighted average unit cost is computed:
  $$\\text{Weighted Average Cost per Unit} = \\frac{\\text{Total Cost of Goods Available for Sale}}{\\text{Total Units Available for Sale}}$$

**2. Impact During Rising Prices (Inflation)**

| Financial Metric | FIFO | Weighted Average Cost |
| :--- | :--- | :--- |
| **Cost of Goods Sold (COGS)** | **Lower** (uses earlier, cheaper costs) | **Moderate** (blends old and new costs) |
| **Gross Profit & Net Income** | **Higher** | **Moderate** |
| **Ending Inventory on Balance Sheet** | **Higher** (reflects current replacement cost) | **Moderate** |
| **Income Tax Expense** | **Higher** (due to higher taxable income) | **Moderate** |

**3. Consistency Principle**

Once an entity selects FIFO or Weighted Average Cost for a class of inventory, it must apply that method consistently from year to year under IAS 8 / ASPE 1506.`
  },
  {
    id: 'faq-lifo-prohibition',
    category: 'Inventory',
    question: 'Why is the LIFO inventory method strictly prohibited in Canada under IAS 2 and ASPE 3031?',
    response: `### Why LIFO is Strictly Prohibited in Canada

**1. Canadian Accounting Standards Prohibition**

Under both **IFRS (IAS 2 *Inventories*, paragraph 25)** and **ASPE (Section 3031 *Inventories*, paragraph .21)**, the **Last-In, First-Out (LIFO)** cost formula is **strictly prohibited**.

**2. Reasons for the Prohibition**

1. **Unrealistic Economic Flow:** In the vast majority of businesses, physical inventory does not move on a last-in, first-out basis (e.g., grocery, manufacturing, pharmaceuticals).
2. **Severely Distorted Balance Sheet:** Under LIFO during inflation, ending inventory on the Statement of Financial Position is valued at outdated historical costs dating back years or decades, understating assets and working capital.
3. **LIFO Liquidation Distortions:** If an entity reduces inventory levels, ancient low costs are matched against current revenues, creating artificial, non-operational profit spikes.
4. **Canadian Tax Alignment:** The Canada Revenue Agency (CRA) does not permit LIFO for income tax purposes.`
  },
  {
    id: 'faq-lcnrv-rule',
    category: 'Inventory',
    question: 'How does the Lower of Cost and Net Realizable Value (LCNRV) rule work, and what is the write-down entry?',
    response: `### Lower of Cost and Net Realizable Value (LCNRV)

**1. The Accounting Rule (IAS 2 & ASPE 3031)**

Inventory must be carried on the Statement of Financial Position at the **Lower of Cost and Net Realizable Value (LCNRV)**.
* **Net Realizable Value (NRV):** Estimated selling price in the ordinary course of business less estimated costs of completion and estimated costs necessary to make the sale.
* When NRV drops below acquisition cost (due to obsolescence, damage, or market price drops), a write-down is mandatory.

**2. Demonstrated Write-Down Journal Entry**

Suppose inventory with a cost of **$15,000** has an NRV of **$11,500** at year-end. A $3,500 write-down is required:

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Cost of Goods Sold (or Inventory Write-Down Loss)** | $3,500 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Merchandise Inventory** | | $3,500 |

*(To write down inventory from cost of $15,000 to NRV of $11,500)*

**3. Recovery / Reversal of Write-Down**

* **Under IFRS (IAS 2):** If circumstances change and NRV recovers in a subsequent period, the write-down **can be reversed** up to the original cost.
* **Under ASPE (Section 3031):** Reversals of write-downs are also permitted if NRV recovers.`
  },

  // 6. Revenue Recognition
  {
    id: 'faq-unearned-revenue-debited',
    category: 'Revenue Recognition',
    question: 'Why is Unearned Revenue debited when revenue is earned?',
    response: `### Why Unearned Revenue is Debited When Earned

**1. Underlying Accounting Treatment (Accrual Accounting & Revenue Recognition)**

Under Canadian accounting standards (**IFRS 15** for public enterprises and **ASPE Section 3400** for private enterprises), revenue cannot be recognized when cash is initially received if the performance obligation has not yet been satisfied.

* When the customer originally paid in advance, your company had an outstanding legal obligation to provide services, recorded as a liability in **Unearned Service Revenue**.
* Once your company actually performs the agreed services, that liability is extinguished (discharged). Under the **revenue recognition principle**, the earnings process is now complete.

**2. Accounts Involved and Classifications**

* **Unearned Service Revenue** (*Current Liability*, Normal Credit Balance): Because your obligation to the customer is now fulfilled, the liability has decreased. Liabilities decrease on the **Debit** side.
* **Service Revenue** (*Revenue / Shareholders' Equity*, Normal Credit Balance): Because you successfully performed the service, revenue is recognized. Revenues increase on the **Credit** side.

**3. Demonstrated Journal Entry**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Unearned Service Revenue** | $1,000 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Service Revenue** | | $1,000 |

*(To record revenue earned and discharge of performance obligation)*

**4. Impact on the Financial Statements**

* **Income Statement:** Service Revenue increases → Operating Income and **Net Income increase**.
* **Statement of Retained Earnings:** Higher Net Income flows into ending **Retained Earnings**, increasing total **Shareholders' Equity**.
* **Statement of Financial Position (Balance Sheet):**
  * **Assets:** Unchanged (cash was collected in an earlier period).
  * **Liabilities:** Decrease (Unearned Service Revenue liability is extinguished).
  * **Shareholders' Equity:** Increases by the exact same amount via Net Income.
  * **Equation:** Change in Assets ($0) = Change in Liabilities (-$1,000) + Change in Shareholders' Equity (+$1,000). The fundamental equation remains balanced!`
  },
  {
    id: 'faq-ifrs15-5steps',
    category: 'Revenue Recognition',
    question: 'What is the 5-step revenue recognition model under IFRS 15, and how does it compare to ASPE 3400?',
    response: `### The 5-Step Revenue Recognition Model (IFRS 15 vs. ASPE 3400)

**1. The 5-Step Core Framework (IFRS 15)**

Under **IFRS 15** *Revenue from Contracts with Customers*, all commercial contracts follow a strict 5-step framework:

* **Step 1: Identify the Contract with a Customer** (commercial substance, rights, collection probable).
* **Step 2: Identify the Performance Obligations in the Contract** (distinct goods or services promised).
* **Step 3: Determine the Transaction Price** (fixed price, variable consideration, financing).
* **Step 4: Allocate the Transaction Price to Performance Obligations** (based on relative standalone selling prices).
* **Step 5: Recognize Revenue When (or as) the Entity Satisfies a Performance Obligation** (at a point in time or over time as control transfers).

**2. Comparison to ASPE Section 3400**

For Canadian private enterprises under ASPE 3400, revenue is recognized under an earnings approach when:
1. Significant risks and rewards of ownership have transferred to the buyer.
2. Reasonable assurance exists regarding measurement of consideration.
3. Ultimate collection is reasonably assured.`
  },
  {
    id: 'faq-advance-cash-receipt',
    category: 'Revenue Recognition',
    question: 'How do you record cash received in advance (customer deposit/retainer) before services are performed?',
    response: `### Recording Cash Received in Advance (Unearned Revenue)

**1. Underlying Accounting Treatment**

When a client pays cash today for work to be performed in a future period, the business has collected money but has **not yet earned it** under **IFRS 15 / ASPE 3400**.

* Revenue recognition requires fulfilling performance obligations.
* Collecting cash before delivery creates a legal liability—an obligation to perform services or return the money.

**2. Accounts Involved and Classifications**

* **Cash** (*Current Asset*, Normal Debit Balance): Inflow of liquid funds increases total assets (**Debit**).
* **Unearned Service Revenue** (*Current Liability*, Normal Credit Balance): Obligation to provide future goods or services increases (**Credit**).

**3. Demonstrated Journal Entry**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Cash** | $2,000 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Unearned Service Revenue** | | $2,000 |

*(To record advance cash receipt for future services)*

**4. Financial Statement Impacts**

* **Income Statement:** Zero effect. No revenue has been earned yet.
* **Statement of Financial Position:** Assets increase (+Cash) and Liabilities increase (+Unearned Revenue) by the identical amount. Shareholders' Equity is unaffected until the service is actually performed.`
  },

  // 7. Liabilities
  {
    id: 'faq-ap-vs-np',
    category: 'Liabilities',
    question: 'What is the difference between Accounts Payable and Notes Payable?',
    response: `### Accounts Payable vs. Notes Payable Explained

**1. Accounts Payable (Trade Credit)**

* **Nature:** Informal short-term obligations arising from everyday purchases of inventory, goods, or operational services on open account.
* **Documentation & Terms:** Supported by a supplier invoice with standard trade credit terms (e.g., Net 30 days or 2/10, n/30).
* **Interest:** Does not typically carry explicit interest unless the invoice becomes overdue.
* **Classification:** Almost always a **Current Liability** on the Statement of Financial Position.

**2. Notes Payable (Promissory Note)**

* **Nature:** Formal written contractual promise to repay a specified principal amount plus interest at a fixed future date.
* **Documentation & Terms:** Formal legal promissory note specifying the principal, maturity date, and stated annual interest rate.
* **Interest:** Accumulates interest over time (Principal × Rate × Time), requiring adjusting entries under Canadian standards for **Interest Expense** and **Interest Payable**.
* **Classification:** Can be a **Current Liability** (if maturing within 12 months) or a **Non-Current (Long-Term) Liability** under Canadian standards.

**3. Comparative Summary**

| Attribute | Accounts Payable | Notes Payable |
| :--- | :--- | :--- |
| **Legal Form** | Informal purchase order / supplier invoice | Formal written promissory note |
| **Explicit Interest** | No (unless past due) | Yes (stated annual rate) |
| **Typical Term** | 30 to 60 days | 60 days to multiple years |
| **Year-End Adjustment** | None for interest | Accrue Interest Expense & Interest Payable |`
  },
  {
    id: 'faq-accrued-interest',
    category: 'Liabilities',
    question: 'How do you account for accrued interest on a promissory note payable at year-end?',
    response: `### Accounting for Accrued Interest on Notes Payable

**1. The Interest Formula**

$$\\text{Interest} = \\text{Principal} \\times \\text{Annual Interest Rate} \\times \\text{Fraction of Year}$$

* If a $10,000, 6% note was signed on November 1 with a fiscal year-end of December 31:
  $$\\text{Accrued Interest} = \\$10,000 \\times 6\\% \\times \\frac{2}{12} = \\$100$$

**2. Demonstrated Year-End Adjusting Entry**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Interest Expense** *(Operating/Financing Expense)* | $100 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Interest Payable** *(Current Liability)* | | $100 |

*(To accrue 2 months of interest on note payable as of year-end)*

**3. Entry at Maturity in Subsequent Period**

When the note and interest are paid at maturity, the payment discharges both the principal note and the accrued liability, plus any additional interest incurred in the new year.`
  },
  {
    id: 'faq-bonds-discount-premium',
    category: 'Liabilities',
    question: 'How do bonds payable issued at a discount differ from bonds issued at a premium (effective interest method)?',
    response: `### Bonds Issued at a Discount vs. Premium (Effective Interest Method)

**1. Market Rate vs. Stated (Coupon) Rate**

Under Canadian standards (**IFRS 9** and **ASPE Section 3856**):
* **Issued at a Discount:** Market Yield Rate > Stated Coupon Rate. Investors pay less than face value because the bond pays below-market interest.
* **Issued at a Premium:** Market Yield Rate < Stated Coupon Rate. Investors pay more than face value because the bond pays above-market interest.
* **Issued at Par:** Market Rate = Stated Rate.

**2. Amortization Under the Effective Interest Method**

* **Interest Expense = Beginning Carrying Value × Market Yield Rate.**
* **Cash Interest Paid = Face Value × Stated Coupon Rate.**
* **Amortization Difference = |Interest Expense − Cash Paid|.**

| Attribute | Bond Discount | Bond Premium |
| :--- | :--- | :--- |
| **Issue Price** | Less than Face Value ($950 for $1,000 bond) | Greater than Face Value ($1,050 for $1,000 bond) |
| **Carrying Value Over Time** | Increases gradually toward Face Value | Decreases gradually toward Face Value |
| **Interest Expense vs. Cash Paid** | Interest Expense > Cash Paid | Interest Expense < Cash Paid |`
  },
  {
    id: 'faq-warranties-accounting',
    category: 'Liabilities',
    question: 'How are product warranties accounted for under the expense warranty approach (IAS 37 / ASPE 3290)?',
    response: `### Accounting for Product Warranties (IAS 37 & ASPE 3290)

**1. The Matching Principle & Provisions**

Under Canadian accounting standards (**IAS 37** *Provisions, Contingent Liabilities* under IFRS and **ASPE Section 3290** *Contingencies*), when products are sold with an assurance-type warranty, warranty costs must be estimated and recognized in the **same period the sales revenue is earned**.

**2. Two-Step Warranty Entries**

* **Step 1 — Year-End Accrual Based on Estimated Claims:**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Warranty Expense** *(Operating Expense)* | $4,500 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Warranty Liability / Provision** *(Current Liability)* | | $4,500 |

*(To accrue estimated warranty obligations on current period sales)*

* **Step 2 — Settlement of Actual Warranty Claims:**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Warranty Liability / Provision** | $1,200 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Parts Inventory (or Cash / Wages Payable)** | | $1,200 |

*(To record actual replacement parts and labour supplied under warranty)*`
  },

  // 8. Assets
  {
    id: 'faq-bank-reconciliation',
    category: 'Assets',
    question: 'How do you prepare a bank reconciliation, and which side requires adjusting journal entries?',
    response: `### How to Prepare a Bank Reconciliation

**1. Purpose & Canadian Accounting Standards**

A bank reconciliation is a critical **internal control procedure** performed monthly under Canadian accounting principles (**IFRS & ASPE**). It reconciles timing differences and errors between the cash balance reported on the bank statement and the cash balance in the company's general ledger.

**2. The Two-Sided Structure**

A proper bank reconciliation has two distinct sections that must arrive at the exact same **Reconciled Cash Balance**:

#### Side 1: Bank Statement Balance
* **Starting Bank Balance**
* **ADD: Deposits in Transit** (cash received and recorded on company books that has not yet cleared the bank).
* **DEDUCT: Outstanding Cheques** (cheques written and mailed by the company that have not yet been cashed by payees).
* **ADD / DEDUCT: Bank Errors** (rare errors made by the financial institution).
* **= Reconciled Bank Balance**

#### Side 2: Company Cash Ledger (Book) Balance
* **Starting Book Balance**
* **ADD: Collections by the Bank** (electronic fund transfers, notes receivable collected by bank).
* **ADD: Interest Earned** on operating accounts.
* **DEDUCT: Bank Service Charges** & electronic processing fees.
* **DEDUCT: NSF Cheques** (Non-Sufficient Funds customer cheques returned unpaid).
* **ADD / DEDUCT: Company Book Errors** (e.g., transposition errors recording cheque amounts).
* **= Reconciled Book Balance**

**3. Crucial Rule: Which Side Requires Adjusting Journal Entries?**

* **ONLY items affecting the Company Book Balance require journal entries!**
* Items on the bank side (deposits in transit, outstanding cheques) will naturally clear the bank in the subsequent days without any company entry.

**4. Demonstrated Adjusting Journal Entries**

* **Entry 1: Record NSF Customer Cheque and Bank Service Fee**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Accounts Receivable** *(to reinstate customer balance)* | $450 | |
| **Bank Charges Expense** | $35 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Cash** | | $485 |

*(To adjust book balance for returned customer NSF cheque and monthly bank fee)*

* **Entry 2: Record Electronic Customer Collection & Interest Earned**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Cash** | $1,215 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Accounts Receivable** | | $1,200 |
| &nbsp;&nbsp;&nbsp;&nbsp;**Interest Revenue** | | $15 |

*(To record EFT customer payment and interest credited by bank)*

**5. Impact on the Statement of Financial Position**

The final reconciled cash balance is the exact dollar amount reported under **Cash and Cash Equivalents** (Current Assets) on the Statement of Financial Position.`
  },
  {
    id: 'faq-bad-debts-allowance',
    category: 'Assets',
    question: 'How do you account for bad debts under the allowance method (aging vs. % of sales) under IFRS 9 / ASPE 3856?',
    response: `### Accounting for Bad Debts & Allowance for Doubtful Accounts

**1. Canadian Accounting Standards (IFRS 9 & ASPE 3856)**

Under Canadian standards (**IFRS 9** *Financial Instruments* and **ASPE Section 3856**), businesses that sell goods on credit must use the **Allowance Method** to account for uncollectible receivables.
* The direct write-off method is **prohibited** under GAAP because it violates the matching principle and overstates Accounts Receivable on the balance sheet.

**2. Two Estimation Approaches**

* **Balance Sheet Approach (Aging of Accounts Receivable):** Focuses on net realizable value. Computes the required **target ending balance** in the **Allowance for Doubtful Accounts**. Bad Debt Expense is the plug amount needed to adjust the existing allowance balance to the target.
* **Income Statement Approach (% of Credit Sales):** Focuses on matching. Directly computes the **Bad Debt Expense** for the current period by multiplying credit sales by an estimated historical loss rate.

**3. Demonstrated Journal Entries**

* **Step 1: Period-End Adjusting Entry for Estimated Uncollectibles**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Bad Debt Expense** *(Operating Expense)* | $2,400 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Allowance for Doubtful Accounts** *(Contra-Asset)* | | $2,400 |

*(To accrue estimated uncollectible accounts for the period)*

* **Step 2: Actual Write-Off of a Specific Customer Account**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Allowance for Doubtful Accounts** | $600 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Accounts Receivable — Customer Name** | | $600 |

*(To write off identified bankrupt customer balance)*

*Notice:* The write-off has **zero impact on Net Income or Net Assets** because both Accounts Receivable and its contra-asset decrease by the same amount!

* **Step 3: Recovery of an Account Previously Written Off**
First reverse the write-off (DR Accounts Receivable, CR Allowance for Doubtful Accounts), then record the cash receipt (DR Cash, CR Accounts Receivable).

**4. Financial Statement Presentation**

On the Statement of Financial Position:
* Accounts Receivable (Gross)
* *Less:* Allowance for Doubtful Accounts
* **= Accounts Receivable (Net Realizable Value)**`
  },
  {
    id: 'faq-bad-debt-writeoff',
    category: 'Assets',
    question: 'What is the journal entry to write off an uncollectible account, and why does it have zero impact on Net Assets?',
    response: `### The Write-Off of Accounts Receivable & Zero Impact on Net Assets

**1. Demonstrated Write-Off Journal Entry**

When a specific customer account is determined to be uncollectible (e.g., customer declared bankruptcy):

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Allowance for Doubtful Accounts** *(Contra-Asset)* | $850 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Accounts Receivable — Customer** *(Current Asset)* | | $850 |

*(To write off specific uncollectible customer account)*

**2. Why Net Assets and Net Income Are Completely Unaffected**

Students frequently assume writing off an account creates an expense. It does not!
* The expense was already recognized in an earlier period via the estimating adjusting entry (**DR Bad Debt Expense, CR Allowance**).
* In the write-off:
  * Accounts Receivable (Gross Assets) decreases by $850.
  * Allowance for Doubtful Accounts (Contra-Asset) decreases by $850.
  * **Net Accounts Receivable (Gross − Allowance) remains exactly identical!**
  * Assets = Liabilities + Equity remains completely unchanged.`
  },
  {
    id: 'faq-rd-intangibles',
    category: 'Assets',
    question: 'How are research and development costs accounted for under IAS 38 vs. ASPE 3064 for intangible assets?',
    response: `### Research and Development Costs: IAS 38 vs. ASPE 3064

**1. Research Phase vs. Development Phase**

Under both IFRS (**IAS 38** *Intangible Assets*) and ASPE (**Section 3064** *Goodwill and Intangible Assets*):
* **Research Phase:** Original and planned investigation to gain new scientific knowledge. **All research costs must be EXPENSED immediately as incurred.**
* **Development Phase:** Application of research findings to a plan for commercial production before commercial use.

**2. IFRS vs. ASPE Key Difference**

* **IFRS (IAS 38):** Development costs **MUST be capitalized** as an intangible asset if all 6 criteria are met (Technical feasibility, Intention to complete, Ability to use/sell, Probable future economic benefits, Adequate resources available, Reliable cost measurement).
* **ASPE (Section 3064):** An enterprise has an **accounting policy choice**: it may choose to expense all internal development costs as incurred, OR capitalize development costs that meet the 6 criteria.`
  },

  // 9. Standards
  {
    id: 'faq-ifrs-vs-aspe',
    category: 'Standards',
    question: 'What are the core differences between IFRS (Part I) and ASPE (Part II) in the CPA Canada Handbook?',
    response: `### Core Differences: IFRS vs. ASPE in Canada

**1. The Canadian Financial Reporting Dual Framework**

In Canada, standard setters established a dual reporting framework:
* **Part I — IFRS (International Financial Reporting Standards):** Mandatory for publicly accountable enterprises (listed on TSX, securities commissions) and large financial institutions.
* **Part II — ASPE (Accounting Standards for Private Enterprises):** Developed specifically for Canadian privately held businesses to reduce compliance costs while meeting bank/lender needs.

**2. Key Technical Differences**

| Accounting Area | IFRS (Part I) | ASPE (Part II) |
| :--- | :--- | :--- |
| **Lease Accounting (Lessees)** | IFRS 16: Single on-balance sheet model (ROU Asset & Lease Liability for all leases > 12 mos) | ASPE 3065: Dual model (Operating Lease vs. Capital Lease) |
| **PPE Valuation** | Cost model OR Revaluation model (fair value) | Cost model only |
| **Development Costs** | Mandatory capitalization if 6 criteria met | Policy choice: capitalize or expense |
| **Joint Arrangements** | Classified as Joint Operations or Joint Ventures (equity method only) | Choice of cost method, equity method, or proportionate consolidation |
| **Income Taxes** | Future income taxes (Balance Sheet liability method) | Choice between taxes payable method or future income taxes method |
| **LIFO Inventory** | **Prohibited** | **Prohibited** |`
  },
  {
    id: 'faq-lease-accounting',
    category: 'Standards',
    question: 'How does lease accounting for lessees differ between IFRS 16 (Right-of-Use Asset) and ASPE 3065?',
    response: `### Lease Accounting: IFRS 16 vs. ASPE 3065

**1. The Fundamental Difference Between IFRS and ASPE**

* **IFRS 16 (Mandatory for Public Companies):** Introduces a **single lessee accounting model**. Lessees must recognize almost **all leases on the Statement of Financial Position**:
  * **Right-of-Use (ROU) Asset:** Represents the right to use the underlying leased asset.
  * **Lease Liability:** Represents the present value of future lease payments discounted at the implicit interest rate.
  * *Exceptions:* Short-term leases (< 12 months) and low-value assets.
* **ASPE Section 3065 (Private Enterprises):** Retains the dual classification model:
  * **Operating Lease:** Rent expensed on a straight-line basis (off-balance sheet).
  * **Capital Lease:** Capitalized if any of the three criteria are met (ownership transfers, bargain purchase option, lease term ≥ 75% of useful life, or PV of payments ≥ 90% of fair value).

**2. Demonstrated Initial Entry under IFRS 16**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Right-of-Use Asset** | $120,000 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Lease Liability** | | $120,000 |

*(To record initial recognition of lease asset and liability at present value)*`
  }
];

/**
 * Intelligent Canadian Accounting Fallback Engine.
 * If external AI services are unreachable, experiencing high demand (503), or timing out,
 * this engine generates an in-depth, specific, educational answer tailored to the student's exact question.
 */
export function generateEducationalExplanation(context: TutorContext): string {
  const rawQ = (context.question || '').trim();
  const q = rawQ.toLowerCase();

  // 1. Check exact match in ACCOUNTING_FAQS by id or question text
  const exactFaq = ACCOUNTING_FAQS.find(
    f => f.id === rawQ || f.question.toLowerCase() === q
  );
  if (exactFaq) {
    return exactFaq.response;
  }

  // 2. Check fuzzy match in ACCOUNTING_FAQS (if question is a substring of an FAQ or vice versa)
  const fuzzyFaq = ACCOUNTING_FAQS.find(f => {
    const fq = f.question.toLowerCase();
    return q.includes(fq) || fq.includes(q);
  });
  if (fuzzyFaq) {
    return fuzzyFaq.response;
  }

  // 3. Keyword-based matching to appropriate FAQ
  if (q.includes('diminishing') || q.includes('declining') || q.includes('ddb')) {
    return ACCOUNTING_FAQS.find(f => f.id === 'faq-diminishing-balance')!.response;
  }
  if (q.includes('bank rec') || q.includes('reconciliation')) {
    return ACCOUNTING_FAQS.find(f => f.id === 'faq-bank-reconciliation')!.response;
  }
  if (q.includes('contra-asset') || q.includes('contra asset') || q.includes('accumulated depreciation')) {
    return ACCOUNTING_FAQS.find(f => f.id === 'faq-accumulated-depreciation')!.response;
  }
  if (q.includes('unearned') && q.includes('debit')) {
    return ACCOUNTING_FAQS.find(f => f.id === 'faq-unearned-revenue-debited')!.response;
  }
  if (q.includes('bad debt') || q.includes('doubtful') || q.includes('allowance')) {
    return ACCOUNTING_FAQS.find(f => f.id === 'faq-bad-debts-allowance')!.response;
  }
  if (q.includes('fifo') || q.includes('weighted average')) {
    return ACCOUNTING_FAQS.find(f => f.id === 'faq-fifo-vs-weighted-average')!.response;
  }
  if (q.includes('lifo')) {
    return ACCOUNTING_FAQS.find(f => f.id === 'faq-lifo-prohibition')!.response;
  }
  if (q.includes('trial balance')) {
    return ACCOUNTING_FAQS.find(f => f.id === 'faq-trial-balance-stages')!.response;
  }
  if (q.includes('adjusting entry') || q.includes('accrual') || q.includes('deferral')) {
    return ACCOUNTING_FAQS.find(f => f.id === 'faq-accruals-vs-deferrals')!.response;
  }
  if (q.includes('bond') || q.includes('discount') || q.includes('premium')) {
    return ACCOUNTING_FAQS.find(f => f.id === 'faq-bonds-discount-premium')!.response;
  }
  if (q.includes('lease') || q.includes('ifrs 16') || q.includes('right-of-use')) {
    return ACCOUNTING_FAQS.find(f => f.id === 'faq-lease-accounting')!.response;
  }
  if (q.includes('ifrs 15') || q.includes('5-step') || q.includes('five-step')) {
    return ACCOUNTING_FAQS.find(f => f.id === 'faq-ifrs15-5steps')!.response;
  }

  // 4. Context-aware fallback if opened from practice question
  if (context.scenarioTitle && context.scenarioNarrative) {
    return `### Conceptual Analysis for "${context.scenarioTitle}"

**1. Underlying Accounting Treatment & Canadian Standards**

* **Entity:** ${context.companyName || 'The Company'}
* **Transaction Summary:** "${context.scenarioNarrative}"
* **Accounting Topic:** ${context.scenarioTopic || 'Financial Accounting'}

Under Canadian accounting standards (**IFRS / ASPE**), this transaction reflects an exchange of economic resources and obligations:
* When economic resources are received or consumed, asset and expense balances must be adjusted.
* When legal or constructive obligations are established or settled, liability accounts must be updated.

**2. Accounts Involved and Classifications**

* Identify what the company gave up and what it received.
* Asset accounts increase on the **Debit** side; liabilities increase on the **Credit** side.
* Revenue increases Shareholders' Equity on the **Credit** side; operating expenses decrease equity on the **Debit** side.

**3. Maintaining Double-Entry Balance**

Total debits must equal total credits. Every journal entry preserves the fundamental balance sheet equation:
$$\\Delta \\text{Assets} = \\Delta \\text{Liabilities} + \\Delta \\text{Shareholders' Equity}$$

**4. Financial Statement Impacts**

* **Income Statement:** Operating revenues and expenses flow to Net Income.
* **Statement of Financial Position:** Liquid assets, operational liabilities, and ending equity adjust simultaneously.`;
  }

  // 5. Default accounting principle response
  return ACCOUNTING_FAQS[0].response;
}
