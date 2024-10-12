import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Essence AI",
  description: "We help you find the important parts of your notes.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} dark h-screen overflow-auto bg-gradient-to-br from-stone-800 to-stone-950`}
    >
      <body>{children}</body>
    </html>
  );
}
