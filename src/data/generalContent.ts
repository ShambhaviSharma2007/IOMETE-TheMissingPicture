import type {
  SetupChallenge,
  DesiredOutcome,
  IometeCapability,
  EvaluationQuestion,
  CostField,
  EvaluationPlanItem,
} from "../types";

// ─── Step 2: Setup Challenges (General Purpose) ──────────────────────────────

export const SETUP_CHALLENGES: SetupChallenge[] = [
  {
    id: "siloed-systems",
    title: "Data spread across multiple systems",
    description:
      "Data is scattered across systems with no single place to access it.",
    commonExamples:
      "Postgres, S3, Snowflake, and vendor APIs kept in separate silos.",
  },
  {
    id: "hard-to-combine",
    title: "Difficulty combining and reconciling data",
    description:
      "Fragile scripts make it hard to combine data and keep figures consistent.",
    commonExamples:
      "Finance and Operations report different totals due to mismatched data.",
  },
  {
    id: "slow-preparation",
    title: "Slow data preparation or heavy query latency",
    description:
      "Slow data preparation and queries delay reporting and decisions.",
    commonExamples: "Overnight pipelines run late, or large queries time out.",
  },
  {
    id: "security-governance",
    title: "Access control and security compliance friction",
    description:
      "Privacy and compliance rules make secure data sharing difficult.",
    commonExamples:
      "Data must stay in your cloud, or sensitive fields need masking.",
  },
  {
    id: "high-operating-costs",
    title: "High or unpredictable operating costs",
    description:
      "Warehouse and compute costs rise unpredictably as usage grows.",
    commonExamples:
      "Unexpected compute bills, warehouse credits, or data transfer fees.",
  },
  {
    id: "unreliable-data",
    title: "Difficulty maintaining reliable, versioned data",
    description:
      "Pipeline errors and schema changes can corrupt data or break reports.",
    commonExamples:
      "A column change breaks dashboards, or a failed load overwrites good data.",
  },
];

// ─── Step 3: Desired Outcomes ────────────────────────────────────────────────

export const DESIRED_OUTCOMES: DesiredOutcome[] = [
  {
    id: "outcome-unify",
    title: "Bring data together into a single open layer",
    description:
      "Give every team one trusted lakehouse for consistent data access.",
    plainGoal:
      "Break down silos without duplicating data or locking into a vendor.",
    mapsToCapabilityIds: [
      "cap-iceberg-storage",
      "cap-spark-engine",
      "cap-lakehouse-clusters",
    ],
  },
  {
    id: "outcome-query-speed",
    title: "Make data easier and faster to analyze",
    description:
      "Provide elastic SQL endpoints and fast interactive query capabilities for BI tools, notebooks, and applications.",
    plainGoal:
      "Give analysts and engineers reliable query performance without resource contention between departments.",
    mapsToCapabilityIds: [
      "cap-lakehouse-clusters",
      "cap-spark-connect",
      "cap-bi-integration",
    ],
  },
  {
    id: "outcome-security",
    title: "Improve access control, masking, and privacy",
    description:
      "Enforce fine-grained row and column security, dynamic masking of sensitive fields, and role-based access.",
    plainGoal:
      "Ensure users see only what their role permits, with automatic obfuscation of sensitive personal or commercial details.",
    mapsToCapabilityIds: [
      "cap-fine-grained-access",
      "cap-dynamic-masking",
      "cap-tag-governance",
      "cap-sso-idp",
    ],
  },
  {
    id: "outcome-sovereignty",
    title: "Keep data inside our own infrastructure boundary",
    description:
      "Deploy completely inside your private cloud tenancy, on-premises data centre, or VPC with zero vendor data exfiltration.",
    plainGoal:
      "Satisfy strict data residency, privacy, and sovereignty laws by ensuring third-party SaaS vendors never hold your data.",
    mapsToCapabilityIds: [
      "cap-self-hosted-perimeter",
      "cap-audit-telemetry",
      "cap-encryption-kms",
    ],
  },
  {
    id: "outcome-reliability",
    title: "Improve data reliability, rollback, and consistency",
    description:
      "Guarantee ACID transactions, safe schema evolution, and historical time-travel to reproduce any past snapshot.",
    plainGoal:
      "Prevent corrupted data, allow safe rollbacks if a pipeline fails, and provide bulletproof historical audits.",
    mapsToCapabilityIds: [
      "cap-iceberg-storage",
      "cap-time-travel",
      "cap-schema-evolution",
    ],
  },
  {
    id: "outcome-cost-control",
    title: "Reduce operating costs and prevent vendor lock-in",
    description:
      "Leverage cost-effective object storage and open-source table formats (Apache Iceberg) with transparent compute scaling.",
    plainGoal:
      "Pay only for actual Kubernetes compute and commodity storage, avoiding proprietary consumption credit markups.",
    mapsToCapabilityIds: [
      "cap-self-hosted-perimeter",
      "cap-lakehouse-clusters",
      "cap-object-storage",
    ],
  },
];

