import fs from "node:fs/promises";

const snapshotPath = new URL("../data/snapshot.json", import.meta.url);
const mirrorRoot = "https://raw.githubusercontent.com/oolong-tea-2026/arena-ai-leaderboards/main/data";
const now = new Date();
const today = now.toISOString().slice(0, 10);

const boards = {
  chat: { leaderboard: "text", label: "CHAT", unit: "Arena score", minimum: 20 },
  image: { leaderboard: "text-to-image", label: "IMAGE", unit: "Image Arena score", minimum: 20 },
  video: { leaderboard: "text-to-video", label: "VIDEO", unit: "Video Arena score", minimum: 10 },
};

const previous = await readPreviousSnapshot();
const latest = await fetchJson(`${mirrorRoot}/latest.json?cache=${Date.now()}`);
validateLatestPointer(latest);

const snapshot = previous?.schemaVersion === 2 ? previous : createEmptySnapshot();
const reports = [];
const allNewModels = [];

for (const [sectionKey, config] of Object.entries(boards)) {
  const payload = await fetchJson(`${mirrorRoot}/${latest.path}/${config.leaderboard}.json?cache=${Date.now()}`);
  validateLeaderboard(payload, config);

  const oldModels = new Map((snapshot.sections[sectionKey]?.models || []).map((model) => [model.id, model]));
  const seenIds = new Set();
  const activeModels = payload.models.map((row) => {
    const id = `${config.leaderboard}:${slug(row.model)}`;
    const old = oldModels.get(id);
    seenIds.add(id);
    if (!old) allNewModels.push({ section: sectionKey, model: row.model, vendor: row.vendor || "Unknown" });
    return {
      id,
      family: normalizeVendor(row.vendor, row.model),
      name: row.model,
      date: old?.firstSeen || latest.date,
      firstSeen: old?.firstSeen || latest.date,
      lastSeen: latest.date,
      active: true,
      score: numberOrNull(row.score),
      rank: numberOrNull(row.rank),
      votes: numberOrNull(row.votes),
      ci: numberOrNull(row.ci),
      license: row.license || null,
      leaderboard: config.leaderboard,
      source: payload.meta.source_url,
    };
  });

  const inactiveModels = [...oldModels.values()]
    .filter((model) => !seenIds.has(model.id))
    .map((model) => ({ ...model, active: false }));

  snapshot.sections[sectionKey] = {
    label: config.label,
    unit: config.unit,
    note: `${payload.meta.source_url} · fetched ${payload.meta.fetched_at}`,
    leaderboard: config.leaderboard,
    sourceUrl: payload.meta.source_url,
    sourceFetchedAt: payload.meta.fetched_at,
    sourceLastUpdated: payload.meta.last_updated || null,
    currentCount: activeModels.length,
    models: [...activeModels, ...inactiveModels].sort(sortModels),
  };

  reports.push({
    section: sectionKey,
    leaderboard: config.leaderboard,
    source: payload.meta.source_url,
    fetchedAt: payload.meta.fetched_at,
    currentModels: activeModels.length,
    newModels: activeModels.filter((model) => !oldModels.has(model.id)).length,
  });
}

snapshot.generatedAt = now.toISOString();
snapshot.dataAsOf = latest.date;
snapshot.schemaVersion = 2;
snapshot.sourcePolicy = "Current Arena leaderboard data mirrored daily as structured JSON. No estimated scores, ranks, votes, confidence intervals, win rates, or release dates.";
snapshot.updateHistory ||= [];
snapshot.updateHistory.unshift({
  date: snapshot.generatedAt,
  dataAsOf: latest.date,
  additions: allNewModels.length,
  newModels: allNewModels,
  sources: reports,
});
snapshot.updateHistory = snapshot.updateHistory.slice(0, 30);

await fs.writeFile(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`snapshot updated: data ${latest.date}, ${allNewModels.length} new models`);
for (const report of reports) console.log(`${report.section}: ${report.currentModels} current, ${report.newModels} new`);

async function readPreviousSnapshot() {
  try {
    return JSON.parse(await fs.readFile(snapshotPath, "utf8"));
  } catch {
    return null;
  }
}

function createEmptySnapshot() {
  return {
    schemaVersion: 2,
    generatedAt: null,
    dataAsOf: null,
    sections: { chat: { models: [] }, image: { models: [] }, video: { models: [] } },
    updateHistory: [],
  };
}

async function fetchJson(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(url, {
        headers: { accept: "application/json", "user-agent": "ai-model-evolution-arena/2.0", "cache-control": "no-cache" },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new Error(`Unable to fetch ${url}: ${lastError?.message || lastError}`);
}

function validateLatestPointer(latest) {
  if (!/^20\d{2}-\d{2}-\d{2}$/.test(latest?.date || "") || latest.path !== latest.date) throw new Error("Invalid latest.json pointer");
  const ageMs = now - new Date(`${latest.date}T23:59:59Z`);
  if (ageMs > 3 * 86400000) throw new Error(`Upstream snapshot is stale: latest is ${latest.date}, today is ${today}`);
}

function validateLeaderboard(payload, config) {
  if (payload?.meta?.leaderboard !== config.leaderboard) throw new Error(`Wrong leaderboard: expected ${config.leaderboard}`);
  if (!Array.isArray(payload.models) || payload.models.length < config.minimum) {
    throw new Error(`${config.leaderboard} returned only ${payload.models?.length || 0} models`);
  }
  const bad = payload.models.find((row) => !row.model || !Number.isFinite(Number(row.rank)) || !Number.isFinite(Number(row.score)));
  if (bad) throw new Error(`${config.leaderboard} contains an invalid model row`);
  const fetchedAge = now - new Date(payload.meta.fetched_at);
  if (!Number.isFinite(fetchedAge) || fetchedAge > 3 * 86400000) throw new Error(`${config.leaderboard} source fetch is stale: ${payload.meta.fetched_at}`);
}

function normalizeVendor(vendor, modelName) {
  const aliases = { SpaceXAI: "xAI", Bytedance: "ByteDance", Alibaba: "Qwen / Alibaba", Moonshot: "Kimi / Moonshot", Pika: "Pika Labs" };
  if (vendor) return aliases[vendor] || vendor;
  const name = String(modelName).toLowerCase();
  if (name.includes("stable-diffusion")) return "Stability AI";
  if (name.includes("pika")) return "Pika Labs";
  return "Unknown";
}

function slug(value) {
  return String(value).trim().toLowerCase().replace(/\s+/g, "-");
}

function numberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function sortModels(a, b) {
  if (a.active !== b.active) return a.active ? -1 : 1;
  return (a.rank ?? Number.MAX_SAFE_INTEGER) - (b.rank ?? Number.MAX_SAFE_INTEGER) || a.name.localeCompare(b.name);
}


