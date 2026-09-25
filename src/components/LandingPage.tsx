import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronRight,
  Globe2,
  Headphones,
  MessageSquareText,
  PhoneCall,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onExplorePlatform: () => void;
  onViewAgents: () => void;
}

function LandingPage({
  onGetStarted,
  onExplorePlatform,
  onViewAgents,
}: LandingPageProps) {
  const scrollToSection = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <main className="overflow-hidden bg-slate-950 text-white">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />

          <div className="absolute right-[-200px] top-[300px] h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[100px]" />

          <div className="absolute left-[-200px] top-[500px] h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
          <div className="mx-auto max-w-4xl text-center">

            {/* Badge */}

            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 backdrop-blur">
              <Sparkles className="h-4 w-4 text-violet-400" />

              <span>
                AI-powered voice automation for modern
                businesses
              </span>

              <ChevronRight className="h-4 w-4 text-slate-500" />
            </div>

            {/* Heading */}

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Turn every customer call into a
              <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                business opportunity.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
              Build intelligent AI voice agents that
              understand customers, handle conversations,
              identify opportunities, and turn call data
              into actionable business insights.
            </p>

            {/* CTA */}

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={onGetStarted}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-slate-950 shadow-xl shadow-white/10 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Get Started

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={onExplorePlatform}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/[0.08]"
              >
                Explore Platform
              </button>
            </div>

            {/* Trust */}

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                No complex setup
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Multilingual
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Business analytics
              </div>
            </div>
          </div>

          {/* Product Preview */}

          <div className="mx-auto mt-20 max-w-6xl">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-2 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-5 sm:p-7">

                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400/70" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
                    <div className="h-3 w-3 rounded-full bg-green-400/70" />
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/[0.03] px-5 py-1.5 text-xs text-slate-500">
                    app.callforge.ai
                  </div>

                  <div className="w-14" />
                </div>

                <div className="grid gap-5 lg:grid-cols-[220px_1fr]">

                  {/* Sidebar */}

                  <div className="hidden rounded-xl border border-white/10 bg-white/[0.02] p-4 lg:block">
                    <div className="mb-7 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20">
                        <Bot className="h-4 w-4 text-violet-400" />
                      </div>

                      <span className="font-semibold">
                        CallForge
                      </span>
                    </div>

                    <div className="space-y-2">
                      {[
                        "Dashboard",
                        "AI Agents",
                        "Leads",
                        "Call Logs",
                        "Analytics",
                      ].map((item, index) => (
                        <div
                          key={item}
                          className={`rounded-lg px-3 py-2 text-sm ${
                            index === 0
                              ? "bg-violet-500/10 text-violet-300"
                              : "text-slate-500"
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dashboard Preview */}

                  <div>
                    <div className="mb-5">
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Overview
                      </p>

                      <h3 className="mt-1 text-xl font-semibold">
                        Business Dashboard
                      </h3>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {[
                        {
                          label: "Total Calls",
                          value: "1,284",
                          icon: PhoneCall,
                        },
                        {
                          label: "Talk Time",
                          value: "186h",
                          icon: Headphones,
                        },
                        {
                          label: "Leads",
                          value: "326",
                          icon: Target,
                        },
                        {
                          label: "Resolution",
                          value: "82.4%",
                          icon: BarChart3,
                        },
                      ].map((stat) => {
                        const Icon = stat.icon;

                        return (
                          <div
                            key={stat.label}
                            className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500">
                                {stat.label}
                              </span>

                              <Icon className="h-4 w-4 text-violet-400" />
                            </div>

                            <p className="mt-3 text-2xl font-bold">
                              {stat.value}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">

                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">
                              AI Agent Performance
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Calls and lead generation
                            </p>
                          </div>

                          <BarChart3 className="h-5 w-5 text-violet-400" />
                        </div>

                        <div className="space-y-4">
                          <PerformanceBar
                            name="Sales Agent"
                            value="78 leads"
                            width="78%"
                          />

                          <PerformanceBar
                            name="Support Agent"
                            value="32 leads"
                            width="52%"
                          />

                          <PerformanceBar
                            name="Appointment Agent"
                            value="21 leads"
                            width="35%"
                          />
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">
                              Recent Activity
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Latest AI conversations
                            </p>
                          </div>

                          <MessageSquareText className="h-5 w-5 text-cyan-400" />
                        </div>

                        <div className="space-y-3">
                          {[
                            [
                              "Customer enquiry",
                              "Lead generated",
                            ],
                            [
                              "Pricing request",
                              "Follow-up scheduled",
                            ],
                            [
                              "Appointment enquiry",
                              "Booking qualified",
                            ],
                          ].map(
                            ([title, status]) => (
                              <div
                                key={title}
                                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3"
                              >
                                <div>
                                  <p className="text-xs font-medium text-slate-300">
                                    {title}
                                  </p>

                                  <p className="mt-1 text-[11px] text-slate-500">
                                    AI voice conversation
                                  </p>
                                </div>

                                <span className="text-[11px] text-emerald-400">
                                  {status}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =================================================
          FEATURES
          ID: features
      ================================================= */}

      <section
        id="features"
        className="scroll-mt-20 border-t border-white/5 bg-slate-950"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              Platform
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to automate customer
              conversations
            </h2>

            <p className="mt-4 text-slate-400">
              From creating AI agents to understanding
              every conversation, CallForge connects
              voice automation with business intelligence.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            <FeatureCard
              icon={Bot}
              title="AI Voice Agents"
              description="Create specialized AI agents for sales, support, appointments, follow-ups, and customer feedback."
            />

            <FeatureCard
              icon={Globe2}
              title="Multilingual"
              description="Configure agents for different languages, voices, and communication styles."
            />

            <FeatureCard
              icon={MessageSquareText}
              title="Conversation Intelligence"
              description="Analyze conversations to understand intent, outcomes, requirements, and customer needs."
            />

            <FeatureCard
              icon={Target}
              title="Lead Qualification"
              description="Automatically identify potential leads and assign a lead score based on conversation context."
            />

            <FeatureCard
              icon={BarChart3}
              title="Business Analytics"
              description="Track calls, talk time, leads, conversion, resolution, and individual agent performance."
            />

            <FeatureCard
              icon={Zap}
              title="AI-Powered Setup"
              description="Describe your business requirement and let AI generate a starting configuration for your agent."
            />

          </div>
        </div>
      </section>

      {/* =================================================
          HOW IT WORKS
          ID: how-it-works
      ================================================= */}

      <section
        id="how-it-works"
        className="scroll-mt-20 border-t border-white/5 bg-slate-950"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              How It Works
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              From business requirement to AI-powered
              conversation
            </h2>

            <p className="mt-4 text-slate-400">
              CallForge turns a simple business requirement
              into a configurable AI voice agent and
              structured business insight.
            </p>
          </div>

          <div className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <HowItWorksCard
              number="01"
              icon={MessageSquareText}
              title="Define the Requirement"
              description="Describe what you want your AI agent to accomplish for your business."
            />

            <HowItWorksCard
              number="02"
              icon={Bot}
              title="Create the AI Agent"
              description="Configure the agent's purpose, instructions, language, voice, and tone."
            />

            <HowItWorksCard
              number="03"
              icon={PhoneCall}
              title="Handle Conversations"
              description="The AI agent interacts with customers and understands their requests."
            />

            <HowItWorksCard
              number="04"
              icon={BarChart3}
              title="Generate Insights"
              description="CallForge extracts intent, lead information, outcomes, and performance metrics."
            />

          </div>
        </div>
      </section>

      {/* =================================================
          AI AGENTS
          ID: agents
      ================================================= */}

      <section
        id="agents"
        className="scroll-mt-20 border-t border-white/5"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-white/[0.03] to-cyan-500/10 p-8 sm:p-12">

            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-violet-500/10 blur-[100px]" />

            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">

              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-sm font-medium text-violet-300">
                  <Bot className="h-4 w-4" />
                  AI Agents
                </div>

                <h2 className="mt-3 text-3xl font-bold">
                  Build your first AI voice agent.
                </h2>

                <p className="mt-3 text-slate-400">
                  Create an agent, define its purpose,
                  configure its voice and tone, and test it
                  with a simulated customer conversation.
                </p>
              </div>

              <button
                type="button"
                onClick={onViewAgents}
                className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Explore AI Agents

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* =================================================
          FINAL CTA
      ================================================= */}

      <section className="border-t border-white/5">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-8">

          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to build your AI-powered call
            workflow?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Start with a simulated AI conversation and
            explore how CallForge transforms customer
            calls into structured business insights.
          </p>

          <button
            type="button"
            onClick={onGetStarted}
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:bg-violet-500"
          >
            Open CallForge

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

    </main>
  );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.05]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
        <Icon className="h-5 w-5 text-violet-400" />
      </div>

      <h3 className="mt-5 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   HOW IT WORKS CARD
========================================================= */

function HowItWorksCard({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6">

      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">
          <Icon className="h-5 w-5 text-cyan-400" />
        </div>

        <span className="text-3xl font-bold text-white/10">
          {number}
        </span>
      </div>

      <h3 className="mt-6 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   PERFORMANCE BAR
========================================================= */

function PerformanceBar({
  name,
  value,
  width,
}: {
  name: string;
  value: string;
  width: string;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs">
        <span className="text-slate-400">
          {name}
        </span>

        <span className="text-slate-500">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-violet-500"
          style={{ width }}
        />
      </div>
    </div>
  );
}

export default LandingPage;