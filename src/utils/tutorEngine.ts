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

/**
 * Intelligent Canadian Accounting Fallback Engine.
 * If external AI services are unreachable, experiencing high demand (503), or timing out,
 * this engine generates an in-depth, specific, educational answer tailored to the student's exact question.
 */
export function generateEducationalExplanation(context: TutorContext): string {
  const rawQ = (context.question || '').trim();
  const q = rawQ.toLowerCase();
  const title = (context.scenarioTitle || '').toLowerCase();
  const narrative = (context.scenarioNarrative || '').toLowerCase();
  const topic = (context.scenarioTopic || '').toLowerCase();

  // =========================================================================
  // 1. PREDEFINED FREQUENTLY ASKED QUESTIONS (QUICK PROMPTS)
  // Preserves exact customized pedagogical content when students select FAQs
  // =========================================================================

  // FAQ 1: Why is Unearned Revenue debited when revenue is earned?
  const isFaqUnearned = (q.includes('unearned') && q.includes('debit') && (q.includes('earn') || q.includes('recogniz'))) ||
    (q.includes('why is unearned revenue debited'));
  if (isFaqUnearned) {
    return `### Why Unearned Revenue is Debited When Earned

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
  * **Equation:** Change in Assets ($0) = Change in Liabilities (-$1,000) + Change in Shareholders' Equity (+$1,000). The fundamental equation remains balanced!`;
  }

  // FAQ 2: Why is Accumulated Depreciation a credit balance contra-asset instead of crediting Equipment directly?
  const isFaqContraAsset = (q.includes('contra-asset') || q.includes('contra asset') || (q.includes('accumulated depreciation') && (q.includes('credit') || q.includes('directly') || q.includes('instead')))) &&
    !q.includes('diminishing') && !q.includes('declining') && !q.includes('double declining') && !q.includes('calculate') && !q.includes('method');
  if (isFaqContraAsset) {
    return `### Understanding Accumulated Depreciation as a Contra-Asset

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
  * **Equation:** Change in Assets (-$500 via Contra-Asset) = Change in Liabilities ($0) + Change in Shareholders' Equity (-$500). Perfect balance!`;
  }

  // FAQ 3: How do Common Shares work under Canadian corporate law (CBCA/OBCA)?
  const isFaqCommonShares = q.includes('cbca') || q.includes('obca') || (q.includes('common share') && (q.includes('corporate law') || q.includes('par value') || q.includes('nominal value')));
  if (isFaqCommonShares) {
    return `### Common Shares Under Canadian Corporate Law (CBCA / OBCA)

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
* **Statement of Financial Position:** Assets increase (+Cash) and Shareholders' Equity increases (+Common Shares) by the exact same dollar amount. The fundamental accounting equation remains perfectly balanced.`;
  }

  // FAQ 4: Why do expenses have a normal debit balance if they decrease Shareholders' Equity?
  const isFaqExpensesDebit = q.includes('expense') && q.includes('debit') && (q.includes('decrease') || q.includes('equity') || q.includes('shareholder') || q.includes('why do expense'));
  if (isFaqExpensesDebit) {
    return `### Why Expenses Have a Normal Debit Balance

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

At the end of the accounting period, all temporary expense accounts (which carry Debit balances) are closed by **Crediting** each expense account and **Debiting** Income Summary or Retained Earnings directly. This debit to Retained Earnings officially decreases Shareholders' Equity on the Statement of Financial Position.`;
  }

  // FAQ 5: What is the difference between Accounts Payable and Notes Payable?
  const isFaqApVsNp = (q.includes('accounts payable') && q.includes('notes payable')) || (q.includes('payable') && (q.includes('difference') || q.includes('vs')));
  if (isFaqApVsNp) {
    return `### Accounts Payable vs. Notes Payable Explained

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
| **Year-End Adjustment** | None for interest | Accrue Interest Expense & Interest Payable |`;
  }

  // FAQ 6: How does depreciation affect the Statement of Financial Position and Net Income?
  const isFaqDeprecImpact = q.includes('depreciat') && (q.includes('financial position') || q.includes('balance sheet')) && (q.includes('net income') || q.includes('income statement'));
  if (isFaqDeprecImpact) {
    return `### How Depreciation Affects Financial Statements

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
Total Assets and Total Liabilities plus Shareholders' Equity remain in perfect equilibrium.`;
  }

  // FAQ 7: Explain the 2-step perpetual inventory sales entry under Canadian standards (IFRS / ASPE)
  const isFaqPerpetual = (q.includes('2-step') || q.includes('two-step') || q.includes('perpetual')) && (q.includes('inventory') || q.includes('sales entry'));
  if (isFaqPerpetual) {
    return `### Perpetual Inventory System & Canadian Standards

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
* Inventory must be valued at the **Lower of Cost and Net Realizable Value (LCNRV)**.`;
  }

  // =========================================================================
  // 2. DYNAMIC SPECIFIC ACCOUNTING QUESTION ENGINES
  // Tailored to students' custom questions across all core accounting topics
  // =========================================================================

  // A. Diminishing-Balance (Declining-Balance) / Accelerated Depreciation Calculation
  if (
    q.includes('diminishing') ||
    q.includes('declining') ||
    q.includes('ddb') ||
    q.includes('accelerated depreciation') ||
    (q.includes('depreciat') && (q.includes('calculate') || q.includes('formula') || q.includes('method') || q.includes('double declining')))
  ) {
    return `### Calculating Depreciation Using the Diminishing-Balance (Declining-Balance) Method

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
* **Statement of Financial Position:** Equipment gross cost remains intact at $20,000; Accumulated Depreciation increases with a credit, reducing net carrying amount. Shareholders' Equity decreases by the exact same amount via Net Income.`;
  }

  // B. Bank Reconciliation
  if (
    q.includes('bank rec') ||
    q.includes('reconciliation') ||
    (q.includes('bank') && (q.includes('statement') || q.includes('book balance') || q.includes('transit') || q.includes('outstanding cheq') || q.includes('nsf')))
  ) {
    return `### How to Prepare a Bank Reconciliation

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

The final reconciled cash balance is the exact dollar amount reported under **Cash and Cash Equivalents** (Current Assets) on the Statement of Financial Position.`;
  }

  // C. Bad Debts & Allowance for Doubtful Accounts (IFRS 9 & ASPE 3856)
  if (
    q.includes('bad debt') ||
    q.includes('doubtful') ||
    q.includes('allowance') ||
    q.includes('aging') ||
    q.includes('write-off') ||
    q.includes('write off') ||
    q.includes('expected credit loss')
  ) {
    return `### Accounting for Bad Debts & Allowance for Doubtful Accounts

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
* **= Accounts Receivable (Net Realizable Value)**`;
  }

  // D. Adjusting Entries (Accruals and Deferrals)
  if (
    q.includes('adjusting entry') ||
    q.includes('adjusting entries') ||
    q.includes('accrual') ||
    q.includes('deferral')
  ) {
    return `### Understanding Adjusting Journal Entries

**1. The Purpose of Adjusting Entries**

Under the **accrual basis of accounting** (**IFRS / ASPE**), adjusting entries are made at the end of every accounting period to ensure that revenues are recognized when performance obligations are satisfied and expenses are recognized when incurred.

* **THE CARDINAL RULE:** **Cash is NEVER involved in an adjusting entry!** If cash is changing hands today, it is a routine transaction, not a period-end adjustment.

**2. The Four Primary Categories of Adjusting Entries**

* **1. Accrued Revenues (Asset / Revenue):** Services performed or goods delivered, but not yet billed or collected.
  * *Entry:* **Debit** Accounts Receivable (or Interest Receivable), **Credit** Service Revenue.
* **2. Accrued Expenses (Expense / Liability):** Costs incurred during the period, but not yet paid.
  * *Entry:* **Debit** Operating Expense (e.g., Salaries or Interest Expense), **Credit** Payable (e.g., Salaries Payable or Interest Payable).
* **3. Deferred Revenues / Unearned (Liability / Revenue):** Cash was collected in advance; portion of service now delivered.
  * *Entry:* **Debit** Unearned Revenue (liability decreases), **Credit** Service Revenue.
* **4. Deferred Expenses / Prepaids (Expense / Asset):** Cash was paid in advance; portion of benefit has now expired.
  * *Entry:* **Debit** Operating Expense (e.g., Insurance Expense, Supplies Expense, Depreciation), **Credit** Prepaid Asset or Contra-Asset.

**3. Impact of Omitting Adjusting Entries**

If period-end adjusting entries are omitted:
* Omitting an accrued expense understates liabilities and overstates Net Income.
* Omitting depreciation overstates assets and overstates Net Income.
* Omitting unearned revenue earned overstates liabilities and understates Net Income.`;
  }

  // E. Inventory Costing Methods (FIFO vs Weighted Average vs LIFO)
  if (
    q.includes('fifo') ||
    q.includes('weighted average') ||
    q.includes('cost of goods sold') ||
    q.includes('cogs') ||
    (q.includes('inventory') && (q.includes('method') || q.includes('costing') || q.includes('valuation') || q.includes('lcnrv')))
  ) {
    return `### Inventory Costing Methods (FIFO vs. Weighted Average under Canadian GAAP)

**1. Canadian Accounting Standards (IAS 2 & ASPE 3031)**

Under Canadian standards (**IFRS IAS 2** and **ASPE Section 3031**), two cost flow assumptions are permitted for interchangeable inventory items:
* **1. First-In, First-Out (FIFO):** Assumes the earliest purchased units are sold first. Ending inventory consists of the most recent purchase costs.
* **2. Weighted Average Cost:** Computes an average cost per unit by dividing total cost of goods available for sale by total units available for sale.

* **CRITICAL CANADIAN REGULATION:** **LIFO (Last-In, First-Out) is strictly PROHIBITED** in Canada under both IFRS and ASPE!

**2. Economic Comparison in a Period of Rising Prices (Inflation)**

| Attribute | FIFO | Weighted Average |
| :--- | :--- | :--- |
| **Cost of Goods Sold (COGS)** | Lower (uses older, cheaper costs) | Moderate (blends old and new costs) |
| **Gross Profit & Net Income** | Higher | Moderate |
| **Ending Inventory on Balance Sheet** | Higher (reflects current replacement costs) | Moderate |

**3. Lower of Cost and Net Realizable Value (LCNRV)**

Under IAS 2 and ASPE 3031, inventory must be carried at the **Lower of Cost and Net Realizable Value (LCNRV)**.
* **Net Realizable Value (NRV):** Estimated selling price in the ordinary course of business less estimated completion and selling costs.
* If NRV falls below carrying cost, a write-down entry is required:
  * **Debit:** Cost of Goods Sold (or Inventory Write-Down Loss)
  * **Credit:** Merchandise Inventory

**4. Demonstrated Sales Entry (Perpetual Inventory)**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Accounts Receivable (or Cash)** | $1,500 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Sales Revenue** | | $1,500 |
| **Cost of Goods Sold** | $900 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Merchandise Inventory** | | $900 |

*(To record sale and inventory cost under FIFO / Weighted Average)*`;
  }

  // F. Trial Balance & Error Detection
  if (q.includes('trial balance')) {
    return `### The Trial Balance: Role, Preparation, and Error Limitations

**1. What is a Trial Balance?**

A trial balance is an internal accounting schedule listing all active general ledger accounts with their debit or credit balances at a specific point in time.
* **Primary Objective:** To mathematically verify that total debits equal total credits after journalizing and posting.

**2. Three Stages of Trial Balances in the Accounting Cycle**

* **1. Unadjusted Trial Balance:** Prepared directly after posting routine daily transactions.
* **2. Adjusted Trial Balance:** Prepared after all period-end adjusting entries have been journalized and posted. This trial balance is the primary source used to draft the formal financial statements.
* **3. Post-Closing Trial Balance:** Prepared after closing entries have zeroed out temporary accounts (Revenues, Expenses, Dividends). It contains **only permanent balance sheet accounts** (Assets, Liabilities, Equity).

**3. Types of Errors a Trial Balance DOES Catch**

* Transposition error posted to only one account.
* A journal entry posted with unequal debit and credit amounts.
* An entry entered on the wrong side of a ledger account.

**4. Types of Errors a Trial Balance CANNOT Catch**

Even when debits equal credits, serious accounting errors may exist:
* **Complete Omission:** A transaction was never recorded in the journal.
* **Wrong Account:** A debit was posted to Supplies instead of Equipment (both are assets, so equality holds).
* **Compensating Errors:** An error of +$100 on one debit offset by an error of +$100 on an unrelated credit.
* **Duplicate Recording:** A transaction was entered twice.`;
  }

  // G. Closing Entries & Retained Earnings
  if (
    q.includes('closing') ||
    q.includes('temporary account') ||
    q.includes('permanent account') ||
    q.includes('income summary')
  ) {
    return `### The Closing Process & Retained Earnings

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

*(To close revenues and expenses directly into Retained Earnings)*`;
  }

  // H. Revenue Recognition 5-Step Model (IFRS 15 / ASPE 3400)
  if (
    q.includes('revenue recognition') ||
    q.includes('ifrs 15') ||
    q.includes('aspe 3400') ||
    q.includes('5-step') ||
    q.includes('five-step') ||
    q.includes('performance obligation')
  ) {
    return `### Revenue Recognition Under IFRS 15 & ASPE 3400

**1. The 5-Step Revenue Recognition Model (IFRS 15)**

Under **IFRS 15** *Revenue from Contracts with Customers*, all commercial contracts follow a strict 5-step framework:

* **Step 1: Identify the Contract with a Customer** (enforceable rights, commercial substance, collection is probable).
* **Step 2: Identify the Performance Obligations in the Contract** (promises to transfer distinct goods or services).
* **Step 3: Determine the Transaction Price** (consider fixed price, variable consideration, financing components).
* **Step 4: Allocate the Transaction Price to Performance Obligations** (based on relative standalone selling prices).
* **Step 5: Recognize Revenue When (or as) the Entity Satisfies a Performance Obligation** (at a point in time or over time as control transfers).

**2. ASPE Section 3400 Comparison**

For Canadian private enterprises under ASPE 3400, revenue is recognized when:
* Risks and rewards of ownership have transferred to the buyer.
* Reasonable assurance exists regarding measurement of consideration.
* Ultimate collection is reasonably assured.

**3. Core Journal Entries**

* When customer pays in advance: **DR Cash, CR Unearned Revenue** (liability).
* When performance obligation is satisfied: **DR Unearned Revenue, CR Revenue**.`;
  }

  // I. Lease Accounting (IFRS 16 vs ASPE 3065)
  if (
    q.includes('lease') ||
    q.includes('ifrs 16') ||
    q.includes('right-of-use') ||
    q.includes('right of use') ||
    q.includes('aspe 3065')
  ) {
    return `### Lease Accounting: IFRS 16 vs. ASPE 3065

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

*(To record initial recognition of lease asset and liability at present value)*`;
  }

  // J. Rules of Debits and Credits & Normal Balances
  if (
    q.includes('debit') ||
    q.includes('credit') ||
    q.includes('normal balance') ||
    q.includes('dealer')
  ) {
    return `### Rules of Debits and Credits & Normal Balances

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
* Every transaction must have at least one debit and one credit, and the total dollar amount of debits must **always equal** total credits.`;
  }

  // =========================================================================
  // 3. CONTEXTUAL TUTORING FOR ACTIVE PRACTICE QUESTIONS
  // If the student opened the tutor from a specific practice question scenario
  // =========================================================================
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

  // =========================================================================
  // 4. COMPREHENSIVE GENERAL TUTORING SYNTHESIS
  // Dynamic educational answer addressing the student's specific custom query
  // =========================================================================
  const capitalizedQuestion = rawQ ? rawQ.charAt(0).toUpperCase() + rawQ.slice(1) : 'Accounting Principles';

  return `### Accounting Analysis: ${capitalizedQuestion}

**1. Underlying Accounting Principles & Canadian Standards (IFRS & ASPE)**

Under Canadian accounting standards (Part I IFRS for publicly accountable entities and Part II ASPE for private enterprises), financial accounting is governed by core conceptual frameworks:
* **Accrual Basis of Accounting:** Transactions are recorded in the accounting periods in which the events occur, rather than when cash is transferred.
* **Revenue Recognition Principle (IFRS 15 / ASPE 3400):** Revenue is recognized when performance obligations are satisfied by transferring control of promised goods or services.
* **Cost Allocation & Matching Principle (IAS 16 / ASPE 3061):** Expenses must be matched against the revenues they helped generate, or allocated systematically over the periods that receive economic benefits.

**2. Determining the Proper Journal Entry**

To record any transaction correctly:
1. **Identify the Accounts:** Determine which specific accounts are affected (e.g., Cash, Accounts Receivable, Inventory, Equipment, Accounts Payable, Unearned Revenue, Common Shares, Service Revenue, or Operating Expenses).
2. **Classify Each Account:** Determine whether each account is an Asset, Liability, Shareholders' Equity, Revenue, or Expense.
3. **Determine Direction of Change:** Determine whether each account is increasing or decreasing based on economic reality.
4. **Apply Debit/Credit Rules:**
   * Assets, Expenses, and Dividends increase with a **Debit**.
   * Liabilities, Common Shares, Retained Earnings, and Revenues increase with a **Credit**.

**3. Demonstrated Standard Entry Structure**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Account to Increase (Asset / Expense) or Decrease (Liability)** | $Amount | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Account to Increase (Liability / Revenue / Equity) or Decrease (Asset)** | | $Amount |

**4. Financial Statement Equilibrium**

Every valid transaction preserves the fundamental Canadian accounting equation:
$$\\text{Assets} = \\text{Liabilities} + \\text{Shareholders' Equity}$$
* Revenues and expenses flow into Net Income on the **Income Statement**.
* Net Income transfers into ending Retained Earnings within **Shareholders' Equity**.
* The **Statement of Financial Position (Balance Sheet)** remains in exact balance.`;
}
