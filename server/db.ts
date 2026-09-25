import type {
  AIAgent,
  AgentMetrics,
  CallLog,
  DashboardStats,
  Lead,
} from "../src/types";

/* =========================================================
   SAMPLE AGENTS
========================================================= */

let agents: AIAgent[] = [
  {
    id: "agent-1",
    name: "Customer Support Agent",
    description:
      "Handles customer enquiries, support questions, and general business information.",
    instructions:
      "Be professional, friendly, concise, and helpful. Understand the customer's issue and collect relevant information.",
    language: "English",
    voice: "Professional Female",
    tone: "Friendly",
    status: "active",
    metrics: {
      callsHandled: 128,
      leadsGenerated: 32,
      leadConversion: 25,
      averageCallDuration: "3m 18s",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  {
    id: "agent-2",
    name: "Sales Lead Agent",
    description:
      "Qualifies potential customers, understands requirements, and identifies sales opportunities.",
    instructions:
      "Ask relevant questions, understand customer requirements, identify qualified prospects, and collect contact information.",
    language: "English",
    voice: "Professional Male",
    tone: "Confident",
    status: "active",
    metrics: {
      callsHandled: 246,
      leadsGenerated: 78,
      leadConversion: 32,
      averageCallDuration: "4m 05s",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  {
    id: "agent-3",
    name: "Appointment Agent",
    description:
      "Handles appointment enquiries and collects booking details from customers.",
    instructions:
      "Collect customer name, preferred date, preferred time, contact details, and appointment requirements.",
    language: "English",
    voice: "Warm Female",
    tone: "Professional",
    status: "active",
    metrics: {
      callsHandled: 94,
      leadsGenerated: 21,
      leadConversion: 22,
      averageCallDuration: "2m 46s",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/* =========================================================
   SAMPLE LEADS
========================================================= */

let leads: Lead[] = [
  {
    id: "lead-1",
    agentId: "agent-1",
    name: "Rahul Sharma",
    phone: "+91 9876543210",
    email: "rahul@example.com",
    intent: "Customer enquiry",
    requirement:
      "Interested in business services and pricing.",
    budget: "Not specified",
    location: "India",
    status: "hot",
    leadScore: 85,
    createdAt: new Date().toISOString(),
  },

  {
    id: "lead-2",
    agentId: "agent-2",
    name: "Ananya Nair",
    phone: "+91 9988776655",
    email: "ananya@example.com",
    intent: "Sales enquiry",
    requirement:
      "Interested in available service packages.",
    budget: "Not specified",
    location: "India",
    status: "warm",
    leadScore: 72,
    createdAt: new Date().toISOString(),
  },
];

/* =========================================================
   SAMPLE CALL LOGS
========================================================= */

let callLogs: CallLog[] = [
  {
    id: "call-1",
    agentId: "agent-1",
    leadId: "lead-1",
    phoneNumber: "+91 9876543210",
    duration: "3m 42s",
    language: "English",
    intent: "Customer enquiry",
    outcome:
      "Customer details collected for follow-up.",
    leadGenerated: true,
    leadScore: 85,
    createdAt: new Date().toISOString(),
  },

  {
    id: "call-2",
    agentId: "agent-2",
    leadId: "lead-2",
    phoneNumber: "+91 9988776655",
    duration: "4m 05s",
    language: "English",
    intent: "Sales enquiry",
    outcome:
      "Qualified sales opportunity identified.",
    leadGenerated: true,
    leadScore: 72,
    createdAt: new Date().toISOString(),
  },
];

/* =========================================================
   DASHBOARD STATS
========================================================= */

let dashboardStats: DashboardStats = {
  totalCalls: 1284,
  totalTalkTime: "186h",
  totalLeads: 326,
  resolutionRate: 82.4,
};

/* =========================================================
   AGENT FUNCTIONS
========================================================= */

export function getAgents(): AIAgent[] {
  return agents;
}

export function getAgentById(
  id: string
): AIAgent | undefined {
  return agents.find((agent) => agent.id === id);
}

export function addAgent(agent: AIAgent): AIAgent {
  agents.push(agent);

  return agent;
}

export function updateAgent(
  id: string,
  updates: Partial<AIAgent>
): AIAgent | undefined {
  const index = agents.findIndex(
    (agent) => agent.id === id
  );

  if (index === -1) {
    return undefined;
  }

  agents[index] = {
    ...agents[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return agents[index];
}

export function removeAgent(
  id: string
): boolean {
  const initialLength = agents.length;

  agents = agents.filter(
    (agent) => agent.id !== id
  );

  return agents.length !== initialLength;
}

/* =========================================================
   AGENT METRICS
========================================================= */

export function updateAgentMetrics(
  agentId: string,
  callDurationSeconds: number,
  leadGenerated: boolean
): AIAgent | undefined {
  const agent = getAgentById(agentId);

  if (!agent) {
    return undefined;
  }

  const currentMetrics: AgentMetrics =
    agent.metrics || {
      callsHandled: 0,
      leadsGenerated: 0,
      leadConversion: 0,
      averageCallDuration: "0m 00s",
    };

  const previousCalls =
    currentMetrics.callsHandled;

  const previousLeads =
    currentMetrics.leadsGenerated;

  const newCalls = previousCalls + 1;

  const newLeads =
    previousLeads + (leadGenerated ? 1 : 0);

  const previousAverageSeconds =
    parseDurationToSeconds(
      currentMetrics.averageCallDuration
    );

  const totalDuration =
    previousAverageSeconds * previousCalls +
    callDurationSeconds;

  const newAverageSeconds =
    newCalls > 0
      ? Math.round(totalDuration / newCalls)
      : 0;

  const newConversion =
    newCalls > 0
      ? Number(
          ((newLeads / newCalls) * 100).toFixed(1)
        )
      : 0;

  const updatedMetrics: AgentMetrics = {
    callsHandled: newCalls,
    leadsGenerated: newLeads,
    leadConversion: newConversion,
    averageCallDuration:
      formatDuration(newAverageSeconds),
  };

  return updateAgent(agentId, {
    metrics: updatedMetrics,
  });
}

/* =========================================================
   LEAD FUNCTIONS
========================================================= */

export function getLeads(): Lead[] {
  return leads;
}

export function getLeadById(
  id: string
): Lead | undefined {
  return leads.find((lead) => lead.id === id);
}

export function addLead(lead: Lead): Lead {
  leads.push(lead);

  return lead;
}

export function updateLead(
  id: string,
  updates: Partial<Lead>
): Lead | undefined {
  const index = leads.findIndex(
    (lead) => lead.id === id
  );

  if (index === -1) {
    return undefined;
  }

  leads[index] = {
    ...leads[index],
    ...updates,
  };

  return leads[index];
}

/* =========================================================
   CALL LOG FUNCTIONS
========================================================= */

export function getCallLogs(): CallLog[] {
  return callLogs;
}

export function getCallLogsByAgent(
  agentId: string
): CallLog[] {
  return callLogs.filter(
    (call) => call.agentId === agentId
  );
}

export function addCallLog(
  call: CallLog
): CallLog {
  callLogs.unshift(call);

  return call;
}

/* =========================================================
   DASHBOARD FUNCTIONS
========================================================= */

export function getDashboardStats(): DashboardStats {
  return dashboardStats;
}

export function updateDashboardStats(
  callDurationSeconds: number,
  leadGenerated: boolean
): DashboardStats {
  dashboardStats.totalCalls += 1;

  if (leadGenerated) {
    dashboardStats.totalLeads += 1;
  }

  const currentTalkTimeSeconds =
    parseTalkTimeToSeconds(
      dashboardStats.totalTalkTime
    );

  const newTalkTimeSeconds =
    currentTalkTimeSeconds +
    callDurationSeconds;

  dashboardStats.totalTalkTime =
    formatTalkTime(newTalkTimeSeconds);

  return dashboardStats;
}

/* =========================================================
   UTILITY FUNCTIONS
========================================================= */

function parseDurationToSeconds(
  duration: string
): number {
  const match = duration.match(
    /(?:(\d+)h\s*)?(?:(\d+)m\s*)?(?:(\d+)s)?/
  );

  if (!match) {
    return 0;
  }

  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);

  return (
    hours * 3600 +
    minutes * 60 +
    seconds
  );
}

function formatDuration(
  totalSeconds: number
): string {
  const hours = Math.floor(
    totalSeconds / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  return `${minutes}m ${String(seconds).padStart(
    2,
    "0"
  )}s`;
}

function parseTalkTimeToSeconds(
  talkTime: string
): number {
  const hoursMatch =
    talkTime.match(/(\d+)h/);

  const minutesMatch =
    talkTime.match(/(\d+)m/);

  const secondsMatch =
    talkTime.match(/(\d+)s/);

  const hours = Number(
    hoursMatch?.[1] || 0
  );

  const minutes = Number(
    minutesMatch?.[1] || 0
  );

  const seconds = Number(
    secondsMatch?.[1] || 0
  );

  return (
    hours * 3600 +
    minutes * 60 +
    seconds
  );
}

function formatTalkTime(
  totalSeconds: number
): string {
  const hours = Math.floor(
    totalSeconds / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  return `${hours}h ${minutes}m`;
}