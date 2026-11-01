/**
 * STATIC CONTENT STORE
 *
 * All IOMETE capability claims are grounded in publicly documented features.
 * Evidence states:
 *   'supported' = directly stated in IOMETE documentation
 *   'assumed'   = reasonable inference from architecture; not explicitly confirmed
 *   'unknown'   = legitimately unverified; requires PoC or vendor confirmation
 *
 * NOTHING is invented: no benchmarks, no pricing, no named FS customers.
 */

import type {
  DataSourceNode,
  Requirement,
  IometeCapability,
  DifficultQuestion,
  Executive,
  EditableField,
  PocWeek,
} from '../types';

// ─── Scene 1: Aurelia Capital's Data Sources ──────────────────────────────────

export const DATA_SOURCES: DataSourceNode[] = [
  {
    id: 'mkt-data',
    code: 'MKT-DATA',
    label: 'Market Data',
    owner: 'Front Office Technology',
    description: 'Real-time and end-of-day price feeds across equities, fixed income, FX, and derivatives. Three separate feed providers with different latency profiles and normalisation schemas.',
    painPoints: [
      'Three latency tiers stored in separate silos — no unified view',
      'Normalisation logic duplicated across 6 downstream consumers',
      'End-of-day batch and intraday are inconsistently reconciled',
      'No single lineage trace from raw tick to risk input',
    ],
    failureMode: 'Risk team consumed stale 15-min-delayed prices for 3 days before detection. P&L impact estimated at £340k.',
    relationships: {
      upstream: ['Bloomberg BLPAPI', 'Refinitiv Tick History', 'Direct Exchange Feeds'],
      downstream: ['RISK-CALC (VaR extracts)', 'PORTFOLIO (Mark-to-Market)', 'REPORTING (Valuations)'],
      bottleneck: 'Downstream systems pull unversioned flat files via scheduled batch jobs with no transactional consistency or schema evolution support.',
    },
    fictionalMetrics: [
      { label: 'Instrument types', value: '47' },
      { label: 'Feed providers', value: '3' },
      { label: 'Latency tiers', value: '3' },
      { label: 'Downstream consumers', value: '6' },
    ],
  },
  {
    id: 'trade-rec',
    code: 'TRADE-REC',
    label: 'Trade Records',
    owner: 'Operations',
    description: 'Post-trade lifecycle data from execution through settlement. Sourced from the OMS, 12 counterparty confirms, and the CSD. T+2 settlement cycle with daily exception management.',
    painPoints: [
      'Counterparty data arrives in 5 different formats (FIX, SWIFT, CSV, XML, proprietary)',
      'Exception rate of 8% requires daily manual triage',
      'No automated break detection across custodian and internal books',
      'Audit trail for regulatory queries takes 2–3 days to compile manually',
    ],
    failureMode: 'MiFID II transaction reporting submission had 847 errors in Q3 due to missing LEI reference lookups — manual correction took 11 days.',
    relationships: {
      upstream: ['Order Management System (OMS)', '12 Execution Brokers', 'Clearing Houses (DTCC/Euroclear)'],
      downstream: ['PORTFOLIO (Position Ledger)', 'REPORTING (MiFID II Transaction Feeds)'],
      bottleneck: 'T+2 batch reconciliations fail to flag breaks until hours before market open, requiring manual Excel triage by operations analysts.',
    },
    fictionalMetrics: [
      { label: 'Counterparties', value: '12' },
      { label: 'Daily exception rate', value: '8%' },
      { label: 'Formats processed', value: '5' },
      { label: 'Settlement cycle', value: 'T+2' },
    ],
  },
  {
    id: 'portfolio',
    code: 'PORTFOLIO',
    label: 'Portfolio Positions',
    owner: 'Portfolio Management',
    description: 'Aggregated position data across multi-asset portfolios. Sourced from 4 custodians with no golden copy. Portfolio managers run their own local Excel aggregations.',
    painPoints: [
      '4 custodians each deliver positions in different cut-off times and formats',
      'No real-time or intraday position view — only T-1 end-of-day',
      'Portfolio managers maintain parallel Excel books — golden copy does not exist',
      'Cross-asset aggregation requires manual cross-referencing every morning',
    ],
    failureMode: 'A £12M position overshoot in European equities went undetected for 6 trading days because the custodian feed was delayed and no alert existed.',
    relationships: {
      upstream: ['TRADE-REC (Settled Trades)', '4 Custodian SWIFT MT535 Files'],
      downstream: ['RISK-CALC (Portfolio Holdings)', 'REPORTING (Client Statements)'],
      bottleneck: 'Absence of an ACID golden copy forces portfolio managers to maintain parallel local spreadsheets, drifting daily from custodian balances.',
    },
    fictionalMetrics: [
      { label: 'Asset classes', value: '6' },
      { label: 'Custodians', value: '4' },
      { label: 'Position currency', value: 'T-1' },
      { label: 'Manual reconciliations/day', value: '~40' },
    ],
  },
  {
    id: 'ref-data',
    code: 'REF-DATA',
    label: 'Reference Data',
    owner: 'Data Management',
    description: 'Instrument master, counterparty, and legal entity reference data. Currently sourced from three conflicting masters: Bloomberg, internal OMS, and an external data vendor.',
    painPoints: [
      '3 conflicting reference data masters with no conflict resolution logic',
      'ISIN → SEDOL → Bloomberg ticker mappings break 2–3 times per week',
      'Legal entity hierarchy changes require manual update across 4 systems',
      'New instrument onboarding takes 3–5 business days',
    ],
    failureMode: 'Incorrect ISIN mapping caused a regulatory reporting error for 23 instruments across 14 reports. Correction required a month of manual remediation.',
    relationships: {
      upstream: ['Bloomberg Master Data', 'Internal Counterparty DB', 'Vendor Instrument Catalog'],
      downstream: ['MKT-DATA (Symbol Mapping)', 'TRADE-REC (LEI / Counterparty Validation)', 'REPORTING (Regulatory Taxonomy)'],
      bottleneck: 'Conflicting instrument masters cause weekly mapping breakages across ISIN, SEDOL, and tickers, blocking automated trade ingestion.',
    },
    fictionalMetrics: [
      { label: 'Reference masters', value: '3' },
      { label: 'Instruments covered', value: '~28,000' },
      { label: 'Mapping break frequency', value: '2–3/week' },
      { label: 'New instrument SLA', value: '3–5 days' },
    ],
  },
  {
    id: 'risk-calc',
    code: 'RISK-CALC',
    label: 'Risk Calculations',
    owner: 'Risk Management',
    description: 'VaR, stress testing, and scenario analysis. The risk engine pulls from 4 separate upstream data extracts — each with different cut-off times and quality controls.',
    painPoints: [
      'Risk engine reads from 4 separate upstream extracts — each with different vintage',
      'No single data contract between risk inputs and the data sources',
      'Stress scenario data manually maintained in spreadsheets',
      'Model validation team cannot independently reproduce risk calculations — no lineage',
    ],
    failureMode: 'Monthly VaR report submitted with inconsistent pricing vintage — discovered 2 days post-submission. Required a restatement letter to the board risk committee.',
    relationships: {
      upstream: ['MKT-DATA (Historical Curves)', 'PORTFOLIO (Positions Snapshot)', 'REF-DATA (Asset Class Definitions)'],
      downstream: ['Executive Risk Committee', 'Regulatory Stress Testing', 'Front Office Limit Monitors'],
      bottleneck: 'Pulls from 4 separate upstream extracts with mismatched vintages, creating irreproducible VaR calculations without data time travel.',
    },
    fictionalMetrics: [
      { label: 'Upstream extracts', value: '4' },
      { label: 'VaR models', value: '3' },
      { label: 'Stress scenarios', value: '47' },
      { label: 'Data vintage lag', value: 'Up to 3 hours' },
    ],
  },
  {
    id: 'reporting',
    code: 'REPORTING',
    label: 'Reporting',
    owner: 'Finance & Compliance',
    description: 'Regulatory (MiFID II, EMIR, AIFMD), management, and client reporting. 14 report types produced from 6 separate upstream systems with no shared data layer.',
    painPoints: [
      '14 report types each with their own data extraction logic — no shared layer',
      'Regulatory reports produced from systems that are not always consistent',
      'Client reports require manual data assembly from 4 sources',
      'Board pack preparation takes 3 days of analyst time each month',
    ],
    failureMode: 'Two regulatory reports submitted with inconsistent figures for the same metric in the same period — discovered during FCA review. Board notified.',
    relationships: {
      upstream: ['PORTFOLIO (Positions)', 'TRADE-REC (Execution Records)', 'RISK-CALC (VaR/Sensitivities)', 'REF-DATA (Classifications)'],
      downstream: ['FCA & ESMA Regulators', 'Board of Directors', 'Institutional Client Portal'],
      bottleneck: '14 statutory reports assembled by brittle custom scripts with zero column-level lineage back to the raw source ticks.',
    },
    fictionalMetrics: [
      { label: 'Report types', value: '14' },
      { label: 'Data sources', value: '6' },
      { label: 'Regulatory frameworks', value: '3' },
      { label: 'Board pack prep time', value: '3 days/month' },
    ],
  },
];

