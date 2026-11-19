# Outwit, Outplay, Outcompute: Data Science Through Survivor

A visual, interactive introduction to data science in the style of [Seeing Theory](https://seeing-theory.brown.edu/), taught with real Survivor data and a dramatic telenovela-style narrator.

Each chapter covers one topic, in order. It's a free resource for learning and teaching, and nothing is graded. Chapters are split into short episodes (3–5 minutes). Each episode has text on the left, an interactive on the right, a "What just happened" summary, and a one-question **Tribal Check** that lights a torch.

## Chapters

| # | Chapter | Topic | Status |
|---|---|---|---|
| 0 | Day One | Welcome to the island | ✅ Built |
| 1 | Previously on Data Science | A short history of data science | ✅ Built |
| 2 | Tribes and Keys | Relational databases, keys, logic | Planned |
| 3 | Alliance Logic | Relational calculus | Planned |
| 4 | The Merge | Relational algebra | Planned |
| 5 | Ask the Tribe | SQL: declarative queries | Planned |
| 6 | Counting Votes | SQL: aggregation | Planned |
| 7 | Blindsides and Blanks | SQL: HAVING, joins, NULLs, DDL/DML | Planned |
| 8 | Down the Mountain | Gradient descent | Planned |
| 9 | Newton's Shortcut | Newton's method | Planned |
| 10 | The Whole Island Votes | Big data and MapReduce | Planned |

The full plan is in [scripts/module-plan.md](scripts/module-plan.md). Approved chapter scripts are in [scripts/](scripts/).

## Viewing it

Open `index.html` in a browser. No build step and no server are needed. Charts load D3 from a CDN, so you need an internet connection.

To serve it locally instead:

```bash
python3 -m http.server 8123
```

Then open http://localhost:8123.

Because it's a plain static site, it can be published with GitHub Pages (Settings → Pages → deploy from the branch root).

## Project layout

```
index.html                  module home page
chapters/                   one HTML page per chapter (narration lives here)
assets/css/site.css         shared layout and styles
assets/js/core.js           episode engine: navigation, torches, Tribal Checks
assets/js/module.js         chapter list shared by the home page and Chapter 0
assets/js/chNN*.js          each chapter's interactives
data/raw/                   survivoR JSON files (US + other versions)
data/derived/               small per-chapter data files the pages load
tools/                      Python scripts that build data/derived/
scripts/                    module plan and chapter scripts
```

### Editing narration
All episode text is plain HTML inside `chapters/*.html`. Each episode is a `<section class="episode" data-ep="1.3">`. Text inside `<div class="later" data-key="…">` appears only after the student does something in the interactive.

### Rebuilding data
```bash
python3 tools/build_ch01_data.py
```

## Data and credits

- Survivor data: the open [survivoR](https://github.com/doehm/survivoR) dataset by Daniel Oehm (MIT license). Lessons use US seasons 1–51.
- "Isla Datos" examples (used in the logic and SQL chapters) are a fictional season made up for teaching.
- Layout inspired by Seeing Theory (Brown University).
- This is an independent teaching project. It isn't affiliated with or endorsed by the show or its network.
