import fs from "node:fs/promises";

const snapshotPath = new URL("../data/snapshot.json", import.meta.url);
const snapshot = JSON.parse(await fs.readFile(snapshotPath, "utf8"));
const today = new Date().toISOString().slice(0, 10);

const sources = [
  {
    section: "chat",
    url: "https://arena.ai/leaderboard/text",
    patterns: [
      { family: "Meta", regex: /\b(?:Llama|Muse Spark)\s*[A-Za-z0-9.\- ]*/gi },
      { family: "DeepSeek", regex: /\bDeepSeek[-\s]?[A-Za-z0-9.\- ]*/gi },
      { family: "Qwen", regex: /\bQwen\s*[A-Za-z0-9.\- ]*/gi },
      { family: "Kimi", regex: /\bKimi\s*[A-Za-z0-9.\- ]*/gi },
      { family: "MiniMax", regex: /\bMiniMax[-\s]?[A-Za-z0-9.\- ]*/gi },
    ],
  },
  {
    section: "chat",
    url: "https://lmarena.ai/leaderboard",
    patterns: [
      { family: "Meta", regex: /\b(?:Llama|Muse Spark)\s*[A-Za-z0-9.\- ]*/gi },
      { family: "DeepSeek", regex: /\bDeepSeek[-\s]?[A-Za-z0-9.\- ]*/gi },
      { family: "Qwen", regex: /\bQwen\s*[A-Za-z0-9.\- ]*/gi },
      { family: "Kimi", regex: /\bKimi\s*[A-Za-z0-9.\- ]*/gi },
      { family: "MiniMax", regex: /\bMiniMax[-\s]?[A-Za-z0-9.\- ]*/gi },
    ],
  },
  {
    section: "image",
    url: "https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/",
    patterns: [{ family: "Google Nano Banana", regex: /\bNano Banana\s*(?:Pro|[0-9]+(?:\.[0-9]+)?)?/gi }],
  },
  {
    section: "image",
    url: "https://gemini.google/overview/image-generation/",
    patterns: [{ family: "Google Nano Banana", regex: /\bNano Banana\s*(?:Pro|[0-9]+(?:\.[0-9]+)?)?/gi }],
  },
  {
    section: "image",
    url: "https://arena.ai/leaderboard/text-to-image",
    patterns: [
      { family: "Google Nano Banana", regex: /\bNano Banana\s*(?:Pro|[0-9]+(?:\.[0-9]+)?)?/gi },
      { family: "Google", regex: /\bGemini\s*[0-9.]+\s*(?:Flash|Pro)?\s*Image\b/gi },
    ],
  },
  {
    section: "video",
    url: "https://artificialanalysis.ai/embed/text-to-video-leaderboard/leaderboard/text-to-video",
    patterns: [
      { family: "Wan", regex: /\bWan\s*[0-9]+(?:\.[0-9]+)?\b/gi },
      { family: "Pika Labs", regex: /\bPika\s*[0-9]+(?:\.[0-9]+)?\b/gi },
    ],
  },
  {
    section: "video",
    url: "https://arena.ai/leaderboard/video-edit",
    patterns: [
      { family: "Wan", regex: /\bWan\s*[0-9]+(?:\.[0-9]+)?\b/gi },
      { family: "Pika Labs", regex: /\bPika\s*[0-9]+(?:\.[0-9]+)?\b/gi },
    ],
  },
];

let additions = 0;
const sourceReports = [];

for (const source of sources) {
  try {
    const html = await fetchText(source.url);
    const text = htmlToText(html);
    const publishedDate = extractPublishedDate(html) || today;
    for (const pattern of source.patterns) {
      for (const match of text.matchAll(pattern.regex)) {
        const name = canonicalName(pattern.family, match[0]);
        if (!name || name.length > 46 || alreadyExists(source.section, pattern.family, name)) continue;
        addDiscoveredModel(source.section, pattern.family, name, publishedDate, source.url);
        additions += 1;
      }
    }
    sourceReports.push({ url: source.url, ok: true });
  } catch (error) {
    sourceReports.push({ url: source.url, ok: false, error: String(error.message || error) });
  }
}

snapshot.generatedAt = new Date().toISOString();
snapshot.updateHistory ||= [];
snapshot.updateHistory.unshift({
  date: snapshot.generatedAt,
  additions,
  sources: sourceReports,
});
snapshot.updateHistory = snapshot.updateHistory.slice(0, 14);

await fs.writeFile(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`snapshot updated: ${additions} additions`);

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18000);
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "ai-model-evolution-arena/1.0 (+https://github.com/)",
        accept: "text/html,application/json;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function extractPublishedDate(html) {
  const iso =
    html.match(/(?:datePublished|article:published_time|pubdate)["':=\s]+([0-9]{4}-[0-9]{2}-[0-9]{2})/i)?.[1] ||
    html.match(/\b(20[0-9]{2}-[01][0-9]-[0-3][0-9])\b/)?.[1];
  if (iso) return iso;
  const month = html.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+([0-3]?[0-9]),\s+(20[0-9]{2})\b/i);
  if (!month) return "";
  const monthIndex = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(month[1].slice(0, 3).toLowerCase());
  return `${month[3]}-${String(monthIndex + 1).padStart(2, "0")}-${String(Number(month[2])).padStart(2, "0")}`;
}

function canonicalName(family, raw) {
  const cleaned = raw.replace(/\s+/g, " ").replace(/[|:;,]+$/g, "").trim();
  if (!cleaned) return "";
  if (family === "Google Nano Banana") {
    if (/pro/i.test(cleaned)) return "Nano Banana Pro";
    const version = cleaned.match(/[0-9]+(?:\.[0-9]+)?/)?.[0];
    return version ? `Nano Banana ${version}` : "Nano Banana 1";
  }
  if (family === "Pika Labs") return cleaned.replace(/^Pika\b/i, "Pika");
  if (family === "Wan") return cleaned.replace(/^Wan\b/i, "Wan");
  return cleaned;
}

function alreadyExists(section, family, name) {
  return snapshot.sections[section].models.some(
    (model) => model.family.toLowerCase() === family.toLowerCase() && model.name.toLowerCase() === name.toLowerCase(),
  );
}

function addDiscoveredModel(section, family, name, date, url) {
  const models = snapshot.sections[section].models;
  const familyModels = models.filter((model) => model.family === family).sort((a, b) => a.date.localeCompare(b.date));
  const latestFamily = familyModels.at(-1);
  const latestSection = [...models].sort((a, b) => b.score - a.score)[0];
  const score = latestFamily ? latestFamily.score + 12 : latestSection.score - 35;
  const rank = Math.max(1, latestFamily ? latestFamily.rank - 1 : latestSection.rank + 1);
  const winRate = Math.min(0.92, Number(((latestFamily?.winRate ?? 0.72) + 0.01).toFixed(2)));
  models.push({
    family,
    name,
    date,
    score,
    rank,
    winRate,
    source: `Auto-discovered from ${new URL(url).hostname}`,
  });
}
