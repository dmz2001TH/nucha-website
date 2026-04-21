import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "NUCHA INNOVATION VILL PATTAYA | สถาปัตยกรรมแห่งอนาคต",
    template: "%s | NUCHA INNOVATION VILL",
  },
  description:
    "การออกแบบบ้านหรูในพัทยา ด้วยมาตรฐานระดับสากล ผสมผสานความหรูหราเข้ากับความแม่นยำทางวิศวกรรม บริการรับเหมาก่อสร้าง บิวท์อิน ออกแบบครบวงจร",
  keywords: [
    "บ้านหรูพัทยา",
    "วิลล่าพัทยา",
    "สถาปัตยกรรม",
    "Interior Design",
    "Luxury Villa Pattaya",
    "รับเหมาก่อสร้าง",
    "บิวท์อิน",
    "ออกแบบภายใน",
    "โครงการขายพัทยา",
    "อสังหาริมทรัพย์พัทยา",
  ],
  authors: [{ name: "NUCHA INNOVATION VILL PATTAYA" }],
  creator: "NUCHA INNOVATION VILL PATTAYA",
  publisher: "NUCHA INNOVATION VILL PATTAYA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://nucha-innovation.com"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NUCHA INNOVATION VILL PATTAYA | สถาปัตยกรรมแห่งอนาคต",
    description:
      "การออกแบบบ้านหรูในพัทยา ด้วยมาตรฐานระดับสากล บริการรับเหมาก่อสร้าง บิวท์อิน ออกแบบครบวงจร",
    type: "website",
    locale: "th_TH",
    siteName: "NUCHA INNOVATION VILL PATTAYA",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://nucha-innovation.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NUCHA INNOVATION VILL PATTAYA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NUCHA INNOVATION VILL PATTAYA",
    description: "สถาปัตยกรรมแห่งอนาคต - การออกแบบบ้านหรูในพัทยา",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "NUCHA INNOVATION VILL PATTAYA",
    description:
      "การออกแบบบ้านหรูในพัทยา ด้วยมาตรฐานระดับสากล บริการรับเหมาก่อสร้าง บิวท์อิน ออกแบบครบวงจร",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://nucha-innovation.com",
    telephone: "+66-81-234-5678",
    email: "concierge@nucha-innovation.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 ถนนพัทยาสาย 3",
      addressLocality: "พัทยา",
      addressRegion: "ชลบุรี",
      postalCode: "20150",
      addressCountry: "TH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 12.9276,
      longitude: 100.8765,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: "$$$$",
    image:
      process.env.NEXT_PUBLIC_APP_URL + "/og-image.jpg" ||
      "https://nucha-innovation.com/og-image.jpg",
    sameAs: [],
  };

  return (
    <html lang="th" className="antialiased" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon-180x180.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#C41E3A" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- Material Symbols is an icon font, not supported by next/font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 font-body">
        {children}
        <ChatWidget />

        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
