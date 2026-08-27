const palette = ["#2364aa", "#d1495b", "#2a9d8f", "#6f5cc2", "#c98b20", "#007c89", "#8d6e63", "#ef6c00", "#546e7a", "#0866ff"];
const data = { chat: emptySection("CHAT"), image: emptySection("IMAGE"), video: emptySection("VIDEO") };
let activeSection = "chat";
let activeMetric = "score";

function emptySection(label) {
  return { label, unit: "Arena score", note: "Waiting for data/snapshot.json", models: [] };
}

function activeModels(section) {
  return section.models.filter((model) => model.active !== false && Number.isFinite(model.score) && Number.isFinite(model.rank));
}

function dateValue(date) {
  return new Date(`${date}T00:00:00Z`).getTime();
}

function sortAndOffset(nodes) {
  const sorted = nodes.map((node) => ({ ...node })).sort((a, b) => dateValue(a.firstSeen || a.date) - dateValue(b.firstSeen || b.date) || a.rank - b.rank);
  const buckets = new Map();
  for (const node of sorted) {
    const key = node.firstSeen || node.date;
    const index = buckets.get(key) || 0;
    buckets.set(key, index + 1);
    node.renderTime = dateValue(key) + index * 10 * 60 * 60 * 1000;
  }
  return sorted;
}

function familyGroups(nodes) {
  return sortAndOffset(nodes).reduce((groups, node) => {
    (groups[node.family] ||= []).push(node);
    return groups;
  }, {});
}

function metricValue(node, metric) {
  if (metric === "rank") return node.rank;
  if (metric === "votes") return node.votes || 0;
  return node.score;
}

function metricLabel(metric) {
  if (metric === "rank") return "Rank（越小越好）";
  if (metric === "votes") return "Votes";
  return "Score / Elo";
}

function formatMetric(value, metric) {
  if (metric === "rank") return `#${Math.round(value)}`;
  return Math.round(value).toLocaleString("en-US");
}

function colorFor(name) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return palette[hash % palette.length];
}

function niceTicks(min, max, count = 5) {
  if (min === max) return [min];
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, index) => min + step * index);
}

