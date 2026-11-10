import { IfrsCase } from '../types/ifrsCase';

export interface IfrsStandardOption {
  code: string;
  name: string;
  part: string;
  primaryTopics: string[];
}

export const IFRS_STANDARDS_DIRECTORY: IfrsStandardOption[] = [
  {
    code: 'IFRS 15',
    name: 'Revenue from Contracts with Customers',
    part: 'Part I - IFRS',
    primaryTopics: ['5-Step Revenue Model', 'Performance Obligations', 'Variable Consideration', 'Point in Time vs Over Time', 'Contract Liabilities']
  },
  {
    code: 'IAS 38',
    name: 'Intangible Assets',
    part: 'Part I - IFRS',
    primaryTopics: ['Research vs Development', 'Capitalization Criteria (PIRATE)', 'Amortization', 'Internally Generated Intangibles']
  },
  {
    code: 'IFRS 16',
    name: 'Leases',
    part: 'Part I - IFRS',
    primaryTopics: ['Right-of-Use (ROU) Asset', 'Lease Liability', 'Discount Rate', 'Short-Term & Low-Value Exemptions']
  },
  {
    code: 'IAS 37',
    name: 'Provisions, Contingent Liabilities and Contingent Assets',
    part: 'Part I - IFRS',
    primaryTopics: ['Probable Outflow', 'Reliable Estimate', 'Present Legal or Constructive Obligation', 'Contingent Assets & Reimbursements']
  },
  {
    code: 'IAS 2',
    name: 'Inventories',
    part: 'Part I - IFRS',
    primaryTopics: ['Lower of Cost and Net Realizable Value (LCNRV)', 'Prohibition of LIFO in Canada', 'Cost Formulas (FIFO / Weighted Average)', 'Handling & Freight Costs']
  },
  {
    code: 'IAS 16',
    name: 'Property, Plant and Equipment',
    part: 'Part I - IFRS',
    primaryTopics: ['Component Depreciation', 'Directly Attributable Costs', 'Dismantling Provisions', 'Subsequent Expenditures']
  },
  {
    code: 'IAS 20',
    name: 'Accounting for Government Grants and Disclosure of Government Assistance',
    part: 'Part I - IFRS',
    primaryTopics: ['Government Grants', 'Forgivable Loans', 'Capital Grants vs Income Grants', 'Deferred Income vs Asset Reduction']
  },
  {
    code: 'IAS 36',
    name: 'Impairment of Assets',
    part: 'Part I - IFRS',
    primaryTopics: ['Indicators of Impairment', 'Recoverable Amount', 'Fair Value Less Costs of Disposal', 'Value in Use (Cash-Generating Units)']
  },
  {
    code: 'IFRS 9',
    name: 'Financial Instruments',
    part: 'Part I - IFRS',
    primaryTopics: ['Classification & Measurement', 'Amortized Cost', 'Fair Value through Profit or Loss (FVTPL)', 'Expected Credit Loss (ECL)']
  },
  {
    code: 'IAS 23',
    name: 'Borrowing Costs',
    part: 'Part I - IFRS',
    primaryTopics: ['Qualifying Assets', 'Capitalization Period', 'Directly Attributable Borrowing Costs']
  }
];

