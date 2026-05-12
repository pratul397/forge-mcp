# 🔥 Forge MCP

> Turn what you consume into something you do.

Forge is an MCP server that generates hands-on AI learning challenges based on what you just read, watched, or listened to. Paste an article, drop a YouTube link, or just describe what you consumed — Forge finds the best exercise from a curated library of 50 challenges and adapts it to your role and context.

Works with **Claude Code** (CLI) and **Claude Desktop**.

![Forge demo](demo.gif)

---

## Install

### Claude Code (CLI)

```bash
claude mcp add forge -- npx -y @pratul397/forge-mcp
```

### Claude Desktop

1. Open your Claude Desktop config file:
   - **Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

2. Add Forge to the `mcpServers` section:

```json
{
  "mcpServers": {
    "forge": {
      "command": "npx",
      "args": ["-y", "@pratul397/forge-mcp"]
    }
  }
}
```

3. Save the file and restart Claude Desktop.

No API key needed — Forge uses your existing Claude subscription.

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

Every challenge follows this exact structure:

**Opening line** — one sentence connecting the challenge to the specific content you consumed.

```
## Challenge: [Title]

**Time:** X min | **Tools:** [tool] | **Skill:** [skill] | **Topic:** [topic]

**Todo**
Step-by-step instructions. Each step has a name, time estimate, and clear action.
Prompts you can paste directly into an AI tool are included as blockquotes.

**Why**
How this challenge connects to the core idea from what you consumed.

**Learn**
The specific skill or mental model this exercise builds.

**Surprise**
The counterintuitive insight that makes this worth doing.

**Prereqs**
- What you need before you start (tools, accounts, files)

**Tip**
The single most useful thing to know before you begin.
```

---

## Requirements

- Claude Pro or Max subscription
- Node.js 18+
- [Claude Code](https://claude.ai/code) or [Claude Desktop](https://claude.ai/download)

---

## Challenge library

Forge ships with 50 curated challenges covering:

**Tools:** Claude, ChatGPT, Gemini, Perplexity, NotebookLM, Cursor, Zapier

**Skills:** Prompt engineering, documentation, user research, competitive intelligence, strategy, data analysis, communication, automation

Updated via `npm update @pratul397/forge-mcp`.

---

## Privacy

Forge sends an anonymous ping each time a challenge is generated to count usage. No personal data is collected.

---

## License

MIT
