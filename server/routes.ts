import { Router } from "express";

import {
  getAgents,
  getAgentById,
  addAgent,
  updateAgent,
  removeAgent,
  getLeads,
  getLeadById,
  updateLead,
  getCallLogs,
  getCallLogsByAgent,
  getDashboardStats,
  addLead,
  addCallLog,
  updateAgentMetrics,
  updateDashboardStats,
} from "./db";

import {
  generateAgentInstructions,
  analyzeCallTranscript,
} from "./llm";

import type {
  AIAgent,
  CallLog,
  Lead,
} from "../src/types";

const router = Router();

/* =========================================================
   AGENTS
========================================================= */

/**
 * GET /api/agents
 */
router.get("/agents", (_req, res) => {
  return res.json(getAgents());
});

/**
 * GET /api/agents/:id
 */
router.get("/agents/:id", (req, res) => {
  const agent = getAgentById(req.params.id);

  if (!agent) {
    return res.status(404).json({
      error: "Agent not found",
    });
  }

  return res.json(agent);
});

/**
 * POST /api/agents
 */
router.post("/agents", (req, res) => {
  try {
    const {
      name,
      description,
      instructions,
      language,
      voice,
      tone,
      status,
    } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        error: "Agent name is required",
      });
    }

    if (
      !description ||
      !String(description).trim()
    ) {
      return res.status(400).json({
        error: "Business requirement is required",
      });
    }

    if (
      !instructions ||
      !String(instructions).trim()
    ) {
      return res.status(400).json({
        error: "Agent instructions are required",
      });
    }

    const now =
      new Date().toISOString();

    const agent: AIAgent = {
      id: `agent-${Date.now()}`,

      name: String(name).trim(),

      description:
        String(description).trim(),

      instructions:
        String(instructions).trim(),

      language:
        language || "English",

      voice:
        voice || "Professional Female",

      tone:
        tone || "Professional",

      status:
        status || "active",

      metrics: {
        callsHandled: 0,
        leadsGenerated: 0,
        leadConversion: 0,
        averageCallDuration:
          "0m 00s",
      },

      createdAt: now,
      updatedAt: now,
    };

    addAgent(agent);

    return res.status(201).json({
      success: true,
      agent,
    });
  } catch (error) {
    console.error(
      "Create agent error:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        "Failed to create agent",
    });
  }
});

/**
 * PUT /api/agents/:id
 */
router.put("/agents/:id", (req, res) => {
  try {
    const agent = updateAgent(
      req.params.id,
      req.body
    );

    if (!agent) {
      return res.status(404).json({
        success: false,
        error: "Agent not found",
      });
    }

    return res.json({
      success: true,
      agent,
    });
  } catch (error) {
    console.error(
      "Update agent error:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        "Failed to update agent",
    });
  }
});

/**
 * DELETE /api/agents/:id
 */
router.delete("/agents/:id", (req, res) => {
  const deleted =
    removeAgent(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: "Agent not found",
    });
  }

  return res.json({
    success: true,
  });
});

/* =========================================================
   DASHBOARD
========================================================= */

/**
 * GET /api/dashboard/stats
 */
router.get(
  "/dashboard/stats",
  (_req, res) => {
    return res.json(
      getDashboardStats()
    );
  }
);

/* =========================================================
   LEADS
========================================================= */

/**
 * GET /api/leads
 */
router.get("/leads", (_req, res) => {
  return res.json(getLeads());
});

/**
 * GET /api/leads/:id
 */
router.get("/leads/:id", (req, res) => {
  const lead = getLeadById(
    req.params.id
  );

  if (!lead) {
    return res.status(404).json({
      error: "Lead not found",
    });
  }

  return res.json(lead);
});

/**
 * PUT /api/leads/:id
 */
router.put("/leads/:id", (req, res) => {
  try {
    const lead = updateLead(
      req.params.id,
      req.body
    );

    if (!lead) {
      return res.status(404).json({
        error: "Lead not found",
      });
    }

    return res.json(lead);
  } catch (error) {
    console.error(
      "Update lead error:",
      error
    );

    return res.status(500).json({
      error:
        "Failed to update lead",
    });
  }
});

/* =========================================================
   CALL LOGS
========================================================= */

/**
 * GET /api/calls
 */
router.get("/calls", (_req, res) => {
  return res.json(getCallLogs());
});

/**
 * GET /api/agents/:id/calls
 */
router.get(
  "/agents/:id/calls",
  (req, res) => {
    const agent =
      getAgentById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        error: "Agent not found",
      });
    }

    return res.json(
      getCallLogsByAgent(
        req.params.id
      )
    );
  }
);

/* =========================================================
   AI — GENERATE AGENT INSTRUCTIONS
========================================================= */

/**
 * POST /api/ai/generate-agent
 */
router.post(
  "/ai/generate-agent",
  async (req, res) => {
    try {
      const {
        name,
        description,
        language,
        tone,
      } = req.body;

      /*
       * The frontend calls this field "description",
       * while the business meaning is "business requirement".
       *
       * We accept both names so the API remains flexible.
       */
      const businessRequirement =
        description ||
        req.body.businessRequirement;

      if (
        !businessRequirement ||
        !String(
          businessRequirement
        ).trim()
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Business requirement is required",
        });
      }

      /*
       * Build a structured prompt for the
       * existing Gemini function.
       *
       * This keeps the existing llm.ts simple.
       */
      const aiRequest = [
        name
          ? `Agent name: ${String(name).trim()}`
          : "",

        `Business requirement: ${String(
          businessRequirement
        ).trim()}`,

        language
          ? `Language: ${String(language)}`
          : "",

        tone
          ? `Tone: ${String(tone)}`
          : "",
      ]
        .filter(Boolean)
        .join("\n");

      const instructions =
        await generateAgentInstructions(
          aiRequest
        );

      if (
        !instructions ||
        !String(instructions).trim()
      ) {
        return res.status(500).json({
          success: false,
          error:
            "AI returned empty agent instructions",
        });
      }

      return res.json({
        success: true,
        instructions:
          String(instructions).trim(),
      });
    } catch (error) {
      console.error(
        "Generate agent error:",
        error
      );

      return res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate agent instructions",
      });
    }
  }
);

