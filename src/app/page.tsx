"use client";

import { useState } from "react";
import JobInputForm from "@/components/JobInputForm";
import KeywordsTable from "@/components/KeywordsTable";
import SkillsTable from "@/components/SkillsTable";
import CoverLetter from "@/components/CoverLetter";
import { JobAnalysis } from "@/types";

export default function Home() {
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze(text: string) {
    setIsLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to analyze job description.");
      } else {
        setAnalysis(data.analysis);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow">
              J
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                JobAid
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                AI-powered job description analyzer
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
        {/* Hero */}
        {!analysis && !isLoading && (
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Analyze Any Job Description
            </h2>
            <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
              Paste a job posting or URL from Seek, LinkedIn, Indeed and more.
              Get instant AI-powered keyword extraction, skills analysis, and a
              tailored cover letter.
            </p>
          </div>
        )}

        {/* Input Form */}
        <JobInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/40 dark:bg-red-900/20">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        )}

        {/* Results */}
        {analysis && !isLoading && (
          <div className="space-y-6">
            {/* Job header */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-6 py-4 dark:border-blue-800/40 dark:bg-blue-900/20">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {analysis.jobTitle}
              </h2>
              {analysis.company && analysis.company !== "Unknown" && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  🏢 {analysis.company}
                </p>
              )}
            </div>

            <KeywordsTable keywords={analysis.keywords} />
            <SkillsTable
              skills={analysis.skills}
              requirements={analysis.requirements}
            />
            <CoverLetter coverLetter={analysis.coverLetter} />

            {/* Re-analyze button */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setAnalysis(null);
                  setError("");
                }}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                ↩ Analyze Another Job
              </button>
            </div>
          </div>
        )}

        {/* Setup notice (shown when no API key in dev) */}
        {!analysis && !isLoading && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/40 dark:bg-amber-900/20">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>⚙️ Setup required:</strong> Add your OpenAI API key to a{" "}
              <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs dark:bg-amber-900/40">
                .env.local
              </code>{" "}
              file as{" "}
              <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs dark:bg-amber-900/40">
                OPENAI_API_KEY=sk-...
              </code>{" "}
              to enable AI analysis. See the README for setup instructions.
            </p>
          </div>
        )}
      </main>

      <footer className="mt-16 border-t border-gray-200 bg-white/50 py-6 text-center text-xs text-gray-400 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-600">
        JobAid · Powered by OpenAI GPT-4o mini
      </footer>
    </div>
  );
}
