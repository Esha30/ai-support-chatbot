"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

function HomeClient({ email }: { email?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => { window.location.href = "/api/auth/login"; };
  
  const handleLogout = async () => {
    await fetch("/api/auth/logout");
    window.location.href = "/";
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const features = [
    { title: "Neural Logic", desc: "Powered by Gemini 1.5 Flash for human-like reasoning.", icon: "🧠" },
    { title: "Ghost Integration", desc: "Invisible script tag. Loads in milliseconds.", icon: "👻" },
    { title: "Secure Vault", desc: "Enterprise SSO via ScaleKit for maximum security.", icon: "🛡️" },
    { title: "Live Insights", desc: "Real-time analytics for every conversation.", icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-zinc-500 selection:text-white">
      
      {/* GLOW BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-zinc-900/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-zinc-800/20 blur-[120px]" />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black">S</div>
            Support<span className="text-zinc-500">AI</span>
          </div>

          <div className="flex items-center gap-6">
            {!email ? (
              <button onClick={handleLogin} className="px-5 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all">
                Sign In
              </button>
            ) : (
              <div className="relative" ref={popupRef}>
                <button onClick={() => setOpen(!open)} className="w-9 h-9 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center hover:border-white/30 transition-all">
                  {email.charAt(0).toUpperCase()}
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-3 w-48 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                      <button onClick={() => router.push("/dashboard")} className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors">Dashboard</button>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors">Logout</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-zinc-400 mb-8 inline-block">
              ScaleKit + Google Gemini 1.5 Powered
            </span>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              Support at the <br /> speed of thought.
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
              The world's most advanced AI customer support widget. 
              Install in seconds, automate for a lifetime.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={handleLogin} className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 active:scale-95 transition-all">
                Get Started Free
              </button>
              <button className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/10 bg-white/5 font-bold text-lg hover:bg-white/10 transition-all">
                View Demo
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* FEATURE BENTO GRID */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <motion.div whileHover={{ y: -5 }} className="md:col-span-2 bg-zinc-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
              <div className="text-3xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-3">Enterprise SSO Integration</h3>
              <p className="text-zinc-400">ScaleKit provides your business with seamless SAML and OIDC authentication out of the box.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-zinc-800/30 border border-white/5 rounded-3xl p-8">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3">0.1s Latency</h3>
              <p className="text-zinc-400 text-sm">Lightning fast responses with Gemini 1.5 Flash.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-zinc-800/30 border border-white/5 rounded-3xl p-8">
              <div className="text-3xl mb-4">🪄</div>
              <h3 className="text-xl font-bold mb-3">No-Code</h3>
              <p className="text-zinc-400 text-sm">Copy one script tag and you're ready.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="md:col-span-4 bg-gradient-to-r from-zinc-900 to-black border border-white/5 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="max-w-md">
                 <h3 className="text-2xl font-bold mb-4">Built for scale</h3>
                 <p className="text-zinc-400">Whether you handle 10 or 10,000 tickets a day, SupportAI handles them with the same precision and speed.</p>
               </div>
               <div className="h-20 w-full md:w-64 bg-white/5 rounded-xl border border-white/10 animate-pulse" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-zinc-600 text-sm italic">"Redefining customer relations through intelligent automation."</p>
        <p className="mt-8 text-zinc-500 text-xs">© {new Date().getFullYear()} SupportAI. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default HomeClient;