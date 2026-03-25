'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import axios from 'axios'

function DashboardClient({ ownerId }: { ownerId: string }) {
  const router = useRouter()

  const [businessName, setBusinessName] = useState("")
  const [supportEmail, setSupportEmail] = useState("")
  const [knowledge, setKnowledge] = useState("")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSetting = async () => {
    setLoading(true)

    try {
      const data = {
        ownerId,
        businessName,
        supportEmail,
        knowledge,
      }

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Failed to save settings")
      }

      const result = await res.json()
      console.log("Settings saved:", result)

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)

    } catch (error: any) {
      console.error("Error saving settings:", error.message)
      alert(`Error saving settings: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (ownerId) {
      const handleGetDetails = async () => {
        try {
          // ✅ FIX: changed POST → GET
          const result = await axios.get(`/api/settings/get?ownerId=${ownerId}`)

          setBusinessName(result.data.businessName)
          setSupportEmail(result.data.supportEmail)
          setKnowledge(result.data.knowledge)
        } catch (error) {
          console.error("Error fetching settings:", error)
        }
      }
      handleGetDetails()
    }
  }, [ownerId])

  return (
    <div className='min-h-screen bg-zinc-50 text-zinc-900'>
      
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="text-lg font-semibold tracking-tight cursor-pointer"
            onClick={() => router.push("/")}
          >
            Support <span className="text-zinc-400">AI</span>
          </div>

          <button className='px-4 py-2 rounded-lg border border-zinc-300 text-sm hover:bg-zinc-100 transition' onClick={()=>router.push("/embed")}>
            Embed Chatbot
          </button>
        </div>
      </motion.div>

      <div className='flex justify-center px-4 py-14 mt-20'>
        <motion.div className='w-full max-w-3xl bg-white rounded-2xl shadow-xl p-10'>
          
          <div className='mb-10'>
            <h1 className='text-2xl font-semibold'>ChatBot Settings</h1>
            <p className='text-zinc-500 mt-1'>
              Manage your AI chatbot and knowledge and business details.
            </p>
          </div>

          <div className='mb-10'>
            <h1 className='text-lg font-medium mb-4'>Business details</h1>

            <div className='space-y-4'>
              <input
                type="text"
                placeholder="Business Name"
                onChange={(e) => setBusinessName(e.target.value)}
                value={businessName}
                className='w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80'
              />

              <input
                type="email"
                placeholder="Support Email"
                onChange={(e) => setSupportEmail(e.target.value)}
                value={supportEmail}
                className='w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80'
              />
            </div>
          </div>

          <div className='mb-10'>
            <h1 className='text-lg font-medium mb-4'>Knowledge</h1>

            <div className='space-y-4'>
              <p className='text-sm text-zinc-500 mb-4'>
                Add FAQ, Policies, delivery info, funds, etc.
              </p>

              <textarea
                placeholder={`Example:
Refund Policy: 7 days return available
Delivery Time: 3-5 working days
Cash on Delivery available
Support Hours`}
                onChange={(e) => setKnowledge(e.target.value)}
                value={knowledge}
                className='w-full h-52 rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80'
              />
            </div>
          </div>

          <div className='flex items-center gap-5'>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.93 }}
              disabled={loading}
              onClick={handleSetting}
              className='px-7 py-4 rounded-xl bg-black text-white text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-60'
            >
              {loading ? "Saving..." : "Save"}
            </motion.button>
          </div>

          {saved && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className=" text-sm font-medium text-emerald-600"
            >
              ✅ Settings Saved Successfully
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  )
}

export default DashboardClient