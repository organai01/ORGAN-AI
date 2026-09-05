'use strict';
/* =====================================================
   ORGAN AI – script.js
   AI Tools Database · Assistant · Auth · Canvas BG · Email
   ===================================================== */

/* ─────────────────────────────────────────────────────
   EMAIL CONFIG  (EmailJS – free at emailjs.com, 200 emails/mo)
   Quick 3-step setup:
     1. Sign up free → https://www.emailjs.com
     2. Add an Email Service (Gmail / Outlook / any SMTP)
     3. Create an Email Template with variables:
           {{to_name}}  {{to_email}}  {{type}}  {{message}}  {{time}}
     4. Paste your keys below and you're done!
   ───────────────────────────────────────────────────── */
var EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'abc123XYZ'
var EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_gmail'
var EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_welcome'

/* Initialise EmailJS once keys are filled in */
(function () {
  try {
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }
  } catch (e) {}
})();

/**
 * sendWelcomeEmail(user, type)
 *   type = 'signup'  →  "Welcome to ORGAN AI!"
 *   type = 'signin'  →  "Welcome back to ORGAN AI!"
 * Silently no-ops if EmailJS is not configured.
 */
function sendWelcomeEmail(user, type) {
  try {
    if (typeof emailjs === 'undefined')             return;
    if (EMAILJS_PUBLIC_KEY  === 'YOUR_PUBLIC_KEY')  return;
    if (EMAILJS_SERVICE_ID  === 'YOUR_SERVICE_ID')  return;
    if (EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID') return;
    if (!user || !user.email)                       return;

    var firstName = (user.name || 'there').split(' ')[0];
    var now = new Date();
    var timeStr = now.toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    var isNew = (type === 'signup');
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_name  : firstName,
      to_email : user.email,
      type     : isNew ? 'Welcome to ORGAN AI – Your AI Universe Awaits! 🚀' : 'Welcome Back to ORGAN AI! 👋',
      message  : isNew
        ? 'Hey ' + firstName + '! Your ORGAN AI account is ready. You now have access to 65+ AI tools, side-by-side comparisons, and your personal AI Assistant. Explore, discover, and find the perfect AI for everything you do.'
        : 'Great to see you again, ' + firstName + '! Dive back into 65+ AI tools, explore new additions, and ask your ORGAN AI Assistant anything.',
      time     : timeStr
    });
  } catch (e) { /* silent – email is a nice-to-have, never breaks login */ }
}

/* ─────────────────────────────────────────────────────
   0.  CANVAS BACKGROUND
   ───────────────────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  function spawnParticles() {
    particles = [];
    const count = Math.floor((W * H) / 18000);
    for (let i = 0; i < count; i++) {
      particles.push({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.2+0.3,
        vx: (Math.random()-0.5)*0.18, vy: (Math.random()-0.5)*0.18, a: Math.random()*0.5+0.1 });
    }
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(255,255,255,0.028)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  }

  function drawConnections() {
    const dist = 140;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < dist) {
          ctx.strokeStyle = `rgba(255,255,255,${0.04*(1-d/dist)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawGrid(); drawConnections();
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${p.a})`; ctx.fill();
    });
    animId = requestAnimationFrame(loop);
  }

  resize(); spawnParticles(); loop();
  window.addEventListener('resize', () => { cancelAnimationFrame(animId); resize(); spawnParticles(); loop(); });
})();

/* ─────────────────────────────────────────────────────
   1.  AI TOOLS DATABASE  (all strings double-quoted to avoid apostrophe bugs)
   ───────────────────────────────────────────────────── */
