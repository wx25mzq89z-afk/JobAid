"use client";

import { Keyword } from "@/types";

interface KeywordsTableProps {
  keywords: Keyword[];
}

const importanceConfig = {
  high: {
    label: "High",
    className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  },
  medium: {
    label: "Medium",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
  low: {
    label: "Low",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  },
};

export default function KeywordsTable({ keywords }: KeywordsTableProps) {
  const sorted = [...keywords].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.importance] - order[b.importance];
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          🔑 Keywords
        </h2>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          {keywords.length} keywords extracted from the job description
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
              <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                Keyword
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                Category
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                Importance
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((kw, idx) => {
              const imp = importanceConfig[kw.importance] ?? importanceConfig.low;
              return (
                <tr
                  key={idx}
                  className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
                >
                  <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                    {kw.keyword}
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                    {kw.category}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${imp.className}`}
                    >
                      {imp.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
