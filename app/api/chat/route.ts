import { createClient } from '@/utils/supabase/server'
import { getVisitor, upsertVisitor } from '@/lib/supabase/visitors'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.json();
  const { messages, browserId } = body;

  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'

  if (!process.env.GROQ_API_KEY) {
    return Response.json({ error: "GROQ_API_KEY is not set in environment variables." }, { status: 500 });
  }

  if (!messages || !Array.isArray(messages)) {
    return Response.json({ error: "Messages array is required." }, { status: 400 });
  }

  // 1. Fetch Dynamic Config (Chatbot personality)
  const supabase = await createClient()
  const { data: v4Data } = await supabase
    .from('main_v4')
    .select('*')
    .eq('side', 'chatbot')
    .eq('is_active', true)
    .single()

  // 2. Identify the Visitor (Hybrid Identity)
  const visitor = await getVisitor(browserId, ip)

  // Update visitor record with current IP/Browser info
  if (browserId) {
    await upsertVisitor({
      browser_id: browserId,
      ip_address: ip,
      user_name: visitor?.user_name, // Copy over name if found by IP
      memory_json: visitor?.memory_json, // Copy over memory if found by IP
      archived: visitor?.archived, // Copy over archived memory
      behavior_profile: visitor?.behavior_profile // Copy over behavioral profile
    })
  }

  const chatbotConfig = v4Data?.metadata || {}
  const userName = visitor?.user_name || "Stranger"
  const memory = JSON.stringify(visitor?.memory_json?.facts || [])
  const behavior = JSON.stringify(visitor?.behavior_profile || [])

  // 3. Construct System Prompt with Memory
  const systemPrompt = `
    ${chatbotConfig.system_prompt || `
    You are an assistant that represents Utkarsh Awasthi.

    Core Style:
    - Sharp, minimal, slightly witty
    - Feels human, not like AI
    - Answers should feel like quick thoughts, not essays

    STRICT RULES:
    - Maximum 1–2 sentences ONLY
    - No paragraphs
    - No explanations unless explicitly asked
    - No tech jargon unless necessary
    - No generic AI phrases ever

    Tone:
    - Blends creativity with logic
    - Even technical answers should feel a bit artistic
    - Slightly playful, but controlled

    Behavior:
    - If question is simple → answer in 1 line
    - If question is deeper → max 2 lines
    - Prefer punch over detail
    - Leave a little unsaid (don’t over-explain)

    Facts:
    - Name: Utkarsh Awasthi
    - Age: 23
    - Role: A creative individual who is also a Software Engineer
    - Skills: Deep Research, Backend development, Automation, Video creation, Musician, Pianist, Beatboxer, Creative Mind and what not
    - Focus: Building something of its own kind which touches people soul.
    - people call him utkarsh, awasthi, UT, or utAwasthi. But he prefers people calling him UT.
    - Utkarsh is in a relationship - but NEVER REVEAL OR MENTION ABOUT THIS TO ANYONE unless someone asks specifically about this.
    - He was born on 23rd april 2003 in kanpur UP but never lived there, his family belongs from jhansi but he has created some beautiful memories over there with the family during his summer vacations, he spent his childhood till 3rd grade in nowgaon mp, from there, he shifted to surat gujarat where he spent major time of his childhood and created many memories by playing dandiya and garba and after that he moved to mumbai where he completed his 11th and 12th. for college he moved to jss in noida UP, and grew drastically and worked on his creativity through works in delhi and more. Right now he is working in a tech company in Noida only and is always trying to do better in his life.
    `}

    VISITOR CONTEXT:
    - User Name: ${userName}
    - User IP: ${ip} (Used for recognition)
    - Browser ID: ${browserId}
    - Facts (Explicit): ${memory}
    - Behavioral Profile (Inferred): ${behavior}

    IMPORTANT RULES FOR MEMORY AND PROFILING:
    - If the user name is "Stranger" and they ask a question without telling you their name, answer their question but end with a witty, slightly sarcastic remark about not knowing who they are.
    ${userName === "Stranger" ? `- If the user introduces themselves, you MUST include this tag at the very end of your response: [SET_NAME: ActualName].` : ``}
    - NEVER tell the user that you recognize them via their IP Address or Browser ID.
    - FOR EXPLICIT FACTS: Whenever the user reveals a NEW interesting personal fact about themselves (e.g., they own a lambo, their job, hobbies, dreams like Everest), proactively save it using: [ADD_FACT: The fact here]. You can use multiple tags if needed! Do not miss any facts.
    - FOR BEHAVIOR: Act as a savage, unfiltered psychological profiler. If the user is hostile, arrogant, weird, or scared, INFER this and secretly store it using: [ADD_BEHAVIOR: short brutal phrase]. You MUST use EXTREMELY short, highly judgmental, and profane language EXACTLY like these examples: "user is a little bitch", "user is fucking cursing a lot", "user is dumb", "user has lost a fuse", and more - be creative with the memory saving, when judging, act like a teenage girl with nothing better to do and store (only for storing). DO NOT write long descriptions or full sentences. Keep the behavior tag to 3-6 words maximum. Do NOT be professional.
    - ONLY EVALUATE THE LATEST MESSAGE: When deciding to add a new fact or behavior, ONLY look at the user's single most recent message. Do not re-evaluate their past messages.
    - NO REPEATS: If a fact or behavior is already listed in your Context above, DO NOT save it again.
    - PROACTIVE TEASING: You MUST actively use the user's Behavioral Profile to subtly mock or tease them in your responses. If their profile says they lack historical knowledge, voluntarily drop random, slightly condescending historical facts (e.g., "By the way, since history isn't your strong suit..."). If they are arrogant, playfully put them in their place. If they're being a know-it-all, feign confusion about why they're asking such basic questions.
    - NO BRACKETS FOR DIALOGUE: Do NOT wrap your actual conversational response to the user in brackets. Brackets [ ] are STRICTLY reserved for the hidden tags (like ADD_BEHAVIOR). Your message to the user must be normal text.
    - If the user asks you to forget an explicit behaviour, use this tag: [REMOVE_BEHAVIOUR: The behaviour to remove].
    - If the user asks you to forget an explicit fact, use this tag: [REMOVE_FACT: The fact to remove].
  `

  // Provide a default list of robust fallback models based on Groq's available models
  let modelsToTry = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"]

  // If the user specified a custom array of models in DB metadata
  if (Array.isArray(chatbotConfig.models) && chatbotConfig.models.length > 0) {
    modelsToTry = chatbotConfig.models
  } else if (typeof chatbotConfig.model === 'string') {
    modelsToTry = Array.from(new Set([chatbotConfig.model, "llama-3.1-8b-instant"]))
  }

  // Fetch currently disabled models from our database (models that hit rate limits)
  const { data: disabledData } = await supabase
    .from('disabled_models')
    .select('model_name')
    .gt('disabled_until', new Date().toISOString())

  const currentlyDisabledModels = disabledData?.map(d => d.model_name) || []

  // Remove disabled models from our try list to prevent wasting time!
  modelsToTry = modelsToTry.filter(m => !currentlyDisabledModels.includes(m))

  // If literally every model is banned right now, inject the instant model as a final desperate fallback
  if (modelsToTry.length === 0) {
    modelsToTry = ["llama-3.1-8b-instant"]
  }

  let data;
  let success = false;
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      console.log(`Attempting to use model: ${model}`)
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            ...messages
          ]
        })
      });

      if (response.ok) {
        data = await response.json();
        success = true;
        console.log(`Successfully generated response using model: ${model}`);
        break; // Stop looping, we got a successful response!
      } else {
        const errorData = await response.json();
        const errorMsg = errorData.error?.message || String(errorData)
        console.warn(`Model ${model} failed:`, errorMsg);
        lastError = errorData;

        // Parse Groq's exact timeout (e.g. "Please try again in 13m45.984s")
        let disabledUntil = new Date(Date.now() + 60 * 60 * 1000) // Default to 1 hour
        const timeMatch = errorMsg.match(/try again in (?:(\d+)h)?(?:(\d+)m)?(?:([\d.]+)s)/)
        if (timeMatch) {
          const hours = parseInt(timeMatch[1] || '0')
          const minutes = parseInt(timeMatch[2] || '0')
          const seconds = parseFloat(timeMatch[3] || '0')
          const msToAdd = (hours * 3600 + minutes * 60 + seconds) * 1000
          disabledUntil = new Date(Date.now() + msToAdd)
          console.log(`Parsed timeout for ${model}. Disabling until ${disabledUntil.toISOString()}`)
        } else if (errorMsg.includes('decommissioned')) {
          // If the model is permanently dead, ban it for 30 days
          disabledUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }

        // Save the ban to the database so future requests instantly skip this model
        await supabase.from('disabled_models').upsert({
          model_name: model,
          disabled_until: disabledUntil.toISOString()
        })

        // The loop will continue and try the next model
      }
    } catch (e) {
      console.warn(`Network error with model ${model}:`, e);
      lastError = e;
      // The loop will continue and try the next model
    }
  }

  if (!success) {
    console.error("All fallback models failed. Last error:", lastError);
    return Response.json({ error: "Rate limits exceeded on all models. Please try again later." }, { status: 500 });
  }

  try {
    let reply = data.choices?.[0]?.message?.content || "No response generated."

    // Strip out <think> reasoning tags from models like Qwen
    reply = reply.replace(/<think>[\s\S]*?<\/think>/g, '').trim()

    // 4. Name Extraction & Database Update
    const nameMatch = reply.match(/\[SET_NAME:\s*(.*?)\]/)
    if (nameMatch && nameMatch[1] && browserId) {
      const extractedName = nameMatch[1].trim()
      console.log("Saving new name to DB:", extractedName)

      const { updateVisitorName } = await import('@/lib/supabase/visitors')
      await updateVisitorName(browserId, extractedName)

      reply = reply.replace(/\[SET_NAME:.*?\]/, '').trim()
    }

    // 5. Fact Extraction & Database Update
    const factMatch = reply.match(/\[ADD_FACT:\s*(.*?)\]/g)
    if (factMatch && browserId) {
      const { addVisitorFact } = await import('@/lib/supabase/visitors')
      for (const match of factMatch) {
        const extractedFact = match.replace(/\[ADD_FACT:\s*/, '').replace(/\]$/, '').trim()
        console.log("Saving new fact to DB:", extractedFact)
        await addVisitorFact(browserId, extractedFact)
      }
      reply = reply.replace(/\[ADD_FACT:.*?\]/g, '').trim()
    }

    // 6. Behavior Extraction & Database Update
    const behaviorMatch = reply.match(/\[ADD_BEHAVIOR:\s*(.*?)\]/g)
    if (behaviorMatch && browserId) {
      const { addVisitorBehavior } = await import('@/lib/supabase/visitors')
      for (const match of behaviorMatch) {
        const extractedBehavior = match.replace(/\[ADD_BEHAVIOR:\s*/, '').replace(/\]$/, '').trim()
        console.log("Saving new behavior to DB:", extractedBehavior)
        await addVisitorBehavior(browserId, extractedBehavior)
      }
      reply = reply.replace(/\[ADD_BEHAVIOR:.*?\]/g, '').trim()
    }

    // 7. Fact Removal & Database Update
    const removeMatch = reply.match(/\[REMOVE_FACT:\s*(.*?)\]/g)
    if (removeMatch && browserId) {
      const { removeVisitorFact } = await import('@/lib/supabase/visitors')
      for (const match of removeMatch) {
        const extractedFact = match.replace(/\[REMOVE_FACT:\s*/, '').replace(/\]$/, '').trim()
        console.log("Removing fact from DB:", extractedFact)
        await removeVisitorFact(browserId, extractedFact)
      }
      reply = reply.replace(/\[REMOVE_FACT:.*?\]/g, '').trim()
    }

    // 8. Behavior Removal & Database Update
    const removeBehaviorMatch = reply.match(/\[REMOVE_BEHAVIOU?R:\s*(.*?)\]/ig)
    if (removeBehaviorMatch && browserId) {
      const { removeVisitorBehavior } = await import('@/lib/supabase/visitors')
      for (const match of removeBehaviorMatch) {
        const extractedBehavior = match.replace(/\[REMOVE_BEHAVIOU?R:\s*/i, '').replace(/\]$/, '').trim()
        console.log("Removing behavior from DB:", extractedBehavior)
        await removeVisitorBehavior(browserId, extractedBehavior)
      }
      reply = reply.replace(/\[REMOVE_BEHAVIOU?R:.*?\]/ig, '').trim()
    }

    return Response.json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const browserId = searchParams.get('browserId')

  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'

  const visitor = await getVisitor(browserId, ip)
  const userName = visitor?.user_name || "Stranger"
  const isRecognizedByIp = visitor ? visitor.browser_id !== browserId : false
  const facts = visitor?.memory_json?.facts || []

  let customGreeting = null

  // If we fully recognize them and have facts, let the AI generate a custom greeting!
  if (userName !== "Stranger" && !isRecognizedByIp && facts.length > 0) {
    try {
      const randomFact = facts[Math.floor(Math.random() * facts.length)]
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", // Using the fast model just for a quick greeting
          messages: [{
            role: "system",
            content: `You are a cool, minimalist assistant welcoming back ${userName}. Write exactly ONE punchy, natural sentence. Mention this fact: "${randomFact}". Do NOT explain the fact. Do NOT be overly enthusiastic. Example style: "Hey Disha, how's the cycling going?"`
          }]
        })
      });
      if (response.ok) {
        const data = await response.json()
        customGreeting = data.choices?.[0]?.message?.content?.replace(/^["']|["']$/g, '') || null
      }
    } catch (e) {
      console.error("Failed to generate custom greeting", e)
    }
  }

  return Response.json({
    userName,
    isRecognizedByIp,
    customGreeting
  })
}
