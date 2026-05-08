const colors = {
  OpenAI: "#2364aa",
  Anthropic: "#d1495b",
  Google: "#2a9d8f",
  xAI: "#171717",
  Meta: "#0866ff",
  DeepSeek: "#5c6bc0",
  Qwen: "#c98b20",
  Kimi: "#007c89",
  MiniMax: "#8d6e63",
  Midjourney: "#6f5cc2",
  "Black Forest Labs": "#007c89",
  Stability: "#c98b20",
  "Google Nano Banana": "#0f9d58",
  Runway: "#d1495b",
  KlingAI: "#2364aa",
  ByteDance: "#2a9d8f",
  Wan: "#546e7a",
  "Pika Labs": "#ef6c00",
};

let data = {
  chat: {
    label: "CHAT",
    unit: "Arena score",
    note: "Text Arena / LMArena 快照与历史归一化节点",
    models: [
      model("OpenAI", "GPT-3.5", "2022-11-30", 1110, 24, 0.55, "ChatGPT public launch era"),
      model("OpenAI", "GPT-4", "2023-03-14", 1251, 10, 0.66, "OpenAI GPT-4 announcement"),
      model("OpenAI", "GPT-4 Turbo", "2023-11-06", 1287, 8, 0.69, "OpenAI DevDay generation"),
      model("OpenAI", "GPT-4o", "2024-05-13", 1354, 6, 0.74, "OpenAI GPT-4o announcement"),
      model("OpenAI", "o3", "2025-04-16", 1428, 17, 0.81, "Arena text snapshot"),
      model("OpenAI", "GPT-5.1 high", "2025-11-12", 1458, 8, 0.84, "LMArena overview snapshot"),
      model("OpenAI", "GPT-5.4 high", "2026-04-09", 1484, 7, 0.86, "Arena text snapshot"),

      model("Anthropic", "Claude 2", "2023-07-11", 1180, 19, 0.59, "Anthropic release line"),
      model("Anthropic", "Claude 3 Opus", "2024-03-04", 1248, 12, 0.65, "Claude 3 family"),
      model("Anthropic", "Claude 3.5 Sonnet", "2024-06-20", 1308, 9, 0.71, "Claude 3.5 Sonnet announcement"),
      model("Anthropic", "Claude Sonnet 4.5", "2025-09-29", 1450, 10, 0.83, "LMArena overview snapshot"),
      model("Anthropic", "Claude Opus 4.6 thinking", "2026-04-09", 1504, 1, 0.88, "Arena text snapshot"),

      model("Google", "Gemini Pro", "2023-12-06", 1187, 18, 0.6, "Gemini launch"),
      model("Google", "Gemini 1.5 Pro", "2024-02-15", 1260, 11, 0.66, "Gemini 1.5 Pro announcement"),
      model("Google", "Gemini 2.5 Pro", "2025-03-25", 1451, 9, 0.83, "LMArena overview snapshot"),
      model("Google", "Gemini 3 Pro", "2025-11-18", 1490, 1, 0.87, "LMArena overview snapshot"),
      model("Google", "Gemini 3.1 Pro preview", "2026-04-09", 1492, 3, 0.87, "Arena text snapshot"),

      model("xAI", "Grok-1", "2023-11-04", 1160, 22, 0.57, "xAI launch era"),
      model("xAI", "Grok-2", "2024-08-13", 1280, 15, 0.67, "xAI Grok-2 era"),
      model("xAI", "Grok-3", "2025-02-17", 1402, 13, 0.78, "Grok-3 era"),
      model("xAI", "Grok-4.1 thinking", "2025-12-01", 1477, 3, 0.85, "LMArena overview snapshot"),
      model("xAI", "Grok-4.20 beta1", "2026-04-09", 1486, 5, 0.86, "Arena text snapshot"),

      model("Meta", "Llama 2 Chat", "2023-07-18", 1120, 30, 0.55, "Meta Llama open model generation"),
      model("Meta", "Llama 3 70B Instruct", "2024-04-18", 1210, 23, 0.62, "Meta Llama 3 release"),
      model("Meta", "Llama 3.1 405B Instruct", "2024-07-23", 1278, 18, 0.68, "Meta Llama 3.1 release"),
      model("Meta", "Llama 4 Maverick", "2025-04-05", 1352, 16, 0.74, "Meta Llama 4 release"),
      model("Meta", "Muse Spark", "2026-04-08", 1468, 6, 0.85, "Meta Muse Spark announcement"),

      model("DeepSeek", "DeepSeek-V2", "2024-05-07", 1222, 21, 0.64, "DeepSeek V2 generation"),
      model("DeepSeek", "DeepSeek-V3", "2024-12-26", 1350, 15, 0.75, "DeepSeek V3 release"),
      model("DeepSeek", "DeepSeek-R1", "2025-01-20", 1418, 12, 0.8, "DeepSeek R1 release"),
      model("DeepSeek", "DeepSeek-V4", "2026-03-15", 1472, 5, 0.85, "Daily snapshot candidate"),

      model("Qwen", "Qwen1.5 72B Chat", "2024-02-05", 1195, 26, 0.61, "Qwen 1.5 generation"),
      model("Qwen", "Qwen2.5 Max", "2025-01-29", 1390, 14, 0.78, "Qwen 2.5 Max release"),
      model("Qwen", "Qwen3 Max", "2025-09-05", 1455, 9, 0.83, "Daily snapshot candidate"),
      model("Qwen", "Qwen3.5 Max", "2026-03-20", 1470, 7, 0.85, "Daily snapshot candidate"),

      model("Kimi", "Kimi Chat", "2023-10-09", 1165, 29, 0.58, "Moonshot Kimi launch era"),
      model("Kimi", "Kimi k1.5", "2025-01-20", 1385, 15, 0.77, "Kimi k-series generation"),
      model("Kimi", "Kimi K2", "2025-07-11", 1446, 11, 0.82, "Kimi K2 release"),
      model("Kimi", "Kimi K3", "2026-02-10", 1475, 6, 0.85, "Daily snapshot candidate"),

      model("MiniMax", "abab6.5", "2023-09-05", 1145, 31, 0.56, "MiniMax abab generation"),
      model("MiniMax", "MiniMax-Text-01", "2025-01-15", 1368, 16, 0.76, "MiniMax Text-01 release"),
      model("MiniMax", "MiniMax-M1", "2025-06-16", 1430, 13, 0.8, "MiniMax M1 generation"),
      model("MiniMax", "MiniMax-M2", "2026-02-01", 1462, 10, 0.84, "Daily snapshot candidate"),
    ],
  },
  image: {
    label: "IMAGE",
    unit: "Image Arena score",
    note: "Text-to-image / image edit Arena 快照与历史归一化节点",
    models: [
      model("OpenAI", "DALL-E 2", "2022-04-06", 930, 26, 0.5, "OpenAI image generation era"),
      model("OpenAI", "DALL-E 3", "2023-09-20", 1085, 14, 0.62, "DALL-E 3 generation"),
      model("OpenAI", "GPT-image-1", "2025-03-25", 1241, 2, 0.79, "Arena text-to-image snapshot"),
      model("OpenAI", "GPT-image-1.5", "2026-01-20", 1376, 5, 0.86, "Arena image-edit snapshot"),
      model("OpenAI", "GPT-image-2", "2026-04-19", 1512, 1, 0.9, "Arena text-to-image snapshot"),

      model("Google", "Imagen 2", "2023-12-13", 1045, 18, 0.59, "Imagen generation"),
      model("Google", "Imagen 3", "2024-05-14", 1128, 10, 0.68, "Imagen 3 launch era"),
      model("Google", "Gemini 2.5 Flash Image", "2025-08-26", 1271, 6, 0.82, "Arena multi-image edit snapshot"),
      model("Google", "Gemini 3 Pro Image", "2025-12-16", 1388, 3, 0.88, "Arena image-edit snapshot"),
      model("Google", "Gemini 3.1 Flash Image", "2026-03-18", 1264, 2, 0.84, "Arena text-to-image snapshot"),

      model("Google Nano Banana", "Nano Banana 1", "2025-08-26", 1271, 6, 0.82, "Gemini 2.5 Flash Image / Nano Banana launch"),
      model("Google Nano Banana", "Nano Banana Pro", "2025-11-18", 1388, 3, 0.88, "Gemini 3 Pro Image / Nano Banana Pro"),
      model("Google Nano Banana", "Nano Banana 2", "2026-02-26", 1438, 2, 0.89, "Google Nano Banana 2 announcement"),

      model("Midjourney", "V4", "2022-11-05", 980, 22, 0.54, "Midjourney public model generation"),
      model("Midjourney", "V5", "2023-03-15", 1058, 16, 0.61, "Midjourney V5 generation"),
      model("Midjourney", "V6", "2023-12-21", 1138, 9, 0.69, "Midjourney V6 generation"),
      model("Midjourney", "V7", "2025-04-03", 1160, 12, 0.72, "Midjourney V7 generation"),

      model("Black Forest Labs", "FLUX.1 dev", "2024-08-01", 970, 48, 0.56, "Arena open-source snapshot"),
      model("Black Forest Labs", "FLUX.1 Kontext", "2025-05-29", 941, 50, 0.55, "Arena open-source snapshot"),
      model("Black Forest Labs", "FLUX 2 max", "2025-11-25", 1167, 8, 0.76, "Arena text-to-image snapshot"),

      model("Stability", "SDXL 1.0", "2023-07-26", 1010, 20, 0.57, "Stability AI generation"),
      model("Stability", "Stable Diffusion 3", "2024-06-12", 1060, 17, 0.61, "Stability AI generation"),
      model("Stability", "Stable Diffusion 3.5 Large", "2024-10-22", 938, 52, 0.52, "Arena open-source snapshot"),
    ],
  },
  video: {
    label: "VIDEO",
    unit: "Video Arena Elo",
    note: "Artificial Analysis Text-to-Video 与 Arena Video Edit 快照",
    models: [
      model("Runway", "Gen-2", "2023-03-20", 970, 20, 0.52, "Runway Gen-2 era"),
      model("Runway", "Gen-3 Alpha", "2024-06-17", 1110, 12, 0.66, "Runway Gen-3 generation"),
      model("Runway", "Gen-4", "2025-03-31", 1208, 5, 0.77, "Arena video-edit snapshot"),
      model("Runway", "Gen-4.5", "2025-12-01", 1247, 4, 0.8, "Artificial Analysis video snapshot"),

      model("Google", "Veo", "2024-05-14", 1090, 14, 0.64, "Google Veo launch era"),
      model("Google", "Veo 2", "2024-12-16", 1175, 9, 0.73, "Veo 2 launch era"),
      model("Google", "Veo 3", "2025-05-20", 1226, 6, 0.79, "Artificial Analysis video snapshot"),
      model("Google", "Veo 3.1", "2025-10-15", 1238, 5, 0.8, "Artificial Analysis video snapshot"),

      model("OpenAI", "Sora", "2024-02-15", 1085, 15, 0.63, "OpenAI Sora preview era"),
      model("OpenAI", "Sora public", "2024-12-09", 1168, 10, 0.72, "Sora public release era"),
      model("OpenAI", "Sora 2 Pro", "2025-09-30", 1206, 7, 0.76, "Artificial Analysis video snapshot"),

      model("KlingAI", "Kling 1.0", "2024-06-06", 1060, 16, 0.61, "Kling launch era"),
      model("KlingAI", "Kling 1.5", "2024-09-19", 1135, 11, 0.68, "Kling generation"),
      model("KlingAI", "Kling 2.1", "2025-06-10", 1195, 8, 0.75, "Kling generation"),
      model("KlingAI", "Kling 3.0 Pro", "2026-02-01", 1246, 3, 0.81, "Artificial Analysis video snapshot"),

      model("ByteDance", "Seedance 1.0", "2025-06-11", 1210, 7, 0.77, "Seedance generation"),
      model("ByteDance", "Seedance 2.0", "2026-03-01", 1268, 2, 0.84, "Artificial Analysis video snapshot"),

      model("Wan", "Wan 2.1", "2025-02-25", 1128, 13, 0.67, "Wan open-source video generation"),
      model("Wan", "Wan 2.2", "2025-07-28", 1182, 9, 0.73, "Wan open-source video generation"),
      model("Wan", "Wan 3.0", "2026-01-18", 1232, 6, 0.79, "Daily snapshot candidate"),

      model("Pika Labs", "Pika 1.0", "2023-11-28", 990, 21, 0.54, "Pika public generation"),
      model("Pika Labs", "Pika 1.5", "2024-10-01", 1118, 14, 0.66, "Pika 1.5 generation"),
      model("Pika Labs", "Pika 2.0", "2024-12-13", 1158, 11, 0.7, "Pika 2.0 generation"),
      model("Pika Labs", "Pika 2.2", "2025-05-13", 1190, 8, 0.74, "Pika 2.2 generation"),
    ],
  },
};

