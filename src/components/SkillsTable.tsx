"use client";

import { Skill, Requirement } from "@/types";

interface SkillsTableProps {
  skills: Skill[];
  requirements: Requirement[];
}

const requirementTypeConfig: Record<
  string,
  { label: string; className: string }
> = {
  education: {
    label: "Education",
    className: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  },
  experience: {
    label: "Experience",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  certification: {
    label: "Certification",
    className: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  },
  "soft-skill": {
    label: "Soft Skill",
    className: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  },
  other: {
    label: "Other",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  },
};

export default function SkillsTable({ skills, requirements }: SkillsTableProps) {
  const requiredSkills = skills.filter((s) => s.required);
  const optionalSkills = skills.filter((s) => !s.required);

  return (
    <div className="space-y-6">
      {/* Skills Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            🛠️ Required Skills &amp; Experience
          </h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {requiredSkills.length} required · {optionalSkills.length} nice-to-have
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                  Skill
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                  Level
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                  Experience
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                  Required
                </th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
                >
                  <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                    {skill.skill}
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                    {skill.level}
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                    {skill.yearsOfExperience}
                  </td>
                  <td className="px-6 py-3">
                    {skill.required ? (
                      <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
                        Required
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        Nice-to-have
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Requirements Table */}
      {requirements.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              📋 Requirements
            </h2>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              {requirements.length} requirements identified
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                  <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                    Requirement
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((req, idx) => {
                  const config =
                    requirementTypeConfig[req.type] ??
                    requirementTypeConfig.other;
                  return (
                    <tr
                      key={idx}
                      className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
                    >
                      <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                        {req.requirement}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
                        >
                          {config.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
