"use client";

import { useState } from "react";

interface CoverLetterProps {
  coverLetter: string;
}

export default function CoverLetter({ coverLetter }: CoverLetterProps) {
  const [editedLetter, setEditedLetter] = useState(coverLetter);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(editedLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = editedLetter;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleDownload() {
    const blob = new Blob([editedLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cover-letter.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            ✉️ Cover Letter
          </h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            AI-generated cover letter tailored to this role
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {isEditing ? "👁 Preview" : "✏️ Edit"}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
          >
            ⬇️ Download
          </button>
        </div>
      </div>
      <div className="p-6">
        {isEditing ? (
          <textarea
            value={editedLetter}
            onChange={(e) => setEditedLetter(e.target.value)}
            rows={20}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900"
          />
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {editedLetter.split("\n").map((line, idx) =>
              line.trim() === "" ? (
                <br key={idx} />
              ) : (
                <p key={idx} className="my-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {line}
                </p>
              )
            )}
          </div>
        )}
        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-blue-900/40 dark:bg-blue-900/20">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 <strong>Tip:</strong> Replace <code>[Your Name]</code>,{" "}
            <code>[Your Email]</code>, <code>[Your Phone]</code>, and{" "}
            <code>[Today&apos;s Date]</code> with your actual information. Click{" "}
            <strong>Edit</strong> to customize the letter further.
          </p>
        </div>
      </div>
    </div>
  );
}
