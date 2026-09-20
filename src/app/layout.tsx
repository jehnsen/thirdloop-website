import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { ChatbotWidget } from "@/components/layout/chatbot-widget";
import { isChatbotEnabled } from "@/lib/settings-store";
import { site } from "@/lib/site";
import "./globals.css";

/** Space Grotesk sets every headline; DM Sans carries body copy; JetBrains
 * Mono is reserved for eyebrows, nav, numerals and button labels. */
const display = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const sans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "web development",
    "mobile app development",
    "intelligent automation",
    "AI solutions",
    "business consultancy",
    "software architecture",
    "Next.js agency",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1f3a",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  description: site.description,
  url: site.url,
  email: site.email,
  areaServed: "Worldwide",
  serviceType: [
    "Web Development",
    "Mobile App Development",
    "Intelligent Automation",
    "AI Solutions",
    "Business & Technical Consultancy",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chatbotEnabled = await isChatbotEnabled();

  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="page-bg flex min-h-full flex-col selection:bg-flux-500/30">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-flux-500 focus:px-5 focus:py-2.5 focus:font-mono focus:text-xs focus:tracking-[0.15em] focus:text-ink-950 focus:uppercase"
        >
          Skip to content
        </a>
        {children}
        {chatbotEnabled ? <ChatbotWidget /> : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