// ─── Scene 2: Requirements ────────────────────────────────────────────────────

export const REQUIREMENTS: Requirement[] = [
  // Unification
  {
    id: 'req-golden-position',
    category: 'unification',
    label: 'Single golden copy of position data',
    description: 'Unified, custodian-reconciled position view across all asset classes with intraday refresh.',
    clarifyingQuestion: {
      text: 'How critical is intraday position refresh?',
      options: ['Essential — need intraday updates', 'Important — end-of-day is acceptable for now', 'Nice to have — batch overnight is fine'],
    },
    mapsToCapabilities: ['cap-iceberg-acid', 'cap-schema-evolution', 'cap-spark-engine', 'cap-elastic-sql'],
  },
  {
    id: 'req-market-data-lineage',
    category: 'unification',
    label: 'Unified market data lineage',
    description: 'Traceable lineage from raw feed to risk calculation input, across all latency tiers.',
    clarifyingQuestion: {
      text: 'Do you need lineage to the tick level, or is daily-granularity sufficient?',
      options: ['Tick-level lineage required', 'Daily granularity is acceptable', 'Uncertain — to be defined in PoC'],
    },
    mapsToCapabilities: ['cap-iceberg-timetravel', 'cap-audit-logging', 'cap-iceberg-acid'],
  },
  {
    id: 'req-trade-reconciliation',
    category: 'unification',
    label: 'Automated T+1 trade reconciliation',
    description: 'Automated break detection and exception management across counterparty confirms and internal books.',
    clarifyingQuestion: {
      text: 'What is your target exception rate after automation?',
      options: ['Under 1% — near-zero breaks', 'Under 3% — significant reduction', 'Flexible — to be defined in PoC'],
    },
    mapsToCapabilities: ['cap-iceberg-acid', 'cap-spark-engine', 'cap-workflow-orchestration', 'cap-bloomberg-connector'],
  },
  {
    id: 'req-ref-data-unified',
    category: 'unification',
    label: 'Consolidated reference data with conflict resolution',
    description: 'Single master reference dataset from multiple sources with deterministic conflict resolution rules.',
    clarifyingQuestion: {
      text: 'Do you have conflict resolution rules defined, or does IOMETE need to help define them?',
      options: ['Rules are defined — need a platform to enforce them', 'Rules partially defined — need collaborative tooling', 'Rules not yet defined — need guidance'],
    },
    mapsToCapabilities: ['cap-iceberg-acid', 'cap-schema-evolution', 'cap-spark-engine'],
  },
  // Governance
  {
    id: 'req-rbac-desk',
    category: 'governance',
    label: 'Column and row-level access control by desk/role',
    description: 'Restrict data access at column and row granularity based on trading desk, role, and regulatory scope.',
    clarifyingQuestion: {
      text: 'How many distinct access control profiles do you anticipate?',
      options: ['Under 20 — relatively simple', '20–100 — moderate complexity', 'Over 100 — complex, hierarchical'],
    },
    mapsToCapabilities: ['cap-row-col-security', 'cap-rbac', 'cap-data-masking', 'cap-tag-classification'],
  },
  {
    id: 'req-audit-trail',
    category: 'governance',
    label: 'Complete audit trail for all data access',
    description: 'Immutable, queryable record of who accessed what data, when, and for what purpose.',
    clarifyingQuestion: {
      text: 'What is your minimum audit log retention requirement?',
      options: ['7 years (typical regulatory minimum)', '5 years', 'To be confirmed with compliance team'],
    },
    mapsToCapabilities: ['cap-audit-logging', 'cap-sovereign-deployment'],
  },
  {
    id: 'req-pii-masking',
    category: 'governance',
    label: 'PII masking for client-sensitive fields',
    description: 'Dynamic obfuscation of client identifiers, contact details, and sensitive financial data during query execution.',
    clarifyingQuestion: {
      text: 'Is PII primarily in client records, or also embedded in trade and position data?',
      options: ['Primarily in client records', 'Also embedded in trade/position data', 'Uncertain — needs data discovery exercise'],
    },
    mapsToCapabilities: ['cap-data-masking', 'cap-tag-classification', 'cap-row-col-security'],
  },
  {
    id: 'req-regulatory-lineage',
    category: 'governance',
    label: 'Regulatory reporting lineage (MiFID II, EMIR)',
    description: 'End-to-end traceable lineage supporting regulatory reporting submissions and audit responses.',
    clarifyingQuestion: {
      text: 'Which regulatory regimes are in scope for this PoC?',
      options: ['MiFID II transaction reporting only', 'MiFID II + EMIR', 'MiFID II + EMIR + AIFMD'],
    },
    mapsToCapabilities: ['cap-iceberg-timetravel', 'cap-audit-logging', 'cap-regulatory-cert'],
  },
  // Operational
  {
    id: 'req-data-sovereign',
    category: 'operational',
    label: 'Infrastructure within our security perimeter',
    description: "Platform must run entirely within Aurelia Capital's infrastructure. No data to vendor-managed cloud.",
    clarifyingQuestion: {
      text: 'What is your preferred deployment model?',
      options: ['On-premises data centre', 'Private cloud (our own cloud tenancy)', 'Hybrid — on-prem control plane, cloud compute'],
    },
    mapsToCapabilities: ['cap-sovereign-deployment', 'cap-encryption', 'cap-kms'],
  },
  {
    id: 'req-idp-integration',
    category: 'operational',
    label: 'Integration with Active Directory / SAML',
    description: 'Single sign-on using existing enterprise identity provider. No separate credential management.',
    clarifyingQuestion: {
      text: 'Which identity protocol does your IdP use?',
      options: ['SAML 2.0', 'OAuth 2.0 / OIDC', 'LDAP / Active Directory directly'],
    },
    mapsToCapabilities: ['cap-saml-ldap', 'cap-mfa'],
  },
  {
    id: 'req-cost-predictable',
    category: 'operational',
    label: 'Predictable infrastructure cost model',
    description: 'Avoid unpredictable query-based or egress-based billing. Prefer capacity-based pricing.',
    clarifyingQuestion: {
      text: 'What is your preferred commercial model?',
      options: ['Annual licence + infrastructure capex', 'Subscription + infrastructure opex', 'Flexible — open to discussion with vendor'],
    },
    mapsToCapabilities: ['cap-sovereign-deployment', 'cap-iomete-pricing'],
  },
  {
    id: 'req-spark-workloads',
    category: 'operational',
    label: 'Run Spark workloads without re-skilling',
    description: 'Existing data engineering team uses PySpark. Platform must support Spark natively without retraining.',
    clarifyingQuestion: {
      text: 'What is the current Spark experience level in your team?',
      options: ['Senior — production Spark pipelines in use today', 'Intermediate — some Spark experience, needs support', 'Beginner — would need training'],
    },
    mapsToCapabilities: ['cap-spark-engine', 'cap-workflow-orchestration', 'cap-elastic-sql'],
  },
];

