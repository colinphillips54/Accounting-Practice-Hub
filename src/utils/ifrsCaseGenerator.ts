import { IfrsCase, CaseAppendix, IfrsAccountingIssue, AccountingCriterion } from '../types/ifrsCase';
import { generateUniqueCanadianCompany, CanadianCompanyProfile } from './canadianCompanyGenerator';

export interface IfrsStandardInfo {
  code: string;
  name: string;
  handbookSection: string;
  topic: string;
}

export const ALL_IFRS_STANDARDS: IfrsStandardInfo[] = [
  { code: 'IFRS 1', name: 'First-time Adoption of International Financial Reporting Standards', handbookSection: 'Part I - IFRS 1', topic: 'First-time Adoption of IFRS' },
  { code: 'IFRS 2', name: 'Share-based Payment', handbookSection: 'Part I - IFRS 2, paras 10-15', topic: 'Equity-Settled Share Options & Vesting Period' },
  { code: 'IFRS 3', name: 'Business Combinations', handbookSection: 'Part I - IFRS 3, paras 32-40', topic: 'Acquisition Method & Goodwill' },
  { code: 'IFRS 5', name: 'Non-current Assets Held for Sale and Discontinued Operations', handbookSection: 'Part I - IFRS 5, paras 6-15 & 25', topic: 'Held for Sale Criteria, Cessation of Depreciation & Write-Down' },
  { code: 'IFRS 7', name: 'Financial Instruments: Disclosures', handbookSection: 'Part I - IFRS 7', topic: 'Financial Risk & Fair Value Disclosures' },
  { code: 'IFRS 8', name: 'Operating Segments', handbookSection: 'Part I - IFRS 8', topic: 'Chief Operating Decision Maker & Segment Reporting' },
  { code: 'IFRS 9', name: 'Financial Instruments', handbookSection: 'Part I - IFRS 9, paras 4.1.2-4.1.4 & 5.5', topic: 'SPPI Test, FVTPL vs Amortized Cost & Transaction Costs' },
  { code: 'IFRS 10', name: 'Consolidated Financial Statements', handbookSection: 'Part I - IFRS 10, paras 5-18', topic: 'Three Elements of Control & Consolidation' },
  { code: 'IFRS 11', name: 'Joint Arrangements', handbookSection: 'Part I - IFRS 11, paras 14-19', topic: 'Joint Operations vs. Joint Ventures' },
  { code: 'IFRS 12', name: 'Disclosure of Interests in Other Entities', handbookSection: 'Part I - IFRS 12', topic: 'Interests in Other Entities' },
  { code: 'IFRS 13', name: 'Fair Value Measurement', handbookSection: 'Part I - IFRS 13, paras 72-90', topic: 'Fair Value Hierarchy (Level 1, 2, 3 Inputs)' },
  { code: 'IFRS 15', name: 'Revenue from Contracts with Customers', handbookSection: 'Part I - IFRS 15, paras 31-38 & 56-58', topic: 'Revenue Recognition & Multi-Element Bundles' },
  { code: 'IFRS 16', name: 'Leases', handbookSection: 'Part I - IFRS 16, paras 22-38', topic: 'Right-of-Use Asset & Lease Liability' },
  { code: 'IFRS 17', name: 'Insurance Contracts', handbookSection: 'Part I - IFRS 17', topic: 'Insurance Contracts' },
  { code: 'IAS 1', name: 'Presentation of Financial Statements', handbookSection: 'Part I - IAS 1, paras 69-76', topic: 'Debt Covenant Breaches & Liability Classification' },
  { code: 'IAS 2', name: 'Inventories', handbookSection: 'Part I - IAS 2, paras 9, 25 & 28-33', topic: 'Lower of Cost and Net Realizable Value & LIFO Prohibition' },
  { code: 'IAS 7', name: 'Statement of Cash Flows', handbookSection: 'Part I - IAS 7', topic: 'Operating, Investing & Financing Cash Flows' },
  { code: 'IAS 8', name: 'Accounting Policies, Changes in Accounting Estimates and Errors', handbookSection: 'Part I - IAS 8, paras 14-31', topic: 'Changes in Policies vs Estimates vs Prior Period Errors' },
  { code: 'IAS 10', name: 'Events after the Reporting Period', handbookSection: 'Part I - IAS 10, paras 8-11', topic: 'Adjusting vs Non-Adjusting Subsequent Events' },
  { code: 'IAS 12', name: 'Income Taxes', handbookSection: 'Part I - IAS 12, paras 15-24', topic: 'Temporary Differences & Deferred Tax Assets/Liabilities' },
  { code: 'IAS 16', name: 'Property, Plant and Equipment', handbookSection: 'Part I - IAS 16, paras 12-16 & 43-47', topic: 'Component Depreciation & Dismantling Provisions' },
  { code: 'IAS 19', name: 'Employee Benefits', handbookSection: 'Part I - IAS 19, paras 56-65', topic: 'Defined Benefit vs Defined Contribution Plans' },
  { code: 'IAS 20', name: 'Accounting for Government Grants and Disclosure of Government Assistance', handbookSection: 'Part I - IAS 20, paras 7-23', topic: 'Government Grants & Forgivable Loans' },
  { code: 'IAS 21', name: 'The Effects of Changes in Foreign Exchange Rates', handbookSection: 'Part I - IAS 21, paras 21-28', topic: 'Foreign Currency Transaction & Monetary Item Translation' },
  { code: 'IAS 23', name: 'Borrowing Costs', handbookSection: 'Part I - IAS 23, paras 8-15', topic: 'Mandatory Capitalization on Qualifying Assets' },
  { code: 'IAS 24', name: 'Related Party Disclosures', handbookSection: 'Part I - IAS 24, paras 9-18', topic: 'Related Party Identification & Arm\'s Length Disclosures' },
  { code: 'IAS 27', name: 'Separate Financial Statements', handbookSection: 'Part I - IAS 27', topic: 'Separate Financial Statements' },
  { code: 'IAS 28', name: 'Investments in Associates and Joint Ventures', handbookSection: 'Part I - IAS 28, paras 5-16', topic: 'Significant Influence & Equity Accounting' },
  { code: 'IAS 32', name: 'Financial Instruments: Presentation', handbookSection: 'Part I - IAS 32, paras 15-20', topic: 'Financial Liabilities vs Equity Classification' },
  { code: 'IAS 33', name: 'Earnings per Share', handbookSection: 'Part I - IAS 33', topic: 'Basic and Diluted EPS' },
  { code: 'IAS 34', name: 'Interim Financial Reporting', handbookSection: 'Part I - IAS 34', topic: 'Interim Financial Reporting' },
  { code: 'IAS 36', name: 'Impairment of Assets', handbookSection: 'Part I - IAS 36, paras 8-17 & 58-60', topic: 'Impairment of CGUs & Recoverable Amount' },
  { code: 'IAS 37', name: 'Provisions, Contingent Liabilities and Contingent Assets', handbookSection: 'Part I - IAS 37, paras 14-26 & 53-58', topic: 'Provisions, Litigation & Decommissioning' },
  { code: 'IAS 38', name: 'Intangible Assets', handbookSection: 'Part I - IAS 38, paras 54-67', topic: 'Research vs. Development Capitalization (PIRATE)' },
  { code: 'IAS 40', name: 'Investment Property', handbookSection: 'Part I - IAS 40, paras 33-55', topic: 'Investment Property: Fair Value Model Gains in P&L' },
  { code: 'IAS 41', name: 'Agriculture', handbookSection: 'Part I - IAS 41, paras 12-25', topic: 'Biological Assets & Agricultural Produce' }
];

export const CORE_IFRS_STANDARDS: IfrsStandardInfo[] = ALL_IFRS_STANDARDS;

export type CompanyTemplate = CanadianCompanyProfile;


function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface GeneratedIssueResult {
  issue: IfrsAccountingIssue;
  narrativeChunk: string;
  appendix: CaseAppendix;
  eventTitle: string;
}

/**
 * Builds an authentic Issue 1: IFRS 15 Revenue from Contracts with Customers
 */
function createIfrs15Issue(company: CompanyTemplate, seed: number): GeneratedIssueResult {
  const contractTotal = randomInt(20, 50) * 100000; // e.g. $2,400,000 - $5,000,000
  const depositPct = randomChoice([20, 25, 30, 35]);
  const depositAmt = Math.round(contractTotal * (depositPct / 100));
  const equipmentSasp = Math.round(contractTotal * 0.65);
  const installSasp = Math.round(contractTotal * 0.20);
  const supportSasp = contractTotal - equipmentSasp - installSasp; // 15%
  const installProgress = randomChoice([30, 40, 50]);
  const installEarned = Math.round(installSasp * (installProgress / 100));
  const earnedTotal = equipmentSasp + installEarned;
  const unearnedPremature = contractTotal - earnedTotal;

  const narrativeChunk = `In October 2026, ${company.companyName} executed a major sales agreement totaling $${contractTotal.toLocaleString()} CAD with an enterprise customer. The contract entails supplying specialized ${company.productLine}, performing complex on-site installation, and providing two years of mandatory technical maintenance starting in 2027. The client paid a non-refundable upfront cash deposit of $${depositAmt.toLocaleString()} (${depositPct}%). On December 1, 2026, the core hardware was physically delivered. As of December 31, 2026, installation is estimated to be ${installProgress}% complete, with remaining integration scheduled to conclude in late February 2027. The sales vice-president recognized the entire $${contractTotal.toLocaleString()} contract price as revenue in the draft 2026 financial statements, citing physical delivery of the equipment and the non-refundable nature of the deposit.`;

  const appendix: CaseAppendix = {
    id: `app-ifrs15-${seed}`,
    title: `Appendix II: Customer Master Sales Agreement & Stand-Alone Price Schedule`,
    type: 'contract',
    content: `Customer Master Contract Summary:
• Customer: Apex Global Operations Corp.
• Total Contract Price: $${contractTotal.toLocaleString()} CAD.
• Upfront Non-refundable Deposit Received: $${depositAmt.toLocaleString()} (${depositPct}%).

Stand-Alone Selling Price (SASP) Breakdown:
1. Core Hardware & Robotics Unit: $${equipmentSasp.toLocaleString()} (Delivered to customer premises Dec 1, 2026).
2. Specialized On-Site Installation: $${installSasp.toLocaleString()} (${installProgress}% complete at Dec 31, 2026 based on engineering hours incurred).
3. 2-Year 24/7 Technical Support & Warranty Service: $${supportSasp.toLocaleString()} (Service commences March 1, 2027, following operational sign-off).
Total Stand-Alone Sum: $${contractTotal.toLocaleString()} CAD.

Management Draft Treatment: Full $${contractTotal.toLocaleString()} recognized as revenue in fiscal 2026.`
  };

  const issue: IfrsAccountingIssue = {
    id: 'issue-ifrs-15',
    title: 'Revenue Recognition for Bundled Multi-Element Contract',
    topic: 'Revenue Recognition',
    standardCode: 'IFRS 15',
    standardName: 'Revenue from Contracts with Customers',
    handbookSection: 'Part I - IFRS 15, paras 22-30 (Distinct Performance Obligations) & 31-38 (Timing of Satisfaction)',
    description: `Premature recognition of the entire $${contractTotal.toLocaleString()} contract price before installation is completed and before the 2-year maintenance period begins.`,
    criteria: [
      {
        id: 'c-po-distinct',
        name: 'Identification of Distinct Performance Obligations',
        standardReference: 'IFRS 15.22-30',
        description: 'Goods and services are distinct if the customer can benefit from them either on their own or together with other readily available resources.',
        expectedCaseFact: `Three distinct performance obligations: Core Hardware ($${equipmentSasp.toLocaleString()}), Installation ($${installSasp.toLocaleString()}), and 2-Year Maintenance ($${supportSasp.toLocaleString()}).`
      },
      {
        id: 'c-timing',
        name: 'Timing of Revenue Recognition (Point in Time vs. Over Time)',
        standardReference: 'IFRS 15.31-38',
        description: 'Revenue is recognized when control transfers. Core equipment transferred at point in time; installation recognized over time; future support is 0% complete.',
        expectedCaseFact: `Earned revenue in 2026 is only $${earnedTotal.toLocaleString()} ($${equipmentSasp.toLocaleString()} equipment + $${installEarned.toLocaleString()} installation). Premature revenue of $${unearnedPremature.toLocaleString()} must be reversed.`
      }
    ],
    modelRecommendation: {
      accountingTreatment: `Under IFRS 15, reverse $${unearnedPremature.toLocaleString()} of unearned revenue. Record the unearned portion as a Contract Liability (Deferred Revenue) on the Statement of Financial Position.`,
      financialStatementImpact: `Debit Sales Revenue $${unearnedPremature.toLocaleString()}, Credit Contract Liability (Current Liabilities) $${unearnedPremature.toLocaleString()}. Net Income decreases by $${unearnedPremature.toLocaleString()}.`,
      journalEntry: `DR: Sales Revenue                     $${unearnedPremature.toLocaleString()}
    CR: Contract Liability (Current)           $${unearnedPremature.toLocaleString()}`,
      covenantOrBusinessImpact: `Increasing Current Liabilities by $${unearnedPremature.toLocaleString()} significantly erodes the Current Working Capital Ratio and reduces Net Earnings Before Tax.`
    },
    guidanceHints: {
      missingIssueHint: `Review the multi-element customer sales contract. Did the company deliver and fulfill all promises under the contract, or does installation and ongoing support remain outstanding?`,
      wrongStandardHint: `Commercial revenue contracts are governed by IFRS 15 (Part I of CPA Canada Handbook).`,
      incompleteAnalysisHint: `Apply the 5-step model under IFRS 15. Separate distinct performance obligations and evaluate point in time vs over time progress.`
    }
  };

  return { issue, narrativeChunk, appendix, eventTitle: 'Commercial Equipment Sales Contract & Installation' };
}

