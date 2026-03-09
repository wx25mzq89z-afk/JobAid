export interface Keyword {
  keyword: string;
  category: string;
  importance: "high" | "medium" | "low";
}

export interface Skill {
  skill: string;
  level: string;
  required: boolean;
  yearsOfExperience: string;
}

export interface Requirement {
  requirement: string;
  type: "education" | "experience" | "certification" | "soft-skill" | "other";
}

export interface JobAnalysis {
  jobTitle: string;
  company: string;
  keywords: Keyword[];
  skills: Skill[];
  requirements: Requirement[];
  coverLetter: string;
}

export interface AnalyzeRequest {
  text?: string;
  url?: string;
}

export interface AnalyzeResponse {
  analysis: JobAnalysis;
  rawText: string;
}
