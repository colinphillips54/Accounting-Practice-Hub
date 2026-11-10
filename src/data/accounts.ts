import { Account } from '../types/accounting';

export const CHART_OF_ACCOUNTS: Account[] = [
  // Assets (100-199)
  {
    id: 'cash',
    code: '101',
    name: 'Cash',
    category: 'Asset',
    normalBalance: 'Debit',
    description: 'Currency, bank account balances, and undeposited checks.',
    statement: 'BalanceSheet'
  },
  {
    id: 'accounts_receivable',
    code: '105',
    name: 'Accounts Receivable',
    category: 'Asset',
    normalBalance: 'Debit',
    description: 'Amounts owed to the company by customers for goods/services delivered on credit.',
    statement: 'BalanceSheet'
  },
  {
    id: 'allowance_doubtful_accounts',
    code: '106',
    name: 'Allowance for Doubtful Accounts',
    category: 'ContraAsset',
    normalBalance: 'Credit',
    description: 'Contra-asset account estimating uncollectible receivables.',
    statement: 'BalanceSheet'
  },
  {
    id: 'supplies',
    code: '115',
    name: 'Office Supplies',
    category: 'Asset',
    normalBalance: 'Debit',
    description: 'Physical supplies on hand not yet consumed in business operations.',
    statement: 'BalanceSheet'
  },
  {
    id: 'prepaid_insurance',
    code: '120',
    name: 'Prepaid Insurance',
    category: 'Asset',
    normalBalance: 'Debit',
    description: 'Insurance premiums paid in advance, representing future coverage benefit.',
    statement: 'BalanceSheet'
  },
  {
    id: 'prepaid_rent',
    code: '125',
    name: 'Prepaid Rent',
    category: 'Asset',
    normalBalance: 'Debit',
    description: 'Advance payment of rent for future months.',
    statement: 'BalanceSheet'
  },
  {
    id: 'inventory',
    code: '130',
    name: 'Merchandise Inventory',
    category: 'Asset',
    normalBalance: 'Debit',
    description: 'Goods purchased and held for resale to customers.',
    statement: 'BalanceSheet'
  },
  {
    id: 'equipment',
    code: '150',
    name: 'Equipment',
    category: 'Asset',
    normalBalance: 'Debit',
    description: 'Long-term physical assets such as computers, machines, or vehicles used in operations.',
    statement: 'BalanceSheet'
  },
  {
    id: 'accumulated_depreciation_equipment',
    code: '151',
    name: 'Accumulated Depreciation - Equipment',
    category: 'ContraAsset',
    normalBalance: 'Credit',
    description: 'Contra-asset recording total depreciation recognized on equipment over its useful life.',
    statement: 'BalanceSheet'
  },
  {
    id: 'building',
    code: '160',
    name: 'Building',
    category: 'Asset',
    normalBalance: 'Debit',
    description: 'Long-term physical real estate structures owned by the business.',
    statement: 'BalanceSheet'
  },

  // Liabilities (200-299)
  {
    id: 'accounts_payable',
    code: '201',
    name: 'Accounts Payable',
    category: 'Liability',
    normalBalance: 'Credit',
    description: 'Amounts owed to suppliers or vendors for goods/services bought on credit.',
    statement: 'BalanceSheet'
  },
  {
    id: 'salaries_payable',
    code: '205',
    name: 'Salaries and Wages Payable',
    category: 'Liability',
    normalBalance: 'Credit',
    description: 'Amounts owed to employees for work performed but not yet paid.',
    statement: 'BalanceSheet'
  },
  {
    id: 'unearned_service_revenue',
    code: '210',
    name: 'Unearned Service Revenue',
    category: 'Liability',
    normalBalance: 'Credit',
    description: 'Cash received from customers in advance before services are performed.',
    statement: 'BalanceSheet'
  },
  {
    id: 'interest_payable',
    code: '215',
    name: 'Interest Payable',
    category: 'Liability',
    normalBalance: 'Credit',
    description: 'Interest accrued on debt that has not yet been paid.',
    statement: 'BalanceSheet'
  },
  {
    id: 'notes_payable',
    code: '250',
    name: 'Notes Payable',
    category: 'Liability',
    normalBalance: 'Credit',
    description: 'Formal written obligations or promissory notes requiring payment of principal plus interest.',
    statement: 'BalanceSheet'
  },

  // Shareholders' Equity (300-399)
  {
    id: 'common_shares',
    code: '301',
    name: 'Common Shares',
    category: 'Equity',
    normalBalance: 'Credit',
    description: 'Total capital contributed by shareholders in exchange for ownership shares (Common Shares under Canadian ASPE / IFRS).',
    statement: 'BalanceSheet'
  },
  {
    id: 'retained_earnings',
    code: '310',
    name: 'Retained Earnings',
    category: 'Equity',
    normalBalance: 'Credit',
    description: 'Cumulative net income retained in the business, less dividends distributed to shareholders.',
    statement: 'BalanceSheet'
  },
  {
    id: 'dividends',
    code: '320',
    name: 'Dividends',
    category: 'Dividend',
    normalBalance: 'Debit',
    description: 'Distributions of earnings declared and paid to shareholders; temporary equity reduction account.',
    statement: 'RetainedEarnings'
  },

  // Revenues (400-499)
  {
    id: 'service_revenue',
    code: '401',
    name: 'Service Revenue',
    category: 'Revenue',
    normalBalance: 'Credit',
    description: 'Earnings from performing services for customers.',
    statement: 'IncomeStatement'
  },
  {
    id: 'sales_revenue',
    code: '410',
    name: 'Sales Revenue',
    category: 'Revenue',
    normalBalance: 'Credit',
    description: 'Earnings from the sale of merchandise inventory.',
    statement: 'IncomeStatement'
  },

  // Expenses (500-699)
  {
    id: 'cost_of_goods_sold',
    code: '501',
    name: 'Cost of Goods Sold',
    category: 'Expense',
    normalBalance: 'Debit',
    description: 'Direct cost of inventory merchandise sold to customers.',
    statement: 'IncomeStatement'
  },
  {
    id: 'salaries_expense',
    code: '601',
    name: 'Salaries and Wages Expense',
    category: 'Expense',
    normalBalance: 'Debit',
    description: 'Cost of employee labor during the accounting period.',
    statement: 'IncomeStatement'
  },
  {
    id: 'rent_expense',
    code: '605',
    name: 'Rent Expense',
    category: 'Expense',
    normalBalance: 'Debit',
    description: 'Cost of renting office space, facilities, or machinery for the period.',
    statement: 'IncomeStatement'
  },
  {
    id: 'supplies_expense',
    code: '610',
    name: 'Supplies Expense',
    category: 'Expense',
    normalBalance: 'Debit',
    description: 'Cost of office supplies consumed during operations.',
    statement: 'IncomeStatement'
  },
  {
    id: 'depreciation_expense',
    code: '615',
    name: 'Depreciation Expense',
    category: 'Expense',
    normalBalance: 'Debit',
    description: 'Allocation of the cost of a tangible fixed asset over its useful life.',
    statement: 'IncomeStatement'
  },
  {
    id: 'insurance_expense',
    code: '620',
    name: 'Insurance Expense',
    category: 'Expense',
    normalBalance: 'Debit',
    description: 'Cost of insurance coverage expired during the period.',
    statement: 'IncomeStatement'
  },
  {
    id: 'utilities_expense',
    code: '625',
    name: 'Utilities Expense',
    category: 'Expense',
    normalBalance: 'Debit',
    description: 'Cost of electricity, water, internet, and heating consumed.',
    statement: 'IncomeStatement'
  },
  {
    id: 'advertising_expense',
    code: '630',
    name: 'Advertising Expense',
    category: 'Expense',
    normalBalance: 'Debit',
    description: 'Cost of marketing, promotional campaigns, and advertising.',
    statement: 'IncomeStatement'
  },
  {
    id: 'interest_expense',
    code: '640',
    name: 'Interest Expense',
    category: 'Expense',
    normalBalance: 'Debit',
    description: 'The borrowing cost incurred on notes payable, bonds, or bank loans.',
    statement: 'IncomeStatement'
  },

  // Additional Intermediate 1 & 2 Assets
  {
    id: 'interest_receivable',
    code: '108',
    name: 'Interest Receivable',
    category: 'Asset',
    normalBalance: 'Debit',
    description: 'Interest accrued on notes or investments not yet collected.',
    statement: 'BalanceSheet'
  },
  {
    id: 'contract_asset',
    code: '135',
    name: 'Contract Asset (IFRS 15)',
    category: 'Asset',
    normalBalance: 'Debit',
    description: 'Rights to consideration in exchange for goods/services transferred when right is conditional.',
    statement: 'BalanceSheet'
  },
  {
    id: 'construction_in_progress',
    code: '140',
    name: 'Construction in Progress',
    category: 'Asset',
    normalBalance: 'Debit',
    description: 'Accumulated construction costs and recognized gross profit on long-term contracts.',
    statement: 'BalanceSheet'
  },
  {
    id: 'accumulated_depreciation_building',
    code: '161',
    name: 'Accumulated Depreciation - Building',
    category: 'ContraAsset',
    normalBalance: 'Credit',
    description: 'Contra-asset recording total depreciation on buildings.',
    statement: 'BalanceSheet'
  },
  {
    id: 'land',
    code: '165',
    name: 'Land',
    category: 'Asset',
    normalBalance: 'Debit',
    description: 'Non-depreciable real estate property owned by the business.',
    statement: 'BalanceSheet'
  },
  {
    id: 'investment_in_associate',
    code: '170',
    name: 'Investment in Associate (Equity Method)',
    category: 'Asset',
    normalBalance: 'Debit',
    description: 'Long-term equity investment where investor has significant influence (20%-50%).',
    statement: 'BalanceSheet'
  },
  {
    id: 'investment_fvtoci',
    code: '172',
    name: 'Investment at FVTOCI',
    category: 'Asset',
    normalBalance: 'Debit',
    description: 'Financial asset measured at Fair Value Through Other Comprehensive Income.',
    statement: 'BalanceSheet'
  },
  {
    id: 'right_of_use_asset',
    code: '175',
    name: 'Right-of-Use Asset (Leases)',
    category: 'Asset',
    normalBalance: 'Debit',
    description: 'Asset representing lessee right to use an underlying asset over the lease term.',
    statement: 'BalanceSheet'
  },
  {
    id: 'accumulated_depreciation_rou_asset',
    code: '176',
    name: 'Accumulated Depreciation - ROU Asset',
    category: 'ContraAsset',
    normalBalance: 'Credit',
    description: 'Contra-asset recording amortization of Right-of-Use leased assets.',
    statement: 'BalanceSheet'
  },
  {
    id: 'accumulated_impairment_losses',
    code: '178',
    name: 'Accumulated Impairment Losses',
    category: 'ContraAsset',
    normalBalance: 'Credit',
    description: 'Contra-asset recording cumulative impairment losses on PP&E or intangibles.',
    statement: 'BalanceSheet'
  },
  {
    id: 'derivative_financial_asset',
    code: '180',
    name: 'Derivative Financial Asset',
    category: 'Asset',
    normalBalance: 'Debit',
    description: 'Favorable fair value of foreign exchange forwards, futures, or swaps.',
    statement: 'BalanceSheet'
  },
  {
    id: 'deferred_tax_asset',
    code: '185',
    name: 'Deferred Tax Asset',
    category: 'Asset',
    normalBalance: 'Debit',
    description: 'Future income tax deductible benefits arising from temporary differences.',
    statement: 'BalanceSheet'
  },

  // Additional Intermediate 1 & 2 Liabilities
  {
    id: 'dividends_payable',
    code: '208',
    name: 'Dividends Payable',
    category: 'Liability',
    normalBalance: 'Credit',
    description: 'Cash dividends declared by the Board of Directors not yet distributed.',
    statement: 'BalanceSheet'
  },
  {
    id: 'income_tax_payable',
    code: '209',
    name: 'Income Taxes Payable',
    category: 'Liability',
    normalBalance: 'Credit',
    description: 'Current income tax obligation owed to Canada Revenue Agency (CRA).',
    statement: 'BalanceSheet'
  },
  {
    id: 'warranty_liability',
    code: '220',
    name: 'Warranty Liability',
    category: 'Liability',
    normalBalance: 'Credit',
    description: 'Estimated obligation to repair or replace products under warranty provisions.',
    statement: 'BalanceSheet'
  },
  {
    id: 'contract_liability',
    code: '225',
    name: 'Contract Liability (Deferred Revenue)',
    category: 'Liability',
    normalBalance: 'Credit',
    description: 'Obligation to transfer goods/services to a customer for which consideration was received.',
    statement: 'BalanceSheet'
  },
  {
    id: 'billings_on_construction_in_progress',
    code: '230',
    name: 'Billings on Construction in Progress',
    category: 'Liability',
    normalBalance: 'Credit',
    description: 'Cumulative progress billings issued on long-term contracts; contra to Construction in Progress.',
    statement: 'BalanceSheet'
  },
  {
    id: 'discount_on_notes_payable',
    code: '251',
    name: 'Discount on Notes Payable',
    category: 'ContraLiability',
    normalBalance: 'Debit',
    description: 'Contra-liability representing unamortized interest on non-interest-bearing notes.',
    statement: 'BalanceSheet'
  },
  {
    id: 'bonds_payable',
    code: '260',
    name: 'Bonds Payable',
    category: 'Liability',
    normalBalance: 'Credit',
    description: 'Par or face value of long-term bond certificates issued to investors.',
    statement: 'BalanceSheet'
  },
  {
    id: 'discount_on_bonds_payable',
    code: '261',
    name: 'Discount on Bonds Payable',
    category: 'ContraLiability',
    normalBalance: 'Debit',
    description: 'Contra-liability representing excess of bond face value over issue price.',
    statement: 'BalanceSheet'
  },
  {
    id: 'premium_on_bonds_payable',
    code: '262',
    name: 'Premium on Bonds Payable',
    category: 'Liability',
    normalBalance: 'Credit',
    description: 'Adjunct liability representing excess of bond issue price over par value.',
    statement: 'BalanceSheet'
  },
  {
    id: 'asset_retirement_obligation',
    code: '270',
    name: 'Asset Retirement Obligation (ARO)',
    category: 'Liability',
    normalBalance: 'Credit',
    description: 'Legal or constructive obligation to dismantle, decommission, or restore operating sites.',
    statement: 'BalanceSheet'
  },
  {
    id: 'lease_liability',
    code: '280',
    name: 'Lease Liability',
    category: 'Liability',
    normalBalance: 'Credit',
    description: 'Present value of future lease payments owed by lessee under IFRS 16.',
    statement: 'BalanceSheet'
  },
  {
    id: 'derivative_financial_liability',
    code: '285',
    name: 'Derivative Financial Liability',
    category: 'Liability',
    normalBalance: 'Credit',
    description: 'Unfavorable fair value of financial derivative contracts.',
    statement: 'BalanceSheet'
  },
  {
    id: 'deferred_tax_liability',
    code: '290',
    name: 'Deferred Tax Liability',
    category: 'Liability',
    normalBalance: 'Credit',
    description: 'Future income taxes payable arising from taxable temporary differences.',
    statement: 'BalanceSheet'
  },
  {
    id: 'pension_asset_liability',
    code: '295',
    name: 'Net Defined Benefit Pension Liability',
    category: 'Liability',
    normalBalance: 'Credit',
    description: 'Net deficit of defined benefit pension obligation over fair value of plan assets.',
    statement: 'BalanceSheet'
  },

  // Additional Intermediate 1 & 2 Shareholders' Equity
  {
    id: 'common_shares_distributable',
    code: '303',
    name: 'Common Shares Distributable',
    category: 'Equity',
    normalBalance: 'Credit',
    description: 'Equity account holding stock dividends declared prior to share issuance.',
    statement: 'BalanceSheet'
  },
  {
    id: 'contributed_surplus',
    code: '305',
    name: 'Contributed Surplus',
    category: 'Equity',
    normalBalance: 'Credit',
    description: 'Additional capital contributed by shareholders or stock option transactions.',
    statement: 'BalanceSheet'
  },
  {
    id: 'stock_dividends',
    code: '325',
    name: 'Stock Dividends Declared',
    category: 'Dividend',
    normalBalance: 'Debit',
    description: 'Stock dividend distributions declared from retained earnings.',
    statement: 'RetainedEarnings'
  },
  {
    id: 'revaluation_surplus',
    code: '330',
    name: 'Revaluation Surplus (OCI)',
    category: 'Equity',
    normalBalance: 'Credit',
    description: 'Cumulative unrealized upward revaluation gains on PP&E under IAS 16.',
    statement: 'BalanceSheet'
  },
  {
    id: 'unrealized_gain_loss_oci',
    code: '335',
    name: 'Unrealized Gain/Loss - OCI',
    category: 'Equity',
    normalBalance: 'Credit',
    description: 'Other comprehensive income gains/losses on FVTOCI financial instruments.',
    statement: 'BalanceSheet'
  },

  // Additional Intermediate 1 & 2 Revenues & Gains
  {
    id: 'sales_discounts',
    code: '415',
    name: 'Sales Discounts',
    category: 'ContraRevenue',
    normalBalance: 'Debit',
    description: 'Contra-revenue account recording prompt payment cash discounts taken by customers (e.g. 2/10).',
    statement: 'IncomeStatement'
  },
  {
    id: 'investment_income',
    code: '420',
    name: 'Investment Income (Equity Method)',
    category: 'Revenue',
    normalBalance: 'Credit',
    description: 'Proportionate share of associate net earnings recognized under the equity method.',
    statement: 'IncomeStatement'
  },
  {
    id: 'construction_revenue',
    code: '430',
    name: 'Construction Revenue',
    category: 'Revenue',
    normalBalance: 'Credit',
    description: 'Revenue recognized under percentage-of-completion accounting.',
    statement: 'IncomeStatement'
  },
  {
    id: 'gain_on_derivative',
    code: '440',
    name: 'Gain on Derivative Financial Instrument',
    category: 'Revenue',
    normalBalance: 'Credit',
    description: 'Fair value mark-to-market gain on derivative contracts.',
    statement: 'IncomeStatement'
  },
  {
    id: 'gain_on_discontinued_operations',
    code: '450',
    name: 'Gain on Discontinued Operations',
    category: 'Revenue',
    normalBalance: 'Credit',
    description: 'Net gain realized on disposal of a discontinued component (net of tax).',
    statement: 'IncomeStatement'
  },

  // Additional Intermediate 1 & 2 Expenses & Losses
  {
    id: 'construction_expense',
    code: '510',
    name: 'Construction Expense',
    category: 'Expense',
    normalBalance: 'Debit',
    description: 'Construction costs recognized as expense on long-term contracts.',
    statement: 'IncomeStatement'
  },
  {
    id: 'loss_on_inventory_writedown',
    code: '520',
    name: 'Loss on Inventory Write-Down (LCNRV)',
    category: 'Expense',
    normalBalance: 'Debit',
    description: 'Loss recognized when ending inventory net realizable value is below historical cost.',
    statement: 'IncomeStatement'
  },
  {
    id: 'bad_debt_expense',
    code: '645',
    name: 'Bad Debt Expense',
    category: 'Expense',
    normalBalance: 'Debit',
    description: 'Operating expense estimating uncollectible credit sales / expected credit losses.',
    statement: 'IncomeStatement'
  },
  {
    id: 'warranty_expense',
    code: '650',
    name: 'Warranty Expense',
    category: 'Expense',
    normalBalance: 'Debit',
    description: 'Estimated cost of servicing product warranties recognized in period of sale.',
    statement: 'IncomeStatement'
  },
  {
    id: 'loss_on_impairment',
    code: '655',
    name: 'Loss on Impairment',
    category: 'Expense',
    normalBalance: 'Debit',
    description: 'Write-down of long-term asset carrying amount to recoverable amount under IAS 36.',
    statement: 'IncomeStatement'
  },
  {
    id: 'loss_on_discontinued_operations',
    code: '660',
    name: 'Loss on Discontinued Operations',
    category: 'Expense',
    normalBalance: 'Debit',
    description: 'Loss incurred on disposal or operations of discontinued component.',
    statement: 'IncomeStatement'
  },
  {
    id: 'accretion_expense',
    code: '665',
    name: 'Accretion Expense (ARO)',
    category: 'Expense',
    normalBalance: 'Debit',
    description: 'Periodic unwinding of the discount on asset retirement obligations.',
    statement: 'IncomeStatement'
  },
  {
    id: 'loss_on_derivative',
    code: '670',
    name: 'Loss on Derivative Financial Instrument',
    category: 'Expense',
    normalBalance: 'Debit',
    description: 'Mark-to-market loss on derivative contracts.',
    statement: 'IncomeStatement'
  },
  {
    id: 'income_tax_expense',
    code: '675',
    name: 'Income Tax Expense',
    category: 'Expense',
    normalBalance: 'Debit',
    description: 'Total income tax expense comprising current tax payable plus deferred tax effect.',
    statement: 'IncomeStatement'
  },
  {
    id: 'pension_expense',
    code: '680',
    name: 'Pension Expense',
    category: 'Expense',
    normalBalance: 'Debit',
    description: 'Annual defined benefit pension expense (service cost + net interest).',
    statement: 'IncomeStatement'
  }
];

