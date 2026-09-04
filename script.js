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
    reply = getLocalAnswer(text);
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
  const anyOpen = ["signin-modal", "signup-modal", "tool-modal", "privacy-modal", "terms-modal", "blog-modal", "game-player-modal", "social-modal"]
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
  ["signin-modal", "signup-modal", "tool-modal", "privacy-modal", "terms-modal", "blog-modal", "social-modal"].forEach(closeModal);
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
    const matchCat = curFilter === "all" || t.category === curFilter;
    const matchSrch = !s || t.name.toLowerCase().includes(s) || t.company.toLowerCase().includes(s)
      || t.description.toLowerCase().includes(s) || t.tags.some(g => g.toLowerCase().includes(s));
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
  const tags = tool.tags.slice(0, 3).map(t => '<span class="tag-chip">' + t + "</span>").join("");

  el.innerHTML =
    '<div class="card-top">' +
      '<div class="card-logo" aria-hidden="true">' + tool.emoji + "</div>" +
      '<div class="card-info">' +
        '<div class="card-name">' + tool.name + "</div>" +
        '<div class="card-category">' + (CAT_LABELS[tool.category] || tool.category) + "</div>" +
        '<div class="card-company">' + tool.company + "</div>" +
      "</div></div>" +
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
  // Prevent button double-fire
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

  document.getElementById("tool-modal-logo").textContent  = t.emoji;
  document.getElementById("tool-modal-title").textContent = t.name;
  document.getElementById("tool-modal-sub").textContent   = t.company + " · " + (CAT_LABELS[t.category] || t.category);

  const freeF = t.free.features.map(f => '<li><span class="fi">✅</span>' + f + "</li>").join("");
  const paidF = t.paid.features.map(f => '<li><span class="fi">💎</span>' + f + "</li>").join("");

  document.getElementById("tool-modal-body").innerHTML =
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
    "</div>";

  document.getElementById("tool-modal-footer").innerHTML =
    '<a href="' + t.url + '" target="_blank" rel="noopener noreferrer" class="modal-visit-btn" id="visit-' + t.id + '">' +
      "🌐 Visit " + t.name + " Official Website →" +
    "</a>";

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
   10. FREE ONLINE GAMES
   ───────────────────────────────────────────────────── */

const GAME_CATEGORIES = {
  action:      { label: "Action",      emoji: "\uD83D\uDCA5", color: "#ff4444" },
  racing:      { label: "Racing",      emoji: "\uD83C\uDFCE\uFE0F", color: "#ff8800" },
  puzzle:      { label: "Puzzle",      emoji: "\uD83E\uDDE9", color: "#aa44ff" },
  adventure:   { label: "Adventure",   emoji: "\uD83D\uDDFA\uFE0F", color: "#44bb44" },
  multiplayer: { label: "Multiplayer", emoji: "\uD83D\uDC65", color: "#4488ff" },
  strategy:    { label: "Strategy",    emoji: "\u265F\uFE0F", color: "#ffaa00" },
  sports:      { label: "Sports",      emoji: "\u26BD",       color: "#44ddaa" },
  arcade:      { label: "Arcade",      emoji: "\uD83D\uDC7E", color: "#ff44aa" }
};

