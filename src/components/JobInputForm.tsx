"use client";

import { useState } from "react";

interface JobInputFormProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

export default function JobInputForm({ onAnalyze, isLoading }: JobInputFormProps) {
  const [activeTab, setActiveTab] = useState<"text" | "url">("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  async function handleFetchUrl() {
    if (!url.trim()) return;
    setFetchError("");
    setIsFetching(true);
    try {
      const res = await fetch("/api/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFetchError(data.error || "Failed to fetch URL");
      } else {
        setText(data.text);
        setActiveTab("text");
      }
    } catch {
      setFetchError("Network error. Please try again.");
    } finally {
      setIsFetching(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length > 0) {
      onAnalyze(text.trim());
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => setActiveTab("text")}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === "text"
              ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          📋 Paste Job Description
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("url")}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === "url"
              ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          🔗 Enter Job URL
        </button>
      </div>

      <div className="p-6">
        {activeTab === "url" && (
          <div className="mb-4 space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Listing URL (Seek, LinkedIn, Indeed, etc.)
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.seek.com.au/job/..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900"
                onKeyDown={(e) => e.key === "Enter" && handleFetchUrl()}
              />
              <button
                type="button"
                onClick={handleFetchUrl}
                disabled={!url.trim() || isFetching}
                className="whitespace-nowrap rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                {isFetching ? "Fetching…" : "Fetch"}
              </button>
            </div>
            {fetchError && (
              <p className="text-sm text-red-600 dark:text-red-400">{fetchError}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Note: Some job sites block automated access. If fetching fails, paste the description manually.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "text" && (
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Description
            </label>
          )}
          {activeTab === "text" && (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the full job description here…"
              rows={10}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-900"
            />
          )}
          {activeTab === "url" && text && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
              <p className="text-sm text-green-800 dark:text-green-400">
                ✅ Job description fetched ({text.length.toLocaleString()} characters). Ready to analyze.
              </p>
            </div>
          )}
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing with AI…
              </span>
            ) : (
              "🔍 Analyze Job Description"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
