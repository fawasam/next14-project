/* eslint-disable camelcase */
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "../styles/prism.css";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/context/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudentFlow",
  description:
    "A community-driven platform for students to ask questions and share knowledge. Get help with your homework, assignments, and projects. Explore questions and answers from students around the world.",

  icons: {
    icon: `/assets/images/site-logo.svg`,
  },
  openGraph: {
    type: "website",
    url: "https://studentsflow.vercel.app/",
    title: "StudentFlow",
    description:
      "A community-driven platform for students to ask questions and share knowledge. Get help with your homework, assignments, and projects. Explore questions and answers from students around the world.",
    images: [
      {
        url: `/assets/images/social-logo.png`,
        width: 900,
        height: 800,
        alt: "Og Image Alt",
      },
    ],
  },
  twitter: {
    site: "@studentsflow",
    card: "summary_large_image",
    title: "StudentFlow",
    description:
      "A community-driven platform for students to ask questions and share knowledge. Get help with your homework, assignments, and projects. Explore questions and answers from students around the world.",
    creator: "@fawasam",
    images: {
      url: `/assets/images/social-logo.png`,
      alt: "Preview image for fawasam",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + spaceGrotesk.className}>
        <ClerkProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