let activeSection = "chat";
let activeMetric = "score";

function model(family, name, date, score, rank, winRate, source) {
  return { family, name, date, score, rank, winRate, source };
}

function dateValue(date) {
  return new Date(`${date}T00:00:00`).getTime();
}

function sortAndOffset(nodes) {
  const sorted = [...nodes].sort((a, b) => dateValue(a.date) - dateValue(b.date) || a.family.localeCompare(b.family));
  const buckets = new Map();
  sorted.forEach((node) => {
    const key = node.date;
    const index = buckets.get(key) || 0;
    buckets.set(key, index + 1);
    node.renderTime = dateValue(node.date) + index * 10 * 60 * 60 * 1000;
  });
  return sorted;
}

function familyGroups(nodes) {
  return sortAndOffset(nodes).reduce((groups, node) => {
    groups[node.family] ||= [];
    groups[node.family].push(node);
    return groups;
  }, {});
}

function metricValue(node, metric) {
  if (metric === "rank") return node.rank;
  if (metric === "winRate") return Math.round(node.winRate * 100);
  return node.score;
}

function metricLabel(metric) {
  if (metric === "rank") return "Rank (smaller is better)";
  if (metric === "winRate") return "Win rate";
  return "Score / Elo";
}

function niceTicks(min, max, count = 5) {
  if (min === max) return [min];
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => min + step * i);
}

