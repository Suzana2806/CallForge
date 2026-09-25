import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Bot,
  Check,
  Loader2,
  Play,
  Save,
  Sparkles,
  Volume2,
} from "lucide-react";

import * as tts from "@jtsage/piper-tts-web";

import {
  createAgent,
  generateAgentInstructions,
} from "../api/client";

import {
  supportedLanguages,
  supportedTones,
  supportedVoices,
  templates,
} from "../data/templates";

import type {
  AgentLanguage,
  AgentTone,
  AgentVoice,
} from "../types";

interface AgentEditorProps {
  onBack: () => void;
}

const voiceTestSamples: Record<AgentLanguage, string> = {
  English:
    "Hello! I'm your CallForge AI assistant. How can I help you today?",

  Arabic:
    "مرحباً! أنا مساعد CallForge الذكي. كيف يمكنني مساعدتك اليوم؟",

  Spanish:
    "¡Hola! Soy tu asistente de inteligencia artificial de CallForge. ¿Cómo puedo ayudarte hoy?",

  French:
    "Bonjour ! Je suis votre assistant IA CallForge. Comment puis-je vous aider aujourd’hui ?",

  German:
    "Hallo! Ich bin Ihr CallForge-KI-Assistent. Wie kann ich Ihnen heute helfen?",

  Hindi:
    "नमस्ते! मैं आपका CallForge AI सहायक हूँ। मैं आज आपकी कैसे मदद कर सकता हूँ?",

  Kannada:
    "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ CallForge AI ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",

  Malayalam:
    "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ CallForge AI സഹായി ആണ്. ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കും?",

  Tamil:
    "வணக்கம்! நான் உங்கள் CallForge AI உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",

  Italian:
    "Ciao! Sono il tuo assistente AI di CallForge. Come posso aiutarti oggi?",

  Portuguese:
    "Olá! Sou o seu assistente de IA de CallForge. Como posso ajudar você hoje?",

  Japanese:
    "こんにちは！CallForgeのAIアシスタントです。今日はどのようにお手伝いできますか？",

  "Mandarin Chinese":
    "您好！我是您的 CallForge AI 助手。今天我可以怎样帮助您？",
};

const languageCodeMap: Record<AgentLanguage, string> = {
  English: "en-US",
  Arabic: "ar-SA",
  Spanish: "es-ES",
  French: "fr-FR",
  German: "de-DE",
  Hindi: "hi-IN",
  Kannada: "kn-IN",
  Malayalam: "ml-IN",
  Tamil: "ta-IN",
  Italian: "it-IT",
  Portuguese: "pt-BR",
  Japanese: "ja-JP",
  "Mandarin Chinese": "zh-CN",
};