const BROWSER_GAMES = [
  /* ── ACTION ── */
  { id:"krunker",      name:"Krunker.io",        category:"action",     emoji:"\uD83D\uDD2B",  description:"Fast-paced pixel-art FPS with classes, custom maps, and competitive ranked modes.",              playUrl:"https://krunker.io",                                  embedUrl:null,                          tags:["FPS","Competitive","Pixel"],         defaultRating:4.5, isFeatured:true,  isTrending:true,  isNew:false },
  { id:"shellshock",   name:"Shell Shockers",     category:"action",     emoji:"\uD83E\uDD5A",  description:"Egg-themed multiplayer FPS — crack your opponents in this hilarious online shooter.",             playUrl:"https://shellshock.io",                               embedUrl:null,                       tags:["FPS","Funny","Multiplayer"],         defaultRating:4.3, isFeatured:false, isTrending:true,  isNew:false },
  { id:"1v1lol",       name:"1v1.LOL",            category:"action",     emoji:"\uD83C\uDFD7\uFE0F", description:"Build and shoot in this fast-paced 1v1 battle game with Fortnite-style building mechanics.",    playUrl:"https://1v1.lol",                                     embedUrl:null,                             tags:["Building","Shooting","1v1"],         defaultRating:4.4, isFeatured:true,  isTrending:false, isNew:false },
  { id:"evio",         name:"Ev.io",              category:"action",     emoji:"\u26A1",         description:"Sci-fi arena shooter with hoverboards, portals, and fast-paced multiplayer combat.",              playUrl:"https://ev.io",                                       embedUrl:null,                               tags:["Sci-Fi","Arena","Fast"],             defaultRating:4.2, isFeatured:false, isTrending:false, isNew:true  },
  { id:"zombsroyale",  name:"Zombs Royale",       category:"action",     emoji:"\uD83D\uDC80",  description:"2D battle royale — loot, build, and be the last one standing in 100-player matches.",             playUrl:"https://zombsroyale.io",                              embedUrl:null,                      tags:["Battle Royale","2D","100 Players"], defaultRating:4.1, isFeatured:false, isTrending:true,  isNew:false },
  { id:"bulletforce",  name:"Bullet Force",       category:"action",     emoji:"\uD83D\uDCA3",  description:"Realistic multiplayer FPS with custom loadouts, multiple maps, and team deathmatch modes.",       playUrl:"https://www.crazygames.com/game/bullet-force-multiplayer", embedUrl:null,                                       tags:["FPS","Realistic","Teams"],           defaultRating:4.0, isFeatured:false, isTrending:false, isNew:false },

  /* ── RACING ── */
  { id:"motox3m",      name:"Moto X3M",           category:"racing",     emoji:"\uD83C\uDFCD\uFE0F", description:"Extreme motorcycle stunts — race through obstacle courses with flips, explosions, and speed.", playUrl:"https://www.crazygames.com/game/moto-x3m",            embedUrl:null,                                          tags:["Stunts","Motorcycle","Levels"],     defaultRating:4.6, isFeatured:true,  isTrending:true,  isNew:false },
  { id:"drifthunters", name:"Drift Hunters",      category:"racing",     emoji:"\uD83D\uDE97",  description:"3D drift racing with realistic physics, 25+ cars to tune, and multiple tracks to master.",       playUrl:"https://www.crazygames.com/game/drift-hunters",       embedUrl:null,                                          tags:["Drifting","3D","Tuning"],            defaultRating:4.4, isFeatured:false, isTrending:true,  isNew:false },
  { id:"smashkarts",   name:"SmashKarts.io",      category:"racing",     emoji:"\uD83D\uDE80",  description:"Multiplayer kart battle game — collect power-ups and smash opponents in chaotic arena races.",    playUrl:"https://smashkarts.io",                               embedUrl:null,                       tags:["Kart","Power-ups","Arena"],          defaultRating:4.3, isFeatured:false, isTrending:false, isNew:false },
  { id:"driftboss",    name:"Drift Boss",         category:"racing",     emoji:"\uD83C\uDFC1",  description:"One-button drift game — time your taps perfectly to drift around an endless curvy road.",         playUrl:"https://www.crazygames.com/game/drift-boss",          embedUrl:null,                                          tags:["Endless","One-Button","Casual"],    defaultRating:4.0, isFeatured:false, isTrending:false, isNew:true  },
  { id:"racingmaster", name:"City Car Driving",   category:"racing",     emoji:"\uD83C\uDF06",  description:"Realistic city driving simulator — navigate traffic, follow rules, and explore the open city.",   playUrl:"https://www.crazygames.com/game/city-car-driving-simulator", embedUrl:null,                                   tags:["Simulator","City","Realistic"],     defaultRating:3.9, isFeatured:false, isTrending:false, isNew:false },

  /* ── PUZZLE ── */
  { id:"2048",         name:"2048",               category:"puzzle",     emoji:"\uD83D\uDD22",  description:"Slide tiles to combine matching numbers — reach the 2048 tile in this addictive math puzzle.",    playUrl:"https://play2048.co",                                 embedUrl:null,                         tags:["Number","Addictive","Classic"],     defaultRating:4.7, isFeatured:true,  isTrending:true,  isNew:false },
  { id:"wordle",       name:"Wordle",             category:"puzzle",     emoji:"\uD83D\uDFE9",  description:"Guess the 5-letter word in 6 tries — the viral daily word puzzle that took the world by storm.",  playUrl:"https://www.nytimes.com/games/wordle",                embedUrl:null,                                          tags:["Word","Daily","Viral"],              defaultRating:4.8, isFeatured:true,  isTrending:false, isNew:false },
  { id:"sudoku",       name:"Sudoku Online",      category:"puzzle",     emoji:"\uD83E\uDDE0",  description:"Classic number puzzle with multiple difficulty levels — fill the 9x9 grid with logic.",          playUrl:"https://sudoku.com",                                  embedUrl:null,                                          tags:["Logic","Numbers","Classic"],         defaultRating:4.5, isFeatured:false, isTrending:false, isNew:false },
  { id:"mahjong",      name:"Mahjong Solitaire",  category:"puzzle",     emoji:"\uD83C\uDC04",  description:"Classic tile-matching game — clear matching pairs of tiles from the board before time runs out.", playUrl:"https://www.crazygames.com/game/mahjong-solitaire",   embedUrl:null,                                          tags:["Tiles","Matching","Relaxing"],      defaultRating:4.2, isFeatured:false, isTrending:false, isNew:false },
  { id:"crossword",    name:"Daily Crossword",    category:"puzzle",     emoji:"\u270D\uFE0F",  description:"Solve a new crossword puzzle every day — test your vocabulary and general knowledge.",            playUrl:"https://www.crazygames.com/game/daily-crossword",     embedUrl:null,                                          tags:["Words","Daily","Knowledge"],        defaultRating:4.3, isFeatured:false, isTrending:false, isNew:true  },
  { id:"blockpuzzle",  name:"Block Puzzle",       category:"puzzle",     emoji:"\uD83D\uDFE6",  description:"Fit blocks into rows to clear them — a satisfying Tetris-inspired puzzle with no time limit.",    playUrl:"https://www.crazygames.com/game/block-puzzle-jewels",  embedUrl:null,                                          tags:["Blocks","Relaxing","Satisfying"],   defaultRating:4.1, isFeatured:false, isTrending:true,  isNew:false },

  /* ── ADVENTURE ── */
  { id:"minecraft-c",  name:"Minecraft Classic",  category:"adventure",  emoji:"\u26CF\uFE0F",  description:"The original Minecraft in your browser — build, explore, and create in this iconic sandbox.",    playUrl:"https://classic.minecraft.net",                       embedUrl:null,               tags:["Sandbox","Building","Classic"],     defaultRating:4.6, isFeatured:true,  isTrending:true,  isNew:false },
  { id:"littlealchemy", name:"Little Alchemy 2",  category:"adventure",  emoji:"\u2728",        description:"Combine elements to discover new ones — start from basics and create an entire universe.",       playUrl:"https://littlealchemy2.com",                          embedUrl:null,                                          tags:["Discovery","Crafting","Relaxing"],  defaultRating:4.5, isFeatured:false, isTrending:false, isNew:false },
  { id:"tombraider",   name:"Tomb of the Mask",   category:"adventure",  emoji:"\uD83C\uDFED",  description:"Retro-styled arcade adventure — navigate mazes, avoid traps, and collect dots at high speed.",   playUrl:"https://www.crazygames.com/game/tomb-of-the-mask",    embedUrl:null,                                          tags:["Retro","Maze","Speed"],             defaultRating:4.2, isFeatured:false, isTrending:false, isNew:true  },
  { id:"bobrobber",    name:"Bob the Robber",     category:"adventure",  emoji:"\uD83E\uDD77",  description:"Stealth puzzle adventure — sneak past guards, disable cameras, and steal the treasure.",         playUrl:"https://www.crazygames.com/game/bob-the-robber",      embedUrl:null,                                          tags:["Stealth","Puzzle","Story"],         defaultRating:4.1, isFeatured:false, isTrending:false, isNew:false },
  { id:"firewater",    name:"Fireboy & Watergirl",category:"adventure",  emoji:"\uD83D\uDD25",  description:"Two-player puzzle platformer — guide Fireboy and Watergirl through elemental temple puzzles.",   playUrl:"https://www.crazygames.com/game/fireboy-and-watergirl-1", embedUrl:null,                                       tags:["Co-op","Puzzle","Elements"],        defaultRating:4.4, isFeatured:false, isTrending:true,  isNew:false },

  /* ── MULTIPLAYER ── */
  { id:"slither",      name:"Slither.io",         category:"multiplayer",emoji:"\uD83D\uDC0D",  description:"Grow your snake by eating orbs — outmaneuver opponents in this massively multiplayer .io game.", playUrl:"https://slither.io",                                  embedUrl:null,                          tags:[".io","Snake","Competitive"],         defaultRating:4.4, isFeatured:true,  isTrending:true,  isNew:false },
  { id:"agar",         name:"Agar.io",            category:"multiplayer",emoji:"\uD83E\uDDA0",  description:"Start as a tiny cell and grow by eating others — the original .io game phenomenon.",              playUrl:"https://agar.io",                                    embedUrl:null,                             tags:[".io","Cell","Absorb"],               defaultRating:4.2, isFeatured:false, isTrending:false, isNew:false },
  { id:"skribbl",      name:"Skribbl.io",         category:"multiplayer",emoji:"\uD83C\uDFA8",  description:"Online Pictionary — one player draws while others guess the word in this party favorite.",       playUrl:"https://skribbl.io",                                  embedUrl:null,                                          tags:["Drawing","Guessing","Party"],       defaultRating:4.5, isFeatured:false, isTrending:true,  isNew:false },
  { id:"gartic",       name:"Gartic.io",          category:"multiplayer",emoji:"\u270F\uFE0F",  description:"Draw and guess with friends in real-time — like Skribbl with more game modes and themes.",       playUrl:"https://gartic.io",                                   embedUrl:null,                                          tags:["Drawing","Party","Social"],         defaultRating:4.3, isFeatured:false, isTrending:false, isNew:false },
  { id:"paperio",      name:"Paper.io 2",         category:"multiplayer",emoji:"\uD83D\uDCDD",  description:"Claim territory by drawing shapes — but watch out, other players can cut you off!",              playUrl:"https://paper-io.com",                                embedUrl:null,                                          tags:["Territory","Competitive","Simple"], defaultRating:4.1, isFeatured:false, isTrending:false, isNew:false },
  { id:"diep",         name:"Diep.io",            category:"multiplayer",emoji:"\uD83D\uDD35",  description:"Tank battle .io game — shoot shapes, level up, upgrade your tank, and dominate the arena.",      playUrl:"https://diep.io",                                    embedUrl:null,                             tags:[".io","Tanks","Upgrades"],            defaultRating:4.2, isFeatured:false, isTrending:false, isNew:false },

  /* ── STRATEGY ── */
  { id:"chess",        name:"Chess",              category:"strategy",   emoji:"\u265A",         description:"Play chess online against players worldwide or practice against AI with multiple difficulty levels.", playUrl:"https://www.chess.com/play/online",               embedUrl:null,                                          tags:["Classic","PvP","Ranked"],            defaultRating:4.8, isFeatured:true,  isTrending:true,  isNew:false },
  { id:"bloonsTD",     name:"Bloons TD",          category:"strategy",   emoji:"\uD83C\uDF88",  description:"Pop waves of bloons by placing monkey towers — the beloved tower defense franchise.",             playUrl:"https://www.crazygames.com/game/bloons-tower-defense", embedUrl:null,                                          tags:["Tower Defense","Monkeys","Waves"],  defaultRating:4.5, isFeatured:false, isTrending:true,  isNew:false },
  { id:"territorial",  name:"Territorial.io",     category:"strategy",   emoji:"\uD83C\uDF0D",  description:"Conquer the world map by expanding your territory — a Risk-inspired multiplayer strategy game.", playUrl:"https://territorial.io",                              embedUrl:null,                      tags:["Conquest","Maps","Multiplayer"],    defaultRating:4.3, isFeatured:false, isTrending:false, isNew:false },
  { id:"kingdomrush",  name:"Kingdom Rush",       category:"strategy",   emoji:"\uD83C\uDFF0",  description:"Epic fantasy tower defense — place towers, recruit heroes, and defend your kingdom from evil.",  playUrl:"https://www.crazygames.com/game/kingdom-rush",        embedUrl:null,                                          tags:["Tower Defense","Fantasy","Heroes"], defaultRating:4.6, isFeatured:false, isTrending:false, isNew:false },
  { id:"checkers",     name:"Checkers Online",    category:"strategy",   emoji:"\u26AA",        description:"Classic checkers — play against friends or AI with simple rules and deep strategic gameplay.",    playUrl:"https://www.crazygames.com/game/checkers-legend",     embedUrl:null,                                          tags:["Classic","Board","PvP"],             defaultRating:4.0, isFeatured:false, isTrending:false, isNew:true  },

  /* ── SPORTS ── */
  { id:"basketball",   name:"Basketball Stars",   category:"sports",     emoji:"\uD83C\uDFC0",  description:"1v1 basketball — dribble, shoot, and dunk your way to victory in this addictive sports game.",   playUrl:"https://www.crazygames.com/game/basketball-stars",    embedUrl:null,                                          tags:["Basketball","1v1","Skills"],        defaultRating:4.3, isFeatured:false, isTrending:true,  isNew:false },
  { id:"8ball",        name:"8 Ball Pool",        category:"sports",     emoji:"\uD83C\uDFB1",  description:"The world's #1 pool game — play PvP matches, aim precisely, and win tournaments.",               playUrl:"https://www.miniclip.com/games/8-ball-pool",          embedUrl:null,                                          tags:["Pool","1v1","Tournaments"],         defaultRating:4.5, isFeatured:true,  isTrending:false, isNew:false },
  { id:"penalty",      name:"Penalty Shooters 2", category:"sports",     emoji:"\u26BD",        description:"Score penalty kicks and save shots as goalkeeper — choose your team and win the cup!",            playUrl:"https://www.crazygames.com/game/penalty-shooters-2",  embedUrl:null,                                          tags:["Football","Penalties","Tournament"],defaultRating:4.1, isFeatured:false, isTrending:false, isNew:false },
  { id:"tabletennis",  name:"Table Tennis World", category:"sports",     emoji:"\uD83C\uDFD3",  description:"Fast-paced ping pong — react quickly and place your shots to defeat opponents worldwide.",       playUrl:"https://www.crazygames.com/game/table-tennis-world-tour", embedUrl:null,                                       tags:["Ping Pong","Reflexes","PvP"],      defaultRating:4.0, isFeatured:false, isTrending:false, isNew:true  },
  { id:"minigolf",     name:"Mini Golf Club",     category:"sports",     emoji:"\u26F3",        description:"Charming mini golf with creative courses — putt through obstacles and aim for hole-in-one!",     playUrl:"https://www.crazygames.com/game/mini-golf-club",      embedUrl:null,                                          tags:["Golf","Relaxing","Levels"],         defaultRating:4.2, isFeatured:false, isTrending:false, isNew:false },

  /* ── ARCADE ── */
  { id:"pacman",       name:"Pac-Man",            category:"arcade",     emoji:"\uD83D\uDFE1",  description:"The legendary arcade classic — eat dots, avoid ghosts, and clear the maze to set high scores.",  playUrl:"https://macek.github.io/google_pacman/",   embedUrl:"https://macek.github.io/google_pacman/", tags:["Classic","Maze","Retro"],      defaultRating:4.7, isFeatured:true,  isTrending:false, isNew:false },
  { id:"tetris",       name:"Tetris",             category:"arcade",     emoji:"\uD83D\uDFE8",  description:"The timeless block puzzle — rotate and stack falling tetrominoes to clear lines.",               playUrl:"https://tetris.com/play-tetris",                      embedUrl:null,                                          tags:["Blocks","Classic","Endless"],       defaultRating:4.8, isFeatured:true,  isTrending:true,  isNew:false },
  { id:"snake",        name:"Snake",              category:"arcade",     emoji:"\uD83D\uDC0D",  description:"Classic snake game — eat food, grow longer, and avoid hitting yourself or the walls.",            playUrl:"https://www.google.com/fbx?fbx=snake_arcade",        embedUrl:null,                                          tags:["Classic","Growing","Simple"],       defaultRating:4.4, isFeatured:false, isTrending:true,  isNew:false },
  { id:"flappy",       name:"Flappy Bird",        category:"arcade",     emoji:"\uD83D\uDC26",  description:"Tap to fly between pipes — the infamously addictive game that took the world by storm.",         playUrl:"https://flappybird.io",                               embedUrl:null,                                          tags:["One-Tap","Addictive","Viral"],      defaultRating:4.3, isFeatured:false, isTrending:false, isNew:false },
  { id:"doodlejump",   name:"Doodle Jump",        category:"arcade",     emoji:"\uD83D\uDC3E",  description:"Jump endlessly upward on platforms — tilt and tap to avoid monsters and reach new heights.",     playUrl:"https://www.crazygames.com/game/doodle-jump",         embedUrl:null,                                          tags:["Jumping","Endless","Classic"],      defaultRating:4.1, isFeatured:false, isTrending:false, isNew:false },
  { id:"fruitninja",   name:"Fruit Ninja",        category:"arcade",     emoji:"\uD83C\uDF49",  description:"Slice flying fruits with your finger — avoid bombs and rack up combos in this juicy arcade hit.",playUrl:"https://www.crazygames.com/game/fruit-ninja",         embedUrl:null,                                          tags:["Slicing","Combos","Mobile"],       defaultRating:4.2, isFeatured:false, isTrending:false, isNew:true  }
];

