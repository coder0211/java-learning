import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ConvexClerkClientProvider from "@/providers/convex-clerk-client-provider";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/providers/modal-provider";

const inter = Poppins({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "cliptext.com",
  description: "Your video and audio clip to text",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClerkClientProvider>
          {children}
          <ModalProvider />
          <Toaster />
        </ConvexClerkClientProvider>
      </body>
    </html>
  );
}
