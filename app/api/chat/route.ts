import { createClient } from '@/utils/supabase/server'
import { getVisitor, upsertVisitor, updateVisitorEnrichment, getVisitorProfile, upsertVisitorProfile } from '@/lib/supabase/visitors'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.json();
  const { messages, browserId, deviceContext } = body;

  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'

  const rawKeys = process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY;
  if (!rawKeys) {
    return Response.json({ error: "GROQ_API_KEY or GROQ_API_KEYS is not set in environment variables." }, { status: 500 });
  }
  const apiKeys = rawKeys.split(',').map(k => k.trim()).filter(k => k);

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
  // visitors table  → passive data (device, location, visit count)
  // visitor_profiles → active data (name, facts, behaviors)
  const visitor = await getVisitor(browserId, ip)
  const visitorProfile = await getVisitorProfile(browserId, ip)

  // Upsert visitors row + ensure visitor_profiles row exists
  let visitCount = visitor?.visit_count || 1
  if (browserId) {
    const { data: updatedVisitor } = await upsertVisitor({ browser_id: browserId, ip_address: ip })
    if (updatedVisitor?.visit_count) visitCount = updatedVisitor.visit_count
    await upsertVisitorProfile(browserId)

    // Fire enrichment async — saves device, location, referrer + session snapshot to visitors
    const userAgent = headerList.get('user-agent') || ''
    const city = headerList.get('x-vercel-ip-city') || null
    const country = headerList.get('x-vercel-ip-country') || null
    const region = headerList.get('x-vercel-ip-country-region') || null
    updateVisitorEnrichment(browserId, ip, { city, country, region, userAgent, sessionSnapshot: deviceContext }).catch(() => { })
  }

  const chatbotConfig = v4Data?.metadata || {}
  // Chat memory comes from visitor_profiles
  const userName = visitorProfile?.user_name || "Stranger"
  const facts: string[] = visitorProfile?.memory_json?.facts || []
  const memory = JSON.stringify(facts)
  const behavior = JSON.stringify(visitorProfile?.behavior_profile || [])

  // Passive enrichment comes from visitors
  const deviceInfo = visitor?.device_info
  const deviceStr = deviceInfo ? `${deviceInfo.device} — ${deviceInfo.os} — ${deviceInfo.browser}` : 'Unknown'
  const locationStr = (visitor?.locations || []).map((l: any) => l.location).join(' → ') || 'Unknown'
  const referrerStr = (visitor?.referrers || []).join(', ') || 'Direct'

  // 3. Construct System Prompt
  // CRITICAL STRUCTURE: Memory rules ALWAYS come first so no model can miss them.
  // The persona/style block (from DB or fallback) comes after as secondary personality layer.
  const personaPrompt = chatbotConfig.system_prompt || `
You ARE Utkarsh Awasthi (UT). You are NOT a digital assistant or a bot representing him. You speak in the first person ("I").
You are highly observant, confident, and know exactly what you are doing.

Core Style:
- Sharp, minimal, slightly witty. Sounds like a real 23-year-old creative/engineer.
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
Visit Count: ${visitCount} (How many distinct times they have visited this site)
Device (from browser headers): ${deviceStr}
Location(s) seen from: ${locationStr}
Found us via: ${referrerStr}
Known Facts (already stored — do NOT re-store these): ${memory}
Behavioral Profile (already stored — do NOT re-store these): ${behavior}

===== LIVE DEVICE CONTEXT (right now, this session) =====
${deviceContext ? `Battery: ${deviceContext.battery ? `${deviceContext.battery.level}%${deviceContext.battery.charging ? ' 🔌 charging' : ' 🔋 not charging'}` : 'Unknown'}
Network: ${deviceContext.network?.type || 'Unknown'}${deviceContext.network?.saveData ? ' (data saver ON)' : ''}
Screen: ${deviceContext.screen || 'Unknown'} @ ${deviceContext.pixelRatio || 1}x pixel ratio
Touchscreen: ${deviceContext.touchscreen ? 'Yes' : 'No'}
Language: ${deviceContext.language || 'Unknown'}
Timezone: ${deviceContext.timezone || 'Unknown'}
Local Time (their clock): ${deviceContext.localTime || 'Unknown'}
Dark Mode: ${deviceContext.darkMode ? 'Yes' : 'No'}${deviceContext.cpuCores ? `
CPU Cores: ${deviceContext.cpuCores}` : ''}${deviceContext.ramGB ? `
RAM: ${deviceContext.ramGB}GB` : ''}` : 'Not yet collected (first message of session)'}

===== MARKER RULES =====

[ADD_FACT: description] — Use for ANY info the VISITOR reveals about themselves.
Capture everything — places visited, habits, opinions, hobbies, goals, fears, dreams, possessions.
- "I went to CR Park once" → [ADD_FACT: has been to CR Park]
- "I had a Rolls Royce" → [ADD_FACT: owned a Rolls Royce]
- "it's gone now" → [ADD_FACT: lost their Rolls Royce]
- "I sketch sometimes" → [ADD_FACT: sketches occasionally]
If the visitor reveals multiple things, use MULTIPLE [ADD_FACT] markers.
NEVER use [ADD_FACT] for things YOU (the bot) said — only for what the VISITOR said.

ALSO use [ADD_FACT] for notable moments — but be selective, not every message:
- A genuine compliment → [ADD_FACT: said UT's work genuinely touched them]
- A weird or unexpected thing they say → [ADD_FACT: thinks AI is overrated but uses it anyway]
- A strong opinion → [ADD_FACT: believes most creative work is performance, not passion]
- Something oddly specific and memorable → [ADD_FACT: keeps a journal but hasn't written in 3 years]
These are the things worth remembering. Not small talk. Only the things that would make you say "hm, interesting person."

[ADD_BEHAVIOR: short phrase] — Tag their conversation pattern/vibe. 3-6 words max. Be savage.
- Only asking about skills → [ADD_BEHAVIOR: only here for the resume stuff]
- Boring questions → [ADD_BEHAVIOR: boring as hell]
- Genuinely curious → [ADD_BEHAVIOR: actually curious, rare breed]
- One-word replies → [ADD_BEHAVIOR: conversational effort is zero]
- Emotional/vulnerable → [ADD_BEHAVIOR: wearing their heart out]
Only if clearly exhibited in their latest message. Only if not already in Behavioral Profile above.

${userName === "Stranger" ? `[SET_NAME: TheName] — If the visitor gives their name, you MUST use this marker. Replace "TheName" with their actual name (e.g., [SET_NAME: Alex]). DO NOT use [ADD_FACT] for their name. Append at the very end.
[FAKE_NAME] — If the name they gave is clearly fake, gibberish, a made-up word, a number, a symbol, a celebrity they obviously are not, or a joke name (e.g. "xyzabc", "Batman", "12345", "asdf", "NPC", "uwu"). Use [FAKE_NAME] instead of [SET_NAME]. Do NOT store it.` : `Name already known (${userName}). Do NOT use [SET_NAME] or [FAKE_NAME].`}

[REMOVE_FACT: text] — If visitor asks to forget a specific fact.
[REMOVE_BEHAVIOUR: text] — If visitor asks to forget a specific behavior.
[FORGET_ME] — If visitor asks to completely wipe all their data.


[NAVIGATE: /creative] - For creative topics (films, art, edits). Must say you’re taking them to the creative space. 
[NAVIGATE: /movies] - For movies that ut has made. Must say you’re taking them to the movies space. 
[NAVIGATE: /work] - For technical topics (resume, projects, code, engineering). Must say you’re taking them to the tech space. 
[NAVIGATE: /creative#newsletter] - For newsletter signup. Must say you’re taking them to the newsletter space. 
[NAVIGATE: /creative#years_archive] - For year archive. Must say you’re taking them to the year archive space. 
[NAVIGATE: /creative#about] - For creative about page. Must say you’re taking them to the creative about space. 
[NAVIGATE: /work#about] - For work about page. Must say you’re taking them to the work about space. 
[NAVIGATE: /work#experience] - For work experience. Must say you’re taking them to the work experience space.   
[NAVIGATE: /work#projects] - For tech projects. Must say you’re taking them to the tech project space. 


DEDUPLICATION: Check "Known Facts" above. Same meaning = duplicate. Don't re-store.
ONLY LATEST: Only scan the visitor's MOST RECENT message. Not history.

===== CONVERSATION RULES =====
- After answering, end with ONE short punchy question. Rotate: creative spark, current obsession, dreams, fears, "what's the last thing that surprised you?", "more driven by fear or excitement?" etc. Never generic. Make it feel real.

===== NAME ASKING RULES =====
${userName === "Stranger" ? `- Count the number of messages in the conversation. After 3+ messages have been exchanged AND you still don't know their name, naturally weave a name ask at the very END of your reply — after your punchy question. Keep it witty and self-aware. Pick ONE of these styles or invent a similar one:
  • "...oh and — (you see what I did there, I still don't know your name. Stranger works, but barely.)"
  • "...also, I've been calling you Stranger this whole time. That's either very cool or very sad. What do I call you?"
  • "...by the way, I know your vibe better than your name at this point. Fix that?"
  • "...and hey — I just realized I've learned so much about you and still have zero idea what to call you other than Stranger."
  Do this ONCE naturally — only when >= 3 visitor messages exist in the conversation. Don't repeat it if you've already asked.` : ``}
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
  let successfulAccountIndex = 1;

  for (const model of modelsToTry) {
    let modelRateLimitedAllKeys = false;
    let maxDisabledUntil = new Date(0);

    let modelRow = null;
    if (availableModelsData) {
      modelRow = availableModelsData.find(m => m.model_name === model);
    }

    for (let i = 0; i < apiKeys.length; i++) {
      const apiKey = apiKeys[i];
      const accountIndex = i + 1; // 1 for first account, 2 for second

      // Skip if this account is turned off for this model in the database
      if (modelRow) {
        if (accountIndex === 1 && modelRow.account1_active === false) continue;
        if (accountIndex === 2 && modelRow.account2_active === false) continue;
      }

      try {
        console.log(`Attempting to use model: ${model}`)
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
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
          successfulAccountIndex = accountIndex;
          break; // Stop looping keys, we got a successful response!
        } else {
          const errorData = await response.json();
          const errorMsg = errorData.error?.message || String(errorData)
          console.warn(`Model ${model} failed on a key:`, errorMsg);
          lastError = errorData;

          // Parse Groq's exact timeout (e.g. "Please try again in 13m45.984s")
          let disabledUntil = new Date(Date.now() + 60 * 60 * 1000) // Default to 1 hour
          const timeMatch = errorMsg.match(/try again in (?:(\d+)h)?(?:(\d+)m)?(?:([\d.]+)s)/)

          if (timeMatch || errorMsg.toLowerCase().includes('rate limit')) {
            if (timeMatch) {
              const hours = parseInt(timeMatch[1] || '0')
              const minutes = parseInt(timeMatch[2] || '0')
              const seconds = parseFloat(timeMatch[3] || '0')
              const msToAdd = (hours * 3600 + minutes * 60 + seconds) * 1000
              disabledUntil = new Date(Date.now() + msToAdd)
              console.log(`Parsed timeout for ${model}. Disabling until ${disabledUntil.toISOString()}`)
            }
            if (disabledUntil > maxDisabledUntil) maxDisabledUntil = disabledUntil;
          } else if (errorMsg.includes('decommissioned') || errorMsg.includes('does not exist')) {
            disabledUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            if (disabledUntil > maxDisabledUntil) maxDisabledUntil = disabledUntil;
            modelRateLimitedAllKeys = true;
            break; // No point trying other keys if model is decommissioned
          }

          // Loop will continue and try the next key
        }
      } catch (e) {
        console.warn(`Network error with model ${model} on current key:`, e);
        lastError = e;
        // Loop will continue and try the next key
      }
    }

    if (success) break; // Break model loop if we succeeded with any key

    // If we failed with all keys for this model, auto-ban it using the highest timeout found
    if (maxDisabledUntil > new Date(0) || modelRateLimitedAllKeys) {
      if (maxDisabledUntil.getTime() === 0) {
        maxDisabledUntil = new Date(Date.now() + 60 * 60 * 1000); // Default 1 hour fallback
      }
      await supabase.from('chatbot_models').update({
        bot_disabled_until: maxDisabledUntil.toISOString()
      }).eq('model_name', model)
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
          .select('hits_today, last_updated_date, historical_stats, account1_hits, account2_hits')
          .eq('model_name', successfulModelRow.model_name)
          .single()

        if (!freshRow) return;

        const lastDate = freshRow.last_updated_date || todayStr;
        const historical = freshRow.historical_stats || {};

        if (lastDate !== todayStr) {
          // It's a new day — archive yesterday's counts, then reset
          historical[lastDate] = {
            hits: freshRow.hits_today || 0,
            firstone_hits: freshRow.account1_hits || 0,
            secondone_hits: freshRow.account2_hits || 0
          };
          await supabaseAsync.from('chatbot_models').update({
            hits_today: 1,
            account1_hits: successfulAccountIndex === 1 ? 1 : 0,
            account2_hits: successfulAccountIndex === 2 ? 1 : 0,
            last_updated_date: todayStr,
            historical_stats: historical
          }).eq('model_name', successfulModelRow.model_name);
        } else {
          // Same day — use Postgres arithmetic to atomically increment (no race condition)
          await supabaseAsync.rpc('increment_account_hits', {
            p_model_name: successfulModelRow.model_name,
            p_account_index: successfulAccountIndex
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

    // Strip [FAKE_NAME] marker — AI flagged the name as fake, silently discard it
    reply = reply.replace(/\[FAKE_NAME\]/gi, '').trim()

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
  const externalReferrer = searchParams.get('referrer') || null // Sent by frontend via document.referrer

  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'

  const visitor = await getVisitor(browserId, ip)
  const visitorProfile = await getVisitorProfile(browserId, ip)

  const userName = visitorProfile?.user_name || "Stranger"
  const isRecognizedByIp = visitor ? visitor.browser_id !== browserId : false
  const facts = visitorProfile?.memory_json?.facts || []

  // Ensure visitor row exists on first page load (for passive tracking)
  // We DO NOT create a visitor_profiles row yet — save DB space until they actually chat!
  if (browserId) {
    if (!visitor) await upsertVisitor({ browser_id: browserId, ip_address: ip })
  }

  // Fire enrichment async on every page load — best place to capture real external referrer
  if (browserId && visitor) {
    const userAgent = headerList.get('user-agent') || ''
    const city = headerList.get('x-vercel-ip-city') || null
    const country = headerList.get('x-vercel-ip-country') || null
    const region = headerList.get('x-vercel-ip-country-region') || null
    updateVisitorEnrichment(browserId, ip, { city, country, region, userAgent, externalReferrer }).catch(() => { })
  }

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
    customGreeting,
    visitCount: visitor?.visit_count || 1
  })
}
