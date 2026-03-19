import type { Metadata } from "next";
import "./globals.css";
import { Navbar, Footer } from "@/components";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Practice Car Hub",
  description: "Made in 2026. Discover the best cars in the world.",
  icons: {
    icon: '/model-icon.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`relative`}
      >
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
