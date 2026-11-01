import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type {
  AssessmentState,
  OutcomePriority,
  DeploymentConstraint,
  QuestionDisposition,
  EvaluationPlanItem,
  DecisionRecommendation,
  RecommendationSummary,
  FinancialModel,
  CostField,
} from '../types';
import {
  DEFAULT_CURRENT_COSTS,
  DEFAULT_PROPOSED_COSTS,
  DEFAULT_IMPLEMENTATION_COSTS,
  DEFAULT_EVALUATION_PLAN_ITEMS,
  IOMETE_CAPABILITIES,
  DESIRED_OUTCOMES,
  EVALUATION_QUESTIONS,
} from '../data/generalContent';
import { AURELIA_CAPITAL_SCENARIO } from '../data/aureliaScenario';

// ─── Initial State ─────────────────────────────────────────────────────────────

const initialFinancialModel = {
  isSkipped: false,
  currency: '₹',
  currentAnnualCosts: DEFAULT_CURRENT_COSTS,
  proposedAnnualCosts: DEFAULT_PROPOSED_COSTS,
  oneTimeImplementationCosts: DEFAULT_IMPLEMENTATION_COSTS,
};

const initialState: AssessmentState = {
  currentStep: 1,
  completedSteps: new Set<number>(),
  selectedChallenges: [],
  setupDescription: '',
  selectedOutcomes: ['outcome-unify', 'outcome-reliability'], // sensible default starter
  outcomePriorities: {
    'outcome-unify': 'must-have',
    'outcome-reliability': 'must-have',
  },
  deploymentConstraint: 'private-cloud',
  financialModel: initialFinancialModel,
  questionDispositions: {},
  customPlanItems: DEFAULT_EVALUATION_PLAN_ITEMS,
  userNotes: '',
  reportGeneratedAt: null,
  isScenarioLoaded: false,
};

// ─── Actions ───────────────────────────────────────────────────────────────────

type Action =
  | { type: 'GO_TO_STEP'; step: number }
  | { type: 'TOGGLE_CHALLENGE'; challengeId: string }
  | { type: 'SET_SETUP_DESCRIPTION'; description: string }
  | { type: 'TOGGLE_OUTCOME'; outcomeId: string }
  | { type: 'SET_OUTCOME_PRIORITY'; outcomeId: string; priority: OutcomePriority }
  | { type: 'SET_DEPLOYMENT_CONSTRAINT'; constraint: DeploymentConstraint }
  | { type: 'UPDATE_COST_FIELD'; category: 'currentAnnualCosts' | 'proposedAnnualCosts' | 'oneTimeImplementationCosts'; fieldId: string; value: number }
  | { type: 'TOGGLE_FINANCIAL_SKIP'; skipped: boolean }
  | { type: 'SET_QUESTION_DISPOSITION'; questionId: string; disposition: QuestionDisposition }
  | { type: 'UPDATE_PLAN_ITEM'; item: EvaluationPlanItem }
  | { type: 'ADD_PLAN_ITEM'; item: EvaluationPlanItem }
  | { type: 'DELETE_PLAN_ITEM'; itemId: string }
  | { type: 'SET_USER_NOTES'; notes: string }
  | { type: 'LOAD_AURELIA_SCENARIO' }
  | { type: 'RESET_ASSESSMENT' };

// ─── Reducer ───────────────────────────────────────────────────────────────────

