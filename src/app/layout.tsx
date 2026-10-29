import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { GlobalLoader } from "@/components/GlobalLoader";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/context/ThemeContext";
import { themeScript } from "@/utils/themeScript";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CommandMenu } from "@/components/CommandMenu";
import { cn } from "@/lib/utils";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Pages are prerendered via generateStaticParams on each route; forcing
// static here would also cache not-found renders as HTTP 200.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://devops-cheatsheet.com"),
  title: "DevOps Cheatsheet Hub",
  description: "A comprehensive collection of DevOps tools and practices",
  icons: {
    // Favicons
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    // Apple Touch Icon
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    // Android Chrome Icons
    other: [
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  // Open Graph metadata
  openGraph: {
    title: "DevOps Cheatsheet Hub",
    description: "A comprehensive collection of DevOps tools and practices",
    url: "https://devops-cheatsheet.com",
    siteName: "DevOps Cheatsheet Hub",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  // Twitter metadata
  twitter: {
    card: "summary_large_image",
    title: "DevOps Cheatsheet Hub",
    description: "A comprehensive collection of DevOps tools and practices",
    images: ["/logo.png"],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("h-full", manrope.variable)}>
      <head>
        {/* Set the theme class before first paint to avoid a flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${manrope.className} min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden font-sans`}
      >
        <ThemeProvider>
          <TooltipProvider>
            <GlobalLoader />
            <CommandMenu />
            <Header />
            <main className="flex-grow pt-24">{children}</main>
            <Footer />
            <ScrollToTop />
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                className: "text-sm font-medium",
                style: {
                  background: "var(--toast-bg, #fff)",
                  color: "var(--toast-color, #000)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  borderRadius: "0.5rem",
                },
              }}
            />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