/* ── Game State ── */
let gameFilter = "all", gameSearch = "", showFavoritesOnly = false;
let currentPlayingGame = null;

/* ── LocalStorage Helpers ── */
function getGameFavorites() {
  try { return JSON.parse(localStorage.getItem("organ_game_favs")) || []; } catch(_) { return []; }
}
function saveGameFavorites(f) {
  try { localStorage.setItem("organ_game_favs", JSON.stringify(f)); } catch(_){}
}
function getRecentGames() {
  try { return JSON.parse(localStorage.getItem("organ_recent_games")) || []; } catch(_) { return []; }
}
function addRecentGame(id) {
  var r = getRecentGames().filter(function(x){ return x !== id; });
  r.unshift(id);
  if (r.length > 10) r = r.slice(0, 10);
  try { localStorage.setItem("organ_recent_games", JSON.stringify(r)); } catch(_){}
}
function getGameRatings() {
  try { return JSON.parse(localStorage.getItem("organ_game_ratings")) || {}; } catch(_) { return {}; }
}
function setGameRating(id, stars) {
  var ratings = getGameRatings();
  ratings[id] = stars;
  try { localStorage.setItem("organ_game_ratings", JSON.stringify(ratings)); } catch(_){}
}

/* ── Star Rendering ── */
function renderStars(rating) {
  var html = "", full = Math.floor(rating), half = (rating - full) >= 0.4;
  for (var i = 1; i <= 5; i++) {
    if (i <= full) html += '<span class="star star-full">\u2605</span>';
    else if (i === full + 1 && half) html += '<span class="star star-half">\u2605</span>';
    else html += '<span class="star star-empty">\u2606</span>';
  }
  return html;
}
function renderInteractiveStars(gameId) {
  var ratings = getGameRatings(), cur = ratings[gameId] || 0, html = "";
  for (var i = 1; i <= 5; i++) {
    html += '<span class="star-btn ' + (i <= cur ? 'star-btn-active' : '') + '" onclick="rateCurrentGame(' + i + ')">\u2605</span>';
  }
  return html;
}

