# Module plan: draft for review

## Module title

**Outwit, Outplay, Outcompute: Data Science Through Survivor**

Alternatives:
- *Data Island: A Data Science Telenovela in Eleven Chapters*
- *The Tribe Has Spoken: A Visual Introduction to Data Science*

**Data:** the open survivoR dataset (MIT license), US seasons 1–51. It has 938 castaway entries, 5,882 vote rows, 12,501 challenge results, 1,158 jury votes, and ratings for every episode.

---

## How the module is put together

**Same topics, same order.** The chapters follow your course material exactly, from the Day 1 overview through MapReduce. Each chapter is one lecture deck, and the episodes inside it follow that deck's topics in order. Nothing is reordered or skipped.

**Bite-sized: chapters → episodes.**
- Each **chapter** is one lecture.
- Each **episode** is one idea and takes about 3–5 minutes. It always has the same four beats, like Seeing Theory:
  1. **The narrator sets it up.** A few short paragraphs with one Survivor hook.
  2. **The interactive** sits to the right of the text. You click, drag, shuffle or type.
  3. **"What just happened"** is one or two sentences that name the concept you saw.
  4. **Tribal Check** is one quick question with instant feedback. It isn't graded.
- Every chapter opens with **"Previously on…"**, a 3-line recap from the narrator, and closes with **"Next time on…"**, a cliffhanger for the next chapter.
- **Progress** shows as a row of torches, one per episode. Finishing an episode lights its torch.

**Visual language (from Seeing Theory):** text on the left and the interactive on the right. **Blue = theory**, **green = what actually happened**. There's plenty of white space and no clutter.

**Two kinds of data:**
- **Real Survivor data** wherever real numbers make the point: ratings, votes, ages, juries, challenges.
- **Isla Datos**, a small made-up season, for the logic and query chapters (3–5). It copies the course's running beer example one-for-one, so class examples and lessons line up:

| Course table | Isla Datos table | Meaning |
|---|---|---|
| LIKES(DRINKER, BEER) | **WANTS(CASTAWAY, REWARD)** | which rewards a castaway wants |
| FREQUENTS(DRINKER, BAR) | **CAMPS(CASTAWAY, TRIBE)** | which tribes a castaway has lived with (swaps mean more than one) |
| SERVES(BAR, BEER) | **WON(TRIBE, REWARD)** | which rewards a tribe has won |

The rewards are Pizza, Chocolate, Letters from Home, Spa Day, Fishing Gear and Tarp. The cast is fictional, so we never pin made-up preferences on real people. "Risa" keeps her name from the course slides.

**SQL chapters** have a live SQL box that runs in the browser (SQLite) against the real tables. Your course uses SQL Server syntax (TOP, ISNULL). Lessons show the course syntax, and the box quietly accepts both.

---

## The narrator

**Who:** an all-knowing narrator who is warm and theatrical, and far too invested in these castaways and this data. It's an original character written in the spirit of a telenovela narrator: dramatic asides, cheeky corrections, gasp-worthy reveals, and on-screen caption tags.

**Rules so the comedy helps the learning:**
- **The definition is always plain.** Jokes go around the concept, never in place of it.
- **No more than one aside per screen.** Asides go in parentheses or italics.
- **Caption tags** appear as on-screen labels, e.g. `#DuplicatesAreLiars`, `#NotZeroJustNULL`. They work as memory hooks.
- **Recurring bits:**
  - "Previously on…"
  - "Spoiler:"
  - "Remember this. It matters in Chapter 7."
  - The narrator has a not-so-secret crush on foreign keys.

**Sample lines** (original, to set the tone):
- *Chapter 1 opening:* "Previously on Data Science: nothing. It's Chapter One. But trust me, it's about to get juicy."
- *Shot in the Dark twist:* "Nine safe shots out of thirty-two? Did these players beat the odds? (They did not. Hold that thought.)" `#DuplicatesAreLiars`
- *RC negation trap:* "Look at this query. It looks innocent. It is not innocent."
- *NULL:* "NULL isn't zero. It isn't blank. It's *missing*, like a juror who never showed up to vote. Dramatic? Yes. Accurate? Also yes."
- *Learning rate too big:* "And just like that, our hero overshot the minimum. Again. (Lower α. I'm begging you.)"
- *MapReduce shuffle:* "The shuffle: where every vote gets in a boat and is ferried to its destiny. Also, the most expensive part. Boats aren't free."