export const IFRS_PRACTICE_CASES: IfrsCase[] = [
  // CASE 1: AeroTech Robotics Inc.
  {
    id: 'ifrs-case-01',
    title: 'AeroTech Robotics Inc. — Revenue Bundling & Drone Development',
    companyName: 'AeroTech Robotics Inc.',
    industry: 'Advanced Robotics & Industrial Automation (TSX-Listed)',
    reportingFramework: 'IFRS (Part I CPA Canada Handbook)',
    role: 'Senior Financial Analyst assisting the Corporate Controller',
    date: 'November 2026',
    estimatedTimeMinutes: 45,
    overview: 'AeroTech Robotics Inc. (ATR) is a publicly traded Canadian automation developer listed on the Toronto Stock Exchange. ATR is negotiating a major credit facility renewal with the First Canadian Commercial Bank, which contains strict working capital and debt covenants. As the senior financial analyst, the Controller has asked you to review two significant year-end transactions under IFRS before the audit committee meeting: a bundled $2.4M automated assembly line sales contract, and $830,000 in expenditures incurred on a new autonomous industrial drone system.',
    narrative: `You are a Senior Financial Analyst at AeroTech Robotics Inc. (ATR), a TSX-listed robotics enterprise based in Kitchener-Waterloo, Ontario. 
    
It is November 15, 2026, and you are preparing for the upcoming year-end audit for the fiscal year ending December 31, 2026. ATR designs high-precision robotic assembly systems for North American automotive and aerospace manufacturers.

Last week, the Chief Financial Officer (CFO), Laura Tremblay, and the Corporate Controller, David Zhang, met with the First Canadian Commercial Bank (FCCB) regarding the company's $15,000,000 revolving operating line of credit. The bank agreement imposes two strict financial covenants (Appendix I):
1. A minimum Working Capital Ratio (Current Assets / Current Liabilities) of not less than 1.40:1 at fiscal year-end.
2. A maximum Debt-to-Equity Ratio of 1.25:1.

Furthermore, management has a performance bonus linked to achieving an Earnings Before Tax (EBT) threshold of $4,500,000. Current draft financial results show working capital at 1.44:1 and draft EBT at $4,620,000—providing very little cushion before breaching the bank covenants.

David Zhang enters your office and hands you two files needing urgent accounting analysis under IFRS (Part I of the CPA Canada Handbook):

1. **Transaction A: ApexParts Contract No. 4409 (Appendix II)**
On October 1, 2026, ATR finalized a landmark $2,400,000 contract with ApexParts Canada Corp. to design, deliver, install, and support an automated battery assembly line. On October 15, ApexParts paid an initial non-refundable cash deposit of $720,000 (30%). ATR delivered the core robotics equipment on December 1, 2026. Installation is currently 40% complete and will finish in February 2027. The contract also includes mandatory software calibration and two years of 24/7 technical support starting upon full installation. The sales team recognized the full $2,400,000 as revenue in draft November financial statements, arguing that the equipment was physically delivered and the cash deposit is non-refundable.

2. **Transaction B: Project 'SkyLift' Autonomous Drone Expenditures (Appendix III)**
During 2026, ATR invested $830,000 into Project SkyLift, a specialized heavy-lift autonomous indoor drone intended to move heavy tooling across large factories. Management capitalized the entire $830,000 as an intangible asset on the draft Statement of Financial Position to avoid dampening net income. However, reviewing the engineering timesheets reveals that between January and June ($480,000), the team was testing various motor thrust configurations and theoretical aerodynamic models. Formal commercial feasibility and committed customer pilot orders were only finalized on July 15, 2026, after which $350,000 was spent creating the production-ready prototype.

David Zhang has asked you to prepare an objective accounting memorandum for the Audit Committee. You must analyze the issues, cite the relevant CPA Canada Handbook (IFRS) standards, apply the criteria to the case facts, determine any necessary financial adjustments, and assess the impact on bank covenants.`,
    keyStakeholders: [
      'First Canadian Commercial Bank (Lenders enforcing 1.40:1 working capital & 1.25:1 debt-to-equity covenants)',
      'Audit Committee & External Auditors (Requiring compliance with IFRS 15 and IAS 38)',
      'Executive Management (Motivated by EBT bonus thresholds of $4.5M)',
      'Public Shareholders (Relying on transparent financial disclosures)'
    ],
    userObjectives: [
      'Analyze the ApexParts sales contract under IFRS 15 using the 5-step revenue recognition model.',
      'Evaluate whether the software, equipment, installation, and support constitute distinct performance obligations.',
      'Analyze Project SkyLift expenditures under IAS 38, distinguishing research vs. development phase criteria (PIRATE).',
      'Quantify required adjustments and calculate the revised Working Capital and EBT relative to debt covenants.'
    ],
    appendices: [
      {
        id: 'app-01',
        title: 'Appendix I: Draft Financial Extract & Credit Agreement Covenants',
        type: 'financial_statement',
        content: `Extract from AeroTech Robotics Inc. Draft Statement of Financial Position (Pre-Adjustment) as of November 30, 2026:
        
• Cash & Short-Term Investments: $1,850,000
• Accounts Receivable: $3,920,000
• Inventories & WIP: $4,200,000
• Capitalized Intangible Assets (Project SkyLift): $830,000
• Total Current Assets: $10,120,000
• Total Current Liabilities: $7,028,000
• Total Long-Term Debt: $8,400,000
• Total Shareholders' Equity: $12,500,000
• Draft Current Ratio: 1.44:1 (Bank Covenant Minimum: 1.40:1)
• Draft Debt-to-Equity Ratio: 1.23:1 (Bank Covenant Maximum: 1.25:1)
• Draft Earnings Before Tax (YTD): $4,620,000 (Executive Bonus Threshold: $4,500,000)

First Canadian Commercial Bank Credit Agreement Clause 7.2:
"Borrower shall maintain at all times on a consolidated basis under IFRS a Current Ratio of at least 1.40:1. Failure to maintain this covenant constitutes an immediate event of default, entitling FCCB to demand immediate repayment of the $15.0M credit facility."`
      },
      {
        id: 'app-02',
        title: 'Appendix II: ApexParts Contract No. 4409 & Stand-Alone Pricing Data',
        type: 'contract',
        content: `Master Customer Contract No. 4409 — Summary of Deliverables & Pricing:
Contract signed: October 1, 2026 between AeroTech Robotics Inc. (Vendor) and ApexParts Canada Corp. (Customer).
Total Agreed Contract Consideration: $2,400,000 CAD.

Component Breakdown & Stand-Alone Selling Prices (SASP):
1. Heavy Robotic Battery Assembly Equipment: Stand-alone selling price $1,600,000. Delivered to ApexParts facility on Dec 1, 2026.
2. Custom Installation & Safety Integration: Stand-alone selling price $400,000. Requires specialized ATR technical crew. Work commenced Nov 15; 40% complete as of Dec 31, 2026; estimated completion Feb 15, 2027.
3. Two-Year 24/7 Technical Support & Maintenance: Stand-alone selling price $400,000 ($200,000/year). Commences March 1, 2027, upon customer operational sign-off.
Total Stand-Alone Values: $1,600,000 + $400,000 + $400,000 = $2,400,000. (No contractual bundling discount).

Payment Terms:
• $720,000 (30%) paid non-refundable on October 15, 2026.
• $1,200,000 (50%) due upon completion of installation in February 2027.
• $480,000 (20%) due in 12 monthly installments during 2027-2028.

Management Draft Treatment: Full $2,400,000 recognized as revenue in November 2026.`
      },
      {
        id: 'app-03',
        title: 'Appendix III: Internal Memorandum — Project SkyLift Drone R&D Costs',
        type: 'memo',
        content: `MEMORANDUM
To: Corporate Controller
From: Dr. Marcus Vance, VP Engineering
Date: October 28, 2026
Subject: Project SkyLift Costs and Milestones

Project SkyLift was initiated in January 2026 to create a proprietary autonomous indoor cargo drone capable of transporting 150 kg payload across factory floors.

Summary of Incurred Costs (Total $830,000):
• Phase 1 (Jan 1, 2026 – June 30, 2026): $480,000
Activities: Mathematical simulation of aerodynamics in confined factory environments, testing various battery chemistries, and assessing acoustic resonance. No working prototype existed. At this stage, management had not demonstrated technical viability or committed manufacturing resources.

• Critical Milestone (July 15, 2026):
Our team successfully achieved stable flight in factory simulations, secured patent filings, and finalized a binding pre-order letter of intent with Toyota Manufacturing Canada. The technical feasibility of the product was formally established, and ATR's Board approved the $1.2M production roll-out budget.

• Phase 2 (July 16, 2026 – October 31, 2026): $350,000
Activities: CAD tool design, carbon-fiber chassis prototyping, safety sensor firmware development, and pre-commercial operational testing.

Accounting Note: Finance capitalized the full $830,000 under Intangible Assets.`
      }
    ],
    issues: [
      {
        id: 'issue-rev-rec',
        title: 'Issue 1: Revenue Recognition for Multi-Element Automated Assembly Systems',
        topic: 'Revenue Recognition',
        standardCode: 'IFRS 15',
        standardName: 'Revenue from Contracts with Customers',
        handbookSection: 'Part I - IFRS 15, paras 22-30 (Performance Obligations) & paras 31-38 (Satisfaction of POs)',
        description: 'ATR recognized the full $2.4M contract price immediately, despite installation being incomplete and 2-year maintenance not yet started.',
        criteria: [
          {
            id: 'c-identify-contract',
            name: 'Step 1: Identify Contract with Customer',
            standardReference: 'IFRS 15.9',
            description: 'Contract is approved, rights and payment terms identified, has commercial substance, and collection is probable.',
            expectedCaseFact: 'ApexParts contract #4409 signed October 1, 2026, with clear consideration and non-refundable deposit.'
          },
          {
            id: 'c-performance-obligations',
            name: 'Step 2: Identify Distinct Performance Obligations',
            standardReference: 'IFRS 15.22-30',
            description: 'Determine if goods or services are capable of being distinct and distinct within the context of the contract.',
            expectedCaseFact: 'Three distinct performance obligations: (1) Equipment delivery ($1.6M), (2) Custom installation ($400k), and (3) 2-Year technical support ($400k). Customer can benefit from each independently.'
          },
          {
            id: 'c-transaction-price',
            name: 'Step 3 & 4: Transaction Price & Allocation',
            standardReference: 'IFRS 15.73-86',
            description: 'Allocate the $2.4M transaction price based on relative stand-alone selling prices.',
            expectedCaseFact: 'Sum of stand-alone prices equals $2.4M ($1.6M + $400k + $400k). No discount allocation required.'
          },
          {
            id: 'c-timing-recognition',
            name: 'Step 5: Timing of Revenue Recognition',
            standardReference: 'IFRS 15.31-38',
            description: 'Recognize revenue when (or as) the entity satisfies each performance obligation: point in time vs. over time.',
            expectedCaseFact: 'Equipment ($1.6M) recognized at point in time upon delivery (Dec 1). Installation recognized over time based on progress (40% of $400k = $160k). Support ($400k) has not begun (0% recognized). Total earned revenue in 2026 is $1.76M, not $2.4M.'
          }
        ],
        modelRecommendation: {
          accountingTreatment: 'Under IFRS 15, ATR must reverse $640,000 of premature revenue ($2,400,000 draft minus $1,760,000 earned: $1,600,000 equipment + $160,000 installation). The remaining unearned portion must be classified as a Contract Liability (Deferred Revenue) on the Statement of Financial Position.',
          financialStatementImpact: 'Debit Revenue $640,000, Credit Contract Liability (Current Liabilities) $640,000. Net Income and EBT decrease by $640,000.',
          journalEntry: `DR: Sales Revenue                    $640,000
    CR: Contract Liability (Current)          $640,000`,
          covenantOrBusinessImpact: 'Adding $640,000 to Current Liabilities increases them to $7,668,000, which causes the Working Capital Ratio to drop from 1.44:1 to 1.32:1—violating FCCB\'s 1.40:1 covenant and placing the $15M credit facility in technical default!'
        },
        guidanceHints: {
          missingIssueHint: 'Consider whether all deliverables in the ApexParts contract have been fully performed. Does physical delivery of hardware entitle ATR to recognize revenue for future installation and two years of future technical support under Canadian standards?',
          wrongStandardHint: 'Revenue from contracts with commercial customers is governed by IFRS 15 (Part I of the CPA Canada Handbook), not IAS 16 or IAS 18.',
          incompleteAnalysisHint: 'Remember to apply the 5-Step Model of IFRS 15: Identify whether the equipment, installation, and support are distinct performance obligations, and evaluate whether each is satisfied at a point in time or over time.'
        }
      },
      {
        id: 'issue-rnd-capitalization',
        title: 'Issue 2: Capitalization of Project SkyLift Drone Expenditures',
        topic: 'Intangible Assets',
        standardCode: 'IAS 38',
        standardName: 'Intangible Assets',
        handbookSection: 'Part I - IAS 38, paras 54-67 (Research vs Development Phase & PIRATE Criteria)',
        description: 'ATR capitalized all $830k of project costs as an intangible asset, including $480k spent during the preliminary research phase prior to establishing technical feasibility.',
        criteria: [
          {
            id: 'c-research-phase',
            name: 'Prohibition on Capitalizing Research Phase',
            standardReference: 'IAS 38.54-55',
            description: 'No intangible asset arising from research (or from the research phase of an internal project) shall be recognized. Expenditures must be expensed as incurred.',
            expectedCaseFact: 'Phase 1 costs of $480,000 (Jan-June) involved aerodynamic modeling and theoretical simulations with no prototype or viability established. Must be expensed immediately.'
          },
          {
            id: 'c-pirate-criteria',
            name: 'Six Development Capitalization Criteria (PIRATE)',
            standardReference: 'IAS 38.57',
            description: 'An entity must demonstrate: Probable future economic benefits, Intention to complete, Resources available, Ability to use/sell, Technical feasibility, and Reliable Expenditure measurement.',
            expectedCaseFact: 'All six criteria were met on July 15, 2026, when stable flight was verified, board approved commercial budget, and binding Toyota letter of intent was signed.'
          },
          {
            id: 'c-subsequent-costs',
            name: 'Measurement of Development Phase',
            standardReference: 'IAS 38.65-66',
            description: 'Only costs directly attributable to creating, producing, and preparing the asset incurred from the date criteria are met can be capitalized. Prior costs cannot be retroactively reinstated.',
            expectedCaseFact: 'Only the $350,000 spent from July 16 to October 31 qualifies for capitalization as an Intangible Asset.'
          }
        ],
        modelRecommendation: {
          accountingTreatment: 'Under IAS 38, the $480,000 incurred during the research phase must be derecognized from Intangible Assets and expensed to Research & Development Expense in profit or loss. Only $350,000 qualifies as a Capitalized Development Intangible Asset.',
          financialStatementImpact: 'Debit R&D Expense $480,000, Credit Intangible Assets $480,000. EBT decreases by $480,000.',
          journalEntry: `DR: Research & Development Expense   $480,000
    CR: Intangible Assets (SkyLift)           $480,000`,
          covenantOrBusinessImpact: 'Combined with the revenue adjustment (-$640k), total EBT drops by $1,120,000 from $4,620,000 to $3,500,000—falling well below the $4,500,000 executive bonus threshold!'
        },
        guidanceHints: {
          missingIssueHint: 'Examine the $830,000 balance in Capitalized Intangibles on the Statement of Financial Position. Under Canadian IFRS, can an enterprise capitalize preliminary research testing, or does IAS 38 require expensing prior to commercial feasibility?',
          wrongStandardHint: 'Internally developed intangible assets and development expenditures are governed by IAS 38 (Intangible Assets), not IAS 16.',
          incompleteAnalysisHint: 'Review the six PIRATE criteria under IAS 38.57. When did the company achieve technical feasibility and commercial viability according to the engineering records?'
        }
      }
    ]
  },

  // CASE 2: Northern Shield Health Logistics Corp.
  {
    id: 'ifrs-case-02',
    title: 'Northern Shield Health Logistics Corp. — Warehouse Lease & Temperature Litigation',
    companyName: 'Northern Shield Health Logistics Corp.',
    industry: 'Cold-Chain Healthcare Logistics & Distribution (Public Enterprise)',
    reportingFramework: 'IFRS (Part I CPA Canada Handbook)',
    role: 'Financial Reporting Specialist reporting to VP Finance',
    date: 'December 2026',
    estimatedTimeMinutes: 40,
    overview: 'Northern Shield Health Logistics Corp. is a TSX-Venture listed distributor of temperature-sensitive biologics and vaccines. The company expanded into a new 100,000 sq ft cold-storage logistics hub under a 5-year lease and is currently facing a multi-million-dollar lawsuit from a major vaccine client over a cold-chain failure. The VP Finance requires your technical accounting analysis under IFRS 16 and IAS 37 before publishing annual financial statements.',
    narrative: `Northern Shield Health Logistics Corp. (NSH) is a Canadian public company headquartered in Mississauga, Ontario, specializing in specialized cold-chain pharmaceutical transport across Eastern Canada.

NSH's senior debt facility requires compliance with a Debt-Service Coverage Ratio (DSCR) of at least 1.35x and a Maximum Total Debt to Tangible Net Worth ratio of 2.00x. The company's draft net income for 2026 is currently $1,800,000.

You have been assigned to evaluate two high-stakes accounting issues:

1. **Transaction 1: Mississauga Super-Hub 5-Year Lease (Appendix II)**
On January 1, 2026, NSH entered into a 5-year lease for a state-of-the-art cold-storage distribution facility with Ontario Commercial Properties REIT. Annual lease payments are $600,000 paid at the end of each year. NSH also paid $50,000 in direct legal and broker commissions on January 1. Management treated this lease as an off-balance-sheet operating lease, simply recording $600,000 as rent expense in the draft Income Statement, claiming that the title does not transfer to NSH at the end of 5 years. NSH's incremental borrowing rate is 6.0%.

2. **Transaction 2: Biopharma Vaccine Temperature Excursion Lawsuit (Appendix III)**
In August 2026, a backup refrigeration failure during a shipment of pediatric vaccines resulted in the spoilage of $2,200,000 worth of temperature-sensitive inventory belonging to MedVax Canada Inc. MedVax filed a formal lawsuit against NSH for $2,500,000 in damages. NSH's independent external legal counsel (Appendix III) has concluded that NSH is contractually liable due to negligence in maintenance logs, and a settlement payment between $1,800,000 and $2,200,000 is probable, with $2,000,000 being the best single estimate. NSH holds a commercial liability policy with Great Northern Casualty Insurance, but Great Northern Casualty is contesting coverage due to alleged late notification. Management has neither accrued a provision nor disclosed anything in the notes, hoping to reach a confidential settlement after year-end.`,
    keyStakeholders: [
      'Commercial Bank Syndicate (Monitoring debt covenants and lease liabilities under IFRS 16)',
      'MedVax Canada Inc. (Plaintiff demanding $2.5M settlement)',
      'Public Shareholders & Analysts (Focusing on operating margins and liability provisions)'
    ],
    userObjectives: [
      'Apply IFRS 16 to determine whether the warehouse lease must be recognized on the Statement of Financial Position.',
      'Calculate the initial Right-of-Use (ROU) Asset and Lease Liability at present value, including initial direct costs.',
      'Apply IAS 37 criteria (present obligation, probable outflow, reliable estimate) to the MedVax litigation.',
      'Advise management on the strict separation of provisions vs. contingent insurance assets under IAS 37.'
    ],
    appendices: [
      {
        id: 'nsh-app-01',
        title: 'Appendix I: Key Financial Figures & Banking Covenants',
        type: 'financial_statement',
        content: `Draft Financial Extract (Before IFRS Adjustments) as of Dec 31, 2026:
• Cash: $2,100,000
• Tangible Net Worth: $8,500,000
• Total Reported Debt (excluding lease obligations): $14,200,000
• Reported Operating Income: $2,900,000
• Reported Net Income: $1,800,000
• Total Debt to Tangible Net Worth: 1.67x (Covenant Maximum: 2.00x)

Banking Covenant Note:
"All lease liabilities recognized on the Statement of Financial Position under IFRS 16 are included in Total Debt for covenant calculation purposes."`
      },
      {
        id: 'nsh-app-02',
        title: 'Appendix II: Mississauga Distribution Facility Lease Agreement',
        type: 'contract',
        content: `Commercial Lease Agreement Extract:
• Lessor: Ontario Commercial Properties REIT
• Lessee: Northern Shield Health Logistics Corp.
• Commencement Date: January 1, 2026
• Lease Term: 5 Years (No purchase option, no transfer of title).
• Lease Payments: $600,000 per year, payable annually in arrears on December 31.
• Initial Direct Costs: $50,000 paid in cash by NSH for legal drafting and brokerage.
• Lessee's Incremental Borrowing Rate: 6.0% per annum.
• Present Value Factor of an Ordinary Annuity (5 years @ 6.0%): 4.212364
• PV of Lease Payments = $600,000 × 4.212364 = $2,527,418.

Management Note: "Because ownership remains with the REIT and we do not own the building, we recorded $600,000 as rent expense and kept the lease off our balance sheet."`
      },
      {
        id: 'nsh-app-03',
        title: 'Appendix III: Legal Opinion Letter from Vanguard Legal Partners LLP',
        type: 'memo',
        content: `CONFIDENTIAL ATTORNEY-CLIENT PRIVILEGED COMMUNICATION
To: Laura Chen, VP Finance, Northern Shield Health Logistics Corp.
From: Arthur Pendelton, Senior Litigation Counsel, Vanguard Legal Partners LLP
Date: December 14, 2026
Subject: MedVax Canada Inc. v. Northern Shield Health Logistics Corp. (Court File No. CV-26-8819)

We have reviewed the sensor telemetry logs from the August 12 refrigeration outage. Unfortunately, internal maintenance records reveal that NSH missed two mandatory refrigeration compressor inspections required under the Master Transport Agreement.

In our legal opinion:
1. Liability is virtually certain. NSH has a present legal obligation resulting from this past contractual breach.
2. It is probable (greater than 80% likelihood) that NSH will be required to settle the claim in cash within the next 6 to 9 months.
3. While the plaintiff seeks $2,500,000, our settlement range analysis indicates an expected settlement amount between $1,800,000 and $2,200,000, with $2,000,000 representing the most reliable single estimate.
4. Regarding insurance: While NSH notified Great Northern Casualty Insurance, Great Northern Casualty has issued a formal reservation of rights citing the missed maintenance inspections. Recovery from Great Northern Casualty is speculative and cannot be considered virtually certain at this stage.`
      }
    ],
    issues: [
      {
        id: 'issue-ifrs16-lease',
        title: 'Issue 1: Accounting for the 5-Year Warehouse Lease under IFRS 16',
        topic: 'Leases',
        standardCode: 'IFRS 16',
        standardName: 'Leases',
        handbookSection: 'Part I - IFRS 16, paras 22-38 (Recognition and Initial/Subsequent Measurement)',
        description: 'Management kept the $2.5M warehouse lease off-balance-sheet as an operating lease, failing to recognize a Right-of-Use Asset and Lease Liability.',
        criteria: [
          {
            id: 'c-lease-definition',
            name: 'Identification of a Lease',
            standardReference: 'IFRS 16.9',
            description: 'Contract conveys the right to control the use of an identified asset for a period of time in exchange for consideration.',
            expectedCaseFact: 'The Mississauga facility is an identified physical asset which NSH exclusively controls for 5 years.'
          },
          {
            id: 'c-lease-exemptions',
            name: 'Assessment of Recognition Exemptions',
            standardReference: 'IFRS 16.5',
            description: 'Exemptions only exist for short-term leases (<= 12 months) and low-value assets. Neither applies to a 5-year commercial warehouse.',
            expectedCaseFact: '5-year commercial warehouse exceeds short-term threshold and is high value. Off-balance sheet treatment is prohibited under IFRS.'
          },
          {
            id: 'c-initial-measurement',
            name: 'Initial Measurement of Lease Liability and ROU Asset',
            standardReference: 'IFRS 16.23-26',
            description: 'Lease liability measured at PV of lease payments ($2,527,418). ROU Asset includes initial liability plus initial direct costs ($2,527,418 + $50,000 = $2,577,418).',
            expectedCaseFact: 'PV of 5 annual $600k payments at 6% = $2,527,418. Capitalize $50k legal costs into ROU Asset for total initial cost of $2,577,418.'
          },
          {
            id: 'c-subsequent-measurement',
            name: 'Subsequent Measurement (Depreciation & Interest)',
            standardReference: 'IFRS 16.29-38',
            description: 'Depreciate ROU Asset straight-line over 5 years ($515,484/year). Recognize interest expense at 6% ($151,645 in Year 1). Reduce liability by principal repayment ($448,355).',
            expectedCaseFact: 'Rent expense of $600,000 must be removed. Instead record ROU Depreciation of $515,484 and Interest Expense of $151,645, increasing total Year 1 expense to $667,129.'
          }
        ],
        modelRecommendation: {
          accountingTreatment: 'Under IFRS 16, NSH must recognize a Right-of-Use Asset of $2,577,418 and a Lease Liability of $2,527,418 as of January 1, 2026. For 2026, reverse Rent Expense of $600,000 and record Depreciation Expense of $515,484 and Interest Expense of $151,645. Lease Liability at Dec 31, 2026, is $2,079,063 ($2,527,418 + $151,645 - $600,000).',
          financialStatementImpact: 'Increases Non-Current Assets by $2,061,934 (ROU Asset net of Year 1 depreciation). Increases Total Debt by $2,079,063 (Lease Liability). Reduces Net Income by $67,129 ($667,129 vs $600,000).',
          journalEntry: `DR: Right-of-Use Asset (Warehouse)    $2,577,418
    CR: Lease Liability (Non-Current/Cur)      $2,527,418
    CR: Cash (Initial Direct Legal Costs)          $50,000`,
          covenantOrBusinessImpact: 'Adding $2,079,063 in lease debt increases Total Debt to $16,279,063, pushing the Debt-to-Equity/Tangible Net Worth ratio from 1.67x to 1.93x—perilously close to the 2.00x bank ceiling.'
        },
        guidanceHints: {
          missingIssueHint: 'Review how the 5-year commercial warehouse agreement was recorded. Under Canadian IFRS (IFRS 16), can commercial property leases be kept off the Statement of Financial Position?',
          wrongStandardHint: 'Lease accounting under IFRS is governed by IFRS 16 (Leases), not IAS 17 (superseded) or ASPE 3065.',
          incompleteAnalysisHint: 'Calculate the present value of the 5-year lease annuity using the 6.0% discount rate. Remember that initial direct legal fees ($50k) must be added to the ROU Asset.'
        }
      },
      {
        id: 'issue-ias37-lawsuit',
        title: 'Issue 2: Accrual of Legal Provision for MedVax Litigation under IAS 37',
        topic: 'Provisions & Contingencies',
        standardCode: 'IAS 37',
        standardName: 'Provisions, Contingent Liabilities and Contingent Assets',
        handbookSection: 'Part I - IAS 37, paras 14-26 (Criteria for Provision) & paras 53-58 (Reimbursements)',
        description: 'Management omitted to record a provision for the $2.0M probable lawsuit settlement, seeking to avoid impacting 2026 financial results.',
        criteria: [
          {
            id: 'c-present-obligation',
            name: 'Criterion 1: Present Legal Obligation from Past Event',
            standardReference: 'IAS 37.14(a)',
            description: 'The entity has a present legal obligation as a result of an obligating past event.',
            expectedCaseFact: 'The past event is the missed compressor inspections and resulting refrigeration failure in August 2026. External legal counsel confirms NSH has a binding legal liability.'
          },
          {
            id: 'c-probable-outflow',
            name: 'Criterion 2: Probable Outflow of Economic Resources',
            standardReference: 'IAS 37.14(b)',
            description: 'It is probable (>50% likelihood) that an outflow of economic benefits will be required to settle the obligation.',
            expectedCaseFact: 'Legal counsel states settlement is virtually certain (over 80% likelihood).'
          },
          {
            id: 'c-reliable-estimate',
            name: 'Criterion 3: Reliable Estimate of the Amount',
            standardReference: 'IAS 37.14(c)',
            description: 'A reliable estimate can be made of the amount of the obligation (best estimate of expenditure required to settle at balance sheet date).',
            expectedCaseFact: 'Legal counsel estimated settlement range of $1.8M to $2.2M, with $2,000,000 representing the single best estimate under IAS 37.36.'
          },
          {
            id: 'c-insurance-reimbursement',
            name: 'Accounting for Insurance Reimbursement',
            standardReference: 'IAS 37.53',
            description: 'Reimbursements from insurance can only be recognized as an asset when it is virtually certain that reimbursement will be received. Cannot net against provision.',
            expectedCaseFact: 'Great Northern Casualty has issued a reservation of rights due to missed maintenance. Reimbursement is not virtually certain and CANNOT be recognized as an asset or netted against the provision.'
          }
        ],
        modelRecommendation: {
          accountingTreatment: 'Under IAS 37, NSH must accrue a formal Litigation Provision of $2,000,000 as a Current Liability and charge a Litigation Expense to the 2026 Income Statement. No insurance asset can be recognized at this time because recovery is contested.',
          financialStatementImpact: 'Debit Litigation Settlement Expense $2,000,000, Credit Provision for Litigation (Current Liabilities) $2,000,000. Net income of $1,800,000 is converted into a net loss of $200,000!',
          journalEntry: `DR: Litigation & Settlement Expense   $2,000,000
    CR: Provision for Litigation (Current)    $2,000,000`,
          covenantOrBusinessImpact: 'Recognizing this $2,000,000 liability erodes Tangible Net Worth from $8,500,000 to $6,500,000. Coupled with the new lease debt, Total Debt / Tangible Net Worth rises to $16,279,063 / $6,500,000 = 2.50x, breaching the 2.00x banking covenant!'
        },
        guidanceHints: {
          missingIssueHint: 'Review the facts regarding the MedVax litigation. Does an 80% likelihood of payout constitute a probable outflow requiring a provision under IAS 37, or can management simply disclose it in a note?',
          wrongStandardHint: 'Provisions, contingent liabilities, and expected legal claims are governed by IAS 37 (Part I of CPA Canada Handbook).',
          incompleteAnalysisHint: 'Check all three criteria under IAS 37.14: Present Obligation, Probable Outflow (>50%), and Reliable Estimate. Also check whether the insurance claim can be netted against the liability.'
        }
      }
    ]
  },

  // CASE 3: Prairie Harvest Foods Ltd.
  {
    id: 'ifrs-case-03',
    title: 'Prairie Harvest Foods Ltd. — Inventory NRV & Federal Clean-Ag Grant',
    companyName: 'Prairie Harvest Foods Ltd.',
    industry: 'Agricultural Processing & Specialty Grains (TSX-Listed)',
    reportingFramework: 'IFRS (Part I CPA Canada Handbook)',
    role: 'Accounting Supervisor reporting to Director of Financial Reporting',
    date: 'December 2026',
    estimatedTimeMinutes: 35,
    overview: 'Prairie Harvest Foods Ltd. processes organic grains and specialty oilseeds across Saskatchewan and Manitoba. Due to international tariff shocks and sudden commodity price deflation, management is reluctant to write down aged grain inventories. Concurrently, the company received a $1,200,000 federal grant for energy-efficient electric drying silos. As accounting supervisor, you must evaluate the inventory write-down under IAS 2 (including Canada\'s prohibition of LIFO) and the grant accounting options under IAS 20.',
    narrative: `Prairie Harvest Foods Ltd. (PHF) is a publicly traded agro-processing corporation based in Saskatoon, Saskatchewan, reporting under IFRS.

The company operates bulk grain elevators, processing organic oats, specialty mustard seed, and canola oil for export.

You have been asked by the Director of Financial Reporting, Evelyn Ross, to provide formal IFRS recommendations on two key matters before closing the annual accounts:

1. **Matter 1: Bulk Organic Canola Inventory Valuation (Appendix I)**
PHF currently holds 18,000 metric tonnes of premium organic canola in storage silos, carried at an average historical cost of $720 per tonne (Total carrying value: $12,960,000). Due to unexpected international import restrictions and an bumper harvest in South America, global canola spot prices plummeted in late autumn 2026. Current market quoted selling price has dropped to $610 per tonne. Furthermore, to deliver the canola to port export terminals in Vancouver, PHF will incur mandatory freight and elevation handling costs of $35 per tonne. Management has suggested adopting the LIFO inventory method (hoping to assign lower recent prices to sales) or deferring any write-down, arguing that grain prices may rebound in late 2027.

2. **Matter 2: $1,200,000 Federal Clean-Ag Technology Grant (Appendix II)**
On March 1, 2026, PHF received a $1,200,000 grant from Agriculture and Agri-Food Canada (AAFC) under the Clean Agriculture Technology Program. The grant was provided to help finance the installation of a new $4,000,000 zero-emission electric grain drying system completed and commissioned on July 1, 2026 (useful life: 10 years, straight-line depreciation). Management immediately credited the entire $1,200,000 to "Other Operating Income" in March 2026, arguing that the funds were deposited in the bank and non-repayable as long as the dryer was built. Evelyn Ross wants to know the permissible presentation methods under IAS 20 and the proper timing of grant recognition.`,
    keyStakeholders: [
      'Audit Committee & External Auditors (Enforcing IAS 2 and IAS 20 compliance)',
      'Export Development Canada (EDC) & Agricultural Credit Corporation (Lenders)',
      'Grain Producers and Board of Directors'
    ],
    userObjectives: [
      'Apply IAS 2 rules on Lower of Cost and Net Realizable Value (LCNRV).',
      'Explain why LIFO is prohibited under Canadian IFRS (IAS 2.25) and ASPE (Section 3031).',
      'Calculate the required inventory impairment write-down to Net Realizable Value.',
      'Evaluate permissible accounting methods for capital grants under IAS 20 (Deferred Income vs. Asset Cost Reduction).'
    ],
    appendices: [
      {
        id: 'phf-app-01',
        title: 'Appendix I: Canola Inventory & Market Pricing Schedule',
        type: 'schedule',
        content: `Inventory Valuation Schedule — Organic Canola as of Dec 31, 2026:
• Quantity in storage: 18,000 Metric Tonnes (MT)
• Historical Recorded Cost per MT: $720.00
• Total Recorded Book Value: $12,960,000

Current Market & Disposal Data:
• Current Market Selling Price per MT: $610.00
• Mandatory Rail Freight & Elevation Costs to Port: $35.00 per MT
• Estimated Selling Costs (brokerage commissions): $10.00 per MT
• Estimated Net Realizable Value (NRV) per MT: $610.00 - $35.00 - $10.00 = $565.00 per MT.
• Total Net Realizable Value: 18,000 MT × $565.00 = $10,170,000.

Carrying Cost ($12,960,000) vs. NRV ($10,170,000):
Potential Impairment Write-Down: $2,790,000 ($155.00 per MT).`
      },
      {
        id: 'phf-app-02',
        title: 'Appendix II: Federal Clean Agriculture Technology Grant Agreement',
        type: 'contract',
        content: `Government Contribution Agreement No. AAFC-CAT-2026-081:
• Grantor: His Majesty the King in Right of Canada, represented by the Minister of Agriculture.
• Recipient: Prairie Harvest Foods Ltd.
• Grant Amount: $1,200,000 CAD (Received in full on March 1, 2026).
• Purpose: Capital contribution toward the acquisition and installation of Clean Electric Grain Drying Facilities (Total Project Cost: $4,000,000).
• Asset Commissioning Date: July 1, 2026.
• Asset Estimated Useful Life: 10 Years with zero salvage value.
• Condition of Assistance: Facility must operate utilizing non-fossil-fuel energy for a minimum of 5 operating crop seasons. Recipient must submit annual emissions audit reports. If the asset is sold or decommissioned prior to 5 years, the grant is subject to pro-rata clawback.`
      }
    ],
    issues: [
      {
        id: 'issue-ias2-nrv',
        title: 'Issue 1: Valuation of Canola Inventory at Lower of Cost and Net Realizable Value',
        topic: 'Inventory Valuation',
        standardCode: 'IAS 2',
        standardName: 'Inventories',
        handbookSection: 'Part I - IAS 2, paras 9, 25, 28-33 (LCNRV and Cost Formulas)',
        description: 'Management resisted writing down aged canola inventory to Net Realizable Value and proposed adopting the LIFO cost formula.',
        criteria: [
          {
            id: 'c-lcnrv-rule',
            name: 'Measurement at Lower of Cost and Net Realizable Value',
            standardReference: 'IAS 2.9',
            description: 'Inventories shall be measured at the lower of cost and net realizable value (LCNRV).',
            expectedCaseFact: 'Cost is $720/MT ($12,960,000). NRV is $565/MT ($10,170,000). Inventory must be written down to $10,170,000.'
          },
          {
            id: 'c-nrv-definition',
            name: 'Calculation of Net Realizable Value',
            standardReference: 'IAS 2.6',
            description: 'NRV is the estimated selling price in the ordinary course of business less estimated costs of completion and costs necessary to make the sale.',
            expectedCaseFact: 'Selling price $610 minus shipping $35 minus brokerage $10 = $565/MT.'
          },
          {
            id: 'c-lifo-prohibition',
            name: 'Strict Canadian Prohibition of LIFO',
            standardReference: 'IAS 2.25',
            description: 'Under Canadian IFRS (and ASPE 3031), the Last-In, First-Out (LIFO) method is strictly prohibited. Only FIFO or Weighted Average Cost formulas are permitted.',
            expectedCaseFact: 'Management cannot adopt LIFO to mitigate this write-down. Canadian standards strictly bar LIFO.'
          }
        ],
        modelRecommendation: {
          accountingTreatment: 'Under IAS 2, PHF must recognize an inventory write-down of $2,790,000 ($155/MT × 18,000 MT) to reduce the carrying amount from $12,960,000 to its Net Realizable Value of $10,170,000. LIFO is illegal under Canadian standards.',
          financialStatementImpact: 'Debit Cost of Goods Sold (or Inventory Impairment Loss) $2,790,000, Credit Merchandise Inventory $2,790,000. Net Income and Current Assets decrease by $2,790,000.',
          journalEntry: `DR: Cost of Goods Sold (Inventory Write-Down)   $2,790,000
    CR: Merchandise Inventory                              $2,790,000`,
          covenantOrBusinessImpact: 'Significantly reduces current assets and gross margin, and cannot be deferred or offset by future anticipated price recoveries.'
        },
        guidanceHints: {
          missingIssueHint: 'Look at the canola inventory valuation. What is the current market price net of shipping and selling costs compared to recorded cost under IAS 2?',
          wrongStandardHint: 'Inventory valuation and write-downs are governed by IAS 2 (Inventories) in Part I of the CPA Canada Handbook.',
          incompleteAnalysisHint: 'Remember to mention that the LIFO cost formula proposed by management is strictly prohibited in Canada under both IAS 2 and ASPE Section 3031.'
        }
      },
      {
        id: 'issue-ias20-grant',
        title: 'Issue 2: Presentation & Recognition of Federal Clean-Ag Capital Grant',
        topic: 'Government Grants',
        standardCode: 'IAS 20',
        standardName: 'Accounting for Government Grants and Disclosure of Government Assistance',
        handbookSection: 'Part I - IAS 20, paras 7, 12, 24-28 (Grants Related to Assets)',
        description: 'Management recognized the entire $1.2M capital grant immediately as operating income upon receipt, rather than matching it to asset depreciation over 10 years.',
        criteria: [
          {
            id: 'c-grant-matching',
            name: 'Matching Principle for Grants Related to Assets',
            standardReference: 'IAS 20.12',
            description: 'Government grants shall be recognized in profit or loss on a systematic basis over the periods in which the entity recognizes as expenses the related costs for which the grants are intended to compensate.',
            expectedCaseFact: 'The grant compensates for acquiring a 10-year grain dryer. It cannot be recognized upfront in income; it must be recognized over the 10-year useful life of the asset.'
          },
          {
            id: 'c-grant-presentation',
            name: 'Permissible Presentation Methods (Deferred Income vs Asset Reduction)',
            standardReference: 'IAS 20.24',
            description: 'IAS 20 permits two alternative presentation methods: (1) Setting up the grant as Deferred Income and recognizing it over 10 years, or (2) Deducting the grant in arriving at the carrying amount of the asset.',
            expectedCaseFact: 'Method A: Record $1.2M as Deferred Income liability, amortizing $60,000 into income for the 6 months in 2026. Method B: Reduce asset cost to $2,800,000 ($4.0M - $1.2M), resulting in lower annual depreciation of $280,000.'
          }
        ],
        modelRecommendation: {
          accountingTreatment: 'Under IAS 20, management\'s immediate recognition of $1,200,000 into income is non-compliant. PHF must reverse the $1,200,000 income. For 2026 (6 months of operation from July 1 to Dec 31), only $60,000 ($1.2M ÷ 10 years × 6/12) of grant benefit can be recognized in profit or loss.',
          financialStatementImpact: 'Reverses $1,140,000 of premature other income. Either increases Deferred Income liability by $1,140,000 (Method A) or reduces PPE by $1,140,000 (Method B).',
          journalEntry: `DR: Other Operating Income (Reversal)     $1,140,000
    CR: Deferred Government Grant (Liability)      $1,140,000`,
          covenantOrBusinessImpact: 'Erodes reported 2026 operating earnings by $1,140,000, compounding the inventory write-down.'
        },
        guidanceHints: {
          missingIssueHint: 'Check how management recorded the $1.2M federal capital grant in March. Can capital grants for 10-year productive assets be taken into current income all at once under IAS 20?',
          wrongStandardHint: 'Government grants and assistance are governed by IAS 20 (Part I of CPA Canada Handbook).',
          incompleteAnalysisHint: 'Review IAS 20.24 regarding the two acceptable presentation methods for grants related to assets: the Deferred Income method vs. the Net Asset Cost deduction method.'
        }
      }
    ]
  }
];
