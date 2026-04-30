'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

function EmbedClient({ ownerId }: { ownerId: string }) {

  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const embedCode = `<script src="${baseUrl}/chatbot.js" data-owner-id="${ownerId}"></script>`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)

    } catch (err) {
      console.error("Copy failed", err)
    }
  }

  return (

    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white text-zinc-900">

      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          <div
            onClick={() => router.push("/")}
            className="text-lg font-semibold cursor-pointer tracking-tight"
          >
            Support <span className="text-zinc-400">AI</span>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 rounded-lg border border-zinc-300 text-sm hover:bg-zinc-100 transition"
          >
            Dashboard
          </button>

        </div>
      </div>


      {/* PAGE */}
      <div className="flex justify-center px-6 py-16">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl"
        >

          {/* TITLE */}
          <div className="mb-10">

            <h1 className="text-3xl font-semibold mb-2">
              Embed your AI Chatbot
            </h1>

            <p className="text-zinc-600">
              Add the script below before the
              <code className="mx-1 px-2 py-1 bg-zinc-100 rounded text-sm">
                &lt;/body&gt;
              </code>
              tag on your website.
            </p>

          </div>


          {/* CODE SECTION */}
          <div className="bg-zinc-950 text-zinc-100 rounded-2xl shadow-lg relative mb-10">

            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 text-xs text-zinc-400">
              <span>Embed Script</span>

              <button
                onClick={handleCopy}
                className="text-xs px-3 py-1.5 rounded-md bg-white text-black hover:bg-zinc-200 transition"
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>

            <pre className="p-6 text-sm font-mono overflow-x-auto">
{embedCode}
            </pre>

          </div>


          {/* INSTRUCTIONS */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-12">

            <h3 className="font-semibold mb-4">
              Setup Instructions
            </h3>

            <ol className="space-y-2 text-sm text-zinc-600 list-decimal list-inside">
              <li>Copy the embed script</li>
              <li>Paste it before the closing body tag of your website</li>
              <li>Reload your website</li>
              <li>Your chatbot will appear automatically</li>
            </ol>

          </div>


          {/* LIVE PREVIEW */}
          <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-lg">

            {/* BROWSER BAR */}
            <div className="flex items-center gap-2 px-4 h-10 bg-zinc-100 border-b border-zinc-200">

              <span className="w-3 h-3 rounded-full bg-red-400"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span className="w-3 h-3 rounded-full bg-green-400"></span>

              <div className="ml-4 text-xs text-zinc-500">
                Live Preview
              </div>

            </div>


            {/* PREVIEW AREA */}
            <div className="relative h-[420px] bg-white p-6 flex flex-col gap-3">

              {/* USER MESSAGE */}
              <div className="ml-auto bg-black text-white text-xs px-4 py-2 rounded-lg w-fit shadow">
                Hello
              </div>

              {/* BOT MESSAGE */}
              <div className="bg-zinc-200 text-zinc-800 text-xs px-4 py-2 rounded-lg w-fit shadow">
                Hi 👋 How can I help you today?
              </div>


              {/* CHAT BUTTON */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute bottom-6 right-6"
              >

                <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-xl cursor-pointer hover:scale-105 transition">
                  💬
                </div>

              </motion.div>

            </div>

          </div>


        </motion.div>

      </div>

    </div>

  )
}

export default EmbedClient