function pathFor(nodes, x, y, metric) {
  return nodes
    .map((node, index) => `${index === 0 ? "M" : "L"} ${x(node.renderTime).toFixed(2)} ${y(metricValue(node, metric)).toFixed(2)}`)
    .join(" ");
}

function drawChart(sectionKey) {
  const section = data[sectionKey];
  const svg = document.querySelector(`#chart-${sectionKey}`);
  const width = svg.clientWidth || 900;
  const height = svg.clientHeight || 470;
  const familyCount = new Set(section.models.map((node) => node.family)).size;
  const legendColumns = Math.max(1, Math.floor((width - 92) / 128));
  const legendRows = Math.ceil(familyCount / legendColumns);
  const margin = { top: 14 + legendRows * 16, right: 30, bottom: 8, left: 62 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const nodes = sortAndOffset(section.models);
  const times = nodes.map((node) => node.renderTime);
  const values = nodes.map((node) => metricValue(node, activeMetric));
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const metricMin = Math.min(...values);
  const metricMax = Math.max(...values);
  const rankMode = activeMetric === "rank";
  const padding = Math.max(4, (metricMax - metricMin) * 0.08);
  const yMin = rankMode ? Math.max(1, metricMin - 1) : metricMin - padding;
  const yMax = metricMax + padding;
  const x = (time) => margin.left + ((time - minTime) / (maxTime - minTime || 1)) * innerWidth;
  const y = (value) => {
    const ratio = (value - yMin) / (yMax - yMin || 1);
    return rankMode ? margin.top + ratio * innerHeight : margin.top + (1 - ratio) * innerHeight;
  };
  const yearTicks = yearsBetween(new Date(minTime).getFullYear(), new Date(maxTime).getFullYear());
  const yTicks = niceTicks(yMin, yMax, 6);
  const groups = familyGroups(section.models);

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = `
    <g class="grid">
      ${yearTicks.map((year) => `<line x1="${x(dateValue(`${year}-01-01`))}" x2="${x(dateValue(`${year}-01-01`))}" y1="${margin.top}" y2="${margin.top + innerHeight}"></line>`).join("")}
      ${yTicks.map((tick) => `<line x1="${margin.left}" x2="${margin.left + innerWidth}" y1="${y(tick)}" y2="${y(tick)}"></line>`).join("")}
    </g>
    <g class="axis">
      ${yearTicks.map((year) => `<text x="${x(dateValue(`${year}-01-01`))}" y="${height - 3}" text-anchor="middle">${year}</text>`).join("")}
      ${yTicks.map((tick) => `<text x="${margin.left - 12}" y="${y(tick) + 4}" text-anchor="end">${formatMetric(tick, activeMetric)}</text>`).join("")}
    </g>
    <line x1="${margin.left}" x2="${margin.left + innerWidth}" y1="${margin.top + innerHeight}" y2="${margin.top + innerHeight}" stroke="#9da7a4"></line>
    <line x1="${margin.left}" x2="${margin.left}" y1="${margin.top}" y2="${margin.top + innerHeight}" stroke="#9da7a4"></line>
    ${Object.entries(groups)
      .map(([family, familyNodes]) => {
        const stroke = colors[family] || "#555";
        return `
          <path class="family-line" d="${pathFor(familyNodes, x, y, activeMetric)}" stroke="${stroke}"></path>
          ${familyNodes
            .map(
              (node, index) => `
                <circle class="point" cx="${x(node.renderTime)}" cy="${y(metricValue(node, activeMetric))}" r="${index === familyNodes.length - 1 ? 5.5 : 4.5}" fill="${stroke}" data-tooltip="${escapeAttr(`${node.family} ${node.name}`)}" data-tooltip-meta="${escapeAttr(`${node.date} · ${metricLabel(activeMetric)}: ${formatMetric(metricValue(node, activeMetric), activeMetric)}`)}"></circle>
                ${
                  index === familyNodes.length - 1
                    ? `<text class="point-label" x="${x(node.renderTime) + 8}" y="${y(metricValue(node, activeMetric)) + 4}">${shortName(node.name)}</text>`
                    : ""
                }`
            )
            .join("")}
        `;
      })
      .join("")}
    <g class="legend">
      ${Object.keys(groups)
        .map((family, index) => {
          const lx = margin.left + (index % legendColumns) * 128;
          const ly = 9 + Math.floor(index / legendColumns) * 16;
          return `<circle cx="${lx}" cy="${ly}" r="5" fill="${colors[family] || "#555"}"></circle><text x="${lx + 10}" y="${ly + 4}" fill="#566" font-size="12">${family}</text>`;
        })
        .join("")}
    </g>
  `;

  document.querySelectorAll("[data-current-metric]").forEach((el) => {
    el.textContent = metricLabel(activeMetric);
  });
  attachPointTooltips(svg);
}

function yearsBetween(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function formatMetric(value, metric) {
  if (metric === "winRate") return `${Math.round(value)}%`;
  if (metric === "rank") return `#${Math.round(value)}`;
  return Math.round(value).toLocaleString("en-US");
}