function reducer(state: AssessmentState, action: Action): AssessmentState {
  switch (action.type) {
    case 'GO_TO_STEP': {
      const completed = new Set(state.completedSteps);
      if (action.step > state.currentStep) completed.add(state.currentStep);
      return { ...state, currentStep: action.step, completedSteps: completed };
    }

    case 'TOGGLE_CHALLENGE': {
      const exists = state.selectedChallenges.includes(action.challengeId);
      const updated = exists
        ? state.selectedChallenges.filter(id => id !== action.challengeId)
        : [...state.selectedChallenges, action.challengeId];
      return { ...state, selectedChallenges: updated };
    }

    case 'SET_SETUP_DESCRIPTION':
      return { ...state, setupDescription: action.description };

    case 'TOGGLE_OUTCOME': {
      const exists = state.selectedOutcomes.includes(action.outcomeId);
      const updated = exists
        ? state.selectedOutcomes.filter(id => id !== action.outcomeId)
        : [...state.selectedOutcomes, action.outcomeId];

      const priorities = { ...state.outcomePriorities };
      if (!exists && !priorities[action.outcomeId]) {
        priorities[action.outcomeId] = 'must-have';
      } else if (exists) {
        delete priorities[action.outcomeId];
      }
      return { ...state, selectedOutcomes: updated, outcomePriorities: priorities };
    }

    case 'SET_OUTCOME_PRIORITY':
      return {
        ...state,
        outcomePriorities: { ...state.outcomePriorities, [action.outcomeId]: action.priority },
      };

    case 'SET_DEPLOYMENT_CONSTRAINT':
      return { ...state, deploymentConstraint: action.constraint };

    case 'UPDATE_COST_FIELD': {
      const updated = state.financialModel[action.category].map(field =>
        field.id === action.fieldId ? { ...field, value: action.value } : field
      );
      return {
        ...state,
        financialModel: { ...state.financialModel, [action.category]: updated },
      };
    }

    case 'TOGGLE_FINANCIAL_SKIP':
      return {
        ...state,
        financialModel: { ...state.financialModel, isSkipped: action.skipped },
      };

    case 'SET_QUESTION_DISPOSITION':
      return {
        ...state,
        questionDispositions: {
          ...state.questionDispositions,
          [action.questionId]: action.disposition,
        },
      };

    case 'UPDATE_PLAN_ITEM': {
      const updated = state.customPlanItems.map(item =>
        item.id === action.item.id ? action.item : item
      );
      return { ...state, customPlanItems: updated };
    }

    case 'ADD_PLAN_ITEM':
      return { ...state, customPlanItems: [...state.customPlanItems, action.item] };

    case 'DELETE_PLAN_ITEM':
      return {
        ...state,
        customPlanItems: state.customPlanItems.filter(item => item.id !== action.itemId),
      };

    case 'SET_USER_NOTES':
      return { ...state, userNotes: action.notes };

    case 'LOAD_AURELIA_SCENARIO': {
      return {
        ...state,
        isScenarioLoaded: true,
        activeScenarioName: 'Aurelia Capital (Investment Banking Example)',
        selectedChallenges: ['siloed-systems', 'hard-to-combine', 'unreliable-data', 'security-governance'],
        setupDescription:
          'Multi-asset investment bank data infrastructure: Bloomberg & Refinitiv market data feeds, OMS trade executions, 4 custodian position files, and legacy relational databases.',
        selectedOutcomes: ['outcome-unify', 'outcome-reliability', 'outcome-security', 'outcome-sovereignty'],
        outcomePriorities: {
          'outcome-unify': 'must-have',
          'outcome-reliability': 'must-have',
          'outcome-security': 'must-have',
          'outcome-sovereignty': 'must-have',
        },
        deploymentConstraint: 'private-cloud',
        financialModel: {
          isSkipped: false,
          currency: '₹',
          currentAnnualCosts: [
            { id: 'curr-warehouse', label: 'Existing Data Warehouse Licences (Annual)', value: 34000000, notes: 'Aurelia Capital enterprise legacy warehouse' },
            { id: 'curr-egress', label: 'Cloud data transfer & egress fees (Annual)', value: 4800000, notes: 'Multi-cloud cross-region transfer' },
            { id: 'curr-maintenance', label: 'Manual break reconciliation & triage (Annual FTE)', value: 9500000, notes: 'Operations team manual fix effort' },
          ],
          proposedAnnualCosts: [
            { id: 'prop-k8s', label: 'Private Kubernetes compute cluster (Annual)', value: 18000000, notes: '3-node dedicated K8s cluster' },
            { id: 'prop-storage', label: 'Object storage for Iceberg tables (Annual)', value: 2400000, notes: 'Storage for positions & tick logs' },
            { id: 'prop-ops', label: 'Platform operations engineering allocation', value: 12000000, notes: '0.5 senior DevOps/platform engineer' },
            { id: 'prop-iomete-licence', label: 'IOMETE platform software licence', value: 0, isUnknown: true, notes: 'Requires vendor quote' },
          ],
          oneTimeImplementationCosts: [
            { id: 'impl-infra', label: 'Initial cluster deployment & Active Directory SAML SSO', value: 4000000, notes: 'Isolated VPC test environment' },
            { id: 'impl-migration', label: '8-Week PoC engineering & synthetic feed migration', value: 6400000, notes: '2 engineers for 8 weeks' },
          ],
        },
        questionDispositions: {
          'q-security-perimeter': 'resolved',
          'q-identity-sso': 'resolved',
          'q-data-access-isolation': 'resolved',
          'q-compliance-soc2': 'blocking',
          'q-custom-ingestion': 'needs_answer',
        },
      };
    }

    case 'RESET_ASSESSMENT':
      return { ...initialState };

    default:
      return state;
  }
}

