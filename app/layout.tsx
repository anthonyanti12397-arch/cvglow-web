import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "CVGlow — AI Resume Builder for Hong Kong",
  description: "Build a targeted resume, check your ATS score, and generate a cover letter — all in one place. Free AI-powered resume builder made for the Hong Kong job market.",
  keywords: "resume builder Hong Kong, CV builder HK, ATS score checker, AI resume, 香港履歷, cover letter generator",
  openGraph: {
    title: "CVGlow — AI Resume Builder for Hong Kong",
    description: "Your AI job hunt copilot. ATS scoring, cover letters, 5 templates, LinkedIn import. Free to start.",
    url: "https://cvglow-web.vercel.app",
    siteName: "CVGlow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CVGlow — AI Resume Builder for Hong Kong",
    description: "Build a targeted resume, check your ATS score, and generate a cover letter — free.",
  },
  metadataBase: new URL("https://cvglow-web.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