/* ── Card Builders ── */
function buildGameCard(game, variant) {
  var el = document.createElement("article");
  var isFav = getGameFavorites().indexOf(game.id) >= 0;
  var userRating = getGameRatings()[game.id] || game.defaultRating;
  var cat = GAME_CATEGORIES[game.category] || {};

  // Category-specific high-quality looping preview videos from Mixkit CDN
  var videoUrl = "";
  if (game.category === "action") {
    videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-first-person-shooter-game-screen-close-up-41613-large.mp4";
  } else if (game.category === "racing") {
    videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-futuristic-driving-simulator-in-first-person-41662-large.mp4";
  } else if (game.category === "arcade") {
    videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-arcade-game-machine-screen-close-up-41617-large.mp4";
  } else {
    videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-gaming-setup-with-neon-lights-and-screens-43642-large.mp4";
  }

  if (variant === "featured") {
    el.className = "featured-game-card";
    el.innerHTML =
      '<div class="fg-thumb" style="background:linear-gradient(135deg,' + cat.color + '22,' + cat.color + '08)">' +
        '<span class="fg-emoji">' + game.emoji + '</span>' +
        '<video class="game-card-video" src="' + videoUrl + '" loop muted playsinline></video>' +
        '<div class="card-glow"></div>' +
        '<div class="fg-featured-badge">\u2B50 FEATURED</div>' +
      '</div>' +
      '<div class="fg-body">' +
        '<div class="fg-name">' + game.name + '</div>' +
        '<div class="fg-cat">' + (cat.emoji || "") + " " + (cat.label || game.category) + '</div>' +
        '<p class="fg-desc">' + game.description + '</p>' +
        '<div class="fg-bottom">' +
          '<div class="fg-stars">' + renderStars(userRating) + '</div>' +
          '<button class="fg-play-btn" onclick="event.stopPropagation();openGamePlayer(\'' + game.id + '\')">\u25B6 Play Now</button>' +
        '</div>' +
      '</div>' +
      '<button class="game-fav-btn ' + (isFav ? "fav-active" : "") + '" onclick="event.stopPropagation();toggleFavorite(\'' + game.id + '\')" aria-label="Favorite">' + (isFav ? "\u2764\uFE0F" : "\u2661") + '</button>';
  } else if (variant === "compact") {
    el.className = "compact-game-card";
    el.innerHTML =
      '<div class="cg-thumb" style="background:linear-gradient(135deg,' + cat.color + '22,' + cat.color + '08)">' +
        '<span class="cg-emoji">' + game.emoji + '</span>' +
      '</div>' +
      '<div class="cg-name">' + game.name + '</div>';
  } else {
    el.className = "game-card";
    el.innerHTML =
      '<div class="gc-thumb" style="background:linear-gradient(135deg,' + cat.color + '15,' + cat.color + '05)">' +
        '<span class="gc-emoji">' + game.emoji + '</span>' +
        '<video class="game-card-video" src="' + videoUrl + '" loop muted playsinline></video>' +
        '<div class="card-glow"></div>' +
        '<span class="gc-cat-badge" style="border-color:' + cat.color + '40;color:' + cat.color + '">' + (cat.label || "") + '</span>' +
        '<button class="game-fav-btn ' + (isFav ? "fav-active" : "") + '" onclick="event.stopPropagation();toggleFavorite(\'' + game.id + '\')" aria-label="Favorite">' + (isFav ? "\u2764\uFE0F" : "\u2661") + '</button>' +
      '</div>' +
      '<div class="gc-body">' +
        '<div class="gc-name">' + game.name + '</div>' +
        '<p class="gc-desc">' + game.description + '</p>' +
        '<div class="gc-bottom">' +
          '<div class="gc-stars">' + renderStars(userRating) + '</div>' +
          '<button class="gc-play-btn" onclick="event.stopPropagation();openGamePlayer(\'' + game.id + '\')">\u25B6 Play</button>' +
        '</div>' +
      '</div>';
  }

  // Bind interactive 3D perspective tilt & video preview playback listeners
  if (variant !== "compact") {
    el.addEventListener("mouseenter", function() {
      var video = el.querySelector(".game-card-video");
      if (video) {
        // Pre-load and play the loop
        video.play().catch(function(){});
      }
    });

    el.addEventListener("mouseleave", function() {
      var video = el.querySelector(".game-card-video");
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      el.style.transform = "";
      var glow = el.querySelector(".card-glow");
      if (glow) {
        glow.style.opacity = "0";
      }
    });

    el.addEventListener("mousemove", function(e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      
      // Compute mouse offsets relative to the element's center (ranging from -0.5 to 0.5)
      var xc = (x / rect.width) - 0.5;
      var yc = (y / rect.height) - 0.5;
      
      // Calculate rotation angles (up to 12 degrees max tilt)
      var rotateX = -(yc * 24);
      var rotateY = (xc * 24);
      
      el.style.transform = "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-6px)";
      
      // Shift glow spot
      var glow = el.querySelector(".card-glow");
      if (glow) {
        glow.style.opacity = "1";
        glow.style.left = x + "px";
        glow.style.top = y + "px";
      }
    });
  }

  el.addEventListener("click", function() { openGamePlayer(game.id); });
  return el;
}

