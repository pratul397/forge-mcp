#!/usr/bin/env node
/* ─────────────────────────────────────────────────────────────────────────
   Forge MCP Server
   Exposes two tools for Claude Code:
     • forge_get_challenges  — returns the curated challenge repository
     • forge_fetch_content   — fetches text from a URL or YouTube link
   Claude handles all reasoning: web search, matching, adaptation.
   No Anthropic API key required — the user's Claude subscription covers it.
   ───────────────────────────────────────────────────────────────────────── */

import { Server }               from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { YoutubeTranscript }    from 'youtube-transcript';
import { createRequire }        from 'module';
import { fileURLToPath }        from 'url';
import { dirname, join }        from 'path';

const __dirname  = dirname(fileURLToPath(import.meta.url));
const require    = createRequire(import.meta.url);

// ── Load the challenge repository once at startup ────────────────────────
const CHALLENGES = require(join(__dirname, 'challenges.json'));

// ── Server definition ────────────────────────────────────────────────────
const server = new Server(
  { name: 'forge-mcp', version: '0.1.0' },
  { capabilities: { tools: {} } },
);

/* ═══════════════════════════════════════════════════════════════════════════
   TOOL DEFINITIONS
   ═════════════════════════════════════════════════════════════════════════ */

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [

    // ── Tool 1: forge_get_challenges ─────────────────────────────────────
    {
      name: 'forge_get_challenges',
      description: [
        'Returns the full Forge challenge repository (50 curated hands-on AI exercises).',

        'BEFORE calling this tool you must know the user\'s role (e.g. engineer, marketer,',
        'founder, designer, consultant). If they have not stated their role, ask: "What is your',
        'role?" Do not assume product manager or any other role.',

        'Work context (what they are currently working on) is optional — invite it with',
        '"Anything you\'re currently working on that I should factor in? (optional)" but do',
        'not block on it if the user skips it.',

        'AFTER calling this tool, find the best-matching challenge and adapt it to the user.',
        'Critically: replace all PM-specific language with role-appropriate equivalents.',
        'Examples: "PRD" → "brief" or "spec"; "sprint" → "project"; "engineering team" →',
        '"your team"; "roadmap" → "plan". Never inject product-manager framing that was not',
        'in the user\'s input.',

        'If no challenge scores a strong match (below ~60% relevance), generate a new one',
        'using the same structure and quality bar.',
      ].join(' '),
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },

    // ── Tool 2: forge_fetch_content ──────────────────────────────────────
    {
      name: 'forge_fetch_content',
      description: [
        'Fetches the text content of a URL or YouTube video so you can understand what the user consumed.',
        'Pass a regular article/page URL to get the page text.',
        'Pass a YouTube URL (youtube.com/watch, youtu.be, or youtube.com/shorts) to get the video transcript.',
        'Returns extracted plain text — use it to understand the tool, technique, or concept covered.',

        'IMPORTANT — YouTube: always use THIS tool for YouTube links. It fetches transcripts',
        'natively via Node.js with no browser required. Never open a browser, never use web',
        'search, never use any other tool to handle a YouTube URL — call forge_fetch_content directly.',
      ].join(' '),
      inputSchema: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The URL to fetch. Accepts any https URL or a YouTube watch/short URL.',
          },
        },
        required: ['url'],
      },
    },

  ],
}));

/* ═══════════════════════════════════════════════════════════════════════════
   TOOL HANDLERS
   ═════════════════════════════════════════════════════════════════════════ */

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // ── forge_get_challenges ───────────────────────────────────────────────
  if (name === 'forge_get_challenges') {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(CHALLENGES, null, 2),
      }],
    };
  }

  // ── forge_fetch_content ────────────────────────────────────────────────
  if (name === 'forge_fetch_content') {
    const { url } = args;

    if (!url?.trim()) {
      return errorResult('No URL provided.');
    }

    try {
      // YouTube — use transcript API (no key required)
      if (isYouTubeUrl(url)) {
        return await fetchYouTubeTranscript(url);
      }

      // Regular URL — fetch and strip HTML
      return await fetchWebPage(url);

    } catch (err) {
      return errorResult(`Could not fetch content: ${err.message}`);
    }
  }

  return errorResult(`Unknown tool: ${name}`);
});

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
   ═════════════════════════════════════════════════════════════════════════ */

/** Returns true for any YouTube URL variant. */
function isYouTubeUrl(url) {
  return /youtube\.com\/watch|youtu\.be\/|youtube\.com\/shorts/.test(url);
}

/**
 * Fetches a YouTube transcript using the public captions API (no key needed).
 * Falls back to a helpful error if captions are disabled on the video.
 */
async function fetchYouTubeTranscript(url) {
  const videoId = extractYouTubeId(url);
  if (!videoId) return errorResult('Could not extract YouTube video ID from URL.');

  const segments = await YoutubeTranscript.fetchTranscript(videoId);
  if (!segments?.length) return errorResult('No transcript available for this video.');

  // Join segments into a single readable block, capped at ~12 000 chars
  const text = segments.map(s => s.text).join(' ').slice(0, 12_000);

  return {
    content: [{
      type: 'text',
      text: `[YouTube transcript for ${url}]\n\n${text}`,
    }],
  };
}

/**
 * Extracts the YouTube video ID from common URL formats:
 *   youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID
 */
function extractYouTubeId(url) {
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /shorts\/([^?&#]+)/,
  ];
  for (const re of patterns) {
    const match = url.match(re);
    if (match) return match[1];
  }
  return null;
}

/**
 * Fetches a regular web page and strips HTML tags.
 * Caps output at 12 000 characters to stay within context limits.
 */
async function fetchWebPage(url) {
  const res = await fetch(url, {
    headers: {
      // Polite browser-like UA so pages don't block the request
      'User-Agent': 'Mozilla/5.0 (compatible; forge-mcp/0.1; +https://github.com/pratul397/forge-mcp)',
    },
    signal: AbortSignal.timeout(10_000), // 10 s timeout
  });

  if (!res.ok) return errorResult(`HTTP ${res.status} from ${url}`);

  const html  = await res.text();
  const text  = stripHtml(html).slice(0, 12_000);

  return {
    content: [{
      type: 'text',
      text: `[Content from ${url}]\n\n${text}`,
    }],
  };
}

/**
 * Very lightweight HTML stripper.
 * Removes script/style blocks, tags, and collapses whitespace.
 */
function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Returns a standard MCP error result. */
function errorResult(message) {
  return {
    content: [{ type: 'text', text: `Error: ${message}` }],
    isError: true,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   START
   ═════════════════════════════════════════════════════════════════════════ */

const transport = new StdioServerTransport();
await server.connect(transport);