/**
 * Builds an authentic Issue 2: IAS 38 Intangible Assets (Research vs Development)
 */
function createIas38Issue(company: CompanyTemplate, seed: number): GeneratedIssueResult {
  const totalRnd = randomInt(8, 20) * 100000; // e.g. $800,000 - $2,000,000
  const researchAmt = Math.round(totalRnd * 0.55);
  const devAmt = totalRnd - researchAmt;

  const narrativeChunk = `Throughout 2026, ${company.companyName} invested heavily in Project Horizon, a new proprietary next-generation technology intended to automate operational workflows. Total expenditures incurred reached $${totalRnd.toLocaleString()} CAD. In the draft annual financial statements, management capitalized all $${totalRnd.toLocaleString()} as an Intangible Asset under Non-Current Assets. However, internal technical logs (Appendix III) reveal that between January and June ($${researchAmt.toLocaleString()}), engineers were conducting exploratory theoretical testing and baseline simulations without a working prototype. Formal commercial viability, patent filings, and board budget approval only occurred on July 15, 2026, after which $${devAmt.toLocaleString()} was spent completing the production prototype.`;

  const appendix: CaseAppendix = {
    id: `app-ias38-${seed}`,
    title: `Appendix III: Engineering Technical Memorandum — Project Horizon R&D Milestones`,
    type: 'memo',
    content: `MEMORANDUM
To: Director of Financial Reporting
From: Chief Technology Officer
Date: November 18, 2026
Subject: Project Horizon Expenditure Classification

• Phase 1 (Jan 1, 2026 – June 30, 2026): $${researchAmt.toLocaleString()}
Activities: Literature review, mathematical modeling, algorithm simulations, and feasibility experiments. No functioning prototype existed. Market demand and technical viability had not yet been proven.

• Key Milestone Date: July 15, 2026
Technical viability was conclusively demonstrated via successful bench prototype testing. The Board of Directors formally approved the commercial commercialization plan, and an initial letter of intent was executed with a launch customer.

• Phase 2 (July 16, 2026 – Dec 31, 2026): $${devAmt.toLocaleString()}
Activities: Tooling, detailed hardware design, firmware safety hardening, and field integration trials.

Accounting Position Taken: The full $${totalRnd.toLocaleString()} is currently capitalized on the draft Statement of Financial Position.`
  };

  const issue: IfrsAccountingIssue = {
    id: 'issue-ias-38',
    title: 'Capitalization of Research vs. Development Expenditures',
    topic: 'Intangible Assets',
    standardCode: 'IAS 38',
    standardName: 'Intangible Assets',
    handbookSection: 'Part I - IAS 38, paras 54-67 (Research Phase vs. Development Phase PIRATE Criteria)',
    description: `Improper capitalization of $${researchAmt.toLocaleString()} of preliminary research expenditures prior to meeting the six PIRATE criteria on July 15, 2026.`,
    criteria: [
      {
        id: 'c-research-expense',
        name: 'Mandatory Expensing of Research Phase',
        standardReference: 'IAS 38.54',
        description: 'No intangible asset arising from research (or research phase of an internal project) shall be recognized. Expenditures on research must be recognized as an expense when incurred.',
        expectedCaseFact: `The $${researchAmt.toLocaleString()} incurred prior to July 15 was exploratory research and must be expensed immediately to profit or loss.`
      },
      {
        id: 'c-pirate-criteria',
        name: 'Six Development Phase Capitalization Criteria (PIRATE)',
        standardReference: 'IAS 38.57',
        description: 'Entity must demonstrate: Probable future economic benefits, Intention to complete, Resources available, Ability to use or sell, Technical feasibility, and Reliable Expenditure measurement.',
        expectedCaseFact: `All six criteria were satisfied on July 15, 2026. Only the $${devAmt.toLocaleString()} incurred after July 15 can be capitalized as an Intangible Asset.`
      }
    ],
    modelRecommendation: {
      accountingTreatment: `Under IAS 38, derecognize $${researchAmt.toLocaleString()} from Intangible Assets and charge to Research & Development Expense. Only $${devAmt.toLocaleString()} remains capitalized as an Intangible Asset.`,
      financialStatementImpact: `Debit R&D Expense $${researchAmt.toLocaleString()}, Credit Intangible Assets $${researchAmt.toLocaleString()}. Reduces Net Income and Non-Current Assets by $${researchAmt.toLocaleString()}.`,
      journalEntry: `DR: Research & Development Expense       $${researchAmt.toLocaleString()}
    CR: Capitalized Intangible Assets           $${researchAmt.toLocaleString()}`,
      covenantOrBusinessImpact: `Reduces reported Operating Income and Shareholders' Equity by $${researchAmt.toLocaleString()}, tightening debt-to-equity ratios.`
    },
    guidanceHints: {
      missingIssueHint: `Examine the R&D expenditures. Can an enterprise capitalize preliminary research testing before establishing technical feasibility under Canadian IFRS?`,
      wrongStandardHint: `Internally generated intangible assets are governed by IAS 38 (Intangible Assets).`,
      incompleteAnalysisHint: `Evaluate the 6 PIRATE criteria under IAS 38.57. When was commercial viability proven?`
    }
  };

  return { issue, narrativeChunk, appendix, eventTitle: 'Project Horizon Enterprise Technology Development' };
}

/**
 * Builds an authentic Issue 3: IFRS 16 Leases
 */
function createIfrs16Issue(company: CompanyTemplate, seed: number): GeneratedIssueResult {
  const leaseTerm = randomChoice([4, 5, 6]);
  const annualPayment = randomInt(4, 9) * 100000; // e.g. $500,000 - $900,000
  const rate = 6.0;
  // PV factor approximation
  const pvFactor = (1 - Math.pow(1 + rate / 100, -leaseTerm)) / (rate / 100);
  const initialLiability = Math.round(annualPayment * pvFactor);
  const legalFees = randomChoice([40000, 50000, 60000]);
  const initialRouAsset = initialLiability + legalFees;
  const year1Depr = Math.round(initialRouAsset / leaseTerm);
  const year1Interest = Math.round(initialLiability * (rate / 100));

  const narrativeChunk = `On January 1, 2026, ${company.companyName} entered into a ${leaseTerm}-year commercial lease for a specialized ${company.productLine} distribution facility. The lease stipulates annual payments of $${annualPayment.toLocaleString()} CAD due at the end of each year. The company incurred $${legalFees.toLocaleString()} in initial direct legal and lease origination fees. The incremental borrowing rate is ${rate}%. Management recorded the annual payment of $${annualPayment.toLocaleString()} simply as "Rent Expense" on the draft Income Statement, arguing that ownership does not transfer at the end of ${leaseTerm} years and keeping the multi-million-dollar obligation off the Statement of Financial Position.`;

  const appendix: CaseAppendix = {
    id: `app-ifrs16-${seed}`,
    title: `Appendix II: Commercial Facility Lease Agreement Summary`,
    type: 'contract',
    content: `Commercial Real Estate Lease Extract:
• Lessor: Canadian Commercial Properties REIT
• Lessee: ${company.companyName}
• Commencement: January 1, 2026 | Term: ${leaseTerm} Years
• Annual Rental: $${annualPayment.toLocaleString()} CAD payable annually in arrears on December 31.
• Direct Origination Costs: $${legalFees.toLocaleString()} paid in cash by Lessee on Jan 1, 2026.
• Incremental Borrowing Rate: ${rate}% per annum.
• Present Value of Lease Payments at Inception: $${initialLiability.toLocaleString()} CAD.

Management Note: "Because ownership remains with the lessor and this is a property lease, we recorded rent expense of $${annualPayment.toLocaleString()} and kept the lease off-balance-sheet."`
  };

  const issue: IfrsAccountingIssue = {
    id: 'issue-ifrs-16',
    title: 'Off-Balance-Sheet Accounting for Facility Lease',
    topic: 'Leases',
    standardCode: 'IFRS 16',
    standardName: 'Leases',
    handbookSection: 'Part I - IFRS 16, paras 22-38 (Right-of-Use Asset & Lease Liability)',
    description: `Failure to recognize a Right-of-Use Asset ($${initialRouAsset.toLocaleString()}) and Lease Liability ($${initialLiability.toLocaleString()}) on the Statement of Financial Position.`,
    criteria: [
      {
        id: 'c-lease-definition',
        name: 'Definition of a Lease & Scope',
        standardReference: 'IFRS 16.9',
        description: 'Contract conveys the right to control the use of an identified asset for a period of time in exchange for consideration.',
        expectedCaseFact: `The facility is an identified asset exclusively controlled by ${company.companyName} for ${leaseTerm} years.`
      },
      {
        id: 'c-no-exemption',
        name: 'Ineligibility for Recognition Exemptions',
        standardReference: 'IFRS 16.5',
        description: 'Exemptions are restricted to short-term leases (<= 12 months) and low-value assets. Commercial facilities cannot be treated as off-balance-sheet.',
        expectedCaseFact: `The ${leaseTerm}-year lease exceeds 12 months and involves high value. Off-balance-sheet operating lease accounting is prohibited under IFRS 16.`
      }
    ],
    modelRecommendation: {
      accountingTreatment: `Under IFRS 16, recognize a Right-of-Use Asset of $${initialRouAsset.toLocaleString()} (including $${legalFees.toLocaleString()} legal fees) and a Lease Liability of $${initialLiability.toLocaleString()} at Jan 1, 2026. Reverse Rent Expense of $${annualPayment.toLocaleString()} and instead recognize ROU Depreciation ($${year1Depr.toLocaleString()}) and Interest Expense ($${year1Interest.toLocaleString()}).`,
      financialStatementImpact: `Increases Assets by $${(initialRouAsset - year1Depr).toLocaleString()} (Net ROU Asset). Increases Total Debt by $${(initialLiability + year1Interest - annualPayment).toLocaleString()} (Ending Lease Liability).`,
      journalEntry: `DR: Right-of-Use Asset (Facility)        $${initialRouAsset.toLocaleString()}
    CR: Lease Liability (Non-Current/Cur)      $${initialLiability.toLocaleString()}
    CR: Cash (Direct Legal Costs)                  $${legalFees.toLocaleString()}`,
      covenantOrBusinessImpact: `Adding the substantial lease liability directly increases Total Debt, increasing the company's Debt-to-Equity ratio.`
    },
    guidanceHints: {
      missingIssueHint: `Look at the multi-year facility lease agreement. Does IFRS permit keeping commercial property leases off the Statement of Financial Position?`,
      wrongStandardHint: `Lease accounting is governed by IFRS 16 (Leases) in Part I of the CPA Canada Handbook.`,
      incompleteAnalysisHint: `Under IFRS 16, all non-exempt leases require a Right-of-Use Asset and Lease Liability calculated at present value.`
    }
  };

  return { issue, narrativeChunk, appendix, eventTitle: 'Multi-Year Distribution Facility Agreement' };
}

/**
 * Builds an authentic Issue 4: IAS 37 Provisions, Contingent Liabilities & Contingent Assets
 */
