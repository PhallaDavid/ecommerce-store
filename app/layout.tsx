import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Kantumruy_Pro } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import TopLoader from "@/components/TopLoader"

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const katumruyPro = Kantumruy_Pro({
  subsets: ["khmer"],
  variable: "--font-katumruy-pro",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "R4kie.S ",
  description: "R4kie.S is a ecommerce store ",
  icons: {
    icon: [
      {
        url: "/images/logo.jpg",
        type: "image/jpeg",
      },
      {
        url: "/images/logo.jpg",
        sizes: "any",
        type: "image/jpeg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, katumruyPro.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <TopLoader />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
