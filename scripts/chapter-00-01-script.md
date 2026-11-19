# Script: Chapter 0 (Day One) and Chapter 1 (Previously on Data Science)

Draft for review. **Narrator** lines are what the page says. `#Tags` are on-screen captions. *Interactive* blocks describe what's on the right-hand panel. Every number marked ✓ was checked against the survivoR data (US seasons).

---

# Chapter 0: Day One

## Opening

**Narrator:**
> Thirty-nine days. Eighteen strangers. One island. And you, about to learn data science through the most dramatic show on television. (Sorry, other shows. It's true.)

---

## Episode 0.1: Welcome to the Island

**Narrator:**
> This module is about one thing: getting **useful, non-obvious knowledge out of data**. That's what data science is.
>
> To do it, you need two kinds of tools. There's the **software** that real data scientists use every day, and the **math, statistics and machine learning** that run underneath it.
>
> One more thing up front. This isn't only about machine learning. We care about **big data**: data so large and messy that just *storing* it and *asking it questions* is half the battle.
>
> Here's your island. Each camp is a chapter. You'll visit them in order. (No skipping ahead. I'm a narrator, not a miracle worker.)

*Interactive: Island Map*
- An illustrated island with **10 camps** connected by a path, one per chapter (1 History → 10 MapReduce).
- Hovering a camp shows the chapter title and the course topic.
- Past camp 10, the map fades into fog labeled **"Next season"**. Hovering the fog lists the course topics not covered yet: Imperative SQL, Modeling, EM Algorithm, Spark, Supervised Learning, Linear Regression, GLMs, Overfitting & Regularization, Outliers, Neural Networks, RNNs, LSTM, Unsupervised Learning, Mixture Models.

**What just happened:** Data science = useful, non-obvious knowledge from data. This module covers the tools, the math, and big data.

**Tribal Check:** *This module's focus is closest to…*
(a) pure machine learning (b) **big data, plus the tools and math to work with it** ✅ (c) spreadsheet skills
> **Narrator (on wrong answer):** "Close, but no torch. Machine learning is part of it, not the whole thing."

---

## Next time on…

> **Narrator:** "A coin flip that isn't a coin flip, a map that solved a mystery, and a robot that got voted off the island. Twice."

---
---

# Chapter 1: Previously on Data Science

## Previously on…

> **Narrator:** "Previously on Data Science: absolutely nothing. It's Chapter One. But this story didn't start with computers. It started with dice, a deadly disease, and a lot of very confident men."

---

## Episode 1.1: What Is Data Science?

**Narrator:**
> Every Survivor fan has heard this one: *win immunity, win the game.*
>
> Sounds obvious, right? Before we look, I want your guess.

*Interactive: Guess the Rule*
- A slider: **"In what % of seasons did the player with the most individual immunity wins become Sole Survivor?"** The student locks in a guess.
- **Reveal** fills a strip of 50 dots, one per season. Green means the immunity leader won. Grey means they didn't. If leaders tie, the dot is green when any of the tied leaders won.
- Result ✓: the immunity leader won in **19 of 50 seasons**. A blue marker shows the student's guess next to the green 38%.
- Hovering a dot shows: Season, immunity leader(s), actual winner.

**Narrator (after reveal):**
> Thirty-eight percent. The "obvious" strategy is wrong most of the time. `#ObviousIsNotAlwaysTrue`
>
> And *that* is data science: **extracting actionable knowledge from data**, especially knowledge you wouldn't have guessed.
>
> The data is usually:
> - **Large:** too big to fit in a single server's memory (RAM).
> - **Complex:** not one tidy table, and often **multi-modal**, meaning several kinds of data at once.
>
> Survivor is a perfect example. Look at everything we know about it.

*Interactive (below): Data Cards*
A row of flip cards with real counts ✓:
- **Castaways:** 938 appearances (US)
- **Votes:** 5,882 rows
- **Challenges:** 12,501 results
- **Jury votes:** 1,158
- **Episodes & ratings:** every episode's viewers and IMDb score
- **Video:** hundreds of hours of footage, a different *kind* of data entirely

Flipping a card shows one sample row, so students see that each card has a different shape.

**What just happened:** Data science = actionable, non-obvious knowledge from data that is often large and complex.

**Tribal Check:** *Survivor's data includes vote tables, challenge results and video footage. That makes it…*
(a) small (b) **multi-modal** ✅ (c) relational only

---

## Episode 1.2: Counting People

**Narrator:**
> Statistics started in the **1600s** with something simple: **counting people and money**. Governments wanted to know how many people lived where, how many died, and what everyone owned. That's economic and demographic data.
>
> Every Survivor season starts the same way: a cast of strangers, and you instantly start sizing them up. How old? Where from? Congratulations, you're doing 17th-century statistics. (Minus the plague. Mostly.)

*Interactive: Census of the Island*
- **Left:** a histogram of ages for all US castaways ✓ (average **33.3**).
- **Right:** a US map shaded by how many castaways came from each state.
- A season dropdown highlights one cast's ages and states over the full distribution.

**What just happened:** The first statistics were demographic counts: summaries of a population. Histograms and maps are still how we start.

**Tribal Check:** *Statistics began with which kind of data?*
(a) **economic and demographic** ✅ (b) genetic (c) social media

---

## Episode 1.3: Born From Gambling

**Narrator:**
> In the **17th century**, two French mathematicians, **Blaise Pascal** and **Pierre de Fermat**, traded letters about a gambling problem. How should you split the pot if a game of chance ends early? Their answer became **probability theory**.
>
> Survivor has its own gamble: the **Shot in the Dark**. Give up your vote, draw a scroll. Six scrolls. One says *safe*. So the probability should be **1 in 6**.
>
> Let's test that.

*Interactive: Shot in the Dark*
- Six face-down scrolls. **Play the Shot** reveals one with a flip animation. **Play 100 times** runs it fast.
- **Green bars** (observed): % safe vs. % not safe. **Blue bars** (true): 1/6 vs. 5/6.
- As the plays pile up, the green bars settle onto the blue bars.

**Narrator:**
> See? The more you play, the closer you get to 1 in 6. That's the **long-run frequency** idea from Seeing Theory, now with more torches.
>
> Now let's check the *real* Survivor history.

*Interactive, continued: The Twist*
- **Load real Shot in the Dark data** fills a table from the vote history: **9 "safe" out of 32 rows** ✓, which is 28%.

**Narrator:**
> Twenty-eight percent?! Did these players beat the odds? Is the scroll bag rigged?
>
> *(They did not. It is not. Hold that thought.)* `#DuplicatesAreLiars`

- A **Count each player's shot once** button highlights repeated rows (the same shot logged again in a revote or in a two-boot episode) and collapses them.
- Result ✓: **4 safe out of 24 shots = exactly 1 in 6.**

**Narrator:**
> Exactly one in six. Pascal and Fermat would be thrilled. The math was right all along. The *data* just needed a closer look.
>
> Remember this. It matters in Chapter 2.

**What just happened:** Probability began with gambling, and the observed frequency approaches the true probability. Before you count rows, know what one row means.

**Tribal Check:** *Why did the raw data show 28%?*
(a) players are lucky (b) **the same shot appeared in several rows** ✅ (c) the bag had two safe scrolls

---

## Episode 1.4: John Snow's Map

**Narrator:**
> London, **1854**. Cholera is tearing through the Broad Street neighborhood. Everyone *knows* the cause: "bad air."
>
> Everyone is wrong.
>
> A doctor named **John Snow** goes door to door, **interviews residents**, and **marks every case on a map**. The deaths cluster around one spot: a **public water pump**. Data beats the story. `#DataBeatsVibes`
>
> Survivor has its own "bad air." After every tribal, players explain what happened: *"He was a threat." "It was random."* But the votes don't lie.

*Interactive: Map the Blindside*
Real tribal ✓: **Season 16 (Micronesia), Episode 10, the Ozzy blindside.**
- Nine castaways sit in a circle around the fire. Each card starts face-down.
- The student clicks each voter to reveal their vote, and an arrow is drawn to the target.
- Votes ✓: Cirie, Parvati, Jason, Alexis and Natalie → **Ozzy**. Ozzy, James, Amanda and Erik → **Jason**.
- When all arrows are drawn, the five-person bloc lights up green and the result appears: **Ozzy, 5–4.**
- **Show Snow's map** opens a side panel with a simplified Broad Street map. Case dots cluster around the pump, the same "everything points to one source" pattern.

**Narrator:**
> Five arrows. One target. One alliance pulling the strings, the way one pump was behind every case. You didn't need anyone's explanation. You needed the map.

**What just happened:** Snow collected evidence, plotted it, and found the source. It's one of the earliest examples of data-driven reasoning.

**Tribal Check:** *What did Snow do that the "bad air" believers didn't?*
(a) used a microscope (b) **collected and mapped the actual cases** ✅ (c) asked the government

---

## Episode 1.5: Is It Real, or Just Chance?

**Narrator:**
> Between the late 1800s and about 1930, statistics grew up. Its big question: **is a pattern real, or did it happen by chance?**
>
> Here's a Survivor pattern for you ✓. The average castaway is **33.3** years old. The average **first person voted out** is **36.0**.
>
> So: are older players targeted first? Or is a three-year gap just luck?
>
> **Ronald Fisher** gave us the tool: the **null hypothesis**. You *assume nothing is going on* ("age doesn't matter") and ask how often pure chance would give you a gap this big.

*Interactive: Shuffle the Tribe (permutation test)*
- A jar holds every US castaway's age.
- **Shuffle once** picks **49 random castaways** as pretend first boots, computes their average age, and drops a dot onto a histogram.
- **Shuffle 1,000 times** builds the whole **"chance" distribution**. A blue line marks the real **36.0**.
- A counter reads: **"Chance gave an average this high ___% of the time."** ✓ about **2.5%** (one-sided). That's the **p-value**.
- **Toggle: Test gender instead.** 29 of 49 first boots were women, and the cast is about 50% women. Chance does this about **10%** of the time ✓.

**Narrator:**
> Age: chance rarely does that, only about 2.5% of the time. That's suspicious. `#SuspiciouslyOld`
>
> Gender: chance does that about 10% of the time, which is too often to rule out luck. Same game, same method, two different verdicts. *That* is why we test instead of guessing.

*Mini panel: Fisher's other idea, the Linear Discriminator*
- A scatter plot of castaways by **age** (x) and **challenge wins** (y). Early boots are one color and jury members another.
- The student drags a straight line to separate the two groups as well as possible, and a counter shows how many are on the wrong side.
- **Narrator:** "Fisher also asked: what's the best *straight line* to separate two groups? Hold onto that one. It comes back when we get to machine learning."

**What just happened:** The null hypothesis asks how surprising the data would be if nothing were going on. A small p-value means chance alone rarely produces it.

**Tribal Check:** *A p-value of 0.025 means…*
(a) there's a 2.5% chance age matters (b) **if age didn't matter, a gap this big would show up about 2.5% of the time** ✅ (c) 2.5% of players are old

---

## Episode 1.6: How Sure Are We?

**Narrator:**
> Two more founders: **Egon Pearson** and **Jerzy Neyman**. They pointed out you can be wrong in *two* ways:
> - **Type I error:** you think there's a pattern, and there isn't. (Calling a blindside that never happens.)
> - **Type II error:** there *is* a pattern, and you miss it. (Not seeing the blindside coming. The classic.)
>
> **Power** is your ability to catch a real pattern. **Confidence intervals** give a range for the true value instead of one number.

*Interactive: The Power Slider*
- Two sliders: **number of seasons** (5 → 100) and **true age gap** (0 → 6 years).
- The tool simulates seasons many times and shows:
  - a **power gauge**: how often the test detects the gap;
  - a **confidence-interval bar** for the age gap that gets **narrower** as the number of seasons grows.
- Labels mark the regions "missing a real pattern (Type II)" and "false alarm (Type I)."

**Narrator:**
> Fewer seasons means a wider interval and more blindsides you don't see coming. More data, more power. (Data scientists love more data. It's a whole thing.)

**What just happened:** Type I = false alarm. Type II = missed pattern. Power rises and confidence intervals narrow as you collect more data.

**Tribal Check:** *You conclude older players aren't targeted, but they actually are. That's a…*
(a) Type I error (b) **Type II error** ✅

---

## Episode 1.7: Computers Learn to Store Data

**Narrator:**
> Fast-forward. The **1940s** bring **ENIAC**, the first computer. In **1966**, IBM builds **IMS**, one of the first database systems, to keep track of parts for the **Apollo** moon program.
>
> In IMS, data was linked by **pointers**: each record says where the next one lives. To find something, you follow the trail.
>
> Then **Ted Codd** has an idea: put data in **plain tables**, and let people **ask for what they want** instead of spelling out how to find it.

*Interactive: Two Ways to Find a Winner*
- **Left, the pointer trail:** "Find the winner of Season 20." The student clicks through linked record boxes: Season 20 → Tribe → castaway → next castaway → … until reaching the winner. A click counter climbs.
- **Right, Codd's table:** the student picks "winner where season = 20" and the answer appears immediately.
- **Reorganize storage** shuffles where records live. On the left, arrows snap and the trail breaks (`ERROR: record not found`). On the right, the question still works.

**Narrator:**
> The pointer trail broke the moment we moved the furniture. The table didn't care. That's called **data independence**, and it'll be your whole personality in Chapter 2.

**What just happened:** Early databases followed pointers. Codd's relational model uses tables and declarative questions, so storage can change without breaking queries.

**Tribal Check:** *What did IMS originally track?*
(a) bank accounts (b) **inventory for the Apollo program** ✅ (c) TV ratings

---

## Episode 1.8: Can a Machine Think?

**Narrator:**
> Now, artificial intelligence. AI means programming an **intelligent agent**: something that can solve *new* problems, show **emergent behavior**, and do things it wasn't specifically programmed to do.
>
> The dream is old. In the **17th century**, **Leibniz** imagined a *calculus ratiocinator*, a reasoning machine. It was a precursor to mathematical logic.
>
> In **1943**, **McCulloch and Pitts** showed that **artificial neurons can do logic**. In **1951**, **Marvin Minsky** built **SNARC**, an early neural network machine. And in **1956**, at a workshop at **Dartmouth**, **John McCarthy** (who also invented the Lisp language) gave the field its name: **artificial intelligence**.
>
> So can a neuron do logic? Let's see if one can cast your vote.

*Interactive: The Alliance Neuron*
- One neuron with two inputs, each a 0/1 switch:
  - **A:** "My alliance is voting for X."
  - **B:** "X is a big threat."
- Each input has a **weight** slider, plus a **threshold** slider. Output: **Vote X** (1) or **Don't** (0).
- Challenges:
  1. Make it vote only when **both** are true → **AND**.
  2. Make it vote when **either** is true → **OR**.
- A truth table beside it fills in green as the neuron gets each row right.

**What just happened:** An artificial neuron adds weighted inputs and compares the total to a threshold. With the right weights, it computes logic like AND and OR.

**Tribal Check:** *Who named the field "artificial intelligence," and where?*
(a) Turing, Cambridge (b) **McCarthy, Dartmouth (1956)** ✅ (c) Minsky, MIT

---

## Episode 1.9: AI as Search

**Narrator:**
> Early AI had real wins, and most of them came from one idea: **AI as search**. Set a **goal**, break it into **subgoals**, try moves, and **backtrack** when you hit a dead end.
>
> That idea powered **Newell and Simon's General Problem Solver**, **Samuel's checkers program**, and, in a different style, **ELIZA** (MIT, 1964–66), a chatbot that faked conversation with clever rules.
>
> Survivor fans already know this one. It's the puzzle at the end of every challenge.

*Interactive: Puzzle Search Tree*
- A tiny sliding-tile or stacking puzzle on the left and its **search tree** on the right.
- **Step** expands one move at a time. Dead ends turn red and the search **backtracks** (an animated arrow goes back up the tree). The goal node turns green.
- A "subgoals" toggle colors the tree by subgoal ("get the top row right first").

**Narrator:**
> Try, fail, go back, try again. It's every castaway at the final puzzle, except the computer doesn't cry.

**What just happened:** Early AI treated intelligence as search: goals, subgoals and backtracking.

**Tribal Check:** *When the search hits a dead end it…*
(a) gives up (b) **backtracks to try another path** ✅ (c) restarts from scratch

---

## Episode 1.10: The Turing Tribal

**Narrator:**
> In **1950**, **Alan Turing** proposed a test. An interrogator sends **written questions** to a human and a computer and tries to tell which is which. If they can't, the machine passes.
>
> ELIZA impressed people. It came *nowhere near* passing. Let's find out why.

*Interactive: Castaway or Program?*
- Five rounds. Each shows one jury question and two written answers, A and B. One is from a castaway (written by us), the other from an ELIZA-style bot that just reflects your words back.
- Example round:
  - **Q:** "Why should I give you my vote?"
  - **A:** "Because I played the whole game. I flipped at the merge, and I told you to your face why."
  - **B:** "Why do you feel you should give me your vote?"
- The student picks the program. Feedback explains the giveaway (B just rearranged the question).
- After the rounds: **Hype cards** paraphrase predictions from **Simon and Minsky**, who expected human-level AI within a few decades. Each card is stamped with its year and a "🕯️ Still waiting" label.

**Narrator:**
> Experts said human-level AI was just around the corner. The corner turned out to be very, very far away. `#ConfidentlyIncorrect`

**What just happened:** The Turing Test asks whether a machine's written answers can pass as human. ELIZA's tricks fooled some people but couldn't pass, and early predictions about AI were wildly optimistic.

**Tribal Check:** *In the Turing Test, the interrogator communicates…*
(a) by voice (b) **through written questions** ✅ (c) face to face

---

## Episode 1.11: The AI Winter

**Narrator:**
> And then the money ran out. One by one, AI's big ideas got **voted off the island**.

*Interactive: The AI Boot Order*
- A horizontal timeline styled like a season's boot order, with a scrubber from 1950 to 1995.
- As the scrubber passes each event, that idea's torch is **snuffed** and its card slides into an **"Edge of Extinction"** lane:
  - **ALPAC report** → machine translation is criticized.
  - **1969, *Perceptrons*** (Minsky & Papert) → neural networks seem dead.
  - **1973, Lighthill Report** → Britain cuts AI funding.
  - **~1974, DARPA** cuts funding after its speech-recognition program (Harpy).
  - **1990, Japan's Fifth-Generation project** fails.
- Each card has a one-line "why it was voted out."

**Narrator:**
> The tribe has spoken. Neural networks, please bring me your torch. *(Spoiler: they're coming back. They always come back.)*

**What just happened:** Overpromising led to AI winters, long periods of cut funding after the hype.

**Tribal Check:** *Which 1969 book seemed to kill neural networks?*
(a) *Computing Machinery and Intelligence* (b) ***Perceptrons*** ✅ (c) *The Lighthill Report*

---

## Episode 1.12: Rules vs. Learning

**Narrator:**
> Here's what old-school AI could do: **reason**. Search game moves with **minimax**. Chain rules: if **A → B** and **B → C**, then **A → C**.
>
> Here's what it couldn't do: **learn**.
>
> **Machine learning** is AI that **learns from past data or experience**, and it's often statistical. Let's put them head to head.

*Interactive: Rules vs. Learning*
**Round 1, write the rules.** Pick one rule for choosing each season's winner among its finalists. Accuracy across all 50 seasons ✓:

| Rule | Accuracy |
|---|---|
| Pick at random (baseline) | 38% |
| Most individual immunity wins | 44% |
| Youngest finalist | 42% |
| Fewest votes against | 50% |
| **Most challenge wins** | **53%** |

**Round 2, let it learn.** A simple model learns from **seasons 1–40**, combining immunity wins, challenge wins, votes against and age, then predicts **seasons 41–50**. Results ✓:
- On the seasons it learned from: **53%**
- On the **new** seasons: **3 of 10 (30%)**, worse than guessing at random among three finalists (33%) and worse than a simple rule (40%).

**Narrator:**
> Plot twist! The machine *lost*. `#NotMagic`
>
> It did fine on the seasons it studied and stumbled on new ones. Why? Fifty seasons is a *tiny* amount of data. And the winner is chosen by a jury, which none of these numbers measure. Learning only works when you have **enough data** and the **future looks like the past**.
>
> (We'll come back to this. It has a name, **overfitting**, and it's coming for us later in this module.)

**What just happened:** Rule-based AI reasons from rules people wrote. Machine learning learns patterns from data, but it needs enough of the right data.

**Tribal Check:** *What's the key difference between ML and traditional AI?*
(a) ML is faster (b) **ML learns from past data or experience** ✅ (c) ML uses rules

---

## Episode 1.13: The Comeback

**Narrator:**
> Remember neural networks? Voted out in 1969? Well. Every great season needs a **return from the Edge**.

*Interactive: The Comeback Timeline*
The scrubber picks up at 1986. Each milestone **relights a torch** with a one-line card:
- **1986, Backpropagation** (Rumelhart, Hinton, Williams): trains neural nets with hidden layers using gradient descent. *Neural nets return to the game.* The forerunner of deep learning.
- **1989, Q-learning** (Watkins): learns from experience instead of data collected in advance (reinforcement learning).
- **1993, Association rule mining** (Agrawal, IBM): finds rules like {bread, butter} ⇒ {milk}. It started data mining.
  - *Mini demo:* reward wins on Isla Datos. The tool finds **{Pizza, Chocolate} ⇒ {Letters from Home}**.
- **1995, Random forests:** many decision trees vote, *literally a tribal council of trees.* Still among the most accurate classifiers.
- **1995, Support vector machines** (Cortes & Vapnik): "max margin," good with many features and little data.
- **1997, LSTM:** remembers state across sequences and avoids the vanishing gradient problem.
- **2006, Netflix Prize:** 100M ratings and $1M to beat Netflix by 10%. It spurred recommender systems.
- **2007, NVIDIA CUDA:** general-purpose computing on GPUs, which led to cuDNN, TensorFlow (2015) and PyTorch (2016).
- **2009, ImageNet** (Fei-Fei Li): 14M images in 20,000+ categories. **2012, AlexNet** followed.
- **2013, Word2Vec** (Mikolov, Google): word embeddings, so ML can work with text.
- **2014, GANs** (Goodfellow): a generator and a discriminator battle each other. This is what makes deep fakes possible.
- **GPT and Transformers:** Generative Pre-trained Transformer. Huge neural nets trained on most of the English text available electronically. *Sole Survivor… for now.*
- **Closing card, the medical example:** a 3D deep learning model reading low-dose lung CT scans reached an ROC of **94.4%** and **beat six radiologists**.

**Narrator:**
> Voted out in 1969. Back from the Edge in 1986. Running the whole game today. Honestly? Best comeback story ever. `#BackFromTheEdge`

**What just happened:** Starting with backpropagation in 1986, machine learning took over AI, powered by more data, faster GPUs and bigger models.

**Tribal Check:** *Which made general-purpose GPU computing possible and led to TensorFlow and PyTorch?*
(a) ImageNet (b) **NVIDIA CUDA** ✅ (c) Word2Vec

---

## Tribal Council (Chapter 1 self-check, 5 questions)

1. Data science data is often *large* and *complex*. Define each in one phrase.
2. The raw Shot in the Dark data showed 28% safe. Why was that misleading?
3. What does a null hypothesis assume?
4. Name two events that caused AI winters.
5. Rules vs. learning: why did the learned model do worse on new seasons?

## Next time on…

> **Narrator:** "There are eight Mikes on this show. *Eight.* So how does a database know which Mike you mean? Next time: keys, tables, and the end of pointers forever. (Okay, mostly forever.)"

---

### Notes for building
- All ✓ numbers come from `data/raw/` and will be recomputed in the build script, not typed in by hand.
- The Shot in the Dark count assumes each player gets one shot per season, so their repeated rows (revotes, two-boot episodes) collapse to one.
- Turing Tribal answers are written by us, not quoted from the show.
- Isla Datos (used in 1.13's mini demo) is fictional data.
