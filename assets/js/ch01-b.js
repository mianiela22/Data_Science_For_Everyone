/* Chapter 1 interactives, part B: episodes 1.8–1.13 and the end-of-chapter Tribal Council. */
(function () {
  "use strict";
  const D = window.CH01_DATA;
  const C = ST.c;
  const svgBox = (host, W, H, label) => d3.select(host).append("svg").attr("viewBox", `0 0 ${W} ${H}`)
    .attr("width", "100%").attr("role", "img").attr("aria-label", label);

  /* ================================================================ 1.8 */
  ST.register("1.8", (stage) => {
    const st = { A: 1, B: 0, wA: 1, wB: 1, t: 3 };
    const won = { AND: false, OR: false };
    stage.innerHTML = `
      <p class="panel-title">The alliance neuron</p>
      <div class="neuron-grid">
        <button class="switch" id="sA"><span class="dot"></span><span><b>A</b> · My alliance is voting for X</span></button>
        <button class="switch" id="sB"><span class="dot"></span><span><b>B</b> · X is a big threat</span></button>
      </div>
      <div id="neuron"></div>
      <div class="neuron-grid">
        <div><label class="slider">Weight on A: <b id="wA-v"></b></label><input type="range" id="wA" min="-2" max="2" step="0.5"></div>
        <div><label class="slider">Weight on B: <b id="wB-v"></b></label><input type="range" id="wB" min="-2" max="2" step="0.5"></div>
      </div>
      <label class="slider">Threshold: <b id="t-v"></b> <span class="note">(vote X if the weighted sum ≥ threshold)</span></label><input type="range" id="t" min="-1" max="3" step="0.5">
      <p class="panel-title" style="margin-top:16px">Challenges</p>
      <div class="challenge" id="c-and"><b>Challenge 1 · AND:</b> vote X only when <i>both</i> A and B are true.</div>
      <div class="challenge" id="c-or"><b>Challenge 2 · OR:</b> vote X when <i>either</i> is true.</div>
      <table class="data truth" id="truth"><thead><tr><th>A</th><th>B</th><th>Σ</th><th>Neuron says</th><th>AND wants</th><th>OR wants</th></tr></thead><tbody></tbody></table>`;

    ["wA", "wB", "t"].forEach((k) => {
      const inp = stage.querySelector("#" + k);
      inp.value = st[k];
      inp.addEventListener("input", () => { st[k] = +inp.value; draw(); });
    });
    stage.querySelector("#sA").addEventListener("click", () => { st.A = 1 - st.A; draw(); });
    stage.querySelector("#sB").addEventListener("click", () => { st.B = 1 - st.B; draw(); });

    const W = 600, H = 190;
    const svg = svgBox(stage.querySelector("#neuron"), W, H, "Neuron diagram");
    const g = svg.append("g");
    const out = (a, b) => (st.wA * a + st.wB * b >= st.t ? 1 : 0);

    function draw() {
      ["wA", "wB", "t"].forEach((k) => (stage.querySelector(`#${k}-v`).textContent = st[k]));
      stage.querySelector("#sA").classList.toggle("on", !!st.A);
      stage.querySelector("#sB").classList.toggle("on", !!st.B);
      const sum = st.wA * st.A + st.wB * st.B;
      const o = out(st.A, st.B);
      g.selectAll("*").remove();
      const inputs = [["A", st.A, st.wA, 50], ["B", st.B, st.wB, 140]];
      inputs.forEach(([name, val, w, y]) => {
        g.append("line").attr("x1", 90).attr("y1", y).attr("x2", 290).attr("y2", 95)
          .attr("stroke", w >= 0 ? C.theory : C.danger).attr("stroke-width", 1 + Math.abs(w) * 3).attr("opacity", val ? 1 : 0.3);
        g.append("text").attr("x", 190).attr("y", (y + 95) / 2 - 8).attr("text-anchor", "middle").attr("font-size", 13).attr("fill", C.ink).text(`w=${w}`);
        g.append("circle").attr("cx", 70).attr("cy", y).attr("r", 24).attr("fill", val ? C.observed : "#fff").attr("stroke", val ? C.observed : C.grey).attr("stroke-width", 3);
        g.append("text").attr("x", 70).attr("y", y + 5).attr("text-anchor", "middle").attr("font-weight", 700).attr("fill", val ? "#fff" : C.ink).text(`${name}=${val}`);
      });
      g.append("circle").attr("cx", 320).attr("cy", 95).attr("r", 38).attr("fill", "#fff").attr("stroke", C.ink).attr("stroke-width", 2.5);
      g.append("text").attr("x", 320).attr("y", 90).attr("text-anchor", "middle").attr("font-size", 15).attr("font-weight", 700).text(`Σ = ${sum}`);
      g.append("text").attr("x", 320).attr("y", 110).attr("text-anchor", "middle").attr("font-size", 12).attr("fill", C.muted).text(`≥ ${st.t} ?`);
      g.append("line").attr("x1", 358).attr("y1", 95).attr("x2", 460).attr("y2", 95).attr("stroke", C.ink).attr("stroke-width", 2.5);
      g.append("rect").attr("x", 460).attr("y", 65).attr("width", 130).attr("height", 60).attr("rx", 10).attr("fill", o ? C.torch : "#f3f4f6").attr("stroke", o ? "#d97614" : C.grey);
      g.append("text").attr("x", 525).attr("y", 101).attr("text-anchor", "middle").attr("font-size", 17).attr("font-weight", 700).attr("fill", o ? "#fff" : C.muted).text(o ? "VOTE X" : "don't");

      const tb = stage.querySelector("#truth tbody");
      tb.innerHTML = "";
      let andOK = true, orOK = true;
      [[0, 0], [0, 1], [1, 0], [1, 1]].forEach(([a, b]) => {
        const n = out(a, b), wa = a & b, wo = a | b;
        andOK = andOK && n === wa; orOK = orOK && n === wo;
        tb.insertAdjacentHTML("beforeend", `<tr${a === st.A && b === st.B ? ' style="font-weight:700"' : ""}><td>${a}</td><td>${b}</td><td>${st.wA * a + st.wB * b}</td><td>${n ? "vote" : "—"}</td>` +
          `<td class="${n === wa ? "ok" : "bad"}">${wa ? "vote" : "—"}</td><td class="${n === wo ? "ok" : "bad"}">${wo ? "vote" : "—"}</td></tr>`);
      });
      if (andOK) won.AND = true;
      if (orOK) won.OR = true;
      stage.querySelector("#c-and").classList.toggle("won", won.AND);
      stage.querySelector("#c-or").classList.toggle("won", won.OR);
      stage.querySelector("#c-and").querySelector("b").textContent = (won.AND ? "✓ " : "") + "Challenge 1 · AND:";
      stage.querySelector("#c-or").querySelector("b").textContent = (won.OR ? "✓ " : "") + "Challenge 2 · OR:";
    }
    draw();
  });

  /* ================================================================ 1.9 */
  ST.register("1.9", (stage) => {
    // Depth-first search for 4 non-attacking flags, recording every try.
    const N = 4;
    const nodes = [{ id: 0, row: -1, col: null, parent: null, state: "root" }];
    const events = [];
    const ok = (placed, r, c) => placed.every((pc, pr) => pc !== c && Math.abs(pc - c) !== Math.abs(pr - r));
    function dfs(placed, parentId) {
      const r = placed.length;
      if (r === N) return true;
      for (let c = 0; c < N; c++) {
        const id = nodes.length;
        const good = ok(placed, r, c);
        nodes.push({ id, row: r, col: c, parent: parentId, state: good ? "try" : "clash" });
        events.push({ id, placed: good ? placed.concat(c) : placed.slice(), tryCell: [r, c], good });
        if (good) {
          if (dfs(placed.concat(c), id)) { nodes[id].state = "path"; return true; }
          nodes[id].state = "dead";
          events.push({ id, placed: placed.slice(), back: true });
        }
      }
      return false;
    }
    dfs([], 0);
    events.push({ done: true });

    stage.innerHTML = `
      <p class="panel-title">Puzzle search · 4 flags, no shared row, column or diagonal</p>
      <div class="btn-row"><button class="btn primary" id="step">Step</button><button class="btn torch" id="play">Play</button><button class="btn" id="reset">Reset</button></div>
      <div style="display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap">
        <div><div class="board" id="board"></div><p class="note" id="status" style="max-width:190px">Press Step to start the search.</p></div>
        <div style="flex:1;min-width:280px"><div id="tree"></div>
          <div class="legend"><span><i style="background:${C.theory}"></i>Trying</span><span><i style="background:${C.danger}"></i>Dead end</span><span><i style="background:${C.observed}"></i>Solution path</span></div></div>
      </div>`;

    // tree layout
    const byId = new Map(nodes.map((n) => [n.id, { ...n, children: [] }]));
    nodes.forEach((n) => { if (n.parent !== null) byId.get(n.parent).children.push(byId.get(n.id)); });
    const root = d3.hierarchy(byId.get(0));
    const TW = 420, TH = 260;
    d3.tree().size([TW - 20, TH - 56])(root);
    const svg = svgBox(stage.querySelector("#tree"), TW, TH, "Search tree");
    const g = svg.append("g").attr("transform", "translate(10,36)");
    const links = g.selectAll("line").data(root.links()).join("line")
      .attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y).attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y)
      .attr("stroke", C.grey).attr("stroke-width", 1.5).attr("opacity", 0);
    const nodeSel = g.selectAll("g.n").data(root.descendants()).join("g").attr("class", "n").attr("transform", (d) => `translate(${d.x},${d.y})`);
    nodeSel.append("circle").attr("r", (d) => (d.data.row < 0 ? 7 : 8)).attr("fill", "#fff").attr("stroke", C.grey).attr("stroke-width", 2);
    nodeSel.append("text").attr("y", 4).attr("text-anchor", "middle").attr("font-size", 9).attr("font-weight", 700).text((d) => (d.data.col === null ? "" : d.data.col + 1));
    svg.append("text").attr("x", 4).attr("y", 12).attr("font-size", 11).attr("fill", C.muted).text("start · each level = one row (a subgoal) · number = column tried");

    const board = stage.querySelector("#board");
    let k = 0, timer = null;
    const revealed = new Set([0]);
    function paintBoard(ev) {
      board.innerHTML = "";
      const placed = ev && ev.placed ? ev.placed : [];
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        const cell = ST.el("div", { class: (r + c) % 2 ? "dark" : "" });
        if (placed[r] === c) cell.textContent = "🚩";
        if (ev && ev.tryCell && ev.tryCell[0] === r && ev.tryCell[1] === c && !ev.good) { cell.className += " attacked"; cell.textContent = "✕"; }
        board.appendChild(cell);
      }
    }
    function paintTree(final) {
      nodeSel.select("circle").attr("fill", (d) => {
        if (!revealed.has(d.data.id)) return "#fff";
        if (d.data.row < 0) return C.ink;
        const s = d.data.state;
        if (s === "clash" || (s === "dead" && (final || backed.has(d.data.id)))) return C.danger;
        if (s === "path" && final) return C.observed;
        return C.theory;
      }).attr("stroke", (d) => (revealed.has(d.data.id) ? "#fff" : C.grey));
      nodeSel.select("text").attr("fill", (d) => (revealed.has(d.data.id) ? "#fff" : C.muted)).attr("opacity", (d) => (revealed.has(d.data.id) ? 1 : 0.35));
      nodeSel.attr("opacity", (d) => (revealed.has(d.data.id) ? 1 : 0.25));
      links.attr("opacity", (d) => (revealed.has(d.target.data.id) ? 1 : 0.15))
        .attr("stroke", (d) => (final && d.target.data.state === "path" ? C.observed : C.grey))
        .attr("stroke-width", (d) => (final && d.target.data.state === "path" ? 3 : 1.5));
    }
    const backed = new Set();
    function step() {
      if (k >= events.length) return;
      const ev = events[k++];
      const status = stage.querySelector("#status");
      if (ev.done) {
        paintTree(true);
        status.innerHTML = `<b class="observed">Goal reached!</b> ${events.filter((e) => e.back).length} backtracks along the way.`;
        stop();
        return;
      }
      revealed.add(ev.id);
      if (ev.back) { backed.add(ev.id); status.innerHTML = `<b style="color:var(--danger)">Dead end.</b> Backtrack: remove the flag in row ${byId.get(ev.id).row + 1} and try the next column.`; }
      else if (ev.good) status.innerHTML = `Row ${ev.tryCell[0] + 1}, column ${ev.tryCell[1] + 1}: <b>safe so far</b>. Next subgoal: row ${ev.tryCell[0] + 2}.`;
      else status.innerHTML = `Row ${ev.tryCell[0] + 1}, column ${ev.tryCell[1] + 1}: <b style="color:var(--danger)">clash</b>. Try the next column.`;
      paintBoard(ev);
      paintTree(false);
    }
    function stop() { clearInterval(timer); timer = null; stage.querySelector("#play").textContent = "Play"; }
    stage.querySelector("#step").addEventListener("click", () => { stop(); step(); });
    stage.querySelector("#play").addEventListener("click", (e) => {
      if (timer) return stop();
      e.target.textContent = "Pause";
      timer = setInterval(step, 450);
    });
    stage.querySelector("#reset").addEventListener("click", () => {
      stop(); k = 0; revealed.clear(); revealed.add(0); backed.clear(); paintBoard(null); paintTree(false);
      stage.querySelector("#status").textContent = "Press Step to start the search.";
    });
    paintBoard(null);
    paintTree(false);
  });

  /* ================================================================ 1.10 */
  ST.register("1.10", (stage) => {
    const rounds = [
      { q: "Why should I give you my vote?",
        h: "Because I played the whole game. I flipped at the merge, and I told you to your face why.",
        b: "Why do you feel you should give me your vote?",
        why: "The program just turned your question around. It never says anything about the game." },
      { q: "What was your biggest mistake out here?",
        h: "Trusting the wrong person on day 12. I knew it in my gut and ignored it.",
        b: "Tell me more about your biggest mistake out here.",
        why: "\"Tell me more about…\" plus your own words is a classic ELIZA move." },
      { q: "Did you ever lie to me?",
        h: "Once, about the idol. I'm not proud of it, but it kept me in the game.",
        b: "Why are you concerned about whether I ever lied to you?",
        why: "It deflects with \"Why are you concerned…\" instead of answering." },
      { q: "Who played the best game besides you?",
        h: "Honestly, Dana. She ran the swing votes and nobody noticed.",
        b: "Does it please you to believe someone played the best game?",
        why: "No name, no detail. Just a template wrapped around your phrase." },
      { q: "How did it feel to be on the bottom?",
        h: "Awful. I didn't sleep for three nights, but it made me fight harder.",
        b: "How do you feel when you say it felt to be on the bottom?",
        why: "It mirrors your sentence back so awkwardly it barely makes sense." },
    ];
    let i = 0, score = 0;
    stage.innerHTML = `
      <p class="panel-title">Castaway or program? · round <span id="r">1</span> of ${rounds.length}</p>
      <div id="round"></div>
      <p id="t-fb" style="min-height:1.5em"></p>
      <div class="btn-row"><button class="btn primary" id="next" disabled>Next round →</button></div>
      <div id="hype" style="display:none">
        <p class="panel-title" style="margin-top:18px">Meanwhile, the experts were saying… (paraphrased)</p>
        <div class="hype"><b>1958</b> · Herbert Simon and Allen Newell: within ten years, a computer will be the world chess champion. <br><span class="note">Actually happened in 1997, nearly 30 years late.</span></div>
        <div class="hype"><b>1965</b> · Simon: within twenty years, machines will be able to do any work a person can do. <br><span class="note">🕯️ Still waiting.</span></div>
        <div class="hype"><b>1970</b> · Marvin Minsky: in three to eight years we'll have a machine with the general intelligence of an average human. <br><span class="note">🕯️ Still waiting.</span></div>
      </div>`;
    function show() {
      const r = rounds[i];
      stage.querySelector("#r").textContent = i + 1;
      const order = Math.random() < 0.5 ? ["h", "b"] : ["b", "h"];
      const box = stage.querySelector("#round");
      box.innerHTML = `<p style="font-size:18px;margin:6px 0"><b>Juror:</b> "${r.q}"</p><div class="answers"></div><p class="note">Click the answer you think the <b>program</b> wrote.</p>`;
      const answers = box.querySelector(".answers");
      order.forEach((who, j) => {
        const btn = ST.el("button", { class: "answer" }, `<span class="who">Answer ${"AB"[j]}</span>${r[who]}`);
        btn.addEventListener("click", () => {
          if (answers.dataset.done) return;
          answers.dataset.done = 1;
          [...answers.children].forEach((b, jj) => {
            b.classList.add(order[jj] === "b" ? "bot" : "human");
            b.querySelector(".who").textContent = `Answer ${"AB"[jj]} · ${order[jj] === "b" ? "program" : "castaway"}`;
          });
          const right = who === "b";
          if (right) score++;
          stage.querySelector("#t-fb").innerHTML = (right ? "🔥 Caught it. " : "Fooled you. ") + r.why;
          stage.querySelector("#next").disabled = false;
          if (i === rounds.length - 1) finish();
        });
        answers.appendChild(btn);
      });
      stage.querySelector("#t-fb").textContent = "";
      stage.querySelector("#next").disabled = true;
    }
    function finish() {
      const nx = stage.querySelector("#next");
      nx.textContent = `Score: ${score} / ${rounds.length}`;
      setTimeout(() => { nx.disabled = true; }, 0);
      stage.querySelector("#hype").style.display = "block";
      ST.reveal("turing-done");
    }
    stage.querySelector("#next").addEventListener("click", () => { if (i < rounds.length - 1) { i++; show(); } });
    show();
  });

  /* ================================================================ 1.11 */
  ST.register("1.11", (stage) => {
    const ideas = [
      { from: 1954, yr: 1966, name: "Machine translation", why: "The ALPAC report criticized machine translation as slow, costly and worse than human translators." },
      { from: 1958, yr: 1969, name: "Neural networks", why: "Minsky and Papert's book <i>Perceptrons</i> showed the limits of simple networks and seemed to kill the field." },
      { from: 1960, yr: 1973, name: "AI research in Britain", why: "The Lighthill Report judged AI a failure, and Britain cut its funding." },
      { from: 1971, yr: 1974, name: "Speech recognition", why: "DARPA cut funding after its speech-recognition program (the Harpy system) fell short." },
      { from: 1982, yr: 1990, name: "Japan's Fifth-Generation project", why: "A huge national push for intelligent computers that failed to deliver by 1990." },
    ];
    stage.innerHTML = `
      <p class="panel-title">The AI boot order</p>
      <div style="display:flex;gap:12px;align-items:center">
        <button class="btn torch" id="play">▶ Play</button>
        <input type="range" id="yr" min="1960" max="1992" value="1960" aria-label="Year" style="flex:1">
        <span class="big-num" id="yr-v" style="font-size:30px;min-width:70px">1960</span>
      </div>
      <div class="lane-label">Still in the game 🔥</div><div id="in"></div>
      <div class="lane-label">Edge of Extinction 🕯️</div><div id="out"><p class="note" id="empty">Nobody… yet.</p></div>`;
    const card = (d, out) => `<div class="tl-card ${out ? "out" : ""}"><span class="flame">🔥</span><span class="yr">${out ? d.yr : "—"}</span><div><h4>${d.name}</h4><p>${out ? d.why : "Hyped. Funded. Promising big things."}</p></div></div>`;
    function draw() {
      const y = +stage.querySelector("#yr").value;
      stage.querySelector("#yr-v").textContent = y;
      stage.querySelector("#in").innerHTML = ideas.filter((d) => d.yr > y && d.from <= y).map((d) => card(d, false)).join("") ||
        (y >= 1990 ? '<p class="note">Everyone has been voted out.</p>' : '<p class="note">No one here right now.</p>');
      const outs = ideas.filter((d) => d.yr <= y);
      stage.querySelector("#out").innerHTML = outs.length ? outs.map((d) => card(d, true)).join("") : '<p class="note">Nobody… yet.</p>';
      if (y >= 1990) ST.reveal("winter-done");
    }
    let timer = null;
    stage.querySelector("#yr").addEventListener("input", draw);
    stage.querySelector("#play").addEventListener("click", (e) => {
      if (timer) { clearInterval(timer); timer = null; e.target.textContent = "▶ Play"; return; }
      const s = stage.querySelector("#yr");
      if (+s.value >= 1992) s.value = 1960;
      e.target.textContent = "❚❚ Pause";
      timer = setInterval(() => {
        s.value = +s.value + 1; draw();
        if (+s.value >= 1992) { clearInterval(timer); timer = null; e.target.textContent = "▶ Play"; }
      }, 220);
    });
    draw();
  });

  /* ================================================================ 1.12 */
  ST.register("1.12", (stage) => {
    const S = D.finalists;
    const rules = [
      { key: "random", label: "Pick at random" },
      { key: "imm", label: "Most individual immunity wins", sign: 1 },
      { key: "age", label: "Youngest finalist", sign: -1 },
      { key: "votes", label: "Fewest votes against", sign: -1 },
      { key: "wins", label: "Most challenge wins", sign: 1 },
    ];
    // accuracy of a rule on a set of seasons; ties split the credit
    function ruleScore(r, s) {
      if (r.key === "random") return 1 / s.f.length;
      const best = Math.max(...s.f.map((f) => r.sign * f[r.key]));
      const top = s.f.filter((f) => r.sign * f[r.key] === best);
      return top.filter((f) => f.win).length / top.length;
    }
    const acc = (r, seasons) => ST.mean(seasons.map((s) => ruleScore(r, s)));
    const train = S.filter((s) => s.season <= 40), test = S.filter((s) => s.season > 40);

    stage.innerHTML = `
      <p class="panel-title">Round 1 · write the rule</p>
      <p class="note" style="margin-top:0">Each rule picks one of the season's finalists (usually 2–3 people), so even random guessing is right 38% of the time. Accuracy across all 50 seasons; ties split the credit.</p>
      <div id="rules"></div>
      <div id="strip"></div>
      <div class="legend"><span><i style="background:${C.observed}"></i>Rule picked the winner</span><span><i style="background:#9fdcc0"></i>Tie, partly right</span><span><i style="background:${C.grey}"></i>Wrong</span></div>
      <p class="panel-title" style="margin-top:22px">Round 2 · let it learn</p>
      <p class="note" style="margin-top:0">The model weighs immunity wins, challenge wins, votes against and age. It learns the weights from seasons 1–40.</p>
      <div class="btn-row"><button class="btn primary" id="train">Train on seasons 1–40</button><button class="btn torch" id="test" disabled>Test on seasons 41–50</button></div>
      <div id="weights" class="note"></div>
      <div id="compare"></div>`;

    const rbox = stage.querySelector("#rules");
    let sel = rules[1];
    rules.forEach((r) => {
      const b = ST.el("button", { class: "rule-opt" }, `<span>${r.label}</span><span class="acc">${ST.pct(acc(r, S))}</span>`);
      b.addEventListener("click", () => { sel = r; drawStrip(); });
      r.btn = b;
      rbox.appendChild(b);
    });
    const W = 600, H = 70;
    const svg = svgBox(stage.querySelector("#strip"), W, H, "Rule result per season");
    const cw = W / S.length;
    const cells = svg.selectAll("rect").data(S).join("rect").attr("x", (d, i) => i * cw + 1).attr("y", 10).attr("width", cw - 2).attr("height", 34).attr("rx", 3);
    svg.append("text").attr("x", 0).attr("y", 62).attr("font-size", 11).attr("fill", C.muted).text("Season 1");
    svg.append("text").attr("x", W).attr("y", 62).attr("text-anchor", "end").attr("font-size", 11).attr("fill", C.muted).text("Season 50");
    cells.on("mousemove", (ev, s) => ST.tip.show(`<b>Season ${s.season}: ${s.name}</b><br>` + s.f.map((f) => `${f.win ? "🏆 " : ""}${f.n}: ${f.imm} imm · ${f.wins} wins · ${f.votes} votes against · age ${f.age}`).join("<br>"), ev))
      .on("mouseleave", () => ST.tip.hide());
    function drawStrip() {
      rules.forEach((r) => r.btn.classList.toggle("sel", r === sel));
      cells.transition().duration(250).attr("fill", (s) => {
        const v = ruleScore(sel, s);
        return v >= 0.999 ? C.observed : v > 0 ? "#9fdcc0" : C.grey;
      });
    }
    drawStrip();

    // conditional logit, same as the check in tools/: features scaled the same way
    const X = (f) => [f.imm, f.wins / 5, f.votes / 5, f.age / 10];
    let w = [0, 0, 0, 0];
    const scoreOf = (f) => X(f).reduce((s, x, j) => s + x * w[j], 0);
    const pickIdx = (s) => s.f.reduce((bi, f, i) => (scoreOf(f) > scoreOf(s.f[bi]) ? i : bi), 0);
    const modelAcc = (seasons) => ST.mean(seasons.map((s) => (s.f[pickIdx(s)].win ? 1 : 0)));
    function gradStep() {
      const g = [0, 0, 0, 0];
      train.forEach((s) => {
        const sc = s.f.map((f) => Math.exp(scoreOf(f)));
        const Z = ST.sum(sc);
        s.f.forEach((f, i) => { const x = X(f), p = sc[i] / Z, y = f.win ? 1 : 0; for (let j = 0; j < 4; j++) g[j] += (y - p) * x[j]; });
      });
      w = w.map((v, j) => v + (0.05 * g[j]) / train.length);
    }

    stage.querySelector("#train").addEventListener("click", async (e) => {
      e.target.disabled = true;
      w = [0, 0, 0, 0];
      for (let it = 0; it < 4000; it++) {
        gradStep();
        if (it % 400 === 0) {
          e.target.textContent = `Training… ${Math.round((it / 4000) * 100)}%`;
          await ST.sleep(30);
        }
      }
      e.target.textContent = "Trained ✓";
      stage.querySelector("#weights").innerHTML = `Learned weights: immunity ${w[0].toFixed(2)} · challenge wins ${w[1].toFixed(2)} · votes against ${w[2].toFixed(2)} · age ${w[3].toFixed(2)}. ` +
        `Accuracy on the seasons it studied: <b>${ST.pct(modelAcc(train))}</b>.`;
      stage.querySelector("#test").disabled = false;
    });
    stage.querySelector("#test").addEventListener("click", (e) => {
      e.target.disabled = true;
      const bestRule = rules.slice(1).reduce((b, r) => (acc(r, test) > acc(b, test) ? r : b), rules[1]);
      const rows = [
        ["Model, seasons it studied (1–40)", modelAcc(train), C.theory],
        ["Model, new seasons (41–50)", modelAcc(test), C.danger],
        [`Best simple rule on 41–50 (${bestRule.label.toLowerCase()})`, acc(bestRule, test), C.observed],
        ["Random guess on 41–50", acc(rules[0], test), C.grey],
      ];
      const CW = 600, CH = rows.length * 44 + 10;
      const s = svgBox(stage.querySelector("#compare"), CW, CH, "Accuracy comparison");
      const x = d3.scaleLinear().domain([0, 1]).range([0, 360]);
      rows.forEach(([label, v, col], i) => {
        s.append("text").attr("x", 0).attr("y", i * 44 + 16).attr("font-size", 13).attr("fill", C.ink).text(label);
        s.append("rect").attr("x", 0).attr("y", i * 44 + 22).attr("height", 14).attr("rx", 4).attr("fill", col).attr("width", 0)
          .transition().delay(i * 200).duration(500).attr("width", x(v));
        s.append("text").attr("x", x(v) + 8).attr("y", i * 44 + 34).attr("font-size", 13).attr("font-weight", 700).attr("fill", C.ink).text(ST.pct(v));
      });
      const correct = test.filter((t) => t.f[pickIdx(t)].win).length;
      stage.querySelector("#weights").innerHTML += `<br>On the 10 new seasons the model picked <b>${correct} of 10</b> winners.`;
      ST.reveal("learn-done");
    });
  });

  /* ================================================================ 1.13 */
  ST.register("1.13", (stage) => {
    const M = [
      { yr: "1986", t: "Backpropagation", d: "Rumelhart, Hinton and Williams train neural nets with hidden layers using gradient descent. <b>Neural nets return to the game.</b> The forerunner of deep learning." },
      { yr: "1989", t: "Q-learning", d: "Watkins: reinforcement learning. The model learns from experience instead of data collected in advance." },
      { yr: "1993", t: "Association rule mining", d: "Agrawal at IBM finds rules like {bread, butter} ⇒ {milk}. It started the field of data mining.", demo: true },
      { yr: "1995", t: "Random forests", d: "Many decision trees vote on the answer, literally a tribal council of trees. Still among the most accurate classifiers." },
      { yr: "1995", t: "Support vector machines", d: "Cortes and Vapnik's \"max margin\" method. Works well with many features and little data." },
      { yr: "1997", t: "LSTM", d: "A neural network that remembers state across sequential data and avoids the vanishing gradient problem." },
      { yr: "2006", t: "Netflix Prize", d: "100M ratings as ⟨user, movie, date, grade⟩ and $1M to beat Netflix's algorithm by 10%. It spurred research on recommender systems." },
      { yr: "2007", t: "NVIDIA CUDA", d: "General-purpose computing on GPUs, which led to cuDNN, TensorFlow (2015) and PyTorch (2016)." },
      { yr: "2009", t: "ImageNet", d: "Fei-Fei Li's 14M images in over 20,000 categories. AlexNet followed in 2012." },
      { yr: "2013", t: "Word2Vec", d: "Mikolov at Google learns word embeddings from huge amounts of text, so other ML methods can work on text." },
      { yr: "2014", t: "GANs", d: "Goodfellow: a generator network and a discriminator network train against each other. This is what makes deep fakes possible." },
      { yr: "Now", t: "GPT and Transformers", d: "Generative Pre-trained Transformers: huge neural nets trained on most of the English text available electronically. <b>Sole Survivor… for now.</b>" },
      { yr: "Bonus", t: "Medicine", d: "A 3D deep learning model reading low-dose lung CT scans reached an ROC of 94.4% and beat six radiologists." },
    ];
    // Isla Datos (fictional): rewards each tribe won per episode
    const baskets = [
      ["Pizza", "Chocolate", "Letters"], ["Pizza", "Chocolate", "Letters"], ["Pizza", "Chocolate", "Letters", "Tarp"],
      ["Pizza", "Chocolate"], ["Pizza", "Tarp"], ["Chocolate", "Spa Day"], ["Pizza", "Chocolate", "Letters", "Spa Day"],
      ["Fishing Gear", "Tarp"], ["Letters", "Spa Day"], ["Pizza", "Fishing Gear"],
    ];
    stage.innerHTML = `
      <p class="panel-title">The comeback timeline</p>
      <div class="btn-row"><button class="btn primary" id="next">Relight the next torch →</button><button class="btn" id="all">Show all</button></div>
      <div id="list"></div>`;
    let k = 0;
    function demoHTML() {
      const has = (b, items) => items.every((x) => b.includes(x));
      const both = baskets.filter((b) => has(b, ["Pizza", "Chocolate"]));
      const all3 = both.filter((b) => b.includes("Letters"));
      return `<div style="margin-top:8px;padding:8px 10px;background:#fff;border:1px solid var(--line);border-radius:8px;font-size:13px">
        <b>Isla Datos demo (made-up data):</b> rewards won in ${baskets.length} episodes.<br>
        ${baskets.map((b, i) => `<span class="mono">${i + 1}: {${b.join(", ")}}</span>`).join("<br>")}<br>
        Episodes with {Pizza, Chocolate}: <b>${both.length}</b>. Of those, also Letters: <b>${all3.length}</b>.<br>
        Rule <b>{Pizza, Chocolate} ⇒ {Letters}</b>: support ${all3.length}/${baskets.length} = ${ST.pct(all3.length / baskets.length)}, confidence ${all3.length}/${both.length} = <b>${ST.pct(all3.length / both.length)}</b>.</div>`;
    }
    function draw() {
      stage.querySelector("#list").innerHTML = M.map((m, i) => `<div class="tl-card ${i < k ? "lit" : "future"}"><span class="flame">🔥</span><span class="yr">${m.yr}</span>` +
        `<div><h4>${m.t}</h4><p>${i < k ? m.d : "…"}</p>${i < k && m.demo ? demoHTML() : ""}</div></div>`).join("");
      if (k >= M.length) { ST.reveal("comeback-done"); stage.querySelector("#next").disabled = true; }
    }
    stage.querySelector("#next").addEventListener("click", () => {
      k = Math.min(M.length, k + 1); draw();
      const cards = stage.querySelectorAll(".tl-card");
      if (cards[k - 1]) cards[k - 1].scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
    stage.querySelector("#all").addEventListener("click", () => { k = M.length; draw(); });
    draw();
  });

  /* ================================================================ Tribal Council */
  document.addEventListener("DOMContentLoaded", () => {
    const box = document.getElementById("council");
    if (!box) return;
    const qs = [
      ["Data science data is often <i>large</i> and <i>complex</i>. Define each in one phrase.",
        "Large: too big to fit in a server's RAM. Complex: not in tables, often multi-modal (several kinds of data, like text plus images)."],
      ["The raw Shot in the Dark data showed 28% safe. Why was that misleading?",
        "The same shot appeared in several rows (revotes, two-boot episodes). Counting each player's shot once gives 4 of 24 = 1/6."],
      ["What does a null hypothesis assume?",
        "That nothing is going on (e.g., age doesn't matter). You then ask how often chance alone would produce data as extreme as yours: the p-value."],
      ["Name two events that caused AI winters.",
        "Any two of: the ALPAC report, <i>Perceptrons</i> (1969), the Lighthill Report (1973), DARPA's cuts after Harpy (~1974), Japan's Fifth-Generation project failing (1990)."],
      ["Rules vs. learning: why did the learned model do worse on new seasons?",
        "50 seasons is very little data, and juries decide winners for reasons these numbers don't capture. The model fit the old seasons but didn't generalize (overfitting)."],
    ];
    qs.forEach(([q, a], i) => {
      const d = ST.el("div", { class: "cq" }, `<b>${i + 1}.</b> ${q}<textarea aria-label="Your answer to question ${i + 1}" placeholder="Your answer…"></textarea>` +
        `<button class="btn">Reveal answer</button><div class="ans">${a}</div>`);
      d.querySelector("button").addEventListener("click", () => d.classList.toggle("open"));
      box.appendChild(d);
    });
  });
})();
