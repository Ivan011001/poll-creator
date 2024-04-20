import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import StoreProvider from "@/providers/store-provider";
import Transition from "@/components/ui/transition";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "Poll Creator",
  description: "Create and Join polls to decide which option is the best!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} container`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