// ─── IOMETE Capabilities (grounded, evidence-classified) ─────────────────────

export const IOMETE_CAPABILITIES: IometeCapability[] = [
  {
    id: 'cap-sovereign-deployment',
    label: 'Self-hosted / Data Sovereign Deployment',
    description: 'IOMETE runs entirely within your infrastructure — on-premises, private cloud, or your own public cloud tenancy on Kubernetes. Data never leaves your security perimeter.',
    evidenceState: 'supported',
    evidenceNote: 'Core positioning documented on iomete.com. The platform is explicitly architected for data sovereignty — self-hosted control plane and data plane, no vendor-managed data storage.',
    pocValidation: 'Deploy IOMETE on a private Kubernetes cluster in Aurelia\'s non-prod environment and verify zero outbound data connections to IOMETE infrastructure.',
  },
  {
    id: 'cap-iceberg-acid',
    label: 'Apache Iceberg ACID Transactions',
    description: 'All data is stored in Apache Iceberg format, providing full ACID transaction guarantees — consistent reads and writes even with concurrent pipeline activity.',
    evidenceState: 'supported',
    evidenceNote: 'Apache Iceberg is documented as the core table format. ACID transactions are an inherent property of Iceberg — explicitly stated in IOMETE documentation.',
    pocValidation: 'Run concurrent write and read workloads on position data; verify read-consistency and no dirty reads.',
  },
  {
    id: 'cap-iceberg-timetravel',
    label: 'Time Travel & Data Rollback',
    description: 'Query any historical version of a dataset using Iceberg snapshot management. Roll back tables to a previous state in the event of pipeline errors or incorrect data loads.',
    evidenceState: 'supported',
    evidenceNote: 'Time travel and rollback are documented IOMETE features, enabled by Apache Iceberg\'s snapshot-based architecture.',
    pocValidation: 'Load position data, simulate an incorrect update, then recover the prior state via time travel query. Verify lineage snapshot timestamp.',
  },
  {
    id: 'cap-schema-evolution',
    label: 'Schema Evolution Without Pipeline Breakage',
    description: 'Add, drop, or rename columns in Iceberg tables without breaking existing data pipelines or requiring expensive table rewrites.',
    evidenceState: 'supported',
    evidenceNote: 'Documented in IOMETE feature set as a core Iceberg benefit. Schema evolution is explicit in the platform\'s value proposition.',
  },
  {
    id: 'cap-row-col-security',
    label: 'Row-Level and Column-Level Security',
    description: 'Restrict data access at column granularity (hide sensitive fields) and row granularity (limit which records a user can see) based on role and identity.',
    evidenceState: 'supported',
    evidenceNote: 'Documented in IOMETE security features. Fine-grained access control at column and row level is explicitly stated, with Apache Ranger integration referenced.',
    pocValidation: 'Create two test users with different desk roles; verify one cannot see position rows for the other\'s desk, and cannot read masked PII columns.',
  },
  {
    id: 'cap-rbac',
    label: 'Role-Based Access Control (RBAC)',
    description: 'Centralised administration of user and group permissions across databases, tables, columns, and compute resources. Managed via a governance UI.',
    evidenceState: 'supported',
    evidenceNote: 'RBAC is explicitly documented in IOMETE\'s access control documentation, with a centralised admin UI described.',
  },
  {
    id: 'cap-data-masking',
    label: 'Dynamic Data Masking',
    description: 'Automatically obfuscate PII and sensitive financial data during query execution. The underlying data remains unmodified — masking is applied at query time based on the user\'s role.',
    evidenceState: 'supported',
    evidenceNote: 'Dynamic data masking is documented as a supported feature, with PII and financial data use cases explicitly mentioned.',
    pocValidation: 'Configure masking policy on client reference fields; verify that non-privileged analyst role receives obfuscated values while the data steward role receives clear values.',
  },
  {
    id: 'cap-tag-classification',
    label: 'Tag-Based Data Classification',
    description: 'Apply classification tags (e.g., PII, Confidential, Financial, Regulatory) to tables and columns. Access policies and masking rules are then applied uniformly to all tagged assets.',
    evidenceState: 'supported',
    evidenceNote: 'Tag-based policies and data classification are documented features in IOMETE\'s governance framework.',
  },
  {
    id: 'cap-audit-logging',
    label: 'Comprehensive Audit Logging',
    description: 'Detailed, immutable audit trail of all data access, query execution, and administrative actions. Audit logs are stored within your own infrastructure — you control retention and access.',
    evidenceState: 'supported',
    evidenceNote: 'Audit logging with user-controlled storage and retention is explicitly documented. The design principle of user-owned audit logs is core to IOMETE\'s sovereignty model.',
    pocValidation: 'Execute a series of queries as different test users; verify the audit log captures user identity, query text, data accessed, and timestamp.',
  },
  {
    id: 'cap-saml-ldap',
    label: 'SAML 2.0 / OAuth / LDAP Integration',
    description: 'Connect IOMETE to your existing enterprise identity provider using SAML 2.0, OAuth, or LDAP — enabling single sign-on without separate credential management.',
    evidenceState: 'supported',
    evidenceNote: 'SAML 2.0, OAuth, and LDAP integration are explicitly documented in IOMETE\'s authentication and IdP integration documentation.',
    pocValidation: 'Configure SAML integration with Aurelia\'s Active Directory Federation Services; verify SSO login flow and group-to-role mapping.',
  },
  {
    id: 'cap-mfa',
    label: 'Multi-Factor Authentication',
    description: 'Enforce MFA for all platform users as an additional authentication layer.',
    evidenceState: 'supported',
    evidenceNote: 'MFA support is documented in IOMETE\'s security capabilities.',
  },
  {
    id: 'cap-encryption',
    label: 'Encryption at Rest and in Transit',
    description: 'All data at rest is encrypted (AES). All communications — internal and external — are encrypted in transit via TLS.',
    evidenceState: 'supported',
    evidenceNote: 'Encryption at rest and TLS in transit are documented security features. Described as "military-grade encryption" in IOMETE security documentation.',
  },
  {
    id: 'cap-kms',
    label: 'Enterprise Key Management (KMS) Integration',
    description: 'Integration with enterprise key management systems for full lifecycle control over encryption keys.',
    evidenceState: 'supported',
    evidenceNote: 'KMS integration is documented in IOMETE\'s security feature set.',
    pocValidation: 'Verify IOMETE can integrate with Aurelia\'s existing HSM/KMS solution during PoC scoping call.',
  },
  {
    id: 'cap-spark-engine',
    label: 'Apache Spark Workload Execution',
    description: 'Apache Spark is the core processing engine. Data engineering teams can run PySpark, Scala Spark, and SparkSQL workloads without re-skilling.',
    evidenceState: 'supported',
    evidenceNote: 'Apache Spark is documented as the core processing engine throughout IOMETE\'s architecture documentation.',
    pocValidation: 'Run existing Aurelia PySpark reconciliation script against IOMETE Spark cluster; verify execution and output parity.',
  },
  {
    id: 'cap-elastic-sql',
    label: 'Elastic SQL Endpoints (Lakehouse Clusters)',
    description: 'Spin up isolated, dedicated SQL query endpoints tailored to specific teams, desks, or workloads. Prevents resource contention between departments.',
    evidenceState: 'supported',
    evidenceNote: 'Lakehouse clusters (elastic SQL endpoints) are a documented core feature, with per-team isolation as an explicit use case.',
  },
  {
    id: 'cap-workflow-orchestration',
    label: 'Workflow Orchestration (Prefect)',
    description: 'Native integration with Prefect for scheduling, monitoring, and managing dependency-aware Spark and data transformation pipelines.',
    evidenceState: 'supported',
    evidenceNote: 'Prefect-based workflow orchestration is documented in IOMETE\'s architecture as a native integration.',
    pocValidation: 'Schedule a daily reconciliation pipeline using IOMETE\'s orchestration; verify dependency tracking and failure alerting.',
  },
  {
    id: 'cap-storage-backends',
    label: 'Multiple Object Storage Backends',
    description: 'Supports S3, Azure Data Lake Storage Gen2, Google Cloud Storage, MinIO, and Dell ECS — providing flexibility for your infrastructure choice.',
    evidenceState: 'supported',
    evidenceNote: 'Multiple storage backends are documented. S3, Azure ADLS Gen2, GCS, MinIO, and Dell ECS are explicitly listed.',
  },
  {
    id: 'cap-ha',
    label: 'High Availability / Fault Tolerance',
    description: 'Kubernetes-native deployment provides inherent fault tolerance through pod rescheduling and cluster health management. Specific HA SLAs are not published.',
    evidenceState: 'assumed',
    evidenceNote: 'IOMETE runs on Kubernetes, which provides HA primitives. However, IOMETE has not published specific HA SLAs or uptime commitments. This is an architectural inference.',
    pocValidation: 'Test pod failure scenarios during PoC; validate recovery time and data consistency after simulated node failure.',
  },
  {
    id: 'cap-streaming',
    label: 'Real-Time Streaming Ingestion',
    description: 'Spark Streaming enables near-real-time data ingestion. IOMETE\'s primary positioning is batch and interactive analytics — streaming is possible but not a primary feature.',
    evidenceState: 'assumed',
    evidenceNote: 'Spark Streaming is an inherent capability of the Spark engine. However, IOMETE does not specifically position streaming as a primary feature. This is an architectural inference.',
    pocValidation: 'Test Spark Structured Streaming pipeline for a market data feed during PoC; validate latency and throughput characteristics.',
  },
  {
    id: 'cap-regulatory-cert',
    label: 'Financial Services Regulatory Certification',
    description: 'IOMETE mentions SOC 2 alignment. Specific financial-services certifications (FCA, SEC, MiFID II compliance attestations) have not been confirmed in publicly available documentation.',
    evidenceState: 'unknown',
    evidenceNote: 'SOC 2 is mentioned in general terms. FCA supervision, SEC compliance, or MiFID II-specific certifications are not confirmed in publicly available IOMETE documentation.',
    pocValidation: 'Request SOC 2 Type II report and any financial-services compliance attestations from IOMETE during vendor engagement.',
  },
  {
    id: 'cap-bloomberg-connector',
    label: 'Bloomberg / Reuters Native Connector',
    description: 'No native Bloomberg BLPAPI or Reuters Refinitiv connector is documented. Market data ingestion from these sources would require a custom Spark ingestion pipeline.',
    evidenceState: 'unknown',
    evidenceNote: 'No Bloomberg or Reuters/Refinitiv native connector is documented in IOMETE\'s feature set. Custom ingestion would be required.',
    pocValidation: 'Define the Bloomberg ingestion architecture in the PoC scoping phase; prototype a Spark-based BLPAPI consumer.',
  },
  {
    id: 'cap-iomete-pricing',
    label: 'Licence Pricing',
    description: 'IOMETE does not publish pricing. A vendor quote is required for any financial model. Infrastructure costs (Kubernetes, storage, compute) are within the customer\'s control.',
    evidenceState: 'unknown',
    evidenceNote: 'No public pricing information is available. Infrastructure costs are customer-controlled; IOMETE licence cost requires a vendor conversation.',
    pocValidation: 'Request indicative pricing from IOMETE for a deployment scaled to Aurelia\'s estimated data volume and user count.',
  },
  {
    id: 'cap-latency-benchmarks',
    label: 'Query Latency Benchmarks',
    description: 'No published query performance benchmarks for financial-services workloads. Latency depends on cluster sizing, data volume, and query complexity.',
    evidenceState: 'unknown',
    evidenceNote: 'IOMETE does not publish performance benchmarks. Latency characteristics must be validated empirically in a PoC.',
    pocValidation: 'Define latency acceptance criteria for end-of-day risk queries and validate against IOMETE during PoC.',
  },
];

