// ─── Evidence & Classification Types ────────────────────────────────────────

export type EvidenceState = "supported" | "assumed" | "unknown";

export interface IometeCapability {
  id: string;
  name: string;
  label?: string;
  category:
    | "storage"
    | "compute"
    | "security"
    | "governance"
    | "orchestration"
    | "integration";
  plainSummary: string; // Plain-English explanation
  whyItMatters: string; // Why this capability matters to the buyer
  evidenceState: EvidenceState;
  evidenceSource: {
    title: string;
    url?: string;
    citation: string;
  };
  limitations: string; // Dependencies or architectural constraints
  confirmationNeeded: string; // What needs to be validated in PoC
  pocValidation?: string;
  tagKeywords: string[]; // Tags to match against user outcomes
}

// ─── Step 2: Setup Challenges ────────────────────────────────────────────────

export interface SetupChallenge {
  id: string;
  title: string;
  description: string;
  commonExamples: string;
}

// ─── Step 3: Desired Outcomes ────────────────────────────────────────────────

export type OutcomePriority = "must-have" | "nice-to-have";

export interface DesiredOutcome {
  id: string;
  title: string;
  description: string;
  plainGoal: string;
  mapsToCapabilityIds: string[];
}

export type DeploymentConstraint =
  | "on-prem"
  | "private-cloud"
  | "public-cloud-tenant"
  | "flexible";

// ─── Step 5: Costs and Effort ────────────────────────────────────────────────

export interface CostField {
  id: string;
  label: string;
  value: number;
  isUnknown?: boolean;
  notes?: string;
}

export interface FinancialModel {
  isSkipped: boolean;
  currency: string;
  currentAnnualCosts: CostField[];
  proposedAnnualCosts: CostField[];
  oneTimeImplementationCosts: CostField[];
}

// ─── Step 6: Important Questions ─────────────────────────────────────────────

export type QuestionCategory =
  | "security"
  | "integration"
  | "deployment"
  | "workloads"
  | "operations"
  | "quality"
  | "costs";

export type QuestionDisposition =
  | "resolved"
  | "needs_answer"
  | "blocking"
  | "unreviewed";

export interface EvaluationQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
  plainContext: string;
  suggestedAnswer: string;
  evidenceState: EvidenceState;
  sourceNote: string;
  relevanceTags: string[]; // Match user's outcomes
}

// ─── Step 7: Practical Evaluation Plan ───────────────────────────────────────

export interface EvaluationPlanItem {
  id: string;
  title: string;
  whatToTest: string;
  whyItMatters: string;
  evidenceRequired: string;
  ownerRole: string; // e.g. "Data Platform Lead", "Security Team"
  successCriteria: string;
  isUserCustom?: boolean;
}

// ─── Decision Recommendation ─────────────────────────────────────────────────

export type DecisionRecommendation =
  | "proceed_to_poc"
  | "proceed_with_conditions"
  | "pause_for_clarification"
  | "in_progress";

export interface RecommendationSummary {
  status: DecisionRecommendation;
  headline: string;
  rationale: string;
  actionSummary: string;
}

// ─── Step 8: Full Assessment State ───────────────────────────────────────────

export interface AssessmentState {
  currentStep: number; // 1 to 8
  completedSteps: Set<number>;

  // Step 2: Setup
  selectedChallenges: string[]; // Challenge IDs
  setupDescription: string; // Free-text stack/environment summary

  // Step 3: Outcomes
  selectedOutcomes: string[]; // Outcome IDs
  outcomePriorities: Record<string, OutcomePriority>;
  deploymentConstraint: DeploymentConstraint;

  // Step 5: Financials
  financialModel: FinancialModel;

  // Step 6: Questions
  questionDispositions: Record<string, QuestionDisposition>;

  // Step 7: PoC Plan
  customPlanItems: EvaluationPlanItem[];

  // Step 8: Report
  userNotes: string;
  reportGeneratedAt: string | null;

  // Preset tracking
  isScenarioLoaded: boolean;
  activeScenarioName?: string;
}

// ─── Example Scenario (Aurelia Capital) ──────────────────────────────────────

export interface ExampleScenarioDomain {
  code: string;
  name: string;
  systemOwner: string;
  problemSummary: string;
  failureIncident: string;
  metrics: { label: string; value: string }[];
  upstream: string[];
  downstream: string[];
}

export interface ExampleScenarioData {
  organizationName: string;
  leadPersona: {
    name: string;
    title: string;
    brief: string;
  };
  contextSummary: string;
  domains: ExampleScenarioDomain[];
  desiredOutcome: string;
  iometeFitSummary: string;
  pocChecklist: string[];
}

// ─── Legacy & Stakeholder Types ───────────────────────────────────────────────

export interface DataSourceNode {
  id: string;
  code: string;
  label: string;
  owner: string;
  description: string;
  failureMode: string;
  consequences: string[];
  metrics: { label: string; value: string }[];
  connections: string[];
}

export interface Requirement {
  id: string;
  code: string;
  title: string;
  category: string;
  description: string;
  whyItMatters: string;
  businessImpact: string;
  mappedCapabilityIds: string[];
}

export type DifficultQuestionCategory =
  | "commercial"
  | "security"
  | "operations"
  | "compliance"
  | "workloads"
  | "integration"
  | "quality";
export interface DifficultQuestion {
  id: string;
  category: DifficultQuestionCategory;
  question: string;
  context: string;
  iometeAnswer: string;
  evidenceState: EvidenceState;
  source: string;
  buyerImplication: string;
}

export type ExecutiveId = "cfo" | "ciso" | "cto" | "cro";
export type ExecutiveStance = "supportive" | "neutral" | "concerned" | "unset";

export interface Executive {
  id: ExecutiveId;
  name: string;
  title: string;
  tagline: string;
  concerns: string[];
  iometeAddresses: { point: string; evidenceState: EvidenceState }[];
  iometeDoesNot: string[];
  committeeQuestion: string;
}

export type EditableField = CostField;

export interface PocWeek {
  week: number;
  title: string;
  focus: string;
  activities: string[];
  exitCriteria: string[];
  riskIfSkipped: string;
}
