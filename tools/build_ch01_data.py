"""Build the small data file Chapter 1 needs from the raw survivoR JSON.

Run from the repo root:
    python3 tools/build_ch01_data.py

Writes data/derived/ch01-data.js, which sets window.CH01_DATA so pages
work when opened straight from disk (no web server needed).
"""
import json
import collections as C
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw"
OUT = ROOT / "data" / "derived" / "ch01-data.js"


def load(name):
    rows = json.loads((RAW / f"{name}.json").read_text())
    return [r for r in rows if r.get("version") == "US"]


castaways = load("castaways")
votes = load("vote_history")
challenges = load("challenge_results")
juries = load("jury_votes")
viewers = load("viewers")
seasons = load("season_summary")
details = {d["castaway_id"]: d for d in json.loads((RAW / "castaway_details.json").read_text())}

season_name = {s["season"]: s["season_name"].replace("Survivor: ", "") for s in seasons}

# Fix the two misspelled states in the raw data.
STATE_FIX = {"Pensylvania": "Pennsylvania", "Tennasse": "Tennessee"}

# ---------- per castaway-season challenge stats ----------
ind_imm = C.Counter()
chal_wins = C.Counter()
for r in challenges:
    k = (r["season"], r["castaway_id"])
    ind_imm[k] += r.get("won_individual_immunity") or 0
    chal_wins[k] += r.get("won") or 0

votes_against = C.Counter()
for r in votes:
    if r.get("vote_id"):
        votes_against[(r["season"], r["vote_id"])] += 1

# ---------- 1.1 Guess the Rule ----------
by_season = C.defaultdict(list)
for r in castaways:
    by_season[r["season"]].append(r)

rule = []
for s in sorted(by_season):
    cast = by_season[s]
    winner = next((r for r in cast if r.get("winner")), None)
    if not winner:
        continue  # season still airing
    counts = {r["castaway_id"]: ind_imm[(s, r["castaway_id"])] for r in cast}
    best = max(counts.values())
    leaders = sorted({r["castaway"] for r in cast if counts[r["castaway_id"]] == best})
    rule.append({
        "season": s,
        "name": season_name.get(s, f"Season {s}"),
        "leaders": leaders,
        "wins": best,
        "winner": winner["castaway"],
        "hit": counts[winner["castaway_id"]] == best,
    })

cards = {
    "castaways": len(castaways),
    "votes": len(votes),
    "challenges": len(challenges),
    "jury": len(juries),
    "episodes": len(viewers),
}
def sample(rows, keys):
    """First row that has a value for every key, trimmed to those keys."""
    row = next(r for r in rows if all(r.get(k) is not None for k in keys))
    return {k: row[k] for k in keys}


samples = {
    "castaways": sample(castaways, ("castaway", "season", "age", "state", "result")),
    "votes": sample(votes, ("season", "episode", "castaway", "vote", "voted_out")),
    "challenges": sample(challenges, ("season", "episode", "castaway", "challenge_type", "result")),
    "jury": sample(juries, ("season", "castaway", "finalist", "vote")),
    "episodes": sample(viewers, ("season", "episode", "episode_title", "viewers", "imdb_rating")),
}

# ---------- 1.2 Census ----------
census = []
for r in castaways:
    state = STATE_FIX.get(r.get("state"), r.get("state"))
    census.append({"s": r["season"], "a": r.get("age"), "st": state})

# ---------- 1.3 Shot in the Dark ----------
sitd_rows = []
for r in votes:
    if "Shot in the dark" in str(r.get("vote_event")):
        sitd_rows.append({
            "season": r["season"], "episode": r["episode"], "castaway": r["castaway"],
            "safe": r.get("vote_event_outcome") == "Safe",
        })

# ---------- 1.4 Ozzy blindside (S16 E10) ----------
blindside = [
    {"voter": r["castaway"], "target": r["vote"], "immune": bool(r.get("immunity"))}
    for r in votes
    if r["season"] == 16 and r["episode"] == 10 and r.get("vote_order") == 1
]

# ---------- 1.5 Null hypothesis ----------
ages = [r["age"] for r in castaways if r.get("age")]
genders = [details.get(r["castaway_id"], {}).get("gender") for r in castaways]
first_boots = [r for r in castaways if r.get("order") == 1]
fb_ages = [r["age"] for r in first_boots if r.get("age")]
fb_female = sum(1 for r in first_boots if details.get(r["castaway_id"], {}).get("gender") == "Female")

scatter = []
for r in castaways:
    if not r.get("age"):
        continue
    if r.get("order") in (1, 2, 3):
        group = "early"
    elif r.get("jury"):
        group = "jury"
    else:
        continue
    scatter.append({"a": r["age"], "w": chal_wins[(r["season"], r["castaway_id"])], "g": group})

# ---------- 1.7 Season 20 boot-order chain ----------
s20 = sorted(by_season[20], key=lambda r: r["order"])
chain = [{"name": r["castaway"], "result": r["result"], "tribe": r.get("original_tribe")} for r in s20]

# ---------- 1.12 Finalists ----------
finalists = []
for s in sorted(by_season):
    fs = [r for r in by_season[s] if r.get("finalist")]
    if not any(r.get("winner") for r in fs):
        continue
    finalists.append({
        "season": s,
        "name": season_name.get(s, f"Season {s}"),
        "f": [{
            "n": r["castaway"],
            "win": bool(r.get("winner")),
            "imm": ind_imm[(s, r["castaway_id"])],
            "wins": chal_wins[(s, r["castaway_id"])],
            "votes": votes_against[(s, r["castaway_id"])],
            "age": r.get("age") or 0,
        } for r in fs],
    })

data = {
    "rule": rule,
    "cards": cards,
    "samples": samples,
    "census": census,
    "sitd": sitd_rows,
    "blindside": blindside,
    "ages": ages,
    "genders": genders,
    "firstBoot": {"ages": fb_ages, "female": fb_female, "n": len(first_boots)},
    "scatter": scatter,
    "chain": chain,
    "finalists": finalists,
}

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text("// Generated by tools/build_ch01_data.py. Do not edit by hand.\nwindow.CH01_DATA = "
               + json.dumps(data, separators=(",", ":")) + ";\n")

hits = sum(r["hit"] for r in rule)
print(f"Wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")
print(f"1.1 immunity leader won {hits}/{len(rule)}")
print(f"1.3 shot-in-the-dark rows {len(sitd_rows)}, safe rows {sum(r['safe'] for r in sitd_rows)}")
print(f"1.5 first boots n={len(fb_ages)} mean={sum(fb_ages)/len(fb_ages):.2f} all={sum(ages)/len(ages):.2f} female={fb_female}")
print(f"1.12 seasons with finalists {len(finalists)}")