// ─── Scene 4: Difficult Questions ─────────────────────────────────────────────

export const DIFFICULT_QUESTIONS: DifficultQuestion[] = [
  // Security
  {
    id: 'dq-data-perimeter',
    pillar: 'security',
    question: 'Does any data ever leave our infrastructure?',
    answer: 'No. IOMETE\'s architecture is explicitly designed for data sovereignty. Both the data plane (where data is processed and stored) and the control plane (governance, RBAC, audit) can be self-hosted. Data never leaves your infrastructure.',
    evidenceState: 'supported',
    evidenceNote: 'This is a core, documented design principle: "zero data exfiltration" and "self-hosted control plane" are explicit IOMETE architecture claims.',
  },
  {
    id: 'dq-encryption',
    pillar: 'security',
    question: 'What encryption standards are in use?',
    answer: 'AES encryption at rest for all stored data. TLS encryption in transit for all internal and external communications. Integration with enterprise KMS for key lifecycle management.',
    evidenceState: 'supported',
    evidenceNote: 'Documented in IOMETE security features. AES at rest, TLS in transit, and KMS integration are all explicitly stated.',
  },
  {
    id: 'dq-desk-isolation',
    pillar: 'security',
    question: 'How do we ensure a rates desk analyst cannot see equities positions?',
    answer: 'Row-level security (RLS) allows policies to restrict which rows a user can query based on their identity or role. Combined with column-level security, a rates desk user would receive only their desk\'s position rows, with sensitive cross-desk columns masked.',
    evidenceState: 'supported',
    evidenceNote: 'Row-level security and column-level security are documented features. Desk-based isolation is a standard use case for RLS.',
    pocValidation: 'Configure RLS policies and validate desk isolation with test user accounts in PoC.',
  },
  // Governance
  {
    id: 'dq-mifid-lineage',
    pillar: 'governance',
    question: 'Can we produce complete data lineage for MiFID II reporting?',
    answer: 'IOMETE\'s Iceberg metadata and audit logging provide the raw lineage evidence — every data version, transformation, and access event is captured. However, assembling this into MiFID II-specific lineage reports requires implementation work; IOMETE does not ship a pre-built MiFID II lineage module.',
    evidenceState: 'assumed',
    evidenceNote: 'Iceberg time travel and audit logging create the raw materials for lineage. A MiFID II-specific lineage view would require custom implementation on top of these capabilities.',
    pocValidation: 'Build a prototype MiFID II lineage trace from a test transaction to its final report value using IOMETE\'s audit and snapshot APIs.',
  },
  {
    id: 'dq-audit-retention',
    pillar: 'governance',
    question: 'Who controls how long audit logs are retained?',
    answer: 'You do. Audit logs are stored in your own infrastructure — IOMETE does not manage or have access to them. Retention period, storage location, and access controls are defined and owned by Aurelia Capital.',
    evidenceState: 'supported',
    evidenceNote: 'Documented: "Organizations dictate where logs are stored, who can access them, and their retention periods." — IOMETE security documentation.',
  },
  {
    id: 'dq-soc2',
    pillar: 'governance',
    question: 'Is IOMETE SOC 2 certified? Does this cover financial services requirements?',
    answer: 'SOC 2 alignment is mentioned in IOMETE materials, but the type (Type I vs Type II), scope, and audit date are not publicly confirmed. Financial-services-specific certifications (FCA, SEC, MiFID II attestations) are not documented.',
    evidenceState: 'unknown',
    evidenceNote: 'SOC 2 is referenced in general terms. Specific scope and type are not confirmed publicly. FS-specific certifications are not documented.',
    pocValidation: 'Request SOC 2 Type II certificate and any FS-specific compliance evidence directly from IOMETE as a pre-PoC requirement.',
  },
  // Integration
  {
    id: 'dq-bloomberg',
    pillar: 'integration',
    question: 'How does IOMETE ingest our Bloomberg and Reuters market data feeds?',
    answer: 'IOMETE does not have a native Bloomberg BLPAPI or Reuters Refinitiv connector. Market data ingestion would require a custom Spark Structured Streaming or batch ingestion pipeline that reads from your Bloomberg terminal or data distribution layer and writes to Iceberg tables.',
    evidenceState: 'unknown',
    evidenceNote: 'No Bloomberg or Refinitiv native connector is documented. Custom ingestion is the expected path.',
    pocValidation: 'Design and prototype a Bloomberg BLPAPI-to-Iceberg ingestion pipeline as part of the PoC scope.',
  },
  {
    id: 'dq-hive-migration',
    pillar: 'integration',
    question: 'Can IOMETE replace our existing Hive metastore?',
    answer: 'Yes. IOMETE is compatible with Hive Metastore and also supports Apache Iceberg catalog as a modern alternative. Existing Hive-format tables can be migrated, and the Hive metastore can be used during transition.',
    evidenceState: 'supported',
    evidenceNote: 'Hive Metastore compatibility and Iceberg catalog support are documented IOMETE features.',
  },
  {
    id: 'dq-dq-engine',
    pillar: 'quality',
    question: 'Does IOMETE include a native data quality engine?',
    answer: 'No native data quality engine is documented. Data quality checks can be implemented as Spark jobs within IOMETE\'s orchestration layer, and ACID transactions prevent corrupted writes. However, a dedicated DQ framework (e.g., Great Expectations, Soda) would need to be integrated separately.',
    evidenceState: 'assumed',
    evidenceNote: 'IOMETE does not document a native DQ engine. Spark-based DQ patterns are possible but not a specific IOMETE feature claim.',
    pocValidation: 'Evaluate integration of an open-source DQ framework with IOMETE\'s Spark environment during PoC.',
  },
  {
    id: 'dq-k8s-overhead',
    pillar: 'operations',
    question: 'What Kubernetes expertise do we need to run IOMETE?',
    answer: 'IOMETE is Kubernetes-native and requires a capable K8s operational team or managed K8s service. The level of expertise depends on deployment complexity. This is not a lightweight deployment — it is a production-grade data platform on K8s. Specific staffing guidance is not published.',
    evidenceState: 'unknown',
    evidenceNote: 'Kubernetes is the foundational deployment platform. Operational requirements beyond "K8s expertise needed" are not specifically documented by IOMETE.',
    pocValidation: 'Assess internal K8s capability gap during PoC scoping; consider whether a managed K8s service (EKS, AKS, GKE on private cloud) reduces operational burden.',
  },
  {
    id: 'dq-pricing',
    pillar: 'operations',
    question: 'What does IOMETE cost?',
    answer: 'No public pricing exists. Infrastructure costs (K8s clusters, object storage, compute) are within Aurelia Capital\'s control and can be estimated. The IOMETE licence cost requires a direct vendor conversation.',
    evidenceState: 'unknown',
    evidenceNote: 'No public pricing is available. Infrastructure costs are deterministic from deployment size; licence pricing requires vendor engagement.',
    pocValidation: 'Request indicative pricing (per node, per user, or flat licence) from IOMETE as a pre-PoC condition.',
  },
  {
    id: 'dq-poc-timeline',
    pillar: 'operations',
    question: 'How long before we see PoC value?',
    answer: 'No IOMETE-specific PoC timeline is published. Based on comparable data lakehouse deployments, an 8–12 week PoC is typical for a scoped, single use-case proof. Time to first meaningful data is typically 2–3 weeks after infrastructure setup.',
    evidenceState: 'assumed',
    evidenceNote: 'IOMETE does not publish PoC timelines. The 8–12 week estimate is based on comparable platform deployments and is labelled as an assumption.',
    pocValidation: 'Agree a specific PoC timeline and milestone schedule with IOMETE during vendor engagement.',
  },
];