function createIas37Issue(company: CompanyTemplate, seed: number): GeneratedIssueResult {
  const claimAmt = randomInt(20, 45) * 100000; // e.g. $2.0M - $4.5M
  const bestEstimate = Math.round(claimAmt * 0.8);

  const narrativeChunk = `In August 2026, ${company.companyName} experienced an operational failure during a customer deployment, resulting in substantial commercial damage. The customer initiated formal litigation claiming $${claimAmt.toLocaleString()} CAD for breach of contract and consequential losses. External legal counsel (Appendix III) provided a confidential assessment stating that the company has a present legal obligation from a past breach, with settlement probability exceeding 80% (probable). Counsel estimates the most reliable single settlement figure to be $${bestEstimate.toLocaleString()} CAD. Furthermore, the company holds commercial insurance, but the insurer has issued a reservation of rights contesting coverage. Management has not recorded any liability on the draft financial statements, asserting that no judgment has been issued by a court.`;

  const appendix: CaseAppendix = {
    id: `app-ias37-${seed}`,
    title: `Appendix III: Legal Opinion Letter from External Litigation Counsel`,
    type: 'memo',
    content: `CONFIDENTIAL ATTORNEY-CLIENT PRIVILEGED DOCUMENT
To: VP Finance & Audit Committee, ${company.companyName}
From: Bennett & Henderson LLP, Commercial Litigation Counsel
Date: December 10, 2026
Subject: Customer Breach-of-Contract Litigation (Court File No. CV-26-9042)

We have reviewed the contract specifications and telemetry logs regarding the August 2026 incident. In our assessment:
1. Present Obligation: ${company.companyName} failed to perform mandatory quality and maintenance verifications, constituting an obligating past event under the commercial agreement.
2. Probability: An outflow of economic resources to settle the claim is probable (estimated at 80% to 85% probability).
3. Estimation: While the claimant seeks $${claimAmt.toLocaleString()} CAD, we estimate the realistic settlement range to be between $${(bestEstimate * 0.9).toLocaleString()} and $${(bestEstimate * 1.1).toLocaleString()} CAD, with $${bestEstimate.toLocaleString()} CAD representing our best single estimate.
4. Insurance Recovery: The insurer has contested coverage due to late notice. Recovery is contested and cannot be considered virtually certain at this time.`
  };

  const issue: IfrsAccountingIssue = {
    id: 'issue-ias-37',
    title: 'Accrual of Provision for Pending Customer Litigation',
    topic: 'Provisions & Contingencies',
    standardCode: 'IAS 37',
    standardName: 'Provisions, Contingent Liabilities and Contingent Assets',
    handbookSection: 'Part I - IAS 37, paras 14-26 (Criteria for Provision) & paras 53-58 (Reimbursements)',
    description: `Failure to accrue a legal provision of $${bestEstimate.toLocaleString()} despite meeting all three criteria under IAS 37.14 (Present obligation, probable outflow, reliable estimate).`,
    criteria: [
      {
        id: 'c-three-criteria',
        name: 'Three Mandatory Criteria for Recognizing a Provision',
        standardReference: 'IAS 37.14',
        description: 'A provision shall be recognized when: (a) entity has a present obligation as a result of a past event; (b) probable outflow of resources; and (c) reliable estimate of the amount.',
        expectedCaseFact: `All three criteria are satisfied: past operational breach occurred, counsel confirms >80% likelihood of payout, and reliable best estimate is $${bestEstimate.toLocaleString()}.`
      },
      {
        id: 'c-reimbursement',
        name: 'Prohibition on Netting Contested Insurance Assets',
        standardReference: 'IAS 37.53',
        description: 'Reimbursement from third parties can only be recognized when virtually certain. Cannot be netted against the provision when contested.',
        expectedCaseFact: `Insurance recovery is contested by the insurer and is not virtually certain. Cannot be recognized as an asset or netted against the provision.`
      }
    ],
    modelRecommendation: {
      accountingTreatment: `Under IAS 37, record an immediate provision of $${bestEstimate.toLocaleString()} as a Current Liability with an offsetting charge to Litigation Expense. Do not record an insurance asset.`,
      financialStatementImpact: `Debit Litigation Expense $${bestEstimate.toLocaleString()}, Credit Provision for Litigation (Current Liabilities) $${bestEstimate.toLocaleString()}. Net Income drops by $${bestEstimate.toLocaleString()}.`,
      journalEntry: `DR: Litigation & Settlement Expense         $${bestEstimate.toLocaleString()}
    CR: Provision for Litigation (Liability)      $${bestEstimate.toLocaleString()}`,
      covenantOrBusinessImpact: `Drastically reduces Net Income and Working Capital, potentially triggering debt covenant defaults.`
    },
    guidanceHints: {
      missingIssueHint: `Review the pending customer litigation. When legal counsel assesses an 80% likelihood of payout with a reliable estimate, does IAS 37 allow management to omit a liability?`,
      wrongStandardHint: `Litigation obligations and provisions are governed by IAS 37 (Part I of CPA Canada Handbook).`,
      incompleteAnalysisHint: `Evaluate the 3 mandatory criteria under IAS 37.14: Present Obligation, Probable Outflow (>50%), and Reliable Estimate.`
    }
  };

  return { issue, narrativeChunk, appendix, eventTitle: 'Customer Operational Claim & Legal Counsel Assessment' };
}

/**
 * Builds an authentic Issue 5: IAS 36 Impairment of Assets
 */
function createIas36Issue(company: CompanyTemplate, seed: number): GeneratedIssueResult {
  const carryingAmt = randomInt(8, 15) * 1000000; // e.g. $10,000,000
  const fvlcd = Math.round(carryingAmt * 0.65);
  const valueInUse = Math.round(carryingAmt * 0.75);
  const recoverableAmt = Math.max(fvlcd, valueInUse); // $7,500,000
  const impairmentLoss = carryingAmt - recoverableAmt; // $2,500,000

  const narrativeChunk = `In the fourth quarter of 2026, ${company.companyName} lost its largest commercial distributor, and a competitor introduced a disruptive, lower-cost alternative technology. Management acknowledged that these events represent clear indicators of impairment under IFRS for the company's Western Operating Cash-Generating Unit (CGU), which carries net operating assets of $${carryingAmt.toLocaleString()} CAD. An independent valuation report (Appendix III) was prepared at year-end indicating that Fair Value Less Costs of Disposal (FVLCD) is $${fvlcd.toLocaleString()} CAD, while discounted Value in Use (VIU) is $${valueInUse.toLocaleString()} CAD. Management refused to record an impairment loss, asserting that market conditions are temporary and arguing that carrying value will recover in 2028.`;

  const appendix: CaseAppendix = {
    id: `app-ias36-${seed}`,
    title: `Appendix III: Independent Valuation & Asset Appraiser Summary Report`,
    type: 'report',
    content: `Independent Appraiser Valuation Summary — Western CGU Assets:
• Recorded Carrying Book Value of Operating Assets: $${carryingAmt.toLocaleString()} CAD.
• Fair Value Less Costs of Disposal (Market Comparable Method): $${fvlcd.toLocaleString()} CAD.
• Value in Use (Discounted Cash Flow Model at 11.5% WACC): $${valueInUse.toLocaleString()} CAD.

Appraiser Notes:
Asset utilization has dropped 35% following customer attrition.
Management Position: No write-down recorded in draft statements; awaiting market turnaround in 2028.`
  };

  const issue: IfrsAccountingIssue = {
    id: 'issue-ias-36',
    title: 'Impairment of Western Cash-Generating Unit (CGU)',
    topic: 'Asset Impairment',
    standardCode: 'IAS 36',
    standardName: 'Impairment of Assets',
    handbookSection: 'Part I - IAS 36, paras 8-17 (Impairment Indicators) & 58-60 (Recognition of Loss)',
    description: `Failure to record an impairment loss of $${impairmentLoss.toLocaleString()} when the carrying amount ($${carryingAmt.toLocaleString()}) exceeds the recoverable amount ($${recoverableAmt.toLocaleString()}).`,
    criteria: [
      {
        id: 'c-impairment-indicators',
        name: 'Identification of Impairment Indicators',
        standardReference: 'IAS 36.12',
        description: 'Entity must assess at the end of each reporting period whether there is any indication that an asset or CGU may be impaired.',
        expectedCaseFact: `Loss of primary distributor and disruptive competitor entrance are significant external/internal indicators requiring formal test.`
      },
      {
        id: 'c-recoverable-amount',
        name: 'Determination of Recoverable Amount & Loss',
        standardReference: 'IAS 36.18',
        description: 'Recoverable amount is the higher of Fair Value Less Costs of Disposal and Value in Use. If carrying value exceeds recoverable amount, write down immediately.',
        expectedCaseFact: `Higher of $${fvlcd.toLocaleString()} and $${valueInUse.toLocaleString()} is $${recoverableAmt.toLocaleString()}. Impairment loss is $${impairmentLoss.toLocaleString()}.`
      }
    ],
    modelRecommendation: {
      accountingTreatment: `Under IAS 36, recognize an immediate impairment loss of $${impairmentLoss.toLocaleString()} in profit or loss and reduce the carrying value of the CGU assets to $${recoverableAmt.toLocaleString()}.`,
      financialStatementImpact: `Debit Impairment Loss $${impairmentLoss.toLocaleString()}, Credit Accumulated Impairment / PPE $${impairmentLoss.toLocaleString()}. Net Income and Total Assets decrease by $${impairmentLoss.toLocaleString()}.`,
      journalEntry: `DR: Impairment Loss (Operating Expense)    $${impairmentLoss.toLocaleString()}
    CR: Accumulated Impairment / PPE               $${impairmentLoss.toLocaleString()}`,
      covenantOrBusinessImpact: `Erodes Tangible Net Worth and total assets, severely worsening debt-to-equity ratios.`
    },
    guidanceHints: {
      missingIssueHint: `Review the CGU valuation data and market impairment indicators. What happens under IAS 36 when carrying value exceeds the recoverable amount?`,
      wrongStandardHint: `Asset impairment is governed by IAS 36 (Impairment of Assets).`,
      incompleteAnalysisHint: `Under IAS 36, recoverable amount is the higher of FVLCD and Value in Use. Compare that figure against carrying cost.`
    }
  };

  return { issue, narrativeChunk, appendix, eventTitle: 'Regional Cash-Generating Unit & Operational Review' };
}

/**
 * Builds an authentic Issue 6: IAS 2 Inventories
 */
function createIas2Issue(company: CompanyTemplate, seed: number): GeneratedIssueResult {
  const recordedCost = randomInt(5, 12) * 1000000; // e.g. $8,000,000
  const marketSelling = Math.round(recordedCost * 0.85);
  const freightDeduction = Math.round(recordedCost * 0.08);
  const nrv = marketSelling - freightDeduction;
  const writeDown = recordedCost - nrv;

  const narrativeChunk = `At fiscal year-end, ${company.companyName} held substantial quantities of bulk ${company.productLine} inventory on hand, carried at historical cost of $${recordedCost.toLocaleString()} CAD. Due to rapid technological advances and overseas supplier price deflation, current quoted selling prices have dropped to $${marketSelling.toLocaleString()} CAD. Additionally, completing the necessary freight and delivery to customer points requires $${freightDeduction.toLocaleString()} in transport and commission costs, yielding a Net Realizable Value (NRV) of $${nrv.toLocaleString()} CAD. Management has refused to record an inventory write-down, arguing that prices will recover and proposing to switch to the LIFO inventory costing method to mitigate the write-down.`;

  const appendix: CaseAppendix = {
    id: `app-ias2-${seed}`,
    title: `Appendix II: Year-End Inventory Valuation & Net Realizable Value Schedule`,
    type: 'schedule',
    content: `Inventory Valuation & NRV Schedule:
• Total Recorded Inventory Cost: $${recordedCost.toLocaleString()} CAD.
• Current Market Selling Price: $${marketSelling.toLocaleString()} CAD.
• Estimated Costs to Complete and Sell (Freight & Commissions): $${freightDeduction.toLocaleString()} CAD.
• Calculated Net Realizable Value (NRV): $${nrv.toLocaleString()} CAD.
• Excess of Cost over NRV (Write-down required): $${writeDown.toLocaleString()} CAD.

Management Proposal:
1. Defer write-down pending commodity market recovery.
2. Alternatively, adopt LIFO cost formula to reduce reported inventory values.`
  };

  const issue: IfrsAccountingIssue = {
    id: 'issue-ias-2',
    title: 'Inventory Valuation at Lower of Cost and Net Realizable Value (LCNRV)',
    topic: 'Inventory Valuation',
    standardCode: 'IAS 2',
    standardName: 'Inventories',
    handbookSection: 'Part I - IAS 2, paras 9, 25 & 28-33',
    description: `Failure to record a mandatory inventory write-down of $${writeDown.toLocaleString()} to Net Realizable Value, and proposing the prohibited LIFO method.`,
    criteria: [
      {
        id: 'c-lcnrv',
        name: 'Lower of Cost and Net Realizable Value (LCNRV)',
        standardReference: 'IAS 2.9',
        description: 'Inventories shall be measured at the lower of cost and net realizable value.',
        expectedCaseFact: `Cost is $${recordedCost.toLocaleString()}; NRV is $${nrv.toLocaleString()}. Inventory must be written down to $${nrv.toLocaleString()}.`
      },
      {
        id: 'c-lifo-ban',
        name: 'Prohibition of LIFO in Canada',
        standardReference: 'IAS 2.25',
        description: 'The Last-In, First-Out (LIFO) method is strictly prohibited under Canadian IFRS and ASPE. Only FIFO or Weighted Average formulas are permitted.',
        expectedCaseFact: `Management cannot adopt LIFO under Canadian accounting rules.`
      }
    ],
    modelRecommendation: {
      accountingTreatment: `Under IAS 2, record an immediate write-down of $${writeDown.toLocaleString()} in profit or loss (Cost of Goods Sold). LIFO proposal must be rejected.`,
      financialStatementImpact: `Debit Cost of Goods Sold $${writeDown.toLocaleString()}, Credit Merchandise Inventory $${writeDown.toLocaleString()}. Reduces Net Income and Current Assets by $${writeDown.toLocaleString()}.`,
      journalEntry: `DR: Cost of Goods Sold (Inventory Write-Down)   $${writeDown.toLocaleString()}
    CR: Merchandise Inventory                              $${writeDown.toLocaleString()}`,
      covenantOrBusinessImpact: `Directly lowers Current Assets, reducing the working capital ratio and worsening banking covenants.`
    },
    guidanceHints: {
      missingIssueHint: `Review the inventory valuation and pricing data. Is inventory properly valued at the lower of cost and net realizable value?`,
      wrongStandardHint: `Inventories are governed by IAS 2 (Inventories).`,
      incompleteAnalysisHint: `Under IAS 2, inventory must be written down to NRV. Emphasize that LIFO is illegal in Canada.`
    }
  };

  return { issue, narrativeChunk, appendix, eventTitle: 'Bulk Commodity Stock & Finished Inventory Valuation' };
}

