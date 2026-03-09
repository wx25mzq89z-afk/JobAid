import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { JobAnalysis } from "@/types";

const ANALYSIS_PROMPT = `You are an expert job application assistant. Analyze the following job description and extract structured information.

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "jobTitle": "string - the job title",
  "company": "string - the company name or 'Unknown' if not found",
  "keywords": [
    {
      "keyword": "string - the keyword or phrase",
      "category": "string - one of: Technology, Domain, Methodology, Tool, Soft Skill, Industry",
      "importance": "string - one of: high, medium, low"
    }
  ],
  "skills": [
    {
      "skill": "string - the skill name",
      "level": "string - e.g. Senior, Junior, Intermediate, Any",
      "required": boolean,
      "yearsOfExperience": "string - e.g. '3+', '2-5', 'Not specified'"
    }
  ],
  "requirements": [
    {
      "requirement": "string - the requirement description",
      "type": "string - one of: education, experience, certification, soft-skill, other"
    }
  ],
  "coverLetter": "string - a professional cover letter tailored to this job (3-4 paragraphs). Use [Your Name], [Your Email], [Your Phone], [Today's Date] as placeholders. Make it specific to the role and company, highlighting the most important skills and requirements."
}

Guidelines:
- Extract 10-20 meaningful keywords (avoid generic words like "the", "and")
- List all technical and soft skills mentioned
- Cover letter should be professional, enthusiastic, and tailored to the specific role
- Keywords importance: high = appears multiple times or is core to the role, medium = mentioned once as important, low = nice-to-have`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body as { text: string };

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Job description text is required" },
        { status: 400 }
      );
    }

    if (text.trim().length < 50) {
      return NextResponse.json(
        { error: "Job description is too short to analyze" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env.local file." },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });

    // Truncate very long descriptions to avoid token limits
    const truncatedText = text.slice(0, 8000);

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: ANALYSIS_PROMPT },
        {
          role: "user",
          content: `Analyze this job description:\n\n${truncatedText}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2500,
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) {
      return NextResponse.json(
        { error: "No response from AI. Please try again." },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let analysis: JobAnalysis;
    try {
      analysis = JSON.parse(rawContent) as JobAnalysis;
    } catch {
      // Try to extract JSON from the response if there's extra text
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return NextResponse.json(
          { error: "Failed to parse AI response. Please try again." },
          { status: 500 }
        );
      }
      analysis = JSON.parse(jsonMatch[0]) as JobAnalysis;
    }

    // Validate essential fields
    if (!analysis.keywords || !analysis.skills || !analysis.coverLetter) {
      return NextResponse.json(
        { error: "Incomplete analysis from AI. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ analysis, rawText: text });
  } catch (error) {
    console.error("Error analyzing job description:", error);
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: "Invalid OpenAI API key. Please check your configuration." },
          { status: 500 }
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: "OpenAI rate limit reached. Please wait a moment and try again." },
          { status: 429 }
        );
      }
    }
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