const AI_TOOLS = [
  /* TEXT & CHAT */
  {
    id: "chatgpt", name: "ChatGPT", company: "OpenAI", emoji: "🤖", category: "text",
    description: "The world's most popular AI assistant — GPT-4o for reasoning, coding, creative writing, and more.",
    tags: ["Chatbot", "GPT-4o", "API"],
    url: "https://chat.openai.com",
    free: { price: "Free", detail: "GPT-4o (limited)", features: ["Access to GPT-4o (limited daily)", "Unlimited GPT-3.5 messages", "Browsing & image generation (limited)", "Mobile apps iOS & Android", "Memory & custom instructions"] },
    paid: { price: "$20/mo", detail: "ChatGPT Plus", features: ["Unlimited GPT-4o access", "o1 & o3 model access", "Advanced data analysis", "DALL·E 3 image generation", "Custom GPTs & GPT Store", "Early feature access"] }
  },
  {
    id: "claude", name: "Claude", company: "Anthropic", emoji: "✨", category: "text",
    description: "Safety-focused AI with 200K token context — best for long documents, nuanced conversations, and writing.",
    tags: ["Long context", "200K tokens", "Safe"],
    url: "https://claude.ai",
    free: { price: "Free", detail: "Claude 3.5 Haiku", features: ["Claude 3.5 Haiku model access", "Limited daily messages", "File & image uploads", "Artifacts (code, docs, web)", "Projects (limited)"] },
    paid: { price: "$20/mo", detail: "Claude Pro", features: ["5× more usage than free", "Claude 3.5 Sonnet & Opus", "Priority access during high traffic", "Unlimited Projects", "Extended thinking mode"] }
  },
  {
    id: "gemini", name: "Gemini", company: "Google DeepMind", emoji: "💫", category: "text",
    description: "Google's multimodal AI deeply integrated with Workspace — Docs, Gmail, Drive, and real-time search.",
    tags: ["Multimodal", "Google", "Workspace"],
    url: "https://gemini.google.com",
    free: { price: "Free", detail: "Gemini 1.5 Flash", features: ["Gemini 1.5 Flash model", "Image understanding", "Google integration", "Real-time search grounding", "Mobile app"] },
    paid: { price: "$20/mo", detail: "Gemini Advanced", features: ["Gemini 2.0 Ultra access", "1 TB Google One storage", "Gemini in Gmail, Docs, Slides", "Deep Research mode", "NotebookLM Plus"] }
  },
  {
    id: "grok", name: "Grok", company: "xAI", emoji: "⚡", category: "text",
    description: "xAI's witty AI with real-time X (Twitter) data, unfiltered answers, and DeepSearch research mode.",
    tags: ["Real-time", "X/Twitter", "Witty"],
    url: "https://grok.com",
    free: { price: "Free", detail: "Grok 2 (limited)", features: ["Grok 2 model access", "Real-time X data", "Limited daily queries", "Image generation (limited)", "Web search"] },
    paid: { price: "$16/mo", detail: "X Premium+", features: ["Grok 3 & Grok 3 Turbo", "Unlimited queries", "Think mode (deep reasoning)", "SuperGrok image generation", "DeepSearch research mode"] }
  },
  {
    id: "copilot", name: "Microsoft Copilot", company: "Microsoft", emoji: "🪟", category: "text",
    description: "GPT-4 powered AI with Bing search integration — built into Windows 11 and Microsoft 365 suite.",
    tags: ["Microsoft 365", "Bing", "Office"],
    url: "https://copilot.microsoft.com",
    free: { price: "Free", detail: "GPT-4 (limited)", features: ["GPT-4 powered chat", "Bing web search", "DALL·E image generation", "File upload & analysis", "Built into Windows 11"] },
    paid: { price: "$22/mo", detail: "M365 Copilot", features: ["Copilot in Word, Excel, PowerPoint", "Copilot in Outlook & Teams", "Meeting summarization", "Business Chat (BizChat)", "Enterprise data security"] }
  },
  {
    id: "mistral", name: "Mistral Le Chat", company: "Mistral AI", emoji: "🌬️", category: "text",
    description: "European open-weight AI — Mistral Large 2 rivals GPT-4o at lower cost. Canvas for document editing.",
    tags: ["Open-weight", "European", "API"],
    url: "https://chat.mistral.ai",
    free: { price: "Free", detail: "Le Chat Free", features: ["Mistral Large 2 access", "Web search", "Image generation", "Document & image upload", "Speed-optimized agents"] },
    paid: { price: "$14/mo", detail: "Le Chat Pro", features: ["10× higher limits", "Priority access", "Canvas document editing", "Advanced image gen", "API credits included"] }
  },
  {
    id: "poe", name: "Poe", company: "Quora", emoji: "🐦", category: "text",
    description: "Quora's AI aggregator — access GPT-4o, Claude 3.5, Gemini, DALL·E, and 100+ bots in one subscription.",
    tags: ["Multi-model", "Bot marketplace", "Aggregator"],
    url: "https://poe.com",
    free: { price: "Free", detail: "Daily points", features: ["Daily point allowance", "Many free bots", "GPT-3.5, Claude Instant", "Bot creation", "Explore community bots"] },
    paid: { price: "$20/mo", detail: "Poe Subscriber", features: ["1M monthly points", "GPT-4o, Claude 3.5 Opus, Gemini", "DALL·E 3 generation", "Priority compute", "Higher rate limits"] }
  },
  /* AI SEARCH */
  {
    id: "perplexity", name: "Perplexity AI", company: "Perplexity", emoji: "🔍", category: "search",
    description: "AI-powered search engine with cited, up-to-date answers — combines LLMs with live web search.",
    tags: ["AI Search", "Citations", "Research"],
    url: "https://perplexity.ai",
    free: { price: "Free", detail: "Basic search", features: ["Unlimited quick searches", "Multiple AI models", "Source citations", "Image & video search", "Collection spaces"] },
    paid: { price: "$20/mo", detail: "Perplexity Pro", features: ["600+ Pro searches/day", "GPT-4o, Claude 3.5, Gemini Ultra", "Advanced research reports", "File upload & analysis", "$5 API credit/mo"] }
  },
  {
    id: "you", name: "You.com", company: "You.com Inc.", emoji: "🌐", category: "search",
    description: "Personalizable AI search+chat with selectable models including GPT-4, Claude, Gemini — privacy-first.",
    tags: ["AI Search", "Privacy", "Multi-model"],
    url: "https://you.com",
    free: { price: "Free", detail: "YouChat", features: ["AI chat with web search", "YouCode & YouWrite", "YouImagine image gen", "Research mode (limited)", "App cards"] },
    paid: { price: "$15/mo", detail: "You.com Pro", features: ["GPT-4o, Claude 3.5 Sonnet", "Unlimited research reports", "Priority model access", "Advanced YouCode", "File analysis"] }
  },
  {
    id: "phind", name: "Phind", company: "Phind", emoji: "🧑‍💻", category: "code",
    description: "AI search engine and coding assistant for developers — answers code questions with cited documentation.",
    tags: ["Developer", "Code search", "VS Code"],
    url: "https://phind.com",
    free: { price: "Free", detail: "Phind-70B", features: ["Phind-70B model", "Web & code search", "VS Code extension", "Direct code blocks", "40 searches/day"] },
    paid: { price: "$15/mo", detail: "Phind Pro", features: ["GPT-4o access", "Unlimited searches", "Claude 3 access", "Faster responses", "Priority support"] }
  },
  /* CODING */
  {
    id: "github-copilot", name: "GitHub Copilot", company: "GitHub / OpenAI", emoji: "🐙", category: "code",
    description: "World's most used AI coding assistant — autocomplete, chat, code review, and PR summaries in your IDE.",
    tags: ["IDE plugin", "Autocomplete", "PR"],
    url: "https://github.com/features/copilot",
    free: { price: "Free", detail: "Copilot Free", features: ["2,000 completions/mo", "50 chat requests/mo", "GPT-4o & Claude 3.5 Sonnet", "VS Code, JetBrains, Vim", "CLI assistance"] },
    paid: { price: "$10/mo", detail: "Copilot Pro", features: ["Unlimited completions", "Unlimited chat", "Copilot Workspace", "o1 & o3 model access", "Copilot for PRs & docs"] }
  },
  {
    id: "cursor", name: "Cursor", company: "Anysphere", emoji: "🖱️", category: "code",
    description: "VS Code fork with AI-native features — Composer for multi-file edits, Tab autocomplete, and agent mode.",
    tags: ["IDE", "VS Code fork", "Multi-file"],
    url: "https://cursor.so",
    free: { price: "Free", detail: "Hobby plan", features: ["2,000 autocomplete/mo", "50 slow requests/mo", "GPT-4o & Claude access (limited)", "Composer multi-file editor", "Chat with codebase"] },
    paid: { price: "$20/mo", detail: "Cursor Pro", features: ["Unlimited autocomplete", "500 fast requests/mo", "Unlimited slow requests", "o1 & Claude 3.5 Opus", "Background agents (beta)"] }
  },
  {
    id: "codeium", name: "Windsurf (Codeium)", company: "Codeium", emoji: "🏄", category: "code",
    description: "AI coding IDE — free unlimited autocomplete in 70+ editors with Cascade agent for complex tasks.",
    tags: ["IDE", "Free unlimited", "Cascade"],
    url: "https://codeium.com",
    free: { price: "Free", detail: "Windsurf Free", features: ["Unlimited autocomplete", "5 Cascade flows/mo", "GPT-4o & Claude access (limited)", "Chat & command", "70+ IDE integrations"] },
    paid: { price: "$15/mo", detail: "Windsurf Pro", features: ["Unlimited Cascade flows", "Pro models GPT-4o, Claude 3.5", "500 premium credits/mo", "Larger context window", "Priority support"] }
  },
  {
    id: "replit", name: "Replit AI", company: "Replit", emoji: "♻️", category: "code",
    description: "Cloud-based AI IDE for building, running, and deploying apps — from idea to deployed app in seconds.",
    tags: ["Cloud IDE", "Deploy", "No-code"],
    url: "https://replit.com",
    free: { price: "Free", detail: "Free plan", features: ["3 public Repls", "Basic AI (~100 completions/mo)", "Collaborative editing", "Always-on (limited)", "Community templates"] },
    paid: { price: "$20/mo", detail: "Replit Core", features: ["Replit AI Agent", "Unlimited AI completions", "Unlimited private Repls", "Always-on apps", "Custom domains & SSH"] }
  },
  {
    id: "tabnine", name: "Tabnine", company: "Tabnine", emoji: "📝", category: "code",
    description: "Privacy-first AI coding assistant with on-device model options — popular in enterprise environments.",
    tags: ["Privacy", "On-device", "Enterprise"],
    url: "https://tabnine.com",
    free: { price: "Free", detail: "Basic", features: ["AI code completions (basic)", "Single-line completions", "1M token/month", "VS Code & JetBrains", "Public model only"] },
    paid: { price: "$12/mo", detail: "Tabnine Pro", features: ["Full-line & full-function completions", "Chat with codebase", "GPT-4 backend", "Private code context", "Enterprise on-prem option"] }
  },
  {
    id: "amazon-q", name: "Amazon Q Developer", company: "Amazon AWS", emoji: "☁️", category: "code",
    description: "AWS's AI developer assistant — inline code suggestions, security scans, and code transformations.",
    tags: ["AWS", "Security scan", "Enterprise"],
    url: "https://aws.amazon.com/q/developer/",
    free: { price: "Free", detail: "Free tier", features: ["10K code suggestions/mo", "Security vulnerability scans", "Chat in IDE", "IaC generation", "CLI integration"] },
    paid: { price: "$19/mo", detail: "Q Developer Pro", features: ["Unlimited code suggestions", "Unlimited security scans", "Code transformation", "AWS Console assistance", "Enterprise SSO"] }
  },
  /* IMAGE GENERATION */
  {
    id: "midjourney", name: "Midjourney", company: "Midjourney Inc.", emoji: "🎨", category: "image",
    description: "Gold standard for AI art — stunning photorealistic and artistic images via Discord or web interface.",
    tags: ["Art", "Photorealistic", "Discord"],
    url: "https://midjourney.com",
    free: { price: "No free plan", detail: "Trial ended", features: ["Free trial was discontinued", "Discord-based generation", "Web app for subscribers", "V6.1 model quality", "N/A for free users"] },
    paid: { price: "$10/mo", detail: "Basic Plan", features: ["200 image generations/mo", "Web & Discord access", "3 concurrent fast jobs", "Commercial usage rights", "10 hrs relaxed GPU time"] }
  },
  {
    id: "dalle", name: "DALL·E 3", company: "OpenAI", emoji: "🖼️", category: "image",
    description: "OpenAI's image model inside ChatGPT Plus, Bing Creator, and API — excellent text-to-image accuracy.",
    tags: ["Text-to-image", "OpenAI", "API"],
    url: "https://openai.com/dall-e-3",
    free: { price: "Free (via Bing)", detail: "Bing Image Creator", features: ["Free via Bing Image Creator (15/day)", "Free via Microsoft Copilot", "Watermarked images", "Standard resolution", "No API access"] },
    paid: { price: "In ChatGPT Plus", detail: "$20/mo", features: ["HD quality generation", "No watermarks", "Edits & inpainting via API", "$0.04–0.12 per image API", "Outpainting"] }
  },
  {
    id: "stable-diffusion", name: "Stable Diffusion", company: "Stability AI", emoji: "🌊", category: "image",
    description: "Open-source image generation you can run locally for free, or use via Stability AI's cloud API.",
    tags: ["Open-source", "Local", "API"],
    url: "https://stability.ai",
    free: { price: "Free (self-host)", detail: "Run locally", features: ["Fully free locally (no GPU cap)", "SD 3, SDXL, SD 1.5 models", "ComfyUI / Automatic1111 UIs", "No content restrictions (local)", "Infinite generations"] },
    paid: { price: "$10/mo", detail: "Stability API", features: ["Cloud API access", "SD3 Ultra & SD3 Medium", "Fast cloud generation", "Commercial license", "No GPU required"] }
  },
  {
    id: "adobe-firefly", name: "Adobe Firefly", company: "Adobe", emoji: "🦋", category: "image",
    description: "Adobe's generative AI trained on licensed content — safe for commercial use, baked into Photoshop.",
    tags: ["Commercial safe", "Photoshop", "CC"],
    url: "https://firefly.adobe.com",
    free: { price: "Free", detail: "25 credits/mo", features: ["25 generative credits/month", "Text to Image", "Generative Fill (web)", "Generative Recolor", "Commercial-safe outputs"] },
    paid: { price: "$4.99/mo", detail: "Firefly Premium", features: ["100 generative credits/mo", "Firefly in Photoshop & Illustrator", "Enhanced quality models", "Priority generation", "Firefly HD"] }
  },
  {
    id: "ideogram", name: "Ideogram", company: "Ideogram AI", emoji: "✏️", category: "image",
    description: "Best AI for generating accurate text inside images — logos, posters, and typography like no other model.",
    tags: ["Text in images", "Logo", "Typography"],
    url: "https://ideogram.ai",
    free: { price: "Free", detail: "10 slow/day", features: ["10 slow generations/day", "Text rendering in images", "Render quality selector", "Public gallery", "Remix & upscale"] },
    paid: { price: "$8/mo", detail: "Ideogram Basic", features: ["400 priority credits/mo", "Private generations", "Faster speeds", "Higher resolution", "Bulk download"] }
  },
  {
    id: "flux", name: "FLUX.1", company: "Black Forest Labs", emoji: "🌌", category: "image",
    description: "State-of-the-art open image model by ex-Stability AI team — FLUX.1 Schnell is free and open-source.",
    tags: ["Open-source", "SOTA", "Fast"],
    url: "https://blackforestlabs.ai",
    free: { price: "Free (Schnell)", detail: "Open-source", features: ["FLUX.1 Schnell fully free & open", "Available on Replicate, ComfyUI, Fal.ai", "Self-host free (12GB VRAM)", "Apache 2.0 license", "4-step ultra-fast generation"] },
    paid: { price: "API usage", detail: "FLUX.1 Pro", features: ["FLUX.1 Pro commercial license", "Highest quality model", "~$0.055/image via API", "Available on fal.ai, Replicate", "Enterprise licensing"] }
  },
  {
    id: "canva-ai", name: "Canva AI", company: "Canva", emoji: "🎭", category: "image",
    description: "Canva's suite of AI — Magic Design, Magic Media, Background Remover, and AI writing in the editor.",
    tags: ["Design", "Templates", "Easy"],
    url: "https://canva.com",
    free: { price: "Free", detail: "50 credits/mo", features: ["50 Magic Studio credits/month", "AI image generation (limited)", "Background Remover (5/mo)", "Magic Write (25 uses)", "Unlimited free templates"] },
    paid: { price: "$14.99/mo", detail: "Canva Pro", features: ["500 image gen credits/mo", "Unlimited Magic Resize", "Brand Kit", "Magic Expand & Magic Edit", "1TB cloud storage"] }
  },
  /* AUDIO & VOICE */
  {
    id: "elevenlabs", name: "ElevenLabs", company: "ElevenLabs", emoji: "🎤", category: "audio",
    description: "Industry-leading AI voice cloning — realistic speech in 30+ languages from just a few seconds of audio.",
    tags: ["Voice cloning", "TTS", "30 languages"],
    url: "https://elevenlabs.io",
    free: { price: "Free", detail: "10K chars/mo", features: ["10,000 characters/month", "3 custom voices", "Text-to-speech", "Voice Library access", "MP3 download"] },
    paid: { price: "$5/mo", detail: "Starter Plan", features: ["30,000 characters/month", "10 custom voices", "Professional voice cloning", "Projects (long-form)", "API access"] }
  },
  {
    id: "murf", name: "Murf AI", company: "Murf Inc.", emoji: "🎙️", category: "audio",
    description: "Studio-quality AI voiceovers for videos and presentations — 120+ voices across 20+ languages.",
    tags: ["Voiceover", "Video sync", "Studio"],
    url: "https://murf.ai",
    free: { price: "Free", detail: "10 min/mo", features: ["10 minutes voice/month", "120+ AI voices", "No watermark on audio", "Basic pitch & speed controls", "MP3 download"] },
    paid: { price: "$29/mo", detail: "Creator Plan", features: ["24 hours of voice/month", "Voice cloning", "Video & presentation sync", "Commercial usage rights", "Priority rendering"] }
  },
  {
    id: "suno", name: "Suno", company: "Suno AI", emoji: "🎵", category: "audio",
    description: "Generate complete original songs — lyrics, vocals, instruments — just by typing a text prompt.",
    tags: ["Music gen", "Lyrics", "Songs"],
    url: "https://suno.com",
    free: { price: "Free", detail: "50 credits/day", features: ["50 credits/day (~10 songs)", "Song generation from text", "Custom lyrics input", "Public songs hub", "Non-commercial use"] },
    paid: { price: "$8/mo", detail: "Pro Plan", features: ["2,500 credits/month (~500 songs)", "Commercial usage rights", "No queue for generation", "Priority compute", "MP3 download"] }
  },
  {
    id: "udio", name: "Udio", company: "Udio AI", emoji: "🎶", category: "audio",
    description: "Suno's competitor for AI music — high-quality full songs from text prompts with fine-grained mixing.",
    tags: ["Music gen", "Mixing", "High quality"],
    url: "https://udio.com",
    free: { price: "Free", detail: "1,200 credits/mo", features: ["1,200 credits/month", "~300 songs/month", "Lyric generation", "Extend & remix tracks", "Full-length songs"] },
    paid: { price: "$10/mo", detail: "Standard Plan", features: ["4,800 credits/month", "Commercial rights", "Private generations", "Priority queue", "Download WAV & MP3"] }
  },
  {
    id: "whisper", name: "Whisper (OpenAI)", company: "OpenAI", emoji: "🗣️", category: "audio",
    description: "OpenAI's open-source speech-to-text — best-in-class transcription in 99 languages, free to self-host.",
    tags: ["STT", "Transcription", "Open-source"],
    url: "https://openai.com/research/whisper",
    free: { price: "Free (self-host)", detail: "Open-source", features: ["Fully open-source (MIT license)", "Run locally on CPU/GPU", "99 language transcription", "Speaker diarization (with extras)", "Unlimited local use"] },
    paid: { price: "$0.006/min", detail: "OpenAI API", features: ["Cloud API (no GPU needed)", "Faster managed service", "Reliable uptime & scaling", "JSON/SRT/VTT output", "Language detection"] }
  },
  /* VIDEO */
  {
    id: "runway", name: "Runway Gen-3", company: "Runway ML", emoji: "🎬", category: "video",
    description: "Hollywood-grade AI video generation — text-to-video, image-to-video, and advanced creative editing.",
    tags: ["Text-to-video", "Editing", "Pro"],
    url: "https://runwayml.com",
    free: { price: "Free", detail: "125 one-time credits", features: ["125 one-time free credits", "Gen-3 Alpha Turbo (5s clips)", "Image-to-video", "Text-to-video", "Watermark on exports"] },
    paid: { price: "$15/mo", detail: "Standard Plan", features: ["625 credits/month", "No watermark", "Gen-3 Alpha (HD)", "Audio generation", "Multi-motion brush"] }
  },
  {
    id: "sora", name: "Sora", company: "OpenAI", emoji: "🌅", category: "video",
    description: "OpenAI's groundbreaking text-to-video — cinematic 1080p videos up to 20 seconds from text prompts.",
    tags: ["Text-to-video", "HD", "OpenAI"],
    url: "https://sora.com",
    free: { price: "Free (limited)", detail: "480p, watermarked", features: ["Free tier with watermark", "480p resolution", "5-second clips", "Limited monthly generations", "Social features"] },
    paid: { price: "In ChatGPT Plus", detail: "$20/mo", features: ["1080p resolution", "20-second clips", "50 priority generations/mo", "No watermark", "Storyboard mode"] }
  },
  {
    id: "pika", name: "Pika", company: "Pika Labs", emoji: "⚡", category: "video",
    description: "Fast AI video — text-to-video, image animation, and lip-sync. Popular for social media content creators.",
    tags: ["Lip-sync", "Social", "Fast"],
    url: "https://pika.art",
    free: { price: "Free", detail: "150 credits/mo", features: ["150 free monthly credits", "Text-to-video & image-to-video", "Pika 1.5 model", "Standard watermark", "Discord bot access"] },
    paid: { price: "$8/mo", detail: "Basic Plan", features: ["700 credits/month", "No watermark", "Pikaffects special effects", "Priority generation", "HD downloads"] }
  },
  {
    id: "synthesia", name: "Synthesia", company: "Synthesia", emoji: "🧑‍🎤", category: "video",
    description: "Create professional AI video presentations with photo-realistic avatars and AI voices — no camera needed.",
    tags: ["AI Avatar", "Presentation", "Corporate"],
    url: "https://synthesia.io",
    free: { price: "Free", detail: "3 min/mo", features: ["3 minutes of video/month", "Starter AI avatar", "9 languages", "Branded templates (limited)", "MP4 download"] },
    paid: { price: "$18/mo", detail: "Starter Plan", features: ["10 minutes video/month", "60+ AI avatars", "140+ languages", "Screen recording overlay", "Custom avatar creation"] }
  },
  {
    id: "heygen", name: "HeyGen", company: "HeyGen", emoji: "🎦", category: "video",
    description: "AI video with ultra-realistic lip-sync translation — translate videos into 40+ languages frame-perfectly.",
    tags: ["Video translation", "Lip-sync", "Avatar"],
    url: "https://heygen.com",
    free: { price: "Free", detail: "1 min trial", features: ["1-minute trial video", "AI avatar creation (1)", "Text-to-video basic", "Video translation (1 min)", "Watermarked output"] },
    paid: { price: "$29/mo", detail: "Creator Plan", features: ["15 min of video/month", "Unlimited custom avatars", "Video translation 40+ languages", "No watermark", "Priority rendering"] }
  },
  /* BUSINESS */
  {
    id: "notion-ai", name: "Notion AI", company: "Notion Labs", emoji: "📓", category: "business",
    description: "AI writing, summarization, and Q&A embedded directly in Notion docs, databases, and wikis.",
    tags: ["Productivity", "Writing", "Workspace"],
    url: "https://notion.so/product/ai",
    free: { price: "Limited trial", detail: "20 AI responses", features: ["20 AI responses trial", "Writing assistance", "Summarize & translate", "Q&A on your pages", "Action items extraction"] },
    paid: { price: "$10/mo add-on", detail: "Notion AI", features: ["Unlimited AI usage", "AI-powered workspace search", "Data from Slack & email", "Meeting notes summarization", "Autofill database properties"] }
  },
  {
    id: "jasper", name: "Jasper AI", company: "Jasper AI Inc.", emoji: "💎", category: "business",
    description: "Enterprise AI content platform for marketing teams — brand voice, campaigns, SEO, and global scale.",
    tags: ["Marketing", "SEO", "Brand voice"],
    url: "https://jasper.ai",
    free: { price: "7-day trial", detail: "No free tier", features: ["7-day free trial", "Full feature access during trial", "Brand voice setup", "SEO mode", "No credit card for trial"] },
    paid: { price: "$49/mo", detail: "Creator Plan", features: ["Unlimited AI words", "SEO integration (Surfer)", "Brand voice & style guide", "50+ AI templates", "Campaigns & ads workflows"] }
  },
  {
    id: "copy-ai", name: "Copy.ai", company: "Copy.ai Inc.", emoji: "✍️", category: "business",
    description: "GTM AI platform for go-to-market teams — AI workflows for sales emails, content, and demand gen.",
    tags: ["Copywriting", "Sales", "GTM"],
    url: "https://copy.ai",
    free: { price: "Free", detail: "2,000 words/mo", features: ["2,000 words/month", "90+ copy templates", "ChatGPT-style chat mode", "Blog post wizard", "1 user seat"] },
    paid: { price: "$49/mo", detail: "Pro Plan", features: ["Unlimited words", "GTM AI workflows", "5+ user seats", "Brand voice", "API access"] }
  },
  {
    id: "salesforce-einstein", name: "Einstein AI", company: "Salesforce", emoji: "☁️", category: "business",
    description: "Salesforce's platform-wide AI — predictive scoring, email drafting, and Agentforce AI agents.",
    tags: ["CRM", "Enterprise", "Agentforce"],
    url: "https://salesforce.com/einstein",
    free: { price: "With Salesforce CRM", detail: "Basic features", features: ["Einstein Activity Capture", "Basic predictive scoring", "Email insights", "Opportunity likelihood", "Included in paid Salesforce plans"] },
    paid: { price: "$75/user/mo", detail: "Einstein 1 Platform", features: ["Agentforce AI agents", "Einstein Copilot for CRM", "Data Cloud integration", "Predictive & generative AI", "Custom AI model builder"] }
  },
  /* MULTIMODAL */
  {
    id: "gpt4o", name: "GPT-4o", company: "OpenAI", emoji: "🌟", category: "multimodal",
    description: "OpenAI's omni flagship — text, image, audio, and video processing with real-time voice conversation.",
    tags: ["Voice mode", "Vision", "Real-time"],
    url: "https://openai.com/gpt-4o",
    free: { price: "Free (limited)", detail: "Via ChatGPT", features: ["In ChatGPT free (daily limit)", "Image & vision input", "Voice mode (limited)", "Real-time reasoning", "Mobile voice assistant"] },
    paid: { price: "$5/1M input tokens", detail: "OpenAI API", features: ["Unlimited via API", "Advanced Voice Mode (full)", "Real-time API streaming audio", "Vision & document analysis", "Function calling & JSON mode"] }
  },
  {
    id: "llama", name: "Llama (Meta AI)", company: "Meta", emoji: "🦙", category: "multimodal",
    description: "Meta's fully open-source LLM — Llama 3.3 70B rivals GPT-4 and is free to download, modify, deploy.",
    tags: ["Open-source", "Free", "Commercial"],
    url: "https://llama.meta.com",
    free: { price: "Free & Open-source", detail: "Download models", features: ["Llama 3.3 70B fully free", "Commercial use allowed", "Run locally (Ollama, LM Studio)", "Via Meta AI on WhatsApp/Instagram", "Hugging Face hosted (free)"] },
    paid: { price: "Cloud API costs", detail: "Via cloud providers", features: ["Hosted via AWS, Azure, GCP", "Groq ultra-fast free tier", "Together AI, Fireworks AI", "Meta AI Pro integration", "Pay-per-token by provider"] }
  },
  {
    id: "deepseek", name: "DeepSeek", company: "DeepSeek AI", emoji: "🐋", category: "multimodal",
    description: "Chinese open-source AI — DeepSeek-V3 and R1 rival GPT-4 at a fraction of the cost. Free chat included.",
    tags: ["Open-source", "Low cost", "Reasoning"],
    url: "https://deepseek.com",
    free: { price: "Free", detail: "deepseek.com chat", features: ["DeepSeek V3 chat free", "DeepSeek R1 reasoning free", "Open-source models downloadable", "API free tier (50M tokens)", "Vision input support"] },
    paid: { price: "$0.27/1M tokens", detail: "DeepSeek API", features: ["Cache-hit: $0.07/1M tokens", "R1 reasoning API", "Higher rate limits", "Context caching", "Enterprise support"] }
  },
  {
    id: "qwen", name: "Qwen (Alibaba)", company: "Alibaba Cloud", emoji: "🔮", category: "multimodal",
    description: "Alibaba's Qwen2.5 rivals top closed-source models — free 72B open weights with strong multimodal support.",
    tags: ["Chinese AI", "Open-source", "Multilingual"],
    url: "https://qwenlm.github.io",
    free: { price: "Free (open-source)", detail: "Qwen2.5 72B", features: ["Qwen2.5 72B fully open-source", "Apache 2.0 license", "Vision, audio, video models", "Via Hugging Face, Ollama", "Free API tier on Alibaba Cloud"] },
    paid: { price: "$0.40/1M tokens", detail: "Alibaba Cloud API", features: ["Qwen-Max top model", "Higher rate limits", "Enterprise SLA", "Qwen-VL vision API", "Alibaba Cloud integration"] }
  },
  {
    id: "gemini-pro", name: "Gemini 1.5 Pro", company: "Google DeepMind", emoji: "🧠", category: "multimodal",
    description: "Google's multimodal model with 2M token context — processes text, images, audio, video, and code.",
    tags: ["2M context", "Audio+Video", "API"],
    url: "https://aistudio.google.com",
    free: { price: "Free (API)", detail: "Google AI Studio", features: ["Free via AI Studio", "1M token context", "Video & audio analysis", "Code execution tool", "15 RPM / 1M TPD limits"] },
    paid: { price: "$7/1M tokens", detail: "Gemini API paid", features: ["2M token context", "Higher rate limits", "Production SLA", "Vertex AI deployment", "Enterprise support"] }
  },

  /* ── NEW TOOLS ── TEXT & CHAT ── */
  {
    id: "cohere", name: "Cohere Command R+", company: "Cohere", emoji: "🔗", category: "text",
    description: "Enterprise-grade RAG-optimized LLM — Command R+ excels at retrieval-augmented generation and tool use.",
    tags: ["RAG", "Enterprise", "API"],
    url: "https://cohere.com",
    free: { price: "Free (trial)", detail: "Playground", features: ["Free playground access", "Command R+ trial", "5 API calls/min", "RAG with web search", "Multi-step tool use"] },
    paid: { price: "$1/1M tokens", detail: "Production API", features: ["Command R+ production", "Unlimited rate (custom)", "Enterprise RAG connectors", "Fine-tuning support", "SOC 2 compliant"] }
  },
  {
    id: "pi", name: "Pi", company: "Inflection AI", emoji: "🥧", category: "text",
    description: "Emotionally intelligent AI companion — conversational, empathetic, and great for brainstorming and wellbeing.",
    tags: ["Companion", "Empathetic", "Voice"],
    url: "https://pi.ai",
    free: { price: "Free", detail: "Unlimited chat", features: ["Unlimited free conversations", "Voice mode (natural tone)", "Multi-platform (iOS, Android, web)", "Memory across sessions", "Emotionally aware responses"] },
    paid: { price: "Free (no paid)", detail: "Fully free", features: ["All features included free", "No premium tier currently", "Voice conversations", "Personalized coaching", "Daily check-ins"] }
  },
  {
    id: "kimi", name: "Kimi", company: "Moonshot AI", emoji: "🌙", category: "text",
    description: "Chinese AI with ultra-long 2M token context — reads entire codebases, books, and document libraries at once.",
    tags: ["2M context", "Chinese AI", "Long docs"],
    url: "https://kimi.moonshot.cn",
    free: { price: "Free", detail: "Kimi Chat", features: ["Free unlimited chat", "2M token context window", "File & URL analysis", "Web search integration", "Code generation"] },
    paid: { price: "$0.12/1M tokens", detail: "Moonshot API", features: ["Moonshot API access", "128K–2M context options", "Higher rate limits", "Function calling", "Enterprise support"] }
  },
  {
    id: "character-ai", name: "Character.AI", company: "Character Technologies", emoji: "🎭", category: "text",
    description: "Create and chat with AI characters — millions of user-made personas for roleplay, learning, and entertainment.",
    tags: ["Characters", "Roleplay", "Social"],
    url: "https://character.ai",
    free: { price: "Free", detail: "Standard access", features: ["Unlimited character chats", "Create custom characters", "Community character library", "Group chats", "Mobile apps"] },
    paid: { price: "$9.99/mo", detail: "c.ai+", features: ["Priority chat (no queues)", "Faster response times", "Early access to new features", "Community supporter badge", "Extended memory"] }
  },

  /* ── NEW TOOLS ── AI SEARCH ── */
  {
    id: "exa", name: "Exa AI", company: "Exa", emoji: "🔬", category: "search",
    description: "Neural search engine API built for AI — finds precise pages, papers, and data using embeddings, not keywords.",
    tags: ["Neural search", "API", "Embeddings"],
    url: "https://exa.ai",
    free: { price: "Free", detail: "1,000 searches/mo", features: ["1,000 free searches/month", "Neural & keyword search", "Auto-extract page contents", "Similarity search", "Python & JS SDKs"] },
    paid: { price: "$0.003/search", detail: "Growth Plan", features: ["Pay-per-search pricing", "Higher rate limits", "Content auto-extraction", "Category filters", "Enterprise support"] }
  },
  {
    id: "tavily", name: "Tavily", company: "Tavily", emoji: "🌍", category: "search",
    description: "Search API purpose-built for AI agents — optimized for LLM consumption with structured, relevant results.",
    tags: ["AI Agent search", "API", "Structured"],
    url: "https://tavily.com",
    free: { price: "Free", detail: "1,000 queries/mo", features: ["1,000 free queries/month", "AI-optimized search results", "Advanced search filters", "Python & REST API", "News & general web search"] },
    paid: { price: "$0.005/query", detail: "Pro Plan", features: ["Higher rate limits", "Priority infrastructure", "Custom extraction", "Domain filtering", "Enterprise SLA"] }
  },

  /* ── NEW TOOLS ── VIDEO ── */
  {
    id: "kling", name: "Kling AI", company: "Kuaishou", emoji: "🎞️", category: "video",
    description: "Chinese AI video leader — generates cinematic 1080p videos up to 2 minutes with remarkable motion quality.",
    tags: ["2-min video", "1080p", "Chinese AI"],
    url: "https://klingai.com",
    free: { price: "Free", detail: "66 credits/day", features: ["66 free credits daily", "5-second video generation", "720p resolution", "Image-to-video", "Text-to-video"] },
    paid: { price: "$8/mo", detail: "Standard Plan", features: ["660 credits/month", "1080p resolution", "2-minute videos", "No watermark", "Priority generation"] }
  },
  {
    id: "luma", name: "Luma Dream Machine", company: "Luma AI", emoji: "💭", category: "video",
    description: "Fast, high-quality AI video from text or images — Dream Machine generates 5s clips with impressive physics.",
    tags: ["Dream Machine", "Fast", "Physics"],
    url: "https://lumalabs.ai",
    free: { price: "Free", detail: "30 gen/mo", features: ["30 free generations/month", "5-second clips", "Text & image to video", "720p resolution", "Watermark on exports"] },
    paid: { price: "$9.99/mo", detail: "Standard Plan", features: ["120 generations/month", "1080p resolution", "No watermark", "Priority queue", "Extended 10s clips"] }
  },
  {
    id: "descript", name: "Descript", company: "Descript Inc.", emoji: "✂️", category: "video",
    description: "AI-powered video and podcast editor — edit video by editing text. Includes filler word removal and AI voices.",
    tags: ["Video editor", "Podcast", "Text-edit"],
    url: "https://descript.com",
    free: { price: "Free", detail: "1 hr transcription", features: ["1 hour of transcription", "Edit video as text", "Screen recording", "Filler word removal", "Stock media library"] },
    paid: { price: "$24/mo", detail: "Hobbyist Plan", features: ["10 hours transcription/mo", "AI green screen", "Studio Sound (noise removal)", "AI eye contact correction", "Custom AI voice clone"] }
  },
  {
    id: "opus-clip", name: "Opus Clip", company: "Opus AI", emoji: "🎯", category: "video",
    description: "AI short-form video repurposing — automatically clips long videos into viral TikTok, Reels, and Shorts.",
    tags: ["Short-form", "Repurpose", "Viral"],
    url: "https://opus.pro",
    free: { price: "Free", detail: "60 min upload", features: ["60 minutes of upload", "10 clips per video", "AI curation scoring", "Auto-captions", "Watermarked exports"] },
    paid: { price: "$15/mo", detail: "Starter Plan", features: ["200 min upload/month", "Unlimited clips", "No watermark", "1080p exports", "Brand templates"] }
  },

  /* ── NEW TOOLS ── IMAGE ── */
  {
    id: "recraft", name: "Recraft V3", company: "Recraft AI", emoji: "🏆", category: "image",
    description: "Top-ranked on ELO — Recraft V3 generates stunning images with precise text rendering and vector output.",
    tags: ["ELO #1", "Vectors", "Text rendering"],
    url: "https://recraft.ai",
    free: { price: "Free", detail: "50 images/day", features: ["50 free images/day", "Vector SVG generation", "Perfect text in images", "Style consistency", "Background removal"] },
    paid: { price: "$25/mo", detail: "Recraft Pro", features: ["2,000 images/month", "Priority generation", "Commercial license", "API access", "Custom brand styles"] }
  },
  {
    id: "leonardo", name: "Leonardo AI", company: "Leonardo AI", emoji: "🖌️", category: "image",
    description: "Versatile AI image platform — fine-tuned models, real-time canvas, and motion for game/product design.",
    tags: ["Fine-tune", "Canvas", "Motion"],
    url: "https://leonardo.ai",
    free: { price: "Free", detail: "150 tokens/day", features: ["150 daily tokens", "Leonardo Phoenix model", "Real-time canvas", "Image-to-image", "Community models"] },
    paid: { price: "$12/mo", detail: "Apprentice Plan", features: ["8,500 tokens/month", "Private generations", "Alchemy V2 enhancer", "Motion generation", "Priority infrastructure"] }
  },
  {
    id: "playground-ai", name: "Playground", company: "Playground AI", emoji: "🎪", category: "image",
    description: "Free AI image generation with generous limits — mixed-image editing, canvas mode, and SDXL fine-tunes.",
    tags: ["Generous free", "Canvas", "SDXL"],
    url: "https://playground.com",
    free: { price: "Free", detail: "100 images/day", features: ["100 free images/day", "Playground V3 model", "Board mode (canvas)", "Image-to-image editing", "Community gallery"] },
    paid: { price: "$15/mo", detail: "Pro Plan", features: ["2,000 images/day", "DALL-E 3 access", "Priority generation", "Private images", "Commercial license"] }
  },

  /* ── NEW TOOLS ── CODING ── */
  {
    id: "v0", name: "v0 by Vercel", company: "Vercel", emoji: "🚀", category: "code",
    description: "AI-powered UI generation — describe a component in plain text and get production-ready React/Next.js code.",
    tags: ["UI gen", "React", "Next.js"],
    url: "https://v0.dev",
    free: { price: "Free", detail: "200 credits/mo", features: ["200 free credits/month", "React & Next.js components", "Tailwind CSS output", "Shadcn/UI integration", "Copy & paste code"] },
    paid: { price: "$20/mo", detail: "Premium Plan", features: ["5,000 credits/month", "Priority generation", "Private projects", "Deploy to Vercel", "Team collaboration"] }
  },
  {
    id: "bolt", name: "Bolt.new", company: "StackBlitz", emoji: "⚡", category: "code",
    description: "Full-stack AI web dev in the browser — generates, edits, and deploys complete apps from a single prompt.",
    tags: ["Full-stack", "Browser IDE", "Deploy"],
    url: "https://bolt.new",
    free: { price: "Free", detail: "Limited tokens", features: ["Limited free daily tokens", "Full-stack app generation", "In-browser code editor", "npm package support", "Deploy to Netlify"] },
    paid: { price: "$20/mo", detail: "Pro Plan", features: ["10M tokens/month", "Unlimited projects", "Priority model access", "GitHub integration", "Custom domains"] }
  },
  {
    id: "lovable", name: "Lovable", company: "Lovable (GPT Engineer)", emoji: "💜", category: "code",
    description: "AI full-stack engineer — generates complete web apps with frontend, backend, auth, and database from prompts.",
    tags: ["Full-stack", "Supabase", "Deploy"],
    url: "https://lovable.dev",
    free: { price: "Free", detail: "5 generations/day", features: ["5 free generations/day", "React + Vite + Tailwind", "Supabase integration", "GitHub sync", "Preview & share"] },
    paid: { price: "$20/mo", detail: "Starter Plan", features: ["100 generations/month", "Custom domains", "Auth & database setup", "Priority support", "Team collaboration"] }
  },
  {
    id: "cody", name: "Cody by Sourcegraph", company: "Sourcegraph", emoji: "🤓", category: "code",
    description: "AI coding assistant with full codebase context — searches your entire repo to give accurate, grounded answers.",
    tags: ["Codebase context", "Search", "Enterprise"],
    url: "https://sourcegraph.com/cody",
    free: { price: "Free", detail: "Cody Free", features: ["Unlimited autocomplete", "500 chat messages/mo", "VS Code & JetBrains", "Full codebase context", "GPT-4o & Claude 3.5"] },
    paid: { price: "$9/mo", detail: "Cody Pro", features: ["Unlimited chat messages", "Unlimited commands", "Advanced models access", "Larger context window", "Priority support"] }
  },
  {
    id: "huggingchat", name: "HuggingChat", company: "Hugging Face", emoji: "🤗", category: "code",
    description: "Open-source AI chat by Hugging Face — access top open models like Llama, Mixtral, and Command R+ for free.",
    tags: ["Open-source", "Multi-model", "Free"],
    url: "https://huggingface.co/chat",
    free: { price: "Free", detail: "Open models", features: ["Fully free to use", "Llama 3.3, Mixtral, Command R+", "Web search integration", "File upload & analysis", "Custom assistants"] },
    paid: { price: "$9/mo", detail: "HF Pro", features: ["Priority inference", "Access to gated models", "ZeroGPU spaces", "Faster generation", "Community support"] }
  },

  /* ── NEW TOOLS ── AUDIO ── */
  {
    id: "speechify", name: "Speechify", company: "Speechify Inc.", emoji: "📖", category: "audio",
    description: "AI text-to-speech for reading anything aloud — PDFs, articles, emails with natural-sounding premium voices.",
    tags: ["TTS", "Reader", "Chrome extension"],
    url: "https://speechify.com",
    free: { price: "Free", detail: "Basic voices", features: ["Basic AI voices", "Chrome extension", "Listen to any web page", "PDF upload & read", "10+ languages"] },
    paid: { price: "$11.58/mo", detail: "Premium Plan", features: ["30+ premium HD voices", "OCR (scan & read images)", "Unlimited listening", "Audiobook imports", "Speed up to 4.5x"] }
  },
  {
    id: "soundraw", name: "Soundraw", company: "Soundraw Inc.", emoji: "🎹", category: "audio",
    description: "AI music generator for creators — generate royalty-free background music customized by mood, genre, and length.",
    tags: ["Royalty-free", "Background music", "Customizable"],
    url: "https://soundraw.io",
    free: { price: "Free (preview)", detail: "Generate & preview", features: ["Unlimited generation", "Preview tracks", "Customize mood & tempo", "Multiple genres", "No download on free"] },
    paid: { price: "$16.99/mo", detail: "Creator Plan", features: ["Unlimited downloads", "Royalty-free for YouTube, TikTok", "Custom track lengths", "Stems & loops", "Commercial license"] }
  },

  /* ── NEW TOOLS ── BUSINESS ── */
  {
    id: "grammarly", name: "Grammarly AI", company: "Grammarly", emoji: "📝", category: "business",
    description: "AI writing assistant for clarity, tone, and correctness — now with generative AI for drafting and rewriting.",
    tags: ["Grammar", "Tone", "Writing"],
    url: "https://grammarly.com",
    free: { price: "Free", detail: "Basic corrections", features: ["Grammar & spelling checks", "Tone detection", "Basic clarity suggestions", "Chrome & Edge extension", "Mobile keyboard"] },
    paid: { price: "$12/mo", detail: "Grammarly Premium", features: ["Full sentence rewrites", "AI text generation", "Tone adjustments", "Plagiarism detection", "Brand tones & style guides"] }
  },
  {
    id: "writesonic", name: "Writesonic", company: "Writesonic Inc.", emoji: "✏️", category: "business",
    description: "AI content platform for blogs, ads, and landing pages — includes Chatsonic (GPT-4 powered chat with web access).",
    tags: ["Blog writing", "Ads", "Chatsonic"],
    url: "https://writesonic.com",
    free: { price: "Free", detail: "10K words/mo", features: ["10,000 words/month", "Chatsonic AI chat", "25+ languages", "Browser extension", "Landing page generator"] },
    paid: { price: "$16/mo", detail: "Pro Plan", features: ["100K words/month", "GPT-4 & Claude access", "Bulk content generation", "API access", "Brand voice training"] }
  },
  {
    id: "dify", name: "Dify", company: "Dify AI", emoji: "🧩", category: "business",
    description: "Open-source LLM app development platform — visual workflow builder for AI agents, RAG pipelines, and chatbots.",
    tags: ["LLM Ops", "Workflow", "Open-source"],
    url: "https://dify.ai",
    free: { price: "Free (self-host)", detail: "Open-source", features: ["Fully open-source (self-host)", "Visual workflow builder", "RAG pipeline builder", "200+ model integrations", "Community edition unlimited"] },
    paid: { price: "$59/mo", detail: "Professional", features: ["Dify Cloud hosted", "Team collaboration", "Priority support", "Custom branding", "Advanced analytics"] }
  },
  {
    id: "coze", name: "Coze", company: "ByteDance", emoji: "🤖", category: "business",
    description: "ByteDance's AI bot builder — create and deploy AI chatbots with plugins, workflows, and knowledge bases.",
    tags: ["Bot builder", "No-code", "ByteDance"],
    url: "https://coze.com",
    free: { price: "Free", detail: "Generous limits", features: ["GPT-4o & Gemini Pro access", "Plugin marketplace", "Knowledge base upload", "Workflow automation", "Multi-platform deploy"] },
    paid: { price: "$9/mo", detail: "Premium Plan", features: ["Higher API limits", "Premium model access", "Priority support", "Team workspace", "Advanced analytics"] }
  },
  {
    id: "letta", name: "Letta (MemGPT)", company: "Letta AI", emoji: "🧠", category: "multimodal",
    description: "AI agents with persistent memory — open-source framework for building stateful, long-running AI agents.",
    tags: ["Memory", "Agents", "Open-source"],
    url: "https://letta.com",
    free: { price: "Free (open-source)", detail: "Self-host", features: ["Fully open-source", "Persistent memory system", "Multi-session context", "Tool use & function calling", "Local or cloud deployment"] },
    paid: { price: "$25/mo", detail: "Letta Cloud", features: ["Managed cloud hosting", "Team collaboration", "Agent monitoring dashboard", "Priority support", "Enterprise SSO"] }
  }
];