/**
 * Builds an authentic Issue 7: IAS 1 Presentation of Financial Statements (Debt Covenant Breach)
 */
function createIas1Issue(company: CompanyTemplate, seed: number): GeneratedIssueResult {
  const loanAmt = randomInt(8, 20) * 1000000; // e.g. $12,000,000

  const narrativeChunk = `Under ${company.companyName}'s $${loanAmt.toLocaleString()} term credit facility with ${company.bankName}, the company is contractually obligated to maintain a Minimum Working Capital Ratio of 1.40:1 and Minimum Fixed Charge Coverage of 1.25x measured at fiscal year-end (December 31, 2026). As a result of the unadjusted accounting issues in the draft financial statements, the company breached both covenants on December 31, 2026, granting the lender the immediate legal right to demand repayment. On January 22, 2027 (three weeks after fiscal year-end), the bank issued a formal letter waiving the default and agreeing not to demand repayment. Management maintained the entire $${loanAmt.toLocaleString()} loan as a Non-Current Liability on the December 31, 2026 Statement of Financial Position, arguing that the waiver was obtained prior to the authorization and publication of the financial statements.`;

  const appendix: CaseAppendix = {
    id: `app-ias1-${seed}`,
    title: `Appendix IV: Bank Credit Agreement Extract & Subsequent Waiver Letter`,
    type: 'contract',
    content: `Credit Agreement Extract & Post-Balance-Sheet Waiver:
• Lender: ${company.bankName}
• Facility: $${loanAmt.toLocaleString()} CAD Senior Term Loan (Maturity: December 2030).
• Default Clause 9.1: Failure to meet covenants at fiscal year-end entitles Lender to declare the principal immediately due and payable.
• Year-End Covenant Compliance: Breached at Dec 31, 2026.

Subsequent Event Letter:
• Date: January 22, 2027
• From: Vice-President, Special Loans, ${company.bankName}
• To: Chief Financial Officer, ${company.companyName}
• Text: "We hereby agree to waive the covenant breaches as of Dec 31, 2026, and will not exercise our acceleration rights for a period of 12 months."

Management Classification: Kept as Non-Current Liability.`
  };

  const issue: IfrsAccountingIssue = {
    id: 'issue-ias-1',
    title: 'Liability Classification Following Debt Covenant Breach (Current vs. Non-Current)',
    topic: 'Financial Statement Presentation',
    standardCode: 'IAS 1',
    standardName: 'Presentation of Financial Statements',
    handbookSection: 'Part I - IAS 1, paras 69-76 (Classification of Liabilities & Covenant Breaches)',
    description: `Improper classification of $${loanAmt.toLocaleString()} term loan as Non-Current when covenants were breached at year-end and waiver was only obtained after the reporting date.`,
    criteria: [
      {
        id: 'c-ias1-covenant',
        name: 'Requirement for Unconditional Right to Defer Settlement at Reporting Date',
        standardReference: 'IAS 1.69(d) & 74',
        description: 'An entity classifies a liability as current when it does not have an unconditional right to defer settlement of the liability for at least 12 months after the reporting period. When a breach occurs on or before the balance sheet date, the liability MUST be classified as Current.',
        expectedCaseFact: `The covenant breach occurred on Dec 31, 2026. The bank had the right to call the loan at the reporting date.`
      },
      {
        id: 'c-subsequent-waiver',
        name: 'Waivers Obtained After the Reporting Period',
        standardReference: 'IAS 1.74',
        description: 'A waiver obtained AFTER the balance sheet date (even before financial statements are authorized) is a non-adjusting subsequent event under IAS 10 and DOES NOT change classification at year-end.',
        expectedCaseFact: `The waiver was received on January 22, 2027. Under IAS 1, the $${loanAmt.toLocaleString()} loan must still be classified as a Current Liability at Dec 31, 2026.`
      }
    ],
    modelRecommendation: {
      accountingTreatment: `Under IAS 1.74, reclassify the entire $${loanAmt.toLocaleString()} term loan from Non-Current Liabilities to Current Liabilities. Disclose the subsequent waiver in the notes under IAS 10.`,
      financialStatementImpact: `Increases Current Liabilities by $${loanAmt.toLocaleString()} and decreases Non-Current Liabilities by $${loanAmt.toLocaleString()}. Working Capital collapses into a catastrophic deficit.`,
      journalEntry: `DR: Long-Term Debt (Non-Current Liability)       $${loanAmt.toLocaleString()}
    CR: Current Portion of Long-Term Debt (Current)      $${loanAmt.toLocaleString()}`,
      covenantOrBusinessImpact: `Placing $${loanAmt.toLocaleString()} into Current Liabilities triggers severe going-concern questions that must be disclosed in the audit report.`
    },
    guidanceHints: {
      missingIssueHint: `Review the debt covenant waiver timing. If a waiver is obtained after year-end, does IAS 1 allow long-term classification?`,
      wrongStandardHint: `Liability presentation and covenant breaches are governed by IAS 1 (Presentation of Financial Statements).`,
      incompleteAnalysisHint: `Under IAS 1.74, a waiver obtained after the reporting date is non-adjusting for presentation purposes; the debt must be classified as Current.`
    }
  };

  return { issue, narrativeChunk, appendix, eventTitle: 'Term Credit Facility & Compliance Status' };
}

/**
 * Builds an authentic Issue 8: IFRS 11 Joint Arrangements (Joint Operation vs Joint Venture)
 */
function createIfrs11Issue(company: CompanyTemplate, seed: number): GeneratedIssueResult {
  const facilityCost = randomInt(6, 12) * 1000000;
  const projectDebt = Math.round(facilityCost * 0.6);
  const equityContributed = facilityCost - projectDebt;
  const companyShareDebt = Math.round(projectDebt * 0.5);
  const companyShareEquity = Math.round(equityContributed * 0.5);
  const companyShareGrossAsset = Math.round(facilityCost * 0.5);

  const narrativeChunk = `In February 2026, ${company.companyName} entered into a strategic consortium agreement with NorthEnergy Partners to construct and operate a specialized regional processing and storage terminal. The contractual agreement (Appendix II) specifies that the arrangement is unincorporated. Each party owns an undivided 50% legal interest in the physical facility assets, is contractually liable for 50% of the $${projectDebt.toLocaleString()} CAD third-party bank project financing, and receives 50% of the total plant operational capacity for its own commercial use. In the draft December 31, 2026 financial statements, management recorded only the net cash contribution of $${companyShareEquity.toLocaleString()} CAD as an "Investment in Joint Venture" (using equity accounting) on a single non-current asset line. The CFO argued that because decision-making is 50/50 joint control, equity accounting is appropriate, thereby omitting the company's $${companyShareDebt.toLocaleString()} CAD share of third-party project debt from the company's balance sheet.`;

  const appendix: CaseAppendix = {
    id: `app-ifrs11-${seed}`,
    title: `Appendix II: Consortium Terminal Operating Agreement Extract`,
    type: 'contract',
    content: `Terminal Joint Operating Consortium Extract:
• Parties: ${company.companyName} (50%) and NorthEnergy Partners Ltd. (50%).
• Legal Form: Unincorporated Joint Arrangement (No separate incorporated corporate entity created).
• Total Facility Capitalized Cost: $${facilityCost.toLocaleString()} CAD.
• Third-Party Consortium Loan: $${projectDebt.toLocaleString()} CAD secured by facility assets; both partners are contractually and jointly liable for 50% ($${companyShareDebt.toLocaleString()} CAD each).
• Operating Output: Each partner holds the unilateral legal right to 50% of facility throughput.
• Governance: Unanimous consent required for all major operating, financing, and capital decisions (Joint Control).

Current Accounting Treatment on Statement of Financial Position:
• Single line item: "Investment in Joint Venture" for $${companyShareEquity.toLocaleString()} CAD.
• 50% share of project debt ($${companyShareDebt.toLocaleString()} CAD) excluded from liabilities.`
  };

  const issue: IfrsAccountingIssue = {
    id: 'issue-ifrs-11',
    title: 'Classification of Joint Arrangement: Joint Operation vs. Joint Venture',
    topic: 'Joint Arrangements',
    standardCode: 'IFRS 11',
    standardName: 'Joint Arrangements',
    handbookSection: 'Part I - IFRS 11, paras 14-19 (Classification) & paras 20-23 (Accounting for Joint Operations)',
    description: `Improper equity accounting for an unincorporated joint arrangement that constitutes a Joint Operation under IFRS 11, omitting $${companyShareDebt.toLocaleString()} of debt obligations.`,
    criteria: [
      {
        id: 'c-joint-control',
        name: 'Existence of Joint Control',
        standardReference: 'IFRS 11.7',
        description: 'Contractually agreed sharing of control of an arrangement, requiring unanimous consent of the parties sharing control.',
        expectedCaseFact: `Unanimous consent is required between ${company.companyName} and NorthEnergy Partners for all relevant operational and financial decisions.`
      },
      {
        id: 'c-joint-operation-assessment',
        name: 'Classification as Joint Operation (Rights to Assets & Obligations for Liabilities)',
        standardReference: 'IFRS 11.14-17',
        description: 'An arrangement not structured through a separate vehicle is a Joint Operation. Parties have direct rights to assets and direct obligations for liabilities.',
        expectedCaseFact: `The consortium is unincorporated (no separate corporate entity) and parties are directly liable for the $${projectDebt.toLocaleString()} loan and have direct rights to output. It is a Joint Operation.`
      }
    ],
    modelRecommendation: {
      accountingTreatment: `Under IFRS 11.20, derecognize the single "Investment in Joint Venture" line and account for the Joint Operation by recognizing the company's 50% share of assets ($${companyShareGrossAsset.toLocaleString()} in PPE) and liabilities ($${companyShareDebt.toLocaleString()} in Project Debt), and net cash contribution ($${companyShareEquity.toLocaleString()}).`,
      financialStatementImpact: `Increases PPE by $${companyShareGrossAsset.toLocaleString()}, increases Long-Term Debt by $${companyShareDebt.toLocaleString()}, and eliminates Investment in Joint Venture of $${companyShareEquity.toLocaleString()}.`,
      journalEntry: `DR: Property, Plant & Equipment (50% share)     $${companyShareGrossAsset.toLocaleString()}
    CR: Long-Term Project Debt (50% share)            $${companyShareDebt.toLocaleString()}
    CR: Investment in Joint Venture (Derecognized)    $${companyShareEquity.toLocaleString()}`,
      covenantOrBusinessImpact: `Adding $${companyShareDebt.toLocaleString()} CAD to Total Debt increases the debt-to-equity ratio, creating risk of default under bank credit covenants.`
    },
    guidanceHints: {
      missingIssueHint: `Review the consortium arrangement terms. Is an unincorporated consortium with direct liability for debt properly accounted for as a Joint Venture or a Joint Operation under IFRS 11?`,
      wrongStandardHint: `Joint arrangements are governed by IFRS 11 (Part I of CPA Canada Handbook).`,
      incompleteAnalysisHint: `Under IFRS 11, when an arrangement is unincorporated and parties have direct obligations for liabilities, it must be classified as a Joint Operation and accounted for line-by-line.`
    }
  };

  return { issue, narrativeChunk, appendix, eventTitle: 'Consortium Project Arrangement with Regional Partner' };
}

