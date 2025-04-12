import { type Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import { Toaster } from "@/components/ui/toaster";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Deep Research UI",
  description: "The Ultimate Study Tool",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