// ─── Scene 5: Executive Committee ─────────────────────────────────────────────

export const EXECUTIVES: Executive[] = [
  {
    id: 'cfo',
    name: 'Priya Okonkwo',
    title: 'Chief Financial Officer',
    tagline: '"Show me the number and the risk."',
    concerns: [
      'Total cost of ownership vs. Snowflake or Databricks SaaS',
      'Unknown IOMETE licence cost makes business case incomplete',
      'PoC infrastructure investment before commercial terms are agreed',
      'Risk of sunk-cost escalation if PoC leads to an over-priced licence',
    ],
    iometeAddresses: [
      { point: 'Infrastructure cost is within Aurelia\'s control — no egress fees, no vendor compute markup', evidenceState: 'supported' },
      { point: 'Open table format (Iceberg) prevents proprietary lock-in — migration cost risk is lower', evidenceState: 'supported' },
      { point: 'Kubernetes-based scaling means cost tracks actual usage, not platform minimums', evidenceState: 'assumed' },
    ],
    iometeDoesNot: [
      'No published pricing — licence cost is unknown',
      'PoC infrastructure investment is real (Kubernetes cluster, engineering time)',
      'No public benchmark to compare TCO against Snowflake or Databricks',
    ],
    committeeQuestion: 'What is the maximum PoC budget, and what TCO ceiling makes this commercially viable?',
  },
  {
    id: 'ciso',
    name: 'James Whitfield',
    title: 'Chief Information Security Officer',
    tagline: '"Data sovereignty is non-negotiable."',
    concerns: [
      'Sensitive trading data must not leave our infrastructure — ever',
      'Vendor security posture must be independently audited (SOC 2)',
      'Regulatory implications of a third-party platform holding metadata',
      'Privileged access management during deployment and maintenance',
    ],
    iometeAddresses: [
      { point: 'Self-hosted architecture — data and control plane both within our perimeter', evidenceState: 'supported' },
      { point: 'Zero data exfiltration by design — IOMETE does not receive or store our data', evidenceState: 'supported' },
      { point: 'SAML 2.0 / LDAP integration with our Active Directory', evidenceState: 'supported' },
      { point: 'AES at rest, TLS in transit, KMS integration for key management', evidenceState: 'supported' },
    ],
    iometeDoesNot: [
      'SOC 2 Type II certificate not publicly confirmed — must be obtained from vendor',
      'FCA/SEC compliance attestation not documented',
      'Vendor access policy during deployment is not documented',
    ],
    committeeQuestion: 'Can IOMETE provide a SOC 2 Type II report and clarify privileged access procedures before we proceed?',
  },
  {
    id: 'cto',
    name: 'Sunita Rao',
    title: 'Chief Technology Officer',
    tagline: '"We cannot afford another integration nightmare."',
    concerns: [
      'Kubernetes operational burden on an already stretched infrastructure team',
      'Gap in Bloomberg / Reuters native connectors means custom ingestion build',
      'Migration path from existing Hive warehouse and ETL pipelines',
      'Team skill readiness — K8s operators, Iceberg migration expertise',
    ],
    iometeAddresses: [
      { point: 'Apache Spark is the core engine — existing PySpark pipelines run natively', evidenceState: 'supported' },
      { point: 'Hive Metastore compatible — migration path exists for existing tables', evidenceState: 'supported' },
      { point: 'Open standards (Iceberg, Spark) — no proprietary API lock-in', evidenceState: 'supported' },
      { point: 'Prefect orchestration — can replace or sit alongside existing schedulers', evidenceState: 'supported' },
    ],
    iometeDoesNot: [
      'No native Bloomberg BLPAPI or Reuters Refinitiv connector — custom Spark ingestion required',
      'Kubernetes operations require internal expertise or a managed K8s service',
      'No documented Kubernetes staffing model or operational runbook',
    ],
    committeeQuestion: 'What is our realistic internal K8s capacity, and should we use a managed service to de-risk the PoC?',
  },
  {
    id: 'cro',
    name: 'Marcus Chen',
    title: 'Chief Risk Officer',
    tagline: '"The regulator will ask us about lineage."',
    concerns: [
      'MiFID II requires complete, auditable lineage from data source to transaction report',
      'Risk calculation inputs must be traceable and provably consistent',
      'Position data must have a single, defensible golden source',
      'Any platform change must not introduce new data quality risks during transition',
    ],
    iometeAddresses: [
      { point: 'Iceberg time travel — every historical version of data is queryable and traceable', evidenceState: 'supported' },
      { point: 'ACID transactions — concurrent writes do not produce inconsistent reads', evidenceState: 'supported' },
      { point: 'Complete audit logging — every access and transformation is recorded', evidenceState: 'supported' },
      { point: 'Data sovereignty ensures audit logs remain within our control', evidenceState: 'supported' },
    ],
    iometeDoesNot: [
      'No pre-built MiFID II lineage reporting module — requires custom implementation',
      'No native data quality engine — DQ checks must be built using Spark',
      'MiFID II-specific compliance attestation not documented',
    ],
    committeeQuestion: 'Can we scope the PoC to produce a single MiFID II lineage trace as the primary success criterion?',
  },
];

