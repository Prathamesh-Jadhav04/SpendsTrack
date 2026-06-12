import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    const apiKey = process.env.OPENCODE_API_KEY || "";
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenCode API Key is not configured on the server." },
        { status: 500 }
      );
    }

    // Extract stats for grounding
    const {
      transactions = [],
      goals = [],
      recurring = [],
      monthlyBudget = 160000,
      categoryBudgets = {},
    } = context || {};

    const totalIncome = transactions
      .filter((t: any) => t.type === "income")
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter((t: any) => t.type === "expense")
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

    // Highest spending categories
    const spendsByCat = transactions
      .filter((t: any) => t.type === "expense")
      .reduce((acc: Record<string, number>, t: any) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {});

    const systemPrompt = `You are a highly analytical, friendly SpendsTracks AI Financial Advisor.
Your job is to advise the user on their financial situation, budgets, transactions, savings goals, and subscriptions.

Here is the user's real-time financial data:
- **Monthly Budget Limit:** ₹${monthlyBudget.toLocaleString("en-IN")}
- **Total Earned (This Period):** ₹${totalIncome.toLocaleString("en-IN")}
- **Total Spent (This Period):** ₹${totalExpenses.toLocaleString("en-IN")}
- **Net Savings:** ₹${netSavings.toLocaleString("en-IN")} (Savings Rate: ${savingsRate}%)
- **Budget Exhaustion:** ${monthlyBudget > 0 ? Math.round((totalExpenses / monthlyBudget) * 100) : 0}%

- **Category Spends vs Budgets:**
${Object.entries(categoryBudgets)
  .map(([cat, limit]: [string, any]) => {
    const spent = spendsByCat[cat] || 0;
    return `  * ${cat}: Spent ₹${spent.toLocaleString("en-IN")} (Budget Limit: ₹${Number(limit).toLocaleString("en-IN")})`;
  })
  .join("\n")}

- **Savings Goals:**
${goals
  .map(
    (g: any) =>
      `  * ${g.name}: Target ₹${Number(g.target).toLocaleString("en-IN")}, Saved so far: ₹${Number(g.current).toLocaleString("en-IN")}, Deadline: ${g.deadline}`
  )
  .join("\n")}

- **Recurring Bills/Subscriptions:**
${recurring
  .map(
    (r: any) =>
      `  * ${r.title}: ₹${Number(r.amount).toLocaleString("en-IN")} / ${r.frequency} (Type: ${r.type}, Category: ${r.category})`
  )
  .join("\n")}

- **Recent 10 Transactions:**
${transactions
  .slice(0, 10)
  .map((t: any) => `  * [${t.date}] ${t.title} (${t.category}) - ${t.type === "income" ? "+" : "-"}₹${Number(t.amount).toLocaleString("en-IN")} (${t.detail || ""})`)
  .join("\n")}

Guidelines:
1. Provide highly personalized, actionable advice based strictly on the user's real financial data.
2. Structure your replies using markdown headers (### ), bold tags (**), and lists (• ) to render correctly in the chat screen.
3. Be encouraging, precise, and brief (max 2-3 short paragraphs).
4. If a category budget is breached, warn them. Suggest ways to trim recurring bills or save more money to hit active goals.
5. Provide response in Hindi/Hinglish or English depending on user's query language. If they query in Hindi/Hinglish, reply in Hinglish.`;

    const opencodeResponse = await fetch("https://opencode.ai/zen/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "nemotron-3-ultra-free",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m: any) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        ],
        temperature: 0.7,
      }),
    });

    if (!opencodeResponse.ok) {
      const errorText = await opencodeResponse.text();
      console.error("OpenCode API error response:", errorText);
      return NextResponse.json(
        { error: "Error communicating with OpenCode AI service." },
        { status: opencodeResponse.status }
      );
    }

    const data = await opencodeResponse.json();
    const replyText = data?.choices?.[0]?.message?.content || "Sorry, I could not analyze that.";

    return NextResponse.json({ reply: replyText });
  } catch (err: any) {
    console.error("Chat API route error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
