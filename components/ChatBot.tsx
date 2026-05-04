'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ThinkingStatus = () => {
  const [status, setStatus] = useState('Thinking')
  const statuses = ['Thinking', 'Analyzing', 'Formulating', 'Crafting']

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(prev => {
        const currentIndex = statuses.indexOf(prev)
        return statuses[(currentIndex + 1) % statuses.length]
      })
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return <>{status}</>
}

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [browserId, setBrowserId] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [userName, setUserName] = useState<string>("Stranger")
  const [isRecognizedByIp, setIsRecognizedByIp] = useState(false)
  const [customGreeting, setCustomGreeting] = useState<string | null>(null)
  const [deviceContext, setDeviceContext] = useState<Record<string, any> | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // 1. Initialize Browser ID and Check Identity
  useEffect(() => {
    // Browser ID logic
    let bid = localStorage.getItem('ut_visitor_id')
    if (!bid) {
      bid = crypto.randomUUID()
      localStorage.setItem('ut_visitor_id', bid)
    }
    setBrowserId(bid)

      // Collect live device context async (battery, network, timezone, etc.)
      // Fire-and-forget — sets state when ready, used in every subsequent chat POST
      ; (async () => {
        const ctx: Record<string, any> = {}

        // Battery
        try {
          const battery = await (navigator as any).getBattery()
          ctx.battery = { level: Math.round(battery.level * 100), charging: battery.charging }
        } catch { }

        // Network
        const conn = (navigator as any).connection
        if (conn) ctx.network = { type: conn.effectiveType, saveData: !!conn.saveData }

        // Screen
        ctx.screen = `${window.screen.width}x${window.screen.height}`
        ctx.pixelRatio = window.devicePixelRatio
        ctx.touchscreen = navigator.maxTouchPoints > 0

        // Language, Timezone, Local Time
        ctx.language = navigator.language
        ctx.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        ctx.localTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

        // Preferences
        ctx.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

        // Hardware (not all browsers expose these)
        if ((navigator as any).hardwareConcurrency) ctx.cpuCores = (navigator as any).hardwareConcurrency
        if ((navigator as any).deviceMemory) ctx.ramGB = (navigator as any).deviceMemory

        setDeviceContext(ctx)
      })()

    // Fetch identity based on browser ID or IP
    // Pass document.referrer so the backend knows if they came from Instagram, LinkedIn, etc.
    const referrer = encodeURIComponent(document.referrer || '')
    fetch(`/api/chat?browserId=${bid}&referrer=${referrer}`)
      .then(res => res.json())
      .then(data => {
        if (data.userName) setUserName(data.userName)
        if (data.isRecognizedByIp) setIsRecognizedByIp(true)
        if (data.customGreeting) setCustomGreeting(data.customGreeting)
      })
      .catch(err => console.error("Failed to fetch identity", err))

    // We no longer load 'ut_chat_history' here to ensure a fresh start
  }, [])

  // 2. Welcome Popup Logic (1 second after mount or opening)
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const timer = setTimeout(() => {
        setShowWelcome(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, messages.length])

  // We no longer save history to localStorage here

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Handle mobile keyboard opening (visual viewport shrinks)
  useEffect(() => {
    const handleResize = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }
    window.addEventListener('resize', handleResize)
    window.visualViewport?.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.visualViewport?.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleSend = async (overrideMessage?: string) => {
    const messageToSend = overrideMessage || input.trim()
    if (!messageToSend || isLoading) return

    // If they clicked the confirmation button, we might want to just handle it
    const isConfirmation = messageToSend === 'Yes, that is me!'

    const userMessage: Message = { role: 'user', content: messageToSend }
    const updatedMessages = [...messages, userMessage]

    if (!overrideMessage) setInput('')
    setMessages(updatedMessages)
    setIsLoading(true)
    setShowWelcome(false)

    try {
      const responsePromise = fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          browserId: browserId,
          deviceContext: deviceContext // Live device data (battery, network, timezone, etc.)
        }),
      })

      const [response] = await Promise.all([
        responsePromise,
        new Promise(resolve => setTimeout(resolve, 1500))
      ])

      const data = await response.json()

      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      } else if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }])
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }])
    } finally {
      setIsLoading(false)
    }
  }

  const clearHistory = () => {
    setMessages([])
    setShowWelcome(true)
    setCustomGreeting(null) // Clear old greeting while loading

    // Re-fetch identity in case facts or name changed during the session
    if (browserId) {
      fetch(`/api/chat?browserId=${browserId}`)
        .then(res => res.json())
        .then(data => {
          if (data.userName) setUserName(data.userName)
          if (data.isRecognizedByIp) setIsRecognizedByIp(true)
          if (data.customGreeting) setCustomGreeting(data.customGreeting)
        })
        .catch(err => console.error("Failed to fetch identity", err))
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 flex h-[450px] max-h-[calc(100dvh-100px)] w-[calc(100vw-48px)] sm:w-[350px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/80 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-white/5">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">UT AI Assistant</span>
              </div>
              <div className="flex items-center gap-3">
                {messages.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-[9px] uppercase tracking-tighter text-white/20 hover:text-red-400 transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
              {messages.length === 0 && !showWelcome && (
                <div className="text-center mt-10">
                  <p className="text-[11px] text-white/30 italic uppercase tracking-wider">Connecting to Memory...</p>
                </div>
              )}

              <AnimatePresence>
                {showWelcome && messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-xs text-white/80 leading-relaxed mb-3 font-medium">
                        {userName === "Stranger"
                          ? "I am UT, I remember the things that he actually forgets. what's your name? (try me)"
                          : isRecognizedByIp
                            ? `You look familiar... are you ${userName}?`
                            : customGreeting
                              ? customGreeting
                              : `Welcome back, ${userName}. Good to see you again.`}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(userName === "Stranger"
                          ? ["I'm nobody special", "Ask me something weird"]
                          : isRecognizedByIp
                            ? ['Yes, that is me!', 'No, I am someone else']
                            : ['What are you working on?', 'Tell me a secret']
                        ).map(q => (
                          <button
                            key={q}
                            onClick={() => handleSend(q)}
                            className="text-[10px] bg-white/10 hover:bg-white/20 text-white/60 px-3 py-1.5 rounded-full border border-white/5 transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${m.role === 'user'
                    ? 'bg-white/10 text-white border border-white/5'
                    : 'bg-white/5 text-white/80 border border-white/5'
                    }`}>
                    {m.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 rounded-xl px-3 py-2 border border-white/5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex gap-1">
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="h-1 w-1 rounded-full bg-white/40" />
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-1 w-1 rounded-full bg-white/40" />
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-1 w-1 rounded-full bg-white/40" />
                      </div>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[8px] uppercase tracking-[0.2em] text-white/20 font-bold"
                      >
                        <ThinkingStatus />
                      </motion.span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading}
                  className="absolute right-2 text-white/40 hover:text-white transition-colors disabled:opacity-50"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-xl hover:bg-white/90 transition-colors"
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </motion.button>
    </div>
  )
}