// ─── Scene 6: Financial Model Defaults ────────────────────────────────────────

export const DEFAULT_INFRASTRUCTURE_COSTS: EditableField[] = [
  { id: 'k8s-cluster', label: 'Kubernetes cluster (annual estimate)', value: 180000, note: 'Estimate based on 3-node production cluster. Varies by cloud/on-prem.' },
  { id: 'object-storage', label: 'Object storage (annual estimate)', value: 24000, note: 'Estimate for ~50TB. Varies by data volume and storage tier.' },
  { id: 'ops-engineering', label: 'Platform operations engineering (annual estimate)', value: 120000, note: 'Estimate for ~0.5 FTE senior engineer. Varies by internal rates.' },
  { id: 'iomete-licence', label: 'IOMETE licence fee', value: 0, isUnknown: true, note: 'Vendor quote required. Not estimable without vendor engagement.' },
];

export const DEFAULT_CURRENT_STATE_COSTS: EditableField[] = [
  { id: 'dw-licences', label: 'Existing data warehouse licences (annual)', value: 340000, note: 'Fictional estimate for Aurelia Capital. Replace with actual figure.' },
  { id: 'egress-fees', label: 'Cloud data egress fees (annual)', value: 48000, note: 'Estimate based on ~50TB/month egress. Replace with actual figure.' },
  { id: 'manual-recon', label: 'Manual reconciliation (FTE cost, annual)', value: 95000, note: 'Estimate for 1 FTE operations analyst dedicated to manual breaks.' },
  { id: 'regulatory-risk', label: 'Regulatory breach risk provision (annual)', value: 50000, note: 'Internal risk provision. Actual cost depends on regulatory exposure.' },
];

