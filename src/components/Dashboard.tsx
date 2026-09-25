import { useEffect, useState } from "react";
import {
  Activity,
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock3,
  Headphones,
  Loader2,
  PhoneCall,
  Play,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import type { AIAgent } from "../types";
import {
  getAgents,
  getDashboardStats,
} from "../api/client";

interface DashboardProps {
  onBack: () => void;
  onCreateAgent: () => void;
}

interface SimulationResult {
  success: boolean;
  demo: boolean;

  agent: {
    id: string;
    name: string;
  };

  transcript: string;
  duration: string;

  analysis: {
    intent: string;
    outcome: string;
    leadGenerated: boolean;
    leadScore: number;
  };

  lead?: {
    id: string;
    name: string;
    phone: string;
    leadScore: number;
  } | null;

  updatedAgent?: AIAgent | null;

  dashboardStats?: {
    totalCalls: number;
    totalTalkTime: string;
    totalLeads: number;
    resolutionRate: number;
  };
}

function Dashboard({
  onBack,
  onCreateAgent,
}: DashboardProps) {
  const [agents, setAgents] = useState<AIAgent[]>(
    []
  );

  const [stats, setStats] = useState({
    totalCalls: 1284,
    totalTalkTime: "186h",
    totalLeads: 326,
    resolutionRate: 82.4,
  });

  const [loading, setLoading] =
    useState(true);

  const [selectedAgent, setSelectedAgent] =
    useState<AIAgent | null>(null);

  const [simulationOpen, setSimulationOpen] =
    useState(false);

  const [simulationLoading, setSimulationLoading] =
    useState(false);

  const [simulationResult, setSimulationResult] =
    useState<SimulationResult | null>(null);

  const [simulationError, setSimulationError] =
    useState("");

  /* =======================================================
     LOAD DASHBOARD
  ======================================================= */

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [
        agentData,
        statsData,
      ] = await Promise.all([
        getAgents(),
        getDashboardStats(),
      ]);

      setAgents(agentData);
      setStats(statsData);
    } catch (error) {
      console.error(
        "Failed to load dashboard:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     SIMULATE CALL
  ======================================================= */

  const handleSimulateCall = async () => {
    if (!selectedAgent) {
      return;
    }

    try {
      setSimulationLoading(true);
      setSimulationError("");
      setSimulationResult(null);

      const response = await fetch(
        "http://localhost:3000/api/simulate-call",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            agentId:
              selectedAgent.id,
            scenario:
              "customer enquiry",
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to simulate test call"
        );
      }

      setSimulationResult(data);

      /* ---------------------------------------------------
         Update agent card immediately
      --------------------------------------------------- */

      if (data.updatedAgent) {
        setAgents((currentAgents) =>
          currentAgents.map(
            (agent) =>
              agent.id ===
              data.updatedAgent.id
                ? data.updatedAgent
                : agent
          )
        );

        setSelectedAgent(
          data.updatedAgent
        );
      }

      /* ---------------------------------------------------
         Update dashboard stats immediately
      --------------------------------------------------- */

      if (data.dashboardStats) {
        setStats(
          data.dashboardStats
        );
      }
    } catch (error) {
      console.error(
        "Simulation failed:",
        error
      );

      setSimulationError(
        error instanceof Error
          ? error.message
          : "Failed to simulate test call."
      );
    } finally {
      setSimulationLoading(false);
    }
  };

  /* =======================================================
     STATS CARDS
  ======================================================= */

  const statsCards = [
    {
      label: "Total Calls",
      value:
        stats.totalCalls.toLocaleString(),
      icon: PhoneCall,
      description:
        "Calls handled",
    },

    {
      label: "Talk Time",
      value:
        stats.totalTalkTime,
      icon: Clock3,
      description:
        "Total conversation time",
    },

    {
      label: "Leads Generated",
      value:
        stats.totalLeads.toLocaleString(),
      icon: Users,
      description:
        "Qualified leads",
    },

    {
      label: "Resolution Rate",
      value:
        `${stats.resolutionRate}%`,
      icon: Target,
      description:
        "Successful resolutions",
    },
  ];

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <Bot
                  size={22}
                  className="text-indigo-600"
                />

                <h1 className="text-xl font-bold">
                  CallForge
                </h1>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                AI Voice Agent Dashboard
              </p>
            </div>
          </div>

          <button
            onClick={onCreateAgent}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Plus size={18} />
            Create AI Agent
          </button>
        </div>
      </header>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* DEMO BANNER */}

        <div className="mb-8 flex items-start gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
            <Sparkles size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-indigo-950">
              Demo / Simulation Mode
            </h2>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-indigo-800">
              Test your AI agents without making real
              phone calls. CallForge simulates a customer
              conversation and uses Gemini to analyze the
              transcript.
            </p>
          </div>
        </div>

        {/* =================================================
            STATS
        ================================================= */}

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {statsCards.map(
            (card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {card.label}
                      </p>

                      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                        {loading
                          ? "—"
                          : card.value}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {card.description}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <Icon size={20} />
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </section>

        {/* =================================================
            AGENTS
        ================================================= */}

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Your AI Agents
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Monitor individual agent performance
                and run simulated calls.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Activity size={16} />

              {agents.length} agents
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <Loader2
                className="mx-auto animate-spin text-slate-400"
                size={28}
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading agents...
              </p>
            </div>
          ) : agents.length ===
            0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <Bot
                size={35}
                className="mx-auto text-slate-400"
              />

              <h3 className="mt-4 font-semibold">
                No AI agents yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create your first AI voice agent
                to get started.
              </p>

              <button
                onClick={onCreateAgent}
                className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Create AI Agent
              </button>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-3">
              {agents.map(
                (agent) => (
                  <div
                    key={agent.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* Agent header */}

                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                          <Bot size={20} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {agent.name}
                          </h3>

                          <p className="text-xs text-slate-500">
                            {agent.language}
                            {" · "}
                            {agent.tone}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                        {agent.status}
                      </span>
                    </div>

                    {/* Description */}

                    <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-600">
                      {agent.description}
                    </p>

                    {/* Metrics */}

                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">
                          Calls
                        </p>

                        <p className="mt-1 font-bold">
                          {
                            agent.metrics
                              .callsHandled
                          }
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">
                          Leads
                        </p>

                        <p className="mt-1 font-bold">
                          {
                            agent.metrics
                              .leadsGenerated
                          }
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">
                          Conversion
                        </p>

                        <p className="mt-1 font-bold">
                          {
                            agent.metrics
                              .leadConversion
                          }
                          %
                        </p>
                      </div>
                    </div>

                    {/* Average duration */}

                    <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                      <span className="text-xs text-slate-500">
                        Avg. call duration
                      </span>

                      <span className="text-xs font-semibold text-slate-700">
                        {
                          agent.metrics
                            .averageCallDuration
                        }
                      </span>
                    </div>

                    {/* Simulation button */}

                    <button
                      onClick={() => {
                        setSelectedAgent(
                          agent
                        );

                        setSimulationOpen(
                          true
                        );

                        setSimulationResult(
                          null
                        );

                        setSimulationError(
                          ""
                        );
                      }}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      <Play size={17} />

                      Simulate Test Call
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </main>

      {/* ===================================================
          SIMULATION MODAL
      =================================================== */}

      {simulationOpen &&
        selectedAgent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-5 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
              {/* Modal header */}

              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <Headphones size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Simulate Test Call
                    </h2>

                    <p className="text-sm text-slate-500">
                      Testing:{" "}
                      {selectedAgent.name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSimulationOpen(
                      false
                    );

                    setSimulationResult(
                      null
                    );

                    setSimulationError(
                      ""
                    );
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {/* =================================================
                    BEFORE SIMULATION
                ================================================= */}

                {!simulationResult && (
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600">
                        <PhoneCall size={21} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-indigo-950">
                          Customer Enquiry Scenario
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-indigo-800">
                          A simulated customer will
                          ask about the business,
                          pricing, and available
                          options. The AI agent will
                          collect contact information
                          and identify the customer's
                          intent.
                        </p>
                      </div>
                    </div>

                    {simulationError && (
                      <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {simulationError}
                      </div>
                    )}

                    <button
                      onClick={
                        handleSimulateCall
                      }
                      disabled={
                        simulationLoading
                      }
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {simulationLoading ? (
                        <>
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />

                          Simulating Call...
                        </>
                      ) : (
                        <>
                          <Play size={18} />

                          Start Simulation
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* =================================================
                    SIMULATION RESULT
                ================================================= */}

                {simulationResult && (
                  <div className="space-y-6">
                    {/* Success */}

                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                      <CheckCircle2
                        size={24}
                        className="text-emerald-600"
                      />

                      <div>
                        <p className="font-semibold text-emerald-900">
                          Test call completed
                          successfully
                        </p>

                        <p className="text-sm text-emerald-700">
                          Gemini analyzed the
                          simulated conversation
                          and CallForge recorded the
                          result.
                        </p>
                      </div>
                    </div>

                    {/* Metrics updated notice */}

                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                      <div className="flex items-center gap-3">
                        <TrendingUp
                          size={20}
                          className="text-indigo-600"
                        />

                        <div>
                          <p className="font-semibold text-indigo-950">
                            Agent metrics updated
                          </p>

                          <p className="mt-1 text-sm text-indigo-700">
                            This simulated call has been
                            added to the agent's performance
                            metrics.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Analysis */}

                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900">
                          AI Call Analysis
                        </h3>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          Demo Result
                        </span>
                      </div>

                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="rounded-2xl border border-slate-200 p-5">
                          <p className="text-xs font-medium text-slate-500">
                            Intent
                          </p>

                          <p className="mt-2 font-semibold capitalize text-slate-900">
                            {
                              simulationResult
                                .analysis
                                .intent
                            }
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-5">
                          <p className="text-xs font-medium text-slate-500">
                            Outcome
                          </p>

                          <p className="mt-2 font-semibold capitalize text-slate-900">
                            {
                              simulationResult
                                .analysis
                                .outcome
                            }
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-5">
                          <p className="text-xs font-medium text-slate-500">
                            Lead Score
                          </p>

                          <div className="mt-2 flex items-center gap-2">
                            <TrendingUp
                              size={18}
                              className="text-indigo-600"
                            />

                            <span className="text-2xl font-bold text-slate-900">
                              {
                                simulationResult
                                  .analysis
                                  .leadScore
                              }
                            </span>

                            <span className="text-sm text-slate-400">
                              /100
                            </span>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-5">
                          <p className="text-xs font-medium text-slate-500">
                            Lead Generated
                          </p>

                          <p
                            className={`mt-2 font-semibold ${
                              simulationResult
                                .analysis
                                .leadGenerated
                                ? "text-emerald-600"
                                : "text-slate-700"
                            }`}
                          >
                            {simulationResult
                              .analysis
                              .leadGenerated
                              ? "Yes"
                              : "No"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Transcript */}

                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900">
                          Call Transcript
                        </h3>

                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock3 size={14} />

                          {
                            simulationResult.duration
                          }
                        </span>
                      </div>

                      <div className="max-h-80 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-700">
                          {
                            simulationResult.transcript
                          }
                        </pre>
                      </div>
                    </div>

                    {/* Close */}

                    <button
                      onClick={() => {
                        setSimulationOpen(
                          false
                        );

                        setSimulationResult(
                          null
                        );

                        setSimulationError(
                          ""
                        );
                      }}
                      className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default Dashboard;