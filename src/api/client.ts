import type {
  AIAgent,
  CallLog,
  DashboardStats,
  Lead,
} from "../types";

const API_BASE_URL = "http://localhost:3000/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data as T;
}

/* =========================================================
   AGENTS
========================================================= */

export interface CreateAgentRequest {
  name: string;
  description: string;
  instructions: string;
  language: AIAgent["language"];
  voice: AIAgent["voice"];
  tone: AIAgent["tone"];
  status: AIAgent["status"];
}

export interface AgentResponse {
  success: boolean;
  agent?: AIAgent;
  error?: string;
}

export async function getAgents(): Promise<AIAgent[]> {
  const data = await request<unknown>("/agents");

  if (Array.isArray(data)) {
    return data as AIAgent[];
  }

  if (
    data &&
    typeof data === "object" &&
    "agents" in data &&
    Array.isArray((data as { agents: unknown }).agents)
  ) {
    return (data as { agents: AIAgent[] }).agents;
  }

  throw new Error("Invalid agents response from server");
}

export async function getAgent(id: string): Promise<AIAgent> {
  const data = await request<unknown>(`/agents/${id}`);

  if (
    data &&
    typeof data === "object" &&
    "agent" in data
  ) {
    const wrapped = data as { agent?: AIAgent };

    if (wrapped.agent) {
      return wrapped.agent;
    }
  }

  if (
    data &&
    typeof data === "object" &&
    "id" in data
  ) {
    return data as AIAgent;
  }

  throw new Error("Agent not found");
}

export async function createAgent(
  agent: CreateAgentRequest
): Promise<AgentResponse> {
  try {
    const data = await request<unknown>("/agents", {
      method: "POST",
      body: JSON.stringify(agent),
    });

    // Backend may return the agent directly
    if (
      data &&
      typeof data === "object" &&
      "id" in data
    ) {
      return {
        success: true,
        agent: data as AIAgent,
      };
    }

    // Backend may already return { success, agent }
    if (
      data &&
      typeof data === "object" &&
      "success" in data
    ) {
      const response = data as AgentResponse;

      return {
        success: response.success,
        agent: response.agent,
        error: response.error,
      };
    }

    return {
      success: false,
      error: "Server returned an invalid agent response",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to save agent",
    };
  }
}

export async function updateAgent(
  id: string,
  agent: Partial<AIAgent>
): Promise<AgentResponse> {
  try {
    const data = await request<unknown>(`/agents/${id}`, {
      method: "PUT",
      body: JSON.stringify(agent),
    });

    if (
      data &&
      typeof data === "object" &&
      "id" in data
    ) {
      return {
        success: true,
        agent: data as AIAgent,
      };
    }

    if (
      data &&
      typeof data === "object" &&
      "success" in data
    ) {
      return data as AgentResponse;
    }

    return {
      success: false,
      error: "Invalid agent update response",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update agent",
    };
  }
}

export async function deleteAgent(
  id: string
): Promise<{ success: boolean; error?: string }> {
  return request<{ success: boolean; error?: string }>(
    `/agents/${id}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

export async function getDashboardStats(): Promise<DashboardStats> {
  const data = await request<unknown>("/dashboard/stats");

  if (
    data &&
    typeof data === "object" &&
    "stats" in data
  ) {
    return (data as { stats: DashboardStats }).stats;
  }

  return data as DashboardStats;
}

/* =========================================================
   LEADS
========================================================= */

export async function getLeads(): Promise<Lead[]> {
  const data = await request<unknown>("/leads");

  if (Array.isArray(data)) {
    return data as Lead[];
  }

  if (
    data &&
    typeof data === "object" &&
    "leads" in data &&
    Array.isArray((data as { leads: unknown }).leads)
  ) {
    return (data as { leads: Lead[] }).leads;
  }

  throw new Error("Invalid leads response from server");
}

/* =========================================================
   CALL LOGS
========================================================= */

export async function getCallLogs(): Promise<CallLog[]> {
  const data = await request<unknown>("/calls");

  if (Array.isArray(data)) {
    return data as CallLog[];
  }

  if (
    data &&
    typeof data === "object" &&
    "calls" in data &&
    Array.isArray((data as { calls: unknown }).calls)
  ) {
    return (data as { calls: CallLog[] }).calls;
  }

  throw new Error("Invalid call logs response from server");
}

/* =========================================================
   AI - GENERATE AGENT
========================================================= */

export interface GenerateAgentRequest {
  name: string;
  description: string;
  language: string;
  tone: string;
}

export interface GenerateAgentResponse {
  success: boolean;
  instructions?: string;
  error?: string;
}

export async function generateAgentInstructions(
  data: GenerateAgentRequest
): Promise<GenerateAgentResponse> {
  try {
    const response = await request<unknown>(
      "/ai/generate-agent",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    // Normal expected response
    if (
      response &&
      typeof response === "object" &&
      "success" in response
    ) {
      const result = response as GenerateAgentResponse;

      return {
        success: Boolean(result.success),
        instructions: result.instructions,
        error: result.error,
      };
    }

    // If backend returns instructions directly
    if (
      response &&
      typeof response === "object" &&
      "instructions" in response
    ) {
      return {
        success: true,
        instructions: (response as { instructions?: string })
          .instructions,
      };
    }

    return {
      success: false,
      error: "AI server returned an invalid response",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "AI generation failed",
    };
  }
}

/* =========================================================
   AI - ANALYZE CALL
========================================================= */

export interface AnalyzeCallRequest {
  transcript: string;
  agentId?: string;
  language?: string;
}

export interface AnalyzeCallResponse {
  success: boolean;
  analysis?: {
    intent?: string;
    outcome?: string;
    leadScore?: number;
    leadGenerated?: boolean;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    requirement?: string;
    budget?: string;
    location?: string;
  };
  error?: string;
}

export async function analyzeCall(
  data: AnalyzeCallRequest
): Promise<AnalyzeCallResponse> {
  return request<AnalyzeCallResponse>(
    "/ai/analyze-call",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

/* =========================================================
   SIMULATE CALL
========================================================= */

export interface SimulateCallResponse {
  success: boolean;
  analysis?: {
    intent?: string;
    outcome?: string;
    leadScore?: number;
    leadGenerated?: boolean;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    requirement?: string;
    budget?: string;
    location?: string;
  };
  lead?: Lead;
  call?: CallLog;
  updatedAgent?: AIAgent;
  dashboardStats?: DashboardStats;
  error?: string;
}

export async function simulateCall(
  agentId: string
): Promise<SimulateCallResponse> {
  return request<SimulateCallResponse>(
    "/simulate-call",
    {
      method: "POST",
      body: JSON.stringify({
        agentId,
      }),
    }
  );
}

/* =========================================================
   HEALTH
========================================================= */

export async function checkHealth(): Promise<{
  status: string;
  message: string;
}> {
  return request("/health");
}