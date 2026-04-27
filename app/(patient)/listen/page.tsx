"use client";

import { useState, useRef } from "react";
import { Mic, Square, Loader2, FileAudio, Copy, Download, RefreshCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";

type AppState = "idling" | "recording" | "transcribing" | "summarizing" | "completed" | "error";

export default function ListenPage() {
  const [appState, setAppState] = useState<AppState>("idling");
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setAppState("recording");
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Microphone access denied or unavailable.");
      setAppState("error");
    }
  };

  const stopRecordingAndAnalyze = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.onstop = handleStopRecording; // Trigger upload
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    // Stop all tracks to release mic
    mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.onstop = null; // Prevent upload handler
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
    handleReset();
  };

  const handleStopRecording = async () => {
    setAppState("transcribing");
    setErrorMsg("");

    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    try {
      // 1. Transcribe via AssemblyAI
      console.log("Starting transcription...");
      const transcribeRes = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!transcribeRes.ok) {
        const errorData = await transcribeRes.json().catch(() => ({ error: "Server crashed or returned invalid response." }));
        throw new Error(errorData.error || `Transcription failed (Status ${transcribeRes.status})`);
      }

      const { text, summary: baseSummary } = await transcribeRes.json();
      setTranscript(text);
      
      // If AssemblyAI already provided a summary, use it as a starting point
      if (baseSummary) {
        setSummary({
          title: "Conversation Summary",
          summary: baseSummary,
          key_points: [],
          action_items: []
        });
      }

      // 2. Enhance via AI Summarizer (Structured JSON)
      await handleSummarize(text);

    } catch (err: any) {
      console.error("Audio Process Error:", err);
      // If it's a fetch error, it might be a timeout or network issue
      const msg = err.message === "Failed to fetch" 
        ? "Network error: The server took too long to respond or is offline. Please check your connection and try again."
        : err.message || "An unexpected error occurred.";
      setErrorMsg(msg);
      setAppState("error");
    }
  };

  const handleSummarize = async (textToSummarize: string) => {
    setAppState("summarizing");
    try {
      const summarizeRes = await fetch("/api/summarize-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: textToSummarize }),
      });

      if (!summarizeRes.ok) {
        const errorData = await summarizeRes.json().catch(() => ({ error: "Summarization service failed." }));
        throw new Error(errorData.error || "Failed to generate structured summary.");
      }

      const summaryData = await summarizeRes.json();
      setSummary(summaryData);
      setAppState("completed");
    } catch (err: any) {
      console.error("Summarization Error:", err);
      setErrorMsg(err.message || "Failed to generate structured summary.");
      // We don't set appState to error here if we already have a transcript, 
      // we just show the error message and stay in 'summarizing' or go to a special state?
      // Let's go to completed if we have a summary, else error.
      if (transcript || textToSummarize) {
         setAppState("completed"); // At least show the transcript
      } else {
         setAppState("error");
      }
    }
  };

  const handleReset = () => {
    setAppState("idling");
    setTranscript("");
    setSummary(null);
    setErrorMsg("");
    setRecordingDuration(0);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="page-bg flex flex-col">
      <div className="page-blob-tl" />
      <div className="page-blob-br" />
      <DisclaimerBanner />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 flex flex-col gap-8 relative z-10">
        <div>
          <h1 className="font-['Sora'] text-3xl font-bold tracking-tight text-[#1a2340]">Audio <span className="text-[#2ab8c8]">Translation</span></h1>
          <p className="text-[#5a7080] mt-2">
            Record a live medical conversation. Our AI will transcribe the audio perfectly and generate a structured summary.
          </p>
        </div>

        {/* Recording Control Panel */}
        <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6">
          <div className="flex items-center justify-center h-24 w-24 rounded-full bg-muted/50 border border-white/20">
            {appState === "recording" ? (
              <div className="relative flex h-10 w-10">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-10 w-10 bg-red-500"></span>
              </div>
            ) : appState === "transcribing" || appState === "summarizing" ? (
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            ) : appState === "completed" ? (
              <FileAudio className="h-10 w-10 text-emerald-500" />
            ) : (
              <Mic className="h-10 w-10 text-muted-foreground" />
            )}
          </div>

          <div className="space-y-1">
            <h2 className="textxl font-semibold">
              {appState === "idling" && "Ready to record"}
              {appState === "recording" && "Recording in progress..."}
              {appState === "transcribing" && "Transcribing audio (AssemblyAI)..."}
              {appState === "summarizing" && "Generating structured summary..."}
              {appState === "completed" && "Processing Complete"}
              {appState === "error" && "Error Occurred"}
            </h2>
            {appState === "recording" && (
              <p className="text-2xl font-mono text-red-500">{formatTime(recordingDuration)}</p>
            )}
            {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
          </div>

          <div className="flex gap-4">
            {(appState === "idling" || appState === "error") && (
              <Button onClick={startRecording} size="lg" className="rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <Mic className="w-5 h-5 mr-2" />
                Start Listening
              </Button>
            )}

            {appState === "recording" && (
              <>
                <Button onClick={cancelRecording} variant="ghost" size="lg" className="rounded-full shadow-lg animate-in zoom-in duration-300 border bg-white/5 hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="w-5 h-5 mr-2" />
                  Cancel
                </Button>
                <Button onClick={stopRecordingAndAnalyze} variant="destructive" size="lg" className="rounded-full shadow-lg animate-in zoom-in duration-300">
                  <Square className="w-5 h-5 mr-2 animate-pulse" />
                  Stop & Translate
                </Button>
              </>
            )}

            {appState === "completed" && (
              <div className="flex gap-2">
                <Button onClick={() => handleSummarize(transcript)} variant="ghost" size="lg" className="rounded-full border border-primary/20 hover:bg-primary/5">
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Retry Summary
                </Button>
                <Button onClick={handleReset} variant="outline" size="lg" className="rounded-full shadow-md">
                  <Mic className="w-5 h-5 mr-2" />
                  New Recording
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        {appState === "completed" && summary && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-8 duration-700">
            {/* Summary Card */}
            <div className="glass rounded-3xl p-6 flex flex-col h-full border-[#2ab8c8]/20 shadow-[0_0_30px_-10px_rgba(42,184,200,0.3)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">AI Insight Summary</h3>
                <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(JSON.stringify(summary, null, 2))}>
                  <Copy className="w-4 h-4 mr-2" /> Copy
                </Button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">Topic</h4>
                  <p className="text-foreground font-medium text-lg">{summary.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">Overview</h4>
                  <p className="text-muted-foreground leading-relaxed">{summary.summary}</p>
                </div>
                {summary.key_points && summary.key_points.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">Key Points</h4>
                    <ul className="list-disc list-inside space-y-1 text-foreground/90">
                      {summary.key_points.map((point: string, i: number) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {summary.action_items && summary.action_items.length > 0 && (
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">Action Items</h4>
                    <ul className="list-decimal list-inside space-y-1 text-foreground">
                      {summary.action_items.map((action: string, i: number) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Transcript Card */}
            <div className="glass rounded-3xl p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Raw Transcript</h3>
                <Button variant="ghost" size="sm" onClick={() => {
                  const blob = new Blob([transcript], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'transcript.txt';
                  a.click();
                }}>
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
              </div>
              
              <div className="flex-1 bg-muted/30 border rounded-xl p-4 overflow-y-auto max-h-[600px]">
                <p className="whitespace-pre-wrap leading-relaxed text-sm text-foreground/80 font-mono">
                  {transcript}
                </p>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
