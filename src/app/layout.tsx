import "./globals.css";

import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@/components/ui/sonner";
import { ReactQueryProvider } from "@/providers/react-query";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DrAgenda — Gestão de clínicas que cresce com você",
  description:
    "Agenda inteligente com prevenção de conflitos e dashboard financeiro num só painel. Para clínicas que querem crescer sem planilha.",
  openGraph: {
    title: "DrAgenda — Gestão de clínicas que cresce com você",
    description:
      "Agenda inteligente com prevenção de conflitos e dashboard financeiro num só painel.",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DrAgenda — Gestão de clínicas que cresce com você",
    description:
      "Agenda inteligente com prevenção de conflitos e dashboard financeiro num só painel.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {/*
         * Boot script: marks the document as JS-ready as early as possible so
         * the .reveal scroll animations only hide content when JS can animate
         * it back in. If this never runs (JS disabled/failed), .reveal content
         * stays visible by default — the page is never blank.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js-ready');",
          }}
        />
      </head>
      <body className={`${manrope.variable} antialiased`}>
        <ReactQueryProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </ReactQueryProvider>
        <Toaster position="bottom-center" richColors theme="light" />
      </body>
    </html>
  );
}