// ─── Recommendation Engine (Transparent Rules) ───────────────────────────────

export function computeRecommendation(state: AssessmentState): RecommendationSummary {
  // 1. Minimum engagement check
  if (state.selectedOutcomes.length === 0) {
    return {
      status: 'in_progress',
      headline: 'Assessment in progress',
      rationale: 'Select your desired outcomes in Step 3 to evaluate IOMETE against your criteria.',
      actionSummary: 'Return to Step 3 to specify what you need from a data platform.',
    };
  }

  // 2. Tally question dispositions
  const blockingCount = Object.values(state.questionDispositions).filter(d => d === 'blocking').length;
  const needsAnswerCount = Object.values(state.questionDispositions).filter(d => d === 'needs_answer').length;

  // 3. Tally capability evidence states for user's selected outcomes
  const relevantCapabilityIds = new Set<string>();
  state.selectedOutcomes.forEach(outId => {
    const outcome = DESIRED_OUTCOMES.find(o => o.id === outId);
    outcome?.mapsToCapabilityIds.forEach(cid => relevantCapabilityIds.add(cid));
  });

  let unknownCapabilities = 0;
  let supportedCapabilities = 0;
  relevantCapabilityIds.forEach(cid => {
    const cap = IOMETE_CAPABILITIES.find(c => c.id === cid);
    if (cap?.evidenceState === 'unknown') unknownCapabilities++;
    if (cap?.evidenceState === 'supported') supportedCapabilities++;
  });

  // 4. Decision Rule 1: Pause for clarification
  if (blockingCount >= 2 || (unknownCapabilities > supportedCapabilities && blockingCount >= 1)) {
    return {
      status: 'pause_for_clarification',
      headline: 'Pause for Clarification',
      rationale: `${blockingCount} blocking question(s) and critical unverified platform capabilities require clarification before investing in a proof of concept.`,
      actionSummary: 'Engage the IOMETE team to answer your blocking questions and provide formal verification.',
    };
  }

  // 5. Decision Rule 2: Proceed with conditions
  if (blockingCount === 1 || needsAnswerCount >= 2 || unknownCapabilities >= 2) {
    return {
      status: 'proceed_with_conditions',
      headline: 'Proceed with Conditions',
      rationale: 'IOMETE aligns strongly with your core outcomes, but key questions (e.g. security attestations, custom ingestion, or commercial quotes) must be verified prior to sign-off.',
      actionSummary: 'Include the identified pre-conditions as pass/fail milestones in your evaluation plan.',
    };
  }

  // 6. Decision Rule 3: Proceed to PoC Planning
  return {
    status: 'proceed_to_poc',
    headline: 'Proceed to Proof-of-Concept Planning',
    rationale: 'Documented IOMETE capabilities match your primary outcomes with manageable risks. A time-boxed evaluation will validate performance and operational fit.',
    actionSummary: 'Execute the suggested proof-of-concept plan on an isolated test Kubernetes cluster.',
  };
}

// ─── Financial Calculations ──────────────────────────────────────────────────

export function computeFinancialSummary(financialModel: FinancialModel) {
  if (financialModel.isSkipped) {
    return { isSkipped: true, currentAnnual: 0, proposedAnnual: 0, annualSavings: 0, implementationOneTime: 0, year1Net: 0, breakEvenNote: 'Skipped' };
  }

  const currentAnnual = financialModel.currentAnnualCosts.reduce((sum: number, f: CostField) => sum + (f.value || 0), 0);
  const proposedAnnual = financialModel.proposedAnnualCosts.reduce((sum: number, f: CostField) => sum + (f.isUnknown ? 0 : (f.value || 0)), 0);
  const implementationOneTime = financialModel.oneTimeImplementationCosts.reduce((sum: number, f: CostField) => sum + (f.value || 0), 0);

  const annualSavings = currentAnnual - proposedAnnual;
  const year1Net = annualSavings - implementationOneTime;

  let breakEvenNote = '';
  if (annualSavings <= 0) {
    breakEvenNote = 'No break-even possible: estimated operating costs meet or exceed current spend before software licence.';
  } else {
    const months = ((implementationOneTime / annualSavings) * 12).toFixed(1);
    breakEvenNote = `Estimated ${months} months to recover implementation costs (excluding IOMETE licence quote).`;
  }

  return {
    isSkipped: false,
    currentAnnual,
    proposedAnnual,
    annualSavings,
    implementationOneTime,
    year1Net,
    breakEvenNote,
  };
}

