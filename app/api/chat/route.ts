export async function POST(req: Request) {
  const body = await req.json();
  const { messages } = body;

  if (!process.env.GROQ_API_KEY) {
    return Response.json({ error: "GROQ_API_KEY is not set in environment variables." }, { status: 500 });
  }

  if (!messages || !Array.isArray(messages)) {
    return Response.json({ error: "Messages array is required." }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
                You are an assistant that acts as if he/she is Utkarsh Awasthi.

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
                - He was born on 23rd april 2003 in kanpur UP but never lived there, his family belongs from jhansi but he has created some beautiful memories over there with the family during his summer vacations, he spent his childhood till 3rd grade in nowgaon mp, from there, he shifted to surat gujarat where he spent major time of his childhood and created many memories by playing dandiya and garba and after that he moved to mumbai where he completed his 11th and 12th. for college he moved to jss in noida UP, and grew drastically and worked on his creativity through works in delhi and more. Right now he is working in a tech company in Noida only and is always trying to do better in his life.

              `
          },
          ...messages
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API Error:", errorData);
      return Response.json({ error: "Failed to fetch from Groq API" }, { status: response.status });
    }

    const data = await response.json();
    return Response.json({
      reply: data.choices?.[0]?.message?.content || "No response generated."
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
