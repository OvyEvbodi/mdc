import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Nav from "@/components/Nav";
import { auth } from "@/lib/auth";


const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["500", "900", "700" ]
});

export const metadata: Metadata = {
  title: "My Data Collect",
  description: "A robust data-collection service.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable}  antialiased`}
      >
        <Nav session={session} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
