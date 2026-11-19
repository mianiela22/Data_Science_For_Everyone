/* Chapter 0 interactives: the island map (0.1). */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const svgEl = (tag, attrs = {}) => {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
  };

  // ---------- 0.1 Island map ----------
  ST.register("0.1", (stage) => {
    const M = window.MODULE;
    const host = stage.querySelector("#island");
    const info = stage.querySelector("#camp-info");
    const W = 640, H = 430;
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", role: "img", "aria-label": "Island map with ten camps, one per chapter" });

    svg.appendChild(svgEl("rect", { x: 0, y: 0, width: W, height: H, rx: 14, fill: "#e8f3fb" }));
    // island + inland greenery
    svg.appendChild(svgEl("path", {
      d: "M70 230 C 60 140, 150 70, 260 80 C 330 40, 430 60, 480 110 C 560 140, 560 250, 520 300 C 480 370, 360 390, 270 370 C 170 380, 80 330, 70 230 Z",
      fill: "#f3e4c3", stroke: "#e7d3a8", "stroke-width": 3,
    }));
    svg.appendChild(svgEl("path", {
      d: "M140 220 C 140 160, 200 120, 270 125 C 340 100, 420 120, 450 170 C 490 210, 470 280, 420 300 C 370 330, 290 330, 240 320 C 180 320, 140 280, 140 220 Z",
      fill: "#d7ecd0",
    }));

    // camp positions and label offsets [x, y, labelDx, labelDy, anchor]
    const pts = [
      [125, 290, 0, 34, "middle"], [165, 205, -26, 5, "end"], [240, 140, 0, -26, "middle"],
      [330, 112, 0, -26, "middle"], [420, 135, 0, -26, "middle"], [470, 215, 0, 36, "middle"],
      [425, 300, 0, 36, "middle"], [335, 335, 0, 36, "middle"], [240, 315, 0, 36, "middle"],
      [315, 222, 0, 36, "middle"],
    ];
    // trail
    const d = "M80 345 L " + pts.map((p) => p[0] + " " + p[1]).join(" L ");
    svg.appendChild(svgEl("path", { d, fill: "none", stroke: "#b08a5a", "stroke-width": 2.5, "stroke-dasharray": "2 7", "stroke-linecap": "round" }));

    // landing beach = chapter 0
    const beach = svgEl("g", { transform: "translate(80 345)", tabindex: 0, style: "cursor:pointer" });
    beach.appendChild(svgEl("circle", { r: 13, fill: "#fff", stroke: ST.c.torch, "stroke-width": 3 }));
    const bt = svgEl("text", { y: 4, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: ST.c.ink });
    bt.textContent = "0";
    beach.appendChild(bt);
    const youAreHere = svgEl("text", { x: 20, y: 20, "font-size": 12, fill: ST.c.muted });
    youAreHere.textContent = "you are here";
    beach.appendChild(youAreHere);
    svg.appendChild(beach);

    const showInfo = (c) => {
      info.innerHTML = `<b>Chapter ${c.n}${c.ready ? "" : " · coming soon"}</b>` +
        `<span style="font-family:var(--font-voice);font-size:20px;font-weight:700">${c.title}</span><br>${c.topic}` +
        (c.ready ? `<br><a href="../${c.href}">Go to this camp →</a>` : "");
    };
    beach.addEventListener("mouseenter", () => showInfo(M.chapters[0]));
    beach.addEventListener("focus", () => showInfo(M.chapters[0]));

    M.chapters.slice(1).forEach((c, i) => {
      const [x, y, ldx, ldy, anchor] = pts[i];
      const g = svgEl("g", { transform: `translate(${x} ${y})`, tabindex: 0, style: "cursor:pointer", role: "button", "aria-label": `Chapter ${c.n}: ${c.title}` });
      g.appendChild(svgEl("circle", { r: 18, fill: c.ready ? ST.c.torch : "#fff", stroke: c.ready ? "#d97614" : "#9fb0bf", "stroke-width": 2.5 }));
      const t = svgEl("text", { y: 5, "text-anchor": "middle", "font-size": 14, "font-weight": 700, fill: c.ready ? "#fff" : ST.c.ink });
      t.textContent = c.n;
      g.appendChild(t);
      const lab = svgEl("text", { x: ldx, y: ldy, "text-anchor": anchor, "font-size": 11.5, fill: ST.c.ink, "font-weight": 600 });
      lab.textContent = c.title;
      g.appendChild(lab);
      const hover = () => { showInfo(c); g.firstChild.setAttribute("r", 21); };
      g.addEventListener("mouseenter", hover);
      g.addEventListener("focus", hover);
      g.addEventListener("mouseleave", () => g.firstChild.setAttribute("r", 18));
      g.addEventListener("blur", () => g.firstChild.setAttribute("r", 18));
      g.addEventListener("click", () => { showInfo(c); if (c.ready) location.href = "../" + c.href; });
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" && c.ready) location.href = "../" + c.href; });
      svg.appendChild(g);
    });

    // fog bank = next season
    const fog = svgEl("g", { tabindex: 0, style: "cursor:help", role: "button", "aria-label": "Next season: topics not covered yet" });
    [[560, 70, 60], [600, 140, 55], [585, 230, 62], [610, 320, 58], [560, 390, 50], [530, 30, 40]].forEach(([cx, cy, r]) =>
      fog.appendChild(svgEl("circle", { cx, cy, r, fill: "#ffffff", opacity: 0.82 })));
    const ft = svgEl("text", { x: 580, y: 215, "text-anchor": "middle", "font-size": 13, fill: ST.c.muted, "font-style": "italic" });
    ft.textContent = "next season…";
    fog.appendChild(ft);
    const showFog = () => {
      info.innerHTML = "<b>Next season (not covered yet)</b>" + M.nextSeason.join(" · ");
    };
    fog.addEventListener("mouseenter", showFog);
    fog.addEventListener("focus", showFog);
    fog.addEventListener("click", showFog);
    svg.appendChild(fog);

    host.appendChild(svg);
  });
})();
