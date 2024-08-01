import type { Metadata } from "next";
import { Bitter } from "next/font/google";
import "./globals.css";

const font = Bitter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Website",
  description: "Website Stuffs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <div className="container mx-auto max-w-4xl">{children}</div>
      </body>
    </html>
  );
}
