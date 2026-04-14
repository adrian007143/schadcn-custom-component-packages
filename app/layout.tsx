import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ThemeBuilder } from "@/components/theme/ThemeBuilder";
import { ThemeManager } from "@/components/theme/ThemeManager";
import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "@/redux/StoreProvider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://formkitcn.pro"),
  title: {
    default: "FormKitCN - shadcn/ui Form Toolkit for React",
    template: "%s | FormKitCN",
  },
  description:
    "FormKitCN is a free, open-source registry of schema-driven form components for React. Built on shadcn/ui - install DynamicFormField, FormBuilderStandard, MultiStepForm, DataTable, and more with one CLI command.",
  keywords: [
    "shadcn ui forms",
    "react form builder",
    "schema driven form",
    "react hook form components",
    "dynamic form field",
    "nextjs form components",
    "shadcn registry",
    "formkitcn",
    "multistep form react",
    "tanstack table react",
    "zod form validation",
  ],
  authors: [{ name: "FormKitCN", url: "https://formkitcn.pro" }],
  creator: "FormKitCN",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/images/favicon-logo.png", type: "image/png" }, // fallback for older browsers
    ],
    apple: [{ url: "/images/favicon-logo.png", sizes: "180x180" }],
    shortcut: ["/favicon.svg"],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://formkitcn.pro",
    siteName: "FormKitCN",
    title: "FormKitCN - shadcn/ui Form Toolkit for React",
    description:
      "Schema-driven form components for React. Built on shadcn/ui. Install any block with one CLI command.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "FormKitCN - shadcn/ui Form Components for React",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FormKitCN - shadcn/ui Form Toolkit for React",
    description:
      "Schema-driven form components for React. Built on shadcn/ui. Install any block with one CLI command.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "https://formkitcn.pro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="formkitcn-theme"
          disableTransitionOnChange
        >
          <StoreProvider>
            <ThemeManager />
            <ThemeBuilder />
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
            <Toaster position="top-center" />
          </StoreProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
