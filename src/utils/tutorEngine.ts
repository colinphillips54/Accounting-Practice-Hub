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
  const q = (context.question || '').toLowerCase();
  const title = (context.scenarioTitle || '').toLowerCase();
  const narrative = (context.scenarioNarrative || '').toLowerCase();
  const fullText = `${q} ${title} ${narrative}`;

  // 1. Unearned Revenue Earned / Recognized
  if (
    fullText.includes('unearned') &&
    (fullText.includes('earn') || fullText.includes('debit') || fullText.includes('recogniz') || fullText.includes('service'))
  ) {
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

  // 2. Depreciation & Accumulated Depreciation
  if (
    fullText.includes('depreciat') ||
    fullText.includes('contra-asset') ||
    fullText.includes('useful life') ||
    fullText.includes('salvage') ||
    fullText.includes('book value') ||
    fullText.includes('carrying amount')
  ) {
    return `### Understanding Equipment Depreciation & Contra-Assets

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

  // 3. Unearned Revenue Received in Advance
  if (
    (fullText.includes('advance') || fullText.includes('deposit') || fullText.includes('retainer')) &&
    (fullText.includes('cash') || fullText.includes('customer') || fullText.includes('unearned'))
  ) {
    return `### Recording Cash Received in Advance (Unearned Revenue)

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
* **Statement of Financial Position:** Assets increase (+Cash) and Liabilities increase (+Unearned Revenue) by the identical amount. Shareholders' Equity is unaffected until the service is actually performed.`;
  }

  // 4. Common Shares Issuance & Capital Investments
  if (
    fullText.includes('share') ||
    fullText.includes('common stock') ||
    fullText.includes('invest') ||
    fullText.includes('capital')
  ) {
    return `### Owner Capital Investment & Common Shares (Canadian Standards)

**1. Underlying Accounting Treatment**

Under Canadian corporate statutes (such as the *Canada Business Corporations Act* — CBCA — and provincial equivalents like the OBCA), corporations issue **Common Shares** rather than the U.S. term "Common Stock."

* Canadian corporate law stipulates that shares are issued **without nominal or par value**. The entire cash consideration received is credited directly to the **Common Shares** account within **Shareholders' Equity**.

**2. Accounts Involved and Classifications**

* **Cash** (*Current Asset*, Normal Debit Balance): The business receives liquid capital from the founders or shareholders (**Debit**).
* **Common Shares** (*Shareholders' Equity*, Normal Credit Balance): Represents the ownership interest contributed by equity holders (**Credit**).

**3. Demonstrated Journal Entry**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Cash** | $30,000 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Common Shares** | | $30,000 |

*(To record issuance of common shares without par value for cash)*

**4. Financial Statement Impacts**

* **Income Statement:** Zero effect (capital contributions are financing activities, not operating revenues).
* **Statement of Financial Position:** Assets increase (+Cash) = Shareholders' Equity increases (+Common Shares). Total claims against corporate assets remain in exact balance.`;
  }

  // 5. Dividends Declared and Paid
  if (fullText.includes('dividend') || fullText.includes('distribution')) {
    return `### Accounting for Dividends Declared and Paid

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
* **Statement of Financial Position:** Assets decrease (-Cash) and Shareholders' Equity decreases (-Retained Earnings). The accounting equation remains balanced.`;
  }

  // 6. Accrued Expenses & Payables (e.g., Salaries, Interest)
  if (fullText.includes('accru') || fullText.includes('interest payable') || fullText.includes('salaries payable')) {
    return `### Adjusting Entry for Accrued Expenses

**1. Underlying Accounting Treatment**

Under the **accrual basis of accounting** (**IFRS / ASPE**), expenses must be recognized when incurred (economic benefit consumed), regardless of whether cash has been paid.

* For example, employees worked during the month or interest accumulated on a note payable, but the payroll or payment date falls in the subsequent period.

**2. Accounts Involved and Classifications**

* **Expense (e.g., Salaries Expense or Interest Expense)** (*Income Statement*): Increases on the **Debit** side to recognize the cost of operations.
* **Payable (e.g., Salaries Payable or Interest Payable)** (*Current Liability*): Increases on the **Credit** side to record the obligation owed to employees or lenders.

**3. Demonstrated Journal Entry**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Salaries Expense** | $1,500 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Salaries Payable** | | $1,500 |

*(To accrue unpaid employee wages earned as of month-end)*

**4. Financial Statement Impacts**

* **Income Statement:** Operating expenses increase → **Net Income decreases**.
* **Statement of Financial Position:** Liabilities increase (+Payable) while Shareholders' Equity decreases by the exact same amount (-Retained Earnings via lower Net Income). Assets are unaffected.`;
  }

  // 7. Prepaid Expenses (e.g., Insurance, Rent)
  if (fullText.includes('prepaid') || fullText.includes('insurance expense') || fullText.includes('rent expense')) {
    return `### Accounting for Prepaid Expenses & Expirations

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
* **Statement of Financial Position:** Assets decrease (-Prepaid Insurance) and Shareholders' Equity decreases by the exact same amount (-Retained Earnings via lower Net Income).`;
  }

  // 8. Accounts Payable vs Notes Payable
  if (fullText.includes('payable') && (fullText.includes('note') || fullText.includes('difference') || fullText.includes('account'))) {
    return `### Accounts Payable vs. Notes Payable Explained

**1. Accounts Payable (Trade Credit)**

* **Nature:** Informal short-term obligations arising from everyday purchases of inventory or supplies on account.
* **Documentation & Terms:** Supported by a supplier invoice with standard credit terms (e.g., Net 30 or 2/10, n/30).
* **Interest:** Does not typically carry explicit interest unless overdue.
* **Classification:** Almost always a **Current Liability** on the Statement of Financial Position.

**2. Notes Payable (Promissory Note)**

* **Nature:** Formal written contractual promise to repay a specified principal amount plus interest at a fixed future date.
* **Documentation & Terms:** Formal legal promissory note specifying the principal, maturity date, and stated annual interest rate.
* **Interest:** Accumulates interest over time (Principal × Rate × Time), requiring adjusting entries for **Interest Expense** and **Interest Payable**.
* **Classification:** Can be a **Current Liability** (if maturing within 12 months) or a **Non-Current (Long-Term) Liability** under Canadian standards.`;
  }

  // 9. Inventory & Cost of Goods Sold (Perpetual Inventory)
  if (fullText.includes('inventory') || fullText.includes('cost of goods sold') || fullText.includes('cogs') || fullText.includes('perpetual')) {
    return `### Perpetual Inventory System & Canadian Standards

**1. The 2-Step Perpetual Sales Entry**

In a perpetual inventory system under Canadian standards, recording a merchandise sale requires **two simultaneous entries**:

* **Entry A (Record Sale to Customer):**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Cash (or Accounts Receivable)** | $1,200 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Sales Revenue** | | $1,200 |

* **Entry B (Record Inventory Outflow & Wholesale Cost):**

| Account Name | Debit | Credit |
| :--- | :--- | :--- |
| **Cost of Goods Sold (COGS)** | $700 | |
| &nbsp;&nbsp;&nbsp;&nbsp;**Merchandise Inventory** | | $700 |

**2. Crucial Canadian Accounting Rule: LIFO is Prohibited!**

Under both **IFRS (IAS 2)** and **ASPE (Section 3031)**, the **Last-In, First-Out (LIFO)** inventory valuation method is **strictly prohibited** in Canada.

* Canadian companies must choose between **FIFO (First-In, First-Out)** or **Weighted Average Cost**.
* Inventory must be valued at the **Lower of Cost and Net Realizable Value (LCNRV)**.`;
  }

  // 10. Context-Aware Fallback (uses the active scenario if student asked a contextual question)
  if (context.scenarioTitle && context.scenarioNarrative) {
    return `### Conceptual Analysis for ${context.scenarioTitle}

**1. Transaction Context & Economic Activity**

* **Entity:** ${context.companyName || 'The Company'}
* **Transaction:** "${context.scenarioNarrative}"
* **Topic:** ${context.scenarioTopic || 'Financial Accounting'}

**2. How to Analyze this Journal Entry (Canadian ASPE / IFRS):**

* **Step 1 — Identify the Accounts:** What did the business receive or give up? Look at the economic resources transferred (Cash, Supplies, Inventory, Equipment) or obligations incurred (Accounts Payable, Unearned Revenue).
* **Step 2 — Determine the Classification:**
  * **Assets** (Cash, Accounts Receivable, Inventory, Equipment) have **Debit** normal balances.
  * **Liabilities** (Accounts Payable, Notes Payable, Unearned Revenue) have **Credit** normal balances.
  * **Shareholders' Equity** (Common Shares, Retained Earnings) has a **Credit** normal balance.
  * **Revenues** increase equity with a **Credit**.
  * **Expenses** and **Dividends** decrease equity with a **Debit**.
* **Step 3 — Maintain Equilibrium:** Debits must always equal Credits. Every transaction affects at least two accounts.

**3. Financial Statement Flow:**

1. Any revenue or expense accounts flow to the **Income Statement**, determining Net Income.
2. Net Income (less any Dividends declared) flows to the **Statement of Retained Earnings**.
3. Ending Retained Earnings flows into **Shareholders' Equity** on the **Statement of Financial Position (Balance Sheet)**, keeping Assets = Liabilities + Shareholders' Equity in balance.`;
  }

  // 11. General Socratic Fallback
  return `### Accounting Principles & Double-Entry Reasoning

**1. The Fundamental Canadian Accounting Equation**

**Assets = Liabilities + Shareholders' Equity**

Every business transaction maintains this equality. Under Canadian accounting standards (**IFRS & ASPE**):

* **Assets:** Resources controlled by the entity that represent probable future economic benefits (Cash, Receivables, Inventory, Equipment).
* **Liabilities:** Present legal or constructive obligations to transfer economic resources (Payables, Unearned Revenues, Bank Loans).
* **Shareholders' Equity:** Residual interest in the assets after deducting all liabilities, composed of **Common Shares** (no par value) and **Retained Earnings**.

**2. Rules of Debits and Credits**

* **Debit Side (Left):** Increases Assets, Expenses, and Dividends. Decreases Liabilities, Shareholders' Equity, and Revenues.
* **Credit Side (Right):** Increases Liabilities, Shareholders' Equity, and Revenues. Decreases Assets, Expenses, and Dividends.

**3. Financial Statement Flow**

1. **Income Statement:** Revenues minus Expenses equals **Net Income**.
2. **Statement of Retained Earnings:** Beginning Retained Earnings + Net Income - Dividends = **Ending Retained Earnings**.
3. **Statement of Financial Position (Balance Sheet):** Displays the final financial position where Total Assets equal Total Liabilities plus Shareholders' Equity.`;
}