/* =========================================================
   AI — ANALYZE CALL
========================================================= */

/**
 * POST /api/ai/analyze-call
 */
router.post(
  "/ai/analyze-call",
  async (req, res) => {
    try {
      const {
        transcript,
      } = req.body;

      if (
        !transcript ||
        !String(transcript).trim()
      ) {
        return res.status(400).json({
          error:
            "Transcript is required",
        });
      }

      const analysis =
        await analyzeCallTranscript(
          transcript
        );

      return res.json(
        analysis
      );
    } catch (error) {
      console.error(
        "Analyze call error:",
        error
      );

      return res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to analyze call",
      });
    }
  }
);

/* =========================================================
   DEMO — SIMULATE TEST CALL
========================================================= */

/**
 * POST /api/simulate-call
 *
 * Demo flow:
 *
 * Agent
 *   ↓
 * Simulated customer conversation
 *   ↓
 * Gemini analysis
 *   ↓
 * Lead creation
 *   ↓
 * Call log
 *   ↓
 * Agent metrics
 *   ↓
 * Dashboard metrics
 */
router.post(
  "/simulate-call",
  async (req, res) => {
    try {
      const {
        agentId,
        scenario,
      } = req.body;

      /* ---------------------------------------------------
         1. Validate agent
      --------------------------------------------------- */

      if (!agentId) {
        return res.status(400).json({
          error:
            "agentId is required",
        });
      }

      const agent =
        getAgentById(agentId);

      if (!agent) {
        return res.status(404).json({
          error:
            "Agent not found",
        });
      }

      /* ---------------------------------------------------
         2. Create demo transcript
      --------------------------------------------------- */

      const customerScenario =
        scenario ||
        "Customer is interested in the business services, pricing, available options, and wants a follow-up from the sales team.";

      const transcript = `
AI Agent: Hello! Thank you for contacting our business. How may I help you today?

Customer: Hi, I would like to know more about your services and pricing.

AI Agent: Absolutely. I can help with that. Could you tell me which service you are interested in?

Customer: I am interested in your business solutions. I would like to understand the available packages and pricing.

AI Agent: Certainly. May I have your name and contact number so our team can follow up with detailed information?

Customer: My name is Rahul Sharma. My phone number is +91 9876543210.

AI Agent: Thank you, Rahul. I have noted your details. Our sales team will contact you with the available options and pricing.

Customer: Perfect. Thank you.

AI Agent: You're welcome. Have a great day!

Customer Scenario:
${customerScenario}
      `.trim();

      /* ---------------------------------------------------
         3. Analyze transcript using Gemini
      --------------------------------------------------- */

      const analysis =
        await analyzeCallTranscript(
          transcript
        );

      /* ---------------------------------------------------
         4. Demo call duration
      --------------------------------------------------- */

      const durationSeconds =
        3 * 60 + 42;

      const duration =
        "3m 42s";

      /* ---------------------------------------------------
         5. Create lead if qualified
      --------------------------------------------------- */

      let createdLead:
        | Lead
        | undefined;

      if (
        analysis.leadGenerated
      ) {
        createdLead = {
          id: `lead-${Date.now()}`,

          agentId:
            agent.id,

          name:
            "Rahul Sharma",

          phone:
            "+91 9876543210",

          email:
            "rahul@example.com",

          intent:
            analysis.intent,

          requirement:
            "Interested in business services, pricing, and available options.",

          budget:
            "Not specified",

          location:
            "India",

          status:
            analysis.leadScore >= 80
              ? "hot"
              : analysis.leadScore >= 60
              ? "warm"
              : "cold",

          leadScore:
            analysis.leadScore,

          createdAt:
            new Date().toISOString(),
        };

        addLead(
          createdLead
        );
      }

      /* ---------------------------------------------------
         6. Create call log
      --------------------------------------------------- */

      const call: CallLog = {
        id: `call-${Date.now()}`,

        agentId:
          agent.id,

        leadId:
          createdLead?.id,

        phoneNumber:
          "+91 9876543210",

        duration,

        language:
          agent.language,

        intent:
          analysis.intent,

        outcome:
          analysis.outcome,

        leadGenerated:
          analysis.leadGenerated,

        leadScore:
          analysis.leadScore,

        createdAt:
          new Date().toISOString(),
      };

      addCallLog(call);

      /* ---------------------------------------------------
         7. Update agent metrics
      --------------------------------------------------- */

      const updatedAgent =
        updateAgentMetrics(
          agent.id,
          durationSeconds,
          analysis.leadGenerated
        );

      /* ---------------------------------------------------
         8. Update dashboard metrics
      --------------------------------------------------- */

      const dashboardStats =
        updateDashboardStats(
          durationSeconds,
          analysis.leadGenerated
        );

      /* ---------------------------------------------------
         9. Return complete result
      --------------------------------------------------- */

      return res.json({
        success: true,
        transcript,
        analysis,
        lead: createdLead,
        call,
        updatedAgent,
        dashboardStats,
      });
    } catch (error) {
      console.error(
        "Simulate call error:",
        error
      );

      return res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to simulate call",
      });
    }
  }
);

export default router;