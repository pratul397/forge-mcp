# Forge — How to use

Forge gives you hands-on AI learning challenges based on what you just read, watched, or listened to.

---

## What to say to Claude

**Plain text:**
> I just listened to a podcast about Claude's extended thinking feature. Give me a Forge challenge.

**Article or blog post:**
> Here's an article I just read: https://example.com/article. Give me a Forge challenge.

**YouTube video:**
> I just watched this video: https://youtube.com/watch?v=... Give me a Forge challenge.

**With role and context (fastest path):**
> I'm a marketing manager currently working on our Q3 campaign launch. I just read about
> Perplexity's Deep Research feature. Give me a 20-minute Forge challenge.

---

## What Claude will ask before generating

If you haven't already provided them, Claude will ask:

1. **Your role** *(required)* — e.g. engineer, designer, founder, marketer, consultant.
   Claude uses this to adapt the challenge language to your work, not assume a product manager context.

2. **What you're currently working on** *(optional)* — e.g. "migrating our auth service",
   "planning a product launch". Providing this makes the challenge more concrete and immediately usable.
   You can skip it and Claude will still generate a great challenge.

---

## What Claude does (automatically, using Forge tools)

1. **Ask** — confirms your role; invites optional work context
2. **Fetch** *(if URL provided)* — reads the article or YouTube transcript via `forge_fetch_content` (no browser needed)
3. **Research** — searches the web for accurate, up-to-date info about the feature or technique
4. **Match** — calls `forge_get_challenges` to find the best exercise from the curated library
5. **Adapt** — personalises the challenge language to your role and context
6. **Present** — returns a structured challenge ready to start immediately

---

## Tips

- Specify your available time for a right-sized challenge:
  > "I have 20 minutes. Give me a Forge challenge based on..."

- Ask for a different challenge if the first doesn't fit:
  > "Give me a different Forge challenge — something more hands-on."

- YouTube links are handled natively — no browser plugin needed. Just paste the URL.