// ─── Step 4: IOMETE Verified Capabilities ────────────────────────────────────

export const IOMETE_CAPABILITIES: IometeCapability[] = [
  {
    id: "cap-self-hosted-perimeter",
    name: "Self-Hosted / Data Sovereign Architecture",
    category: "security",
    plainSummary:
      "IOMETE runs in your Kubernetes environment, keeping its data and control planes inside your security boundary.",
    whyItMatters:
      "Your data stays in your infrastructure, reducing exposure to third parties.",
    evidenceState: "supported",
    evidenceSource: {
      title: "IOMETE Architecture & Data Sovereignty Documentation",
      citation:
        "Documented core deployment model: zero data exfiltration, self-hosted control plane, deployed via standard Helm charts on Kubernetes.",
    },
    limitations:
      "Requires your organization to provide or manage a Kubernetes cluster and associated object storage (S3, ADLS, or MinIO).",
    confirmationNeeded:
      "Confirm your infrastructure team has a provisioned Kubernetes namespace and object storage bucket.",
    tagKeywords: ["security", "sovereignty", "compliance", "deployment"],
  },
  {
    id: "cap-iceberg-storage",
    name: "Open Table Format (Apache Iceberg ACID)",
    category: "storage",
    plainSummary:
      "Apache Iceberg tables support reliable concurrent reads and writes using an open standard.",
    whyItMatters: "Keep data in your storage and reduce proprietary lock-in.",
    evidenceState: "supported",
    evidenceSource: {
      title: "IOMETE Lakehouse Storage Specification",
      citation:
        "Documented table architecture powered by Apache Iceberg with native metadata catalogs and ACID consistency guarantees.",
    },
    limitations:
      "Workloads must read and write through Iceberg catalogs rather than raw uncoordinated file dumps.",
    confirmationNeeded:
      "Validate pipeline compatibility for reading and writing to Iceberg tables.",
    tagKeywords: ["reliability", "storage", "unify", "lock-in"],
  },
  {
    id: "cap-time-travel",
    name: "Data Time-Travel & Snapshot Rollback",
    category: "storage",
    plainSummary: "Query or restore a table from a past snapshot.",
    whyItMatters: "Recover from bad changes and simplify audits.",
    evidenceState: "supported",
    evidenceSource: {
      title: "IOMETE Iceberg Catalog & Snapshot Guide",
      citation:
        "Documented capability allowing historical SQL query syntax (e.g. TIMESTAMP AS OF) and table rollback.",
    },
    limitations:
      "Historical snapshots consume storage based on your configured retention and compaction policies.",
    confirmationNeeded:
      "Determine desired retention duration (e.g. 30 days, 1 year) for historical table snapshots.",
    tagKeywords: ["reliability", "rollback", "audit"],
  },
  {
    id: "cap-schema-evolution",
    name: "Safe Schema Evolution Without Pipeline Breaks",
    category: "storage",
    plainSummary: "Change table columns without rewriting historical data.",
    whyItMatters: "Adapt schemas with less risk of disrupting reports.",
    evidenceState: "supported",
    evidenceSource: {
      title: "IOMETE Apache Iceberg Features",
      citation:
        "Documented schema evolution operations handled as metadata updates without expensive table rewrites.",
    },
    limitations:
      "Certain complex type conversions may require data migration scripts.",
    confirmationNeeded:
      "Test schema alteration on a sample table during initial proof of concept.",
    tagKeywords: ["reliability", "data-ops"],
  },
  {
    id: "cap-lakehouse-clusters",
    name: "Dedicated Elastic SQL Clusters (Compute Isolation)",
    category: "compute",
    plainSummary: "Give teams separate SQL clusters that scale with demand.",
    whyItMatters: "Isolate workloads so heavy queries do not slow other teams.",
    evidenceState: "supported",
    evidenceSource: {
      title: "IOMETE Lakehouse Clusters Management",
      citation:
        "Documented multi-cluster compute isolation running on containerized Kubernetes workers with auto-scaling.",
    },
    limitations:
      "Compute performance depends on the underlying VM / instance sizes assigned to the Kubernetes node pools.",
    confirmationNeeded:
      "Size node pools according to anticipated concurrent user count and dataset scale.",
    tagKeywords: ["query-speed", "cost-control", "compute"],
  },
  {
    id: "cap-spark-engine",
    name: "Native Apache Spark Processing Engine",
    category: "compute",
    plainSummary:
      "Apache Spark powers data processing, batch transformations, and machine learning.",
    whyItMatters: "Teams can reuse existing Spark skills and code.",
    evidenceState: "supported",
    evidenceSource: {
      title: "IOMETE Engine Specification",
      citation:
        "Documented Spark execution runtime powering SQL endpoints, batch pipelines, and notebook integrations.",
    },
    limitations:
      "Teams unfamiliar with distributed compute concepts may require standard Spark tuning for very large data volumes.",
    confirmationNeeded:
      "Review team comfort with PySpark / SQL vs proprietary ETL tools.",
    tagKeywords: ["unify", "engineering", "analytics"],
  },
  {
    id: "cap-fine-grained-access",
    name: "Row-Level and Column-Level Access Control",
    category: "security",
    plainSummary: "Control which rows and columns each user can see.",
    whyItMatters:
      "Share tables across teams while limiting sensitive data access.",
    evidenceState: "supported",
    evidenceSource: {
      title: "IOMETE Security & Access Control Guide",
      citation:
        "Documented centralized RBAC with fine-grained column-level and row-level filtering policies.",
    },
    limitations: "Policies must be defined and mapped to group memberships.",
    confirmationNeeded:
      "List your organization’s role categories and test access isolation with sample accounts.",
    tagKeywords: ["security", "governance", "privacy"],
  },
  {
    id: "cap-dynamic-masking",
    name: "Dynamic Data Masking (PII Protection)",
    category: "security",
    plainSummary: "Mask sensitive fields in query results based on the user.",
    whyItMatters: "Let teams use data while protecting personal information.",
    evidenceState: "supported",
    evidenceSource: {
      title: "IOMETE Dynamic Data Masking Docs",
      citation:
        "Documented policy-driven masking functions applied dynamically at query runtime without modifying storage files.",
    },
    limitations:
      "Only applies to queries routed through IOMETE endpoints; raw storage files must be protected via KMS encryption.",
    confirmationNeeded: "Confirm which data fields require automatic masking.",
    tagKeywords: ["security", "privacy", "pii"],
  },
  {
    id: "cap-tag-governance",
    name: "Tag-Based Policy Management",
    category: "governance",
    plainSummary: "Apply access policies to data using classification tags.",
    whyItMatters: "Manage security consistently as your catalog grows.",
    evidenceState: "supported",
    evidenceSource: {
      title: "IOMETE Governance & Metadata Management",
      citation:
        "Documented tag-based security policies for uniform data asset categorization.",
    },
    limitations:
      "Requires teams to follow tagging conventions during table creation.",
    confirmationNeeded:
      "Establish enterprise tagging schema (e.g. Confidential, Public, Sensitive).",
    tagKeywords: ["governance", "compliance"],
  },
  {
    id: "cap-audit-telemetry",
    name: "Complete, Self-Hosted Audit Trails",
    category: "governance",
    plainSummary:
      "Keep an immutable record of queries, access, and policy changes in your infrastructure.",
    whyItMatters: "Support audits while keeping logs under your control.",
    evidenceState: "supported",
    evidenceSource: {
      title: "IOMETE Audit & Compliance Logging",
      citation:
        "Documented customer-owned audit logging with configurable retention periods and direct log query access.",
    },
    limitations:
      "Audit log storage must be allocated inside your infrastructure.",
    confirmationNeeded:
      "Determine log retention requirement (e.g. 1 year, 7 years).",
    tagKeywords: ["compliance", "audit", "security"],
  },
  {
    id: "cap-sso-idp",
    name: "Enterprise Single Sign-On (SAML / OAuth / LDAP)",
    category: "security",
    plainSummary: "Connect your identity provider for single sign-on and MFA.",
    whyItMatters: "Use existing credentials and manage access centrally.",
    evidenceState: "supported",
    evidenceSource: {
      title: "IOMETE Identity Integration Documentation",
      citation: "Documented SAML 2.0, OAuth 2.0, and LDAP identity federation.",
    },
    limitations:
      "Requires an IdP administrator to configure SAML claims and group mappings.",
    confirmationNeeded:
      "Confirm identity protocol (SAML 2.0 vs OIDC) used by your security team.",
    tagKeywords: ["security", "sso"],
  },
  {
    id: "cap-object-storage",
    name: "Multi-Cloud Object Storage Integration",
    category: "storage",
    plainSummary:
      "Connect to AWS, Azure, Google Cloud, or compatible object storage.",
    whyItMatters: "Choose storage that fits your infrastructure and budget.",
    evidenceState: "supported",
    evidenceSource: {
      title: "IOMETE Storage Abstraction Layer",
      citation:
        "Documented S3, ADLS Gen2, GCS, and S3-compatible MinIO integrations.",
    },
    limitations:
      "Network bandwidth between compute nodes and object storage affects heavy query speeds.",
    confirmationNeeded:
      "Verify network latency between Kubernetes worker nodes and storage buckets.",
    tagKeywords: ["storage", "cost-control"],
  },
  {
    id: "cap-ha-architecture",
    name: "High Availability & Fault Recovery",
    category: "compute",
    plainSummary:
      "Kubernetes can reschedule containers when a worker node fails.",
    whyItMatters: "Help reduce downtime and manual recovery work.",
    evidenceState: "assumed",
    evidenceSource: {
      title: "Architectural Inference from Kubernetes Foundation",
      citation:
        "Assumed based on containerized Kubernetes orchestration. Specific financial-grade multi-region 99.999% SLAs are not publicly published.",
    },
    limitations:
      "Multi-region failover requires multi-cluster Kubernetes federation, which adds operational setup.",
    confirmationNeeded:
      "Clarify with IOMETE whether your use case requires single-cluster or active-active multi-region HA.",
    tagKeywords: ["reliability", "ha"],
  },
  {
    id: "cap-streaming-ingestion",
    name: "Near Real-Time Data Streaming Ingestion",
    category: "integration",
    plainSummary:
      "Process Kafka, Kinesis, or RabbitMQ streams into Iceberg tables in micro-batches.",
    whyItMatters: "Combine streaming events with batch analytics.",
    evidenceState: "assumed",
    evidenceSource: {
      title: "Spark Engine Capability",
      citation:
        "Spark Structured Streaming is a native capability of Apache Spark. However, sub-second continuous streaming is not IOMETE’s primary advertised niche.",
    },
    limitations:
      "Micro-batch latency is typically 5–30 seconds; not designed for microsecond algorithmic trading.",
    confirmationNeeded:
      "Validate if micro-batch latency (<15 seconds) satisfies your real-time requirements.",
    tagKeywords: ["integration", "streaming"],
  },
  {
    id: "cap-proprietary-connectors",
    name: "Specialized / Proprietary Third-Party Connectors",
    category: "integration",
    plainSummary: "Niche systems may need custom PySpark or JDBC pipelines.",
    whyItMatters:
      "Specialized vendor systems may not have ready-made connectors.",
    evidenceState: "unknown",
    evidenceSource: {
      title: "Integrations Catalog Review",
      citation:
        "Standard open connectors documented; proprietary vendor application integrations must be built using custom Spark readers.",
    },
    limitations:
      "Requires custom integration scripts for bespoke upstream feeds.",
    confirmationNeeded:
      "Identify custom data feeds and scope PySpark ingestion scripts during PoC.",
    tagKeywords: ["integration", "connectors"],
  },
  {
    id: "cap-pricing-commercials",
    name: "Platform Licence & Commercial Pricing",
    category: "compute",
    plainSummary: "Pricing is quoted based on platform size and support needs.",
    whyItMatters:
      "You control infrastructure costs; request a quote for licensing.",
    evidenceState: "unknown",
    evidenceSource: {
      title: "Commercial Model",
      citation:
        "No public pricing catalog exists. Fixed or capacity-based pricing must be requested directly from IOMETE.",
    },
    limitations: "Accurate TCO calculation requires direct vendor engagement.",
    confirmationNeeded:
      "Request indicative pricing quote scaled to your anticipated node and user count.",
    tagKeywords: ["cost-control", "pricing"],
  },
];

