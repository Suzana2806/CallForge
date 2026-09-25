import {
  ArrowRight,
  Bot,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  onDashboard?: () => void;
}

function Navbar({ onDashboard }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleDashboard = () => {
    setMobileOpen(false);

    if (onDashboard) {
      onDashboard();
    }
  };

  return (
    <nav className="relative z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* =====================================================
            LOGO
        ===================================================== */}

        <button
          type="button"
          onClick={handleDashboard}
          className="group flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-900/20 transition group-hover:scale-105">
            <Bot className="h-5 w-5 text-white" />
          </div>

          <span className="text-lg font-bold tracking-tight text-white">
            CallForge
          </span>
        </button>

        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}

        <div className="hidden items-center gap-8 md:flex">

          <button
            type="button"
            onClick={() => scrollToSection("features")}
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Features
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("agents")}
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            AI Agents
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("how-it-works")}
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            How it works
          </button>

        </div>

        {/* =====================================================
            DESKTOP CTA
        ===================================================== */}

        <div className="hidden md:block">
          <button
            type="button"
            onClick={handleDashboard}
            className="group inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Get Started

            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* =====================================================
            MOBILE MENU BUTTON
        ===================================================== */}

        <button
          type="button"
          aria-label={
            mobileOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          onClick={() =>
            setMobileOpen((current) => !current)
          }
          className="rounded-lg border border-white/10 p-2 text-slate-300 transition hover:bg-white/5 hover:text-white md:hidden"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* =====================================================
          MOBILE NAVIGATION
      ===================================================== */}

      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-950 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-2">

            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Features
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("agents")}
              className="rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              AI Agents
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("how-it-works")}
              className="rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              How it works
            </button>

            <button
              type="button"
              onClick={handleDashboard}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Get Started

              <ArrowRight className="h-4 w-4" />
            </button>

          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;