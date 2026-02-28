import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AutoStep - İşinizi Otomatiğe Bağlayın",
  description: "Yapay zeka destekli otomasyon platformu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      {/* suppressHydrationWarning={true} ekleyerek 
        tarayıcı eklentilerinin neden olduğu uyumsuzluk 
        hatalarını (Hydration Mismatch) engelliyoruz.
      */}
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
        {/* Bildirim pencereleri için Toaster */}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}