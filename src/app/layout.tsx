import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobAid – AI Job Description Analyzer",
  description:
    "Paste a job description or URL to extract keywords, skills, requirements and generate a tailored cover letter using AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