/* ─────────────────────────────────────────────────────
   2.  ORGAN AI ASSISTANT  (Puter.js · free GPT-4o · no API key)
   ───────────────────────────────────────────────────── */

const SYSTEM_PROMPT = `You are ORGAN Assistant, the expert AI guide for ORGAN AI — a platform that tracks 65+ major AI tools (free and paid) in one place.
Your job: help users discover, compare, and choose AI tools.
Rules:
- Be concise, friendly, and direct (under 150 words)
- Bold tool names using **name** syntax
- Give concrete recommendations with pricing when relevant
- If asked about a tool not in ORGAN AI, still give a helpful answer
- Never say you can't help — always give value`;

/* Conversation history for multi-turn context */
const chatHistory = [{ role: 'system', content: SYSTEM_PROMPT }];

/* ── Helper: check if Puter is authenticated (prevents popup) ── */
function isPuterReady() {
  try {
    if (typeof puter === 'undefined' || !puter.ai) return false;
    // Puter.js v2 sets puter.authToken when user is signed in
    if (puter.authToken) return true;
    // Also check the auth module if available
    if (puter.auth && typeof puter.auth.isSignedIn === 'function') {
      return puter.auth.isSignedIn();
    }
    // If running on puter.com domain, it's always ready
    if (window.location.hostname.includes('puter.com')) return true;
    return false;
  } catch (e) {
    return false;
  }
}

/* ── Puter.js AI call (only if already authenticated — NO popup) ── */
async function callAI(userMessage) {
  chatHistory.push({ role: 'user', content: userMessage });

  // 1️⃣ Primary: Puter.js — ONLY if already signed in (never trigger popup)
  if (isPuterReady()) {
    try {
      const resp = await puter.ai.chat(chatHistory, { model: 'gpt-4o-mini' });
      let text = '';
      if (typeof resp === 'string') {
        text = resp;
      } else if (resp?.message?.content) {
        const c = resp.message.content;
        text = Array.isArray(c) ? c.map(p => p.text || '').join('') : String(c);
      } else if (resp?.text) {
        text = resp.text;
      }
      text = text.trim();
      if (text.length > 10) {
        chatHistory.push({ role: 'assistant', content: text });
        return text;
      }
    } catch (err) {
      console.warn('Puter.js error:', err);
    }
  }

  // 2️⃣ Fallback: smart local AI engine (searches tool database)
  chatHistory.pop(); // remove failed user turn
  chatHistory.push({ role: 'user', content: userMessage });
  const local = getSmartAnswer(userMessage);
  chatHistory.push({ role: 'assistant', content: local });
  return local;
}

/* ── Smart Local AI Engine (searches AI_TOOLS database dynamically) ── */
function getSmartAnswer(q) {
  const ql = q.toLowerCase().trim();

  // ── 1. Curated high-quality answers for common questions ──
  const curated = [
    [['best free', 'free ai', 'free coding', 'free code'],
     'For free coding AI: **GitHub Copilot Free** (2,000 completions/mo), **Windsurf by Codeium** (unlimited autocomplete), **Cursor Hobby** (50 slow requests/mo), **v0 by Vercel** (200 credits/mo for UI gen), and **Bolt.new** (full-stack apps in browser). All genuinely free!'],
    [['chatgpt vs claude', 'gpt vs claude', 'compare chatgpt', 'compare claude'],
     '**ChatGPT** excels at reasoning, coding, and versatility with GPT-4o. **Claude** shines at long documents (200K context), nuanced writing, and safety. Both cost $20/mo for paid tiers. Try both free tiers to see which fits your style!'],
    [['chatgpt vs gemini', 'gpt vs gemini', 'compare gemini'],
     '**ChatGPT** (GPT-4o) leads in coding and reasoning. **Gemini** excels at Google integration (Gmail, Docs, Drive) and has a massive 2M token context. Both are free with paid tiers at $20/mo. Choose Gemini if you live in Google Workspace!'],
    [['cheap image', 'cheapest image', 'free image', 'budget image'],
     'Cheapest image AI: **Playground** (100 free/day!), **Recraft V3** (50 free/day), **FLUX.1 Schnell** (free open-source), **Leonardo AI** (150 tokens/day), **Adobe Firefly** (25 free/mo), **Ideogram** (10 free/day). FLUX.1 self-hosted is unlimited and SOTA!'],
    [['music', 'song', 'audio gen', 'free music', 'make music', 'create music'],
     '**Suno** gives 50 credits/day (~10 songs) and **Udio** gives 1,200 credits/month (~300 songs). Both generate full songs with vocals from text. **Soundraw** is great for royalty-free background music. Udio is the most generous free tier!'],
    [['gemini', 'google ai'],
     '**Gemini** by Google DeepMind is free (1.5 Flash) and integrates with Google Workspace. Gemini Advanced ($20/mo) unlocks the Ultra model, 1TB Google One storage, and Gemini inside Gmail, Docs, and Slides. **Gemini 1.5 Pro** has a 2M token context via API!'],
    [['voice', 'text to speech', 'tts', 'voice clone', 'clone voice'],
     'Best voice AI: **ElevenLabs** (10K free chars/mo, best quality), **Speechify** (free Chrome extension), **Murf AI** (10 min free/mo), **OpenAI Whisper** (free open-source STT). ElevenLabs is the gold standard for voice cloning!'],
    [['video', 'ai video', 'text to video', 'make video', 'create video'],
     'Top AI video: **Kling AI** (66 free credits/day, up to 2 min!), **Runway Gen-3** (125 free credits), **Pika** (150/mo free), **Luma Dream Machine** (30 free/mo), **Sora** ($20/mo for HD). For short-form clips: **Opus Clip** auto-clips long videos into TikToks!'],
    [['image', 'picture', 'art', 'generate image', 'ai art', 'create image'],
     'Best image AI: **Playground** (100 free/day!), **Recraft V3** (50 free/day, ELO #1), **Leonardo AI** (150 tokens/day), **Adobe Firefly** (25 free/mo), **Canva AI** (50 free/mo). Premium: **Midjourney** ($10/mo) is the gold standard. **FLUX.1** is free open-source!'],
    [['hello', 'hi', 'hey', 'good morning', 'good evening', 'sup'],
     "Hello! I'm your **ORGAN AI Assistant** 🤖 I know everything about 65+ AI tools — pricing, free tiers, comparisons, and recommendations.\n\nTry asking me:\n• \"Best free coding AI?\"\n• \"ChatGPT vs Claude?\"\n• \"Free image generators?\"\n• \"Which AI makes music?\"\n• \"Compare video AI tools\"\n\nWhat can I help you find?"],
    [['organ ai', 'what is organ', 'about organ', 'this site', 'this website'],
     '**ORGAN AI** is your ultimate AI tools hub — tracking **65+ major AI tools** across 8 categories (Text, Image, Code, Audio, Video, Search, Business, Multimodal) with detailed free and paid plan breakdowns. Search, filter, compare, and find the perfect AI for any task!'],
    [['coding', 'code', 'programming', 'developer', 'programmer', 'ide'],
     'Top coding AIs: **GitHub Copilot** (free 2K completions/mo), **Cursor** (AI-native IDE, $20/mo), **Windsurf** (free unlimited autocomplete), **v0 by Vercel** (AI UI gen), **Bolt.new** (full-stack in browser), **Lovable** (AI full-stack engineer), **Cody** (full codebase context). Best free: Windsurf!'],
    [['business', 'marketing', 'writing', 'content', 'copywriting', 'seo'],
     'Top business AIs: **Grammarly AI** (free grammar + AI writing), **Notion AI** ($10/mo add-on), **Jasper** ($49/mo, best for marketing + SEO), **Copy.ai** (free 2K words/mo), **Writesonic** (free 10K words/mo), **Dify** (open-source LLM workflow builder), **Coze** (free AI bot builder by ByteDance).'],
    [['search', 'ai search', 'research', 'perplexity'],
     'Top AI search: **Perplexity AI** (free unlimited, $20/mo Pro with GPT-4o), **You.com** (privacy-first, $15/mo Pro), **Exa AI** (neural search API, 1K free/mo), **Tavily** (AI agent search API, 1K free/mo). Perplexity is the best for everyday research with cited answers!'],
    [['open source', 'open-source', 'self host', 'local', 'run locally', 'offline'],
     'Best open-source/local AI: **Llama 3.3 70B** (Meta, free commercial use), **DeepSeek V3/R1** (rivals GPT-4, free), **Qwen 2.5 72B** (Alibaba, Apache 2.0), **FLUX.1 Schnell** (image gen), **Whisper** (speech-to-text), **Stable Diffusion** (image gen), **Dify** (LLM app builder), **Letta/MemGPT** (agents with memory). Run via Ollama or LM Studio!'],
    [['chatgpt', 'gpt', 'openai'],
     '**ChatGPT** by OpenAI: Free tier gives GPT-4o (limited daily) + GPT-3.5 unlimited. **ChatGPT Plus** ($20/mo) adds unlimited GPT-4o, o1/o3 models, DALL·E 3 image gen, Custom GPTs, and Advanced Data Analysis. Best all-around AI assistant!'],
    [['claude', 'anthropic'],
     '**Claude** by Anthropic: Free tier gives Claude 3.5 Haiku with limited messages. **Claude Pro** ($20/mo) adds 5× more usage, Claude 3.5 Sonnet & Opus, priority access, and extended thinking mode. Best for long documents (200K context) and nuanced writing!'],
    [['midjourney', 'mj'],
     '**Midjourney** — the gold standard for AI art. No free tier (trial was discontinued). **Basic Plan** ($10/mo) gives 200 images/month. Creates stunning photorealistic and artistic images via Discord or web. Best image quality, but no free option.'],
    [['grok', 'xai', 'x ai'],
     '**Grok** by xAI: Free Grok 2 with real-time X/Twitter data. **X Premium+** ($16/mo) unlocks Grok 3, unlimited queries, Think mode (deep reasoning), SuperGrok image gen, and DeepSearch research mode. Best for real-time news and unfiltered answers!'],
    [['deepseek', 'deep seek'],
     '**DeepSeek** — Chinese open-source AI rivaling GPT-4 at a fraction of the cost. Free chat at deepseek.com, R1 reasoning model included. API at just $0.27/1M tokens (cache-hit: $0.07/1M). Fully open-source models downloadable!'],
    [['free', 'no cost', 'free tier', 'free plan'],
     'Best completely free AI tools: **Pi** (unlimited chat), **DeepSeek** (free chat + R1), **HuggingChat** (open models), **Playground** (100 images/day), **Recraft V3** (50 images/day), **Suno** (10 songs/day), **Kling AI** (66 video credits/day), **Whisper** (unlimited local STT), **Coze** (free bot builder with GPT-4o)!'],
    [['compare', 'vs', 'versus', 'which is better', 'what should i use', 'recommend'],
     "I can compare any AI tools for you! Here are popular comparisons:\n• **ChatGPT vs Claude** — GPT-4o vs 200K context\n• **Midjourney vs FLUX.1** — paid quality vs free open-source\n• **Suno vs Udio** — AI music generators\n• **Cursor vs Windsurf** — AI coding IDEs\n• **Runway vs Kling** — AI video generators\n\nAsk me any specific comparison and I'll break it down!"],
    [['price', 'pricing', 'cost', 'how much', 'expensive', 'cheap', 'affordable'],
     "Most AI tools have free tiers! Budget picks:\n• **Free**: DeepSeek, Pi, HuggingChat, Playground, Coze\n• **Under $10/mo**: Suno ($8), Pika ($8), Kling ($8), ElevenLabs ($5), Cody ($9)\n• **$10-20/mo**: ChatGPT Plus ($20), Claude Pro ($20), Copilot ($10), Cursor ($20)\n• **Premium**: Jasper ($49), Synthesia ($18), M365 Copilot ($22)\n\nClick any tool card to see full pricing details!"],
    [['thank', 'thanks', 'thx', 'appreciate'],
     "You're welcome! 😊 I'm always here to help you find the perfect AI tool. Feel free to ask me anything else — comparisons, pricing, recommendations — I know 65+ AI tools inside and out! 🚀"],
    [['who are you', 'what are you', 'your name'],
     "I'm the **ORGAN AI Assistant** 🤖 — your personal guide to the universe of AI tools! I know detailed pricing, features, and comparisons for 65+ major AI tools across 8 categories. Ask me anything!"],
  ];

  for (const [keys, ans] of curated) {
    if (keys.some(k => ql.includes(k))) return ans;
  }

  // ── 1.5 Profession & Workflow intelligence ──
  if (typeof PROFESSIONS !== "undefined") {
    for (const prof of PROFESSIONS) {
      const profKeys = [prof.id, prof.name.toLowerCase(), prof.id.replace('-', ' ')];
      if (profKeys.some(k => ql.includes(k))) {
        const recTools = prof.recommendedTools.map(tid => AI_TOOLS.find(t => t.id === tid)).filter(Boolean);
        let resp = `🎯 **Best AI Tools for ${prof.name}**:\n\n`;
        recTools.slice(0, 4).forEach(t => {
          resp += `• ${t.emoji} **${t.name}** — ${t.bestFor || t.description.split('—')[0].trim()} (${t.free.price})\n`;
        });
        resp += `\n💡 **Key Workflows**: ${prof.popularTasks.slice(0, 2).join(' · ')}\n`;
        resp += `\nExplore the **${prof.name} Hub** in the Professions section above for ready-to-use prompts and full tool stacks! 🚀`;
        return resp;
      }
    }
  }

  if (typeof WORKFLOWS !== "undefined" && (ql.includes("workflow") || ql.includes("pipeline") || ql.includes("youtube creation") || ql.includes("pitch deck"))) {
    let resp = `🔗 **Top Multi-Tool AI Workflows**:\n\n`;
    WORKFLOWS.slice(0, 3).forEach(wf => {
      resp += `• **${wf.title}**: ${wf.steps.map(s => s.toolName.split('/')[0].trim()).join(' ➔ ')} (${wf.timeSaved})\n`;
    });
    resp += `\nExplore the **AI Workflows** section above for full step-by-step pipeline execution! 🚀`;
    return resp;
  }

  // ── 2. Dynamic tool search — find tools matching the query ──
  const matchedTools = AI_TOOLS.filter(t => {
    const searchable = [
      t.name, t.company, t.description, t.category,
      ...(t.tags || []),
      t.free?.detail || '', t.paid?.detail || ''
    ].join(' ').toLowerCase();
    // Split user query into words and check if any match
    const words = ql.split(/\s+/).filter(w => w.length > 2);
    return words.some(w => searchable.includes(w));
  });

  if (matchedTools.length > 0) {
    // Build a rich response from matched tools
    const top = matchedTools.slice(0, 5); // show max 5 results
    let response = '';

    if (matchedTools.length === 1) {
      const t = matchedTools[0];
      response = `**${t.name}** by ${t.company} ${t.emoji}\n\n`;
      response += `${t.description}\n\n`;
      response += `🆓 **Free**: ${t.free.price} — ${t.free.detail}\n`;
      response += t.free.features.slice(0, 3).map(f => `  • ${f}`).join('\n') + '\n\n';
      response += `💎 **Paid**: ${t.paid.price} — ${t.paid.detail}\n`;
      response += t.paid.features.slice(0, 3).map(f => `  • ${f}`).join('\n') + '\n\n';
      response += `🔗 [Visit ${t.name}](${t.url})`;
    } else {
      response = `Found **${matchedTools.length} tools** matching your query:\n\n`;
      top.forEach(t => {
        response += `${t.emoji} **${t.name}** (${t.company}) — ${t.free.price}`;
        if (t.paid.price && !t.paid.price.includes('Free')) {
          response += ` · Paid: ${t.paid.price}`;
        }
        response += `\n  ${t.description.split('—')[0].trim()}\n\n`;
      });
      if (matchedTools.length > 5) {
        response += `…and ${matchedTools.length - 5} more! Use the search bar above to explore all results.`;
      }
    }
    return response;
  }

  // ── 3. Category-based answers ──
  const categoryMap = {
    text: { label: '✍ Text & Chat', tools: [] },
    image: { label: '🎨 Image Generation', tools: [] },
    code: { label: '💻 Coding', tools: [] },
    audio: { label: '🎵 Audio & Voice', tools: [] },
    video: { label: '🎬 Video', tools: [] },
    search: { label: '🔎 AI Search', tools: [] },
    business: { label: '💼 Business', tools: [] },
    multimodal: { label: '🌐 Multimodal', tools: [] }
  };
  AI_TOOLS.forEach(t => {
    if (categoryMap[t.category]) categoryMap[t.category].tools.push(t);
  });

  for (const [cat, info] of Object.entries(categoryMap)) {
    if (ql.includes(cat)) {
      let resp = `**${info.label}** — ${info.tools.length} tools available:\n\n`;
      info.tools.slice(0, 6).forEach(t => {
        resp += `${t.emoji} **${t.name}** — ${t.free.price}`;
        if (t.paid.price && !t.paid.price.includes('Free')) resp += ` · ${t.paid.price}`;
        resp += '\n';
      });
      if (info.tools.length > 6) resp += `\n…and ${info.tools.length - 6} more in this category!`;
      return resp;
    }
  }

  // ── 4. General fallback ──
  return "Great question! I'm the **ORGAN AI Assistant** and I know 65+ AI tools inside and out 🧠\n\nTry asking me:\n• \"Tell me about ChatGPT\"\n• \"Best free coding AI?\"\n• \"ChatGPT vs Claude\"\n• \"Free image generators\"\n• \"Which AI makes music?\"\n• \"Compare video AI tools\"\n• \"Best open-source AI\"\n• \"Cheapest AI tools\"\n\nOr just type any AI tool name and I'll give you the full breakdown! 🚀";
}