function yearsBetween(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function drawChart(sectionKey) {
  const section = data[sectionKey];
  const svg = document.querySelector(`#chart-${sectionKey}`);
  const nodes = activeModels(section);
  if (!nodes.length) {
    svg.innerHTML = '<text x="50%" y="50%" text-anchor="middle">暂无有效每日榜单数据</text>';
    return;
  }

  const width = svg.clientWidth || 900;
  const height = svg.clientHeight || 470;
  const groups = familyGroups(nodes);
  const familyCount = Object.keys(groups).length;
  const legendColumns = Math.max(1, Math.floor((width - 92) / 135));
  const legendRows = Math.ceil(familyCount / legendColumns);
  const margin = { top: 18 + legendRows * 16, right: 34, bottom: 24, left: 68 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const plotted = sortAndOffset(nodes);
  const times = plotted.map((node) => node.renderTime);
  const values = plotted.map((node) => metricValue(node, activeMetric));
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const metricMin = Math.min(...values);
  const metricMax = Math.max(...values);
  const padding = Math.max(1, (metricMax - metricMin) * 0.08);
  const yMin = activeMetric === "rank" ? Math.max(1, metricMin - 1) : Math.max(0, metricMin - padding);
  const yMax = metricMax + padding;
  const x = (time) => margin.left + ((time - minTime) / (maxTime - minTime || 1)) * innerWidth;
  const y = (value) => {
    const ratio = (value - yMin) / (yMax - yMin || 1);
    return activeMetric === "rank" ? margin.top + ratio * innerHeight : margin.top + (1 - ratio) * innerHeight;
  };
  const yearTicks = yearsBetween(new Date(minTime).getUTCFullYear(), new Date(maxTime).getUTCFullYear());
  const yTicks = niceTicks(yMin, yMax, 6);

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = `
    <g class="grid">
      ${yearTicks.map((year) => `<line x1="${x(dateValue(`${year}-01-01`))}" x2="${x(dateValue(`${year}-01-01`))}" y1="${margin.top}" y2="${margin.top + innerHeight}"></line>`).join("")}
      ${yTicks.map((tick) => `<line x1="${margin.left}" x2="${margin.left + innerWidth}" y1="${y(tick)}" y2="${y(tick)}"></line>`).join("")}
    </g>
    <g class="axis">
      ${yearTicks.map((year) => `<text x="${x(dateValue(`${year}-01-01`))}" y="${height - 4}" text-anchor="middle">${year}</text>`).join("")}
      ${yTicks.map((tick) => `<text x="${margin.left - 12}" y="${y(tick) + 4}" text-anchor="end">${formatMetric(tick, activeMetric)}</text>`).join("")}
    </g>
    ${Object.entries(groups).map(([family, familyNodes]) => {
      const stroke = colorFor(family);
      const path = familyNodes.map((node, index) => `${index ? "L" : "M"} ${x(node.renderTime).toFixed(2)} ${y(metricValue(node, activeMetric)).toFixed(2)}`).join(" ");
      return `<path class="family-line" d="${path}" stroke="${stroke}"></path>${familyNodes.map((node) => `<circle class="point" cx="${x(node.renderTime)}" cy="${y(metricValue(node, activeMetric))}" r="4.5" fill="${stroke}" data-tooltip="${escapeHtml(`${node.family} · ${node.name}`)}" data-tooltip-meta="${escapeHtml(`首次发现 ${node.firstSeen} · ${metricLabel(activeMetric)}: ${formatMetric(metricValue(node, activeMetric), activeMetric)} · ±${node.ci ?? "—"}`)}"></circle>`).join("")}`;
    }).join("")}
    <g class="legend">${Object.keys(groups).map((family, index) => {
      const lx = margin.left + (index % legendColumns) * 135;
      const ly = 10 + Math.floor(index / legendColumns) * 16;
      return `<circle cx="${lx}" cy="${ly}" r="5" fill="${colorFor(family)}"></circle><text x="${lx + 10}" y="${ly + 4}" fill="#566" font-size="11">${escapeHtml(family)}</text>`;
    }).join("")}</g>`;

  document.querySelectorAll("[data-current-metric]").forEach((element) => { element.textContent = metricLabel(activeMetric); });
  attachPointTooltips(svg);
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
    point.addEventListener("mouseleave", () => tooltip.classList.remove("visible"));
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
  const nodes = activeModels(section).sort((a, b) => a.rank - b.rank);
  if (!nodes.length) return;
  const leader = nodes[0];
  const newest = [...nodes].sort((a, b) => b.firstSeen.localeCompare(a.firstSeen))[0];
  const totalVotes = nodes.reduce((sum, node) => sum + (node.votes || 0), 0);
  document.querySelector(`#insights-${sectionKey}`).innerHTML = `
    <div class="metric-card"><span>当前榜首</span><strong>${escapeHtml(leader.name)}</strong><p>${escapeHtml(leader.family)} · ${leader.score} ±${leader.ci ?? "—"}</p></div>
    <div class="metric-card"><span>当前模型数</span><strong>${nodes.length}</strong><p>来自 ${escapeHtml(section.leaderboard || sectionKey)} 的完整当前榜单。</p></div>
    <div class="metric-card"><span>累计投票数</span><strong>${totalVotes.toLocaleString("en-US")}</strong><p>榜单公开 votes 字段合计。</p></div>
    <div class="metric-card"><span>最近发现</span><strong>${escapeHtml(newest.name)}</strong><p>${newest.firstSeen} · ${escapeHtml(newest.license || "license unknown")}</p></div>`;
}

function renderTable(sectionKey) {
  const nodes = activeModels(data[sectionKey]).sort((a, b) => a.rank - b.rank);
  document.querySelector(`#table-${sectionKey}`).innerHTML = `
    <thead><tr><th>Rank</th><th>Vendor</th><th>Model</th><th>First seen</th><th>Score</th><th>95% CI</th><th>Votes</th><th>License</th></tr></thead>
    <tbody>${nodes.map((node) => `<tr><td>#${node.rank}</td><td><span class="pill"><span class="dot" style="background:${colorFor(node.family)}"></span>${escapeHtml(node.family)}</span></td><td>${escapeHtml(node.name)}</td><td>${node.firstSeen}</td><td>${node.score.toLocaleString("en-US")}</td><td>±${node.ci ?? "—"}</td><td>${(node.votes || 0).toLocaleString("en-US")}</td><td>${escapeHtml(node.license || "—")}</td></tr>`).join("")}</tbody>`;
}

function renderHeatmap(sectionKey) {
  const latest = activeModels(data[sectionKey]).sort((a, b) => a.rank - b.rank).slice(0, 5);
  const labels = ["", ...latest.map((node) => node.family)];
  const cells = [];
  labels.forEach((label, row) => labels.forEach((column, col) => {
    if (!row && !col) cells.push("<div></div>");
    else if (!row) cells.push(`<div class="heat-label top">${escapeHtml(column)}</div>`);
    else if (!col) cells.push(`<div class="heat-label">${escapeHtml(label)}</div>`);
    else {
      const a = latest[row - 1];
      const b = latest[col - 1];
      const value = a === b ? 50 : 100 / (1 + 10 ** ((b.score - a.score) / 400));
      cells.push(`<div class="heat-cell" style="background:${heatColor(value)}" title="由 Arena Elo 差值推算">${Math.round(value)}%</div>`);
    }
  }));
  document.querySelector(`#heatmap-${sectionKey}`).innerHTML = `<div class="heatmap-grid" style="grid-template-columns:92px repeat(${latest.length},minmax(68px,1fr))">${cells.join("")}</div>`;
}

function heatColor(value) {
  const t = Math.max(0, Math.min(1, (value - 35) / 30));
  const low = [227, 239, 232];
  const high = [42, 157, 143];
  return `rgb(${low.map((channel, index) => Math.round(channel + (high[index] - channel) * t)).join(",")})`;
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
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
  const response = await fetch(`./data/snapshot.json?cache=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`snapshot HTTP ${response.status}`);
  const snapshot = await response.json();
  if (snapshot.schemaVersion !== 2) throw new Error("snapshot schemaVersion 2 required");
  Object.assign(data, snapshot.sections);
  const badge = document.querySelector("[data-snapshot-date]");
  if (badge) badge.textContent = `榜单数据日期：${snapshot.dataAsOf} · 页面生成：${snapshot.generatedAt.slice(0, 10)}`;
}

document.querySelectorAll(".tab").forEach((button) => button.addEventListener("click", () => {
  activeSection = button.dataset.section;
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab === button);
    tab.setAttribute("aria-selected", tab === button ? "true" : "false");
  });
  document.querySelectorAll(".arena").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === activeSection));
  history.replaceState(null, "", `#${activeSection}`);
  drawChart(activeSection);
}));

document.querySelectorAll(".mode").forEach((button) => button.addEventListener("click", () => {
  activeMetric = button.dataset.mode;
  document.querySelectorAll(".mode").forEach((mode) => mode.classList.toggle("active", mode === button));
  drawChart(activeSection);
}));

window.addEventListener("resize", () => drawChart(activeSection));

async function init() {
  try {
    await loadDailySnapshot();
    renderAll();
    const hash = location.hash.slice(1);
    if (["chat", "image", "video"].includes(hash)) document.querySelector(`.tab[data-section="${hash}"]`).click();
  } catch (error) {
    console.error(error);
    document.querySelector("[data-snapshot-date]").textContent = "数据加载失败：请先运行每日抓取脚本";
  }
}

init();


