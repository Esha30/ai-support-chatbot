'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

function EmbedClient({ ownerId }: { ownerId: string }) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ai-support-chatbot-ten.vercel.app"
  const embedCode = `<script 
  src="${baseUrl}/chatBot.js" 
  data-owner-id="${ownerId}"
  async
></script>`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Copy failed", err)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-200">
      
      {/* PROFESSIONAL NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div onClick={() => router.push("/")} className="text-xl font-bold tracking-tighter cursor-pointer">
            Support<span className="text-zinc-400">AI</span>
          </div>
          <button onClick={() => router.push("/dashboard")} className="px-5 py-2 rounded-full border border-zinc-200 text-sm font-semibold hover:bg-zinc-50 transition-all">
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-4">Integrate your Chatbot</h1>
              <p className="text-zinc-500 text-lg">Copy the snippet below and paste it into your website's HTML to go live.</p>
            </div>

            {/* CODE CONSOLE */}
            <div className="bg-[#0D0D0D] rounded-3xl overflow-hidden shadow-2xl mb-12 border border-white/5">
              <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20" />
                  <span className="ml-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">embed_script.html</span>
                </div>
                <button 
                  onClick={handleCopy}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-zinc-200'}`}
                >
                  {copied ? "COPIED" : "COPY CODE"}
                </button>
              </div>
              <div className="p-8 overflow-x-auto">
                <pre className="text-sm md:text-base font-mono text-zinc-300 leading-relaxed">
                  <code>{embedCode}</code>
                </pre>
              </div>
            </div>

            {/* SETUP GUIDE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="p-8 bg-white border border-zinc-200 rounded-3xl shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold mb-6">1</div>
                <h3 className="text-lg font-bold mb-2">Copy & Paste</h3>
                <p className="text-zinc-500 text-sm">Insert the script tag right before the closing <code className="bg-zinc-100 px-1 rounded text-black">&lt;/body&gt;</code> tag on your site.</p>
              </div>
              <div className="p-8 bg-white border border-zinc-200 rounded-3xl shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold mb-6">2</div>
                <h3 className="text-lg font-bold mb-2">Initialize</h3>
                <p className="text-zinc-500 text-sm">Once the script is loaded, the chat bubble will automatically appear in the bottom-right corner.</p>
              </div>
            </div>

            {/* PREVIEW BOX */}
            <div className="border border-zinc-200 rounded-[32px] bg-white overflow-hidden shadow-sm">
              <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-200 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Live Widget Preview</span>
              </div>
              <div className="relative h-[300px] flex items-center justify-center text-zinc-300 italic font-medium">
                 Your widget will look exactly like this on your site.
                 <div className="absolute bottom-8 right-8 w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl shadow-2xl">💬</div>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      <footer className="py-12 text-center text-zinc-400 text-xs">
        &copy; {new Date().getFullYear()} SupportAI Enterprise. All rights reserved.
      </footer>
    </div>
  )
}

export default EmbedClient