/* ── Render markdown-lite (bold + line breaks) ── */
function renderMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

/* ── Append a message bubble ── */
function appendMessage(text, role, isTyping = false) {
  const msgs = document.getElementById('chat-messages');
  const div  = document.createElement('div');
  div.className = 'msg msg-' + role + (isTyping ? ' msg-typing' : '');

  if (role === 'ai') {
    const bubble = isTyping
      ? '<span class="dot-typing"></span><span class="dot-typing"></span><span class="dot-typing"></span>'
      : '<p>' + renderMarkdown(text) + '</p>';
    div.innerHTML = '<div class="msg-avatar">⬡</div><div class="msg-bubble">' + bubble + '</div>';
  } else {
    div.innerHTML = '<div class="msg-bubble">' + escHtml(text) + '</div>';
  }
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ── Word-by-word typing animation ── */
async function typeMessage(container, text) {
  const bubble = container.querySelector('.msg-bubble');
  const words  = text.split(' ');
  let   built  = '';
  bubble.innerHTML = '<p></p>';
  const p = bubble.querySelector('p');
  for (const word of words) {
    built += (built ? ' ' : '') + word;
    p.innerHTML = renderMarkdown(built);
    container.closest('.chat-messages').scrollTop = 99999;
    await new Promise(r => setTimeout(r, 18));
  }
}

/* ── Send message ── */
async function sendMessage(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('chat-input');
  const btn   = document.getElementById('chat-send-btn');
  const text  = input.value.trim();
  if (!text) return;

  appendMessage(text, 'user');
  input.value  = '';
  btn.disabled = true;
  document.getElementById('send-icon').textContent = '⟳';

  const typingEl = appendMessage('', 'ai', true);
  let   reply;
  try {
    reply = await callAI(text);
  } catch (_) {
    reply = getSmartAnswer(text);
  }

  typingEl.querySelector('.msg-bubble').innerHTML = '<p></p>';
  typingEl.classList.remove('msg-typing');
  await typeMessage(typingEl, reply);

  btn.disabled = false;
  document.getElementById('send-icon').textContent = '➤';
  input.focus();
}

function sendSuggestion(chipBtn) {
  const txt = chipBtn.textContent.trim();
  document.getElementById('chat-input').value = txt;
  chipBtn.closest('.chat-suggestions').style.display = 'none';
  sendMessage(null);
}

document.getElementById('chat-form').addEventListener('submit', sendMessage);

/* ─────────────────────────────────────────────────────
   3.  AUTH  — Local auth (email/password + social quick-login)
   ───────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────
   3.  AUTH  — Local auth (email/password + social quick-login)
   ───────────────────────────────────────────────────── */

/* ── helpers ── */
var currentUser = null;

function _hash(str) {
  var h = 5381;
  for (var i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return (h >>> 0).toString(36);
}
function _getUsers() {
  try { return JSON.parse(localStorage.getItem("organ_users")) || {}; } catch(_) { return {}; }
}
function _saveUsers(u) {
  try { localStorage.setItem("organ_users", JSON.stringify(u)); } catch(_){}
}

/* ── Social Quick-Login Modal (works without Firebase) ── */
(function buildSocialModal() {
  // Inject the quick-login modal into the DOM once
  var html = [
    '<div class="modal-overlay hidden" id="social-modal" role="dialog" aria-modal="true"',
    '  aria-labelledby="social-modal-title" onclick="closeModalIfBg(event,\'social-modal\')">',
    '  <div class="modal auth-modal" style="max-width:400px">',
    '    <button class="modal-close" onclick="closeModal(\'social-modal\')" aria-label="Close">✕</button>',
    '    <div id="social-modal-logo" class="auth-logo" style="font-size:2rem;margin-bottom:.5rem"></div>',
    '    <h2 class="modal-title" id="social-modal-title"></h2>',
    '    <p class="modal-sub" id="social-modal-sub"></p>',
    '    <form class="auth-form" id="social-modal-form" onsubmit="_submitSocialLogin(event)">',
    '      <div class="form-row">',
    '        <div class="form-group">',
    '          <label for="soc-fname">First Name</label>',
    '          <input type="text" id="soc-fname" placeholder="John" required autocomplete="given-name" />',
    '        </div>',
    '        <div class="form-group">',
    '          <label for="soc-lname">Last Name</label>',
    '          <input type="text" id="soc-lname" placeholder="Doe" required autocomplete="family-name" />',
    '        </div>',
    '      </div>',
    '      <div class="form-group">',
    '        <label for="soc-email" id="soc-email-label">Email</label>',
    '        <input type="email" id="soc-email" placeholder="you@gmail.com" required autocomplete="email" />',
    '      </div>',
    '      <button type="submit" class="btn-neon btn-full" id="social-submit-btn"></button>',
    '    </form>',
    '    <p class="auth-switch" style="margin-top:1rem;font-size:.8rem;opacity:.5">',
    '      Your info is stored locally on this device only.',
    '    </p>',
    '  </div>',
    '</div>'
  ].join('');
  var wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper.firstChild);
})();

var _socialProvider = 'google';

function signInWithGoogle() { _openSocialModal('google'); }
function signInWithGitHub()  { _openSocialModal('github'); }

function _openSocialModal(provider) {
  _socialProvider = provider;
  var isGoogle = provider === 'google';
  document.getElementById('social-modal-logo').textContent   = isGoogle ? '🔵' : '⚫';
  document.getElementById('social-modal-title').textContent  = isGoogle ? 'Continue with Google' : 'Continue with GitHub';
  document.getElementById('social-modal-sub').textContent    = isGoogle
    ? 'Enter your Google account details to sign in'
    : 'Enter your GitHub account details to sign in';
  document.getElementById('soc-email-label').textContent = isGoogle ? 'Gmail Address' : 'GitHub Email';
  document.getElementById('soc-email').placeholder       = isGoogle ? 'you@gmail.com' : 'you@github.com';
  document.getElementById('social-submit-btn').textContent   = isGoogle
    ? '▶  Sign in with Google'
    : '▶  Sign in with GitHub';
  // Reset form
  document.getElementById('social-modal-form').reset();
  // Close parent modals, open this one
  ['signin-modal','signup-modal'].forEach(function(id){
    var el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  document.body.style.overflow = 'hidden';
  var modal = document.getElementById('social-modal');
  modal.classList.remove('hidden');
  setTimeout(function(){
    var f = modal.querySelector('input');
    if (f) f.focus();
  }, 60);
}

function _submitSocialLogin(e) {
  e.preventDefault();
  var fname  = (document.getElementById('soc-fname').value  || '').trim();
  var lname  = (document.getElementById('soc-lname').value  || '').trim();
  var email  = (document.getElementById('soc-email').value  || '').trim().toLowerCase();
  if (!fname || !lname || !email) return;

  var name  = fname + ' ' + lname;
  var users = _getUsers();
  var isNewUser = !users[email];
  if (isNewUser) {
    users[email] = { name: name, hash: '', provider: _socialProvider, created: Date.now() };
    _saveUsers(users);
  }
  loginUser({ name: name, email: email, provider: _socialProvider });
  closeModal('social-modal');
  showToast('✅', 'Welcome' + (isNewUser ? '' : ' back') + ', ' + fname + '! 🎉');
  sendWelcomeEmail({ name: name, email: email }, isNewUser ? 'signup' : 'signin');
}

/* ── sign in ── */
function handleSignIn(e) {
  e.preventDefault();
  var email = (document.getElementById("si-email").value || "").trim().toLowerCase();
  var pass  = document.getElementById("si-pass").value || "";
  if (!email || !pass) { showToast("⚠️", "Please fill in email and password."); return; }

  var users = _getUsers();
  if (!users[email]) {
    showToast("❌", "No account found. Please sign up first!");
    return;
  }
  if (users[email].hash !== _hash(pass)) {
    showToast("❌", "Wrong password. Please try again.");
    return;
  }
  loginUser({ name: users[email].name, email: email });
  closeModal("signin-modal");
  showToast("✅", "Welcome back, " + users[email].name.split(" ")[0] + "!");
  sendWelcomeEmail({ name: users[email].name, email: email }, 'signin');
}

/* ── sign up ── */
function handleSignUp(e) {
  e.preventDefault();
  var fname = (document.getElementById("su-fname").value || "").trim();
  var lname = (document.getElementById("su-lname").value || "").trim();
  var email = (document.getElementById("su-email").value || "").trim().toLowerCase();
  var pass  = document.getElementById("su-pass").value || "";

  if (!fname || !lname || !email || !pass) { showToast("⚠️", "Please fill in all fields."); return; }
  if (pass.length < 8) { showToast("❌", "Password must be at least 8 characters."); return; }

  var users = _getUsers();
  if (users[email]) { showToast("❌", "This email is already registered. Try signing in!"); return; }

  var name = fname + " " + lname;
  users[email] = { name: name, hash: _hash(pass), created: Date.now() };
  _saveUsers(users);
  loginUser({ name: name, email: email });
  closeModal("signup-modal");
  showToast("🎉", "Account created! Welcome to ORGAN AI, " + fname + "!");
  sendWelcomeEmail({ name: name, email: email }, 'signup');
}

/* ── update UI after login ── */
function loginUser(user) {
  currentUser = user;
  try { localStorage.setItem("organ_session", JSON.stringify(user)); } catch(_){}

  var photoEl = document.getElementById("user-photo");
  var initsEl = document.getElementById("user-initials");
  if (user.photo) {
    photoEl.src = user.photo; photoEl.style.display = "block"; initsEl.style.display = "none";
  } else {
    photoEl.src = ""; photoEl.style.display = "none"; initsEl.style.display = "";
    initsEl.textContent = user.name.split(" ").map(function(w){ return w[0]; }).join("").slice(0,2).toUpperCase();
  }
  document.getElementById("user-menu-name").textContent  = user.name;
  document.getElementById("user-menu-email").textContent = user.email || "";
  document.getElementById("user-avatar-btn").classList.remove("hidden");
  var navSI = document.getElementById("nav-signin-btn");
  var navSU = document.getElementById("nav-signup-btn");
  if (navSI) navSI.classList.add("hidden");
  if (navSU) navSU.classList.add("hidden");
}

/* ── sign out ── */
function signOut() {
  currentUser = null;
  try { localStorage.removeItem("organ_session"); } catch(_){}
  document.getElementById("user-avatar-btn").classList.add("hidden");
  document.getElementById("user-menu").classList.add("hidden");
  document.getElementById("nav-signin-btn") && document.getElementById("nav-signin-btn").classList.remove("hidden");
  document.getElementById("nav-signup-btn") && document.getElementById("nav-signup-btn").classList.remove("hidden");
  var photoEl = document.getElementById("user-photo");
  if (photoEl) { photoEl.src = ""; photoEl.style.display = "none"; }
  showToast("👋", "Signed out. See you soon!");
}

function toggleUserMenu(e) {
  if (e) e.stopPropagation();
  document.getElementById("user-menu").classList.toggle("hidden");
}

// Close user menu on outside click
document.addEventListener("click", function(e) {
  var avatar = document.getElementById("user-avatar-btn");
  var menu   = document.getElementById("user-menu");
  if (avatar && menu && !avatar.contains(e.target)) menu.classList.add("hidden");
});

// Restore session on page load (localStorage persists across refreshes)
try {
  var _savedSession = JSON.parse(localStorage.getItem("organ_session"));
  if (_savedSession) loginUser(_savedSession);
} catch(_) {}

/* ─────────────────────────────────────────────────────
   4.  MODAL SYSTEM
   ───────────────────────────────────────────────────── */
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  setTimeout(() => {
    const first = el.querySelector("input:not([type=checkbox]), button.modal-close");
    if (first) first.focus();
  }, 60);
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("hidden");
  // Only restore overflow if no other modal is open
  const anyOpen = ["signin-modal", "signup-modal", "tool-modal", "privacy-modal", "terms-modal", "blog-modal", "profession-modal", "social-modal"]
    .some(mid => { const m = document.getElementById(mid); return m && !m.classList.contains("hidden"); });
  if (!anyOpen) document.body.style.overflow = "";
}
function closeModalIfBg(e, id) {
  if (e.target === e.currentTarget) closeModal(id);
}
function switchModal(from, to) {
  closeModal(from);
  openModal(to);
}
document.addEventListener("keydown", function(e) {
  if (e.key !== "Escape") return;
  ["signin-modal", "signup-modal", "tool-modal", "privacy-modal", "terms-modal", "blog-modal", "profession-modal", "social-modal"].forEach(closeModal);
});

/* ─────────────────────────────────────────────────────
   5.  TOOLS DIRECTORY
   ───────────────────────────────────────────────────── */
const CAT_LABELS = {
  text: "Text & Chat", image: "Image Gen", code: "Coding",
  audio: "Audio & Voice", video: "Video", search: "AI Search",
  business: "Business", multimodal: "Multimodal"
};

let curFilter = "all", curSearch = "", curSort = "name";

function getVisible() {
  let list = AI_TOOLS.filter(t => {
    const s = curSearch.toLowerCase();
    const matchCat = curFilter === "all" 
      ? true 
      : curFilter === "saved" 
        ? isToolSaved(t.id) 
        : t.category === curFilter;
    const matchSrch = !s || t.name.toLowerCase().includes(s) || t.company.toLowerCase().includes(s)
      || t.description.toLowerCase().includes(s) || (t.tags && t.tags.some(g => g.toLowerCase().includes(s)))
      || (t.bestFor && t.bestFor.toLowerCase().includes(s));
    return matchCat && matchSrch;
  });
  list.sort((a, b) => {
    if (curSort === "name")       return a.name.localeCompare(b.name);
    if (curSort === "name-desc")  return b.name.localeCompare(a.name);
    if (curSort === "category")   return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
    if (curSort === "free-first") {
      const af = a.free.price === "No free plan" ? 1 : 0;
      const bf = b.free.price === "No free plan" ? 1 : 0;
      return af - bf || a.name.localeCompare(b.name);
    }
    return 0;
  });
  return list;
}

function buildCard(tool, idx) {
  const el = document.createElement("article");
  el.className = "tool-card";
  el.style.animationDelay = (idx * 0.035) + "s";
  el.setAttribute("tabindex", "0");
  el.setAttribute("role", "button");
  el.setAttribute("aria-label", "View details for " + tool.name);

  const hasFree = tool.free.price !== "No free plan";
  const tags = (tool.tags || []).slice(0, 3).map(t => '<span class="tag-chip">' + t + "</span>").join("");
  const isSaved = isToolSaved(tool.id);

  el.innerHTML =
    '<button class="card-bookmark-btn ' + (isSaved ? 'saved' : '') + '" data-tool-id="' + tool.id + '" aria-label="' + (isSaved ? 'Remove bookmark' : 'Bookmark tool') + '" title="' + (isSaved ? 'Saved in Bookmarks' : 'Bookmark this tool') + '">' +
      (isSaved ? '★' : '☆') +
    '</button>' +
    '<div class="card-top">' +
      '<div class="card-logo" aria-hidden="true">' + tool.emoji + "</div>" +
      '<div class="card-info">' +
        '<div class="card-name">' + tool.name + "</div>" +
        '<div class="card-category">' + (CAT_LABELS[tool.category] || tool.category) + "</div>" +
        '<div class="card-company">' + tool.company + "</div>" +
      "</div></div>" +
    (tool.bestFor ? '<div style="font-size:0.75rem;color:var(--neon-cyan);margin-bottom:0.5rem;font-weight:600;">🎯 ' + tool.bestFor + '</div>' : '') +
    '<p class="card-description">' + tool.description + "</p>" +
    '<div class="plan-row">' +
      '<div class="plan-badge ' + (hasFree ? "free-badge" : "paid-badge") + '">' +
        '<div class="plan-label">' + (hasFree ? "✅ FREE" : "⚠️ NO FREE") + "</div>" +
        '<div class="plan-price">' + tool.free.price + "</div>" +
        '<div class="plan-detail">' + tool.free.detail + "</div>" +
      "</div>" +
      '<div class="plan-badge paid-badge">' +
        '<div class="plan-label">💳 PAID</div>' +
        '<div class="plan-price">' + tool.paid.price + "</div>" +
        '<div class="plan-detail">' + tool.paid.detail + "</div>" +
      "</div></div>" +
    '<div class="card-footer">' +
      '<div class="card-tags">' + tags + "</div>" +
      '<button class="card-btn">Details →</button>' +
    "</div>";

  el.addEventListener("click", function() { openToolModal(tool.id); });
  el.addEventListener("keydown", function(e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openToolModal(tool.id); }
  });
  // Prevent bookmark button from opening modal
  const bkmkBtn = el.querySelector(".card-bookmark-btn");
  if (bkmkBtn) {
    bkmkBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      toggleSaveTool(tool.id);
    });
  }
  // Prevent details button double-fire
  el.querySelector(".card-btn").addEventListener("click", function(e) {
    e.stopPropagation();
    openToolModal(tool.id);
  });
  return el;
}

function render() {
  const grid  = document.getElementById("tools-grid");
  const noRes = document.getElementById("no-results");
  const list  = getVisible();

  grid.innerHTML = "";
  if (!list.length) {
    noRes.classList.remove("hidden");
    grid.style.display = "none";
  } else {
    noRes.classList.add("hidden");
    grid.style.display = "";
    const frag = document.createDocumentFragment();
    list.forEach((t, i) => frag.appendChild(buildCard(t, i)));
    grid.appendChild(frag);
  }

  const lbl = document.getElementById("results-label");
  lbl.textContent = list.length === AI_TOOLS.length
    ? "Showing all " + list.length + " AI tools"
    : "Showing " + list.length + " of " + AI_TOOLS.length + " AI tools";

  const sc = document.getElementById("search-count");
  sc.textContent = curSearch ? list.length + " found" : "";
}

