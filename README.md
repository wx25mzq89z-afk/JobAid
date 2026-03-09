# JobAid 🎯

An AI-powered job description analyzer that helps you prepare better job applications.

## Features

- **Paste or fetch** a job description from any URL (Seek, LinkedIn, Indeed, etc.)
- **AI extraction** of keywords, skills, and requirements
- **Keyword table** with categories and importance levels
- **Skills & requirements tables** showing what's required vs. nice-to-have
- **Tailored cover letter** generated automatically based on the job requirements
- **Edit & download** your cover letter

## Tech Stack

- [Next.js 15](https://nextjs.org/) with App Router & TypeScript
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [OpenAI API](https://platform.openai.com/) (GPT-4o mini) for AI analysis
- [Cheerio](https://cheerio.js.org/) for HTML parsing when fetching from URLs

## Setup

### Prerequisites

- Node.js 18+
- An [OpenAI API key](https://platform.openai.com/api-keys)

### Installation

```bash
# Clone the repository
git clone https://github.com/wx25mzq89z-afk/JobAid.git
cd JobAid

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your OpenAI API key
```

### Environment Variables

Create a `.env.local` file in the root directory:

```
OPENAI_API_KEY=sk-your-api-key-here
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. **Paste text**: Copy and paste the full job description into the text area
2. **Or enter URL**: Enter the URL of a job listing (note: some sites block automated access)
3. Click **Analyze Job Description**
4. Review the extracted:
   - 🔑 **Keywords table** – ranked by importance
   - 🛠️ **Skills & Experience table** – required vs. nice-to-have
   - 📋 **Requirements table** – categorized by type
   - ✉️ **Cover Letter** – tailored to the role, with edit and download options
5. Replace placeholder text in the cover letter with your details

## Troubleshooting

### "Access blocked" / Forbidden error when fetching a URL

Some job sites (e.g. LinkedIn, Seek, Indeed) actively block automated requests. When this happens you will see a warning like:

> ⚠️ **Access blocked by this site** — This site does not allow automated access (access forbidden). Please copy the job description text from the page and paste it manually in the text field.

**What to do:**

1. Open the job listing in your browser as usual.
2. Select all the job description text on the page and copy it (`Ctrl+C` / `Cmd+C`).
3. In JobAid, click the **📋 Switch to Paste tab** button that appears in the warning, or click the **Paste Job Description** tab manually.
4. Paste the copied text into the text area and click **Analyze Job Description**.

### Missing or invalid OpenAI API key

If you see an error about an invalid or missing API key:

1. Make sure you have copied `.env.local.example` to `.env.local`.
2. Open `.env.local` and replace the placeholder with your real key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys).
3. Restart the development server (`npm run dev`).

## Deploying to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/wx25mzq89z-afk/JobAid)

Add `OPENAI_API_KEY` as an environment variable in your Vercel project settings.