/* ── Filtered list ── */
function getFilteredGames() {
  return BROWSER_GAMES.filter(function(g) {
    var s = gameSearch.toLowerCase();
    var matchCat = gameFilter === "all" || g.category === gameFilter;
    var matchSrch = !s || g.name.toLowerCase().indexOf(s) >= 0
      || g.description.toLowerCase().indexOf(s) >= 0
      || g.tags.some(function(t){ return t.toLowerCase().indexOf(s) >= 0; });
    return matchCat && matchSrch;
  });
}

/* ── Render Sections ── */
function renderGamesSection() {
  var isFiltering = gameSearch || gameFilter !== "all" || showFavoritesOnly;
  var sections = ["recently-played-section","featured-section","trending-section","new-section","all-games-section","favorites-section"];

  if (showFavoritesOnly) {
    sections.forEach(function(id){ document.getElementById(id).classList.add("hidden"); });
    document.getElementById("favorites-section").classList.remove("hidden");
    renderFavoritesGrid();
    updateGamesLabel();
    return;
  }
  if (isFiltering) {
    sections.forEach(function(id){ document.getElementById(id).classList.add("hidden"); });
    document.getElementById("all-games-section").classList.remove("hidden");
    renderAllGamesGrid();
    updateGamesLabel();
    return;
  }
  document.getElementById("all-games-section").classList.add("hidden");
  document.getElementById("favorites-section").classList.add("hidden");
  renderRecentRow();
  renderFeaturedRow();
  renderTrendingGrid();
  renderNewGrid();
  updateGamesLabel();
}

