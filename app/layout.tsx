import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/ui/provider";


const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["500", "900", "700" ]
});

export const metadata: Metadata = {
  title: "My Data Collect",
  description: "A robust data-collection service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable}  antialiased`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