// ─── Step 5: Financial Model Defaults ────────────────────────────────────────

export const DEFAULT_CURRENT_COSTS: CostField[] = [
  {
    id: "curr-warehouse",
    label: "Existing cloud warehouse / database licences (Annual)",
    value: 18000000,
    notes:
      "e.g. Snowflake credits, Redshift nodes, or SQL Server enterprise licences",
  },
  {
    id: "curr-egress",
    label: "Cloud data transfer & egress fees (Annual)",
    value: 2400000,
    notes: "Data movement fees between cloud regions or vendor silos",
  },
  {
    id: "curr-maintenance",
    label: "Manual maintenance & pipeline break triage (Annual FTE)",
    value: 6500000,
    notes: "Engineering and operations time spent fixing brittle ETL pipelines",
  },
];

export const DEFAULT_PROPOSED_COSTS: CostField[] = [
  {
    id: "prop-k8s",
    label: "Kubernetes compute cluster (Annual estimate)",
    value: 8500000,
    notes: "Raw cloud compute instances (e.g. 3–5 dedicated worker nodes)",
  },
  {
    id: "prop-storage",
    label: "Commodity object storage (Annual estimate)",
    value: 1500000,
    notes: "Cost of S3 / ADLS / GCS storage for table files and snapshots",
  },
  {
    id: "prop-ops",
    label: "Platform administration engineering (Annual allocation)",
    value: 4500000,
    notes: "Partial allocation of DevOps / Kubernetes engineer time",
  },
  {
    id: "prop-iomete-licence",
    label: "IOMETE software licence fee",
    value: 0,
    isUnknown: true,
    notes: "Requires vendor quote based on cluster size",
  },
];

