import { PrismaClient, Pricing, ToolKind, Difficulty } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ---------------------------------------------------------------- categories

const categories = [
  { slug: "writing", name: "Writing", icon: "pen", accent: "violet", description: "Drafting, editing and rewriting text of every kind." },
  { slug: "image", name: "Image", icon: "image", accent: "cyan", description: "Generating, editing and cleaning up visual assets." },
  { slug: "video", name: "Video", icon: "video", accent: "rose", description: "Producing, editing, dubbing and repurposing footage." },
  { slug: "audio", name: "Audio", icon: "waveform", accent: "amber", description: "Speech, music, transcription and sound design." },
  { slug: "code", name: "Code", icon: "terminal", accent: "emerald", description: "Writing, reviewing, testing and shipping software." },
  { slug: "business", name: "Business", icon: "briefcase", accent: "default", description: "Sales, marketing, support and operations work." },
  { slug: "research", name: "Research", icon: "search", accent: "violet", description: "Finding, reading and summarising source material." },
  { slug: "productivity", name: "Productivity", icon: "zap", accent: "cyan", description: "Meetings, scheduling, notes and everyday admin." },
];

// --------------------------------------------------------------------- tools

type SeedTool = {
  slug: string; name: string; tagline: string; url: string;
  pricing: Pricing; kind: ToolKind; platforms: string[]; rating: number;
};

