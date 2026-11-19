/* Episode engine shared by every chapter.
 *
 * A chapter page contains <section class="episode" data-ep="1.3" data-title="…">
 * blocks inside .text-col. Each one may hold a <div class="stage"> (the
 * interactive), which is moved into the right-hand column. One episode shows
 * at a time; the URL hash remembers which.
 *
 * Interactives register with ST.register("1.3", (stageEl) => { … }) and are
 * built the first time their episode is shown.
 */
(function () {
  "use strict";

  const ST = (window.ST = {});
  const inits = {};
  const started = new Set();
  let episodes = [];
  let current = null;
  const chapter = document.body.dataset.chapter || "x";
  const STORE_KEY = "oooc-progress-v1";

  // ---------- colors (match site.css) ----------
  ST.c = {
    theory: "#5aa9e6", theorySoft: "#d6eaf9",
    observed: "#3dbb85", observedSoft: "#d4f2e4",
    torch: "#f08a24", danger: "#e0564e",
    grey: "#c9d0d8", ink: "#1f2a36", muted: "#7d8996", line: "#e3e7ec",
  };

  // ---------- small utilities ----------
  ST.mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
  ST.sum = (a) => a.reduce((s, x) => s + x, 0);
  ST.sample = (arr, n) => {
    const a = arr.slice();
    for (let i = 0; i < n; i++) {
      const j = i + Math.floor(Math.random() * (a.length - i));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, n);
  };
  ST.shuffle = (arr) => ST.sample(arr, arr.length);
  ST.pct = (x, d = 0) => (100 * x).toFixed(d) + "%";
  ST.el = (tag, attrs = {}, html = "") => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") e.className = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    if (html) e.innerHTML = html;
    return e;
  };
  ST.sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // ---------- tooltip ----------
  const tip = ST.el("div", { class: "tooltip", role: "status" });
  document.addEventListener("DOMContentLoaded", () => document.body.appendChild(tip));
  ST.tip = {
    show(html, ev) {
      tip.innerHTML = html;
      tip.style.opacity = 1;
      const x = Math.min(ev.clientX + 14, window.innerWidth - tip.offsetWidth - 8);
      const y = Math.min(ev.clientY + 14, window.innerHeight - tip.offsetHeight - 8);
      tip.style.left = x + "px";
      tip.style.top = y + "px";
    },
    hide() { tip.style.opacity = 0; },
  };

  // ---------- progress (per-viewer convenience only) ----------
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveProgress(p) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) { /* private mode */ }
  }
  let progress = loadProgress();
  const doneSet = () => new Set(progress[chapter] || []);
  function markDone(id) {
    const s = doneSet();
    s.add(id);
    progress[chapter] = [...s];
    saveProgress(progress);
    renderTorches();
    renderEpisodeLists();
  }

  ST.register = (id, fn) => { inits[id] = fn; if (current && current.id === id) start(current); };
  ST.reveal = (key) => {
    document.querySelectorAll(`.later[data-key="${key}"]`).forEach((e) => e.classList.add("shown"));
  };

  // ---------- torches ----------
  const torchSVG =
    '<svg viewBox="0 0 14 24" aria-hidden="true"><path class="flame" d="M7 0C9 3 11 5 11 8a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-4 0-7z"/>' +
    '<rect class="stick" x="5.5" y="11" width="3" height="13" rx="1"/></svg>';

  function renderTorches() {
    const bar = document.querySelector(".torches");
    if (!bar) return;
    const done = doneSet();
    bar.innerHTML = "";
    episodes.filter((e) => e.numbered).forEach((e) => {
      const b = ST.el("button", {
        class: "torch-btn" + (done.has(e.id) ? " lit" : "") + (current && current.id === e.id ? " current" : ""),
        title: `${e.id} · ${e.title}${done.has(e.id) ? " (done)" : ""}`,
        "aria-label": `Episode ${e.id}: ${e.title}`,
        onclick: () => go(e.id),
      }, torchSVG);
      bar.appendChild(b);
    });
  }

  function renderEpisodeLists() {
    const done = doneSet();
    document.querySelectorAll(".ep-list").forEach((ul) => {
      ul.innerHTML = "";
      episodes.filter((e) => e.numbered).forEach((e) => {
        const li = ST.el("li");
        li.appendChild(ST.el("button", { onclick: () => go(e.id) },
          `<span class="num">${e.id}</span><span>${e.title}</span>${done.has(e.id) ? '<span class="done">🔥</span>' : ""}`));
        ul.appendChild(li);
      });
    });
  }

  // ---------- tribal checks ----------
  function wireChecks(root) {
    root.querySelectorAll(".check").forEach((chk) => {
      const answer = chk.dataset.answer;
      const fb = chk.querySelector(".fb");
      const ep = chk.closest(".episode").dataset.ep;
      chk.querySelectorAll(".opt").forEach((opt) => {
        opt.addEventListener("click", () => {
          if (opt.dataset.k === answer) {
            chk.querySelectorAll(".opt").forEach((o) => o.classList.remove("wrong"));
            opt.classList.add("right");
            fb.innerHTML = "🔥 " + (chk.dataset.right || "Correct. Grab your torch.");
            markDone(ep);
          } else {
            opt.classList.add("wrong");
            fb.innerHTML = chk.dataset.wrong || "Not quite. Try again.";
          }
        });
      });
    });
  }

  // ---------- navigation ----------
  function start(ep) {
    if (started.has(ep.id) || !inits[ep.id] || !ep.stage) return;
    started.add(ep.id);
    try { inits[ep.id](ep.stage); } catch (err) { console.error("Episode " + ep.id + " failed to start", err); }
  }

  function show(id) {
    const ep = episodes.find((e) => e.id === id) || episodes[0];
    episodes.forEach((e) => {
      e.section.classList.toggle("active", e === ep);
      if (e.stage) e.stage.classList.toggle("active", e === ep);
    });
    current = ep;
    const layout = document.querySelector(".layout");
    if (layout) layout.classList.toggle("no-stage", !ep.stage);
    renderNav();
    renderTorches();
    start(ep);
    window.scrollTo({ top: 0 });
    const sc = document.querySelector(".stage-col");
    if (sc) sc.scrollTop = 0;
    document.title = `${ep.title} · ${document.body.dataset.chapterTitle || "Outwit, Outplay, Outcompute"}`;
  }

  function go(id) {
    if (location.hash !== "#" + id) location.hash = id;
    else show(id);
  }
  ST.go = go;

  function renderNav() {
    const nav = document.querySelector(".nav-col");
    if (!nav) return;
    const i = episodes.indexOf(current);
    const prev = episodes[i - 1];
    const next = episodes[i + 1];
    nav.innerHTML = "";
    const row = ST.el("div", { class: "ep-nav" });
    row.appendChild(prev
      ? ST.el("button", { class: "btn", onclick: () => go(prev.id) }, "← " + (prev.numbered ? prev.id : prev.title))
      : ST.el("span"));
    if (next) row.appendChild(ST.el("button", { class: "btn primary", onclick: () => go(next.id) },
      (next.numbered ? `Next: ${next.id} ${next.title}` : next.title) + " →"));
    else if (document.body.dataset.next) row.appendChild(ST.el("a", { class: "btn primary", href: document.body.dataset.next }, "Next chapter →"));
    nav.appendChild(row);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const stageCol = document.querySelector(".stage-col");
    episodes = [...document.querySelectorAll(".text-col .episode")].map((section) => {
      const stage = section.querySelector(".stage");
      if (stage && stageCol) stageCol.appendChild(stage);
      const kind = section.dataset.kind || "ep";
      return { id: section.dataset.ep, title: section.dataset.title, section, stage, numbered: kind === "ep" };
    });
    // On phones, put each interactive inside its episode (after the setup text,
    // before the reveals and the Tribal Check) instead of below everything.
    const narrow = window.matchMedia("(max-width: 900px)");
    const placeStages = () => episodes.forEach((e) => {
      if (!e.stage) return;
      if (narrow.matches) {
        const anchor = e.section.querySelector(".later, .wjh, .check");
        e.section.insertBefore(e.stage, anchor);
      } else if (stageCol && e.stage.parentNode !== stageCol) stageCol.appendChild(e.stage);
    });
    placeStages();
    narrow.addEventListener("change", placeStages);

    episodes.forEach((e) => {
      if (e.numbered && !e.section.querySelector(".ep-label")) {
        e.section.insertBefore(ST.el("p", { class: "ep-label" }, "Episode " + e.id), e.section.firstChild);
      }
    });
    wireChecks(document);
    renderEpisodeLists();
    window.addEventListener("hashchange", () => show(decodeURIComponent(location.hash.slice(1))));
    document.addEventListener("keydown", (ev) => {
      if (/input|select|textarea/i.test(document.activeElement.tagName)) return;
      const i = episodes.indexOf(current);
      if (ev.key === "ArrowRight" && episodes[i + 1]) go(episodes[i + 1].id);
      if (ev.key === "ArrowLeft" && episodes[i - 1]) go(episodes[i - 1].id);
    });
    show(decodeURIComponent(location.hash.slice(1)) || episodes[0].id);
  });
})();