function AgentEditor({ onBack }: AgentEditorProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");

  const [language, setLanguage] =
    useState<AgentLanguage>("English");

  const [voice, setVoice] =
    useState<AgentVoice>("Professional Female");

  const [tone, setTone] =
    useState<AgentTone>("Friendly");

  const [multilingual, setMultilingual] =
    useState(false);

  const [generating, setGenerating] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [testingVoice, setTestingVoice] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [browserVoices, setBrowserVoices] =
    useState<SpeechSynthesisVoice[]>([]);

  const piperAudioRef =
    useRef<HTMLAudioElement | null>(null);

  const piperAudioUrlRef =
    useRef<string | null>(null);

  /* =========================================================
     LOAD BROWSER VOICES
  ========================================================= */

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    const loadVoices = () => {
      setBrowserVoices(
        window.speechSynthesis.getVoices()
      );
    };

    loadVoices();

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      loadVoices
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        loadVoices
      );

      window.speechSynthesis.cancel();

      if (piperAudioRef.current) {
        piperAudioRef.current.pause();
        piperAudioRef.current = null;
      }

      if (piperAudioUrlRef.current) {
        URL.revokeObjectURL(
          piperAudioUrlRef.current
        );

        piperAudioUrlRef.current = null;
      }
    };
  }, []);

  /* =========================================================
     TEMPLATE
  ========================================================= */

  const handleTemplateChange = (
    templateId: string
  ) => {
    const template = templates.find(
      (item) => item.id === templateId
    );

    if (!template) {
      return;
    }

    setName(template.name);
    setDescription(template.description);
    setInstructions(template.instructions);
    setLanguage(template.language);
    setVoice(template.voice);
    setTone(template.tone);

    setError("");
    setSuccess("");
  };

  /* =========================================================
     GENERATE WITH AI
  ========================================================= */

  const handleGenerateAI = async () => {
    if (generating || saving) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedDescription =
      description.trim();

    if (!trimmedName) {
      setError(
        "Please enter the agent name first."
      );
      return;
    }

    if (!trimmedDescription) {
      setError(
        "Please describe what the agent should do first."
      );
      return;
    }

    try {
      setGenerating(true);
      setError("");
      setSuccess("");

      const result =
        await generateAgentInstructions({
          name: trimmedName,
          description: trimmedDescription,
          language,
          tone,
        });

      console.log(
        "CallForge AI generation response:",
        result
      );

      if (!result) {
        throw new Error(
          "No response was received from the AI server."
        );
      }

      if (!result.success) {
        throw new Error(
          result.error ||
            "The AI server could not generate the instructions."
        );
      }

      if (
        typeof result.instructions !== "string" ||
        !result.instructions.trim()
      ) {
        throw new Error(
          "The AI server responded successfully but did not return agent instructions."
        );
      }

      setInstructions(
        result.instructions.trim()
      );

      setSuccess(
        "AI instructions generated successfully."
      );
    } catch (err) {
      console.error(
        "CallForge Generate AI error:",
        err
      );

      setSuccess("");

      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate AI instructions."
      );
    } finally {
      setGenerating(false);
    }
  };

  /* =========================================================
     FIND BROWSER VOICE
  ========================================================= */

  const getBrowserVoice = () => {
    const languageCode =
      languageCodeMap[language];

    const baseLanguage =
      languageCode
        .toLowerCase()
        .split("-")[0];

    const matchingVoices =
      browserVoices.filter((item) =>
        item.lang
          .toLowerCase()
          .startsWith(baseLanguage)
      );

    if (matchingVoices.length === 0) {
      return null;
    }

    const wantsFemale =
      voice
        .toLowerCase()
        .includes("female");

    const genderMatch =
      matchingVoices.find((item) => {
        const voiceName =
          item.name.toLowerCase();

        if (wantsFemale) {
          return (
            voiceName.includes("female") ||
            voiceName.includes("woman") ||
            voiceName.includes("zira") ||
            voiceName.includes("samantha") ||
            voiceName.includes("karen") ||
            voiceName.includes("susan") ||
            voiceName.includes("google")
          );
        }

        return (
          voiceName.includes("male") ||
          voiceName.includes("man") ||
          voiceName.includes("david") ||
          voiceName.includes("mark") ||
          voiceName.includes("alex")
        );
      });

    return (
      genderMatch ||
      matchingVoices[0]
    );
  };

  /* =========================================================
     STOP PIPER AUDIO
  ========================================================= */

  const stopPiperAudio = () => {
    if (piperAudioRef.current) {
      piperAudioRef.current.pause();
      piperAudioRef.current.currentTime = 0;
      piperAudioRef.current = null;
    }

    if (piperAudioUrlRef.current) {
      URL.revokeObjectURL(
        piperAudioUrlRef.current
      );

      piperAudioUrlRef.current = null;
    }
  };

  /* =========================================================
     ARABIC PIPER VOICE
  ========================================================= */

  const handleArabicVoice = async () => {
    try {
      setError("");
      setSuccess("");
      setTestingVoice(true);

      if (
        typeof window !== "undefined" &&
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }

      stopPiperAudio();

      setSuccess(
        "Loading Arabic voice model..."
      );

      const wav = await tts.predict({
        text: voiceTestSamples.Arabic,
        voiceId: "ar_JO-kareem-medium",
      });

      const audioUrl =
        URL.createObjectURL(wav);

      piperAudioUrlRef.current =
        audioUrl;

      const audio =
        new Audio(audioUrl);

      piperAudioRef.current =
        audio;

      audio.onended = () => {
        setTestingVoice(false);

        setSuccess(
          "Arabic voice finished playing."
        );

        stopPiperAudio();
      };

      audio.onerror = () => {
        setTestingVoice(false);

        stopPiperAudio();

        setError(
          "Unable to play the Arabic voice audio."
        );
      };

      await audio.play();

      setSuccess(
        "Arabic voice is playing."
      );
    } catch (err) {
      console.error(
        "Arabic Piper TTS error:",
        err
      );

      setTestingVoice(false);

      stopPiperAudio();

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load the Arabic voice."
      );
    }
  };

  /* =========================================================
     TEST VOICE
  ========================================================= */

  const handleTestVoice = async () => {
    if (language === "Arabic") {
      if (testingVoice) {
        stopPiperAudio();
        setTestingVoice(false);
        setSuccess("");
        return;
      }

      await handleArabicVoice();
      return;
    }

    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      setError(
        "Speech synthesis is not supported in this browser."
      );
      return;
    }

    if (testingVoice) {
      window.speechSynthesis.cancel();
      setTestingVoice(false);
      return;
    }

    const selectedVoice =
      getBrowserVoice();

    if (!selectedVoice) {
      setError(
        `No ${language} voice is installed in your browser. Please try another language or install a ${language} system voice.`
      );
      return;
    }

    try {
      setError("");
      setSuccess("");
      setTestingVoice(true);

      stopPiperAudio();

      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(
          voiceTestSamples[language]
        );

      utterance.voice =
        selectedVoice;

      utterance.lang =
        languageCodeMap[language];

      if (tone === "Professional") {
        utterance.rate = 0.95;
      } else if (tone === "Friendly") {
        utterance.rate = 1;
      } else if (tone === "Casual") {
        utterance.rate = 1.05;
      } else if (tone === "Empathetic") {
        utterance.rate = 0.9;
      } else {
        utterance.rate = 1;
      }

      utterance.pitch =
        voice
          .toLowerCase()
          .includes("female")
          ? 1.05
          : 0.9;

      utterance.volume = 1;

      utterance.onend = () => {
        setTestingVoice(false);
      };

      utterance.onerror = () => {
        setTestingVoice(false);
      };

      window.speechSynthesis.speak(
        utterance
      );

      setSuccess(
        `${language} voice is playing.`
      );
    } catch (err) {
      setTestingVoice(false);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to play the selected voice."
      );
    }
  };

  /* =========================================================
     SAVE AGENT
  ========================================================= */

  const handleSave = async () => {
    if (saving || generating) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedDescription =
      description.trim();
    const trimmedInstructions =
      instructions.trim();

    if (!trimmedName) {
      setError(
        "Please enter an agent name."
      );
      return;
    }

    if (!trimmedDescription) {
      setError(
        "Please describe what the agent should do."
      );
      return;
    }

    if (!trimmedInstructions) {
      setError(
        "Please generate or enter the agent instructions."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const agentPayload = {
        name: trimmedName,
        description: trimmedDescription,
        instructions: trimmedInstructions,
        language,
        voice,
        tone,
        status: "active" as const,
      };

      console.log(
        "CallForge saving agent:",
        agentPayload
      );

      const result =
        await createAgent(agentPayload);

      console.log(
        "CallForge save agent response:",
        result
      );

      if (!result) {
        throw new Error(
          "No response was received from the server."
        );
      }

      if (!result.success) {
        throw new Error(
          result.error ||
            "The server could not save the agent."
        );
      }

      if (!result.agent) {
        throw new Error(
          "The server reported success but did not return the saved agent."
        );
      }

      setSuccess(
        `"${result.agent.name}" was created successfully.`
      );

      /*
       * Give the success message time to appear
       * before returning to the dashboard.
       */
      window.setTimeout(() => {
        onBack();
      }, 1200);
    } catch (err) {
      console.error(
        "CallForge Save Agent error:",
        err
      );

      setSuccess("");

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save the AI agent."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <button
            onClick={onBack}
            disabled={saving}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white disabled:opacity-50"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
              <Bot size={19} />
            </div>

            <span className="text-lg font-bold">
              Create AI Agent
            </span>

          </div>

          <button
            onClick={handleSave}
            disabled={
              saving ||
              generating
            }
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {saving ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Save size={17} />
            )}

            {saving
              ? "Saving..."
              : "Save Agent"}

          </button>

        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        <div className="mb-8">

          <h1 className="text-3xl font-bold tracking-tight">
            Build your AI voice agent
          </h1>

          <p className="mt-2 max-w-2xl text-slate-400">
            Define what your agent should do,
            choose its language and voice, then
            let Gemini generate the instructions.
          </p>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <Check size={17} />
            {success}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

          {/* LEFT */}
          <section className="space-y-6">

            {/* AGENT DETAILS */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

              <div className="mb-6">

                <h2 className="text-lg font-semibold">
                  Agent details
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Start with the business requirement.
                </p>

              </div>

              <div className="space-y-5">

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Agent Name
                  </label>

                  <input
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder="e.g. Dubai Property Lead Agent"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    What should this agent do?
                  </label>

                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value
                      )
                    }
                    placeholder="Describe the business requirement in simple words..."
                    rows={5}
                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Quick Template
                  </label>

                  <select
                    defaultValue=""
                    onChange={(event) =>
                      handleTemplateChange(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  >

                    <option value="">
                      Choose a template...
                    </option>

                    {templates.map(
                      (template) => (
                        <option
                          key={template.id}
                          value={template.id}
                        >
                          {template.name}
                        </option>
                      )
                    )}

                  </select>

                </div>

              </div>

            </div>

            {/* AI INSTRUCTIONS */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

              <div className="mb-5 flex items-center justify-between gap-4">

                <div>

                  <h2 className="text-lg font-semibold">
                    AI Agent Instructions
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Gemini can create the detailed
                    conversation instructions.
                  </p>

                </div>

                <button
                  onClick={handleGenerateAI}
                  disabled={
                    generating ||
                    saving
                  }
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {generating ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Sparkles size={17} />
                  )}

                  {generating
                    ? "Generating..."
                    : "Generate with AI"}

                </button>

              </div>

              <textarea
                value={instructions}
                onChange={(event) =>
                  setInstructions(
                    event.target.value
                  )
                }
                placeholder="Generated agent instructions will appear here..."
                rows={12}
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-600 focus:border-violet-500"
              />

            </div>

          </section>

          {/* RIGHT */}
          <aside className="space-y-6">

            {/* VOICE SETTINGS */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

              <h2 className="mb-5 text-lg font-semibold">
                Voice settings
              </h2>

              <div className="space-y-5">

                {/* LANGUAGE */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Language
                  </label>

                  <select
                    value={language}
                    onChange={(event) => {

                      const selectedLanguage =
                        event.target
                          .value as AgentLanguage;

                      setLanguage(
                        selectedLanguage
                      );

                      setError("");
                      setSuccess("");

                      if (
                        selectedLanguage !==
                        "Arabic"
                      ) {
                        stopPiperAudio();
                      }

                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  >

                    {supportedLanguages.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* VOICE */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Voice
                  </label>

                  <select
                    value={voice}
                    onChange={(event) =>
                      setVoice(
                        event.target
                          .value as AgentVoice
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  >

                    {supportedVoices.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* TONE */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Tone
                  </label>

                  <select
                    value={tone}
                    onChange={(event) =>
                      setTone(
                        event.target
                          .value as AgentTone
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  >

                    {supportedTones.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* VOICE PREVIEW */}
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">

                  <div className="flex items-start gap-3">

                    <Volume2
                      className="mt-0.5 text-blue-400"
                      size={19}
                    />

                    <div>

                      <p className="text-sm font-medium text-blue-300">
                        Voice Preview
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        Test the selected language
                        using the available voice
                        engine.
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={handleTestVoice}
                    disabled={
                      generating ||
                      saving
                    }
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {testingVoice ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />

                        Playing Voice...
                      </>
                    ) : (
                      <>
                        <Play size={17} />

                        Test Voice
                      </>
                    )}

                  </button>

                  <p className="mt-3 text-center text-[11px] text-slate-500">
                    Arabic uses the local Piper AI
                    voice. Other languages use
                    your browser's available voice.
                  </p>

                </div>

                {/* MULTILINGUAL */}
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-4">

                  <div>

                    <p className="text-sm font-medium">
                      Multilingual Agent
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Allow the agent to handle
                      multiple languages.
                    </p>

                  </div>

                  <input
                    type="checkbox"
                    checked={multilingual}
                    onChange={(event) =>
                      setMultilingual(
                        event.target.checked
                      )
                    }
                    className="h-5 w-5 accent-blue-600"
                  />

                </label>

              </div>

            </div>

            {/* HOW IT WORKS */}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-blue-600/10 to-violet-600/10 p-6">

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                <Bot size={22} />
              </div>

              <h3 className="font-semibold">
                How CallForge works
              </h3>

              <div className="mt-5 space-y-4">

                {[
                  [
                    "01",
                    "Define",
                    "Describe the business requirement.",
                  ],
                  [
                    "02",
                    "Generate",
                    "Gemini creates agent instructions.",
                  ],
                  [
                    "03",
                    "Voice",
                    "Choose language, voice and tone.",
                  ],
                  [
                    "04",
                    "Analyze",
                    "Calls become leads and insights.",
                  ],
                ].map(
                  ([number, title, text]) => (
                    <div
                      key={number}
                      className="flex gap-3"
                    >

                      <span className="text-xs font-bold text-blue-400">
                        {number}
                      </span>

                      <div>

                        <p className="text-sm font-medium">
                          {title}
                        </p>

                        <p className="mt-0.5 text-xs leading-5 text-slate-500">
                          {text}
                        </p>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default AgentEditor;