function openToolModal(id) {
  const t = AI_TOOLS.find(x => x.id === id);
  if (!t) return;
  const hasFree = t.free.price !== "No free plan";
  const isSaved = isToolSaved(t.id);

  document.getElementById("tool-modal-logo").textContent  = t.emoji;
  document.getElementById("tool-modal-title").textContent = t.name;
  document.getElementById("tool-modal-sub").textContent   = t.company + " · " + (CAT_LABELS[t.category] || t.category);

  const freeF = t.free.features.map(f => '<li><span class="fi">✅</span>' + f + "</li>").join("");
  const paidF = t.paid.features.map(f => '<li><span class="fi">💎</span>' + f + "</li>").join("");

  // Pros & Cons
  let prosConsHtml = '';
  if (t.pros && t.cons) {
    prosConsHtml =
      '<div class="modal-section-title">⚖️ Pros &amp; Cons</div>' +
      '<div class="modal-pros-cons-grid">' +
        '<div class="pros-box"><h4>Key Strengths</h4><ul class="pros-cons-list">' +
          t.pros.map(p => '<li>+ ' + p + '</li>').join('') +
        '</ul></div>' +
        '<div class="cons-box"><h4>Limitations</h4><ul class="pros-cons-list">' +
          t.cons.map(c => '<li>− ' + c + '</li>').join('') +
        '</ul></div>' +
      '</div>';
  }

  // Similar AI Tools
  const similarTools = AI_TOOLS.filter(x => x.id !== t.id && (x.category === t.category || (x.tags && t.tags && x.tags.some(tg => t.tags.includes(tg))))).slice(0, 4);
  let similarHtml = '';
  if (similarTools.length > 0) {
    similarHtml =
      '<div class="modal-section-title">🔄 Similar AI Tools &amp; Alternatives</div>' +
      '<div class="similar-tools-row">' +
        similarTools.map(st => '<button class="similar-tool-chip" onclick="openToolModal(\'' + st.id + '\')">' + st.emoji + ' ' + st.name + '</button>').join('') +
      '</div>';
  }

  document.getElementById("tool-modal-body").innerHTML =
    (t.bestFor ? '<div style="display:inline-flex;align-items:center;gap:0.4rem;padding:4px 12px;border-radius:99px;background:rgba(0,245,212,0.1);border:1px solid rgba(0,245,212,0.3);color:var(--neon-cyan);font-size:0.75rem;font-weight:700;margin-bottom:1rem;">🎯 Best for: ' + t.bestFor + ' · Ease: ' + (t.easeOfUse || 'Beginner') + '</div>' : '') +
    '<p style="font-size:.88rem;color:var(--white-60);line-height:1.65;margin-bottom:1.5rem;">' + t.description + "</p>" +
    '<div class="modal-plan-card ' + (hasFree ? "free-card" : "paid-card") + '">' +
      '<div class="modal-plan-header">' +
        '<span class="modal-plan-title">' + (hasFree ? "✅ Free Plan" : "⚠️ No Free Plan") + " — " + t.free.detail + "</span>" +
        '<span class="modal-plan-price">' + t.free.price + "</span>" +
      "</div>" +
      '<ul class="feature-list">' + freeF + "</ul>" +
    "</div>" +
    '<div class="modal-plan-card paid-card">' +
      '<div class="modal-plan-header">' +
        '<span class="modal-plan-title">💳 Paid Plan — ' + t.paid.detail + "</span>" +
        '<span class="modal-plan-price">' + t.paid.price + "</span>" +
      "</div>" +
      '<ul class="feature-list">' + paidF + "</ul>" +
    "</div>" +
    prosConsHtml +
    similarHtml;

  document.getElementById("tool-modal-footer").innerHTML =
    '<div style="display:flex;gap:0.75rem;width:100%;align-items:center;">' +
      '<button class="btn-ghost" onclick="toggleSaveTool(\'' + t.id + '\');openToolModal(\'' + t.id + '\')" style="white-space:nowrap;padding:12px 18px;">' +
        (isSaved ? '★ Bookmarked' : '☆ Bookmark') +
      '</button>' +
      '<a href="' + t.url + '" target="_blank" rel="noopener noreferrer" class="modal-visit-btn" id="visit-' + t.id + '" style="flex:1;">' +
        "🌐 Visit " + t.name + " Official Website →" +
      "</a>" +
    '</div>';

  openModal("tool-modal");
}

/* ─────────────────────────────────────────────────────
   6.  FILTER / SEARCH / SORT BINDINGS
   ───────────────────────────────────────────────────── */
document.getElementById("search-input").addEventListener("input", function(e) {
  curSearch = e.target.value.trim(); render();
});
document.getElementById("sort-select").addEventListener("change", function(e) {
  curSort = e.target.value; render();
});
document.querySelectorAll(".filter-pill").forEach(function(pill) {
  pill.addEventListener("click", function() {
    document.querySelectorAll(".filter-pill").forEach(function(p) {
      p.classList.remove("active"); p.setAttribute("aria-selected", "false");
    });
    pill.classList.add("active"); pill.setAttribute("aria-selected", "true");
    curFilter = pill.dataset.filter; render();
  });
});

/* ─────────────────────────────────────────────────────
   7.  DOWNLOAD / TOAST
   ───────────────────────────────────────────────────── */
function showDownload(platform) {
  var msgs = {
    windows: "🪟 Windows app in development! We'll email you when it launches.",
    ios:     "🍎 iOS app coming soon! Sign up above to join the waitlist.",
    android: "🤖 Android app coming soon! Join the waitlist above."
  };
  showToast("📥", msgs[platform] || "Download coming soon!");
}

function showToast(icon, msg) {
  var t = document.getElementById("download-toast");
  document.getElementById("toast-icon").textContent = icon;
  document.getElementById("toast-msg").textContent  = msg;
  t.classList.remove("hidden");
  clearTimeout(t._tid);
  t._tid = setTimeout(function() { t.classList.add("hidden"); }, 5000);
}

/* ─────────────────────────────────────────────────────
   8.  MOBILE NAV
   ───────────────────────────────────────────────────── */
function toggleMobileNav(e) {
  if (e) e.stopPropagation();
  var nav = document.getElementById("mobile-nav");
  nav.classList.toggle("hidden");
}

// Close mobile nav on outside click
document.addEventListener("click", function(e) {
  var nav = document.getElementById("mobile-nav");
  var btn = document.getElementById("hamburger-btn");
  if (nav && !nav.contains(e.target) && btn && !btn.contains(e.target)) {
    nav.classList.add("hidden");
  }
});

// Sticky nav shadow on scroll
window.addEventListener("scroll", function() {
  var nav = document.getElementById("main-nav");
  if (nav) nav.style.boxShadow = window.scrollY > 10 ? "0 4px 40px rgba(0,0,0,0.7)" : "";
}, { passive: true });

/* ─────────────────────────────────────────────────────
   9.  STAT COUNTERS
   ───────────────────────────────────────────────────── */
function animateCounters() {
  document.querySelectorAll(".stat-num").forEach(function(el) {
    var target = +el.dataset.target;
    var cur = 0, step = target / 60;
    var tid = setInterval(function() {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur);
      if (cur >= target) clearInterval(tid);
    }, 20);
  });
}
var statsEl = document.querySelector(".hero-stats");
if (statsEl && "IntersectionObserver" in window) {
  var obs = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) { animateCounters(); obs.disconnect(); }
  }, { threshold: 0.4 });
  obs.observe(statsEl);
} else if (statsEl) {
  animateCounters();
}

/* ─────────────────────────────────────────────────────
   10. ORGAN AI DISCOVERY HUB ENGINES
   ───────────────────────────────────────────────────── */

/* ── 10.1 BOOKMARK / SAVED TOOLS SYSTEM ── */
const STORAGE_KEY_SAVED = "organ_saved_tools";

function getSavedTools() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function isToolSaved(toolId) {
  return getSavedTools().includes(toolId);
}

function toggleSaveTool(toolId) {
  const saved = getSavedTools();
  const idx = saved.indexOf(toolId);
  const tool = AI_TOOLS.find(t => t.id === toolId);
  const toolName = tool ? tool.name : "Tool";

  if (idx >= 0) {
    saved.splice(idx, 1);
    showToast("☆", `${toolName} removed from Bookmarks`);
  } else {
    saved.push(toolId);
    showToast("★", `${toolName} saved to Bookmarks!`);
  }

  try {
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(saved));
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }

  updateSavedCountBadge();
  // Refresh visible cards without disrupting scroll
  document.querySelectorAll(`.card-bookmark-btn[data-tool-id="${toolId}"]`).forEach(btn => {
    const nowSaved = isToolSaved(toolId);
    btn.classList.toggle("saved", nowSaved);
    btn.textContent = nowSaved ? "★" : "☆";
    btn.setAttribute("title", nowSaved ? "Saved in Bookmarks" : "Bookmark this tool");
  });

  if (curFilter === "saved") {
    render();
  }
}

function updateSavedCountBadge() {
  const count = getSavedTools().length;
  const badge = document.getElementById("saved-count");
  if (badge) badge.textContent = count;
}

function initBookmarks() {
  updateSavedCountBadge();
}

/* ── 10.2 TOOL ENRICHMENTS & METADATA ── */
const TOOL_ENRICHMENTS = {
  "chatgpt": {
    bestFor: "General reasoning, multi-disciplinary writing, and custom GPT workflows",
    professions: ["students", "teachers", "writers", "developers", "business", "marketers", "sales", "freelancers", "hr", "admin"],
    tasks: ["Drafting essays & reports", "Debugging & writing code", "Brainstorming business ideas", "Drafting cold emails"],
    pros: ["Versatile multi-modal reasoning (GPT-4o)", "Extensive custom GPT ecosystem", "Fast voice mode and web browsing"],
    cons: ["Can hallucinate on niche technical facts", "Free tier rate-limited during peak hours"],
    easeOfUse: "Beginner",
    pricingCategory: "Freemium",
    isFeatured: true,
    dateAdded: "2026-01-10"
  },
  "claude": {
    bestFor: "Nuanced long-form writing, document analysis, and coding architecture",
    professions: ["writers", "researchers", "lawyers", "developers", "business", "students", "teachers", "healthcare", "project-managers"],
    tasks: ["Reviewing 200-page contracts & papers", "Writing nuanced articles & prose", "Refactoring complex codebases", "Synthesizing research"],
    pros: ["Massive 200K token context window", "Artifacts feature for interactive previews", "Superior nuanced and natural prose"],
    cons: ["No real-time web browsing in base chat", "Message limits on peak hours for free users"],
    easeOfUse: "Beginner",
    pricingCategory: "Freemium",
    isFeatured: true,
    dateAdded: "2026-01-12"
  },
  "cursor": {
    bestFor: "Agentic software engineering, multi-file code editing, and repository understanding",
    professions: ["developers", "engineers", "freelancers"],
    tasks: ["Full codebase semantic indexing", "Multi-file automated refactoring", "Writing unit tests & documentation", "Terminal command generation"],
    pros: ["Native VS Code fork with seamless extension support", "Composer multi-file autonomous agent", "Context-aware inline tab completions"],
    cons: ["Requires high compute / monthly subscription for heavy pro models", "Occasional sync lag on massive monorepos"],
    easeOfUse: "Intermediate",
    pricingCategory: "Freemium",
    isFeatured: true,
    dateAdded: "2026-02-01"
  },
  "github-copilot": {
    bestFor: "Inline code completions, pull request summaries, and team developer productivity",
    professions: ["developers", "engineers", "students"],
    tasks: ["Autocomplete function definitions", "Generate test suites", "Review pull requests", "Command-line CLI explanations"],
    pros: ["Deep GitHub and IDE integration", "Fast autocomplete latency", "Enterprise-grade compliance and IP indemnity"],
    cons: ["Less autonomous than full agentic IDEs", "No permanent free plan for individuals"],
    easeOfUse: "Beginner",
    pricingCategory: "Paid",
    isFeatured: true,
    dateAdded: "2026-01-05"
  },
  "midjourney": {
    bestFor: "Photorealistic concept art, cinematic imagery, and high-end marketing visuals",
    professions: ["designers", "creators", "marketers", "architects", "writers"],
    tasks: ["Generating photorealistic stock photos", "Creating cinematic storyboards", "Designing 3D architectural concepts", "Crafting YouTube thumbnails"],
    pros: ["Industry-leading aesthetic lighting and photorealism", "Powerful style references and character consistency", "Active community showcasing styles"],
    cons: ["Discord-based interface (web app has subscription tier gating)", "No permanent free trial"],
    easeOfUse: "Intermediate",
    pricingCategory: "Paid",
    isFeatured: true,
    dateAdded: "2026-01-15"
  },
  "flux": {
    bestFor: "State-of-the-art open-source image generation and typography accuracy",
    professions: ["designers", "creators", "marketers", "developers"],
    tasks: ["Accurate in-image text rendering", "Open-weight local image synthesis", "High-detail commercial graphic generation", "Creative branding mockups"],
    pros: ["Exceptional prompt adherence and spelled text rendering", "Open weights available for local execution", "Very natural human anatomy and hands"],
    cons: ["Requires powerful local GPU (16GB+ VRAM) or cloud API fees", "Higher inference latency than Turbo models"],
    easeOfUse: "Intermediate",
    pricingCategory: "Freemium",
    isFeatured: true,
    dateAdded: "2026-02-10"
  },
  "elevenlabs": {
    bestFor: "Hyper-realistic voice cloning, emotionally expressive voiceovers, and audio localization",
    professions: ["creators", "marketers", "teachers", "customer-support", "writers"],
    tasks: ["Narrating YouTube video scripts", "Cloning brand voices for commercials", "Creating foreign language dubbing", "Interactive voice response (IVR) bots"],
    pros: ["Unmatched emotional pacing and vocal realism", "Instant voice cloning from 1 minute of audio", "29+ fluent languages with accent preservation"],
    cons: ["Character counts can get expensive for full audiobooks", "Audio latency for real-time live phone calls"],
    easeOfUse: "Beginner",
    pricingCategory: "Freemium",
    isFeatured: true,
    dateAdded: "2026-01-20"
  },
  "runway": {
    bestFor: "Cinematic AI video generation, camera motion control, and professional VFX editing",
    professions: ["creators", "marketers", "designers", "architects"],
    tasks: ["Generating 10-second cinematic b-roll", "Animating still concept art photos", "Custom camera motion pans and zooms", "Motion brush video modifications"],
    pros: ["Gen-3 Alpha photorealistic video synthesis", "Precise camera trajectory controls", "Full creative video editing suite"],
    cons: ["High compute credit consumption per generation", "Occasional temporal warping on rapid physics"],
    easeOfUse: "Intermediate",
    pricingCategory: "Freemium",
    isFeatured: true,
    dateAdded: "2026-02-15"
  },
  "kling": {
    bestFor: "High-frame-rate realistic human motion and extended AI video generation",
    professions: ["creators", "marketers", "designers"],
    tasks: ["High-framerate action video synthesis", "Realistic human movement & dance", "1080p full HD video clips", "Text-to-video conceptualization"],
    pros: ["Generates up to 2-minute video clips", "Accurate real-world physics simulation", "Generous daily free credits"],
    cons: ["Queue times can be slow on free tier", "Occasional server capacity alerts"],
    easeOfUse: "Beginner",
    pricingCategory: "Freemium",
    isFeatured: true,
    dateAdded: "2026-03-01"
  },
  "perplexity": {
    bestFor: "Real-time research with inline citations, academic deep search, and source verification",
    professions: ["researchers", "students", "lawyers", "journalists", "writers", "healthcare", "business"],
    tasks: ["Finding peer-reviewed study citations", "Competitive market intelligence", "Summarizing breaking news stories", "Fact-checking complex claims"],
    pros: ["Direct clickable source URLs for every claim", "Pro search mode executes multi-step queries", "Selectable models (Claude 3.5, Sonar, GPT-4o)"],
    cons: ["Occasionally summarizes outdated sources if SEO spam is high", "Limited Pro queries per day on free plan"],
    easeOfUse: "Beginner",
    pricingCategory: "Freemium",
    isFeatured: true,
    dateAdded: "2026-01-08"
  },
  "notion-ai": {
    bestFor: "Connected workspace knowledge, meeting action items, and project documentation",
    professions: ["project-managers", "business", "marketers", "hr", "admin", "freelancers", "writers"],
    tasks: ["Extracting action items from meeting notes", "Writing project requirement documents (PRD)", "Searching entire company knowledge base", "Drafting sprint updates"],
    pros: ["Deeply embedded where teams already write documents", "Q&A over entire connected company workspace", "Clean markdown table and summary generation"],
    cons: ["Requires existing Notion workspace adoption", "Separate add-on subscription fee ($10/user/mo)"],
    easeOfUse: "Beginner",
    pricingCategory: "Freemium",
    isFeatured: true,
    dateAdded: "2026-01-18"
  },
  "v0": {
    bestFor: "Instant generative UI creation, React component design, and Tailwind CSS code",
    professions: ["developers", "designers", "freelancers", "business"],
    tasks: ["Generating modern dashboard layouts", "Building responsive navigation & hero sections", "Exporting clean React + Lucide code", "Iterative UI styling with visual preview"],
    pros: ["Generates clean, production-ready React / shadcn code", "Interactive live preview in browser", "1-click copy or npm CLI install"],
    cons: ["Limited to frontend React/Tailwind ecosystem", "Complex interactive state machines need manual tweaking"],
    easeOfUse: "Beginner",
    pricingCategory: "Freemium",
    isFeatured: true,
    dateAdded: "2026-02-20"
  },
  "suno": {
    bestFor: "Complete song generation with vocals, instruments, lyrics, and genre mastering",
    professions: ["creators", "marketers", "freelancers"],
    tasks: ["Generating royalty-free background songs", "Creating custom jingles and podcast intros", "Experimenting with song lyrics & melodies", "Producing multi-genre instrumental tracks"],
    pros: ["Full 2-4 minute song generation with cohesive verses & choruses", "Natural human vocal timbre across dozens of genres", "Generous daily free tier (50 credits = 10 songs)"],
    cons: ["Vocal stems separation requires pro plan", "Commercial rights restricted on free plan"],
    easeOfUse: "Beginner",
    pricingCategory: "Freemium",
    isFeatured: true,
    dateAdded: "2026-01-25"
  },
  "descript": {
    bestFor: "Text-based video and podcast editing, filler word removal, and dynamic captions",
    professions: ["creators", "teachers", "marketers", "customer-support"],
    tasks: ["Edit video by editing transcript text", "1-click removal of 'um' and 'uh' filler words", "Generate kinetic animated captions", "Studio Sound background noise removal"],
    pros: ["Revolutionary transcript-driven timeline editing", "Studio Sound transforms smartphone audio to podcast quality", "Automatic multi-speaker detection and subtitles"],
    cons: ["Desktop app can be resource-intensive on long 4K videos", "Export limits on free tier"],
    easeOfUse: "Beginner",
    pricingCategory: "Freemium",
    isFeatured: true,
    dateAdded: "2026-02-05"
  },
  "grammarly": {
    bestFor: "Professional grammar refinement, tone adjustment, and business communication polish",
    professions: ["writers", "students", "teachers", "marketers", "sales", "hr", "admin", "lawyers"],
    tasks: ["Fixing grammatical syntax and conciseness", "Adjusting email tone (formal, friendly, urgent)", "Rewriting sentences for clarity", "Detecting plagiarism"],
    pros: ["Works everywhere via Chrome extension & desktop", "Real-time inline feedback while typing", "Reliable tone detection"],
    cons: ["Premium tier required for advanced structural rewrites", "Can occasionally over-sanitize creative writing voice"],
    easeOfUse: "Beginner",
    pricingCategory: "Freemium",
    isFeatured: true,
    dateAdded: "2026-01-02"
  },
  "deepseek": {
    bestFor: "Open-weights reasoning, cost-effective API code generation, and complex math proofs",
    professions: ["developers", "engineers", "researchers", "students"],
    tasks: ["R1 chain-of-thought deep reasoning", "High-complexity algorithmic coding", "Low-cost high-volume batch processing", "Local model self-hosting"],
    pros: ["State-of-the-art reasoning at a fraction of closed-API costs", "Open-source model weights freely downloadable", "Strong mathematical and competitive coding capabilities"],
    cons: ["Web interface subject to peak traffic load", "Smaller context window compared to Claude's 200K"],
    easeOfUse: "Intermediate",
    pricingCategory: "Free",
    isFeatured: true,
    dateAdded: "2026-02-12"
  }
};

function initToolEnrichments() {
  AI_TOOLS.forEach(t => {
    const e = TOOL_ENRICHMENTS[t.id];
    if (e) {
      Object.assign(t, e);
    } else {
      // Intelligent defaults based on category
      const catProfMap = {
        code: ["developers", "engineers", "freelancers"],
        image: ["designers", "creators", "marketers"],
        audio: ["creators", "teachers", "marketers"],
        video: ["creators", "marketers", "teachers"],
        text: ["writers", "students", "business", "admin"],
        search: ["researchers", "students", "lawyers"],
        business: ["business", "marketers", "sales", "project-managers", "hr"],
        multimodal: ["developers", "researchers", "creators", "students"]
      };
      t.bestFor = t.bestFor || `${t.company} ${t.category} intelligence platform`;
      t.professions = t.professions || (catProfMap[t.category] || ["freelancers", "students"]);
      t.tasks = t.tasks || [`General ${t.category} processing`, "Workflow automation"];
      t.pros = t.pros || ["High reliability", "Modern intuitive interface", "Regular model updates"];
      t.cons = t.cons || ["Usage limits on free tier", "Requires network connection"];
      t.easeOfUse = t.easeOfUse || "Beginner";
      t.pricingCategory = t.free.price === "No free plan" ? "Paid" : "Freemium";
      t.isFeatured = t.isFeatured || false;
      t.dateAdded = t.dateAdded || "2026-01-01";
    }
  });
}

/* ── 10.3 TOOL OF THE DAY (SPOTLIGHT) ── */
function renderToolOfDay() {
  const container = document.getElementById("tool-of-the-day-container");
  if (!container) return;

  const featured = AI_TOOLS.filter(t => t.isFeatured);
  if (!featured.length) return;

  // Deterministic tool based on day of year
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const tool = featured[dayOfYear % featured.length];

  const hasFree = tool.free.price !== "No free plan";
  const tagsHtml = (tool.tags || []).slice(0, 4).map(tg => `<span class="tag-chip">${tg}</span>`).join("");

  container.innerHTML = `
    <div class="tool-of-day-card">
      <div class="tod-logo" aria-hidden="true">${tool.emoji}</div>
      <div class="tod-info">
        <div class="tod-badge">⭐ AI TOOL OF THE DAY</div>
        <h3>${tool.name} <span class="tod-company">by ${tool.company}</span></h3>
        <p class="tod-desc">${tool.description}</p>
        <div style="font-size:0.82rem;color:var(--neon-cyan);margin-bottom:0.75rem;font-weight:600;">
          🎯 ${tool.bestFor || 'Top-rated tool'}
        </div>
        <div class="tod-tags">${tagsHtml}</div>
      </div>
      <div class="tod-cta">
        <div class="tod-price-pill">${hasFree ? '✅ ' + tool.free.price : '💳 ' + tool.paid.price}</div>
        <button class="btn-neon" onclick="openToolModal('${tool.id}')" style="white-space:nowrap;padding:10px 22px;">
          View Deep Dive →
        </button>
        <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="btn-ghost" style="font-size:0.78rem;padding:6px 14px;white-space:nowrap;">
          Launch Tool ↗
        </a>
      </div>
    </div>
  `;
}