---

# Chapter by chapter

Each row is one episode, in the same order as your material.

---

## Chapter 0: Day One
*Module overview · 1 episode*

| # | Topic (course) | Survivor framing | Interactive |
|---|---|---|---|
| 0.1 | What the course is: useful, non-obvious knowledge from data; tools + math/stats/ML; big data, not pure ML | "Welcome to the island." The narrator introduces the game. | **Island map**: 10 camps, one per chapter. Hover a camp to see its topic. Topics that aren't in the slides yet (Spark, EM, neural nets, …) sit under fog labeled "coming next season." |

---

## Chapter 1: Previously on Data Science
*A short history of data science · 13 episodes*

| # | Topic | Survivor framing | Interactive |
|---|---|---|---|
| 1.1 | What data science is: actionable knowledge; **large** (too big for RAM) and **complex/multi-modal** data | "Win immunity, win the game." True or false? | **Guess the Rule**: guess the %, then reveal. The immunity leader won only **19 of 50** seasons. Plus **data cards** with real row counts for votes, challenges, juries and ratings, and a video card to show "multi-modal." |
| 1.2 | Statistics began in the 1600s with economic and demographic data | Every season starts with a census of the cast. | **Census of the Island**: age histogram and home-state map of all US castaways. Filter by season. |
| 1.3 | Probability: Pascal and Fermat, gambling | The **Shot in the Dark**, 1 in 6 | **Simulator** (like Seeing Theory's coin): flip once or 100 times, green vs. blue bars. **Twist:** the real data shows 9 safe out of 32 rows. "Count each shot once" removes duplicates and leaves **4 of 24**, about 1/6. |
| 1.4 | John Snow, 1854 cholera, "bad air" vs. data | Tribal-council stories vs. the actual votes | **Map the Blindside**: click voters in a real tribal to draw vote arrows until the bloc appears. Toggle a simplified Broad Street map next to it. |
| 1.5 | Fisher: the null hypothesis; the linear discriminator | Are older players voted out first? First boots average **36.0** years; all castaways average **33.3**. | **Shuffle the Tribe**: a permutation test. The histogram of chance outcomes builds up and a p-value counter updates. A mini panel draws a line that separates two groups (the discriminator idea). |
| 1.6 | Pearson and Neyman: Type II error, power, confidence intervals | "How many seasons would you need to *prove* it?" | **Power slider**: change the number of seasons and the size of the age gap, and watch the detection rate and the confidence-interval bars shrink. |
| 1.7 | ENIAC; IBM IMS (1966, Apollo); Codd's relational model | Finding Season 20's winner, then and now | **Two Ways to Find a Winner**: follow pointers through records, or ask a table. "Reorganize storage" breaks the pointers but not the table. |
| 1.8 | What AI is (an agent that handles new problems, emergent behavior); Leibniz's calculus ratiocinator; McCulloch and Pitts (1943); Minsky's SNARC (1951); McCarthy names "AI" at Dartmouth (1956) | Can a neuron decide your vote? | **Alliance Neuron**: inputs like "alliance says vote X" and "X is a threat," with weights and a threshold. Students tune it to compute AND or OR, showing that neurons can do logic. |
| 1.9 | Early successes: AI as search (goals, subgoals, backtracking); General Problem Solver; Samuel's checkers; ELIZA | The final-challenge puzzle | **Puzzle Search Tree**: watch a search try moves, hit dead ends, and backtrack until it reaches the goal. Step through it or let it run. |
| 1.10 | The Turing Test; ELIZA's limits; the hype (human-level AI predicted within decades) | "Turing Tribal" | **Castaway or Program?** Two written answers to the same question. Guess which one an ELIZA-style bot wrote. Hype predictions appear as paraphrased cards with their dates. |
| 1.11 | AI winter: ALPAC, *Perceptrons* (1969), Lighthill (1973), DARPA/Harpy (1974), Fifth Generation (1990) | Ideas get **voted out** | **AI Boot Order**: a timeline scrubber. Each funding cut snuffs a torch and sends the idea to the "Edge of Extinction" lane. |
| 1.12 | Rules vs. learning: minimax, rule chaining (A→B, B→C ⇒ A→C); ML learns from data and is often statistical | Can you write the rules for picking a winner? | **Rules vs. Learning**: round 1, tick hand-written rules and see accuracy over 50 seasons. Round 2, a model trains on seasons 1–40 and is tested on 41–51. |
| 1.13 | ML milestones: backprop (1986), Q-learning, association rules, random forests, SVMs, LSTM, Netflix Prize, CUDA, ImageNet/AlexNet, Word2Vec, GANs, Transformers/GPT; the lung-CT example | Neural nets **return from the Edge** | **Comeback Timeline**: the same scrubber picks up at 1986. Each milestone card has a one-line explanation. Association rules get a live demo on reward wins: {Pizza, Chocolate} ⇒ {Letters}. |

---

## Chapter 2: Tribes and Keys
*Relational databases 1 · 8 episodes*

| # | Topic | Survivor framing | Interactive |
|---|---|---|---|
| 2.1 | Databases; the network (navigational) model, COBOL, pointers; no physical data independence | The pointer camp | **Move a Record**: relocate a castaway's record and watch every pointer to it break and the "code" fail. |
| 2.2 | Codd's model (1970, Turing Award 1981): relations, atomic attributes, no pointers, declarative queries | Clean tables only | **Is It Atomic?** Sort cells into atomic and not atomic. "Tribes: Tagi, Pagong" is not atomic. |
| 2.3 | Schemas; a relation as a subset of T₁×…×Tₙ; tuple/row/record; attribute/column; relation/table | CASTAWAY(ID, NAME, AGE, TRIBE) | **Build a Relation**: a grid of every possible (name, tribe) pair. Toggle which ones are true. A vocabulary toggle relabels the table "row / tuple / record." |
| 2.4 | Keys; candidate (minimal), primary (underlined), surrogate | Is a name a key? There are **8 Mikes** and **8 Joes**. | **Key Tester**: tick attributes of the real castaways table and the tool checks for duplicates. NAME fails. Returnees (121 people played more than once) break castaway_id alone. A **surrogate key** like US0001 rescues it. |
| 2.5 | Foreign keys; why no pointers; enforcement with cascading deletes and failed inserts | Votes must point at real castaways | **Try to Break It**: insert a vote from castaway "US9999" and it's rejected. Delete a castaway and their votes cascade away. |
| 2.6 | Three query languages: RC (declarative), RA (procedural "abstract machine"), SQL (a mix) | One question, three dialects | **Three Doors**: "Who won Season 20?" written in RC, RA and SQL. Flip between them. |
| 2.7 | Logic: predicates; ∧ ∨ ¬ ⇒ ⇔; the implication truth table; ⇒ ≡ ¬A ∨ B | "If you play an idol, you're safe" is false only if you played one and still went home | **Truth Table Builder**: flip A and B and watch ⇒ and ⇔ update. Survivor captions explain each row. |
| 2.8 | Quantifiers ∀ and ∃; first-order logic; bound vs. free variables; ∀X P(X) ≡ ¬∃X ¬P(X) | ∀X (Winner(X) ⇒ Finalist(X)); ∃X (VotedOut(X) ∧ HasIdol(X)), which means "went home with an idol in their pocket" | **Tribe of Cards**: 8 castaway cards with properties. Toggle the properties and watch statements turn true or false. For ∀X VotedFor(X, Y), students find the Y that makes it true (a unanimous vote). |

---

## Chapter 3: Alliance Logic
*Relational calculus · 7 episodes · Isla Datos tables*

| # | Topic | Survivor framing | Interactive |
|---|---|---|---|
| 3.1 | RC = a predicate in a set constructor {t \| P(t)}; what to return goes left, the condition goes right | Asking Isla Datos questions in logic | **Query Lens**: write {…\| …}. Each tuple lights up green when it satisfies P. |
| 3.2 | Simple query | "Who camps with a tribe?" {c.CASTAWAY \| CAMPS(c)} | **Step-through**: the tool walks every tuple of CAMPS. |
| 3.3 | Joining with ∃ | "Who camps with a tribe that won Pizza?" | **Find the Witness**: for each castaway, the tool searches WON for a tuple that makes ∃ true and highlights it. |
| 3.4 | **Negation traps** (likely exam topic) | "Who has *never* camped with a tribe that won Pizza?" | **Spot the Imposter**: three queries side by side (two wrong, one right). Pick one and the tables show who gets wrongly included and why. |
| 3.5 | ∀ almost always comes with ⇒ | Why ∀ without ⇒ asks the impossible | **Toggle the Arrow**: switch ⇒ on and off and watch the result go empty without it. |
| 3.6 | "For all" queries (relational division) | "Which tribes won **every** reward Risa wants?" and "Who **only** camps with tribes that won a reward they want?" | **Division Machine**: check each tribe against Risa's wishlist with tick marks. One missing tick and the tribe is out. |
| 3.7 | Tracing queries by hand | Practice round | **Predict, Then Check**: get a random query, click the tuples you think are returned, and see the real result. |

---

## Chapter 4: The Merge
*Relational algebra · 10 episodes*

| # | Topic | Survivor framing | Interactive |
|---|---|---|---|
| 4.1 | RC is *what*, RA is *how*; queries compile to RA plans; algebra closure (every operation returns a relation) | Every challenge outputs a tribe | **Plan Tree**: an RC query turns into an RA operator tree, animated. |
| 4.2 | Projection π (removes columns; duplicates collapse) | π_TRIBE over every castaway | **Column Cutter**: drop columns and watch duplicate rows collapse, with a row counter. |
| 4.3 | Selection σ (removes rows) | σ_AGE>40, σ_STATE='California' | **Predicate Builder** on the real castaways table. |
| 4.4 | Rename ρ; assignment ← | Nicknames and temporary tables | **Relabel**: rename attributes and a whole relation, then save the result to a temporary table. |
| 4.5 | Cartesian product ×, size \|R\|×\|S\| | Every castaway paired with every reward | **Pairing Grid** with a live size counter. |
| 4.6 | Theta join σ(×); natural join * | **The Merge**: two tribes become one | **Merge Animation**: two tables slide together on matching columns. Theta and natural joins are shown side by side. |
| 4.7 | ∪ ∩ −; union compatibility; precedence (∩ before − before ∪) | JURY − FINALISTS = "made jury but not the end" | **Venn Board** using real jury and finalist sets. Try to union mismatched tables and get an error. A **Parenthesizer** shows R∪S−T∩U. |
| 4.8 | "Not" queries use difference; the σ≠ trap | "Who doesn't want Pizza?" | **Two Answers**: σ_REWARD≠'Pizza' vs. the difference version. The trap includes Pizza fans who also want Chocolate. |
| 4.9 | "Only" queries: double difference | "Who only camps with tribes that won a reward they want?" | **Pipeline**: build GOODREWARD ← … step by step and watch each intermediate table. |
| 4.10 | Translating between RC and RA | Same question, both languages | **Matching Game**: pair each RC query with its RA version. |

---

## Chapter 5: Ask the Tribe
*SQL 1: declarative queries · 10 episodes · live SQL box*

| # | Topic | Survivor framing | Interactive |
|---|---|---|---|
| 5.1 | SQL history (IBM in the 1970s, Oracle in 1979); DML (declarative and imperative) and DDL; how SQL differs from RC/RA (keeps duplicates, dialects vary, adds aggregates); RA→SQL mapping | From algebra to English-ish | **Mapping Cards**: match π, ×, σ, ∪, ∩, −, ρ and ← to their SQL keywords. |
| 5.2 | SELECT … FROM … WHERE | "List every winner." | **First Query**: run it on the real castaways table. |
| 5.3 | DISTINCT; joins create repeats | Risa shows up twice. Why? | **Toggle DISTINCT** on a join result. |
| 5.4 | AS aliasing (rename, keyword optional) | Short names for long tables | **Alias It**: rename tables and columns and see the output headers change. |
| 5.5 | What can go in SELECT: expressions, constants, functions (NOW, CONCAT, COALESCE) | "Age today," "Name + season" | **Expression Lab** with live output. |
| 5.6 | WHERE toolkit: comparisons, BETWEEN, IN, LIKE (% and _), IS NULL, AND/OR | "Castaways named J_n%" | **Mini-challenges**: five quick filters on the real data. |
| 5.7 | Subqueries: EXISTS, IN, SOME/ANY, ALL; correlated vs. uncorrelated | "Older than ALL winners?" | **Re-run Counter**: a correlated subquery re-runs once per outer row (counter climbs). An uncorrelated one runs once. |
| 5.8 | Subqueries vs. joins | "Wants Pizza **and** Chocolate": IN vs. self-join | **Same Answer, Two Ways**, side by side. |
| 5.9 | "For all" in SQL: double NOT EXISTS | "Who wants every reward Risa wants?" | **Side-by-side** with the Chapter 3 RC version. Matching parts highlight together. |
| 5.10 | Views (non-materialized); style tips | Save a query like a strategy | **Make a View**, then **Style Fixer**: paste a messy query and it reformats with aliases, indents and one keyword per line. |

---

## Chapter 6: Counting Votes
*SQL 2: aggregation · 7 episodes · real vote and rating data*

| # | Topic | Survivor framing | Interactive |
|---|---|---|---|
| 6.1 | SUM, AVG, COUNT, MAX, MIN collapse many values into one | All 5,882 votes into one number | **Collapse Animation** on vote_history. |
| 6.2 | COUNT(*) vs. COUNT(DISTINCT) | Votes a castaway *cast* vs. *different people* they voted for | **Two Counters** for any castaway you pick. |
| 6.3 | GROUP BY; the rule for non-aggregated SELECT attributes | Votes received per castaway. The record is Karishma's **22** in Season 39. | **Bucket Sort**: rows drop into one bucket per group. **Error Explainer**: break the rule and see why there's no single value to show. |
| 6.4 | Aggregates and NULL: COUNT(attr) skips NULL; a separate NULL group | 370 vote rows have no vote recorded | **NULL Spotlight**: the counts change as NULLs are included or skipped. |
| 6.5 | Subqueries in FROM (derived table, needs an alias) | A temporary scoreboard | **Nested View**: the inner result appears as a temporary table. |
| 6.6 | Argmax: the "highest average" pattern; the two common mistakes | **Highest-rated season** by average IMDb rating (Season 31 is 8.42) | **Three Steps**: average per season → MAX → match. Then **Wrong on Purpose**: run the two classic wrong queries and see what they return. |
| 6.7 | TOP k, ORDER BY, WITH TIES, PERCENT | Top-voted castaways, where ties matter | **Tie Trap**: TOP 1 with and without WITH TIES on a tied result. |

---

## Chapter 7: Blindsides and Blanks
*SQL 3: HAVING, joins, NULLs, DDL, DML · 7 episodes*

| # | Topic | Survivor framing | Interactive |
|---|---|---|---|
| 7.1 | HAVING vs. WHERE; clause order | "Castaways who got ≥ 10 votes in one season" | **Clause Puzzle**: drag SELECT/FROM/WHERE/GROUP BY/HAVING/ORDER BY into the right order. |
| 7.2 | JOIN…ON / INNER, NATURAL, CROSS | Three ways to merge | **Join Picker**: same tables, swap the join type and compare results. |
| 7.3 | Outer joins: LEFT, RIGHT, FULL; NULL padding | "Every castaway and their jury vote." Non-jurors get NULL. | **Padding Animation**: unmatched rows survive with NULLs filled in. |
| 7.4 | The WHERE trap after an outer join | The blindside of the chapter | **Watch It Vanish**: add the WHERE filter and the NULL rows disappear. Move the filter into the join and they come back. |
| 7.5 | NULL; ISNULL, CAST; three-valued logic (TRUE/FALSE/UNKNOWN) | Season 51's ratings aren't in yet. That's a real NULL. | **3-Valued Truth Table** plus "Does WHERE keep this row?" quick-fire. |
| 7.6 | DDL: CREATE, PRIMARY KEY vs. UNIQUE, ALTER, FOREIGN KEY, DROP vs. TRUNCATE | Build your own **alliance tracker** table | **Table Workshop**: create, constrain and alter a table. DROP = "the tribe is dissolved." TRUNCATE = "the camp is cleared out." |
| 7.7 | DML: INSERT (column order, missing → NULL, INSERT…SELECT), DELETE, UPDATE | A fan-ratings table | **Clean the Data**: delete scores that are NULL or not BETWEEN 1 AND 10, then update a typo. |

---

## Chapter 8: Down the Mountain
*Gradient descent · 13 episodes · real ratings data*

**Dataset for the chapter:** US average viewers per season, which fell from **27.3M** in Season 1 to **4.7M** in Season 46. The raw numbers are in the millions, which sets up feature scaling (8.8) nicely.

| # | Topic | Survivor framing | Interactive |
|---|---|---|---|
| 8.1 | Optimization: the loss L(θ); scalable and fast methods | Fit the ratings decline | **Drag the Line** through the season dots. A squared-error loss bar updates live. |
| 8.2 | The GD algorithm θⱼ := θⱼ − α ∂L/∂θⱼ | A blindfolded descent challenge | **Step Down**: a ball on a 1D loss curve. Press "step" and it follows the slope. |
| 8.3 | Simultaneous vs. one-at-a-time updates | Two players, two strategies | **Correct vs. Incorrect**: two paths split apart on the contour plot. |
| 8.4 | Learning rate α: too small, too large, diverging | How big a step? | **α Slider**: crawl, overshoot or explode. |
| 8.5 | Local minima; automatic slowdown near the minimum | A bumpy mountain | **Drop the Ball**: pick start points on a bumpy curve. Steps shrink near the bottom. |
| 8.6 | The initial guess: random, not all equal, reasonable scale | Where you start matters | **Start Picker**: compare several starts. |
| 8.7 | GD for linear regression: h_θ(x) = θ₀ + θ₁x, J(θ), the update rules | The classic two-panel view | **Line ↔ Contour**: left, the line on the ratings; right, the J(θ₀, θ₁) contour with the GD path. |
| 8.8 | Feature scaling | Raw viewers (27,279,285) vs. viewers in millions | **Scale It**: the contours go from stretched to round and the iteration count drops. |
| 8.9 | Normal equation θ = (XᵀX)⁻¹Xᵀy; GD vs. NE; non-invertible XᵀX | One-shot solve | **Solve Button** with a comparison table. Add a duplicate feature (viewers in millions *and* in thousands) and the matrix can't be inverted. |
| 8.10 | Choosing α: line search, bold driver (×1.1 / ×0.5) | Adjusting your pace | **Bold Driver Animation**: α grows on good steps and halves on bad ones. |
| 8.11 | Batch, stochastic and mini-batch GD | Whole tribe, one castaway, or a small group | **Three-Way Race** across the contour. |
| 8.12 | Debugging: J vs. iterations; ε convergence test; trying α values (0.001, 0.003, 0.01, …) | Is the descent working? | **Loss Curve Doctor**: diagnose curves that go up, swing back and forth, or flatten too early. |
| 8.13 | HOGWILD! parallel GD with no locks | Tribes updating one shared board | **Shared Board**: k threads update weights at the same time. It still converges. |

---

## Chapter 9: Newton's Shortcut
*Newton's method · 6 episodes*

| # | Topic | Survivor framing | Interactive |
|---|---|---|---|
| 9.1 | Why go beyond GD: second-order methods, faster but more complex | Walking downhill is slow | **Recap Race** preview: GD takes many steps where Newton takes a few. |
| 9.2 | Root finding θ ← θ − F/F′ (tangent line, jump to zero, repeat) | "When does the ratings trend hit 3M?" | **Tangent Jumper**: watch each tangent line and where it lands on the axis. |
| 9.3 | Root vs. minimum; Newton for optimization θ ← θ − L′/L″; min vs. max from the sign of L″ | Find where the slope is zero | **Race**: GD vs. Newton on the same loss, with iteration counters. Flip the curve to show L″ < 0, a maximum. |
| 9.4 | Many variables: the Jacobian; ∇L = 0; the Hessian; Θ ← Θ − H⁻¹∇L | 2D ratings fit | **Contour Jumps**: Newton steps on the Chapter 8 contour. Hover to see the Hessian's numbers. |
| 9.5 | Pros (quadratic convergence, no α, no convexity needed) and cons (d² cost, needs L″) | The cost of being clever | **Parameter Slider**: the Hessian grid grows as d². Watch 100K vs. 1M parameters. |
| 9.6 | In practice: rarely used at high dimension; damping (Levenberg–Marquardt); quasi-Newton (L-BFGS); instability | When the shortcut fails | **Break Newton**: start far away or where L″ ≈ 0 and watch it diverge. Turn on damping to fix it. |

---

## Chapter 10: The Whole Island Votes
*Big data and MapReduce · 8 episodes*

| # | Topic | Survivor framing | Interactive |
|---|---|---|---|
| 10.1 | "Big" = bigger than an expensive server's RAM (5 GB in 2002 → 24+ TB in 2026) | Survivor premiered in 2000. Big data grew up alongside it. | **RAM Over Time** slider. |
| 10.2 | Why the old options failed: DIY software, expensive RDBMSs (ACID you don't need), SQL awkward for ML; cheap commodity hardware | Why Google built a new tribe | **Pros and Cons Cards**: flip to reveal. |
| 10.3 | MapReduce (Dean and Ghemawat, 2004); a distributed file system; Map → Shuffle → Reduce; good vs. bad fits | What MapReduce is good at | **Good Fit or Bad Fit?** Sort tasks like "count votes" (good) and "iterative model training" (bad). |
| 10.4 | Functional roots: Python map and reduce | The old idea underneath | **Mini Python Box**: map(lambda …) and reduce(lambda …) on vote rows. |
| 10.5 | Shared-nothing: each node has its own CPU, RAM and disk; network only; racks; NAS today | Each camp is its own island, joined only by boats | **Archipelago**: nodes as islands, racks as tribes, switches as docks. |
| 10.6 | The three phases; WordCount → **VoteCount** | Count every vote ever cast | **The Big Count**: 5,882 real votes split across 4 island nodes. Map emits (name, 1), boats ferry the shuffle (a traffic counter shows it's the costly part), and reduce sums. Result: the most-voted-against castaways of all time. |
| 10.7 | DFS: NFS, HDFS (GFS-style, runs on the JVM in user space); chunks; the primary assigns tasks | Splitting the vote file | **Chunk Map**: the file splits into blocks across nodes and the primary hands out tasks. |
| 10.8 | Failures are normal (1,000-day lifetime → about 1 failure per day); map worker, reduce worker and primary failures | **Medical evacuation** | **Med-Evac a Node**: a map worker fails and its completed output is lost (it was on local disk), so tasks rerun. A reduce worker fails and only in-progress tasks rerun. The primary fails and the whole job restarts. A failure calculator sits alongside. |

---

## End of every chapter
- **Tribal Council:** 3–5 self-check questions with answers to reveal. Nothing is graded.
- **Next time on…:** a narrator cliffhanger leading into the next chapter.

## Episode totals
| Ch | Title | Episodes |
|---|---|---|
| 0 | Day One | 1 |
| 1 | Previously on Data Science | 13 |
| 2 | Tribes and Keys | 8 |
| 3 | Alliance Logic | 7 |
| 4 | The Merge | 10 |
| 5 | Ask the Tribe | 10 |
| 6 | Counting Votes | 7 |
| 7 | Blindsides and Blanks | 7 |
| 8 | Down the Mountain | 13 |
| 9 | Newton's Shortcut | 6 |
| 10 | The Whole Island Votes | 8 |
| | **Total** | **90 episodes** (about 5–7 hours of material) |

## Numbers to double-check when building each chapter
- The p-values for 1.5 (age, and gender: 29 of 49 first boots were women).
- Whether the learned model in 1.12 really beats hand-written rules. If it doesn't, the lesson becomes "learning is hard with 50 examples."
- Exact Shot in the Dark counts (4 of 24 vs. 4 of 25, depending on whether one double tribal counts as two shots).
- Real ties for the WITH TIES demo in 6.7.