export const DEFAULT_IMPLEMENTATION_COSTS: CostField[] = [
  {
    id: "impl-infra",
    label: "Initial cluster setup & network integration",
    value: 1500000,
    notes: "VPC peering, IAM policies, and storage bucket configuration",
  },
  {
    id: "impl-migration",
    label: "Pilot pipeline migration & validation (6–8 weeks)",
    value: 3000000,
    notes: "Engineering effort to migrate pilot tables and test queries",
  },
];

// ─── Step 6: Important Questions Repository ──────────────────────────────────

export const EVALUATION_QUESTIONS: EvaluationQuestion[] = [
  {
    id: "q-security-perimeter",
    category: "security",
    question: "Does any data or customer telemetry leave our private network?",
    plainContext:
      "Critical for organizations with strict data sovereignty, GDPR, HIPAA, or financial privacy rules.",
    suggestedAnswer:
      "No. IOMETE is architected for self-hosted deployment. Both data storage and compute run inside your Kubernetes cluster. Metadata and query audit logs remain under your control.",
    evidenceState: "supported",
    sourceNote:
      "Documented core principle: zero data exfiltration, self-hosted control and data plane.",
    relevanceTags: [
      "outcome-security",
      "outcome-sovereignty",
      "security-governance",
    ],
  },
  {
    id: "q-identity-sso",
    category: "security",
    question:
      "How does user authentication integrate with our existing Single Sign-On (SSO)?",
    plainContext:
      "Ensures data access follows corporate user directories without creating new shadow credentials.",
    suggestedAnswer:
      "IOMETE supports SAML 2.0, OAuth 2.0 / OIDC, and LDAP. Users authenticate through your corporate IdP (Azure AD, Okta, Google), and group memberships map to IOMETE roles.",
    evidenceState: "supported",
    sourceNote: "Documented IdP integration specification.",
    relevanceTags: ["outcome-security", "security-governance"],
  },
  {
    id: "q-data-access-isolation",
    category: "security",
    question:
      "Can we restrict specific rows and columns for different teams querying the same table?",
    plainContext:
      "Needed when different departments or clients share common tables but must not see each other’s records.",
    suggestedAnswer:
      "Yes. Row-Level Security (RLS) dynamically filters returned rows based on user role, while Column-Level Security and dynamic masking hide sensitive fields.",
    evidenceState: "supported",
    sourceNote: "Documented RBAC & dynamic masking capabilities.",
    relevanceTags: ["outcome-security", "outcome-unify", "security-governance"],
  },
  {
    id: "q-k8s-staffing",
    category: "operations",
    question:
      "What level of internal Kubernetes (K8s) expertise is required to operate IOMETE?",
    plainContext: "Important for understanding ongoing administrative burden.",
    suggestedAnswer:
      "IOMETE provides Helm charts and automated operators for deployment and updates. However, your team must be comfortable provisioning namespaces, storage classes, and monitoring in K8s (or use a managed cloud K8s service like EKS/AKS).",
    evidenceState: "assumed",
    sourceNote:
      "Kubernetes operational reality. IOMETE reduces maintenance with custom operators, but general K8s familiarity is required.",
    relevanceTags: ["outcome-cost-control", "high-operating-costs"],
  },
  {
    id: "q-lakehouse-lockin",
    category: "deployment",
    question:
      "If we decide to leave IOMETE in the future, how difficult is it to migrate our data?",
    plainContext: "Guarantees freedom from proprietary vendor capture.",
    suggestedAnswer:
      "Very straightforward. Your data is stored in standard Apache Iceberg / Parquet formats in your own object storage buckets. Any Spark, DuckDB, Trino, or Snowflake engine can query those tables directly without migration.",
    evidenceState: "supported",
    sourceNote: "Open-table format architecture (Apache Iceberg).",
    relevanceTags: ["outcome-unify", "outcome-cost-control"],
  },
  {
    id: "q-data-rollback",
    category: "quality",
    question:
      "How do we recover if an automated ETL job loads bad data into a production table?",
    plainContext:
      "Protects business dashboards and analytics from corrupted data writes.",
    suggestedAnswer:
      "Apache Iceberg provides snapshot-based time travel. You can instantly query past snapshots or roll back the table pointer to the state immediately preceding the bad job, with zero data loss.",
    evidenceState: "supported",
    sourceNote: "Documented Iceberg snapshot management.",
    relevanceTags: ["outcome-reliability", "unreliable-data"],
  },
  {
    id: "q-custom-ingestion",
    category: "integration",
    question:
      "How do we ingest data from bespoke internal APIs or niche vendor databases?",
    plainContext:
      "Applies when data sources lack off-the-shelf SaaS connectors.",
    suggestedAnswer:
      "IOMETE supports custom PySpark jobs, JDBC drivers, and native Prefect workflow scheduling. You can write lightweight Spark consumers that read from your API/database and write directly to Iceberg tables.",
    evidenceState: "supported",
    sourceNote: "Documented Apache Spark runtime and Prefect orchestration.",
    relevanceTags: ["outcome-unify", "hard-to-combine", "siloed-systems"],
  },
  {
    id: "q-compliance-soc2",
    category: "security",
    question:
      "What formal security compliance reports (SOC 2, ISO 27001) does IOMETE provide?",
    plainContext: "Necessary for security and compliance committee sign-off.",
    suggestedAnswer:
      "SOC 2 alignment is referenced in general documentation. Specific Type II audit reports and boundary documentation must be requested directly from IOMETE during initial vendor engagement.",
    evidenceState: "unknown",
    sourceNote:
      "Vendor documentation mentions SOC 2 alignment; specific attestations require direct confirmation.",
    relevanceTags: [
      "outcome-sovereignty",
      "outcome-security",
      "security-governance",
    ],
  },
  {
    id: "q-total-cost",
    category: "costs",
    question:
      "What are the overall commercial terms and licensing models for IOMETE?",
    plainContext: "Essential to complete an accurate business case.",
    suggestedAnswer:
      "IOMETE does not publish fixed retail prices. Commercial pricing typically tracks platform capacity or cluster sizing. You must request an indicative quote to complete your financial model.",
    evidenceState: "unknown",
    sourceNote: "No public pricing catalog exists.",
    relevanceTags: ["outcome-cost-control", "high-operating-costs"],
  },
];