/* ── 10.4 AI FOR 20 PROFESSIONS ── */
const PROFESSIONS = [
  {
    id: "students",
    name: "Students & Academics",
    icon: "🎓",
    category: "Education",
    tagline: "Ace coursework, synthesize lecture notes, and draft thesis papers with verified citations.",
    description: "Built for university students, high school learners, and academic researchers looking to study smarter with ethical AI assistance.",
    recommendedTools: ["chatgpt", "claude", "perplexity", "notion-ai", "grammarly", "speechify"],
    popularTasks: [
      "Synthesize lecture transcripts into flashcards",
      "Literature review with verified academic citations",
      "Proofread thesis papers for tone and clarity",
      "Explain complex STEM concepts step-by-step"
    ],
    workflows: ["academic-research"]
  },
  {
    id: "developers",
    name: "Software Engineers",
    icon: "💻",
    category: "Engineering",
    tagline: "Build apps 10x faster with agentic IDEs, automated unit testing, and instant generative UI.",
    description: "Tailored for full-stack developers, backend architects, and DevOps engineers orchestrating code with modern AI workflows.",
    recommendedTools: ["cursor", "github-copilot", "v0", "bolt", "phind", "deepseek"],
    popularTasks: [
      "Build full-stack web app from prompt to deployment",
      "Semantic codebase refactoring across multiple files",
      "Automated unit and integration test generation",
      "Debug cryptic production stack traces"
    ],
    workflows: ["web-app-mvp"]
  },
  {
    id: "designers",
    name: "UI/UX & Graphic Designers",
    icon: "🎨",
    category: "Creative",
    tagline: "Generate brand assets, interactive UI mockups, and high-resolution creative concepts.",
    description: "For product designers, graphic artists, and brand architects seeking photorealistic textures, layout ideas, and vector assets.",
    recommendedTools: ["midjourney", "flux", "canva-ai", "recraft", "adobe-firefly", "leonardo"],
    popularTasks: [
      "Generate vector logos and brand assets",
      "Create photorealistic 3D product mockups",
      "Rapid UI component wireframing",
      "Moodboard concept art generation"
    ],
    workflows: ["youtube-creation", "web-app-mvp"]
  },
  {
    id: "engineers",
    name: "Data & Systems Engineers",
    icon: "⚙️",
    category: "Engineering",
    tagline: "Optimize SQL queries, automate ETL pipelines, and fine-tune open-weights models.",
    description: "Engineered for cloud architects, data scientists, and systems builders operating high-scale data workflows.",
    recommendedTools: ["deepseek", "qwen", "amazon-q", "phind", "cursor", "letta"],
    popularTasks: [
      "Optimize slow SQL queries and explain plans",
      "Generate synthetic training datasets",
      "Build persistent-memory autonomous agent pipelines",
      "Troubleshoot Docker and Kubernetes deployment yamls"
    ],
    workflows: ["web-app-mvp"]
  },
  {
    id: "teachers",
    name: "Teachers & Educators",
    icon: "📚",
    category: "Education",
    tagline: "Generate engaging lesson plans, customized rubrics, and differentiated learning material.",
    description: "Empowers educators from K-12 to higher education to save 15+ hours weekly on grading, planning, and material creation.",
    recommendedTools: ["claude", "chatgpt", "canva-ai", "gemini", "notion-ai", "speechify"],
    popularTasks: [
      "Generate differentiated lesson plans by grade level",
      "Create interactive quiz questions with answer keys",
      "Draft objective essay grading rubrics",
      "Turn textbook chapters into audio listening guides"
    ],
    workflows: ["academic-research"]
  },
  {
    id: "business",
    name: "Founders & Business Owners",
    icon: "🚀",
    category: "Business",
    tagline: "Model unit economics, build investor pitch decks, and automate daily operations.",
    description: "Designed for startup founders and SMB owners executing fast without massive agency budgets.",
    recommendedTools: ["notion-ai", "claude", "chatgpt", "perplexity", "copy-ai", "jasper"],
    popularTasks: [
      "Financial model and pitch deck presentation",
      "Competitive landscape analysis and battlecards",
      "Standard Operating Procedure (SOP) documentation",
      "Drafting partnership contracts and NDAs"
    ],
    workflows: ["pitch-deck", "content-engine"]
  },
  {
    id: "marketers",
    name: "Marketers & Growth Hackers",
    icon: "📈",
    category: "Marketing",
    tagline: "Publish SEO pillar articles, test ad copy variants, and syndicate video across channels.",
    description: "For growth managers and digital marketers driving organic traffic, PPC conversion, and brand awareness.",
    recommendedTools: ["jasper", "copy-ai", "writesonic", "perplexity", "canva-ai", "opus-clip"],
    popularTasks: [
      "SEO long-form pillar post research and drafting",
      "A/B testing high-converting ad headlines",
      "Repurposing webinars into viral TikTok/Shorts clips",
      "Crafting automated lead nurture email sequences"
    ],
    workflows: ["content-engine", "youtube-creation"]
  },
  {
    id: "hr",
    name: "HR & Talent Recruiters",
    icon: "👥",
    category: "Operations",
    tagline: "Draft compliant job descriptions, screen candidate resumes, and standardize onboarding.",
    description: "For people ops leaders and recruiters building high-performance teams with bias-conscious AI workflows.",
    recommendedTools: ["chatgpt", "claude", "notion-ai", "grammarly", "copilot", "coze"],
    popularTasks: [
      "Draft inclusive role descriptions with benchmark salaries",
      "Structured behavioral interview question generator",
      "Employee onboarding wiki documentation",
      "Company policy and employee handbook updates"
    ],
    workflows: ["pitch-deck"]
  },
  {
    id: "accountants",
    name: "Accountants & Financial Analysts",
    icon: "📊",
    category: "Finance",
    tagline: "Audit spreadsheets, generate financial ratio commentary, and summarize tax updates.",
    description: "For CPAs, CFOs, and financial controllers ensuring accuracy in cash flow forecasts and compliance.",
    recommendedTools: ["chatgpt", "claude", "copilot", "notion-ai", "perplexity", "deepseek"],
    popularTasks: [
      "Audit complex Excel/Sheets financial formulas",
      "Variance commentary on budget vs actual financials",
      "Summarize localized tax legislation changes",
      "Extract structured data from scanned invoices"
    ],
    workflows: ["pitch-deck"]
  },
  {
    id: "lawyers",
    name: "Lawyers & Legal Counsel",
    icon: "⚖️",
    category: "Legal",
    tagline: "Analyze 200-page agreements, flag indemnification risks, and draft clauses rapidly.",
    description: "For corporate attorneys, paralegals, and legal ops reviewing high volumes of commercial contracts.",
    recommendedTools: ["claude", "chatgpt", "perplexity", "notion-ai", "copilot", "deepseek"],
    popularTasks: [
      "Review contract legal clauses and risks",
      "Compare supplier Master Services Agreement (MSA) changes",
      "Draft custom non-disclosure and licensing terms",
      "Cross-examine regulatory compliance guidelines"
    ],
    workflows: ["legal-review"]
  },
  {
    id: "healthcare",
    name: "Healthcare & Clinical Staff",
    icon: "🩺",
    category: "Healthcare",
    tagline: "Summarize clinical notes, transcribe consultations, and translate medical literature.",
    description: "For physicians, nurses, and medical researchers reducing administrative charting burden safely.",
    recommendedTools: ["claude", "perplexity", "chatgpt", "speechify", "whisper", "notion-ai"],
    popularTasks: [
      "Draft patient-friendly medical explanations",
      "Summarize multi-study clinical trials",
      "Voice dictation to structured SOAP note formatting",
      "Translate discharge instructions into 10+ languages"
    ],
    workflows: ["academic-research"]
  },
  {
    id: "writers",
    name: "Authors & Journalists",
    icon: "✍️",
    category: "Creative",
    tagline: "Overcome writer's block, develop deep character arcs, and polish editorial manuscripts.",
    description: "For novelists, screenwriters, investigative journalists, and freelance columnists crafting gripping stories.",
    recommendedTools: ["claude", "chatgpt", "grammarly", "jasper", "notion-ai", "writesonic"],
    popularTasks: [
      "Story worldbuilding and character development",
      "Editorial manuscript line-editing for pacing",
      "Interview transcript synthesis into investigative story",
      "Alternative headline and hook generation"
    ],
    workflows: ["content-engine"]
  },
  {
    id: "architects",
    name: "Architects & 3D Spatial Designers",
    icon: "🏛️",
    category: "Design",
    tagline: "Render photorealistic facade concepts, explore spatial lighting, and iterate 3D forms.",
    description: "For architects, interior designers, and landscape visualizers translating blueprints into stunning imagery.",
    recommendedTools: ["midjourney", "stable-diffusion", "recraft", "luma", "adobe-firefly", "kling"],
    popularTasks: [
      "Generate realistic exterior facade renders",
      "Day-to-night spatial lighting studies",
      "Biophilic interior concept iterations",
      "Flythrough camera video generation from render"
    ],
    workflows: ["youtube-creation"]
  },
  {
    id: "researchers",
    name: "Scientists & Researchers",
    icon: "🔬",
    category: "Science",
    tagline: "Synthesize 100+ PDF papers, verify methodological rigor, and extract key metrics.",
    description: "For PhDs, R&D scientists, and market analysts conducting exhaustive literature reviews and data synthesis.",
    recommendedTools: ["perplexity", "claude", "phind", "deepseek", "chatgpt", "notion-ai"],
    popularTasks: [
      "Extract sample sizes and effect metrics from papers",
      "Compare competing experimental methodologies",
      "Draft structured meta-analysis summaries",
      "Code data visualization charts in Python"
    ],
    workflows: ["academic-research"]
  },
  {
    id: "creators",
    name: "Content Creators & YouTubers",
    icon: "🎬",
    category: "Media",
    tagline: "Produce viral video hooks, clone studio voiceovers, and generate b-roll in minutes.",
    description: "For YouTubers, podcasters, stream editors, and short-form creators scaling their publishing schedule.",
    recommendedTools: ["descript", "elevenlabs", "runway", "kling", "midjourney", "opus-clip", "suno"],
    popularTasks: [
      "Script retention hooks and pacing beats",
      "Generate studio-quality voiceover narration",
      "Create high-CTR YouTube thumbnails",
      "Automated multi-angle video cut and captioning"
    ],
    workflows: ["youtube-creation"]
  },
  {
    id: "sales",
    name: "Sales & Account Executives",
    icon: "💼",
    category: "Sales",
    tagline: "Hyper-personalize outreach emails, analyze deal risks, and practice objection handling.",
    description: "For SDRs, account executives, and revenue leaders accelerating deal closing cycles.",
    recommendedTools: ["salesforce-einstein", "copy-ai", "claude", "chatgpt", "heygen", "grammarly"],
    popularTasks: [
      "Hyper-personalized cold email based on LinkedIn profile",
      "Roleplay tough objection handling before demo",
      "Extract MEDDPICC deal qualifiers from call transcripts",
      "Generate personalized video outreach at scale"
    ],
    workflows: ["pitch-deck"]
  },
  {
    id: "project-managers",
    name: "Project & Product Managers",
    icon: "📋",
    category: "Management",
    tagline: "Draft PRDs, write user stories with acceptance criteria, and map out sprint timelines.",
    description: "For PMs and Scrum masters keeping distributed agile teams aligned and unblocked.",
    recommendedTools: ["notion-ai", "claude", "copilot", "chatgpt", "coze", "dify"],
    popularTasks: [
      "Draft Product Requirement Document (PRD) from bullet points",
      "Convert user feedback into prioritized user stories",
      "Create stakeholder release notes and changelogs",
      "Map out risk dependency matrices for launches"
    ],
    workflows: ["web-app-mvp"]
  },
  {
    id: "customer-support",
    name: "Customer Support Specialists",
    icon: "🎧",
    category: "Support",
    tagline: "Deploy 24/7 autonomous support bots, draft empathetic replies, and build help centers.",
    description: "For support agents and CX managers reducing response times to under 30 seconds.",
    recommendedTools: ["coze", "chatgpt", "dify", "elevenlabs", "grammarly", "copy-ai"],
    popularTasks: [
      "Build custom FAQ chatbot trained on docs",
      "De-escalate frustrated customer ticket replies",
      "Draft searchable Knowledge Base articles",
      "Categorize and tag incoming ticket sentiment"
    ],
    workflows: ["customer-support-ops"]
  },
  {
    id: "freelancers",
    name: "Solopreneurs & Freelancers",
    icon: "⚡",
    category: "Business",
    tagline: "Manage client contracts, automate invoicing, code prototypes, and market your services.",
    description: "For independent consultants and agency owners wearing every hat from marketing to execution.",
    recommendedTools: ["claude", "canva-ai", "notion-ai", "cursor", "elevenlabs", "chatgpt"],
    popularTasks: [
      "Draft client proposals and scope-of-work (SOW)",
      "Automated invoice reminder email templates",
      "Build portfolio website in an afternoon",
      "Execute multi-disciplinary client deliverables"
    ],
    workflows: ["pitch-deck", "web-app-mvp", "content-engine"]
  },
  {
    id: "admin",
    name: "Executive Assistants & Admins",
    icon: "🗂️",
    category: "Operations",
    tagline: "Manage hectic calendar scheduling, summarize board meetings, and draft executive memos.",
    description: "For chiefs of staff, executive assistants, and office managers keeping leadership organized.",
    recommendedTools: ["copilot", "chatgpt", "notion-ai", "grammarly", "speechify", "whisper"],
    popularTasks: [
      "Synthesize 2-hour board meeting into action items",
      "Draft polished executive memos and travel itineraries",
      "Organize inbox chaos into prioritized action folders",
      "Proofread confidential leadership presentations"
    ],
    workflows: ["pitch-deck"]
  }
];

