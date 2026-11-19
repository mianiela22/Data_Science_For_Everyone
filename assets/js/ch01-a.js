/* Chapter 1 interactives, part A: episodes 1.1–1.7. Data: window.CH01_DATA. */
(function () {
  "use strict";
  const D = window.CH01_DATA;
  const C = ST.c;

  function svgBox(host, W, H, label) {
    return d3.select(host).append("svg").attr("viewBox", `0 0 ${W} ${H}`).attr("width", "100%")
      .attr("role", "img").attr("aria-label", label);
  }
  const tipOn = (sel, html) => sel
    .on("mousemove", (ev, d) => ST.tip.show(html(d), ev))
    .on("mouseleave", () => ST.tip.hide());

  /* ================================================================ 1.1 */
  ST.register("1.1", (stage) => {
    const rule = D.rule;
    const hits = rule.filter((r) => r.hit).length;
    const truth = hits / rule.length;

    stage.innerHTML = `
      <p class="panel-title">Guess the rule</p>
      <p style="margin:0 0 6px;font-weight:600">In what % of seasons did the player with the most individual immunity wins become Sole Survivor?</p>
      <label class="slider">Your guess: <b id="g-val">70%</b></label>
      <input type="range" id="g" min="0" max="100" value="70" aria-label="Your guess in percent">
      <div class="btn-row"><button class="btn primary" id="lock">Lock in my guess</button><button class="btn torch" id="reveal" disabled>Reveal</button></div>
      <div id="strip"></div>
      <div class="legend"><span><i style="background:${C.observed}"></i>Immunity leader won</span><span><i style="background:${C.grey}"></i>Someone else won</span></div>
      <div id="scale"></div>
      <div id="cards-wrap" style="display:none">
        <p class="panel-title" style="margin-top:22px">Everything we know about Survivor · tap a card</p>
        <div class="cards" id="cards"></div>
      </div>`;

    const g = stage.querySelector("#g");
    const gv = stage.querySelector("#g-val");
    let guess = 70;
    g.addEventListener("input", () => { guess = +g.value; gv.textContent = guess + "%"; });
    stage.querySelector("#lock").addEventListener("click", (e) => {
      g.disabled = true; e.target.disabled = true; e.target.textContent = `Locked: ${guess}%`;
      stage.querySelector("#reveal").disabled = false;
    });

    // dot strip: 10 columns × 5 rows
    const W = 600, cell = 56, H = 5 * cell + 6;
    const svg = svgBox(stage.querySelector("#strip"), W, H, "One dot per season");
    const dots = svg.selectAll("g").data(rule).join("g")
      .attr("transform", (d, i) => `translate(${(i % 10) * (W / 10) + W / 20},${Math.floor(i / 10) * cell + cell / 2 + 3})`);
    dots.append("circle").attr("r", 21).attr("fill", "#fff").attr("stroke", C.grey).attr("stroke-width", 2);
    dots.append("text").attr("text-anchor", "middle").attr("y", 5).attr("font-size", 13).attr("font-weight", 700)
      .attr("fill", C.muted).text((d) => d.season);
    tipOn(dots, (d) => `<b>Season ${d.season}: ${d.name}</b><br>Immunity leader${d.leaders.length > 1 ? "s" : ""}: ${d.leaders.join(", ")} (${d.wins} wins)<br>Winner: ${d.winner}`);

    const sW = 600, sH = 70;
    const ss = svgBox(stage.querySelector("#scale"), sW, sH, "Your guess compared with the real answer");
    const x = d3.scaleLinear().domain([0, 100]).range([20, sW - 20]);
    ss.append("g").attr("class", "axis").attr("transform", `translate(0,${sH - 22})`).call(d3.axisBottom(x).ticks(5).tickFormat((d) => d + "%"));

    stage.querySelector("#reveal").addEventListener("click", (e) => {
      e.target.disabled = true;
      dots.select("circle").transition().delay((d, i) => i * 35).duration(250)
        .attr("fill", (d) => (d.hit ? C.observed : C.grey)).attr("stroke", (d) => (d.hit ? C.observed : C.grey));
      dots.select("text").transition().delay((d, i) => i * 35).attr("fill", (d) => (d.hit ? "#fff" : C.ink));
      const delay = rule.length * 35 + 200;
      setTimeout(() => {
        const mk = (val, color, label, dy) => {
          const gg = ss.append("g").attr("transform", `translate(${x(val)},0)`);
          gg.append("line").attr("y1", 8).attr("y2", sH - 22).attr("stroke", color).attr("stroke-width", 3);
          gg.append("text").attr("y", dy).attr("text-anchor", "middle").attr("font-size", 12).attr("font-weight", 700).attr("fill", color).text(label);
        };
        mk(guess, C.theory, `you: ${guess}%`, 8);
        mk(truth * 100, "#23935f", `real: ${hits}/${rule.length} = ${Math.round(truth * 100)}%`, 8);
        ST.reveal("rule-revealed");
        stage.querySelector("#cards-wrap").style.display = "block";
      }, delay);
    });

    // data cards
    const fmt = d3.format(",");
    const cards = [
      ["castaways", "Castaways", `${fmt(D.cards.castaways)} appearances`],
      ["votes", "Votes", `${fmt(D.cards.votes)} rows`],
      ["challenges", "Challenges", `${fmt(D.cards.challenges)} results`],
      ["jury", "Jury votes", `${fmt(D.cards.jury)} rows`],
      ["episodes", "Episodes", `${fmt(D.cards.episodes)} with ratings`],
    ];
    const wrap = stage.querySelector("#cards");
    cards.forEach(([k, title, count]) => {
      const s = D.samples[k];
      const back = Object.entries(s).map(([a, b]) => `<div><em>${a}:</em> ${b}</div>`).join("");
      const b = ST.el("button", { class: "dcard", "aria-label": `${title} card` },
        `<div class="inner"><div class="face front"><b>${count.split(" ")[0]}</b><span>${title}: ${count.split(" ").slice(1).join(" ")}</span><i>tap for a sample row</i></div>` +
        `<div class="face back">${back}</div></div>`);
      b.addEventListener("click", () => b.classList.toggle("flipped"));
      wrap.appendChild(b);
    });
    const v = ST.el("button", { class: "dcard video", "aria-label": "Video card" },
      `<div class="inner"><div class="face front"><b>▶ Video</b><span>Hundreds of hours of footage</span><i>tap</i></div>` +
      `<div class="face back">Not rows at all: pixels and sound. Same show, a completely different <b>kind</b> of data. That's what multi-modal means.</div></div>`);
    v.addEventListener("click", () => v.classList.toggle("flipped"));
    wrap.appendChild(v);
  });

  /* ================================================================ 1.2 */
  const STATE_GRID = {
    AK: [0, 0], ME: [11, 0], WI: [6, 1], VT: [10, 1], NH: [11, 1],
    WA: [1, 2], ID: [2, 2], MT: [3, 2], ND: [4, 2], MN: [5, 2], IL: [6, 2], MI: [7, 2], NY: [9, 2], MA: [10, 2],
    OR: [1, 3], NV: [2, 3], WY: [3, 3], SD: [4, 3], IA: [5, 3], IN: [6, 3], OH: [7, 3], PA: [8, 3], NJ: [9, 3], CT: [10, 3], RI: [11, 3],
    CA: [1, 4], UT: [2, 4], CO: [3, 4], NE: [4, 4], MO: [5, 4], KY: [6, 4], WV: [7, 4], VA: [8, 4], MD: [9, 4], DE: [10, 4],
    AZ: [2, 5], NM: [3, 5], KS: [4, 5], AR: [5, 5], TN: [6, 5], NC: [7, 5], SC: [8, 5], DC: [9, 5],
    OK: [4, 6], LA: [5, 6], MS: [6, 6], AL: [7, 6], GA: [8, 6],
    HI: [0, 7], TX: [4, 7], FL: [9, 7], PR: [11, 7],
  };
  const STATE_ABBR = {
    Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA", Colorado: "CO", Connecticut: "CT",
    Delaware: "DE", "D.C.": "DC", Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN",
    Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD", Massachusetts: "MA",
    Michigan: "MI", Minnesota: "MN", Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV",
    "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC",
    "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Puerto Rico": "PR",
    "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT",
    Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
  };

  ST.register("1.2", (stage) => {
    const all = D.census;
    const seasons = [...new Set(all.map((r) => r.s))].sort((a, b) => a - b);
    stage.innerHTML = `
      <p class="panel-title">Census of the island</p>
      <label class="slider" for="cs">Highlight a season</label>
      <select id="cs"><option value="">All seasons only</option>${seasons.map((s) => `<option value="${s}">Season ${s}</option>`).join("")}</select>
      <div class="legend" style="margin-top:10px"><span><i style="background:${C.theory}"></i>All US castaways</span><span><i style="background:${C.observed}"></i>Selected season</span></div>
      <div id="hist"></div>
      <p class="note" id="age-note"></p>
      <p class="panel-title" style="margin-top:14px">Where they came from</p>
      <div id="map"></div>
      <p class="note" id="map-note"></p>`;

    // histogram
    const W = 600, H = 230, m = { l: 40, r: 10, t: 10, b: 30 };
    const svg = svgBox(stage.querySelector("#hist"), W, H, "Histogram of castaway ages");
    const ages = all.filter((r) => r.a).map((r) => r.a);
    const x = d3.scaleLinear().domain([18, 76]).range([m.l, W - m.r]);
    const bin = d3.bin().domain(x.domain()).thresholds(d3.range(18, 77, 3));
    const bins = bin(ages);
    const y = d3.scaleLinear().domain([0, d3.max(bins, (b) => b.length)]).nice().range([H - m.b, m.t]);
    svg.append("g").attr("class", "axis").attr("transform", `translate(0,${H - m.b})`).call(d3.axisBottom(x).ticks(10));
    svg.append("g").attr("class", "axis").attr("transform", `translate(${m.l},0)`).call(d3.axisLeft(y).ticks(5));
    svg.append("g").selectAll("rect").data(bins).join("rect")
      .attr("x", (b) => x(b.x0) + 1).attr("width", (b) => x(b.x1) - x(b.x0) - 2)
      .attr("y", (b) => y(b.length)).attr("height", (b) => y(0) - y(b.length)).attr("fill", C.theorySoft).attr("stroke", C.theory);
    const sel = svg.append("g");
    const meanAll = ST.mean(ages);
    svg.append("line").attr("x1", x(meanAll)).attr("x2", x(meanAll)).attr("y1", m.t).attr("y2", H - m.b).attr("stroke", C.theory).attr("stroke-dasharray", "4 3").attr("stroke-width", 2);
    svg.append("text").attr("x", x(meanAll) + 5).attr("y", m.t + 12).attr("font-size", 12).attr("fill", "#2f86c9").attr("font-weight", 700).text(`average ${meanAll.toFixed(1)}`);

    // tile map
    const cellW = 46, MW = 12 * cellW + 4, MH = 8 * cellW + 4;
    const map = svgBox(stage.querySelector("#map"), MW, MH, "Tile map of home states");
    const counts = d3.rollup(all.filter((r) => STATE_ABBR[r.st]), (v) => v.length, (r) => STATE_ABBR[r.st]);
    const maxC = d3.max([...counts.values()]);
    const col = d3.scaleSequentialSqrt([0, maxC], d3.interpolateRgb("#eef6fd", "#3d8fd1"));
    const tiles = map.selectAll("g").data(Object.entries(STATE_GRID)).join("g")
      .attr("transform", ([, [c, r]]) => `translate(${c * cellW + 2},${r * cellW + 2})`);
    tiles.append("rect").attr("width", cellW - 4).attr("height", cellW - 4).attr("rx", 6)
      .attr("fill", ([s]) => col(counts.get(s) || 0)).attr("stroke", "#fff").attr("stroke-width", 2);
    tiles.append("text").attr("x", (cellW - 4) / 2).attr("y", (cellW - 4) / 2 + 4).attr("text-anchor", "middle").attr("font-size", 12)
      .attr("font-weight", 700).attr("fill", ([s]) => ((counts.get(s) || 0) > maxC * 0.55 ? "#fff" : C.ink)).text(([s]) => s);
    tipOn(tiles, ([s]) => `<b>${s}</b>: ${counts.get(s) || 0} castaways`);
    const outside = all.filter((r) => r.st && !STATE_ABBR[r.st]).length;

    function update() {
      const s = +stage.querySelector("#cs").value;
      const rows = s ? all.filter((r) => r.s === s) : [];
      const sa = rows.filter((r) => r.a).map((r) => r.a);
      const sb = bin(sa);
      const ys = d3.scaleLinear().domain([0, d3.max(bins, (b) => b.length)]).range([0, y(0) - y(d3.max(bins, (b) => b.length))]);
      // draw the season on its own scale so a small cast is visible: scale to 60% of the tallest bar
      const maxS = d3.max(sb, (b) => b.length) || 1;
      const k = (0.6 * d3.max(bins, (b) => b.length)) / maxS;
      sel.selectAll("rect").data(s ? sb : []).join("rect")
        .attr("x", (b) => x(b.x0) + 6).attr("width", (b) => Math.max(0, x(b.x1) - x(b.x0) - 12))
        .attr("fill", C.observed).attr("opacity", 0.9)
        .transition().duration(300)
        .attr("y", (b) => y(0) - ys(b.length * k)).attr("height", (b) => ys(b.length * k));
      stage.querySelector("#age-note").innerHTML = s
        ? `Season ${s}: ${rows.length} castaways, average age <b class="observed">${ST.mean(sa).toFixed(1)}</b> vs. <b class="theory">${meanAll.toFixed(1)}</b> overall. (Green bars are scaled up so one cast is visible.)`
        : `All US castaways: ${ages.length} appearances, average age <b class="theory">${meanAll.toFixed(1)}</b>.`;
      const sStates = new Set(rows.map((r) => STATE_ABBR[r.st]).filter(Boolean));
      tiles.select("rect").transition().duration(250)
        .attr("stroke", ([st]) => (sStates.has(st) ? C.observed : "#fff")).attr("stroke-width", ([st]) => (sStates.has(st) ? 4 : 2));
      stage.querySelector("#map-note").innerHTML = (s ? `Green outlines: home states in Season ${s}. ` : "") +
        `Darker = more castaways. ${outside} castaways came from outside the US.`;
    }
    stage.querySelector("#cs").addEventListener("change", update);
    update();
  });

  /* ================================================================ 1.3 */
  ST.register("1.3", (stage) => {
    stage.innerHTML = `
      <p class="panel-title">Shot in the Dark</p>
      <div class="scrolls" id="scrolls"></div>
      <div class="btn-row">
        <button class="btn primary" id="p1">Play the shot</button>
        <button class="btn" id="p100">Play 100 times</button>
        <button class="btn" id="reset">Reset</button>
        <button class="btn torch" id="real" disabled>Load real data</button>
      </div>
      <div class="legend"><span><i style="background:${C.observed}"></i><span id="obs-label">Observed</span></span><span><i style="background:${C.theory}"></i>True probability</span></div>
      <div id="bars"></div>
      <p class="note" id="sitd-note">0 plays.</p>
      <div id="real-wrap" style="display:none">
        <button class="btn torch" id="dedup">Count each player's shot once</button>
        <div class="sitd-table"><table class="data"><thead><tr><th>Season</th><th>Ep</th><th>Castaway</th><th>Result</th></tr></thead><tbody id="sitd-rows"></tbody></table></div>
      </div>`;

    const scrollsEl = stage.querySelector("#scrolls");
    for (let i = 0; i < 6; i++) scrollsEl.appendChild(ST.el("div", { class: "scroll" }, "?"));
    let safe = 0, total = 0, mode = "sim";

    const W = 600, H = 230, m = { l: 44, r: 10, t: 16, b: 30 };
    const svg = svgBox(stage.querySelector("#bars"), W, H, "Observed versus true probability");
    const x0 = d3.scaleBand().domain(["Safe", "Not safe"]).range([m.l, W - m.r]).padding(0.3);
    const x1 = d3.scaleBand().domain(["obs", "true"]).range([0, x0.bandwidth()]).padding(0.08);
    const y = d3.scaleLinear().domain([0, 1]).range([H - m.b, m.t]);
    svg.append("g").attr("class", "axis").attr("transform", `translate(0,${H - m.b})`).call(d3.axisBottom(x0));
    svg.append("g").attr("class", "axis").attr("transform", `translate(${m.l},0)`).call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".0%")));
    const groups = svg.selectAll("g.grp").data(["Safe", "Not safe"]).join("g").attr("class", "grp").attr("transform", (d) => `translate(${x0(d)},0)`);
    groups.append("rect").attr("class", "true").attr("x", x1("true")).attr("width", x1.bandwidth()).attr("fill", C.theory)
      .attr("y", (d) => y(d === "Safe" ? 1 / 6 : 5 / 6)).attr("height", (d) => y(0) - y(d === "Safe" ? 1 / 6 : 5 / 6));
    const obs = groups.append("rect").attr("class", "obs").attr("x", x1("obs")).attr("width", x1.bandwidth()).attr("fill", C.observed).attr("y", y(0)).attr("height", 0);
    const obsTxt = groups.append("text").attr("x", x1("obs") + x1.bandwidth() / 2).attr("text-anchor", "middle").attr("font-size", 13).attr("font-weight", 700).attr("fill", "#23935f");
    groups.append("text").attr("x", x1("true") + x1.bandwidth() / 2).attr("text-anchor", "middle").attr("font-size", 13).attr("font-weight", 700).attr("fill", "#2f86c9")
      .attr("y", (d) => y(d === "Safe" ? 1 / 6 : 5 / 6) - 6).text((d) => (d === "Safe" ? "1/6" : "5/6"));

    function draw() {
      const p = total ? safe / total : 0;
      const vals = { Safe: p, "Not safe": total ? 1 - p : 0 };
      obs.transition().duration(200).attr("y", (d) => y(vals[d])).attr("height", (d) => y(0) - y(vals[d]));
      obsTxt.transition().duration(200).attr("y", (d) => y(vals[d]) - 6).text((d) => (total ? ST.pct(vals[d]) : ""));
    }
    function playOnce(animate) {
      const win = Math.floor(Math.random() * 6);
      if (animate) {
        [...scrollsEl.children].forEach((s, i) => {
          s.className = "scroll open " + (i === win ? "safe" : "out");
          s.textContent = i === win ? "SAFE" : "✕";
        });
      }
      const drew = Math.floor(Math.random() * 6);
      if (drew === win) safe++;
      total++;
      if (animate) {
        const picked = scrollsEl.children[drew];
        picked.style.outline = "3px solid " + C.torch;
        setTimeout(() => { picked.style.outline = ""; }, 600);
      }
    }
    function afterPlay() {
      draw();
      stage.querySelector("#sitd-note").textContent = `${total} plays · ${safe} safe (${ST.pct(safe / total, 1)})`;
      if (total >= 20) { ST.reveal("sitd-played"); stage.querySelector("#real").disabled = false; }
    }
    stage.querySelector("#p1").addEventListener("click", () => { if (mode !== "sim") return; playOnce(true); afterPlay(); });
    stage.querySelector("#p100").addEventListener("click", async (e) => {
      if (mode !== "sim") return;
      e.target.disabled = true;
      for (let i = 0; i < 100; i++) { playOnce(i % 10 === 0); if (i % 5 === 0) { afterPlay(); await ST.sleep(30); } }
      afterPlay();
      e.target.disabled = false;
    });
    stage.querySelector("#reset").addEventListener("click", () => {
      if (mode !== "sim") return;
      safe = 0; total = 0; draw();
      [...scrollsEl.children].forEach((s) => { s.className = "scroll"; s.textContent = "?"; });
      stage.querySelector("#sitd-note").textContent = "0 plays.";
    });

    // real data
    const rows = D.sitd;
    const tbody = stage.querySelector("#sitd-rows");
    stage.querySelector("#real").addEventListener("click", (e) => {
      mode = "real";
      e.target.disabled = true;
      ["#p1", "#p100", "#reset"].forEach((id) => (stage.querySelector(id).disabled = true));
      stage.querySelector("#real-wrap").style.display = "block";
      stage.querySelector("#obs-label").textContent = "Real Survivor rows";
      tbody.innerHTML = rows.map((r) => `<tr class="${r.safe ? "safe" : ""}"><td>${r.season}</td><td>${r.episode}</td><td>${r.castaway}</td><td>${r.safe ? "Safe" : "Not safe"}</td></tr>`).join("");
      safe = rows.filter((r) => r.safe).length; total = rows.length; draw();
      stage.querySelector("#sitd-note").innerHTML = `Real vote-history rows: <b>${safe} safe out of ${total}</b> (${ST.pct(safe / total)}).`;
      ST.reveal("sitd-real");
    });
    stage.querySelector("#dedup").addEventListener("click", (e) => {
      e.target.disabled = true;
      const seen = new Set();
      const trs = [...tbody.children];
      let s = 0, t = 0;
      rows.forEach((r, i) => {
        const k = r.season + "|" + r.castaway;
        if (seen.has(k)) trs[i].classList.add("dup");
        else { seen.add(k); t++; if (r.safe) s++; }
      });
      safe = s; total = t; draw();
      stage.querySelector("#obs-label").textContent = "Real shots, each counted once";
      stage.querySelector("#sitd-note").innerHTML = `Each player's shot counted once: <b>${s} safe out of ${t}</b> = ${ST.pct(s / t, 1)}. The true probability is 1/6 = 16.7%.`;
      ST.reveal("sitd-dedup");
    });
    draw();
  });

  /* ================================================================ 1.4 */
  ST.register("1.4", (stage) => {
    const votes = D.blindside;
    stage.innerHTML = `
      <p class="panel-title">Season 16 · Episode 10 · click each castaway</p>
      <div id="fire"></div>
      <div class="btn-row"><button class="btn" id="all">Reveal all votes</button><button class="btn torch" id="snow" disabled>Show Snow's map</button></div>
      <p class="note" id="tally">0 of ${votes.length} votes revealed.</p>
      <div id="snow-wrap" style="display:none"><p class="panel-title" style="margin-top:14px">Broad Street, 1854 (simplified, illustrative)</p><div id="snowmap"></div>
      <p class="note">Each dot is a cholera case. The cases crowd around one pump. Snow saw the pattern only because he plotted the evidence.</p></div>`;

    const W = 600, H = 400, cx = W / 2, cy = H / 2, R = 150;
    const svg = svgBox(stage.querySelector("#fire"), W, H, "Tribal council vote map");
    svg.append("defs").html(`
      <marker id="arr-g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${C.observed}"/></marker>
      <marker id="arr-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#8fa3b6"/></marker>`);
    // fire
    svg.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 28).attr("fill", "#fde6cf");
    svg.append("text").attr("x", cx).attr("y", cy + 9).attr("text-anchor", "middle").attr("font-size", 28).text("🔥");
    const names = votes.map((v) => v.voter);
    const pos = {};
    names.forEach((n, i) => {
      const a = (i / names.length) * 2 * Math.PI - Math.PI / 2;
      pos[n] = [cx + R * Math.cos(a), cy + R * Math.sin(a)];
    });
    const arrows = svg.append("g");
    const tally = {};
    const nodes = svg.selectAll("g.voter").data(votes).join("g").attr("class", "voter").attr("tabindex", 0)
      .attr("role", "button").attr("aria-label", (d) => `Reveal ${d.voter}'s vote`)
      .attr("transform", (d) => `translate(${pos[d.voter]})`);
    nodes.append("circle").attr("r", 30).attr("fill", "#fff").attr("stroke", C.grey).attr("stroke-width", 3);
    nodes.append("text").attr("text-anchor", "middle").attr("y", 5).attr("font-size", 13).attr("font-weight", 700).attr("fill", C.ink).text((d) => d.voter);
    nodes.filter((d) => d.immune).append("text").attr("text-anchor", "middle").attr("y", -36).attr("font-size", 11).attr("fill", C.torch).attr("font-weight", 700).text("IMMUNE");
    const countLabel = nodes.append("text").attr("text-anchor", "middle").attr("y", 48).attr("font-size", 12).attr("font-weight", 700).attr("fill", C.danger);

    let revealed = 0;
    const done = new Set();
    function reveal(d) {
      if (done.has(d.voter)) return;
      done.add(d.voter);
      revealed++;
      tally[d.target] = (tally[d.target] || 0) + 1;
      const [x1, y1] = pos[d.voter], [x2, y2] = pos[d.target];
      const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
      const sx = x1 + (dx / L) * 32, sy = y1 + (dy / L) * 32, ex = x2 - (dx / L) * 34, ey = y2 - (dy / L) * 34;
      const mx = (sx + ex) / 2 + (cx - (sx + ex) / 2) * 0.35, my = (sy + ey) / 2 + (cy - (sy + ey) / 2) * 0.35;
      const p = arrows.append("path").datum(d).attr("d", `M${sx},${sy} Q${mx},${my} ${ex},${ey}`)
        .attr("fill", "none").attr("stroke", "#8fa3b6").attr("stroke-width", 2.5).attr("marker-end", "url(#arr-b)");
      const len = p.node().getTotalLength();
      p.attr("stroke-dasharray", len).attr("stroke-dashoffset", len).transition().duration(450).attr("stroke-dashoffset", 0);
      nodes.filter((n) => n.voter === d.voter).select("circle").attr("stroke", "#8fa3b6");
      countLabel.text((n) => (tally[n.voter] ? `${tally[n.voter]} vote${tally[n.voter] > 1 ? "s" : ""}` : ""));
      stage.querySelector("#tally").textContent = `${revealed} of ${votes.length} votes revealed.`;
      if (revealed === votes.length) finish();
    }
    function finish() {
      const [top] = Object.entries(tally).sort((a, b) => b[1] - a[1]);
      const out = top[0];
      setTimeout(() => {
        arrows.selectAll("path").filter((d) => d.target === out).transition().duration(400)
          .attr("stroke", C.observed).attr("stroke-width", 4).attr("marker-end", "url(#arr-g)");
        nodes.filter((d) => votes.some((v) => v.voter === d.voter && v.target === out)).select("circle").transition().attr("fill", C.observedSoft).attr("stroke", C.observed);
        nodes.filter((d) => d.voter === out).select("circle").transition().attr("fill", "#3a3a3a").attr("stroke", "#3a3a3a");
        nodes.filter((d) => d.voter === out).select("text").attr("fill", "#fff");
        const other = Object.entries(tally).filter(([k]) => k !== out).map(([k, v]) => `${v} for ${k}`).join(", ");
        stage.querySelector("#tally").innerHTML = `<b>${out} is voted out, ${top[1]}–${votes.length - top[1]}.</b> The green bloc of ${top[1]} decided it (${other}).`;
        stage.querySelector("#snow").disabled = false;
        ST.reveal("blindside-done");
      }, 500);
    }
    nodes.on("click", (ev, d) => reveal(d)).on("keydown", (ev, d) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); reveal(d); } });
    stage.querySelector("#all").addEventListener("click", async () => {
      for (const v of votes) { reveal(v); await ST.sleep(180); }
    });

    stage.querySelector("#snow").addEventListener("click", (e) => {
      e.target.disabled = true;
      stage.querySelector("#snow-wrap").style.display = "block";
      const SW = 600, SH = 300;
      const s = svgBox(stage.querySelector("#snowmap"), SW, SH, "Simplified Broad Street cholera map");
      s.append("rect").attr("width", SW).attr("height", SH).attr("fill", "#faf7f0").attr("rx", 10);
      const streets = [[0, 90, SW, 70], [0, 210, SW, 230], [140, 0, 120, SH], [330, 0, 350, SH], [480, 0, 470, SH], [0, 150, SW, 150]];
      streets.forEach(([a, b, c, d]) => s.append("line").attr("x1", a).attr("y1", b).attr("x2", c).attr("y2", d).attr("stroke", "#e3dccb").attr("stroke-width", 12).attr("stroke-linecap", "round"));
      s.append("text").attr("x", 20).attr("y", 144).attr("font-size", 12).attr("fill", C.muted).text("Broad Street");
      const px = 300, py = 150;
      // seeded pseudo-random cases clustered near the pump
      let seed = 7;
      const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
      const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(2 * Math.PI * rnd());
      const cases = d3.range(140).map(() => [px + gauss() * 55, py + gauss() * 40]).concat(d3.range(14).map(() => [rnd() * SW, rnd() * SH]));
      s.selectAll("circle.case").data(cases).join("circle").attr("class", "case").attr("cx", (d) => d[0]).attr("cy", (d) => d[1]).attr("r", 0)
        .attr("fill", C.danger).attr("opacity", 0.7).transition().delay((d, i) => i * 8).attr("r", 3.2);
      const pump = s.append("g").attr("transform", `translate(${px},${py})`);
      pump.append("circle").attr("r", 11).attr("fill", C.theory).attr("stroke", "#fff").attr("stroke-width", 3);
      pump.append("text").attr("y", -18).attr("text-anchor", "middle").attr("font-size", 13).attr("font-weight", 700).attr("fill", "#2f86c9").text("the pump");
    });
  });

  /* ================================================================ 1.5 */
  ST.register("1.5", (stage) => {
    const ages = D.ages;
    const genders = D.genders;
    const fb = D.firstBoot;
    const n = fb.ages.length;
    const obsAge = ST.mean(fb.ages);
    const obsFem = fb.female;
    let mode = "age";
    let results = [];

    stage.innerHTML = `
      <p class="panel-title">Shuffle the tribe · permutation test</p>
      <div class="btn-row" role="group" aria-label="What to test">
        <button class="btn primary" id="m-age">Test age</button><button class="btn" id="m-gen">Test gender</button>
      </div>
      <p style="margin:4px 0" id="null-q"></p>
      <div class="btn-row">
        <button class="btn" id="s1">Shuffle once</button><button class="btn" id="s100">Shuffle 100×</button>
        <button class="btn torch" id="s1000">Shuffle 1,000×</button><button class="btn" id="sr">Reset</button>
      </div>
      <div class="legend"><span><i style="background:${C.grey}"></i>What chance produced</span><span><i style="background:${C.theory}"></i>What really happened</span></div>
      <div id="null-hist"></div>
      <div style="display:flex;gap:24px;align-items:flex-end">
        <div><div class="note">Shuffles</div><div class="big-num" id="nshuf">0</div></div>
        <div><div class="note">p-value: chance did this at least as extremely</div><div class="big-num" id="pval">–</div></div>
      </div>
      <div id="disc-wrap" style="display:none;margin-top:26px">
        <p class="panel-title">Fisher's linear discriminator · drag the two orange handles</p>
        <div class="legend"><span><i style="background:${C.danger}"></i>Voted out 1st–3rd</span><span><i style="background:${C.observed}"></i>Made the jury</span></div>
        <div id="disc"></div>
        <p class="note" id="disc-note"></p>
      </div>`;

    const W = 600, H = 240, m = { l: 40, r: 12, t: 22, b: 32 };
    const svg = svgBox(stage.querySelector("#null-hist"), W, H, "Histogram of shuffled results");
    const gx = svg.append("g").attr("class", "axis").attr("transform", `translate(0,${H - m.b})`);
    const gy = svg.append("g").attr("class", "axis").attr("transform", `translate(${m.l},0)`);
    const bars = svg.append("g");
    const obsLine = svg.append("g");
    let x, bin;

    function setup() {
      results = [];
      if (mode === "age") {
        x = d3.scaleLinear().domain([29, 38]).range([m.l, W - m.r]);
        bin = d3.bin().domain(x.domain()).thresholds(d3.range(29, 38.01, 0.3));
        stage.querySelector("#null-q").innerHTML = `Real first boots: average age <b class="theory">${obsAge.toFixed(1)}</b> (everyone: ${ST.mean(ages).toFixed(1)}). Each shuffle: average age of ${n} random castaways.`;
      } else {
        x = d3.scaleLinear().domain([12, 38]).range([m.l, W - m.r]);
        bin = d3.bin().domain(x.domain()).thresholds(d3.range(12, 38.01, 1));
        stage.querySelector("#null-q").innerHTML = `Real first boots: <b class="theory">${obsFem} of ${fb.n}</b> were women. Each shuffle: number of women among ${fb.n} random castaways.`;
      }
      gx.call(d3.axisBottom(x).ticks(9));
      const v = mode === "age" ? obsAge : obsFem;
      obsLine.selectAll("*").remove();
      obsLine.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", m.t - 6).attr("y2", H - m.b).attr("stroke", C.theory).attr("stroke-width", 3);
      obsLine.append("text").attr("x", x(v)).attr("y", m.t - 10).attr("text-anchor", "end").attr("dx", -4).attr("font-size", 12).attr("font-weight", 700).attr("fill", "#2f86c9").text(mode === "age" ? `real: ${v.toFixed(1)}` : `real: ${v}`);
      draw();
    }
    function one() {
      if (mode === "age") return ST.mean(ST.sample(ages, n));
      return ST.sample(genders, fb.n).filter((g) => g === "Female").length;
    }
    function draw() {
      const b = bin(results);
      const y = d3.scaleLinear().domain([0, Math.max(5, d3.max(b, (d) => d.length) || 0)]).nice().range([H - m.b, m.t]);
      gy.call(d3.axisLeft(y).ticks(4));
      const v = mode === "age" ? obsAge : obsFem;
      bars.selectAll("rect").data(b).join("rect")
        .attr("x", (d) => x(d.x0) + 1).attr("width", (d) => Math.max(0, x(d.x1) - x(d.x0) - 2))
        .attr("y", (d) => y(d.length)).attr("height", (d) => y(0) - y(d.length))
        .attr("fill", (d) => (d.x0 >= v - 1e-9 || (d.x1 > v && mode === "age") ? "#f3b9b4" : C.grey));
      stage.querySelector("#nshuf").textContent = results.length.toLocaleString();
      const ext = results.filter((r) => r >= v).length;
      stage.querySelector("#pval").textContent = results.length ? (ext / results.length).toFixed(3) : "–";
    }
    async function run(k) {
      const btns = stage.querySelectorAll("#s1,#s100,#s1000");
      btns.forEach((b) => (b.disabled = true));
      const step = Math.max(1, Math.floor(k / 25));
      for (let i = 0; i < k; i++) {
        results.push(one());
        if (i % step === 0) { draw(); await ST.sleep(16); }
      }
      draw();
      btns.forEach((b) => (b.disabled = false));
      if (results.length >= 500 && mode === "age") { ST.reveal("null-done"); showDisc(); }
    }
    stage.querySelector("#s1").addEventListener("click", () => run(1));
    stage.querySelector("#s100").addEventListener("click", () => run(100));
    stage.querySelector("#s1000").addEventListener("click", () => run(1000));
    stage.querySelector("#sr").addEventListener("click", () => { results = []; draw(); });
    const mA = stage.querySelector("#m-age"), mG = stage.querySelector("#m-gen");
    mA.addEventListener("click", () => { mode = "age"; mA.classList.add("primary"); mG.classList.remove("primary"); setup(); });
    mG.addEventListener("click", () => { mode = "gen"; mG.classList.add("primary"); mA.classList.remove("primary"); setup(); });
    setup();

    // ---- linear discriminator ----
    let discBuilt = false;
    function showDisc() {
      if (discBuilt) return;
      discBuilt = true;
      stage.querySelector("#disc-wrap").style.display = "block";
      const pts = D.scatter;
      const DW = 600, DH = 300, dm = { l: 44, r: 12, t: 12, b: 34 };
      const s = svgBox(stage.querySelector("#disc"), DW, DH, "Scatter plot of age and challenge wins");
      const xs = d3.scaleLinear().domain([18, 72]).range([dm.l, DW - dm.r]);
      const ys = d3.scaleLinear().domain([0, d3.max(pts, (p) => p.w) + 1]).range([DH - dm.b, dm.t]);
      s.append("g").attr("class", "axis").attr("transform", `translate(0,${DH - dm.b})`).call(d3.axisBottom(xs).ticks(8));
      s.append("g").attr("class", "axis").attr("transform", `translate(${dm.l},0)`).call(d3.axisLeft(ys).ticks(5));
      s.append("text").attr("x", DW - dm.r).attr("y", DH - 4).attr("text-anchor", "end").attr("font-size", 12).attr("fill", C.muted).text("age →");
      s.append("text").attr("x", dm.l + 4).attr("y", dm.t + 10).attr("font-size", 12).attr("fill", C.muted).text("↑ challenge wins");
      // jitter so stacked points are visible
      const jit = pts.map((p, i) => ({ ...p, jx: ((i * 7919) % 100) / 100 - 0.5, jy: ((i * 104729) % 100) / 100 - 0.5 }));
      s.append("g").selectAll("circle").data(jit).join("circle")
        .attr("cx", (p) => xs(p.a + p.jx * 0.8)).attr("cy", (p) => ys(p.w + p.jy * 0.8)).attr("r", 3)
        .attr("fill", (p) => (p.g === "jury" ? C.observed : C.danger)).attr("opacity", 0.55);
      const h = [{ x: 20, y: 6 }, { x: 70, y: 4 }]; // in data units
      const line = s.append("line").attr("stroke", C.torch).attr("stroke-width", 3);
      const handles = s.selectAll("circle.h").data(h).join("circle").attr("class", "h").attr("r", 9)
        .attr("fill", C.torch).attr("stroke", "#fff").attr("stroke-width", 3).style("cursor", "grab");
      function update() {
        line.attr("x1", xs(h[0].x)).attr("y1", ys(h[0].y)).attr("x2", xs(h[1].x)).attr("y2", ys(h[1].y));
        handles.attr("cx", (d) => xs(d.x)).attr("cy", (d) => ys(d.y));
        // which side of the line is each point on?
        const side = (p) => Math.sign((h[1].x - h[0].x) * (p.w - h[0].y) - (h[1].y - h[0].y) * (p.a - h[0].x));
        let a = 0, b = 0;
        pts.forEach((p) => {
          const sd = side(p);
          if ((p.g === "jury") === (sd > 0)) a++; else b++;
        });
        const wrong = Math.min(a, b);
        stage.querySelector("#disc-note").innerHTML = `<b>${wrong} of ${pts.length}</b> points are on the wrong side (${ST.pct(wrong / pts.length)}). Challenge wins separate the groups much better than age does.`;
      }
      handles.call(d3.drag().on("drag", (ev, d) => {
        d.x = Math.max(18, Math.min(72, xs.invert(ev.x)));
        d.y = Math.max(0, Math.min(ys.domain()[1], ys.invert(ev.y)));
        update();
      }));
      update();
    }
  });

  /* ================================================================ 1.6 */
  ST.register("1.6", (stage) => {
    const pool = D.ages;
    const mu = ST.mean(pool);
    const sd = Math.sqrt(ST.mean(pool.map((a) => (a - mu) ** 2)));
    const zCrit = 1.645; // one-sided test at 5%
    stage.innerHTML = `
      <p class="panel-title">Power and confidence</p>
      <label class="slider">First boots in your data: <b id="n-v"></b></label><input type="range" id="n" min="10" max="300" step="1" value="49">
      <label class="slider">True age gap (years older than average): <b id="gap-v"></b></label><input type="range" id="gap" min="0" max="6" step="0.1" value="2.8">
      <div style="display:flex;gap:28px;align-items:flex-end;margin:12px 0">
        <div><div class="note">Power (chance you catch the gap)</div><div class="big-num" id="pow"></div></div>
        <div><div class="note">Type II risk (you miss it)</div><div class="big-num" id="beta" style="color:var(--danger)"></div></div>
      </div>
      <div class="legend"><span><i style="background:${C.theory}"></i>If age didn't matter (null)</span><span><i style="background:${C.observed}"></i>If the gap is real</span><span><i style="background:#f3b9b4"></i>Type I (5%)</span><span><i style="background:#cfd6de"></i>Type II</span></div>
      <div id="curves"></div>
      <p class="panel-title" style="margin-top:16px">Confidence intervals from 20 simulated casts</p>
      <div class="btn-row"><button class="btn primary" id="ci-go">Draw 20 casts</button></div>
      <div id="cis"></div>
      <p class="note" id="ci-note">Each bar is a 95% confidence interval for the true average age of first boots. The green line is the true value.</p>`;

    const W = 600, H = 220, m = { l: 20, r: 20, t: 14, b: 30 };
    const svg = svgBox(stage.querySelector("#curves"), W, H, "Null and alternative distributions");
    const x = d3.scaleLinear().domain([mu - 6, mu + 9]).range([m.l, W - m.r]);
    const gx = svg.append("g").attr("class", "axis").attr("transform", `translate(0,${H - m.b})`);
    const areaG = svg.append("g");
    const pdf = (v, mean, s) => Math.exp(-0.5 * ((v - mean) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));
    const Phi = (z) => 0.5 * (1 + erf(z / Math.SQRT2));
    function erf(z) { const t = 1 / (1 + 0.3275911 * Math.abs(z)); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z); return z >= 0 ? y : -y; }

    function draw() {
      const n = +stage.querySelector("#n").value, gap = +stage.querySelector("#gap").value;
      stage.querySelector("#n-v").textContent = n + (n === 49 ? " (the real number)" : "");
      stage.querySelector("#gap-v").textContent = gap.toFixed(1);
      const se = sd / Math.sqrt(n);
      const crit = mu + zCrit * se;
      const power = 1 - Phi((crit - (mu + gap)) / se);
      stage.querySelector("#pow").textContent = ST.pct(power);
      stage.querySelector("#beta").textContent = ST.pct(1 - power);
      const xsr = d3.range(x.domain()[0], x.domain()[1], 0.05);
      const peak = pdf(mu, mu, se);
      const y = d3.scaleLinear().domain([0, peak * 1.1]).range([H - m.b, m.t]);
      gx.call(d3.axisBottom(x).ticks(8).tickFormat((d) => d.toFixed(0)));
      const area = (mean, f) => d3.area().x((v) => x(v)).y0(y(0)).y1((v) => (f(v) ? y(pdf(v, mean, se)) : y(0)))(xsr);
      const line = (mean) => d3.line().x((v) => x(v)).y((v) => y(pdf(v, mean, se)))(xsr);
      areaG.selectAll("*").remove();
      areaG.append("path").attr("d", area(mu + gap, (v) => v < crit)).attr("fill", "#cfd6de").attr("opacity", 0.8);
      areaG.append("path").attr("d", area(mu, (v) => v >= crit)).attr("fill", "#f3b9b4").attr("opacity", 0.9);
      areaG.append("path").attr("d", line(mu)).attr("fill", "none").attr("stroke", C.theory).attr("stroke-width", 2.5);
      areaG.append("path").attr("d", line(mu + gap)).attr("fill", "none").attr("stroke", C.observed).attr("stroke-width", 2.5);
      areaG.append("line").attr("x1", x(crit)).attr("x2", x(crit)).attr("y1", m.t).attr("y2", H - m.b).attr("stroke", C.ink).attr("stroke-dasharray", "4 3");
      areaG.append("text").attr("x", x(crit) + 4).attr("y", m.t + 10).attr("font-size", 12).attr("fill", C.ink).text("decision line");
      areaG.append("text").attr("x", x(mu)).attr("y", H - m.b - 6).attr("text-anchor", "middle").attr("font-size", 11).attr("fill", "#2f86c9").text(`null ${mu.toFixed(1)}`);
    }
    stage.querySelector("#n").addEventListener("input", draw);
    stage.querySelector("#gap").addEventListener("input", draw);
    draw();

    const CW = 600, CH = 260, cm = { l: 20, r: 20, t: 8, b: 28 };
    const cs = svgBox(stage.querySelector("#cis"), CW, CH, "Confidence intervals");
    const cx = d3.scaleLinear().domain([mu - 8, mu + 12]).range([cm.l, CW - cm.r]);
    const cgx = cs.append("g").attr("class", "axis").attr("transform", `translate(0,${CH - cm.b})`).call(d3.axisBottom(cx).ticks(8));
    const cg = cs.append("g");
    stage.querySelector("#ci-go").addEventListener("click", () => {
      const n = +stage.querySelector("#n").value, gap = +stage.querySelector("#gap").value;
      const truth = mu + gap;
      const rows = d3.range(20).map(() => {
        const smp = ST.sample(pool, Math.min(n, pool.length)).map((a) => a + gap);
        const m0 = ST.mean(smp);
        const s0 = Math.sqrt(ST.mean(smp.map((a) => (a - m0) ** 2)));
        const half = 1.96 * s0 / Math.sqrt(smp.length);
        return { lo: m0 - half, hi: m0 + half, m: m0 };
      });
      const rowH = (CH - cm.t - cm.b) / 20;
      cg.selectAll("*").remove();
      cg.append("line").attr("x1", cx(truth)).attr("x2", cx(truth)).attr("y1", cm.t).attr("y2", CH - cm.b).attr("stroke", C.observed).attr("stroke-width", 2.5);
      rows.forEach((r, i) => {
        const miss = r.lo > truth || r.hi < truth;
        cg.append("line").attr("x1", cx(r.m)).attr("x2", cx(r.m)).attr("y1", cm.t + i * rowH + rowH / 2).attr("y2", cm.t + i * rowH + rowH / 2)
          .attr("stroke", miss ? C.danger : C.theory).attr("stroke-width", 5).attr("stroke-linecap", "round")
          .transition().delay(i * 40).duration(300).attr("x1", cx(r.lo)).attr("x2", cx(r.hi));
      });
      const misses = rows.filter((r) => r.lo > truth || r.hi < truth).length;
      const avgW = ST.mean(rows.map((r) => r.hi - r.lo));
      stage.querySelector("#ci-note").innerHTML = `Average interval width: <b>${avgW.toFixed(1)} years</b>. ${20 - misses} of 20 intervals caught the true value (about 19 of 20 is expected for 95%). Try a bigger or smaller cast size and draw again.`;
    });
  });

  /* ================================================================ 1.7 */
  ST.register("1.7", (stage) => {
    const chain = D.chain;
    stage.innerHTML = `
      <p class="panel-title">Two ways to find Season 20's winner</p>
      <div class="btn-row"><button class="btn torch" id="reorg">Reorganize storage</button><button class="btn" id="reset">Reset</button></div>
      <h4 style="margin:12px 0 4px">1 · The pointer trail (IMS style)</h4>
      <p class="note" style="margin:0 0 8px">Start at the Season 20 record. Each record stores the <i>address</i> of the next one. Follow it until you reach the winner.</p>
      <div class="btn-row"><button class="btn primary" id="follow">Follow pointer →</button><span class="note" id="hops" style="align-self:center">0 hops</span></div>
      <div class="mem" id="mem"></div>
      <p id="ptr-msg" style="min-height:1.4em;margin:8px 0 0"></p>
      <h4 style="margin:18px 0 4px">2 · Ask the table (Codd style)</h4>
      <div class="query-box">
        <code>winner WHERE season = 20</code>
        <button class="btn primary" id="ask">Ask</button>
        <span id="ask-out" style="margin-left:10px;font-weight:700"></span>
      </div>`;

    const hex = () => "0x" + Math.floor(Math.random() * 0xfff).toString(16).toUpperCase().padStart(3, "0");
    let recs, cur, hops, broken;
    function build() {
      const used = new Set();
      const addr = () => { let a; do { a = hex(); } while (used.has(a)); used.add(a); return a; };
      recs = [{ name: "Season 20", result: "Heroes vs. Villains", addr: addr() }]
        .concat(chain.map((c) => ({ name: c.name, result: c.result, addr: addr() })));
      recs.forEach((r, i) => { r.next = recs[i + 1] ? recs[i + 1].addr : null; });
      cur = recs[0]; hops = 0; broken = false;
      render();
      stage.querySelector("#ptr-msg").innerHTML = "";
      stage.querySelector("#follow").disabled = false;
    }
    function render() {
      const mem = stage.querySelector("#mem");
      const visited = new Set();
      for (const r of recs) { visited.add(r); if (r === cur) break; }
      mem.innerHTML = "";
      [...recs].sort((a, b) => a.addr.localeCompare(b.addr)).forEach((r) => {
        const cls = r === cur ? "cell here" : r.result === "Sole Survivor" && r === cur ? "cell goal" : visited.has(r) && !broken ? "cell visited" : "cell";
        mem.appendChild(ST.el("div", { class: cls }, `<div class="addr">${r.addr}</div><div class="nm">${r.name}</div><div class="ptr">${r.next ? "next → " + r.next : "end"}</div>`));
      });
      stage.querySelector("#hops").textContent = `${hops} hop${hops === 1 ? "" : "s"}`;
    }
    stage.querySelector("#follow").addEventListener("click", () => {
      const msg = stage.querySelector("#ptr-msg");
      if (!cur.next) return;
      const nxt = recs.find((r) => r.addr === cur.next);
      if (!nxt) {
        msg.innerHTML = `<span class="err">ERROR: no record at ${cur.next}</span>. The record moved, but this pointer still holds its old address. Every program that followed this trail is now broken.`;
        stage.querySelector("#follow").disabled = true;
        ST.reveal("pointer-broken");
        return;
      }
      cur = nxt; hops++;
      render();
      if (cur.result === "Sole Survivor") {
        msg.innerHTML = `Found it: <b class="observed">${cur.name}</b>, Sole Survivor, after <b>${hops} hops</b>.`;
        stage.querySelector("#follow").disabled = true;
      } else msg.textContent = `${cur.name}: ${cur.result}. Keep following…`;
    });
    stage.querySelector("#ask").addEventListener("click", () => {
      const w = chain.find((c) => c.result === "Sole Survivor");
      stage.querySelector("#ask-out").innerHTML = `→ <span class="observed">${w.name}</span>` + (broken ? " (still works after reorganizing!)" : "");
      if (broken) ST.reveal("pointer-broken");
    });
    stage.querySelector("#reorg").addEventListener("click", () => {
      // move every record to a new address; stored "next" pointers keep the OLD addresses
      // new addresses never reuse an old one, so a stale pointer can't land on the wrong record
      const used = new Set(recs.map((r) => r.addr));
      recs.forEach((r) => { let a; do { a = hex(); } while (used.has(a)); used.add(a); r.addr = a; });
      cur = recs[0]; hops = 0; // start again from the Season 20 record
      broken = true;
      stage.querySelector("#follow").disabled = false;
      stage.querySelector("#ptr-msg").innerHTML = "Storage reorganized: every record moved to a new address. Now try following the pointers, and try asking the table.";
      stage.querySelector("#ask-out").textContent = "";
      render();
    });
    stage.querySelector("#reset").addEventListener("click", build);
    build();
  });
})();