const tools: SeedTool[] = [
  { slug: "chatgpt", name: "ChatGPT", tagline: "General-purpose assistant with browsing, files and voice.", url: "https://chat.openai.com", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web", "iOS", "Android", "macOS"], rating: 4.8 },
  { slug: "claude", name: "Claude", tagline: "Assistant tuned for long documents and careful reasoning.", url: "https://claude.ai", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web", "iOS", "Android", "macOS"], rating: 4.8 },
  { slug: "gemini", name: "Gemini", tagline: "Google's assistant, wired into Workspace and Search.", url: "https://gemini.google.com", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web", "Android", "iOS"], rating: 4.5 },
  { slug: "perplexity", name: "Perplexity", tagline: "Answer engine that cites its sources as it writes.", url: "https://perplexity.ai", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web", "iOS", "Android"], rating: 4.6 },
  { slug: "midjourney", name: "Midjourney", tagline: "Image generator known for stylised, painterly output.", url: "https://midjourney.com", pricing: Pricing.PAID, kind: ToolKind.TOOL, platforms: ["Web", "Discord"], rating: 4.7 },
  { slug: "dall-e", name: "DALL·E", tagline: "Text-to-image generation built into ChatGPT.", url: "https://openai.com/dall-e", pricing: Pricing.FREEMIUM, kind: ToolKind.MODEL, platforms: ["Web", "API"], rating: 4.3 },
  { slug: "stable-diffusion", name: "Stable Diffusion", tagline: "Open-weight image model you can run locally.", url: "https://stability.ai", pricing: Pricing.FREE, kind: ToolKind.MODEL, platforms: ["Web", "Desktop", "API"], rating: 4.4 },
  { slug: "flux", name: "Flux", tagline: "Image model with unusually reliable text rendering.", url: "https://blackforestlabs.ai", pricing: Pricing.FREEMIUM, kind: ToolKind.MODEL, platforms: ["Web", "API"], rating: 4.6 },
  { slug: "canva", name: "Canva", tagline: "Design editor with AI generation and background removal.", url: "https://canva.com", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web", "iOS", "Android"], rating: 4.5 },
  { slug: "photoroom", name: "PhotoRoom", tagline: "Product photo editor built around instant cutouts.", url: "https://photoroom.com", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web", "iOS", "Android"], rating: 4.4 },
  { slug: "remove-bg", name: "remove.bg", tagline: "One-click background removal with an API.", url: "https://remove.bg", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web", "API"], rating: 4.3 },
  { slug: "magnific", name: "Magnific", tagline: "Upscaler that invents plausible detail as it enlarges.", url: "https://magnific.ai", pricing: Pricing.PAID, kind: ToolKind.TOOL, platforms: ["Web"], rating: 4.5 },
  { slug: "runway", name: "Runway", tagline: "Video generation and editing suite for filmmakers.", url: "https://runwayml.com", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web"], rating: 4.6 },
  { slug: "sora", name: "Sora", tagline: "Text-to-video model producing long, coherent shots.", url: "https://openai.com/sora", pricing: Pricing.PAID, kind: ToolKind.MODEL, platforms: ["Web"], rating: 4.5 },
  { slug: "pika", name: "Pika", tagline: "Fast video generation aimed at social formats.", url: "https://pika.art", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web", "Discord"], rating: 4.2 },
  { slug: "heygen", name: "HeyGen", tagline: "Avatar video and translation with lip sync.", url: "https://heygen.com", pricing: Pricing.PAID, kind: ToolKind.TOOL, platforms: ["Web"], rating: 4.5 },
  { slug: "descript", name: "Descript", tagline: "Edit video and podcasts by editing the transcript.", url: "https://descript.com", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web", "macOS", "Windows"], rating: 4.6 },
  { slug: "opus-clip", name: "OpusClip", tagline: "Turns long video into vertical clips automatically.", url: "https://opus.pro", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web"], rating: 4.3 },
  { slug: "elevenlabs", name: "ElevenLabs", tagline: "Speech synthesis and voice cloning in 30+ languages.", url: "https://elevenlabs.io", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web", "API"], rating: 4.8 },
  { slug: "whisper", name: "Whisper", tagline: "Open-weight speech recognition model from OpenAI.", url: "https://openai.com/research/whisper", pricing: Pricing.FREE, kind: ToolKind.MODEL, platforms: ["API", "Desktop"], rating: 4.7 },
  { slug: "otter", name: "Otter.ai", tagline: "Live meeting transcription with speaker labels.", url: "https://otter.ai", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web", "iOS", "Android"], rating: 4.2 },
  { slug: "suno", name: "Suno", tagline: "Generates full songs with vocals from a prompt.", url: "https://suno.com", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web", "iOS"], rating: 4.5 },
  { slug: "adobe-podcast", name: "Adobe Podcast", tagline: "Makes rough voice recordings sound studio-clean.", url: "https://podcast.adobe.com", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web"], rating: 4.4 },
  { slug: "github-copilot", name: "GitHub Copilot", tagline: "Inline code completion and chat inside the editor.", url: "https://github.com/features/copilot", pricing: Pricing.PAID, kind: ToolKind.TOOL, platforms: ["VS Code", "JetBrains", "Neovim"], rating: 4.6 },
  { slug: "cursor", name: "Cursor", tagline: "Editor built around whole-codebase AI edits.", url: "https://cursor.com", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["macOS", "Windows", "Linux"], rating: 4.7 },
  { slug: "claude-code", name: "Claude Code", tagline: "Agentic coding from the terminal or desktop.", url: "https://claude.com/product/claude-code", pricing: Pricing.PAID, kind: ToolKind.AGENT, platforms: ["macOS", "Linux", "Windows"], rating: 4.7 },
  { slug: "v0", name: "v0", tagline: "Generates React and Tailwind UI from a description.", url: "https://v0.dev", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web"], rating: 4.4 },
  { slug: "codium", name: "Qodo", tagline: "Generates and reviews tests against your diff.", url: "https://qodo.ai", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["VS Code", "JetBrains"], rating: 4.1 },
  { slug: "notion-ai", name: "Notion AI", tagline: "Writing and Q&A across your workspace pages.", url: "https://notion.so/product/ai", pricing: Pricing.PAID, kind: ToolKind.TOOL, platforms: ["Web", "macOS", "iOS", "Android"], rating: 4.3 },
  { slug: "grammarly", name: "Grammarly", tagline: "Grammar, clarity and tone suggestions as you type.", url: "https://grammarly.com", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web", "Chrome", "Windows", "macOS"], rating: 4.4 },
  { slug: "jasper", name: "Jasper", tagline: "Marketing copy generation with brand voice controls.", url: "https://jasper.ai", pricing: Pricing.PAID, kind: ToolKind.TOOL, platforms: ["Web", "Chrome"], rating: 4.0 },
  { slug: "copy-ai", name: "Copy.ai", tagline: "Go-to-market copy and outbound sequences.", url: "https://copy.ai", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web"], rating: 4.0 },
  { slug: "quillbot", name: "QuillBot", tagline: "Paraphrasing and summarising with tone presets.", url: "https://quillbot.com", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web", "Chrome"], rating: 4.2 },
  { slug: "deepl", name: "DeepL", tagline: "Translation that reads noticeably more natural.", url: "https://deepl.com", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web", "Windows", "macOS", "API"], rating: 4.7 },
  { slug: "elicit", name: "Elicit", tagline: "Finds and extracts data from academic papers.", url: "https://elicit.com", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web"], rating: 4.4 },
  { slug: "consensus", name: "Consensus", tagline: "Answers research questions from peer-reviewed work.", url: "https://consensus.app", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web"], rating: 4.3 },
  { slug: "scispace", name: "SciSpace", tagline: "Explains dense papers paragraph by paragraph.", url: "https://typeset.io", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web"], rating: 4.1 },
  { slug: "napkin", name: "Napkin", tagline: "Turns written text into editable diagrams.", url: "https://napkin.ai", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web"], rating: 4.2 },
  { slug: "gamma", name: "Gamma", tagline: "Generates decks and docs that stay easy to edit.", url: "https://gamma.app", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web"], rating: 4.5 },
  { slug: "tome", name: "Tome", tagline: "Narrative-first presentation builder.", url: "https://tome.app", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web"], rating: 3.9 },
  { slug: "fathom", name: "Fathom", tagline: "Records calls and writes the follow-up for you.", url: "https://fathom.video", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web", "Zoom", "Meet"], rating: 4.6 },
  { slug: "granola", name: "Granola", tagline: "Meeting notes that merge your typing with the audio.", url: "https://granola.ai", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["macOS"], rating: 4.6 },
  { slug: "reclaim", name: "Reclaim", tagline: "Defends focus time by rearranging your calendar.", url: "https://reclaim.ai", pricing: Pricing.FREEMIUM, kind: ToolKind.TOOL, platforms: ["Web", "Google Calendar"], rating: 4.4 },
  { slug: "superhuman", name: "Superhuman", tagline: "Email client with AI triage and drafting.", url: "https://superhuman.com", pricing: Pricing.PAID, kind: ToolKind.TOOL, platforms: ["Web", "macOS", "iOS", "Android"], rating: 4.5 },
  { slug: "clay", name: "Clay", tagline: "Enriches lead lists and drafts outbound at scale.", url: "https://clay.com", pricing: Pricing.PAID, kind: ToolKind.TOOL, platforms: ["Web"], rating: 4.5 },
  { slug: "intercom-fin", name: "Fin by Intercom", tagline: "Support agent that answers from your help centre.", url: "https://intercom.com/fin", pricing: Pricing.ENTERPRISE, kind: ToolKind.AGENT, platforms: ["Web"], rating: 4.4 },
  { slug: "hebbia", name: "Hebbia", tagline: "Document analysis across very large private corpora.", url: "https://hebbia.ai", pricing: Pricing.ENTERPRISE, kind: ToolKind.TOOL, platforms: ["Web"], rating: 4.2 },
  { slug: "rabbit-r1", name: "Rabbit R1", tagline: "Pocket device that drives apps on your behalf.", url: "https://rabbit.tech", pricing: Pricing.PAID, kind: ToolKind.DEVICE, platforms: ["Hardware"], rating: 3.2 },
];

// --------------------------------------------------------------------- tasks

type SeedTask = {
  slug: string; name: string; summary: string; description: string;
  icon: string; category: string; difficulty: Difficulty;
  trending?: boolean; featured?: boolean;
  views: number;
  tools: Array<[string, number, string?]>; // [toolSlug, upvotes, note]
  faqs?: Array<[string, string]>;
};

const tasks: SeedTask[] = [
  {
    slug: "write-a-blog-post", name: "Write a blog post", icon: "pen",
    summary: "Go from an outline to a publishable draft in one sitting.",
    description: "Long-form writing is the task most people try first, and the one where tool choice matters least — every general assistant can produce a competent draft. What separates the options is how well they hold a brief across 1,500 words, whether they can pull in current sources, and how much editing the output needs before it sounds like you.",
    category: "writing", difficulty: Difficulty.EASY, featured: true, views: 48200,
    tools: [["claude", 412, "Holds a style guide across long drafts better than most."], ["chatgpt", 388], ["jasper", 194, "Brand voice settings pay off once you've written a few posts."], ["notion-ai", 141], ["perplexity", 96, "Best used first, for sourcing, then draft elsewhere."]],
    faqs: [
      ["Will editors be able to tell it was drafted with AI?", "If you publish the first output, usually yes — the giveaways are even paragraph lengths, hedged claims and a summary conclusion. Rewriting the opening and closing in your own voice removes most of it."],
      ["Does AI-assisted content hurt search ranking?", "Google's guidance targets low-value content regardless of how it was produced. Thin, unedited output ranks badly; well-edited content with original reporting does not lose ranking for having been drafted with a tool."],
    ],
  },
  {
    slug: "rewrite-text-in-a-different-tone", name: "Rewrite text in a different tone", icon: "repeat",
    summary: "Shift a draft from formal to casual, or blunt to diplomatic.",
    description: "Tone rewriting is narrow enough that dedicated tools compete well with the big assistants. The practical difference is whether the tool preserves your specific facts and names while changing register, or quietly paraphrases the meaning away.",
    category: "writing", difficulty: Difficulty.EASY, views: 21400,
    tools: [["chatgpt", 231], ["quillbot", 188, "Tone presets are faster than writing a prompt each time."], ["grammarly", 176], ["claude", 154]],
  },
  {
    slug: "translate-a-document", name: "Translate a document", icon: "languages",
    summary: "Translate files while keeping formatting and terminology intact.",
    description: "Document translation differs from sentence translation in one way that matters: layout. A tool that returns clean prose but destroys your table structure has moved the work rather than done it.",
    category: "writing", difficulty: Difficulty.EASY, trending: true, views: 33900,
    tools: [["deepl", 502, "Keeps .docx and .pdf layout intact, which is the hard part."], ["chatgpt", 219], ["gemini", 143], ["claude", 132]],
  },
  {
    slug: "summarize-a-long-document", name: "Summarize a long document", icon: "file-text",
    summary: "Compress reports, contracts and transcripts without losing the load-bearing details.",
    description: "Summarisation quality is mostly a context-window question. Below the limit, results are similar across tools; above it, the tool starts sampling and the summary quietly becomes unreliable — usually without telling you.",
    category: "writing", difficulty: Difficulty.EASY, featured: true, views: 41100,
    tools: [["claude", 468, "Long context makes it the safe default for 100-page files."], ["chatgpt", 310], ["scispace", 88], ["quillbot", 71], ["hebbia", 54, "Overkill unless you're searching thousands of documents."]],
    faqs: [["How do I know the summary didn't miss something?", "Ask for the summary and a list of section headings it covered, then check the headings against the original. Gaps in the heading list are where detail was dropped."]],
  },
  {
    slug: "generate-images-from-text", name: "Generate images from text", icon: "image",
    summary: "Turn a written description into original artwork or photography.",
    description: "The gap between image models is now mostly stylistic rather than technical. Pick based on the look you want and how much prompt control you need — some models reward long, specific prompts, others fight them.",
    category: "image", difficulty: Difficulty.EASY, trending: true, featured: true, views: 62800,
    tools: [["midjourney", 741, "Strongest default aesthetic; least literal about your prompt."], ["flux", 512, "The one to use when the image contains readable text."], ["dall-e", 398], ["stable-diffusion", 356, "Only real option if you need to run it locally."], ["canva", 162]],
    faqs: [
      ["Can I use generated images commercially?", "It depends on the tool's terms, not on copyright law alone. Paid tiers of most generators grant commercial use; free tiers often do not. Check the specific plan you're on."],
      ["Why does the text in my image come out garbled?", "Most diffusion models treat letterforms as texture rather than symbols. Models trained specifically on text rendering handle short strings reliably, but long paragraphs still fail — add text afterwards in a design tool."],
    ],
  },
  {
    slug: "remove-image-background", name: "Remove an image background", icon: "scissors",
    summary: "Cut a subject out cleanly, including hair and semi-transparent edges.",
    description: "Background removal is effectively solved for simple subjects. The remaining difficulty is hair, glass, motion blur and shadow — which is where the dedicated tools still beat the general-purpose editors.",
    category: "image", difficulty: Difficulty.EASY, views: 29600,
    tools: [["remove-bg", 344, "Best edge quality on hair; has a clean API for batch work."], ["photoroom", 287, "Better if you also need to restage the product afterwards."], ["canva", 201]],
  },
  {
    slug: "upscale-and-restore-photos", name: "Upscale and restore photos", icon: "maximize",
    summary: "Enlarge small or damaged images without the result looking smeared.",
    description: "Upscalers invent detail that was never captured. That is fine for a hero image and a problem for anything evidential — faces and text can change in ways that look plausible but are not accurate to the original.",
    category: "image", difficulty: Difficulty.MODERATE, views: 18700,
    tools: [["magnific", 296, "Aggressive detail invention; dial it down for faces."], ["stable-diffusion", 134], ["photoroom", 78]],
  },
  {
    slug: "design-a-social-media-post", name: "Design a social media post", icon: "layout",
    summary: "Produce on-brand graphics sized for each platform.",
    description: "This task is less about generation and more about templating: the win comes from a tool that knows the aspect ratios, holds your brand colours, and exports every size at once.",
    category: "image", difficulty: Difficulty.EASY, views: 25300,
    tools: [["canva", 421], ["photoroom", 112], ["midjourney", 98, "For the background art; compose the post elsewhere."]],
  },
  {
    slug: "generate-video-from-text", name: "Generate video from text", icon: "video",
    summary: "Create original footage from a written scene description.",
    description: "Text-to-video is the least mature task on this list. Shot length, character consistency and physical plausibility are all still limiting — expect to generate many takes and cut around the failures.",
    category: "video", difficulty: Difficulty.ADVANCED, trending: true, views: 51200,
    tools: [["sora", 587, "Longest coherent shots; hardest to get access to."], ["runway", 463, "Best if you need to edit and grade in the same place."], ["pika", 231]],
    faqs: [["How long can a generated clip be?", "Most models produce a few seconds to about a minute per generation, and quality degrades toward the end. Longer sequences are assembled from multiple generations in an editor."]],
  },
  {
    slug: "edit-video-by-editing-text", name: "Edit video by editing text", icon: "type",
    summary: "Cut footage by deleting words from the transcript.",
    description: "Transcript-based editing is the single largest time saving available to anyone who edits talking-head video. Removing filler words and false starts becomes a find-and-replace rather than a timeline operation.",
    category: "video", difficulty: Difficulty.EASY, featured: true, views: 34800,
    tools: [["descript", 612, "The tool that invented the workflow and still does it best."], ["runway", 178], ["opus-clip", 121]],
  },
  {
    slug: "turn-long-video-into-short-clips", name: "Turn long video into short clips", icon: "crop",
    summary: "Find the moments worth clipping and reframe them vertically.",
    description: "Clipping tools score every moment for likely engagement and then reframe to 9:16 with speaker tracking. The scoring is the weak link — treat the ranking as a shortlist to review, not a decision.",
    category: "video", difficulty: Difficulty.EASY, trending: true, views: 27900,
    tools: [["opus-clip", 398], ["descript", 203], ["runway", 94]],
  },
  {
    slug: "dub-video-into-another-language", name: "Dub video into another language", icon: "globe",
    summary: "Translate speech and match it to the speaker's mouth.",
    description: "Dubbing combines three separately imperfect steps: transcription, translation and voice synthesis. Errors compound, so the review pass matters more here than on any other video task.",
    category: "video", difficulty: Difficulty.MODERATE, views: 19400,
    tools: [["heygen", 341, "Lip sync is the differentiator; the translation is average."], ["elevenlabs", 289, "Better voices, no lip sync."], ["descript", 87]],
  },
  {
    slug: "transcribe-audio", name: "Transcribe audio", icon: "file-audio",
    summary: "Turn recordings into accurate, speaker-labelled text.",
    description: "Accuracy on clean single-speaker audio is close to solved. What still varies is diarisation, handling of accents and domain vocabulary, and whether the tool can run on your own hardware for confidential recordings.",
    category: "audio", difficulty: Difficulty.EASY, views: 38100,
    tools: [["whisper", 519, "Free and runs locally, which matters for sensitive audio."], ["otter", 312], ["descript", 244], ["fathom", 130]],
    faqs: [["Can I transcribe confidential recordings?", "Only with a tool that processes locally, or one whose terms commit to not retaining or training on your audio. Running an open-weight model on your own machine avoids the question entirely."]],
  },
  {
    slug: "clone-a-voice", name: "Clone a voice", icon: "mic",
    summary: "Build a synthetic voice from a short sample.",
    description: "Voice cloning needs less source audio than most people expect, which is exactly why consent handling matters. Reputable tools require verification before cloning a voice that isn't yours.",
    category: "audio", difficulty: Difficulty.MODERATE, views: 23700,
    tools: [["elevenlabs", 578, "Quality leader; verification required for real voices."], ["heygen", 142], ["descript", 118]],
  },
  {
    slug: "clean-up-a-voice-recording", name: "Clean up a voice recording", icon: "waveform",
    summary: "Remove room echo and background noise from spoken audio.",
    description: "Speech enhancement can rescue a recording made in a bad room, but it works by resynthesising rather than filtering — push it too far and the voice starts sounding artificial.",
    category: "audio", difficulty: Difficulty.EASY, views: 16200,
    tools: [["adobe-podcast", 367, "Free, and better than most paid plugins."], ["descript", 189]],
  },
  {
    slug: "generate-music", name: "Generate music", icon: "music",
    summary: "Produce original tracks, including vocals, from a prompt.",
    description: "Music generation is good enough for background beds and rough demos. It is not yet reliable for anything where a specific arrangement is required — you steer it, you don't direct it.",
    category: "audio", difficulty: Difficulty.MODERATE, trending: true, views: 30500,
    tools: [["suno", 492]],
  },
  {
    slug: "write-code-from-a-description", name: "Write code from a description", icon: "terminal",
    summary: "Get working implementations from a plain-language spec.",
    description: "Generation quality is high for well-trodden problems and drops sharply for anything involving your own codebase's conventions. Tools that read the whole repository before writing produce noticeably less rework.",
    category: "code", difficulty: Difficulty.EASY, featured: true, views: 57400,
    tools: [["cursor", 604, "Repository-wide context is what makes the edits land."], ["claude-code", 571], ["github-copilot", 488], ["chatgpt", 302], ["v0", 197, "Narrow, but the fastest route to a working UI."]],
    faqs: [["Should I let it write code I don't understand?", "Only in throwaway contexts. In anything you'll maintain, code you can't explain is code you can't debug at 2am — review it as you would a pull request from a new hire."]],
  },
  {
    slug: "review-a-pull-request", name: "Review a pull request", icon: "git-pull-request",
    summary: "Catch bugs, regressions and missing tests before a human reviewer does.",
    description: "Automated review is best treated as a first pass that clears the mechanical objections — unhandled errors, missing null checks, untested branches — so human reviewers can spend their attention on design.",
    category: "code", difficulty: Difficulty.MODERATE, views: 22800,
    tools: [["github-copilot", 287], ["codium", 213, "Test-gap detection is the strongest part."], ["claude-code", 198], ["cursor", 156]],
  },
  {
    slug: "write-unit-tests", name: "Write unit tests", icon: "check-circle",
    summary: "Generate test cases covering the paths you didn't think of.",
    description: "Generated tests are best at breadth and worst at judgement: they will cover every branch and still miss the one business rule that actually matters. Use them to find gaps, then write the important assertions yourself.",
    category: "code", difficulty: Difficulty.EASY, views: 20100,
    tools: [["codium", 298], ["cursor", 221], ["github-copilot", 205], ["claude-code", 167]],
  },
  {
    slug: "debug-an-error", name: "Debug an error", icon: "bug",
    summary: "Work back from a stack trace to the actual cause.",
    description: "Debugging is where whole-codebase context matters most. A tool that can only see the pasted error will guess; one that can read the surrounding files usually finds it.",
    category: "code", difficulty: Difficulty.MODERATE, trending: true, views: 35600,
    tools: [["claude-code", 421], ["cursor", 398], ["chatgpt", 254], ["github-copilot", 189]],
  },
  {
    slug: "build-a-ui-component", name: "Build a UI component", icon: "component",
    summary: "Go from a sketch or description to styled, working markup.",
    description: "Component generation produces reasonable structure quickly, but rarely matches an existing design system without being handed the tokens. Give it your variables first and the output becomes usable rather than illustrative.",
    category: "code", difficulty: Difficulty.EASY, views: 26400,
    tools: [["v0", 356], ["cursor", 244], ["claude-code", 198]],
  },
  {
    slug: "write-cold-outreach-emails", name: "Write cold outreach emails", icon: "send",
    summary: "Draft personalised first-touch emails at volume.",
    description: "The generation is the easy half. What determines reply rate is the research feeding the personalisation, which is why the tools that win here are the ones wired into enrichment data rather than the ones with the best prose.",
    category: "business", difficulty: Difficulty.MODERATE, views: 24900,
    tools: [["clay", 387, "Enrichment plus drafting in one place; steep learning curve."], ["copy-ai", 198], ["chatgpt", 176], ["jasper", 121]],
  },
  {
    slug: "answer-customer-support-tickets", name: "Answer customer support tickets", icon: "life-buoy",
    summary: "Resolve common questions automatically and route the rest.",
    description: "Support automation succeeds or fails on the quality of your help centre, not the model. A well-maintained knowledge base resolves a large share of tickets; a stale one produces confidently wrong answers at scale.",
    category: "business", difficulty: Difficulty.ADVANCED, views: 21600,
    tools: [["intercom-fin", 312], ["chatgpt", 143]],
    faqs: [["What happens when it doesn't know the answer?", "Configure a confidence threshold and a handoff path before launch. The failure mode that damages trust is not silence — it's a fluent wrong answer with no escalation."]],
  },
  {
    slug: "create-a-presentation", name: "Create a presentation", icon: "presentation",
    summary: "Turn notes or a document into a deck you can actually edit.",
    description: "Generated decks are a good starting structure and a poor finished artefact. The tools worth using are the ones whose output stays editable rather than baking your content into fixed layouts.",
    category: "business", difficulty: Difficulty.EASY, trending: true, views: 32200,
    tools: [["gamma", 428, "Output stays editable, which most competitors get wrong."], ["tome", 154], ["canva", 132], ["chatgpt", 98]],
  },
  {
    slug: "analyze-a-spreadsheet", name: "Analyze a spreadsheet", icon: "table",
    summary: "Ask questions of tabular data without writing formulas.",
    description: "Analysis tools that execute code against your file are reliable; ones that reason about the numbers in text are not. Always check whether the answer came from a computation or from the model's impression of the data.",
    category: "business", difficulty: Difficulty.MODERATE, views: 28700,
    tools: [["chatgpt", 356, "Runs real Python against the file rather than estimating."], ["claude", 289], ["gemini", 167]],
  },
  {
    slug: "write-a-job-description", name: "Write a job description", icon: "briefcase",
    summary: "Draft role specs that are specific enough to filter applicants.",
    description: "Generated job descriptions default to generic responsibility lists. The useful move is to feed in the actual first-quarter objectives for the role and ask for a description built from those.",
    category: "business", difficulty: Difficulty.EASY, views: 14300,
    tools: [["chatgpt", 178], ["claude", 134], ["jasper", 88]],
  },
  {
    slug: "search-academic-papers", name: "Search academic papers", icon: "graduation-cap",
    summary: "Find relevant literature and extract findings into a table.",
    description: "General assistants hallucinate citations often enough that they're unsafe for literature review. Purpose-built research tools search real indexes and link every claim back to a paper, which is the whole point.",
    category: "research", difficulty: Difficulty.MODERATE, featured: true, views: 26800,
    tools: [["elicit", 398, "Extracting findings into a comparison table is the killer feature."], ["consensus", 312], ["perplexity", 221], ["scispace", 167]],
    faqs: [["Why do general chatbots invent citations?", "They generate text that looks like a citation because citations look a certain way, not because they retrieved one. Tools that search a real index and quote from retrieved papers don't have this failure mode."]],
  },
  {
    slug: "research-a-topic-with-sources", name: "Research a topic with sources", icon: "search",
    summary: "Get an answer you can check, with every claim linked.",
    description: "The value here is verifiability rather than speed. An answer with live links can be audited in two minutes; an unsourced one has to be researched again from scratch to be trusted.",
    category: "research", difficulty: Difficulty.EASY, trending: true, views: 44600,
    tools: [["perplexity", 534], ["chatgpt", 312], ["gemini", 256], ["claude", 201]],
  },
  {
    slug: "explain-a-research-paper", name: "Explain a research paper", icon: "book-open",
    summary: "Work through dense academic writing paragraph by paragraph.",
    description: "Explanation tools are most useful when they stay anchored to the text — highlighting a passage and asking about that passage, rather than asking about the paper in general and getting a plausible summary of a paper that doesn't exist.",
    category: "research", difficulty: Difficulty.EASY, views: 17900,
    tools: [["scispace", 287], ["claude", 231], ["elicit", 121]],
  },
  {
    slug: "turn-notes-into-a-diagram", name: "Turn notes into a diagram", icon: "git-branch",
    summary: "Generate flowcharts and system diagrams from written text.",
    description: "Text-to-diagram works well for structures that are already implicit in the writing — sequences, hierarchies, flows. It cannot invent a structure that the text doesn't contain, which is usually why the first result disappoints.",
    category: "research", difficulty: Difficulty.EASY, views: 15600,
    tools: [["napkin", 267], ["gamma", 98], ["claude", 87]],
  },
  {
    slug: "take-meeting-notes", name: "Take meeting notes", icon: "notebook",
    summary: "Capture decisions and action items without typing during the call.",
    description: "Every tool here produces a summary. The differences that matter in practice are whether it joins as a visible bot, whether it captures your own typed notes alongside the transcript, and how it handles calls it wasn't invited to.",
    category: "productivity", difficulty: Difficulty.EASY, featured: true, views: 39200,
    tools: [["granola", 445, "Doesn't join as a bot, which changes how meetings feel."], ["fathom", 398], ["otter", 267], ["descript", 98]],
    faqs: [["Do I need to tell people they're being recorded?", "In many jurisdictions, yes, and consent rules vary by state and country. Tools that join visibly handle disclosure by existing; tools that record silently put that obligation on you."]],
  },
  {
    slug: "triage-an-inbox", name: "Triage an inbox", icon: "inbox",
    summary: "Sort, summarise and draft replies to a backlog of email.",
    description: "Triage is the rare task where the interface matters more than the model. Saving four seconds per email is only meaningful if the tool is already where you read your mail.",
    category: "productivity", difficulty: Difficulty.EASY, views: 22100,
    tools: [["superhuman", 356], ["gemini", 178, "Free if you're already in Gmail."], ["chatgpt", 121]],
  },
  {
    slug: "schedule-and-protect-focus-time", name: "Schedule and protect focus time", icon: "calendar",
    summary: "Let your calendar defend deep work against meeting creep.",
    description: "Scheduling assistants work by holding and moving blocks as your week changes. The adjustment cost is real: you have to stop treating your calendar as something you edit by hand.",
    category: "productivity", difficulty: Difficulty.MODERATE, views: 13400,
    tools: [["reclaim", 298]],
  },
  {
    slug: "organize-and-search-your-notes", name: "Organize and search your notes", icon: "folder",
    summary: "Ask questions across everything you've written down.",
    description: "Retrieval across your own notes is only as good as what you've captured. The tools are fine; the constraint is almost always that the answer was never written down in the first place.",
    category: "productivity", difficulty: Difficulty.EASY, views: 19800,
    tools: [["notion-ai", 312], ["granola", 143], ["claude", 121]],
  },
  {
    slug: "proofread-before-sending", name: "Proofread before sending", icon: "check",
    summary: "Catch typos, tone problems and unclear sentences in place.",
    description: "Proofreading is the most-used AI task and the least discussed, because it works invisibly. The main decision is whether you want suggestions inline everywhere or a deliberate check at the end.",
    category: "writing", difficulty: Difficulty.EASY, views: 36700,
    tools: [["grammarly", 512], ["chatgpt", 189], ["quillbot", 143]],
  },
  {
    slug: "control-apps-with-a-device", name: "Control apps with a dedicated device", icon: "cpu",
    summary: "Hand off phone tasks to a standalone AI gadget.",
    description: "Dedicated AI hardware is the least proven category in the ecosystem. The demos are compelling and the shipped experiences have so far been slower than doing the same thing on a phone — worth watching, hard to recommend.",
    category: "productivity", difficulty: Difficulty.ADVANCED, views: 9800,
    tools: [["rabbit-r1", 47, "Shipped well behind its demo; included for completeness."]],
  },
];

// ---------------------------------------------------------------------- run

async function main() {
  console.log("Clearing existing data…");
  await prisma.vote.deleteMany();
  await prisma.savedTask.deleteMany();
  await prisma.taskSubmission.deleteMany();
  await prisma.taskTool.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.task.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.category.deleteMany();

  console.log("Seeding categories…");
  const categoryIds = new Map<string, string>();
  for (const [i, c] of categories.entries()) {
    const row = await prisma.category.create({
      data: { ...c, sortOrder: i },
    });
    categoryIds.set(c.slug, row.id);
  }

  console.log("Seeding tools…");
  const toolIds = new Map<string, string>();
  for (const t of tools) {
    const row = await prisma.tool.create({
      data: {
        slug: t.slug, name: t.name, tagline: t.tagline, websiteUrl: t.url,
        pricing: t.pricing, kind: t.kind, platforms: t.platforms, rating: t.rating,
      },
    });
    toolIds.set(t.slug, row.id);
  }

  console.log("Seeding tasks…");
  for (const t of tasks) {
    const categoryId = categoryIds.get(t.category);
    if (!categoryId) throw new Error(`Unknown category: ${t.category}`);

    const task = await prisma.task.create({
      data: {
        slug: t.slug, name: t.name, summary: t.summary, description: t.description,
        icon: t.icon, categoryId, difficulty: t.difficulty,
        isTrending: t.trending ?? false, isFeatured: t.featured ?? false,
        viewCount: t.views, toolCount: t.tools.length,
        saveCount: Math.floor(t.views / 40),
        faqs: {
          create: (t.faqs ?? []).map(([question, answer], position) => ({
            question, answer, position,
          })),
        },
      },
    });

    for (const [toolSlug, upvotes, note] of t.tools) {
      const toolId = toolIds.get(toolSlug);
      if (!toolId) throw new Error(`Unknown tool: ${toolSlug} (task: ${t.slug})`);
      await prisma.taskTool.create({
        data: { taskId: task.id, toolId, upvotes, note: note ?? null },
      });
    }
  }

  console.log("Seeding demo user…");
  const demo = await prisma.user.create({
    data: {
      email: "demo@aiorbit.dev",
      name: "Demo User",
      passwordHash: await bcrypt.hash("password123", 10),
    },
  });

  // Give the demo account some saved tasks so /saved isn't empty on first login.
  const someTasks = await prisma.task.findMany({ take: 3, orderBy: { viewCount: "desc" } });
  for (const task of someTasks) {
    await prisma.savedTask.create({ data: { userId: demo.id, taskId: task.id } });
  }

  const counts = {
    categories: categories.length,
    tools: tools.length,
    tasks: tasks.length,
    links: tasks.reduce((n, t) => n + t.tools.length, 0),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