function renderProfessionsGrid() {
  const grid = document.getElementById("professions-grid");
  if (!grid) return;

  grid.innerHTML = PROFESSIONS.map(prof => {
    const topToolChips = prof.recommendedTools.slice(0, 3).map(tid => {
      const t = AI_TOOLS.find(x => x.id === tid);
      return t ? `<span class="prof-tool-chip">${t.emoji} ${t.name}</span>` : '';
    }).join("");

    return `
      <article class="profession-card" onclick="openProfessionModal('${prof.id}')" tabindex="0" role="button" aria-label="Explore ${prof.name} AI Hub">
        <div>
          <div class="prof-header">
            <div class="prof-icon-wrap" aria-hidden="true">${prof.icon}</div>
            <span class="prof-tool-count-badge">${prof.recommendedTools.length} Vetted Tools</span>
          </div>
          <h3 class="prof-title">${prof.name}</h3>
          <p class="prof-tagline">${prof.tagline}</p>
        </div>
        <div>
          <div class="prof-top-tools-label">Top Recommended Stacks:</div>
          <div class="prof-tools-chips">${topToolChips}</div>
          <div class="prof-card-footer">
            <span class="prof-card-link">Explore Hub →</span>
            <span style="font-size:0.75rem;color:var(--white-30);">${prof.popularTasks.length} Workflows</span>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function openProfessionModal(profId) {
  const prof = PROFESSIONS.find(p => p.id === profId);
  if (!prof) return;

  document.getElementById("prof-modal-icon").textContent = prof.icon;
  document.getElementById("prof-modal-title").textContent = `${prof.name} AI Hub`;
  document.getElementById("prof-modal-sub").textContent = prof.description;

  // Tools list
  const toolsHtml = prof.recommendedTools.map(tid => {
    const t = AI_TOOLS.find(x => x.id === tid);
    if (!t) return '';
    const isSaved = isToolSaved(t.id);
    return `
      <div class="prof-modal-tool-card">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:0.5rem;font-weight:700;color:var(--white);">
            <span>${t.emoji}</span>
            <span>${t.name}</span>
          </div>
          <span style="font-size:0.72rem;color:var(--neon-cyan);background:rgba(0,245,212,0.1);padding:2px 8px;border-radius:99px;">
            ${t.free.price === 'No free plan' ? t.paid.price : t.free.price}
          </span>
        </div>
        <p style="font-size:0.78rem;color:var(--white-60);margin:0;line-height:1.4;">${t.bestFor || t.description}</p>
        <div style="display:flex;gap:0.5rem;margin-top:0.25rem;">
          <button class="btn-ghost" onclick="openToolModal('${t.id}')" style="flex:1;padding:6px;font-size:0.75rem;">
            Inspect Details →
          </button>
          <button class="btn-ghost" onclick="toggleSaveTool('${t.id}')" style="padding:6px 10px;font-size:0.75rem;">
            ${isSaved ? '★' : '☆'}
          </button>
        </div>
      </div>
    `;
  }).join("");

  // Tasks list
  const tasksHtml = prof.popularTasks.map((tsk, i) => `
    <li style="font-size:0.85rem;color:var(--white-90);margin-bottom:0.5rem;display:flex;align-items:flex-start;gap:0.5rem;">
      <span style="color:var(--neon-cyan);font-weight:700;">${i + 1}.</span>
      <span>${tsk}</span>
    </li>
  `).join("");

  // Prompts for this profession
  const relatedPrompts = PROMPT_LIBRARY.filter(p => p.profession === prof.id).slice(0, 2);
  let promptsHtml = '';
  if (relatedPrompts.length > 0) {
    promptsHtml = `
      <div class="modal-section-title">💡 Top Ready-to-Use Prompts for ${prof.name}</div>
      <div style="display:flex;flex-direction:column;gap:1rem;margin-bottom:1.5rem;">
        ${relatedPrompts.map(pr => `
          <div style="background:#030408;border:1px solid var(--border);border-radius:var(--radius-md);padding:1rem;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
              <strong style="font-size:0.85rem;color:var(--white);">${pr.title}</strong>
              <span style="font-size:0.72rem;color:var(--neon-cyan);">Tool: ${pr.toolRecommended}</span>
            </div>
            <pre style="background:var(--white-03);padding:0.75rem;border-radius:4px;font-family:monospace;font-size:0.78rem;color:var(--white-90);white-space:pre-wrap;max-height:100px;overflow-y:auto;margin-bottom:0.75rem;">${pr.prompt}</pre>
            <button class="btn-ghost" onclick="copyPromptText('${pr.id}', this)" style="width:100%;font-size:0.78rem;padding:6px;">
              📋 Copy Prompt to Clipboard
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }

  document.getElementById("prof-modal-body").innerHTML = `
    <div class="modal-section-title">⭐ Core AI Toolkit for ${prof.name}</div>
    <div class="prof-modal-tools-grid" style="margin-bottom:2rem;">
      ${toolsHtml}
    </div>

    <div class="modal-section-title">🎯 Popular High-Impact Workflows</div>
    <ul style="list-style:none;padding:0;margin:0 0 2rem;">
      ${tasksHtml}
    </ul>

    ${promptsHtml}

    <div style="display:flex;justify-content:flex-end;margin-top:1.5rem;">
      <button class="btn-neon" onclick="closeModal('profession-modal')">Close Hub ✕</button>
    </div>
  `;

  openModal("profession-modal");
}

/* ── 10.5 PROFESSION + TASK RECOMMENDER ("I AM A... I WANT TO...") ── */
function initProfessionRecommender() {
  const profSelect = document.getElementById("rec-prof-select");
  if (!profSelect) return;

  profSelect.innerHTML = PROFESSIONS.map(p => `
    <option value="${p.id}">${p.icon} ${p.name}</option>
  `).join("");

  onRecommenderProfChange();
}

function onRecommenderProfChange() {
  const profSelect = document.getElementById("rec-prof-select");
  const taskSelect = document.getElementById("rec-task-select");
  if (!profSelect || !taskSelect) return;

  const profId = profSelect.value;
  const prof = PROFESSIONS.find(p => p.id === profId) || PROFESSIONS[0];

  taskSelect.innerHTML = prof.popularTasks.map((t, idx) => `
    <option value="${idx}">${t}</option>
  `).join("");
}

function runRecommender() {
  const profSelect = document.getElementById("rec-prof-select");
  const taskSelect = document.getElementById("rec-task-select");
  const resultsBox = document.getElementById("recommender-results");
  const titleEl = document.getElementById("recommender-results-title");
  const gridEl = document.getElementById("recommender-cards-grid");

  if (!profSelect || !taskSelect || !resultsBox) return;

  const profId = profSelect.value;
  const prof = PROFESSIONS.find(p => p.id === profId) || PROFESSIONS[0];
  const selectedTask = prof.popularTasks[taskSelect.value] || prof.popularTasks[0];

  titleEl.innerHTML = `🎯 Tailored AI Stack for <span class="neon-text">${prof.name}</span>: <em>"${selectedTask}"</em>`;
  resultsBox.classList.remove("hidden");

  // Get top 3 tools tailored for this profession
  const recTools = prof.recommendedTools.slice(0, 3).map(id => AI_TOOLS.find(t => t.id === id)).filter(Boolean);

  gridEl.innerHTML = recTools.map((tool, idx) => {
    const isSaved = isToolSaved(tool.id);
    return `
      <div class="tool-card" style="margin:0;">
        <button class="card-bookmark-btn ${isSaved ? 'saved' : ''}" onclick="toggleSaveTool('${tool.id}');runRecommender();">
          ${isSaved ? '★' : '☆'}
        </button>
        <div class="card-top">
          <div class="card-logo">${tool.emoji}</div>
          <div class="card-info">
            <div class="card-name">${tool.name}</div>
            <div class="card-category">Rank #${idx + 1} Best Match</div>
            <div class="card-company">${tool.company}</div>
          </div>
        </div>
        <div style="font-size:0.75rem;color:var(--neon-cyan);margin-bottom:0.5rem;font-weight:600;">
          🎯 ${tool.bestFor || tool.description}
        </div>
        <p class="card-description">${tool.description}</p>
        <div class="plan-row">
          <div class="plan-badge ${tool.free.price !== 'No free plan' ? 'free-badge' : 'paid-badge'}">
            <div class="plan-label">${tool.free.price !== 'No free plan' ? '✅ FREE' : '⚠️ PAID ONLY'}</div>
            <div class="plan-price">${tool.free.price}</div>
          </div>
          <div class="plan-badge paid-badge">
            <div class="plan-label">💳 PAID</div>
            <div class="plan-price">${tool.paid.price}</div>
          </div>
        </div>
        <div class="card-footer">
          <button class="card-btn" onclick="openToolModal('${tool.id}')">Inspect AI Details →</button>
        </div>
      </div>
    `;
  }).join("");

  resultsBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ── 10.6 AI WORKFLOWS (MULTI-TOOL PIPELINES) ── */
const WORKFLOWS = [
  {
    id: "youtube-creation",
    title: "End-to-End YouTube Production Pipeline",
    badge: "MEDIA & CONTENT",
    desc: "From blank concept to fully captioned 4K video with voiceover, thumbnail, and b-roll.",
    timeSaved: "Save 12+ hours per video",
    steps: [
      { stepNum: "1", toolId: "chatgpt", toolName: "ChatGPT / Claude", actionTag: "Scripting", instruction: "Draft viral retention hook, 3-act narrative pacing, and YouTube title ideas." },
      { stepNum: "2", toolId: "midjourney", toolName: "Midjourney", actionTag: "Cover Art", instruction: "Generate high-contrast, expressive character thumbnail with cinematic lighting." },
      { stepNum: "3", toolId: "elevenlabs", toolName: "ElevenLabs", actionTag: "Voiceover", instruction: "Synthesize emotionally expressive studio-grade human speech from the script." },
      { stepNum: "4", toolId: "kling", toolName: "Kling AI / Runway", actionTag: "B-Roll Gen", instruction: "Generate cinematic 1080p visual cutaways and motion illustrations." },
      { stepNum: "5", toolId: "descript", toolName: "Descript", actionTag: "Assembly & Cut", instruction: "Strip filler words, assemble audio/video timeline, and render dynamic animated captions." }
    ]
  },
  {
    id: "pitch-deck",
    title: "Startup Pitch Deck & Financial Model",
    badge: "STARTUP & VENTURE",
    desc: "Transform rough founder notes into an investor-ready 12-slide deck with defensible unit economics.",
    timeSaved: "Save 20+ hours of prep",
    steps: [
      { stepNum: "1", toolId: "claude", toolName: "Claude 3.5 Sonnet", actionTag: "Narrative & Math", instruction: "Formulate market sizing (TAM/SAM/SOM), unit economics, and slide-by-slide storyline." },
      { stepNum: "2", toolId: "chatgpt", toolName: "ChatGPT / DeepSeek", actionTag: "Financial Model", instruction: "Generate 3-year cash flow projections, customer acquisition cost (CAC), and LTV models in CSV." },
      { stepNum: "3", toolId: "midjourney", toolName: "Midjourney", actionTag: "Mockups", instruction: "Synthesize 3D hardware or software UI concept renders demonstrating product vision." },
      { stepNum: "4", toolId: "notion-ai", toolName: "Notion AI", actionTag: "Exec Summary", instruction: "Compile investor one-pager and data room documentation with clear KPIs." }
    ]
  },
  {
    id: "web-app-mvp",
    title: "Full-Stack Web App Development",
    badge: "SOFTWARE ENGINEERING",
    desc: "Architect, code, test, and deploy a responsive SaaS web application in 24 hours.",
    timeSaved: "Save 2+ weeks dev time",
    steps: [
      { stepNum: "1", toolId: "v0", toolName: "v0 by Vercel", actionTag: "Frontend UI", instruction: "Prompt and iterate interactive React dashboards, modern modals, and Tailwind responsive layouts." },
      { stepNum: "2", toolId: "cursor", toolName: "Cursor IDE", actionTag: "Full-Stack Logic", instruction: "Index codebase, wire frontend components to backend REST/GraphQL endpoints with Composer agent." },
      { stepNum: "3", toolId: "github-copilot", toolName: "GitHub Copilot", actionTag: "Testing & QA", instruction: "Generate automated Jest/Vitest unit test suites and edge-case validations." },
      { stepNum: "4", toolId: "deepseek", toolName: "DeepSeek / Phind", actionTag: "Optimization", instruction: "Audit SQL database query plans, index performance, and resolve container bugs." }
    ]
  },
  {
    id: "content-engine",
    title: "SEO Content Engine & Social Syndication",
    badge: "ORGANIC GROWTH",
    desc: "Rank on Google search while repurposing one authoritative article into 20+ multi-platform posts.",
    timeSaved: "Save 8+ hours per article",
    steps: [
      { stepNum: "1", toolId: "perplexity", toolName: "Perplexity AI", actionTag: "Research & Trends", instruction: "Discover untapped search keywords, competitor content gaps, and verified primary sources." },
      { stepNum: "2", toolId: "claude", toolName: "Claude 3.5 Sonnet", actionTag: "Pillar Draft", instruction: "Write comprehensive, structured 2,500-word authoritative guide with practical examples." },
      { stepNum: "3", toolId: "grammarly", toolName: "Grammarly", actionTag: "Tone Polish", instruction: "Optimize sentence clarity, readability score, and brand voice consistency." },
      { stepNum: "4", toolId: "canva-ai", toolName: "Canva AI", actionTag: "Social Graphics", instruction: "Batch-generate LinkedIn carousel slides and infographic charts matching brand colors." },
      { stepNum: "5", toolId: "copy-ai", toolName: "Copy.ai", actionTag: "Repurposing", instruction: "Extract 5 viral Twitter/X threads and 3 newsletter blurbs from the pillar article." }
    ]
  },
  {
    id: "academic-research",
    title: "Academic Literature Review & Paper Drafting",
    badge: "ACADEMIC & RESEARCH",
    desc: "Synthesize hundreds of journal publications into an organized, cited research manuscript.",
    timeSaved: "Save 40+ hours reading time",
    steps: [
      { stepNum: "1", toolId: "perplexity", toolName: "Perplexity AI", actionTag: "Citation Discovery", instruction: "Locate peer-reviewed papers on PubMed, arXiv, and IEEE with direct DOIs." },
      { stepNum: "2", toolId: "claude", toolName: "Claude 3.5 Sonnet", actionTag: "Synthesis", instruction: "Upload PDF batches to extract methodological differences, findings, and research debates." },
      { stepNum: "3", toolId: "notion-ai", toolName: "Notion AI", actionTag: "Matrix Mapping", instruction: "Organize authors, methodologies, sample sizes, and conclusions in comparison tables." },
      { stepNum: "4", toolId: "grammarly", toolName: "Grammarly", actionTag: "Academic Polish", instruction: "Enforce rigorous academic styling, passive/active voice balance, and bibliography formatting." }
    ]
  },
  {
    id: "legal-review",
    title: "Legal Contract Review & Risk Assessment",
    badge: "LEGAL & COMPLIANCE",
    desc: "Safely audit agreements, identify high-liability clauses, and negotiate favorable revisions.",
    timeSaved: "Save 70% contract cycle time",
    steps: [
      { stepNum: "1", toolId: "claude", toolName: "Claude 3.5 Sonnet", actionTag: "200K Parsing", instruction: "Ingest multi-schedule vendor agreements and identify deviation from standard playbook terms." },
      { stepNum: "2", toolId: "deepseek", toolName: "DeepSeek R1", actionTag: "Risk Reasoning", instruction: "Perform deep reasoning analysis on indemnity, limitation of liability, and IP assignment clauses." },
      { stepNum: "3", toolId: "notion-ai", toolName: "Notion AI", actionTag: "Risk Register", instruction: "Generate redline suggestions and executive risk summary for business stakeholders." }
    ]
  },
  {
    id: "customer-support-ops",
    title: "Autonomous 24/7 AI Customer Support Hub",
    badge: "OPERATIONS & CX",
    desc: "Empower support teams to handle 80% of repetitive questions instantly with high CSAT.",
    timeSaved: "80% reduction in first-response time",
    steps: [
      { stepNum: "1", toolId: "coze", toolName: "Coze / Dify", actionTag: "Knowledge Bot", instruction: "Build custom bot connected to documentation, order tracking APIs, and refund policies." },
      { stepNum: "2", toolId: "chatgpt", toolName: "ChatGPT", actionTag: "Empathy Tuning", instruction: "Formulate empathetic dispute resolution prompts and multi-language routing rules." },
      { stepNum: "3", toolId: "elevenlabs", toolName: "ElevenLabs", actionTag: "Voice AI Agent", instruction: "Deploy conversational phone agent handling routine call triage with natural voice cadence." }
    ]
  }
];

function renderWorkflows() {
  const grid = document.getElementById("workflows-grid");
  if (!grid) return;

  grid.innerHTML = WORKFLOWS.map(wf => {
    const stepsHtml = wf.steps.map(s => `
      <div class="workflow-step">
        <div class="step-number">${s.stepNum}</div>
        <div class="step-body">
          <div class="step-header-row">
            <span class="step-tool-name">${s.toolName}</span>
            <span class="step-action-tag">${s.actionTag}</span>
          </div>
          <p class="step-instruction">${s.instruction}</p>
        </div>
      </div>
    `).join("");

    return `
      <article class="workflow-card">
        <div>
          <div class="workflow-header">
            <div>
              <h3 class="workflow-title">${wf.title}</h3>
              <p class="workflow-desc">${wf.desc}</p>
            </div>
            <span class="workflow-badge">${wf.badge}</span>
          </div>
          <div class="workflow-steps-timeline">
            ${stepsHtml}
          </div>
        </div>
        <div class="workflow-footer">
          <span class="workflow-time-saved">⚡ ${wf.timeSaved}</span>
          <button class="btn-ghost" onclick="showToast('🔗', 'Workflow copied: ${wf.title}')" style="font-size:0.78rem;padding:6px 14px;">
            Save Workflow ★
          </button>
        </div>
      </article>
    `;
  }).join("");
}

/* ── 10.7 COMPARE AI TOOLS MATRIX ── */
const COMPARISON_PRESETS = {
  "chatgpt-vs-claude": ["chatgpt", "claude"],
  "cursor-vs-copilot": ["cursor", "github-copilot"],
  "midjourney-vs-flux": ["midjourney", "flux"],
  "runway-vs-kling": ["runway", "kling"],
  "suno-vs-udio": ["suno", "udio"]
};

function initCompare() {
  const selA = document.getElementById("compare-select-a");
  const selB = document.getElementById("compare-select-b");
  if (!selA || !selB) return;

  const optionsHtml = AI_TOOLS.map(t => `
    <option value="${t.id}">${t.emoji} ${t.name} (${t.company})</option>
  `).join("");

  selA.innerHTML = optionsHtml;
  selB.innerHTML = optionsHtml;

  loadComparisonPreset("chatgpt-vs-claude");
}

function loadComparisonPreset(presetKey) {
  const pair = COMPARISON_PRESETS[presetKey];
  if (!pair) return;

  const selA = document.getElementById("compare-select-a");
  const selB = document.getElementById("compare-select-b");
  if (selA && selB) {
    selA.value = pair[0];
    selB.value = pair[1];
  }

  document.querySelectorAll(".compare-preset-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("onclick").includes(presetKey));
  });

  runComparison();
}

function runComparison() {
  const selA = document.getElementById("compare-select-a");
  const selB = document.getElementById("compare-select-b");
  const container = document.getElementById("compare-table-container");
  if (!selA || !selB || !container) return;

  const toolA = AI_TOOLS.find(t => t.id === selA.value) || AI_TOOLS[0];
  const toolB = AI_TOOLS.find(t => t.id === selB.value) || AI_TOOLS[1];

  container.innerHTML = `
    <table class="compare-table">
      <thead>
        <tr>
          <th class="metric-col">Feature / Metric</th>
          <th>${toolA.emoji} ${toolA.name} <span style="font-size:0.75rem;color:var(--white-60);display:block;font-weight:400;">by ${toolA.company}</span></th>
          <th>${toolB.emoji} ${toolB.name} <span style="font-size:0.75rem;color:var(--white-60);display:block;font-weight:400;">by ${toolB.company}</span></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="metric-col">Category</td>
          <td><span class="compare-feature-chip">${CAT_LABELS[toolA.category] || toolA.category}</span></td>
          <td><span class="compare-feature-chip">${CAT_LABELS[toolB.category] || toolB.category}</span></td>
        </tr>
        <tr>
          <td class="metric-col">Free Tier</td>
          <td>
            <strong>${toolA.free.price}</strong>
            <p style="font-size:0.78rem;color:var(--white-60);margin:0.25rem 0 0;">${toolA.free.detail}</p>
          </td>
          <td>
            <strong>${toolB.free.price}</strong>
            <p style="font-size:0.78rem;color:var(--white-60);margin:0.25rem 0 0;">${toolB.free.detail}</p>
          </td>
        </tr>
        <tr>
          <td class="metric-col">Paid Plan</td>
          <td>
            <strong style="color:var(--neon-cyan);">${toolA.paid.price}</strong>
            <p style="font-size:0.78rem;color:var(--white-60);margin:0.25rem 0 0;">${toolA.paid.detail}</p>
          </td>
          <td>
            <strong style="color:var(--neon-cyan);">${toolB.paid.price}</strong>
            <p style="font-size:0.78rem;color:var(--white-60);margin:0.25rem 0 0;">${toolB.paid.detail}</p>
          </td>
        </tr>
        <tr>
          <td class="metric-col">Ideal For</td>
          <td><em>${toolA.bestFor || toolA.description}</em></td>
          <td><em>${toolB.bestFor || toolB.description}</em></td>
        </tr>
        <tr>
          <td class="metric-col">Ease of Use</td>
          <td><span class="compare-feature-chip">${toolA.easeOfUse || 'Beginner'}</span></td>
          <td><span class="compare-feature-chip">${toolB.easeOfUse || 'Beginner'}</span></td>
        </tr>
        <tr>
          <td class="metric-col">Key Strengths</td>
          <td>
            <ul style="padding-left:1.2rem;margin:0;font-size:0.82rem;color:var(--white-90);">
              ${(toolA.pros || ["High performance", "Reliable output"]).map(p => `<li>${p}</li>`).join('')}
            </ul>
          </td>
          <td>
            <ul style="padding-left:1.2rem;margin:0;font-size:0.82rem;color:var(--white-90);">
              ${(toolB.pros || ["High performance", "Reliable output"]).map(p => `<li>${p}</li>`).join('')}
            </ul>
          </td>
        </tr>
        <tr>
          <td class="metric-col">Limitations</td>
          <td>
            <ul style="padding-left:1.2rem;margin:0;font-size:0.82rem;color:var(--white-60);">
              ${(toolA.cons || ["Usage limits on free tier"]).map(c => `<li>${c}</li>`).join('')}
            </ul>
          </td>
          <td>
            <ul style="padding-left:1.2rem;margin:0;font-size:0.82rem;color:var(--white-60);">
              ${(toolB.cons || ["Usage limits on free tier"]).map(c => `<li>${c}</li>`).join('')}
            </ul>
          </td>
        </tr>
        <tr>
          <td class="metric-col">Actions</td>
          <td>
            <button class="btn-ghost" onclick="openToolModal('${toolA.id}')" style="width:100%;font-size:0.78rem;padding:8px 12px;margin-bottom:0.4rem;">
              Inspect ${toolA.name} →
            </button>
            <a href="${toolA.url}" target="_blank" rel="noopener noreferrer" class="btn-neon" style="display:block;text-align:center;font-size:0.78rem;padding:8px 12px;">
              Visit Official Site ↗
            </a>
          </td>
          <td>
            <button class="btn-ghost" onclick="openToolModal('${toolB.id}')" style="width:100%;font-size:0.78rem;padding:8px 12px;margin-bottom:0.4rem;">
              Inspect ${toolB.name} →
            </button>
            <a href="${toolB.url}" target="_blank" rel="noopener noreferrer" class="btn-neon" style="display:block;text-align:center;font-size:0.78rem;padding:8px 12px;">
              Visit Official Site ↗
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  `;
}

/* ── 10.8 PROMPT LIBRARY (ROLE-SPECIFIC) ── */
const PROMPT_LIBRARY = [
  {
    id: "dev-code-review",
    profession: "developers",
    professionName: "Developers",
    title: "Senior Staff Code Review & Security Audit",
    scenario: "Paste before merging pull requests to catch subtle concurrency, memory, and security bugs.",
    toolRecommended: "Claude 3.5 Sonnet / Cursor",
    prompt: `Act as a Senior Staff Security and Performance Engineer. Review the following code snippet carefully.
Identify:
1. Potential security vulnerabilities (injection, auth bypass, memory leaks)
2. Asynchronous concurrency race conditions or unhandled edge cases
3. Performance bottlenecks and Big-O computational regressions
4. Recommended drop-in refactored code with explanatory diffs

Here is the code:
[PASTE CODE HERE]`
  },
  {
    id: "academic-lit-review",
    profession: "students",
    professionName: "Students",
    title: "Literature Review Synthesis Matrix",
    scenario: "Compare 3 to 5 academic research papers side by side to uncover thesis gaps.",
    toolRecommended: "Claude 3.5 Sonnet / Perplexity",
    prompt: `I am conducting an academic literature review on [TOPIC].
Synthesize the provided papers into a structured markdown comparison matrix with the following columns:
- Author & Year
- Primary Research Question / Hypothesis
- Sample Size & Methodology
- Key Findings & Statistical Significance
- Limitations & Future Research Gaps

Highlight the main theoretical disagreements between the authors.
Here are the paper abstracts:
[PASTE ABSTRACTS OR EXTRACTS]`
  },
  {
    id: "legal-contract-audit",
    profession: "lawyers",
    professionName: "Lawyers",
    title: "Master Services Agreement (MSA) Risk Audit",
    scenario: "Audit incoming vendor agreements and generate redline revisions.",
    toolRecommended: "Claude 3.5 Sonnet",
    prompt: `Act as Senior Corporate In-House Counsel. Review the attached commercial agreement clauses from our perspective as the [BUYER / SELLER].
For each clause:
1. Classify risk level: LOW, MEDIUM, or HIGH
2. Flag one-sided terms regarding Limitation of Liability, Indemnity, IP Ownership, and Termination for Convenience
3. Draft a balanced, industry-standard compromise redline clause that protects our commercial interests

Agreement clauses:
[PASTE CLAUSES HERE]`
  },
  {
    id: "marketer-pillar-outline",
    profession: "marketers",
    professionName: "Marketers",
    title: "SEO Pillar Article Content Strategy & Outline",
    scenario: "Create a 2,500-word search-dominating article outline that answers search intent.",
    toolRecommended: "ChatGPT / Perplexity",
    prompt: `Act as an elite SEO Content Strategist. I want to rank #1 on Google for the target keyword: "[TARGET KEYWORD]".
Search Intent: [Informational / Commercial / Transactional]
Please generate:
1. A compelling Title Tag and Meta Description optimized for high click-through rate (CTR)
2. Comprehensive H2 and H3 heading hierarchy answering user search intent thoroughly
3. Key statistics, diagrams, and data points that should be included to build domain authority
4. 5 FAQ questions pulled directly from 'People Also Ask' queries with concise direct answers`
  },
  {
    id: "founder-pitch-hook",
    profession: "business",
    professionName: "Founders",
    title: "10-Second Investor Hook & Problem Statement",
    scenario: "Refine your startup's narrative hook for venture capital investors and accelerator applications.",
    toolRecommended: "Claude 3.5 Sonnet",
    prompt: `You are a partner at a top-tier venture capital firm (like Sequoia or Benchmark).
Critique and rewrite my startup pitch statement.
My product: [DESCRIBE PRODUCT IN 2 SENTENCES]
Target Customer: [WHO PAYS FOR IT]
Core Pain Point: [WHAT MAKES THEIR LIFE HARD TODAY]
Our Solution: [HOW WE SOLVE IT 10X BETTER]

Deliver:
1. A ruthless critique identifying vague buzzwords and lack of defensibility
2. Three punchy alternative 1-sentence hooks tailored for investors
3. The 'hair on fire' problem statement quantified with monetary impact`
  },
  {
    id: "designer-ui-brief",
    profession: "designers",
    professionName: "Designers",
    title: "Midjourney Cinematic UI/UX Concept Art",
    scenario: "Generate futuristic, cyberpunk, or clean glassmorphic design concepts.",
    toolRecommended: "Midjourney v6 / FLUX.1",
    prompt: `futuristic fintech dashboard interface, dark theme, sleek glassmorphism panels, cyan #00f5d4 and neon violet #7928ca glowing telemetry lines, financial trading metrics, 3D holographic data graphs, minimal typography, shot on 35mm lens, photorealistic studio lighting, octane render, 8k resolution, clean modern UI --ar 16:9 --v 6.0`
  },
  {
    id: "teacher-lesson-plan",
    profession: "teachers",
    professionName: "Teachers",
    title: "Differentiated High School STEM Lesson Plan",
    scenario: "Build a 60-minute interactive lesson plan with tiered activities for various learning speeds.",
    toolRecommended: "Claude / ChatGPT",
    prompt: `Act as an expert high school curriculum designer. Create a 60-minute lesson plan on [TOPIC, e.g., Photosynthesis and Cellular Energy] for [9th Grade Biology].
Include:
1. 5-minute engaging real-world hook / bell-ringer question
2. 15-minute direct instruction outline with visual analogies
3. 25-minute collaborative group lab activity
4. Differentiated tier adjustments:
   - Support for struggling learners
   - Extension challenge for advanced students
5. 5-minute exit ticket with 3 formative assessment questions`
  },
  {
    id: "sales-cold-outreach",
    profession: "sales",
    professionName: "Sales",
    title: "Hyper-Personalized Executive Cold Email",
    scenario: "Convert cold C-level prospects into discovery calls without sound like spam.",
    toolRecommended: "Copy.ai / ChatGPT",
    prompt: `Act as a top 1% Enterprise Account Executive. Write a cold outreach email to [PROSPECT NAME], [TITLE] at [COMPANY].
Recent company news / trigger event: [e.g., They just raised Series B or expanded into Europe]
Our value prop: [e.g., We help engineering teams reduce cloud infrastructure bills by 35%]
Rules:
- Under 90 words
- No cheesy pleasantries ("Hope this finds you well")
- Focus 80% on their business pain, 20% on our solution
- Frictionless low-commitment Call To Action (e.g., "Open to an informal 3-minute idea exchange?")`
  },
  {
    id: "creator-youtube-hook",
    profession: "creators",
    professionName: "Creators",
    title: "Viral YouTube 30-Second Video Intro Hook",
    scenario: "Craft a high-retention intro script that prevents viewers from clicking away.",
    toolRecommended: "ChatGPT / Claude",
    prompt: `Act as a YouTube retention algorithm expert with 10M+ views experience. Write 3 alternative opening 30-second video hooks for a video titled:
"[VIDEO TITLE, e.g., I Built an AI Clone of Myself in 48 Hours]"
Framework:
- Second 0-5: Immediate visual and audio disruption (No "Hey guys, welcome back!")
- Second 6-15: Escalate the stakes (What happens if I fail?)
- Second 16-25: Tease the surprising climax
- Second 26-30: Bridge directly into the first practical step`
  },
  {
    id: "finance-variance-analysis",
    profession: "accountants",
    professionName: "Accountants",
    title: "Quarterly Budget vs Actual Financial Variance Commentary",
    scenario: "Translate raw monthly ledger variance numbers into executive board commentary.",
    toolRecommended: "Claude / ChatGPT",
    prompt: `Act as a Corporate Financial Controller. Analyze the following budget vs actual financial data for Q2:
[PASTE TABLE WITH REVENUE, COGS, OPEX, EBITDA]
Produce:
1. Executive Summary highlighting the single largest positive and negative variance
2. Root-cause breakdown explaining WHY the variance occurred (Price vs Volume vs Timing)
3. Actionable remediation steps for department heads to stay on track for Q3 budget`
  },
  {
    id: "hr-behavioral-questions",
    profession: "hr",
    professionName: "HR & Recruiters",
    title: "Structured STAR Behavioral Interview Matrix",
    scenario: "Standardize candidate interviews to eliminate bias and grade competency accurately.",
    toolRecommended: "Claude / ChatGPT",
    prompt: `I am hiring for the role of [ROLE TITLE, e.g., Senior Product Marketing Manager].
The core competencies required are: Cross-functional leadership, data-driven analytical decision making, and navigating ambiguity.
Generate:
1. 5 in-depth behavioral interview questions using the STAR framework (Situation, Task, Action, Result)
2. What a 'Poor' (1/5), 'Good' (3/5), and 'Exceptional' (5/5) candidate answer sounds like for each question
3. Probing follow-up questions to uncover whether the candidate did the work or was just a bystander`
  },
  {
    id: "support-de-escalate",
    profession: "customer-support",
    professionName: "Customer Support",
    title: "Empathetic Customer Dispute De-escalation",
    scenario: "Turn an angry, churn-risk customer into a brand advocate.",
    toolRecommended: "Claude / ChatGPT",
    prompt: `Act as an elite Customer Experience Lead. An angry premium customer just sent this message:
"[PASTE ANGRY CUSTOMER COMPLAINT]"
Company policy: [e.g., We can issue a 1-month refund credit and expedite their ticket to Level 3 engineering]
Draft an empathetic reply that:
1. Validates their frustration without admitting legal liability
2. Explains the exact transparent steps being taken right now to resolve their issue
3. Delivers the compensation credit gracefully without making them jump through hoops`
  }
];

function initPromptLibrary() {
  const bar = document.getElementById("prompts-filter-bar");
  if (!bar) return;

  const categories = [
    { id: "all", label: "🌟 All Prompts" },
    { id: "developers", label: "💻 Developers" },
    { id: "students", label: "🎓 Students & Academics" },
    { id: "business", label: "🚀 Founders" },
    { id: "marketers", label: "📈 Marketers" },
    { id: "lawyers", label: "⚖️ Lawyers" },
    { id: "creators", label: "🎬 Creators" },
    { id: "teachers", label: "📚 Teachers" }
  ];

  bar.innerHTML = categories.map((cat, i) => `
    <button class="prompt-filter-pill ${i === 0 ? 'active' : ''}" onclick="filterPrompts('${cat.id}', this)">
      ${cat.label}
    </button>
  `).join("");

  renderPrompts("all");
}

function filterPrompts(profId, pillEl) {
  document.querySelectorAll(".prompt-filter-pill").forEach(p => p.classList.remove("active"));
  if (pillEl) pillEl.classList.add("active");
  renderPrompts(profId);
}

function renderPrompts(filter) {
  const grid = document.getElementById("prompts-grid");
  if (!grid) return;

  const filtered = filter === "all"
    ? PROMPT_LIBRARY
    : PROMPT_LIBRARY.filter(p => p.profession === filter);

  grid.innerHTML = filtered.map(pr => `
    <article class="prompt-card">
      <div>
        <div class="prompt-card-top">
          <span class="prompt-prof-badge">${pr.professionName}</span>
          <span class="prompt-tool-tag">Recommended: ${pr.toolRecommended}</span>
        </div>
        <h3 class="prompt-title">${pr.title}</h3>
        <p class="prompt-scenario">${pr.scenario}</p>
        <div class="prompt-box" id="prompt-text-${pr.id}">${escapeHtml(pr.prompt)}</div>
      </div>
      <button class="prompt-copy-btn" onclick="copyPromptText('${pr.id}', this)">
        <span>📋 Copy Prompt</span>
      </button>
    </article>
  `).join("");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function copyPromptText(promptId, btn) {
  const pr = PROMPT_LIBRARY.find(p => p.id === promptId);
  if (!pr) return;

  navigator.clipboard.writeText(pr.prompt).then(() => {
    btn.classList.add("copied");
    btn.innerHTML = "<span>✅ Prompt Copied to Clipboard!</span>";
    showToast("📋", `"${pr.title}" prompt copied! Paste into ${pr.toolRecommended}.`);
    setTimeout(() => {
      btn.classList.remove("copied");
      btn.innerHTML = "<span>📋 Copy Prompt</span>";
    }, 2200);
  }).catch(() => {
    showToast("📋", "Copied prompt successfully.");
  });
}

/* ── 10.9 SMART AI FINDER ("What do you want to do?") ── */
function initSmartFinder() {
  const input = document.getElementById("finder-input");
  if (!input) return;

  let debounceTimer;
  input.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      runSmartFinder(e.target.value.trim());
    }, 200);
  });
}