export const ACCOUNT_MAP = new Map<string, Account>(
  CHART_OF_ACCOUNTS.map(a => [a.id, a])
);

// Map common_stock legacy ID to common_shares for backwards compatibility
const commonSharesAcc = CHART_OF_ACCOUNTS.find(a => a.id === 'common_shares');
if (commonSharesAcc) {
  ACCOUNT_MAP.set('common_stock', commonSharesAcc);
}

// Additional aliases for CPA terminology flexibility
const aroAcc = CHART_OF_ACCOUNTS.find(a => a.id === 'asset_retirement_obligation');
if (aroAcc) {
  ACCOUNT_MAP.set('decommissioning_provision', aroAcc);
}
const rouAcc = CHART_OF_ACCOUNTS.find(a => a.id === 'right_of_use_asset');
if (rouAcc) {
  ACCOUNT_MAP.set('rou_asset', rouAcc);
}
const defRevAcc = CHART_OF_ACCOUNTS.find(a => a.id === 'unearned_service_revenue');
if (defRevAcc) {
  ACCOUNT_MAP.set('deferred_revenue', defRevAcc);
}

export function getAccount(id: string): Account | undefined {
  if (id === 'common_stock') {
    return ACCOUNT_MAP.get('common_shares');
  }
  return ACCOUNT_MAP.get(id);
}
