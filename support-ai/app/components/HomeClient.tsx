"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

function HomeClient({ email }: { email?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => {
    window.location.href = "/api/auth/login";
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const features = [
    {
      title: "Neural Response",
      desc: "Instant, accurate answers powered by Google Gemini AI.",
      icon: "⚡"
    },
    {
      title: "Enterprise SSO",
      desc: "Secure login for your whole team via ScaleKit.",
      icon: "🛡️"
    },
    {
      title: "24/7 Automation",
      desc: "Support that never sleeps, so you don't have to.",
      icon: "🌐"
    },
  ];

  const firstLetter = email ? email.charAt(0).toUpperCase() : "";

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">
            Support <span className="text-zinc-400">AI</span>
          </div>

          <div className="flex items-center gap-4">
            {email ? (
              <div className="relative" ref={popupRef}>
                <button
                  className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold hover:scale-105 transition-all"
                  onClick={() => setOpen(!open)}
                >
                  {firstLetter}
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden"
                    >
                      <button className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-50" onClick={() => router.push("/dashboard")}>Dashboard</button>
                      <button className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-zinc-50" onClick={handleLogout}>Logout</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                className="px-6 py-2 rounded-full bg-black text-white text-sm font-bold hover:bg-zinc-800 transition-all"
                onClick={handleLogin}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="pt-40 pb-28 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              AI Customer Support <br />
              <span className="text-zinc-400">Built for modern websites</span>
            </h1>

            <p className="mt-6 text-xl text-zinc-500 max-w-2xl mx-auto mb-12">
              Add a powerful AI chatbot to your website in minutes. 
              Let your customers get instant answers using your own knowledge.
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                className="px-8 py-4 rounded-full bg-black text-white font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
                onClick={() => {
                  if (email) {
                    router.push("/dashboard");
                  } else {
                    handleLogin();
                  }
                }}
              >
                {email ? "Go to Dashboard" : "Get Started Free"}
              </button>
              <button 
                className="px-8 py-4 rounded-full border border-zinc-200 bg-white font-bold text-lg hover:bg-zinc-50 transition-all"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* FEATURES SECTION */}
      <section id="features" className="bg-zinc-50/50 py-32 px-6 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-20">Why Businesses Choose SupportAI</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="bg-white p-10 rounded-3xl shadow-sm border border-zinc-100"
              >
                <div className="text-4xl mb-6">{f.icon}</div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 text-center text-zinc-400 text-sm">
        <p>© {new Date().getFullYear()} SupportAI. Designed for Excellence.</p>
      </footer>

    </div>
  );
}

export default HomeClient;