function shortName(name) {
  return name.replace("Gemini ", "G").replace("Claude ", "C.").replace("GPT-", "GPT ");
}

function escapeAttr(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function attachPointTooltips(svg) {
  const tooltip = getTooltip();
  svg.querySelectorAll(".point").forEach((point) => {
    point.addEventListener("mouseenter", () => {
      tooltip.querySelector("strong").textContent = point.dataset.tooltip;
      tooltip.querySelector("span").textContent = point.dataset.tooltipMeta;
      tooltip.classList.add("visible");
    });
    point.addEventListener("mousemove", (event) => {
      tooltip.style.left = `${event.clientX + 14}px`;
      tooltip.style.top = `${event.clientY + 14}px`;
    });
    point.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
    });
  });
}

function getTooltip() {
  let tooltip = document.querySelector(".node-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.className = "node-tooltip";
    tooltip.innerHTML = "<strong></strong><span></span>";
    document.body.appendChild(tooltip);
  }
  return tooltip;
}

function renderInsights(sectionKey) {
  const section = data[sectionKey];
  const nodes = sortAndOffset(section.models);
  const latestByFamily = Object.values(familyGroups(nodes)).map((familyNodes) => familyNodes.at(-1));
  const bestScore = [...nodes].sort((a, b) => b.score - a.score)[0];
  const bestRank = [...nodes].sort((a, b) => a.rank - b.rank)[0];
  const fastestFamily = latestByFamily
    .map((latest) => {
      const familyNodes = familyGroups(nodes)[latest.family];
      return { latest, gain: latest.score - familyNodes[0].score };
    })
    .sort((a, b) => b.gain - a.gain)[0];

  document.querySelector(`#insights-${sectionKey}`).innerHTML = `
    <div class="metric-card">
      <span>当前最高分节点</span>
      <strong>${bestScore.name}</strong>
      <p>${bestScore.family} · ${bestScore.date} · ${bestScore.score} ${section.unit}</p>
    </div>
    <div class="metric-card">
      <span>榜单代表排名</span>
      <strong>#${bestRank.rank}</strong>
      <p>${bestRank.name} 在该板块代表节点中排名最高。</p>
    </div>
    <div class="metric-card">
      <span>主线累计提升最大</span>
      <strong>+${Math.round(fastestFamily.gain)}</strong>
      <p>${fastestFamily.latest.family} 从首个节点到最新节点的分数跨度。</p>
    </div>
    <div class="metric-card">
      <span>数据口径</span>
      <strong>${section.label}</strong>
      <p>${section.note}</p>
    </div>
  `;
}