export const DEFAULT_POC_INVESTMENT: EditableField[] = [
  { id: 'poc-infra', label: 'PoC infrastructure setup (one-time)', value: 40000, note: 'Non-production K8s environment. Estimate only.' },
  { id: 'poc-engineering', label: 'Engineering time — 8 weeks (estimate)', value: 64000, note: 'Estimate for 2 engineers × 8 weeks at £4k/week blended rate.' },
  { id: 'poc-vendor', label: 'Vendor engagement and support', value: 8000, note: 'Estimate for vendor onboarding, solution architecture, and support.' },
];

// ─── Scene 6: PoC Plan ────────────────────────────────────────────────────────

export const DEFAULT_POC_PLAN: PocWeek[] = [
  {
    weekRange: 'Weeks 1–2',
    tasks: [
      'Infrastructure setup: private Kubernetes cluster provisioned',
      'IOMETE deployed and configured in non-production environment',
      'SAML integration with Active Directory configured and tested',
      'Team onboarding and access provisioning',
    ],
  },
  {
    weekRange: 'Weeks 3–4',
    tasks: [
      'Ingest synthetic trade and portfolio position data into Iceberg tables',
      'Validate ACID transactions: concurrent write and read consistency',
      'Test schema evolution: add columns without breaking existing pipelines',
      'Validate time travel: query historical position snapshots',
    ],
  },
  {
    weekRange: 'Weeks 5–6',
    tasks: [
      'Configure RBAC policies: desk-level isolation for equities vs. rates',
      'Apply row-level security: validate cross-desk data isolation',
      'Configure dynamic data masking: PII fields for non-privileged roles',
      'Validate audit logging: verify complete access trail for all test queries',
    ],
  },
  {
    weekRange: 'Weeks 7–8',
    tasks: [
      'Prototype MiFID II lineage trace from test transaction to report',
      'Run batch reconciliation pipeline using existing PySpark logic',
      'Validate Prefect orchestration: schedule and monitor pipeline',
      'Stakeholder demo: CRO, CISO, CTO review PoC findings',
    ],
  },
];

