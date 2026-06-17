import { Shield, Brain, Database, Users, LineChart, Activity, AlertTriangle, Zap, UserCheck, Settings, Server, Lock, Bot } from 'lucide-react';

export type Agent = {
  id: string;
  name: string;
  icon: any;
  description: string;
  responsibilities: string[];
  capabilities: string[];
  status: 'Operational' | 'Standby' | 'Degraded';
};

export const agents: Agent[] = [
  {
    id: 'orchestrator',
    name: 'Orchestrator / CEO Agent',
    icon: Settings,
    description: 'Act as the central command system.',
    responsibilities: [
      'Understand high-level objectives.',
      'Break complex tasks into modular workflows.',
      'Assign tasks to specialized agents dynamically.',
      'Manage execution order and dependencies.',
      'Monitor task completion and system health.',
      'Maintain global context and workflow state.',
      'Trigger retries, escalation, or fallback procedures.'
    ],
    capabilities: ['Workflow DAG orchestration', 'Dynamic agent routing', 'Context propagation', 'Dependency graph management', 'Execution monitoring', 'Intelligent task prioritization'],
    status: 'Operational',
  },
  {
    id: 'knowledge',
    name: 'Knowledge Retrieval Agent',
    icon: Database,
    description: 'Gather real-time information and feed contextual intelligence.',
    responsibilities: [
      'Gather real-time information from APIs, Databases, Vector stores, etc.',
      'Feed contextual intelligence to other agents.',
      'Maintain semantic memory and retrieval systems.'
    ],
    capabilities: ['RAG pipelines', 'Semantic search', 'Embedding retrieval', 'Structured + unstructured data ingestion', 'Real-time data synchronization', 'Knowledge graph querying'],
    status: 'Operational',
  },
  {
    id: 'reasoning',
    name: 'Adaptive Reasoning Agent',
    icon: Brain,
    description: 'Perform advanced reasoning and decision-making.',
    responsibilities: [
      'Perform advanced reasoning and decision-making.',
      'Handle uncertainty and incomplete information.',
      'Evaluate multiple possible outcomes.',
      'Generate explainable recommendations.'
    ],
    capabilities: ['Probabilistic reasoning', 'Chain-of-thought planning', 'Multi-step inference', 'Scenario evaluation', 'Bayesian analysis', 'Strategic planning', 'Risk-aware decision making'],
    status: 'Operational',
  },
  {
    id: 'security',
    name: 'Security & Compliance Agent',
    icon: Shield,
    description: 'Monitor for fraud, abuse, and enforce compliance policies.',
    responsibilities: [
      'Monitor for fraud, abuse, and anomalies.',
      'Enforce compliance policies.',
      'Validate outputs against regulatory rules.',
      'Detect suspicious behaviors and threats.'
    ],
    capabilities: ['Anomaly detection', 'Policy validation', 'Access control verification', 'Audit logging', 'Threat intelligence', 'Compliance scoring'],
    status: 'Operational',
  },
  {
    id: 'collaboration',
    name: 'Collaboration Agent',
    icon: Users,
    description: 'Coordinate multiple LLM providers and route tasks.',
    responsibilities: [
      'Coordinate multiple LLM providers.',
      'Route tasks to the most appropriate model.',
      'Optimize quality, speed, and cost.'
    ],
    capabilities: ['Dynamic model selection', 'Load balancing', 'Cost optimization', 'Context adaptation', 'Multi-model consensus validation'],
    status: 'Operational',
  },
  {
    id: 'simulation',
    name: 'Simulation Agent',
    icon: LineChart,
    description: 'Run predictive simulations and what-if analysis.',
    responsibilities: [
      'Run predictive simulations and what-if analysis.',
      'Forecast risks, trends, and outcomes.',
      'Model future scenarios proactively.'
    ],
    capabilities: ['Predictive analytics', 'Monte Carlo simulations', 'Strategic forecasting', 'Behavioral simulation', 'System impact analysis'],
    status: 'Standby',
  },
  {
    id: 'resilience',
    name: 'Resilience Agent',
    icon: Activity,
    description: 'Ensure high availability, recover from failures, and maintain continuity.',
    responsibilities: [
      'Ensure high availability and fault tolerance.',
      'Recover from failures automatically.',
      'Maintain operational continuity.'
    ],
    capabilities: ['Circuit breaker systems', 'Retry with exponential backoff', 'Agent failover routing', 'Backup execution pipelines', 'Cached fallback responses', 'Health monitoring'],
    status: 'Operational',
  },
  {
    id: 'ethics',
    name: 'Ethics & Safety Agent',
    icon: AlertTriangle,
    description: 'Prevent harmful outputs and ensure ethical AI behavior.',
    responsibilities: [
      'Prevent harmful, unsafe, or restricted outputs.',
      'Ensure ethical AI behavior.',
      'Detect sensitive or dangerous content.'
    ],
    capabilities: ['Toxicity filtering', 'Bias detection', 'Prompt injection defense', 'Harm prevention', 'Sensitive data masking', 'Safety policy enforcement'],
    status: 'Operational',
  },
  {
    id: 'optimization',
    name: 'Optimization Agent',
    icon: Zap,
    description: 'Optimize infrastructure usage and improve execution efficiency.',
    responsibilities: [
      'Optimize infrastructure usage and performance.',
      'Reduce unnecessary compute costs.',
      'Improve execution efficiency.'
    ],
    capabilities: ['Intelligent caching', 'Token optimization', 'Memory management', 'API call minimization', 'Compute scheduling', 'Resource balancing'],
    status: 'Operational',
  },
  {
    id: 'human',
    name: 'Human-in-the-Loop Agent',
    icon: UserCheck,
    description: 'Escalate ambiguous situations and request human approval.',
    responsibilities: [
      'Escalate ambiguous or high-risk situations.',
      'Request human approval when needed.',
      'Maintain accountability in critical workflows.'
    ],
    capabilities: ['Generate summary', 'Explain reasoning', 'Highlight risks', 'Provide recommendation options', 'Await approval or override'],
    status: 'Operational',
  }
];
