export type AgentStatus = "active" | "inactive" | "draft";

export type AgentLanguage =
  | "English"
  | "Arabic"
  | "Spanish"
  | "French"
  | "German"
  | "Hindi"
  | "Kannada"
  | "Malayalam"
  | "Tamil"
  | "Italian"
  | "Portuguese"
  | "Japanese"
  | "Mandarin Chinese";

export type AgentTone =
  | "Professional"
  | "Friendly"
  | "Casual"
  | "Empathetic"
  | "Confident";

export type AgentVoice =
  | "Professional Female"
  | "Professional Male"
  | "Friendly Female"
  | "Friendly Male"
  | "Warm Female"
  | "Warm Male";

export type LeadStatus = "hot" | "warm" | "cold" | "new";

export interface AgentMetrics {
  callsHandled: number;
  leadsGenerated: number;
  leadConversion: number;
  averageCallDuration: string;
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  instructions: string;

  language: AgentLanguage;
  voice: AgentVoice;
  tone: AgentTone;

  status: AgentStatus;

  phoneNumber?: string;

  metrics: AgentMetrics;

  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  agentId: string;

  name: string;
  phone: string;
  email?: string;

  intent?: string;
  requirement?: string;
  budget?: string;
  location?: string;

  status: LeadStatus;
  leadScore: number;

  createdAt: string;
}

export interface CallLog {
  id: string;
  agentId: string;
  leadId?: string;

  phoneNumber: string;
  duration: string;

  language: AgentLanguage;

  intent?: string;
  outcome?: string;

  leadGenerated: boolean;
  leadScore?: number;

  createdAt: string;
}

export interface DashboardStats {
  totalCalls: number;
  totalTalkTime: string;
  totalLeads: number;
  resolutionRate: number;
}