function renderRecentRow() {
  var recent = getRecentGames();
  var section = document.getElementById("recently-played-section");
  var row = document.getElementById("recently-played-row");
  if (!recent.length) { section.classList.add("hidden"); return; }
  section.classList.remove("hidden");
  row.innerHTML = "";
  var frag = document.createDocumentFragment();
  recent.forEach(function(id) {
    var g = BROWSER_GAMES.find(function(x){ return x.id === id; });
    if (g) frag.appendChild(buildGameCard(g, "compact"));
  });
  row.appendChild(frag);
}

function renderFeaturedRow() {
  var section = document.getElementById("featured-section");
  var row = document.getElementById("featured-games-row");
  var list = BROWSER_GAMES.filter(function(g){ return g.isFeatured; });
  section.classList.remove("hidden");
  row.innerHTML = "";
  var frag = document.createDocumentFragment();
  list.forEach(function(g){ frag.appendChild(buildGameCard(g, "featured")); });
  row.appendChild(frag);
}

function renderTrendingGrid() {
  var section = document.getElementById("trending-section");
  var grid = document.getElementById("trending-games-grid");
  var list = BROWSER_GAMES.filter(function(g){ return g.isTrending; });
  section.classList.remove("hidden");
  grid.innerHTML = "";
  var frag = document.createDocumentFragment();
  list.forEach(function(g, i) {
    var card = buildGameCard(g, "normal");
    card.style.animationDelay = (i * 0.035) + "s";
    frag.appendChild(card);
  });
  grid.appendChild(frag);
}

function renderNewGrid() {
  var section = document.getElementById("new-section");
  var grid = document.getElementById("new-games-grid");
  var list = BROWSER_GAMES.filter(function(g){ return g.isNew; });
  section.classList.remove("hidden");
  grid.innerHTML = "";
  var frag = document.createDocumentFragment();
  list.forEach(function(g, i) {
    var card = buildGameCard(g, "normal");
    card.style.animationDelay = (i * 0.035) + "s";
    frag.appendChild(card);
  });
  grid.appendChild(frag);
}

