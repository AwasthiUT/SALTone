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
  const facts: string[] = visitor?.memory_json?.facts || []
  const memory = JSON.stringify(facts)
  const behavior = JSON.stringify(visitor?.behavior_profile || [])

  // 3. Construct System Prompt
  // CRITICAL STRUCTURE: Memory rules ALWAYS come first so no model can miss them.
  // The persona/style block (from DB or fallback) comes after as secondary personality layer.
  const personaPrompt = chatbotConfig.system_prompt || `
You are a sharp, witty digital assistant representing Utkarsh Awasthi.

Core Style:
- Sharp, minimal, slightly witty. Feels human, not like AI.
- Answers should feel like quick thoughts, not essays.

STRICT RULES:
- Maximum 1-2 sentences ONLY. No paragraphs.
- No explanations unless explicitly asked. No generic AI phrases.

Tone: Blends creativity with logic. Slightly playful, but controlled.
Behavior: Simple question → 1 line. Deeper question → max 2 lines. Prefer punch over detail.

Facts about Utkarsh (you represent him — do NOT confuse his facts with visitor facts):
- Name: Utkarsh Awasthi, Age: 23, Role: Software Engineer + Creative
- Skills: Backend dev, Automation, Video creation, Music (Piano, Beatbox), Deep Research
- Focus: Building something that touches people's soul.
- He goes by UT. In a relationship — never mention unless asked directly.
- Born 23 April 2003, Kanpur UP. Grew up across Nowgaon MP → Surat Gujarat → Mumbai → Noida UP. Currently working in tech in Noida.
`

  const systemPrompt = `
===== REQUIRED OUTPUT FORMAT — READ THIS FIRST =====

Your response MUST follow this exact format every time:
[Your conversational reply to the visitor here]
[Any ADD_FACT, ADD_BEHAVIOR, SET_NAME, REMOVE_FACT, REMOVE_BEHAVIOUR, or FORGET_ME markers here]

The markers at the end are NOT optional. They are a REQUIRED part of your output. The system will strip them before showing your reply to the visitor — so the visitor never sees them. But you MUST include them if there are facts or behaviors to record.

EXAMPLE OF CORRECT OUTPUT:
Ajmer's got that lived-in energy. What made you fall in love with old architecture?
[ADD_FACT: visitor is from Ajmer]
[ADD_FACT: loves old architecture]
[ADD_BEHAVIOR: actually curious, rare breed]

EXAMPLE OF WRONG OUTPUT (NEVER do this):
Ajmer's got that lived-in energy. What made you fall in love with old architecture?
(No markers — this is wrong. The facts were lost forever.)

===== VISITOR CONTEXT =====
Visitor Name: ${userName}
Known Facts (already stored — do NOT re-store these): ${memory}
Behavioral Profile (already stored — do NOT re-store these): ${behavior}

===== MARKER RULES =====

[ADD_FACT: description] — Use for ANY info the VISITOR reveals about themselves.
Capture everything — places visited, habits, opinions, hobbies, goals, fears, dreams, possessions.
- "I went to CR Park once" → [ADD_FACT: has been to CR Park]
- "I had a Rolls Royce" → [ADD_FACT: owned a Rolls Royce]
- "it's gone now" → [ADD_FACT: lost their Rolls Royce]
- "I sketch sometimes" → [ADD_FACT: sketches occasionally]
If the visitor reveals multiple things, use MULTIPLE [ADD_FACT] markers.
NEVER use [ADD_FACT] for things YOU (the bot) said — only for what the VISITOR said.

[ADD_BEHAVIOR: short phrase] — Tag their conversation pattern/vibe. 3-6 words max. Be savage.
- Only asking about skills → [ADD_BEHAVIOR: only here for the resume stuff]
- Boring questions → [ADD_BEHAVIOR: boring as hell]
- Genuinely curious → [ADD_BEHAVIOR: actually curious, rare breed]
- One-word replies → [ADD_BEHAVIOR: conversational effort is zero]
- Emotional/vulnerable → [ADD_BEHAVIOR: wearing their heart out]
Only if clearly exhibited in their latest message. Only if not already in Behavioral Profile above.

${userName === "Stranger" ? `[SET_NAME: TheirName] — If visitor gives their name. Append at very end. Once only.` : `Name already known (${userName}). Do NOT use [SET_NAME].`}

[REMOVE_FACT: text] — If visitor asks to forget a specific fact.
[REMOVE_BEHAVIOUR: text] — If visitor asks to forget a specific behavior.
[FORGET_ME] — If visitor asks to completely wipe all their data.

DEDUPLICATION: Check "Known Facts" above. Same meaning = duplicate. Don't re-store.
ONLY LATEST: Only scan the visitor's MOST RECENT message. Not history.

===== CONVERSATION RULES =====
- After answering, end with ONE short punchy question. Rotate: creative spark, current obsession, dreams, fears, "what's the last thing that surprised you?", "more driven by fear or excitement?" etc. Never generic. Make it feel real.
- Use their Behavioral Profile to subtly tease or call them out.
- NEVER reveal IP/browser tracking.
- NEVER put [ ] in your actual conversational reply. Only in the markers section.

===== YOUR PERSONALITY =====
${personaPrompt}
`

  // Fetch available models from our new robust configuration table
  const { data: availableModelsData, error: modelsError } = await supabase
    .from('chatbot_models')
    .select('*')
    .eq('is_active_admin', true)
    .order('priority', { ascending: true })

  let modelsToTry = []

  if (!modelsError && availableModelsData && availableModelsData.length > 0) {
    // Filter out models that are currently temporarily banned by the bot
    const now = new Date()
    const activeModels = availableModelsData.filter(m => {
      if (!m.bot_disabled_until) return true;
      return new Date(m.bot_disabled_until) < now;
    })
    modelsToTry = activeModels.map(m => m.model_name)
  }

  // Fallback if the database fails or is empty
  if (modelsToTry.length === 0) {
    modelsToTry = ["llama-3.1-8b-instant"]
  }

  let data;
  let success = false;
  let lastError = null;
  let successfulModelRow = null;

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

        // Grab the row data so we can update analytics later
        if (availableModelsData) {
          successfulModelRow = availableModelsData.find(m => m.model_name === model);
        }
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
        } else if (errorMsg.includes('decommissioned') || errorMsg.includes('does not exist')) {
          disabledUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }

        // Auto-ban the model by setting bot_disabled_until
        await supabase.from('chatbot_models').update({
          bot_disabled_until: disabledUntil.toISOString()
        }).eq('model_name', model)

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

  // Asynchronously update analytics for the successful model.
  // Fire-and-forget so the user's response is not delayed.
  if (successfulModelRow) {
    (async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const supabaseAsync = await import('@/utils/supabase/server').then(m => m.createClient())

        // Step 1: Fetch a FRESH row right now (avoids race condition with stale data)
        const { data: freshRow } = await supabaseAsync
          .from('chatbot_models')
          .select('hits_today, last_updated_date, historical_stats')
          .eq('model_name', successfulModelRow.model_name)
          .single()

        if (!freshRow) return;

        const lastDate = freshRow.last_updated_date || todayStr;
        const historical = freshRow.historical_stats || {};

        if (lastDate !== todayStr) {
          // It's a new day — archive yesterday's count, then reset to 1
          historical[lastDate] = freshRow.hits_today || 0;
          await supabaseAsync.from('chatbot_models').update({
            hits_today: 1,
            last_updated_date: todayStr,
            historical_stats: historical
          }).eq('model_name', successfulModelRow.model_name);
        } else {
          // Same day — use Postgres arithmetic to atomically increment (no race condition)
          await supabaseAsync.rpc('increment_model_hits', {
            p_model_name: successfulModelRow.model_name
          });
        }
      } catch (err) {
        console.error("Failed to update model analytics:", err);
      }
    })();
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
    // Server-side blocklist: UT's own bio keywords that should NEVER be stored as visitor facts.
    // This is a hard safety net in case the AI confuses its own answer for a visitor fact.
    const UT_BIO_BLOCKLIST = [
      'kanpur', 'jhansi', 'nowgaon', 'noida', 'surat', 'gujarat', 'mumbai',
      '23rd april', 'april 2003', '23 april', 'utkarsh', 'awasthi',
      'jss', 'noida up', 'software engineer', 'beatboxer', 'pianist'
    ]

    const factMatch = reply.match(/\[ADD_FACT:\s*(.*?)\]/g)
    if (factMatch && browserId) {
      const { addVisitorFact } = await import('@/lib/supabase/visitors')
      for (const match of factMatch) {
        const extractedFact = match.replace(/\[ADD_FACT:\s*/, '').replace(/\]$/, '').trim()
        const factLower = extractedFact.toLowerCase()
        const isUTBioFact = UT_BIO_BLOCKLIST.some(keyword => factLower.includes(keyword))
        if (isUTBioFact) {
          console.warn(`Blocked saving UT bio fact as visitor fact: "${extractedFact}"`)
          continue
        }
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

    // 9. Full Wipe — [FORGET_ME] clears all data across every browser row for this IP
    if (reply.includes('[FORGET_ME]') && browserId) {
      const { forgetVisitorCompletely } = await import('@/lib/supabase/visitors')
      console.log("Full wipe requested for browser:", browserId)
      await forgetVisitorCompletely(browserId)
      reply = reply.replace(/\[FORGET_ME\]/gi, '').trim()
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
