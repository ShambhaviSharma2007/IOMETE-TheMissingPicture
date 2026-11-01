import type { ExampleScenarioData } from '../types';

export const AURELIA_CAPITAL_SCENARIO: ExampleScenarioData = {
  organizationName: 'Aurelia Capital (Fictional Investment Bank)',
  leadPersona: {
    name: 'Maya Sharma',
    title: 'Director of Data Platforms',
    brief: 'Maya has 90 days to evaluate whether IOMETE can unify Aurelia Capital’s fragmented data landscape across multi-asset trading, risk, and regulatory reporting.',
  },
  contextSummary:
    'A multi-asset investment bank with trade records, portfolio positions, market tick data, and instrument reference data scattered across disconnected relational databases, flat-file drops, and vendor feeds. Downstream teams face daily reconciliation breaks, stale risk pricing, and audit trail assembly delays.',
  domains: [
    {
      code: 'MKT-DATA',
      name: 'Market Data & Price Feeds',
      systemOwner: 'Front Office Technology',
      problemSummary: 'Three market data providers delivery feeds across differing latency profiles. Batch extracts are inconsistent with intraday ticks.',
      failureIncident: 'Risk team consumed stale 15-minute delayed prices for three trading days before detection; estimated P&L discrepancy of ₹3,40,00,000.',
      metrics: [
        { label: 'Instrument Types', value: '47' },
        { label: 'Feed Providers', value: '3' },
        { label: 'Downstream Consumers', value: '6' },
      ],
      upstream: ['Bloomberg BLPAPI', 'Refinitiv Tick History', 'Exchange Direct Feeds'],
      downstream: ['RISK-CALC (VaR Engine)', 'PORTFOLIO (Mark-to-Market)', 'REPORTING (Valuations)'],
    },
    {
      code: 'TRADE-REC',
      name: 'Trade Records & Executions',
      systemOwner: 'Post-Trade Operations',
      problemSummary: 'Trades captured from 12 executing brokers in 5 differing schemas (FIX, SWIFT, CSV, XML). 8% exception break rate requires manual triage.',
      failureIncident: 'MiFID II transaction reporting submission had 847 errors in Q3 due to missing legal entity lookups, requiring 11 days of manual remediation.',
      metrics: [
        { label: 'Brokers / Venues', value: '12' },
        { label: 'Daily Break Rate', value: '8%' },
        { label: 'Cycle', value: 'T+2' },
      ],
      upstream: ['Order Management System (OMS)', '12 Executing Brokers', 'Clearing Houses'],
      downstream: ['PORTFOLIO (Ledger)', 'REPORTING (MiFID II Transaction Feeds)'],
    },
    {
      code: 'PORTFOLIO',
      name: 'Portfolio Positions',
      systemOwner: 'Portfolio Management',
      problemSummary: 'Four custodian feeds deliver positions on staggered schedules without a unified golden copy. PMs maintain private Excel books.',
      failureIncident: 'A ₹120 Crore European equity position overshoot went undetected for 6 trading days due to delayed custodian reconciliation.',
      metrics: [
        { label: 'Asset Classes', value: '6' },
        { label: 'Custodians', value: '4' },
        { label: 'Reconciliations/Day', value: '~40 manual' },
      ],
      upstream: ['TRADE-REC (Settled Trades)', '4 Custodian SWIFT MT535 Files'],
      downstream: ['RISK-CALC (Portfolio Holdings)', 'REPORTING (Client Statements)'],
    },
    {
      code: 'REF-DATA',
      name: 'Instrument & Entity Reference Data',
      systemOwner: 'Enterprise Data Management',
      problemSummary: 'Three conflicting master catalogs. Instrument identifier mapping (ISIN to SEDOL to Ticker) breaks multiple times weekly.',
      failureIncident: 'Incorrect ISIN mapping caused regulatory reporting errors across 23 instruments in 14 reports, triggering an internal compliance audit.',
      metrics: [
        { label: 'Instruments', value: '~28,000' },
        { label: 'Conflicting Masters', value: '3' },
        { label: 'Onboarding SLA', value: '3–5 days' },
      ],
      upstream: ['Bloomberg Master Data', 'Internal Counterparty DB', 'Vendor Instrument Catalog'],
      downstream: ['MKT-DATA (Symbol Mapping)', 'TRADE-REC (LEI Validation)', 'REPORTING (Taxonomies)'],
    },
  ],
  desiredOutcome:
    'Establish a self-hosted Lakehouse with Apache Iceberg ACID guarantees to provide a single, versioned golden copy of positions and market data, with row/column level access controls and zero data leaving Aurelia’s firewall.',
  iometeFitSummary:
    'IOMETE provides self-hosted Kubernetes deployment (Supported), Iceberg ACID tables for consistent position snapshots (Supported), Dynamic Masking & Row-Level Security (Supported), and PySpark processing (Supported). However, Bloomberg BLPAPI ingestion requires custom Spark pipelines (Unknown/Custom), and specific FCA/SEC regulatory audit attestations require vendor validation (Unknown).',
  pocChecklist: [
    'Deploy IOMETE on an isolated Kubernetes namespace in Aurelia’s non-production cloud VPC.',
    'Ingest synthetic trade and position feeds; validate concurrent Iceberg ACID write/read isolation.',
    'Configure Row-Level Security (RLS) to enforce desk-level trading partition access.',
    'Test Iceberg time-travel to reproduce historical position snapshots for audit queries.',
    'Formulate custom PySpark connector pattern for raw market tick ingestion.',
    'Request vendor SOC 2 Type II compliance audit package and security boundary runbooks.',
  ],
};

