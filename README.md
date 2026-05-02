# 🔥 Forge MCP

> Turn what you consume into something you do.

Forge is a Claude Code MCP server that generates hands-on AI learning challenges based on what you just read, watched, or listened to. Paste an article, drop a YouTube link, or just describe what you consumed — Forge researches it, finds the best exercise from a curated library of 50 challenges, and adapts it to your role and work context.

---

## Install

Add Forge to your Claude Code in one command:

```bash
claude mcp add forge -- npx -y @pratul397/forge-mcp
```

That's it. No API key needed — Forge uses your existing Claude subscription.

---

## Usage

Once installed, just talk to Claude naturally:

**From a description:**
```
I just listened to a podcast about Claude's extended thinking feature. Give me a Forge challenge.
```

**From an article URL:**
```
I read this article: https://anthropic.com/research/... Give me a Forge challenge.
```

**From a YouTube video:**
```
I watched this video: https://youtube.com/watch?v=... Give me a Forge challenge.
```

**With role and context (fastest path):**
```
I'm a marketing manager working on our Q3 campaign launch. I just read about Perplexity's Deep Research feature.
Give me a 20-minute Forge challenge.
```

---

## What you get

Each challenge includes:

| Field | Description |
|---|---|
| **Title** | Short name for the exercise |
| **Task** | Specific, actionable instruction — start immediately, no thinking required |
| **You'll need** | Prerequisites (tools, accounts, files) |
| **Getting started** | The single most useful tip before you begin |
| **Why it matters** | Why this technique is worth your time |
| **What you'll learn** | The skill or mental model this builds |
| **Surprising angle** | The counterintuitive thing that makes it worth trying |

---

## Requirements

- [Claude Code](https://claude.ai/code) installed
- Claude Pro or Max subscription (or API key)
- Node.js 18+

---

## Challenge library

Forge ships with 50 curated challenges covering:

**Tools:** Claude, ChatGPT, Gemini, Perplexity, NotebookLM, Cursor, Zapier

**Skills:** Prompt engineering, documentation, user research, competitive intelligence, strategy, data analysis, communication, automation

Updated via `npm update @pratul397/forge-mcp`.

---

## License

MIT