// ─── Step 7: Default PoC / Evaluation Plan Items ─────────────────────────────

export const DEFAULT_EVALUATION_PLAN_ITEMS: EvaluationPlanItem[] = [
  {
    id: "plan-perimeter-deploy",
    title: "Deploy IOMETE in Isolated Test Kubernetes Namespace",
    whatToTest:
      "Install IOMETE via Helm chart into a test Kubernetes cluster; verify all pods are healthy and connect to test object storage bucket.",
    whyItMatters: "Confirms deployment works within your infrastructure.",
    evidenceRequired:
      "Cluster deployment logs and confirmation of zero outbound traffic outside your network.",
    ownerRole: "DevOps / Cloud Infrastructure Lead",
    successCriteria:
      "IOMETE web console and SQL endpoint accessible inside your corporate network within 2 business days.",
  },
  {
    id: "plan-iceberg-acid",
    title: "Validate Open Table ACID Writes & Concurrent Read Isolation",
    whatToTest:
      "Ingest sample transactional datasets into Apache Iceberg tables while running simultaneous read queries.",
    whyItMatters: "Checks that concurrent reads and writes remain reliable.",
    evidenceRequired:
      "Successful execution of concurrent read/write test suite with zero failed queries or partial rows.",
    ownerRole: "Lead Data Engineer",
    successCriteria:
      "Consistent query outputs maintained before, during, and after simulated pipeline failures.",
  },
  {
    id: "plan-security-masking",
    title: "Configure Role-Based Access & Dynamic Data Masking",
    whatToTest:
      "Create two test user roles (e.g. Department Analyst vs Data Steward); apply masking to sensitive fields and row filtering.",
    whyItMatters:
      "Confirms sensitive data is masked without creating duplicate tables.",
    evidenceRequired:
      "Query output screenshots demonstrating masked fields for analyst role and unmasked fields for steward role.",
    ownerRole: "Security & Governance Lead",
    successCriteria:
      "Analyst account receives obfuscated data for marked PII columns and zero rows outside their department.",
  },
  {
    id: "plan-time-travel",
    title: "Execute Snapshot Rollback and Historical Time-Travel Query",
    whatToTest:
      "Intentionally load an erroneous data batch, then run a historical query (`AS OF TIMESTAMP`) and trigger an Iceberg rollback.",
    whyItMatters: "Tests recovery from bad loads and historical reporting.",
    evidenceRequired:
      "Snapshot query execution logs showing historical table state restored in under 60 seconds.",
    ownerRole: "Data Platform Engineer",
    successCriteria:
      "Production table state restored to pre-incident snapshot with a single command.",
  },
  {
    id: "plan-vendor-confirmations",
    title: "Resolve Vendor Pre-Conditions & Commercial Licensing Quote",
    whatToTest:
      "Engage IOMETE team to review SOC 2 Type II compliance package, clarify custom feed patterns, and obtain licence quote.",
    whyItMatters: "Supports governance review and executive approval.",
    evidenceRequired:
      "Received SOC 2 documentation and signed commercial pricing proposal.",
    ownerRole: "Procurement / Engineering Director",
    successCriteria:
      "All Unknown items on the evaluation checklist addressed before production commitment.",
  },
];