function renderAllGamesGrid() {
  var grid = document.getElementById("all-games-grid");
  var noRes = document.getElementById("games-no-results");
  var list = getFilteredGames();
  grid.innerHTML = "";
  if (!list.length) {
    noRes.classList.remove("hidden"); grid.style.display = "none";
  } else {
    noRes.classList.add("hidden"); grid.style.display = "";
    var frag = document.createDocumentFragment();
    list.forEach(function(g, i) {
      var card = buildGameCard(g, "normal");
      card.style.animationDelay = (i * 0.035) + "s";
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }
  var title = document.getElementById("all-games-title");
  if (gameFilter !== "all") {
    var catInfo = GAME_CATEGORIES[gameFilter];
    title.textContent = (catInfo ? catInfo.emoji + " " + catInfo.label : "") + " Games";
  } else {
    title.textContent = gameSearch ? 'Search: "' + gameSearch + '"' : "All Games";
  }
}

function renderFavoritesGrid() {
  var grid = document.getElementById("favorites-grid");
  var noFavs = document.getElementById("games-no-favorites");
  var favIds = getGameFavorites();
  var list = BROWSER_GAMES.filter(function(g){ return favIds.indexOf(g.id) >= 0; });
  grid.innerHTML = "";
  if (!list.length) {
    noFavs.classList.remove("hidden"); grid.style.display = "none";
  } else {
    noFavs.classList.add("hidden"); grid.style.display = "";
    var frag = document.createDocumentFragment();
    list.forEach(function(g, i) {
      var card = buildGameCard(g, "normal");
      card.style.animationDelay = (i * 0.035) + "s";
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }
}

function updateGamesLabel() {
  var lbl = document.getElementById("games-results-label");
  if (showFavoritesOnly) {
    var c = getGameFavorites().length;
    lbl.textContent = c + " favorite game" + (c !== 1 ? "s" : "");
  } else if (gameSearch || gameFilter !== "all") {
    var f = getFilteredGames();
    lbl.textContent = "Showing " + f.length + " of " + BROWSER_GAMES.length + " games";
  } else {
    lbl.textContent = BROWSER_GAMES.length + " free games available";
  }
  var sc = document.getElementById("games-search-count");
  sc.textContent = gameSearch ? getFilteredGames().length + " found" : "";
}

/* ── Favorites ── */
function toggleFavorite(gameId) {
  var favs = getGameFavorites();
  var idx = favs.indexOf(gameId);
  if (idx >= 0) favs.splice(idx, 1); else favs.push(gameId);
  saveGameFavorites(favs);
  renderGamesSection();
  if (currentPlayingGame && currentPlayingGame.id === gameId) updatePlayerFavBtn();
}
function toggleFavoritesView() {
  showFavoritesOnly = !showFavoritesOnly;
  var btn = document.getElementById("fav-toggle-btn");
  var icon = document.getElementById("fav-toggle-icon");
  if (showFavoritesOnly) {
    btn.classList.add("fav-toggle-active"); icon.textContent = "\u2764\uFE0F";
  } else {
    btn.classList.remove("fav-toggle-active"); icon.textContent = "\u2661";
  }
  renderGamesSection();
}
function toggleFavoriteFromPlayer() {
  if (!currentPlayingGame) return;
  toggleFavorite(currentPlayingGame.id);
}
function updatePlayerFavBtn() {
  if (!currentPlayingGame) return;
  var isFav = getGameFavorites().indexOf(currentPlayingGame.id) >= 0;
  document.getElementById("gp-fav-icon").textContent = isFav ? "\u2764\uFE0F" : "\u2661";
  var btn = document.getElementById("gp-fav-btn");
  if (isFav) btn.classList.add("fav-active"); else btn.classList.remove("fav-active");
}

/* ── Game Player ── */
function openGamePlayer(gameId) {
  var game = BROWSER_GAMES.find(function(g){ return g.id === gameId; });
  if (!game) return;
  currentPlayingGame = game;
  addRecentGame(gameId);

  document.getElementById("game-player-emoji").textContent = game.emoji;
  document.getElementById("game-player-title").textContent = game.name;
  var cat = GAME_CATEGORIES[game.category] || {};
  document.getElementById("game-player-category").textContent = (cat.emoji || "") + " " + (cat.label || game.category);

  var iframe = document.getElementById("game-iframe");
  var loading = document.getElementById("game-loading");

  if (game.embedUrl) {
    iframe.style.display = "";
    loading.classList.remove("hidden");
    loading.innerHTML = '<div class="game-loading-spinner"></div><p>Loading game\u2026</p>';
    iframe.onload = function() { loading.classList.add("hidden"); };
    iframe.src = game.embedUrl;
  } else {
    iframe.style.display = "none"; iframe.src = "";
    loading.classList.remove("hidden");
    loading.innerHTML =
      '<div class="game-no-embed">' +
        '<span style="font-size:4rem">' + game.emoji + '</span>' +
        '<h3>' + game.name + '</h3>' +
        '<p>This game opens on its official website.</p>' +
        '<a href="' + game.playUrl + '" target="_blank" rel="noopener noreferrer" class="gc-play-btn" style="padding:12px 28px;font-size:1rem;text-decoration:none;display:inline-flex">\u25B6 Play on Site</a>' +
      '</div>';
  }

  document.getElementById("game-player-rating").innerHTML = renderInteractiveStars(gameId);
  updatePlayerFavBtn();
  document.getElementById("gp-site-link").href = game.playUrl;
  document.getElementById("game-player-modal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeGamePlayer() {
  document.getElementById("game-iframe").src = "";
  document.getElementById("game-player-modal").classList.add("hidden");
  document.body.style.overflow = "";
  currentPlayingGame = null;
  renderGamesSection();
}

function toggleGameFullscreen() {
  var wrap = document.getElementById("game-frame-wrap");
  if (document.fullscreenElement) { document.exitFullscreen(); }
  else { wrap.requestFullscreen().catch(function(){}); }
}

function rateCurrentGame(stars) {
  if (!currentPlayingGame) return;
  setGameRating(currentPlayingGame.id, stars);
  document.getElementById("game-player-rating").innerHTML = renderInteractiveStars(currentPlayingGame.id);
}

/* Close game player on Escape */
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape" && currentPlayingGame) closeGamePlayer();
});

/* ── Game Search & Filter Bindings ── */
document.getElementById("games-search-input").addEventListener("input", function(e) {
  gameSearch = e.target.value.trim();
  showFavoritesOnly = false;
  document.getElementById("fav-toggle-btn").classList.remove("fav-toggle-active");
  document.getElementById("fav-toggle-icon").textContent = "\u2661";
  renderGamesSection();
});

document.querySelectorAll("[data-game-filter]").forEach(function(pill) {
  pill.addEventListener("click", function() {
    document.querySelectorAll("[data-game-filter]").forEach(function(p) {
      p.classList.remove("active"); p.setAttribute("aria-selected", "false");
    });
    pill.classList.add("active"); pill.setAttribute("aria-selected", "true");
    gameFilter = pill.dataset.gameFilter;
    showFavoritesOnly = false;
    document.getElementById("fav-toggle-btn").classList.remove("fav-toggle-active");
    document.getElementById("fav-toggle-icon").textContent = "\u2661";
    renderGamesSection();
  });
});

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
    response: "{\n  \"status\": \"success\",\n  \"count\": 40,\n  \"tools\": [\n    {\n      \"id\": \"chatgpt\",\n      \"name\": \"ChatGPT\",\n      \"category\": \"text\",\n      \"pricing\": \"Freemium\",\n      \"rating\": 4.8\n    },\n    {\n      \"id\": \"claude\",\n      \"name\": \"Claude\",\n      \"category\": \"text\",\n      \"pricing\": \"Freemium\",\n      \"rating\": 4.9\n    }\n  ]\n}"
  },
  "games-endpoint": {
    curl: "curl -X GET \"https://api.organai.io/v1/games\" \\\n  -H \"Authorization: Bearer YOUR_API_KEY\"",
    js: "fetch('https://api.organai.io/v1/games', {\n  headers: {\n    'Authorization': 'Bearer YOUR_API_KEY'\n  }\n})\n.then(res => res.json())\n.then(data => console.log(data));",
    py: "import requests\n\nurl = 'https://api.organai.io/v1/games'\nheaders = {'Authorization': 'Bearer YOUR_API_KEY'}\n\nresponse = requests.get(url, headers=headers)\nprint(response.json())",
    response: "{\n  \"status\": \"success\",\n  \"count\": 44,\n  \"games\": [\n    {\n      \"id\": \"pacman\",\n      \"name\": \"Pac-Man\",\n      \"category\": \"arcade\",\n      \"rating\": 4.7,\n      \"featured\": true\n    },\n    {\n      \"id\": \"krunker\",\n      \"name\": \"Krunker.io\",\n      \"category\": \"action\",\n      \"rating\": 4.5,\n      \"featured\": true\n    }\n  ]\n}"
  },
  "rate-endpoint": {
    curl: "curl -X POST \"https://api.organai.io/v1/rate\" \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"gameId\": \"pacman\", \"rating\": 5}'",
    js: "fetch('https://api.organai.io/v1/rate', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer YOUR_API_KEY',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    gameId: 'pacman',\n    rating: 5\n  })\n})\n.then(res => res.json())\n.then(data => console.log(data));",
    py: "import requests\n\nurl = 'https://api.organai.io/v1/rate'\nheaders = {\n    'Authorization': 'Bearer YOUR_API_KEY',\n    'Content-Type': 'application/json'\n}\ndata = {\n    'gameId': 'pacman',\n    'rating': 5\n}\n\nresponse = requests.post(url, headers=headers, json=data)\nprint(response.json())",
    response: "{\n  \"status\": \"success\",\n  \"message\": \"Rating submitted successfully!\",\n  \"data\": {\n    \"gameId\": \"pacman\",\n    \"userRating\": 5,\n    \"newAverage\": 4.75\n  }\n}"
  }
};

function updateApiCode() {
  var tpl = API_TEMPLATES[currentApiEndpoint];
  if (!tpl) return;
  document.getElementById("api-code-display").textContent = tpl[currentApiLang];
  document.getElementById("api-response-display").textContent = tpl.response;
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
          "<p>By applying <code>transform-style: preserve-3d</code> to the card, and translating child elements (like game badges or emojis) along the Z-axis (<code>transform: translateZ(30px)</code>), we create a parallax effect. When the mouse moves, the card rotates along the X and Y axes, making the inner elements pop off the screen.</p>" +
          "<p>Applying these micro-interactions increases click-through rates by up to 40% because users feel a sense of play and control just by hovering over the page.</p>"
  },
  "html5-gaming": {
    title: "HTML5 Game Development in 2026: Canvas vs WebGL",
    tag: "Game Dev",
    tagClass: "tag-gaming",
    time: "6 min read",
    author: "Leo Martinez",
    avatar: "👨‍🚀",
    date: "June 21, 2026",
    body: "<p>Browser-playable games are experiencing a massive renaissance. With the decline of native app store installs, developers are returning to the web to offer instant, frictionless access. But when building high-performance browser games in 2026, developers face a core architectural choice: Canvas API or WebGL/WebGPU?</p>" +
          "<h4>WebGL: The 3D and Particle Powerhouse</h4>" +
          "<p>If your game involves millions of dynamic particles, complex lighting shaders, or full 3D models (like <em>Krunker.io</em> or <em>Shell Shockers</em>), WebGL is mandatory. It runs directly on the GPU, yielding extremely high frame rates (60-120 FPS) and low cpu cycles. The drawbacks are larger bundle sizes (due to importing math matrices or engine files) and stricter device capability rules.</p>" +
          "<h4>Canvas API: Lightweight and Retro-Friendly</h4>" +
          "<p>For 2D classics, block puzzles, or retro physics (like <em>Pac-Man</em>, <em>2048</em>, or <em>Snake</em>), the Canvas 2D Context remains the king. It requires zero engine downloads, has a flat learning curve, and is supported by 100% of mobile and desktop browsers. It compiles rapidly, loading your game in milliseconds.</p>" +
          "<h4>Embedding and Sandbox Security</h4>" +
          "<p>When hosting these games on aggregators like ORGAN AI, security is a major hurdle. To protect our users, we run all embeds inside sandboxed iframes:</p>" +
          "<pre><code>sandbox=\"allow-scripts allow-same-origin allow-popups\"</code></pre>" +
          "<p>This prevents embedded scripts from accessing parent cookies, blocking pop-up redirections, and securing a safe, seamless gaming loop for our audience.</p>"
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
render();
renderGamesSection();
updateApiCode();