// ─── Context ───────────────────────────────────────────────────────────────────

interface SessionContextType {
  state: AssessmentState;
  goToStep: (step: number) => void;
  toggleChallenge: (id: string) => void;
  setSetupDescription: (desc: string) => void;
  toggleOutcome: (id: string) => void;
  setOutcomePriority: (id: string, priority: OutcomePriority) => void;
  setDeploymentConstraint: (constraint: DeploymentConstraint) => void;
  updateCostField: (category: 'currentAnnualCosts' | 'proposedAnnualCosts' | 'oneTimeImplementationCosts', fieldId: string, value: number) => void;
  toggleFinancialSkip: (skipped: boolean) => void;
  setQuestionDisposition: (questionId: string, disposition: QuestionDisposition) => void;
  updatePlanItem: (item: EvaluationPlanItem) => void;
  addPlanItem: (item: EvaluationPlanItem) => void;
  deletePlanItem: (itemId: string) => void;
  setUserNotes: (notes: string) => void;
  loadAureliaScenario: () => void;
  resetAssessment: () => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

const STORAGE_KEY = 'iomete-buyer-navigator-v2';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.financialModel) {
          parsed.financialModel.currency = '₹';
        }
        return {
          ...parsed,
          financialModel: parsed.financialModel ? { ...parsed.financialModel, currency: '₹' } : initialFinancialModel,
          completedSteps: new Set<number>(parsed.completedSteps || []),
        };
      }
    } catch {
      // Ignore fallback
    }
    return initialState;
  });

  useEffect(() => {
    try {
      const serialized = {
        ...state,
        completedSteps: Array.from(state.completedSteps),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch {
      // Storage quota or sandboxing
    }
  }, [state]);

  const goToStep = useCallback((step: number) => dispatch({ type: 'GO_TO_STEP', step }), []);
  const toggleChallenge = useCallback((id: string) => dispatch({ type: 'TOGGLE_CHALLENGE', challengeId: id }), []);
  const setSetupDescription = useCallback((desc: string) => dispatch({ type: 'SET_SETUP_DESCRIPTION', description: desc }), []);
  const toggleOutcome = useCallback((id: string) => dispatch({ type: 'TOGGLE_OUTCOME', outcomeId: id }), []);
  const setOutcomePriority = useCallback((id: string, priority: OutcomePriority) => dispatch({ type: 'SET_OUTCOME_PRIORITY', outcomeId: id, priority }), []);
  const setDeploymentConstraint = useCallback((constraint: DeploymentConstraint) => dispatch({ type: 'SET_DEPLOYMENT_CONSTRAINT', constraint }), []);
  const updateCostField = useCallback((category: any, fieldId: string, value: number) => dispatch({ type: 'UPDATE_COST_FIELD', category, fieldId, value }), []);
  const toggleFinancialSkip = useCallback((skipped: boolean) => dispatch({ type: 'TOGGLE_FINANCIAL_SKIP', skipped }), []);
  const setQuestionDisposition = useCallback((questionId: string, disposition: QuestionDisposition) => dispatch({ type: 'SET_QUESTION_DISPOSITION', questionId, disposition }), []);
  const updatePlanItem = useCallback((item: EvaluationPlanItem) => dispatch({ type: 'UPDATE_PLAN_ITEM', item }), []);
  const addPlanItem = useCallback((item: EvaluationPlanItem) => dispatch({ type: 'ADD_PLAN_ITEM', item }), []);
  const deletePlanItem = useCallback((itemId: string) => dispatch({ type: 'DELETE_PLAN_ITEM', itemId }), []);
  const setUserNotes = useCallback((notes: string) => dispatch({ type: 'SET_USER_NOTES', notes }), []);
  const loadAureliaScenario = useCallback(() => dispatch({ type: 'LOAD_AURELIA_SCENARIO' }), []);
  const resetAssessment = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'RESET_ASSESSMENT' });
  }, []);

  return (
    <SessionContext.Provider
      value={{
        state,
        goToStep,
        toggleChallenge,
        setSetupDescription,
        toggleOutcome,
        setOutcomePriority,
        setDeploymentConstraint,
        updateCostField,
        toggleFinancialSkip,
        setQuestionDisposition,
        updatePlanItem,
        addPlanItem,
        deletePlanItem,
        setUserNotes,
        loadAureliaScenario,
        resetAssessment,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
