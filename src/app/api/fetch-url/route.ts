import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body as { url: string };

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: "Only HTTP and HTTPS URLs are supported" },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!response.ok) {
      if (response.status === 403 || response.status === 401) {
        return NextResponse.json(
          {
            error:
              "This site does not allow automated access (access forbidden). Please copy the job description text from the page and paste it manually in the text field.",
            isForbidden: true,
          },
          { status: 502 }
        );
      }
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.statusText}. Try pasting the job description text manually.` },
        { status: 502 }
      );
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return NextResponse.json(
        { error: "URL does not point to an HTML page" },
        { status: 400 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove non-content elements
    $(
      "script, style, nav, header, footer, aside, iframe, noscript, [role='navigation'], [role='banner'], [role='complementary']"
    ).remove();

    // Try known job site selectors first
    const selectors = [
      // Seek.com
      "[data-automation='jobAdDetails']",
      ".job-description",
      // LinkedIn
      ".description__text",
      ".show-more-less-html__markup",
      // Indeed
      "#jobDescriptionText",
      ".jobsearch-jobDescriptionText",
      // Generic
      "article",
      "main",
      '[role="main"]',
      ".job-content",
      ".job-details",
      ".content",
    ];

    let jobText = "";
    for (const selector of selectors) {
      const el = $(selector).first();
      if (el.length && el.text().trim().length > 100) {
        jobText = el.text().trim();
        break;
      }
    }

    // Fallback: grab body text
    if (!jobText || jobText.length < 100) {
      jobText = $("body").text().trim();
    }

    // Normalize whitespace
    jobText = jobText.replace(/\s+/g, " ").trim();

    if (jobText.length < 50) {
      return NextResponse.json(
        { error: "Could not extract job description from this URL. Please paste the text manually." },
        { status: 422 }
      );
    }

    return NextResponse.json({ text: jobText });
  } catch (error) {
    console.error("Error fetching URL:", error);
    return NextResponse.json(
      { error: "Failed to fetch URL. The site may be blocking automated access — try pasting the text manually." },
      { status: 500 }
    );
  }
}
