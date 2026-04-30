'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import axios from 'axios'

function DashboardClient({ ownerId }: { ownerId: string }) {
  const router = useRouter()

  const [businessName, setBusinessName] = useState("")
  const [supportEmail, setSupportEmail] = useState("")
  const [knowledge, setKnowledge] = useState("")
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  const handleSetting = async () => {
    if (!ownerId) return showToast("Session expired. Please login again.", "error");
    setLoading(true)

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, businessName, supportEmail, knowledge }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Failed to save settings")
      }

      showToast("Settings updated successfully!");
    } catch (error: any) {
      showToast(error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (ownerId) {
      const handleGetDetails = async () => {
        try {
          const result = await axios.get(`/api/settings/get?ownerId=${ownerId}`)
          setBusinessName(result.data.businessName || "")
          setSupportEmail(result.data.supportEmail || "")
          setKnowledge(result.data.knowledge || "")
        } catch (error) {
          console.error("Error fetching settings:", error)
        }
      }
      handleGetDetails()
    }
  }, [ownerId])

  return (
    <div className='min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200'>
      
      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-full shadow-2xl text-sm font-bold text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-zinc-900'}`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter cursor-pointer" onClick={() => router.push("/")}>
            Support<span className="text-zinc-400">AI</span>
          </div>
          <button className='px-5 py-2 rounded-full border border-zinc-200 text-sm font-semibold hover:bg-zinc-50 transition-all' onClick={()=>router.push("/embed")}>
            Embed Chatbot
          </button>
        </div>
      </motion.div>

      <div className='flex justify-center px-4 py-32'>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className='w-full max-w-3xl bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-zinc-100 p-10 md:p-14'>
          
          <div className='mb-12'>
            <h1 className='text-3xl font-bold tracking-tight'>Knowledge Base</h1>
            <p className='text-zinc-500 mt-2 text-lg'>Configure how your AI assistant interacts with customers.</p>
          </div>

          <div className='space-y-10'>
            <div>
              <label className='block text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4'>Identity</label>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <input
                  type="text"
                  placeholder="Business Name"
                  onChange={(e) => setBusinessName(e.target.value)}
                  value={businessName}
                  className='w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all'
                />
                <input
                  type="email"
                  placeholder="Support Email"
                  onChange={(e) => setSupportEmail(e.target.value)}
                  value={supportEmail}
                  className='w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4'>Training Data</label>
              <textarea
                placeholder="List your FAQs, policies, and business info here..."
                onChange={(e) => setKnowledge(e.target.value)}
                value={knowledge}
                className='w-full h-64 rounded-2xl border border-zinc-200 bg-zinc-50/50 px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none'
              />
            </div>

            <div className='pt-4'>
              <button
                disabled={loading}
                onClick={handleSetting}
                className='w-full md:w-auto px-10 py-4 rounded-2xl bg-black text-white font-bold hover:bg-zinc-800 transition-all disabled:opacity-50'
              >
                {loading ? "Saving Changes..." : "Save Configuration"}
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  )
}

export default DashboardClient