/**
 * Builds an authentic Issue 9: IAS 16 Property, Plant and Equipment (Component Depreciation & Site Restoration)
 */
function createIas16Issue(company: CompanyTemplate, seed: number): GeneratedIssueResult {
  const totalRefurb = randomInt(4, 8) * 1000000;
  const componentShortPct = 60;
  const componentShortAmt = Math.round(totalRefurb * (componentShortPct / 100));
  const componentLongAmt = totalRefurb - componentShortAmt;
  const restorationPv = randomInt(6, 15) * 100000;
  const recordedDepr = Math.round((totalRefurb / 25) * 0.5);
  const correctShortDepr = Math.round((componentShortAmt / 5) * 0.5);
  const correctLongDepr = Math.round((componentLongAmt / 25) * 0.5);
  const correctDepr = correctShortDepr + correctLongDepr;
  const underDepr = correctDepr - recordedDepr;

  const narrativeChunk = `On July 1, 2026, ${company.companyName} completed a comprehensive $${totalRefurb.toLocaleString()} CAD overhaul and modernization of its primary industrial manufacturing line. Engineering specifications (Appendix II) show that the expenditure comprises two significant parts: high-wear automated precision control units costing $${componentShortAmt.toLocaleString()} CAD with an expected useful operating life of 5 years, and primary structural casing and housing costing $${componentLongAmt.toLocaleString()} CAD with a 25-year life. In the draft 2026 financial statements, management lumped the entire $${totalRefurb.toLocaleString()} CAD into a single asset account and recorded half-year depreciation of only $${recordedDepr.toLocaleString()} CAD based on a 25-year life. In addition, under the provincial operating permit, the company is legally mandated to decommission the facility and perform environmental site restoration at the end of its 15-year leasehold, which has a discounted present value obligation of $${restorationPv.toLocaleString()} CAD. Management omitted the restoration obligation, claiming that decommissioning is 15 years away.`;

  const appendix: CaseAppendix = {
    id: `app-ias16-${seed}`,
    title: `Appendix II: Engineering Capitalization Schedule & Environmental Permit Mandate`,
    type: 'schedule',
    content: `Capital Asset Overhaul & Decommissioning Summary:
• Total Expenditure Incurred: $${totalRefurb.toLocaleString()} CAD (Placed in service July 1, 2026).
• Component 1: High-wear automated precision control modules — Cost $${componentShortAmt.toLocaleString()} CAD | Useful life: 5 years.
• Component 2: Structural steel housing and primary infrastructure — Cost $${componentLongAmt.toLocaleString()} CAD | Useful life: 25 years.
• Management Recorded Depreciation for 2026 (Half-year): $${recordedDepr.toLocaleString()} CAD (grouped over 25 years).

Environmental Permit Decommissioning Obligation:
• Statutory Requirement: Mandatory environmental cleanup and site remediation upon facility decommissioning.
• Estimated Discounted Present Value of Site Restoration: $${restorationPv.toLocaleString()} CAD.
• Management Accounting Treatment: Obligation omitted; to be expensed when cash is paid in 15 years.`
  };

  const issue: IfrsAccountingIssue = {
    id: 'issue-ias-16',
    title: 'PPE Component Depreciation & Decommissioning Site Restoration Obligation',
    topic: 'Property, Plant and Equipment',
    standardCode: 'IAS 16',
    standardName: 'Property, Plant and Equipment',
    handbookSection: 'Part I - IAS 16, paras 16(c) (Decommissioning Provision) & 43-47 (Component Depreciation)',
    description: `Understatement of depreciation expense by $${underDepr.toLocaleString()} due to failure to apply component depreciation, and failure to capitalize $${restorationPv.toLocaleString()} in site restoration costs.`,
    criteria: [
      {
        id: 'c-component-depr',
        name: 'Mandatory Component Depreciation',
        standardReference: 'IAS 16.43-47',
        description: 'Each part of an item of PPE with a cost that is significant in relation to the total cost of the item shall be depreciated separately over its specific useful life.',
        expectedCaseFact: `The $${componentShortAmt.toLocaleString()} control modules have a 5-year life and must be depreciated separately from the 25-year structural housing, requiring additional depreciation of $${underDepr.toLocaleString()}.`
      },
      {
        id: 'c-decommissioning-asset',
        name: 'Capitalization of Dismantling and Site Restoration Obligation',
        standardReference: 'IAS 16.16(c) & IAS 37',
        description: 'Initial cost of PPE includes the initial estimate of the costs of dismantling and removing the item and restoring the site on which it is located, recognized as a provision.',
        expectedCaseFact: `The $${restorationPv.toLocaleString()} legal site remediation obligation must be capitalized into PPE and recognized as a Decommissioning Provision (Liability).`
      }
    ],
    modelRecommendation: {
      accountingTreatment: `Under IAS 16 and IAS 37: 1) Capitalize the $${restorationPv.toLocaleString()} decommissioning asset into PPE with a credit to Decommissioning Provision (Non-Current Liability); 2) Adjust depreciation expense by recording an additional $${underDepr.toLocaleString()} for component depreciation.`,
      financialStatementImpact: `Increases PPE by $${restorationPv.toLocaleString()}, increases Non-Current Liabilities by $${restorationPv.toLocaleString()}, and decreases Net Income by $${underDepr.toLocaleString()} through additional depreciation.`,
      journalEntry: `DR: Property, Plant and Equipment (Decommissioning Asset) $${restorationPv.toLocaleString()}
    CR: Decommissioning Provision (Non-Current Liability)    $${restorationPv.toLocaleString()}
DR: Depreciation Expense (Component Adjustment)            $${underDepr.toLocaleString()}
    CR: Accumulated Depreciation - PPE                     $${underDepr.toLocaleString()}`,
      covenantOrBusinessImpact: `Increases liabilities and reduces net income, directly diminishing bonus targets and putting pressure on debt covenants.`
    },
    guidanceHints: {
      missingIssueHint: `Review the equipment overhaul and refurbishment. Does IAS 16 allow grouping components with differing useful lives into a single depreciation rate? What about the mandatory site remediation permit?`,
      wrongStandardHint: `Property, plant and equipment is governed by IAS 16, and decommissioning obligations cross-reference IAS 37.`,
      incompleteAnalysisHint: `Under IAS 16.43, component depreciation is mandatory. Under IAS 16.16(c), site restoration obligations must be capitalized into PPE cost at present value.`
    }
  };

  return { issue, narrativeChunk, appendix, eventTitle: 'Industrial Facility Overhaul & Site Remediation' };
}

/**
 * Builds an authentic Issue 10: IAS 20 Accounting for Government Grants
 */
function createIas20Issue(company: CompanyTemplate, seed: number): GeneratedIssueResult {
  const grantAmt = randomInt(10, 25) * 100000; // e.g. $1,200,000 - $2,500,000
  const assetCost = grantAmt * 3;
  const usefulLife = 10;
  const annualDepr = Math.round(assetCost / usefulLife);

  const narrativeChunk = `In March 2026, ${company.companyName} received a $${grantAmt.toLocaleString()} CAD cash contribution under the Federal Industrial Clean Technology Grant program toward purchasing a new $${assetCost.toLocaleString()} CAD low-emission processing assembly. The grant agreement (Appendix II) stipulates that the company must maintain continuous operations and meet certified environmental efficiency thresholds for three years; if production ceases or thresholds are breached, the grant must be repaid in full. In the draft 2026 financial statements, management recognized the entire $${grantAmt.toLocaleString()} CAD as "Other Operating Revenue", arguing that cash was received and management fully intends to meet all operational conditions. Recognizing this full grant allowed the company to comfortably surpass the executive EBT bonus benchmark.`;

  const appendix: CaseAppendix = {
    id: `app-ias20-${seed}`,
    title: `Appendix II: Federal Clean-Growth Grant Agreement Summary`,
    type: 'contract',
    content: `Federal Innovation & Clean Growth Contribution Agreement:
• Grantor: Government of Canada (Department of Industry)
• Recipient: ${company.companyName}
• Funding Amount: $${grantAmt.toLocaleString()} CAD non-dilutive capital contribution.
• Qualifying Asset: High-efficiency ${company.productLine} (Total Purchase Price: $${assetCost.toLocaleString()} CAD; Useful life: ${usefulLife} years).
• Compliance Covenant: Must submit annual third-party carbon audit reports confirming 25% emissions reduction over 3 years. Full clawback provision applies upon default.

Management Reporting Treatment:
• 100% ($${grantAmt.toLocaleString()} CAD) recognized as Other Income in fiscal 2026.`
  };

  const issue: IfrsAccountingIssue = {
    id: 'issue-ias-20',
    title: 'Recognition of Asset-Related Government Grant',
    topic: 'Government Grants',
    standardCode: 'IAS 20',
    standardName: 'Accounting for Government Grants and Disclosure of Government Assistance',
    handbookSection: 'Part I - IAS 20, paras 7-12 (Recognition Criteria) & paras 24-28 (Presentation of Grants Related to Assets)',
    description: `Improper immediate recognition of $${grantAmt.toLocaleString()} asset-related government grant in revenue rather than deferring and amortizing over the ${usefulLife}-year asset life or netting against asset cost.`,
    criteria: [
      {
        id: 'c-ias20-matching',
        name: 'Matching Principle for Government Grants',
        standardReference: 'IAS 20.12',
        description: 'Government grants shall be recognized in profit or loss on a systematic basis over the periods in which the entity recognizes as expenses the related costs for which the grants are intended to compensate.',
        expectedCaseFact: `The grant compensates the purchase of a ${usefulLife}-year capital asset. Recognizing the entire grant immediately in 2026 violates IAS 20.12.`
      },
      {
        id: 'c-ias20-presentation',
        name: 'Presentation of Grants Related to Assets (Deferred Income vs. Cost Reduction)',
        standardReference: 'IAS 20.24',
        description: 'Grants related to assets shall be presented either by setting up the grant as deferred income or by deducting the grant in arriving at the carrying amount of the asset.',
        expectedCaseFact: `Under Deferred Income: recognize only $${Math.round(grantAmt / usefulLife).toLocaleString()} (1/${usefulLife}th) in 2026 income and $${(grantAmt - Math.round(grantAmt / usefulLife)).toLocaleString()} as Deferred Grant Liability.`
      }
    ],
    modelRecommendation: {
      accountingTreatment: `Under IAS 20, derecognize $${(grantAmt - Math.round(grantAmt / usefulLife)).toLocaleString()} from revenue. Record as Deferred Government Grant (Liability) amortized over ${usefulLife} years, or reduce the carrying cost of PPE by $${grantAmt.toLocaleString()}.`,
      financialStatementImpact: `Decreases 2026 Net Income by $${(grantAmt - Math.round(grantAmt / usefulLife)).toLocaleString()} and increases Liabilities by $${(grantAmt - Math.round(grantAmt / usefulLife)).toLocaleString()} (or decreases PPE).`,
      journalEntry: `DR: Other Operating Revenue                     $${(grantAmt - Math.round(grantAmt / usefulLife)).toLocaleString()}
    CR: Deferred Government Grant (Current/Non-Current) $${(grantAmt - Math.round(grantAmt / usefulLife)).toLocaleString()}`,
      covenantOrBusinessImpact: `Reversing premature grant revenue drops 2026 EBT below the executive bonus threshold and increases liabilities, tightening bank debt covenants.`
    },
    guidanceHints: {
      missingIssueHint: `Review the federal capital grant agreement. Can an asset-related capital grant be recognized immediately in revenue in year 1 under IAS 20?`,
      wrongStandardHint: `Government assistance and grants are governed by IAS 20 (Part I of CPA Canada Handbook).`,
      incompleteAnalysisHint: `Under IAS 20.24, evaluate the two acceptable methods for asset grants: Deferred Income amortized over asset useful life, or deducting from asset cost.`
    }
  };

  return { issue, narrativeChunk, appendix, eventTitle: 'Federal Clean Technology Contribution Agreement' };
}

/**
 * Builds an authentic Issue 11: IFRS 9 Financial Instruments (Classification & Measurement)
 */
