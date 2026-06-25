import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://smoodh.parleagro.com"),
  title: {
    default: "Smoodh by Parlee Agro | Smooth Sips, Bold Flavors",
    template: "%s | Smoodh by Parlee Agro",
  },
  description: "Premium flavoured milk and lassi by Parlee Agro. Smooth sips, bold flavors.",
  openGraph: {
    title: "Smoodh by Parlee Agro",
    description: "Premium flavoured milk and lassi. Smooth sips, bold flavors.",
    url: "https://smoodh.parleagro.com",
    siteName: "Smoodh",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Smoodh by Parlee Agro",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smoodh by Parlee Agro",
    description: "Premium flavoured milk and lassi. Smooth sips, bold flavors.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href="/media/8e9860b6e62d6359-s.woff2" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-gray-50`}>
        <CartDrawer />
        <SmoothScrolling>
          {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}
