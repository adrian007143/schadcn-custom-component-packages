import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import StoreProvider from "@/redux/StoreProvider";
import { ThemeProvider } from "next-themes";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FormKitCn",
    template: "%s | FormKitCn",
  },
  description:
    "A free, open-source form builder for React using shadcn/ui with registry-based components.",

  icons: {
    icon: [{ url: "/images/favicon-logo.png", type: "image/png" }],
    apple: [{ url: "/images/favicon-logo.png", sizes: "180x180" }],
    shortcut: ["/images/favicon-logo.png"],
  },
  
  openGraph: {
    title: "FormKitCn",
    description:
      "A free, open-source form builder for React using shadcn/ui with registry-based components.",
    url: "https://formkitcn.pro",
    siteName: "FormKitCn",
    type: "website",
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
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <StoreProvider>
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