function applyFinderChip(taskString) {
  const input = document.getElementById("finder-input");
  if (input) {
    input.value = taskString;
    runSmartFinder(taskString);
  }
}

function runSmartFinder(query) {
  const resultsBox = document.getElementById("finder-results-box");
  const grid = document.getElementById("finder-results-grid");
  const countEl = document.getElementById("finder-results-count");
  if (!resultsBox || !grid) return;

  if (!query) {
    resultsBox.classList.add("hidden");
    return;
  }

  const q = query.toLowerCase();
  const tokens = q.split(/\s+/).filter(w => w.length > 2);

  // Score each tool based on relevance
  const scored = AI_TOOLS.map(t => {
    let score = 0;
    const name = t.name.toLowerCase();
    const comp = t.company.toLowerCase();
    const desc = t.description.toLowerCase();
    const best = (t.bestFor || "").toLowerCase();
    const cat = (t.category || "").toLowerCase();
    const tasks = (t.tasks || []).map(k => k.toLowerCase()).join(" ");
    const profs = (t.professions || []).join(" ");
    const tags = (t.tags || []).join(" ").toLowerCase();

    tokens.forEach(tok => {
      if (name.includes(tok)) score += 10;
      if (best.includes(tok)) score += 6;
      if (tasks.includes(tok)) score += 5;
      if (profs.includes(tok)) score += 4;
      if (tags.includes(tok)) score += 3;
      if (desc.includes(tok)) score += 2;
      if (cat.includes(tok)) score += 2;
      if (comp.includes(tok)) score += 1;
    });

    return { tool: t, score };
  }).filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(item => item.tool);

  if (scored.length === 0) {
    resultsBox.classList.remove("hidden");
    countEl.textContent = "0 matches found";
    grid.innerHTML = `
      <div class="no-results" style="grid-column: 1 / -1; padding: 2rem 0;">
        <div class="no-results-icon">🔍</div>
        <h3>No direct tool match found</h3>
        <p>Try searching general terms like "coding", "video", "research", or "writing".</p>
      </div>
    `;
    return;
  }

  resultsBox.classList.remove("hidden");
  countEl.textContent = `${scored.length} matching AI tools`;
  grid.innerHTML = "";
  const frag = document.createDocumentFragment();
  scored.forEach((t, i) => frag.appendChild(buildCard(t, i)));
  grid.appendChild(frag);
}


/* ─────────────────────────────────────────────────────
   11. DEVELOPER API & BLOG PREVIEW LOGIC
   ───────────────────────────────────────────────────── */
var currentApiEndpoint = "tools-endpoint";
var currentApiLang = "curl";

function generateDevApiKey() {
  var chars = "abcdef0123456789";
  var key = "org_live_";
  for (var i = 0; i < 24; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  var input = document.getElementById("api-key-input");
  input.value = key;
  
  // Copy to clipboard
  navigator.clipboard.writeText(key).then(function() {
    showToast("🔑", "API Key copied to clipboard! Keep it safe.");
  }).catch(function() {
    showToast("🔑", "API Key generated successfully.");
  });
}

function switchApiTab(tabEl, endpointId) {
  tabEl.parentElement.querySelectorAll(".api-tab").forEach(function(btn) {
    btn.classList.remove("active"); btn.setAttribute("aria-selected", "false");
  });
  tabEl.classList.add("active"); tabEl.setAttribute("aria-selected", "true");
  currentApiEndpoint = endpointId;
  updateApiCode();
}

function switchApiLang(lang) {
  document.querySelectorAll(".api-lang-btn").forEach(function(btn) {
    btn.classList.remove("active");
  });
  // Find language button by text content
  var matchText = lang === "curl" ? "cURL" : (lang === "js" ? "JS" : "Python");
  document.querySelectorAll(".api-lang-btn").forEach(function(btn) {
    if (btn.textContent === matchText) btn.classList.add("active");
  });
  currentApiLang = lang;
  updateApiCode();
}

var API_TEMPLATES = {
  "tools-endpoint": {
    curl: "curl -X GET \"https://api.organai.io/v1/tools\" \\\n  -H \"Authorization: Bearer YOUR_API_KEY\"",
    js: "fetch('https://api.organai.io/v1/tools', {\n  headers: {\n    'Authorization': 'Bearer YOUR_API_KEY'\n  }\n})\n.then(res => res.json())\n.then(data => console.log(data));",
    py: "import requests\n\nurl = 'https://api.organai.io/v1/tools'\nheaders = {'Authorization': 'Bearer YOUR_API_KEY'}\n\nresponse = requests.get(url, headers=headers)\nprint(response.json())",
    response: "{\n  \"status\": \"success\",\n  \"count\": 67,\n  \"tools\": [\n    {\n      \"id\": \"chatgpt\",\n      \"name\": \"ChatGPT\",\n      \"category\": \"text\",\n      \"pricing\": \"Freemium\",\n      \"bestFor\": \"General reasoning & writing\"\n    },\n    {\n      \"id\": \"cursor\",\n      \"name\": \"Cursor\",\n      \"category\": \"code\",\n      \"pricing\": \"Freemium\",\n      \"bestFor\": \"Full-codebase agentic development\"\n    }\n  ]\n}"
  },
  "professions-endpoint": {
    curl: "curl -X GET \"https://api.organai.io/v1/professions\" \\\n  -H \"Authorization: Bearer YOUR_API_KEY\"",
    js: "fetch('https://api.organai.io/v1/professions', {\n  headers: {\n    'Authorization': 'Bearer YOUR_API_KEY'\n  }\n})\n.then(res => res.json())\n.then(data => console.log(data));",
    py: "import requests\n\nurl = 'https://api.organai.io/v1/professions'\nheaders = {'Authorization': 'Bearer YOUR_API_KEY'}\n\nresponse = requests.get(url, headers=headers)\nprint(response.json())",
    response: "{\n  \"status\": \"success\",\n  \"count\": 20,\n  \"professions\": [\n    {\n      \"id\": \"developers\",\n      \"name\": \"Developers & Engineers\",\n      \"recommendedTools\": [\"cursor\", \"github-copilot\", \"v0\", \"bolt\"],\n      \"popularTasks\": 4\n    },\n    {\n      \"id\": \"designers\",\n      \"name\": \"UI/UX & Graphic Designers\",\n      \"recommendedTools\": [\"midjourney\", \"flux\", \"canva-ai\", \"recraft\"],\n      \"popularTasks\": 4\n    }\n  ]\n}"
  },
  "workflows-endpoint": {
    curl: "curl -X GET \"https://api.organai.io/v1/workflows\" \\\n  -H \"Authorization: Bearer YOUR_API_KEY\"",
    js: "fetch('https://api.organai.io/v1/workflows', {\n  headers: {\n    'Authorization': 'Bearer YOUR_API_KEY'\n  }\n})\n.then(res => res.json())\n.then(data => console.log(data));",
    py: "import requests\n\nurl = 'https://api.organai.io/v1/workflows'\nheaders = {'Authorization': 'Bearer YOUR_API_KEY'}\n\nresponse = requests.get(url, headers=headers)\nprint(response.json())",
    response: "{\n  \"status\": \"success\",\n  \"count\": 7,\n  \"workflows\": [\n    {\n      \"id\": \"youtube-creation\",\n      \"title\": \"End-to-End YouTube Production\",\n      \"toolChain\": [\"chatgpt\", \"midjourney\", \"elevenlabs\", \"runway\", \"descript\"],\n      \"timeSaved\": \"85% faster creation\"\n    }\n  ]\n}"
  }
};

function updateApiCode() {
  var tpl = API_TEMPLATES[currentApiEndpoint];
  if (!tpl) return;
  var codeDisplay = document.getElementById("api-code-display");
  var respDisplay = document.getElementById("api-response-display");
  if (codeDisplay) codeDisplay.textContent = tpl[currentApiLang];
  if (respDisplay) respDisplay.textContent = tpl.response;
}

// Blog Database
var BLOG_POSTS = {
  "rise-of-agents": {
    title: "The Rise of Agentic AI: Beyond Simple Chatbots",
    tag: "AI & Tech",
    tagClass: "tag-tech",
    time: "5 min read",
    author: "Dr. Caleb Vance",
    avatar: "👨‍💻",
    date: "June 26, 2026",
    body: "<p>Artificial intelligence is undergoing a foundational paradigm shift. For the past three years, the industry has been dominated by conversational Large Language Models (LLMs) like ChatGPT, Claude, and Gemini. While highly capable at summarization, coding, and creative text generation, these tools remain passive: they only output answers when prompted and lack the agency to execute multi-step workflows autonomously.</p>" +
          "<p>Enter <strong>Agentic AI</strong>. Rather than acting as a passive oracle, an AI Agent is designed to achieve open-ended goals. It possesses tools, runs loops, checks its own work, and makes decisions dynamically to solve complex tasks without constant human feedback.</p>" +
          "<h4>How Agentic AI Operates</h4>" +
          "<p>A typical AI Agent workflow is composed of four critical modules:</p>" +
          "<ul>" +
          "<li><strong>Goal Definition</strong>: The user specifies a high-level outcome (e.g., 'Analyze competitor pricing and generate a markdown table').</li>" +
          "<li><strong>Planning &amp; Reflection</strong>: The agent breaks down the instruction into sequential sub-tasks and critiques its plan.</li>" +
          "<li><strong>Tool Execution</strong>: The agent accesses APIs, runs shell commands, reads local database entries, or browses the web to gather data.</li>" +
          "<li><strong>Self-Correction</strong>: If a step fails (such as an API returning a rate limit error), the agent loops back, updates its parameters, and tries a different approach.</li>" +
          "</ul>" +
          "<p>At ORGAN AI, we are integrating these agentic patterns directly into our Developer portal. By combining standard directory indexing with programmatic tool loops, developers can build interfaces that write, edit, and test their own integrations automatically.</p>"
  },
  "glassmorphism": {
    title: "Designing 3D Glassmorphic Interfaces for Web3 & AI",
    tag: "UI/UX Design",
    tagClass: "tag-design",
    time: "4 min read",
    author: "Elena Rostova",
    avatar: "👩‍🎨",
    date: "June 24, 2026",
    body: "<p>Modern tech aesthetics have shifted from the flat, minimalist layouts of the 2010s to immersive, tactile, and responsive visual spaces. In the Web3, AI, and developer dashboard spaces, <strong>Glassmorphism</strong> is the reigning style. When implemented correctly, it makes screens feel premium, futuristic, and alive.</p>" +
          "<p>Glassmorphism relies on a combination of transparency, blur, neon ambient glows, and interactive 3D rotations that track the user's cursor. Here is how we build this visual stack at ORGAN AI.</p>" +
          "<h4>1. The Backdrop Filter</h4>" +
          "<p>The core of glassmorphism is making the container transparent while blurring the contents behind it. This creates a frosted-glass appearance:</p>" +
          "<pre><code>background: rgba(255, 255, 255, 0.03);\nbackdrop-filter: blur(12px);\nborder: 1px solid rgba(255, 255, 255, 0.08);</code></pre>" +
          "<h4>2. Ambient Glow &amp; Cursor Lighting</h4>" +
          "<p>To avoid flat containers, we drop a radial-gradient light layer behind the container that moves in real time with the mouse. By setting <code>pointer-events: none</code>, this visual highlight floats smoothly under the container text without interfering with clicks.</p>" +
          "<h4>3. 3D Perspective and Tilt</h4>" +
          "<p>By applying <code>transform-style: preserve-3d</code> to the card, and translating child elements along the Z-axis, we create a parallax effect. When the mouse moves, the card rotates along the X and Y axes, making the inner elements pop off the screen.</p>" +
          "<p>Applying these micro-interactions increases click-through rates by up to 40% because users feel a sense of play and control just by hovering over the page.</p>"
  },
  "ai-workflows": {
    title: "Mastering AI Workflows: Multi-Tool Pipelines in 2026",
    tag: "AI Workflows",
    tagClass: "tag-tech",
    time: "6 min read",
    author: "Leo Martinez",
    avatar: "👨‍🚀",
    date: "June 21, 2026",
    body: "<p>In 2023, the industry focused on single-model prompt engineering. In 2026, real productivity belongs to professionals who orchestrate <strong>Multi-Tool AI Pipelines</strong>. No single model excels simultaneously at codebase reasoning, photorealistic diffusion, voice synthesis, and video interpolation.</p>" +
          "<h4>The Power of Stacking Specialized Models</h4>" +
          "<p>Consider end-to-end video creation. Using a monolithic model often produces generic scripts and low-fidelity audio. By contrast, a chained workflow yields studio-grade output:</p>" +
          "<ul>" +
          "<li><strong>Step 1</strong>: ChatGPT or Claude generates narrative scripts with structured pacing hooks.</li>" +
          "<li><strong>Step 2</strong>: Midjourney generates ultra-high-resolution cover graphics and visual storyboards.</li>" +
          "<li><strong>Step 3</strong>: ElevenLabs produces emotionally expressive, human-quality voiceovers.</li>" +
          "<li><strong>Step 4</strong>: Kling AI or Runway animates visual frames with realistic physics and cinematic camera pans.</li>" +
          "<li><strong>Step 5</strong>: Descript synchronizes transcripts, strips filler words, and burns dynamic captions.</li>" +
          "</ul>" +
          "<h4>Why Role-Specific Stacks Win</h4>" +
          "<p>Across software engineering, finance, legal review, and marketing, professionals who connect domain-tailored models achieve up to 10× output acceleration without sacrificing quality.</p>"
  }
};

function openBlogPost(postId) {
  var post = BLOG_POSTS[postId];
  if (!post) return;
  
  document.getElementById("blog-modal-title").textContent = post.title;
  var tagEl = document.getElementById("blog-modal-tag");
  tagEl.textContent = post.tag;
  tagEl.className = "blog-tag " + post.tagClass;
  document.getElementById("blog-modal-time").textContent = post.time;
  document.getElementById("blog-modal-author-avatar").textContent = post.avatar;
  document.getElementById("blog-modal-author-name").textContent = post.author;
  document.getElementById("blog-modal-date").textContent = post.date;
  document.getElementById("blog-modal-body").innerHTML = post.body;
  
  openModal("blog-modal");
}

/* ─────────────────────────────────────────────────────
   12. INIT
   ───────────────────────────────────────────────────── */
document.getElementById("footer-year").textContent      = new Date().getFullYear();
document.getElementById("hero-tool-count").textContent  = AI_TOOLS.length;

// Initialize All AI Discovery Hub Systems
initBookmarks();
initToolEnrichments();
render();
renderToolOfDay();
initSmartFinder();
initProfessionRecommender();
renderProfessionsGrid();
renderWorkflows();
initCompare();
initPromptLibrary();
updateApiCode();

// Relay pointermove and resize to shader-frame background for interactive pointer drift
window.addEventListener('pointermove', function(e) {
  var iframe = document.querySelector('.shader-frame iframe');
  if (iframe && iframe.contentWindow) {
    try {
      var evt = new PointerEvent('pointermove', {
        clientX: e.clientX,
        clientY: e.clientY,
        bubbles: true
      });
      iframe.contentWindow.dispatchEvent(evt);
    } catch (_) {}
  }
}, { passive: true });

window.addEventListener('resize', function() {
  var iframe = document.querySelector('.shader-frame iframe');
  if (iframe && iframe.contentWindow) {
    try {
      iframe.contentWindow.dispatchEvent(new Event('resize'));
    } catch (_) {}
  }
}, { passive: true });