function createIfrs9Issue(company: CompanyTemplate, seed: number): GeneratedIssueResult {
  const principalAmt = randomInt(20, 40) * 100000; // e.g. $2,500,000
  const legalFees = 60000;
  const fvLoss = randomInt(4, 8) * 100000; // e.g. $500,000
  const yearEndFv = principalAmt - fvLoss;

  const narrativeChunk = `In April 2026, ${company.companyName} invested $${principalAmt.toLocaleString()} CAD in 5-year subordinated convertible debentures issued by an emerging supply-chain partner. The debentures pay a 4.0% annual interest coupon and give ${company.companyName} the contractual right to convert the principal into common shares of the issuer at any time prior to maturity. The company paid $${legalFees.toLocaleString()} CAD in external legal transaction fees upon acquisition. At December 31, 2026, due to operational challenges at the issuer, the fair value of the debentures fell to $${yearEndFv.toLocaleString()} CAD (a $${fvLoss.toLocaleString()} decline). In the draft financial statements, management classified the investment at "Amortized Cost", capitalized the $${legalFees.toLocaleString()} legal fees, and refused to record the $${fvLoss.toLocaleString()} fair value decline, arguing that the company intends to hold the debentures to maturity.`;

  const appendix: CaseAppendix = {
    id: `app-ifrs9-${seed}`,
    title: `Appendix II: Subordinated Convertible Debenture Term Sheet & Valuation`,
    type: 'contract',
    content: `Convertible Debenture Investment Extract:
• Issuer: Northern Supply Chain Solutions Inc.
• Principal Invested: $${principalAmt.toLocaleString()} CAD.
• Coupon: 4.0% payable annually.
• Conversion Feature: Holder holds option to convert principal into 1,000,000 common equity shares of Issuer.
• Acquisition Legal Fees: $${legalFees.toLocaleString()} CAD paid at inception.
• Quoted Fair Value at Dec 31, 2026: $${yearEndFv.toLocaleString()} CAD ($${fvLoss.toLocaleString()} unrealized deficit).

Draft Management Balance Sheet Treatment:
• Investment carrying value: $${(principalAmt + legalFees).toLocaleString()} CAD (Amortized Cost).
• Fair value loss: $0 recognized.`
  };

  const issue: IfrsAccountingIssue = {
    id: 'issue-ifrs-9',
    title: 'Financial Asset Classification: Failure of SPPI Test & FVTPL Measurement',
    topic: 'Financial Instruments',
    standardCode: 'IFRS 9',
    standardName: 'Financial Instruments',
    handbookSection: 'Part I - IFRS 9, paras 4.1.2-4.1.4 (Business Model & SPPI Test) & paras 5.7.1 (FVTPL Gains/Losses)',
    description: `Improper classification of convertible debenture at amortized cost; failure of the SPPI test requires FVTPL classification with immediate expensing of transaction fees and recognition of $${fvLoss.toLocaleString()} fair value loss.`,
    criteria: [
      {
        id: 'c-ifrs9-sppi',
        name: 'Solely Payments of Principal and Interest (SPPI) Test',
        standardReference: 'IFRS 9.4.1.2(b)',
        description: 'Contractual cash flows must consist solely of payments of principal and interest on specified dates. Equity conversion options introduce exposure to equity risk and fail the SPPI test.',
        expectedCaseFact: `The conversion option links cash flows to equity value, failing the SPPI test. Measurement at Amortized Cost or FVOCI is prohibited.`
      },
      {
        id: 'c-ifrs9-fvtpl',
        name: 'Mandatory Fair Value through Profit or Loss (FVTPL)',
        standardReference: 'IFRS 9.4.1.4 & 5.1.1',
        description: 'Financial assets that fail SPPI must be measured at FVTPL. Transaction costs must be expensed immediately in P&L, and changes in fair value must be recognized in profit or loss.',
        expectedCaseFact: `The $${legalFees.toLocaleString()} fees must be expensed and the $${fvLoss.toLocaleString()} fair value decline must be charged to profit or loss immediately.`
      }
    ],
    modelRecommendation: {
      accountingTreatment: `Under IFRS 9, reclassify the investment to FVTPL. Write down the investment to its year-end fair value of $${yearEndFv.toLocaleString()} CAD, charge the $${fvLoss.toLocaleString()} unrealized loss to Profit or Loss, and expense the $${legalFees.toLocaleString()} legal fees.`,
      financialStatementImpact: `Decreases Total Assets by $${(fvLoss + legalFees).toLocaleString()} and decreases Net Income by $${(fvLoss + legalFees).toLocaleString()}.`,
      journalEntry: `DR: Fair Value Loss on Financial Instruments (P&L)   $${fvLoss.toLocaleString()}
DR: Transaction / Legal Expense (P&L)                $${legalFees.toLocaleString()}
    CR: Investment in Convertible Debentures (Asset)       $${(fvLoss + legalFees).toLocaleString()}`,
      covenantOrBusinessImpact: `Directly reduces net earnings and total equity, triggering severe pressure on debt-to-equity bank covenants.`
    },
    guidanceHints: {
      missingIssueHint: `Review the convertible debenture investment terms. Does an investment with an equity conversion feature pass the SPPI test under IFRS 9?`,
      wrongStandardHint: `Financial asset classification and measurement is governed by IFRS 9 (Financial Instruments).`,
      incompleteAnalysisHint: `Under IFRS 9, instruments failing the SPPI test must be classified as FVTPL. Evaluate the treatment of transaction costs and year-end fair value adjustments.`
    }
  };

  return { issue, narrativeChunk, appendix, eventTitle: 'Strategic Convertible Debenture Investment' };
}

/**
 * Builds an authentic Issue 12: IAS 23 Borrowing Costs
 */
function createIas23Issue(company: CompanyTemplate, seed: number): GeneratedIssueResult {
  const borrowingAmt = randomInt(40, 80) * 100000; // e.g. $5,000,000
  const interestRate = 7.0;
  const interestIncurred = Math.round(borrowingAmt * (interestRate / 100)); // e.g. $350,000

  const narrativeChunk = `Throughout 2026, ${company.companyName} undertook construction of a new specialized industrial assembly facility. The project commenced January 1, 2026 and concluded active development in late December 2026 (a 12-month construction period). To finance the build, the company obtained a dedicated $${borrowingAmt.toLocaleString()} CAD construction loan at ${interestRate}% per annum, incurring $${interestIncurred.toLocaleString()} CAD in actual interest expense. In the draft 2026 income statement, management expensed the entire $${interestIncurred.toLocaleString()} CAD as "Finance Costs / Interest Expense", stating that expensing borrowing costs is conservative and reduces taxable income. However, the Corporate Controller is concerned this treatment violates IFRS and artificially defresses reported operating margins.`;

  const appendix: CaseAppendix = {
    id: `app-ias23-${seed}`,
    title: `Appendix II: Construction Loan Facility & Facility Project Schedule`,
    type: 'contract',
    content: `Construction Financing & Facility Schedule:
• Project: Specialized Assembly Plant Construction (Qualifying Asset).
• Construction Duration: Jan 1, 2026 to Dec 31, 2026 (12 months of active construction).
• Dedicated Construction Loan: $${borrowingAmt.toLocaleString()} CAD principal drawn Jan 1, 2026.
• Interest Rate: ${interestRate}% per annum.
• Total 2026 Construction Interest Paid: $${interestIncurred.toLocaleString()} CAD.

Management Treatment: 100% expensed as Financing Cost in 2026 draft Income Statement.`
  };

  const issue: IfrsAccountingIssue = {
    id: 'issue-ias-23',
    title: 'Mandatory Capitalization of Borrowing Costs on Qualifying Asset',
    topic: 'Borrowing Costs',
    standardCode: 'IAS 23',
    standardName: 'Borrowing Costs',
    handbookSection: 'Part I - IAS 23, paras 8-15 (Borrowing Costs Eligible for Capitalization)',
    description: `Improper expensing of $${interestIncurred.toLocaleString()} borrowing costs directly attributable to the construction of a qualifying asset, which must be capitalized into PPE under IAS 23.`,
    criteria: [
      {
        id: 'c-ias23-qualifying',
        name: 'Definition of a Qualifying Asset',
        standardReference: 'IAS 23.5',
        description: 'A qualifying asset is an asset that necessarily takes a substantial period of time to get ready for its intended use or sale.',
        expectedCaseFact: `The 12-month plant construction project is a qualifying asset under IAS 23.`
      },
      {
        id: 'c-ias23-mandatory-cap',
        name: 'Mandatory Capitalization of Directly Attributable Borrowing Costs',
        standardReference: 'IAS 23.8',
        description: 'An entity SHALL capitalize borrowing costs that are directly attributable to the acquisition, construction or production of a qualifying asset as part of the cost of that asset. Immediate expensing is prohibited.',
        expectedCaseFact: `The $${interestIncurred.toLocaleString()} loan interest was incurred during active construction and must be capitalized into PPE (Construction in Progress).`
      }
    ],
    modelRecommendation: {
      accountingTreatment: `Under IAS 23.8, capitalize $${interestIncurred.toLocaleString()} of interest costs into Property, Plant and Equipment (Construction in Progress) and remove from Finance Expense.`,
      financialStatementImpact: `Increases PPE (Non-Current Assets) by $${interestIncurred.toLocaleString()} and increases Net Income by $${interestIncurred.toLocaleString()}.`,
      journalEntry: `DR: Property, Plant and Equipment (WIP)       $${interestIncurred.toLocaleString()}
    CR: Finance Costs / Interest Expense              $${interestIncurred.toLocaleString()}`,
      covenantOrBusinessImpact: `Increases reported EBT, helping meet executive bonus thresholds, and strengthens total asset backing for bank lenders.`
    },
    guidanceHints: {
      missingIssueHint: `Review the construction loan and financing. Does IAS 23 allow an enterprise to choose between expensing or capitalizing borrowing costs on a qualifying asset?`,
      wrongStandardHint: `Borrowing costs on construction projects are governed by IAS 23 (Borrowing Costs).`,
      incompleteAnalysisHint: `Under IAS 23.8, capitalization of borrowing costs on qualifying assets is mandatory, not an accounting policy choice.`
    }
  };

  return { issue, narrativeChunk, appendix, eventTitle: 'Industrial Assembly Facility Construction & Loan' };
}

/**
 * Builds an authentic Issue 13: IFRS 5 Non-current Assets Held for Sale & Discontinued Operations
 */
