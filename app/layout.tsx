import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/navbar";
import "./globals.css";
import Footer from "@/components/footer";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://game-rater.vercel.app/";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Game Rater",
  description: "Rate and review your favorite games",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-retro-background dark:bg-dark-background text-retro-foreground dark:text-dark-text">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <main className="min-h-screen flex flex-col items-center w-full">
            <Navbar />
            <div className="flex-grow flex flex-col gap-20 max-w-5xl p-5 w-full">
              {children}
            </div>
            <Footer />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
