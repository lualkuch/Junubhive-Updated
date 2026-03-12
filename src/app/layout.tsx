import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "JunubHive — Find Your Match",
    template: "%s | JunubHive",
  },
  description:
    "JunubHive is a modern dating app designed for meaningful connections in the Arab world.",
  keywords: ["dating", "matches", "connections", "Arab", "relationships"],
  authors: [{ name: "JunubHive" }],
  creator: "JunubHive",
  publisher: "JunubHive",
  robots: {
    index: false,
    follow: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "JunubHive",
  },
  openGraph: {
    type: "website",
    siteName: "JunubHive",
    title: "JunubHive — Find Your Match",
    description: "Modern dating for meaningful connections.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
