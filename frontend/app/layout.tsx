import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navigation } from "./components/Navigation";
import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neuro.Fuse-O-Forge Control Panel",
  description: "Advanced AI Task Orchestration",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="en" 
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} 
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          {/* AI Aura Background Layers */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/15 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-purple-500/10 dark:bg-purple-600/15 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
          </div>

          {/* Glass Header */}
          <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-black/70 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              
              {/* Logo Area */}
              <div className="flex items-center gap-3">
                <div className="group relative">
                  <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-cyan-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                  <div className="relative w-8 h-8 bg-zinc-950 rounded-lg flex items-center justify-center border border-white/10">
                    <span className="text-white font-black text-xs font-mono tracking-tighter">NF</span>
                  </div>
                </div>
                <h1 className="text-sm font-black tracking-widest uppercase hidden sm:block">
                  Neuro<span className="text-blue-500 italic">.</span>Fuse
                </h1>
              </div>

              <Navigation />

              {/* Utility Actions */}
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-inner">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">Syncing</span>
                </div>
                
                <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1 hidden md:block" />
                
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Core Viewport */}
          <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 py-8">
            {children}
          </main>

          {/* Monospaced Status Footer */}
          <footer className="relative z-10 border-t border-zinc-200 dark:border-zinc-800 py-6 px-6 bg-white dark:bg-[#09090b] text-[10px] text-zinc-400 font-mono tracking-widest">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 uppercase">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  <span>Build: stable-1.0.4</span>
                </div>
                <span className="hidden md:block opacity-20">|</span>
                <span className="hidden md:block">Region: EU-WEST-1</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                <span>© 2026 Neuro.Fuse-O-Forge</span>
                <span className="text-[8px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">AI-DRIVEN</span>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
