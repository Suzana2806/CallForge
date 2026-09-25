import { useState } from "react";
import * as tts from "@jtsage/piper-tts-web";

export default function PiperArabicTest() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [voices, setVoices] = useState<unknown[]>([]);

  const loadVoices = async () => {
    try {
      setMessage("Loading available Piper voices...");

      const availableVoices = await tts.voices();

      console.log("Piper voices:", availableVoices);

      setVoices(availableVoices);
      setMessage(`Found ${availableVoices.length} Piper voices. Check Console.`);
    } catch (error) {
      console.error("Voice loading error:", error);
      setMessage("Failed to load Piper voices. Check Console.");
    }
  };

  const testArabic = async () => {
    try {
      setLoading(true);
      setMessage("Loading Arabic voice model...");

      const wav = await tts.predict({
        text: "مرحباً، أهلاً وسهلاً بكم في كول فورج.",
        voiceId: "ar_JO-kareem-medium",
      });

      const audioUrl = URL.createObjectURL(wav);

      const audio = new Audio(audioUrl);

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setLoading(false);
        setMessage("Arabic voice test completed.");
      };

      await audio.play();

      setMessage("Arabic voice is playing...");
    } catch (error) {
      console.error("Arabic TTS error:", error);
      setLoading(false);
      setMessage("Arabic TTS failed. Check the browser Console.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <h1 className="text-3xl font-bold mb-3">
          CallForge Arabic Voice Test
        </h1>

        <p className="text-slate-400 mb-8">
          This page tests the local Piper Arabic voice before we connect it
          to the Agent Editor.
        </p>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={loadVoices}
            className="rounded-xl bg-slate-700 px-5 py-3 font-medium hover:bg-slate-600"
          >
            Check Piper Voices
          </button>

          <button
            onClick={testArabic}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Loading Arabic Voice..." : "Test Arabic Voice"}
          </button>
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4 text-slate-300">
            {message}
          </div>
        )}

        {voices.length > 0 && (
          <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4">
            <p className="mb-3 font-semibold">Available Piper voices:</p>

            <pre className="max-h-80 overflow-auto text-xs text-slate-400">
              {JSON.stringify(voices, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}