function renderTable(sectionKey) {
  const nodes = sortAndOffset(data[sectionKey].models).sort((a, b) => a.rank - b.rank || b.score - a.score).slice(0, 12);
  document.querySelector(`#table-${sectionKey}`).innerHTML = `
    <thead>
      <tr>
        <th>Rank</th>
        <th>Family</th>
        <th>Model</th>
        <th>Release</th>
        <th>Score/Elo</th>
        <th>Win rate</th>
        <th>Source note</th>
      </tr>
    </thead>
    <tbody>
      ${nodes
        .map(
          (node) => `
        <tr>
          <td>#${node.rank}</td>
          <td><span class="pill"><span class="dot" style="background:${colors[node.family] || "#555"}"></span>${node.family}</span></td>
          <td>${node.name}</td>
          <td>${node.date}</td>
          <td>${node.score.toLocaleString("en-US")}</td>
          <td>${Math.round(node.winRate * 100)}%</td>
          <td>${node.source}</td>
        </tr>`
        )
        .join("")}
    </tbody>
  `;
}

function renderHeatmap(sectionKey) {
  const latest = Object.values(familyGroups(data[sectionKey].models))
    .map((nodes) => nodes.at(-1))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  const labels = ["", ...latest.map((node) => node.family)];
  const cells = [];
  labels.forEach((label, row) => {
    labels.forEach((colLabel, col) => {
      if (row === 0 && col === 0) {
        cells.push(`<div></div>`);
      } else if (row === 0) {
        cells.push(`<div class="heat-label top">${colLabel}</div>`);
      } else if (col === 0) {
        cells.push(`<div class="heat-label">${label}</div>`);
      } else {
        const a = latest[row - 1];
        const b = latest[col - 1];
        const value = a === b ? 50 : predictedWinRate(a.score, b.score);
        const color = heatColor(value);
        cells.push(`<div class="heat-cell" style="background:${color}" title="${a.name} vs ${b.name}">${Math.round(value)}%</div>`);
      }
    });
  });
  document.querySelector(`#heatmap-${sectionKey}`).innerHTML = `
    <div class="heatmap-grid" style="grid-template-columns: 92px repeat(${latest.length}, minmax(68px, 1fr));">
      ${cells.join("")}
    </div>
  `;
}

