import fs from "node:fs/promises";

const snapshotPath = new URL("../data/snapshot.json", import.meta.url);
const snapshot = JSON.parse(await fs.readFile(snapshotPath, "utf8"));
const today = new Date().toISOString().slice(0, 10);

const sources = [
  {
    section: "chat",
    url: "https://arena.ai/leaderboard/text",
    patterns: [
      { family: "Meta", regex: /\b(?:Llama\s*\d+(?:\.\d+)?(?:\s*(?:Maverick|Scout|Instruct|Chat|405B|70B|8B))?|Muse Spark(?:\s*\d+(?:\.\d+)?)?)\b/gi },
      { family: "DeepSeek", regex: /\bDeepSeek[-\s]?(?:V|R)\d+(?:\.\d+)?(?:[-\s]?(?:Chat|Reasoner|Thinking|Preview|Instruct))?\b/gi },
      { family: "Qwen", regex: /\bQwen\d+(?:\.\d+)?(?:[-\s]?(?:Max|Plus|Coder|VL|Omni|Thinking|Instruct|Chat))?\b/gi },
      { family: "Kimi", regex: /\bKimi[-\s]?(?:K|k)?\d+(?:\.\d+)?(?:[-\s]?(?:Thinking|Turbo|Preview|Instruct))?\b/gi },
      { family: "MiniMax", regex: /\bMiniMax[-\s]?(?:M|Text|01|abab)?\d+(?:\.\d+)?(?:[-\s]?(?:Preview|Instruct|Chat))?\b/gi },
    ],
  },
  {
    section: "chat",
    url: "https://lmarena.ai/leaderboard",
    patterns: [
      { family: "Meta", regex: /\b(?:Llama\s*\d+(?:\.\d+)?(?:\s*(?:Maverick|Scout|Instruct|Chat|405B|70B|8B))?|Muse Spark(?:\s*\d+(?:\.\d+)?)?)\b/gi },
      { family: "DeepSeek", regex: /\bDeepSeek[-\s]?(?:V|R)\d+(?:\.\d+)?(?:[-\s]?(?:Chat|Reasoner|Thinking|Preview|Instruct))?\b/gi },
      { family: "Qwen", regex: /\bQwen\d+(?:\.\d+)?(?:[-\s]?(?:Max|Plus|Coder|VL|Omni|Thinking|Instruct|Chat))?\b/gi },
      { family: "Kimi", regex: /\bKimi[-\s]?(?:K|k)?\d+(?:\.\d+)?(?:[-\s]?(?:Thinking|Turbo|Preview|Instruct))?\b/gi },
      { family: "MiniMax", regex: /\bMiniMax[-\s]?(?:M|Text|01|abab)?\d+(?:\.\d+)?(?:[-\s]?(?:Preview|Instruct|Chat))?\b/gi },
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
const addedFamilies = new Set();

for (const source of sources) {
  try {
    const html = await fetchText(source.url);
    const text = htmlToText(html);
    const publishedDate = extractPublishedDate(html) || today;
    for (const pattern of source.patterns) {
      for (const match of text.matchAll(pattern.regex)) {
        const name = canonicalName(pattern.family, match[0]);
        const familyKey = `${source.section}:${pattern.family}`;
        if (addedFamilies.has(familyKey)) continue;
        if (!isCleanCandidate(source.section, pattern.family, name)) continue;
        if (!isNewerThanFamilyMainline(source.section, pattern.family, name)) continue;
        if (alreadyExists(source.section, pattern.family, name)) continue;
        addDiscoveredModel(source.section, pattern.family, name, publishedDate, source.url);
        addedFamilies.add(familyKey);
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
  if (family === "Qwen") return cleaned.replace(/^qwen/i, "Qwen").replace(/[-\s]max$/i, " Max");
  if (family === "Kimi") return cleaned.replace(/^kimi/i, "Kimi").replace(/[-\s]preview$/i, " Preview");
  if (family === "DeepSeek") return cleaned.replace(/^deepseek/i, "DeepSeek");
  if (family === "MiniMax") return cleaned.replace(/^minimax/i, "MiniMax");
  return cleaned;
}

function alreadyExists(section, family, name) {
  return snapshot.sections[section].models.some(
    (model) => model.family.toLowerCase() === family.toLowerCase() && model.name.toLowerCase() === name.toLowerCase(),
  );
}

function isCleanCandidate(section, family, name) {
  if (!name || name.length > 42) return false;
  const allowedBrands = {
    Meta: ["llama", "muse spark"],
    DeepSeek: ["deepseek"],
    Qwen: ["qwen"],
    Kimi: ["kimi"],
    MiniMax: ["minimax"],
  }[family] || [];
  const lowered = allowedBrands.reduce((value, brand) => value.replaceAll(brand, ""), name.toLowerCase());
  if (/\b(?:gpt|claude|gemini|grok|llama|qwen|deepseek|minimax|kimi|sora|veo|runway|kling)\b/i.test(lowered)) {
    return false;
  }
  if (section === "image" && family === "Google Nano Banana") return /^Nano Banana(?: Pro| \d+(?:\.\d+)?)$/i.test(name);
  if (section === "video" && family === "Wan") return /^Wan \d+(?:\.\d+)?$/i.test(name);
  if (section === "video" && family === "Pika Labs") return /^Pika \d+(?:\.\d+)?$/i.test(name);
  if (!hasReasonableVersion(family, name)) return false;
  return /\d/.test(name) || /Muse Spark/i.test(name);
}

function hasReasonableVersion(family, name) {
  if (/Muse Spark/i.test(name)) return true;
  const version = versionNumber(name);
  if (version === 0) return false;
  if (family === "Meta" && /llama/i.test(name)) return version >= 2 && version <= 10;
  if (["DeepSeek", "Qwen", "Kimi", "MiniMax", "Wan", "Pika Labs", "Google Nano Banana"].includes(family)) {
    return version > 0 && version <= 10;
  }
  return version > 0 && version <= 20;
}

function isNewerThanFamilyMainline(section, family, name) {
  const currentVersions = snapshot.sections[section].models
    .filter((model) => model.family === family)
    .map((model) => versionNumber(model.name))
    .filter((version) => version > 0);
  const candidateVersion = versionNumber(name);
  if (candidateVersion === 0) return !alreadyExists(section, family, name);
  return candidateVersion > Math.max(0, ...currentVersions);
}

function versionNumber(name) {
  const version = name.match(/\d+(?:\.\d+)?/)?.[0];
  return version ? Number(version) : 0;
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