function createIfrs5Issue(company: CompanyTemplate, seed: number): GeneratedIssueResult {
  const carryingAmt = randomInt(40, 70) * 100000; // e.g. $5,000,000
  const annualDepr = Math.round(carryingAmt / 20); // $250,000
  const agreedPrice = Math.round(carryingAmt * 0.80); // $4,000,000
  const disposalCosts = 100000;
  const fvlcd = agreedPrice - disposalCosts; // $3,900,000
  const writeDown = carryingAmt - fvlcd; // $1,100,000

  const narrativeChunk = `In September 2026, ${company.companyName}'s Board of Directors committed to a formal plan to dispose of an auxiliary processing facility carrying a net book value of $${carryingAmt.toLocaleString()} CAD. An active marketing program was initiated immediately, a reputable real estate brokerage was engaged, and a qualified buyer executed a binding asset purchase agreement in November 2026 for $${agreedPrice.toLocaleString()} CAD with transaction costs of $${disposalCosts.toLocaleString()} CAD (net fair value less costs to sell of $${fvlcd.toLocaleString()} CAD). The sale is scheduled to close in February 2027. In the draft December 31, 2026 financial statements, management left the asset grouped within non-current Property, Plant & Equipment and recorded full annual depreciation of $${annualDepr.toLocaleString()} CAD, reasoning that the facility remained legally owned at year-end.`;

  const appendix: CaseAppendix = {
    id: `app-ifrs5-${seed}`,
    title: `Appendix II: Board Minutes & Binding Facility Purchase Agreement Extract`,
    type: 'contract',
    content: `Board Resolution & Asset Sale Agreement Summary:
• Asset: Auxiliary Industrial Processing Facility (Book Value: $${carryingAmt.toLocaleString()} CAD).
• Board Approval Date: September 15, 2026.
• Sale Status: Binding Agreement executed November 20, 2026; Closing date: February 18, 2027.
• Agreed Selling Price: $${agreedPrice.toLocaleString()} CAD.
• Estimated Brokerage & Legal Disposal Costs: $${disposalCosts.toLocaleString()} CAD.
• Net Fair Value Less Costs to Sell: $${fvlcd.toLocaleString()} CAD.

Management Treatment: Recorded in Non-Current PPE; full annual depreciation of $${annualDepr.toLocaleString()} CAD charged.`
  };

  const issue: IfrsAccountingIssue = {
    id: 'issue-ifrs-5',
    title: 'Classification of Non-Current Asset Held for Sale & Cessation of Depreciation',
    topic: 'Assets Held for Sale',
    standardCode: 'IFRS 5',
    standardName: 'Non-current Assets Held for Sale and Discontinued Operations',
    handbookSection: 'Part I - IFRS 5, paras 6-15 (Criteria for Held for Sale) & para 25 (Cessation of Depreciation)',
    description: `Failure to reclassify facility as Held for Sale, improper recording of depreciation after meeting criteria, and failure to write down asset by $${writeDown.toLocaleString()} to FVLCD.`,
    criteria: [
      {
        id: 'c-ifrs5-criteria',
        name: 'Mandatory Criteria for Held for Sale Classification',
        standardReference: 'IFRS 5.6-8',
        description: 'Asset must be available for immediate sale in its present condition and the sale must be highly probable within 12 months with an active program to complete the plan.',
        expectedCaseFact: `All criteria met in September/November: board approval, binding agreement, closing within 3 months.`
      },
      {
        id: 'c-ifrs5-measurement',
        name: 'Measurement at Lower of Carrying Amount and FVLCD & Cessation of Depreciation',
        standardReference: 'IFRS 5.15 & 5.25',
        description: 'Entity shall measure asset at lower of carrying amount and fair value less costs to sell, recognizing impairment loss. Entity shall NOT depreciate non-current asset while classified as held for sale.',
        expectedCaseFact: `Carrying amount ($${carryingAmt.toLocaleString()}) exceeds FVLCD ($${fvlcd.toLocaleString()}). Must write down by $${writeDown.toLocaleString()} and cease depreciation from classification date.`
      }
    ],
    modelRecommendation: {
      accountingTreatment: `Under IFRS 5: 1) Reclassify facility from Non-Current PPE to Current Assets (Assets Held for Sale); 2) Reverse post-classification depreciation; 3) Write down asset to FVLCD ($${fvlcd.toLocaleString()} CAD) by recording an impairment loss of $${writeDown.toLocaleString()} in profit or loss.`,
      financialStatementImpact: `Increases Current Assets by $${fvlcd.toLocaleString()}, eliminates Non-Current PPE of $${carryingAmt.toLocaleString()}, and reduces Net Income by $${writeDown.toLocaleString()}.`,
      journalEntry: `DR: Assets Held for Sale (Current Asset)          $${fvlcd.toLocaleString()}
DR: Impairment Loss on Held for Sale Asset (P&L)   $${writeDown.toLocaleString()}
    CR: Property, Plant and Equipment (Cost)           $${carryingAmt.toLocaleString()}`,
      covenantOrBusinessImpact: `Writing down the asset significantly reduces EBT, putting pressure on bonus thresholds, but reclassifying to Current Assets improves the Current Working Capital Ratio.`
    },
    guidanceHints: {
      missingIssueHint: `Review the plant sale agreement. Does IFRS allow continued depreciation and non-current classification once a binding sale agreement is signed?`,
      wrongStandardHint: `Assets held for sale are governed by IFRS 5 (Part I of CPA Canada Handbook).`,
      incompleteAnalysisHint: `Under IFRS 5, evaluate the 2 key requirements: cessation of depreciation under IFRS 5.25, and write-down to FVLCD under IFRS 5.15.`
    }
  };

  return { issue, narrativeChunk, appendix, eventTitle: 'Auxiliary Facility Divestiture & Purchase Agreement' };
}

/**
 * Builds an authentic Issue 14: IAS 10 Events after the Reporting Period
 */
function createIas10Issue(company: CompanyTemplate, seed: number): GeneratedIssueResult {
  const arBalance = randomInt(12, 25) * 100000; // e.g. $1,800,000

  const narrativeChunk = `Following the close of the fiscal year ended December 31, 2026, but prior to the approval and issuance of the financial statements, two significant events occurred. On January 18, 2027, ${company.companyName}'s second-largest customer, who owed $${arBalance.toLocaleString()} CAD in trade accounts receivable at year-end, declared formal bankruptcy under the Bankruptcy and Insolvency Act. Investigation revealed the customer had experienced catastrophic operating insolvency throughout the fourth quarter of 2026. Separately, on January 28, 2027, an accidental electrical fire damaged a regional logistics warehouse, causing $600,000 CAD in inventory damage. Management resolved to treat both events identically as "non-adjusting subsequent events" with footnote disclosures only, leaving the full $${arBalance.toLocaleString()} CAD receivable intact on the December 31, 2026 Statement of Financial Position.`;

  const appendix: CaseAppendix = {
    id: `app-ias10-${seed}`,
    title: `Appendix II: Post-Year-End Customer Bankruptcy & Casualty Loss Memo`,
    type: 'memo',
    content: `MEMORANDUM TO AUDIT COMMITTEE:
Post-Balance-Sheet Events Assessment (Jan 1, 2027 – Feb 5, 2027):

1. Apex Logistics Corp. Insolvency:
• Dec 31, 2026 Trade Accounts Receivable Balance: $${arBalance.toLocaleString()} CAD (Carried at 100% face value).
• Insolvency Event: Customer filed formal bankruptcy petition January 18, 2027.
• Historical Context: Records confirm customer had ceased supplier payments in November 2026 and was under legal seizure notices prior to year-end. Expected recovery is $0.

2. Warehouse Fire:
• Event Date: January 28, 2027 (Accidental electrical short circuit).
• Damage: $600,000 CAD uninsured loss.

Management Position: Disclose both events in notes only; no balance sheet adjustments to 2026 draft statements.`
  };

  const issue: IfrsAccountingIssue = {
    id: 'issue-ias-10',
    title: 'Post-Reporting Date Customer Bankruptcy: Adjusting vs. Non-Adjusting Events',
    topic: 'Events After the Reporting Period',
    standardCode: 'IAS 10',
    standardName: 'Events after the Reporting Period',
    handbookSection: 'Part I - IAS 10, paras 8-11 (Adjusting Events vs Non-Adjusting Events)',
    description: `Improper failure to adjust the 2026 financial statements for the $${arBalance.toLocaleString()} bankruptcy of a customer that confirmed conditions existing at the reporting date (IAS 10.9).`,
    criteria: [
      {
        id: 'c-ias10-adjusting',
        name: 'Definition and Treatment of Adjusting Subsequent Events',
        standardReference: 'IAS 10.8 & 10.9(b)(i)',
        description: 'An entity shall adjust the amounts recognized in its financial statements to reflect adjusting events that provide evidence of conditions that existed at the end of the reporting period. Customer bankruptcy confirms year-end credit impairment.',
        expectedCaseFact: `The customer was insolvent prior to year-end. Bankruptcy confirms conditions existing at Dec 31, 2026; must adjust 2026 accounts receivable.`
      },
      {
        id: 'c-ias10-non-adjusting',
        name: 'Treatment of Non-Adjusting Events',
        standardReference: 'IAS 10.10 & 10.21',
        description: 'Events indicative of conditions that arose AFTER the reporting period are non-adjusting. Disclose nature and financial estimate in the notes without balance sheet adjustment.',
        expectedCaseFact: `The warehouse fire occurred entirely after year-end; properly treated as non-adjusting with footnote disclosure.`
      }
    ],
    modelRecommendation: {
      accountingTreatment: `Under IAS 10 and IFRS 9, adjust the 2026 financial statements by recording an immediate bad debt expense and write-off / allowance of $${arBalance.toLocaleString()} against trade receivables. Disclose the warehouse fire in note disclosures only.`,
      financialStatementImpact: `Decreases Accounts Receivable (Current Assets) by $${arBalance.toLocaleString()} and decreases Net Income by $${arBalance.toLocaleString()}.`,
      journalEntry: `DR: Bad Debt Expense / Credit Loss (P&L)          $${arBalance.toLocaleString()}
    CR: Allowance for Expected Credit Losses / AR       $${arBalance.toLocaleString()}`,
      covenantOrBusinessImpact: `Directly slashes Current Assets and Net Income, triggering immediate breaches of bank working capital covenants.`
    },
    guidanceHints: {
      missingIssueHint: `Review the customer bankruptcy and warehouse fire events. Under IAS 10, is a customer bankruptcy that confirms conditions existing at year-end adjusting or non-adjusting?`,
      wrongStandardHint: `Events occurring between the reporting date and authorization date are governed by IAS 10.`,
      incompleteAnalysisHint: `Under IAS 10.9(b)(i), customer bankruptcy is an adjusting event requiring balance sheet adjustment, whereas the casualty fire is non-adjusting.`
    }
  };

  return { issue, narrativeChunk, appendix, eventTitle: 'Post-Reporting Date Customer Insolvency & Fire' };
}

/**
 * Builds an authentic Issue 15: IFRS 2 Share-based Payment (Equity-Settled Options)
 */
function createIfrs2Issue(company: CompanyTemplate, seed: number): GeneratedIssueResult {
  const optionsGranted = 300000;
  const grantDateFv = 4.0;
  const totalGrantFv = optionsGranted * grantDateFv; // $1,200,000
  const vestingYears = 3;
  const annualExpense = Math.round(totalGrantFv / vestingYears); // $400,000

  const narrativeChunk = `On January 1, 2026, ${company.companyName} granted ${optionsGranted.toLocaleString()} stock options to executive officers and senior engineers. The options vest ratably over a ${vestingYears}-year service period, provided employees remain with the company. Using the Black-Scholes option pricing model, the grant-date fair value was reliably determined to be $${grantDateFv.toFixed(2)} CAD per option (total grant fair value of $${totalGrantFv.toLocaleString()} CAD). During 2026, management estimates that 95% of recipients will satisfy the service conditions. In the draft 2026 financial statements, management recorded $0 in compensation expense, asserting that stock options cost the company no cash, no shares have yet been issued, and all options remain unexercised.`;

  const appendix: CaseAppendix = {
    id: `app-ifrs2-${seed}`,
    title: `Appendix II: Executive Stock Option Plan Extract & Actuarial Valuation`,
    type: 'contract',
    content: `Long-Term Equity Incentive Plan Extract:
• Grant Date: January 1, 2026.
• Number of Options Granted: ${optionsGranted.toLocaleString()} options.
• Exercise Price: $12.50 CAD per share (equal to market price on grant date).
• Service Vesting Condition: ${vestingYears} years continuous service.
• Grant-Date Fair Value (Black-Scholes Model): $${grantDateFv.toFixed(2)} CAD per option ($${totalGrantFv.toLocaleString()} CAD total value).
• Estimated Forfeiture Rate: 0% to 5% (virtually all executives remain employed).

Draft 2026 Accounting Treatment:
• Compensation Expense: $0 recognized.`
  };

  const issue: IfrsAccountingIssue = {
    id: 'issue-ifrs-2',
    title: 'Recognition of Equity-Settled Share-Based Compensation Over Vesting Period',
    topic: 'Share-based Payment',
    standardCode: 'IFRS 2',
    standardName: 'Share-based Payment',
    handbookSection: 'Part I - IFRS 2, paras 10-15 (Equity-Settled Transactions & Grant-Date Fair Value)',
    description: `Failure to recognize $${annualExpense.toLocaleString()} in annual share-based compensation expense for executive stock options vesting over ${vestingYears} years.`,
    criteria: [
      {
        id: 'c-ifrs2-recognition',
        name: 'Mandatory Recognition of Equity-Settled Share-Based Payments',
        standardReference: 'IFRS 2.10',
        description: 'For equity-settled share-based payment transactions, the entity shall measure the goods or services received, and the corresponding increase in equity, directly at the fair value of the goods or services received, or by reference to grant-date fair value of equity instruments.',
        expectedCaseFact: `Services were received throughout 2026. Omission of compensation expense violates IFRS 2.10.`
      },
      {
        id: 'c-ifrs2-vesting',
        name: 'Recognition Over the Service Vesting Period',
        standardReference: 'IFRS 2.15',
        description: 'If the equity instruments granted vest over a specified period, the entity shall account for those services as they are rendered over the vesting period.',
        expectedCaseFact: `Year 1 of the ${vestingYears}-year vesting period requires recognizing $${annualExpense.toLocaleString()} ($${totalGrantFv.toLocaleString()} / ${vestingYears}) in compensation expense with a credit to Contributed Surplus.`
      }
    ],
    modelRecommendation: {
      accountingTreatment: `Under IFRS 2, recognize $${annualExpense.toLocaleString()} in Share-Based Compensation Expense in profit or loss with a corresponding credit to Contributed Surplus / Equity Reserves.`,
      financialStatementImpact: `Decreases Net Income by $${annualExpense.toLocaleString()} and increases Shareholders' Equity (Contributed Surplus) by $${annualExpense.toLocaleString()}. Total Equity remains unchanged.`,
      journalEntry: `DR: Share-Based Compensation Expense (P&L)      $${annualExpense.toLocaleString()}
    CR: Contributed Surplus (Shareholders' Equity)     $${annualExpense.toLocaleString()}`,
      covenantOrBusinessImpact: `Decreases operating profit and EBT, directly reducing the executive bonus pool without impacting cash flow.`
    },
    guidanceHints: {
      missingIssueHint: `Review the executive stock option grant. Does IFRS permit omitting compensation expense simply because options involve no cash outlay?`,
      wrongStandardHint: `Employee stock option plans are governed by IFRS 2 (Share-based Payment).`,
      incompleteAnalysisHint: `Under IFRS 2, equity-settled awards must be measured at grant-date fair value and expensed over the vesting period.`
    }
  };

  return { issue, narrativeChunk, appendix, eventTitle: 'Executive Long-Term Stock Option Grant' };
}