function predictedWinRate(scoreA, scoreB) {
  return 100 / (1 + 10 ** ((scoreB - scoreA) / 400));
}

function heatColor(value) {
  const t = Math.max(0, Math.min(1, (value - 35) / 30));
  const low = [227, 239, 232];
  const high = [42, 157, 143];
  const rgb = low.map((channel, index) => Math.round(channel + (high[index] - channel) * t));
  return `rgb(${rgb.join(",")})`;
}

function renderAll() {
  Object.keys(data).forEach((sectionKey) => {
    drawChart(sectionKey);
    renderInsights(sectionKey);
    renderTable(sectionKey);
    renderHeatmap(sectionKey);
  });
}

async function loadDailySnapshot() {
  try {
    const response = await fetch("./data/snapshot.json", { cache: "no-store" });
    if (!response.ok) return;
    const snapshot = await response.json();
    if (snapshot.sections?.chat?.models && snapshot.sections?.image?.models && snapshot.sections?.video?.models) {
      data = snapshot.sections;
      const badge = document.querySelector("[data-snapshot-date]");
      if (badge) badge.textContent = snapshot.generatedAt ? `Daily snapshot: ${snapshot.generatedAt.slice(0, 10)}` : "Daily snapshot loaded";
    }
  } catch (error) {
    console.info("Using embedded fallback snapshot because data/snapshot.json is unavailable.", error);
  }
}

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    activeSection = button.dataset.section;
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.toggle("active", tab === button);
      tab.setAttribute("aria-selected", tab === button ? "true" : "false");
    });
    document.querySelectorAll(".arena").forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.panel === activeSection);
    });
    history.replaceState(null, "", `#${activeSection}`);
    drawChart(activeSection);
  });
});

document.querySelectorAll(".mode").forEach((button) => {
  button.addEventListener("click", () => {
    activeMetric = button.dataset.mode;
    document.querySelectorAll(".mode").forEach((mode) => mode.classList.toggle("active", mode === button));
    drawChart(activeSection);
  });
});

window.addEventListener("resize", () => drawChart(activeSection));

async function init() {
  await loadDailySnapshot();
  renderAll();

  const hash = location.hash.replace("#", "");
  if (["chat", "image", "video"].includes(hash)) {
    document.querySelector(`.tab[data-section="${hash}"]`).click();
  }
}

init();
