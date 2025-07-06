import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarWrapper } from "@/components/sidebar-wrapper";
import { NavigationProvider } from "@/contexts/navigation-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finance Visualizer",
  description: "Finance Visualizer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
        <NavigationProvider>
          <SidebarProvider>
            <div className="flex h-screen flex-col lg:flex-row overflow-x-hidden">
              <SidebarWrapper />
              <main className="flex-1 overflow-x-hidden">
                {children}
              </main>
            </div>
          </SidebarProvider>
        </NavigationProvider>
      </body>
    </html>
  );
}