/**
 * Builds an authentic Issue 16: IAS 40 Investment Property (Fair Value Model)
 */
function createIas40Issue(company: CompanyTemplate, seed: number): GeneratedIssueResult {
  const carryingAmt = randomInt(70, 120) * 100000; // e.g. $8,000,000
  const fvGain = randomInt(8, 18) * 100000; // e.g. $1,200,000
  const appraisalValue = carryingAmt + fvGain;

  const narrativeChunk = `In 2024, ${company.companyName} acquired a standalone commercial multi-tenant office building for $${carryingAmt.toLocaleString()} CAD. The building is leased entirely to third-party commercial corporate tenants under arm's-length operating leases. In its accounting policy note, the company adopted the Fair Value model for all investment property under IAS 40. At December 31, 2026, an accredited independent appraisal firm valued the property at $${appraisalValue.toLocaleString()} CAD (a $${fvGain.toLocaleString()} CAD fair value increase). In the draft financial statements, management recorded the $${fvGain.toLocaleString()} CAD unrealized gain in Other Comprehensive Income (credited to Revaluation Surplus in Equity), mimicking the revaluation model under IAS 16, to avoid boosting reported income and drawing tax audit scrutiny.`;

  const appendix: CaseAppendix = {
    id: `app-ias40-${seed}`,
    title: `Appendix II: Commercial Property Lease Schedule & Appraiser Valuation`,
    type: 'report',
    content: `Commercial Real Estate Appraisal Summary:
• Property: Horizon Commercial Tower (100% leased to independent corporate tenants).
• Classification: Investment Property under IAS 40.
• Accounting Policy Elected: Fair Value Model (IAS 40.33).
• Original Historical Carrying Amount: $${carryingAmt.toLocaleString()} CAD.
• Independent Appraised Market Value at Dec 31, 2026: $${appraisalValue.toLocaleString()} CAD.
• Indicated Fair Value Gain: $${fvGain.toLocaleString()} CAD.

Management Treatment:
• Credited $${fvGain.toLocaleString()} CAD directly to Revaluation Surplus in Other Comprehensive Income (OCI).`
  };

  const issue: IfrsAccountingIssue = {
    id: 'issue-ias-40',
    title: 'Investment Property: Recognition of Fair Value Gains in Profit or Loss vs. OCI',
    topic: 'Investment Property',
    standardCode: 'IAS 40',
    standardName: 'Investment Property',
    handbookSection: 'Part I - IAS 40, paras 33-35 (Fair Value Model in Profit or Loss)',
    description: `Improper crediting of $${fvGain.toLocaleString()} investment property fair value gain to Other Comprehensive Income (OCI) rather than Profit or Loss under the IAS 40 Fair Value Model.`,
    criteria: [
      {
        id: 'c-ias40-scope',
        name: 'Definition of Investment Property',
        standardReference: 'IAS 40.5',
        description: 'Investment property is property (land or a building) held to earn rentals or for capital appreciation or both, rather than for use in production or supply of goods.',
        expectedCaseFact: `The office building is held exclusively for rental income from third parties and is within the scope of IAS 40.`
      },
      {
        id: 'c-ias40-fv-model',
        name: 'Fair Value Model Mandates Recognition in Profit or Loss',
        standardReference: 'IAS 40.35',
        description: 'A gain or loss arising from a change in the fair value of investment property SHALL be recognized in PROFIT OR LOSS for the period in which it arises. It cannot be credited to OCI/Revaluation Surplus.',
        expectedCaseFact: `Management credited the $${fvGain.toLocaleString()} gain to OCI. Under IAS 40.35, the entire gain must be recognized in Profit or Loss.`
      }
    ],
    modelRecommendation: {
      accountingTreatment: `Under IAS 40.35, reclassify the $${fvGain.toLocaleString()} fair value gain from Other Comprehensive Income (Revaluation Surplus) to Profit or Loss (Net Income).`,
      financialStatementImpact: `Increases 2026 Net Income by $${fvGain.toLocaleString()} and eliminates Revaluation Surplus in OCI. Total Equity remains unchanged.`,
      journalEntry: `DR: Revaluation Surplus (Other Comprehensive Income)   $${fvGain.toLocaleString()}
    CR: Fair Value Gain on Investment Property (P&L)        $${fvGain.toLocaleString()}`,
      covenantOrBusinessImpact: `Increases operating earnings and EBT, easily securing executive bonuses and strengthening interest coverage ratios for lenders.`
    },
    guidanceHints: {
      missingIssueHint: `Review the commercial rental property valuation data. Under IAS 40 Fair Value model, do fair value gains belong in Profit or Loss or in OCI?`,
      wrongStandardHint: `Investment properties held for rental income are governed by IAS 40, not IAS 16.`,
      incompleteAnalysisHint: `Under IAS 40.35, all fair value changes on investment property must be recognized directly in profit or loss, contrasting with the IAS 16 revaluation surplus.`
    }
  };

  return { issue, narrativeChunk, appendix, eventTitle: 'Commercial Rental Property Valuation & Fair Value Accounting' };
}

/**
 * Procedurally generates a comprehensive, unique Canadian IFRS case.
 */
export function generateRandomIfrsCase(excludeNames?: Set<string> | string[]): IfrsCase {
  const seed = Date.now() + randomInt(1, 9999);
  const company = generateUniqueCanadianCompany(excludeNames);


  // Issue creators array encompassing 16 authentic Canadian IFRS & IAS standards:
  // IFRS 15, IAS 37, IAS 38, IAS 36, IFRS 16, IAS 2, IAS 1, IFRS 11, IAS 16,
  // IAS 20, IFRS 9, IAS 23, IFRS 5, IAS 10, IFRS 2, IAS 40
  const issueCreators = [
    createIfrs15Issue,
    createIas38Issue,
    createIfrs16Issue,
    createIas37Issue,
    createIas36Issue,
    createIas2Issue,
    createIas1Issue,
    createIfrs11Issue,
    createIas16Issue,
    createIas20Issue,
    createIfrs9Issue,
    createIas23Issue,
    createIfrs5Issue,
    createIas10Issue,
    createIfrs2Issue,
    createIas40Issue
  ];

  // Pick 2 or 3 distinct issue creators
  const numIssues = randomChoice([2, 3]);
  const shuffledCreators = [...issueCreators].sort(() => 0.5 - Math.random());
  const selectedCreators = shuffledCreators.slice(0, numIssues);

  const builtIssues: IfrsAccountingIssue[] = [];
  const narrativeChunks: string[] = [];
  const dynamicAppendices: CaseAppendix[] = [];

  // Appendix I: Financial results & Bank covenants
  const cash = randomInt(15, 35) * 100000;
  const ar = randomInt(30, 60) * 100000;
  const inv = randomInt(40, 80) * 100000;
  const ca = cash + ar + inv;
  const cl = Math.round(ca / 1.45);
  const ltDebt = randomInt(60, 150) * 100000;
  const equity = Math.round(ltDebt / 1.15);
  const draftEbt = randomInt(35, 65) * 100000;
  const bonusThreshold = Math.round(draftEbt * 0.95);

  const appendixI: CaseAppendix = {
    id: `app-fin-${seed}`,
    title: 'Appendix I: Draft Financial Extract & Credit Facility Covenants',
    type: 'financial_statement',
    content: `Extract from ${company.companyName} Draft Statement of Financial Position as of December 31, 2026:
• Cash & Liquid Equivalents: $${cash.toLocaleString()} CAD
• Accounts Receivable: $${ar.toLocaleString()} CAD
• Inventories & Work-in-Progress: $${inv.toLocaleString()} CAD
• Total Current Assets: $${ca.toLocaleString()} CAD
• Total Current Liabilities: $${cl.toLocaleString()} CAD
• Total Long-Term Debt: $${ltDebt.toLocaleString()} CAD
• Total Shareholders' Equity: $${equity.toLocaleString()} CAD
• Draft Current Working Capital Ratio: ${(ca / cl).toFixed(2)}:1 (Covenant Minimum: 1.40:1)
• Draft Debt-to-Equity Ratio: ${(ltDebt / equity).toFixed(2)}:1 (Covenant Maximum: 1.25:1)
• Draft Operating Earnings Before Tax (EBT): $${draftEbt.toLocaleString()} CAD (Bonus Target: $${bonusThreshold.toLocaleString()} CAD)

Credit Facility Clause 8.1 with ${company.bankName}:
"Borrower shall maintain at all times on a consolidated basis under IFRS a Current Ratio of at least 1.40:1 and a Debt-to-Equity Ratio not exceeding 1.25:1. Any breach constitutes an immediate event of default."`
  };

  selectedCreators.forEach((creator, idx) => {
    const res = creator(company, seed + idx);
    builtIssues.push(res.issue);
    // Neutral transaction title without disclosing standard or issue name
    narrativeChunks.push(`### Transaction ${idx + 1}: ${res.eventTitle}\n${res.narrativeChunk}`);
    // re-label appendix numbering dynamically
    const appCopy = { ...res.appendix, title: res.appendix.title.replace(/Appendix [I|V]+/g, `Appendix ${idx + 2}`) };
    dynamicAppendices.push(appCopy);
  });

  const fullNarrative = `You are a Senior Financial Accounting Specialist at ${company.companyName} (${company.ticker}), headquartered in ${company.headquarters}.

${company.companyName} is a publicly accountable enterprise reporting under International Financial Reporting Standards (Part I of the CPA Canada Handbook). The company ${company.description}.

It is early January 2027, and you are preparing for the upcoming Audit Committee meeting and year-end audit for the fiscal year ended December 31, 2026. The Chief Financial Officer (CFO) and Corporate Controller are under intense pressure from ${company.bankName} to protect the company's revolving credit facilities, which require maintaining strict financial covenants (Appendix I):
1. A Minimum Current Working Capital Ratio of 1.40:1.
2. A Maximum Debt-to-Equity Ratio of 1.25:1.

Additionally, executive management has an incentive bonus pool tied to achieving Earnings Before Tax (EBT) of $${bonusThreshold.toLocaleString()} CAD. Current draft financial statements show the company barely meeting both covenants, with almost no margin for downward accounting adjustments.

The Corporate Controller has asked you to review the following complex business transactions that occurred during the fiscal year:

${narrativeChunks.join('\n\n')}

Your task is to independently read and analyze the case, examine the supporting appendices, identify all accounting issues, determine the applicable IFRS standards and CPA Canada Handbook references, evaluate the criteria against the case facts, and formulate recommendations detailing the required financial statement adjustments.`;

  return {
    id: `ifrs-case-gen-${seed}`,
    title: `${company.companyName} — IFRS Technical Case Evaluation`,
    companyName: company.companyName,
    ticker: company.ticker,
    industry: company.industry,
    headquarters: company.headquarters,
    fiscalYearEnd: 'December 31, 2026',
    reportingFramework: 'IFRS (Part I CPA Canada Handbook)',
    role: 'Senior Financial Accounting Specialist assisting the Controller & Audit Committee',
    date: 'January 2027',
    estimatedTimeMinutes: numIssues * 20,
    overview: `${company.companyName} (${company.ticker}) is an established Canadian enterprise in ${company.industry}. Management is under intense pressure from ${company.bankName} regarding bank covenants. Several material year-end transactions require technical evaluation under IFRS.`,
    narrative: fullNarrative,
    keyStakeholders: [
      `${company.bankName} (Lender monitoring 1.40:1 working capital & 1.25:1 debt-to-equity covenants)`,
      'Audit Committee & External Auditors (Requiring strict compliance with Part I CPA Canada Handbook)',
      `Executive Management (Incentivized by $${bonusThreshold.toLocaleString()} CAD EBT bonus threshold)`,
      'Public Shareholders on the Toronto Stock Exchange'
    ],
    userObjectives: [
      'Independently identify all financial reporting issues embedded in the business narrative and appendices.',
      'Determine the applicable IFRS standards and cite relevant CPA Canada Handbook paragraphs.',
      'Analyze the criteria of each standard using the specific facts, dates, and amounts from the appendices.',
      'Recommend required journal entries, quantify the financial statement adjustments, and evaluate the impact on bank debt covenants.'
    ],
    appendices: [appendixI, ...dynamicAppendices],
    issues: builtIssues
  };
}
