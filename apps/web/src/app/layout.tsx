import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import { SiteFooter } from "../components/layout/site-footer";
import { SiteHeader } from "../components/layout/site-header";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

function metadataBase(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return new URL(explicit);
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return new URL(`https://${vercel}`);
  }
  return new URL("http://localhost:3000");
}

export const metadata: Metadata = {
  metadataBase: metadataBase(),
  title: {
    default: "Vercel Swag Store",
    template: "%s | Vercel Swag Store",
  },
  description:
    "Premium swag for developers who build with Vercel. Tees, gear, and accessories from the official store.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Vercel Swag Store",
    title: "Vercel Swag Store",
    description:
      "Premium swag for developers who build with Vercel. Tees, gear, and accessories from the official store.",
    images: [
      {
        url: "/hero-swag-store-vercel-dark.png",
        width: 1440,
        height: 600,
        alt: "Vercel Swag Store merchandise",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vercel Swag Store",
    description:
      "Premium swag for developers who build with Vercel. Tees, gear, and accessories from the official store.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SiteHeader />
        <main id="main">{children}</main>
        <Suspense
          fallback={
            <footer className="border-t border-border bg-surface px-5 py-6">
              <p className="mx-auto max-w-6xl text-center text-[0.8125rem] text-muted">
                © Vercel Swag Store. All rights reserved.
              </p>
            </footer>
          }
        >
          <SiteFooter />
        </Suspense>
      </body>
    </html>
  );
}
