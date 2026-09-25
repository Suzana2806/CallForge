import { useState } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import AgentEditor from "./components/AgentEditor";

type View = "home" | "dashboard" | "agent-editor";

function App() {
  const [view, setView] = useState<View>("home");

  const goHome = () => setView("home");
  const goDashboard = () => setView("dashboard");
  const goAgentEditor = () => setView("agent-editor");

  if (view === "agent-editor") {
    return <AgentEditor onBack={goDashboard} />;
  }

  if (view === "dashboard") {
    return (
      <Dashboard
        onBack={goHome}
        onCreateAgent={goAgentEditor}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar onDashboard={goDashboard} />

      <LandingPage
        onGetStarted={goDashboard}
        onExplorePlatform={goDashboard}
        onViewAgents={goDashboard}
      />
    </div>
  );
}

export default App;