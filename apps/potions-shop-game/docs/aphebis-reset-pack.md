# Aphebis Reset Pack

This document banks the current Aphebis reset work as three linked artifacts:

1. **Aphebis Reset Manifesto** — the north star.
2. **Design Model & Mechanics Notes** — the conceptual model.
3. **SLC Prototype Brief: Fantasy Potions Shop** — the first buildable experiment.

---

# 1. Aphebis Reset Manifesto

## 1.1 What Aphebis is now

**Aphebis is an authored solo drama engine where stories unfold through a tableau of stateful scenes, each with its own emotional rules, risks, and consequences.**

It is designed to help a solo player experience meaningful character drama: moments where choices reveal, test, and reshape values, relationships, wounds, loyalties, fears, desires, and self-image.

The goal is not to simulate an infinite world. The goal is to create focused, authored dramatic situations that feel alive because the player chooses when and how to enter them, and because prior choices alter the emotional and material conditions of later scenes.

## 1.2 What Aphebis is not

Aphebis is not primarily:

* an open-world sandbox
* an infinite AI story generator
* a Skyrim-style quest machine
* a generic RPG rules engine
* a full simulation of everything in the world
* a content marketplace, at least not yet
* a traditional visual novel with static branches

Those may contain useful reference points, but they are not the current centre.

The current centre is **authored Drama Play**.

## 1.3 The core experience promise

Aphebis should let a player feel:

> “I entered a charged scene, made a choice that revealed something about my character, and came out with the world, my relationships, or my inner life changed.”

The player should not feel abandoned in a blank sandbox, nor dragged through rails. They should feel guided toward meaningful situations while retaining agency over character stance, timing, risk, and consequence.

## 1.4 Why Drama Play first

There are many Progress Play systems: games about advancement, winning, optimisation, combat effectiveness, loot, quests, power, and problem solving.

There are far fewer systems centred on Drama Play: character authenticity, emotional consequence, values under pressure, relational change, and meaningful small moments.

Aphebis should begin by proving Drama Play before adding Progress Play. Progress systems may be added later, but their role should be to create pressure, not to replace the dramatic core.

A useful distinction:

| Mode              | Core question                                    |
| ----------------- | ------------------------------------------------ |
| **Progress Play** | Can I overcome this situation?                   |
| **Drama Play**    | What does this situation reveal or change in me? |

Design principle:

> **Progress creates pressure. Drama creates meaning.**

## 1.5 Agency, guidance, and surprise

A central design triangle:

```text
Agency + Guidance + Surprise
```

Aphebis should provide:

* **Agency** — the player chooses what scenes to pursue, what emotional stance to take, what risks to accept, and how their character responds.
* **Guidance** — the player sees a tableau of possible scenes, prompts, pressures, boons, banes, clocks, and suggested directions.
* **Surprise** — hidden information, veiled scenes, timed transformations, AI performance, unresolved threads, and consequences create outcomes the player did not fully author.

Bad outcomes to avoid:

| Failure mode                 | What it feels like |
| ---------------------------- | ------------------ |
| High agency, low guidance    | Blank-page panic   |
| High guidance, low agency    | Rails              |
| High surprise, low coherence | Random nonsense    |
| High coherence, low surprise | Obvious branching  |

Target feeling:

> “I know what kinds of things I can do, I can choose how to engage, and the world responds in ways that surprise me but feel earned.”

## 1.6 The role of AI

AI should not be the game, the rules engine, or the sole author.

AI should act as:

* performer
* interpreter
* narrator
* bridge-maker
* emotional facilitator
* constrained GM-like assistant

AI can:

* voice NPCs within authored constraints
* frame emotional choices
* convert free-text intent into scene moves
* generate short dramatic narration after a choice
* create bridge scenes from existing unresolved material
* suggest guidance from the current scene tableau
* vary prose, tone, and presentation

AI should not freely invent core truth, rewrite established state, or solve broken design by making up arbitrary new facts.

Design principle:

> **Authored content provides truth. State rules provide structure. AI provides connective tissue.**

## 1.7 The first test-game direction

The current strongest SLC candidate is a **slice-of-life fantasy potions shop drama sim**.

Working premise:

> You run a small potions shop in a magical town. Every customer brings a need, a secret, a pressure, or a relationship. You decide what kind of shopkeeper — and person — you become.

The potions shop setting is strong because it naturally combines:

* shop sim pressure
* cosy fantasy texture
* customer-of-the-day scenes
* ethical choices
* relationship arcs
* staff management
* money and stock tension
* mundane moments made meaningful
* clear daily structure

Possible niche:

> **A cosy fantasy shop sim where the real progression is who you become to keep the doors open.**

## 1.8 Design guardrails

1. **Drama first, progress second.**
2. **Scenes should usually be enterable when fictionally plausible.** Use boons and banes rather than hard locks where possible.
3. **Values are dramatic gravity, not handcuffs.** They should pull, pressure, and colour choices, not forbid change.
4. **Small scenes can have bespoke systems.** Do not force everything into one all-encompassing mechanic.
5. **Global state tracks continuity. Scene-local state creates moment-to-moment play.**
6. **AI performs within constraints.** It should not own the truth of the world.
7. **No grand platform yet.** Build the smallest playable loop that proves the experience.
8. **If a scene does not create a meaningful state change, question whether it belongs.**
9. **Shop sim resources should generate drama scenes, not become isolated spreadsheet play.**
10. **A successful prototype makes the player want to play one more day.**

---

# 2. Design Model & Mechanics Notes

## 2.1 Experience design dimensions

Aphebis emerged from thinking about media and RPG experiences across several dimensions:

| Dimension                                  | Meaning                                                               |
| ------------------------------------------ | --------------------------------------------------------------------- |
| **Solo ↔ Relational / Group**              | Is the experience solitary, dyadic, or social?                        |
| **No control ↔ Full control**              | How much agency does the participant have?                            |
| **Freeform ↔ System-based**                | Is play governed by rules, prompts, or procedures?                    |
| **Emergent ↔ Authored**                    | Does meaning arise from interaction, from authorial design, or both?  |
| **Player frame ↔ Character frame**         | Is the participant optimising as a player or inhabiting a character?  |
| **Single perspective ↔ Multi-perspective** | Does play follow one viewpoint or several?                            |
| **Progression ↔ Experience goal**          | Is the system about advancement or about producing a felt experience? |
| **Predictable ↔ Surprising**               | Where does uncertainty come from?                                     |
| **Self-directed ↔ Guided**                 | How much does the system help the player know what to do next?        |

The current Aphebis direction favours:

* solo-first
* authored but stateful
* guided but not railed
* character-frame over player-optimisation-frame
* drama and experience goal before progression
* surprise through hidden state, veiled scenes, clocks, consequences, and AI performance

## 2.2 Hierarchy of design decisions

The dimensions are not flat. A useful decision order:

```text
1. Experience intent
2. Participant role
3. Control and guidance contract
4. Surprise model
5. Authorship model
6. System model
7. Reward/progression model
```

For Aphebis:

1. The experience intent is emotionally meaningful solo Drama Play.
2. The participant role is a character-first player shaping values and relationships.
3. The control contract is focused agency through scene choice, emotional stance, and consequence.
4. Surprise comes from veiled scenes, hidden truths, clocks, AI performance, and consequences.
5. Authorship comes from designed scenario ingredients and scene engines.
6. Systems are local, scene-specific, and lightweight.
7. Progression should reinforce drama rather than dominate it.

## 2.3 Drama Play vs Progress Play

Progress Play often asks:

* How do I win?
* How do I solve this?
* How do I optimise my build?
* How do I advance the quest?
* How do I increase power, money, territory, or success?

Drama Play asks:

* What do I want from this person?
* What am I afraid to admit?
* What does this cost me emotionally?
* What value wins when two values clash?
* What wound, bond, promise, or debt is created?
* What kind of person am I becoming?

Aphebis should begin with Drama Play.

## 2.4 Character authenticity

A key design goal is to help the player respond from character authenticity rather than defaulting to progress optimisation.

But character authenticity is double-edged. If too rigid, it can become obstructive or self-indulgent. The system should not simply ask “what would your character do?” in an infinite void.

Instead, characters should have dramatic handles:

* desires
* fears
* needs
* wounds
* bonds
* promises
* loyalties
* values
* contradictions
* temptations

Good prompt:

> “Given that you fear abandonment, owe Mara a debt, and still want the town to respect you, what do you do when she asks you not to go?”

Bad prompt:

> “Do anything.”

## 2.5 Values as dramatic gravity

Values should shape play over time.

Examples:

* Loyalty
* Mercy
* Ambition
* Honour
* Compassion
* Vengeance
* Faith
* Freedom
* Pride
* Caution
* Glory
* Self-preservation
* Truth
* Love
* Duty

A value should not be a handcuff. It should be **dramatic gravity**.

High Loyalty does not mean “you must obey.” It means loyalty scenes matter more, betrayal costs more, and loyalty clashes create pressure.

Values should:

1. influence prompts
2. create emotional pressure
3. offer dramatic moves
4. mark change over time

Example values clash:

```text
Loyalty to Crown: High
Bond with Friend: Strong
Justice: Medium
Fear of Treason: Rising
```

Scene question:

> Your friend is accused of killing the prince. Do you believe him and let him go, or take him in despite what it costs?

The drama emerges because not all values can be satisfied.

## 2.6 Emotional first response as mechanical tilt

A powerful mechanic is asking what emotion hits the character first, then letting that choice shape both narrative and mechanics.

Example: village attack.

Opening situation:

> Alarm bells sound. You grab your sword and run out. Greenskin bandits, the ones you previously failed to track down, are dragging villagers from their homes and setting fire to the place you grew up in.

Prompt:

> What hits you first?

Options:

| Response              | Mechanical tilt                      | Dramatic meaning            |
| --------------------- | ------------------------------------ | --------------------------- |
| Guilty                | +Resolve, +Duty/Shame, -Calm         | “I failed to stop this.”    |
| Afraid for yourself   | +Self Safety, -Villager Safety       | “I might die here.”         |
| Horrified at violence | +Mercy/Protection, -Aggression       | “No one should do this.”    |
| Afraid for villagers  | +Villager Safety, -Self Safety       | “I have to save them.”      |
| Excited for combat    | +Combat Momentum, -Collateral Safety | “Something in me wakes up.” |

This lets emotion become consequential without turning it into pure maths.

Principle:

> **Emotional choices allocate dramatic protection and dramatic risk.**

## 2.7 Material and dramatic state

Aphebis should track both material and dramatic consequences.

Material state:

* money
* stock
* injuries
* location status
* available resources
* scene outcomes
* secrets revealed
* clocks advanced

Dramatic state:

* guilt marked
* loyalty strained
* bond deepened
* promise made
* wound created
* string gained
* value confirmed
* self-image altered

A single action can have different meaning depending on emotional state.

If the character runs into danger after choosing “Afraid for yourself,” it is courage.
If they run into danger after choosing “Excited for combat,” it is appetite.
If they run into danger after choosing “Guilty,” it is atonement.

Same action, different meaning.

## 2.8 Bonds, strings, wounds, promises, debts

Relationship state should be semantic, not just numeric.

Useful dramatic flags for the thin slice:

| Flag          | Meaning                                             |
| ------------- | --------------------------------------------------- |
| **Bond**      | A meaningful connection or shared history           |
| **String**    | Emotional leverage one character holds over another |
| **Wound**     | A hurt, betrayal, shame, or unresolved pain         |
| **Promise**   | A future obligation or declaration                  |
| **Debt**      | A favour owed                                       |
| **Secret**    | Hidden knowledge with dramatic consequences         |
| **Condition** | Emotional or social state affecting scenes          |

Example:

```text
admittedFearOfAbandonment: true
```

This is far richer than:

```text
Mara.trust = 2
```

Numbers are useful, but semantic state is more AI-friendly and more dramatically alive.

## 2.9 Global state vs scene-local state

Aphebis should avoid one giant universal system for everything.

Instead:

```text
Global State
- character values
- bonds
- wounds
- promises
- debts
- reputation
- money
- stock
- fatigue
- active clocks
- active scene tableau
- major story truths

Scene-local State
- pressure in this interrogation
- villager safety in this raid
- rapport in this confession
- evidence in this trial
- fire in this disaster
- exhaustion in this brewing scene
```

Scene-local systems create moment-to-moment play. At the end, they write meaningful outputs back to global state.

## 2.10 Stateful scenes / micro-state machines

Each important scene can function as a small bespoke state machine.

Example: village attack scene.

```text
Local tracks:
- Self Safety
- Villager Safety
- Combat Momentum
- Fire/Doom
- Emotional First Response

Inputs:
- How do you feel?
- Where do you run?
- Who do you protect?
- Do you fight, flee, rescue, freeze, or call for help?

Outputs:
- Who survives?
- What is lost?
- What value is marked?
- What wound/bond/string is created?
- What next scene appears?
```

The scene has local rules, but does not require a universal simulation of everything.

This is best understood as:

> **Scenes as little bespoke engines.**

## 2.11 Scene tableau model

Stories unfold through a shifting tableau of possible scenes.

A scene can be:

* dormant
* veiled
* revealed
* available
* risky
* primed
* blocked
* timed
* active
* resolved
* expired
* triggered
* transformed

Lifecycle:

```text
Dormant → Veiled → Revealed → Available / Risky / Primed / Blocked → Active → Resolved
                         ↓
                    Expired / Triggered / Transformed
```

The player does not wander an open world. They choose which dramatic scene opportunity to attend to.

This provides guidance without rails.

## 2.12 Boons and banes, not binary unlocks

Instead of saying:

```text
Find clue → unlock interrogation
```

Prefer:

```text
Interrogation is available.
The clue gives an Evidence Boon.
Mara’s distrust gives a Resistance Bane.
Public setting gives a Pressure Bane.
```

Scenes should usually be enterable whenever fictionally plausible. Prior play should change their odds, costs, risks, and available leverage.

A scene can advertise:

* boons
* banes
* possible costs
* visible pressure
* hidden risks
* timed changes

This allows underprepared, premature, messy, emotional play — which is often where drama lives.

## 2.13 Timed scenes, clocks, expiry, and transformation

Scenes can have clocks.

Types:

| Clock type           | Meaning                                         |
| -------------------- | ----------------------------------------------- |
| Trigger clock        | Scene fires automatically when time runs out    |
| Expiry clock         | Scene becomes unavailable if ignored            |
| Transformation clock | Scene changes into another scene if time passes |
| Pressure clock       | A threat or condition worsens over time         |

Examples:

```text
Wounded Survivor
Expires after 1 scene.
If expired: survivor dies or is moved.
```

```text
Mara Alone at the Chapel
After 1 scene: Mara Flees.
After 2 scenes: Mara Captured.
```

This makes attention and delay meaningful.

## 2.14 Bridge scenes / momentum moves

If the player reaches a stalled state, the system can use a bridge scene.

Purpose:

> Convert “nothing actionable is available” into a concrete pressure, clue, opportunity, or choice.

Bridge scenes should be generated from existing ingredients, not arbitrary invention.

Good bridge scene:

* reveals existing information
* brings a relevant NPC onstage
* advances an active clock
* invokes a bond, debt, wound, or promise
* reframes an open question
* creates one new actionable lead

Bad bridge scene:

* invents a random unrelated truth
* solves the problem without cost
* becomes the primary engine rather than a safety valve

Possible name:

* Momentum Move
* Bridge Scene
* Recovery Move
* Reframe Scene

Principle:

> AI may bridge from existing unresolved material. It may not create arbitrary new core truth just to rescue the story.

## 2.15 Scene engine examples

Reusable scene archetypes:

| Scene engine        | Core question                                               | Possible tracks                                      |
| ------------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| Raid / Disaster     | What do you protect first?                                  | Self Safety, Innocent Safety, Threat Momentum        |
| Interrogation       | What truth comes out, and what does it cost?                | Pressure, Rapport, Truth Exposure, Collateral Damage |
| Confession          | What do you risk saying?                                    | Vulnerability, Trust, Fear, Desire                   |
| Trial / Accusation  | What truth do you stand behind?                             | Evidence, Public Opinion, Loyalty Pressure           |
| Duel                | What are you willing to become to win?                      | Advantage, Injury, Fury, Restraint                   |
| Escape              | What do you leave behind?                                   | Distance, Pursuit, Exhaustion, Sacrifice             |
| Customer Need       | What do they really need, and what are you willing to give? | Need, Trust, Profit, Risk, Distance                  |
| Brew Under Pressure | What kind of craftsperson are you under pressure?           | Quality, Safety, Time, Exhaustion, Improvisation     |
| Boundary Scene      | Where does the shopkeeper end and the person begin?         | Care, Boundaries, Obligation, Resentment, Intimacy   |

## 2.16 Interrogation scene model

Core dramatic question:

> What truth comes out, and what does it cost?

Possible tracks:

* Pressure
* Composure
* Rapport
* Resistance
* Leverage
* Truth Exposure
* Collateral Damage

Opening stance options:

| Approach    | Effects                                                  |
| ----------- | -------------------------------------------------------- |
| Gentle      | +Rapport, -Pressure, slower Truth Exposure               |
| Direct      | +Pressure, +Truth Exposure, +Resistance                  |
| Threatening | ++Pressure, +Collateral Damage, possible Composure break |
| Personal    | +Rapport or +Vulnerability, may create String            |
| Deceptive   | +Leverage if it lands, +Collateral Damage if exposed     |
| Silent      | Tests Composure; may reveal tells or stall               |

Example thresholds:

```text
Truth Exposure >= 4:
  They reveal the core truth, but frame it in self-protection.

Composure <= 0:
  They break: confession, panic, anger, or flight.

Pressure >= 4 and Rapport <= 0:
  They shut down, lie harder, call for help, or give a false confession.

Collateral Damage >= 3:
  Even if you get the truth, the relationship is wounded.
```

This model turns interrogation into a drama engine, not just a clue dispenser.

---

# 3. SLC Prototype Brief: Fantasy Potions Shop

## 3.1 Prototype goal

Build a small playable prototype that tests the Aphebis core loop:

> Does the player enjoy choosing which scene to enter, resolving it through light dramatic/shop mechanics, and watching the tableau/resource/emotional state mutate?

The prototype should not prove the entire Aphebis platform. It should prove the feel of authored solo Drama Play with stateful scenes.

Success metric:

> After one in-game day, the player wants to play another day.

## 3.2 Working title

Placeholder titles:

* Briarwick Apothecary
* The Last Draught
* Rain at the Potion Shop
* The Little Potion Shop That Could Ruin You Emotionally
* Moonleaf & Mercy

## 3.3 Premise

You run a small potions shop in a magical town. Every customer brings a need, a secret, a pressure, or a relationship. You decide what kind of shopkeeper — and person — you become.

The prototype covers five days.

Rent is due on Day 5.

The player must balance money, stock, fatigue, reputation, staff relationships, customer needs, and personal values.

## 3.4 Why fantasy potions shop?

The fantasy potions shop is a strong first test because it naturally creates:

* a daily loop
* clear resource pressure
* customer scenes
* ethical dilemmas
* cosy slice-of-life tone
* staff relationships
* town reputation
* brewing requests
* recurring NPCs
* mundane moments with emotional meaning

The shop counter is a natural dramatic stage. People come to the player with needs. Every sale can become a values test.

## 3.5 Core loop

Daily loop:

```text
Start day
→ show global state
→ reveal/advance scene tableau
→ choose scenes to play
→ resolve selected scenes
→ mutate global state
→ advance clocks
→ end day reflection
→ repeat
```

A minimal day might allow the player to choose two scenes before evening.

## 3.6 Global state

Global state should be generic and tracked throughout the prototype.

Initial candidate state:

```text
Day: 1
Coins: 18
Rent due on Day 5: 30
Potion Stock: 3
Ingredient Stock: 5
Fatigue: 0
Reputation: 0
Compassion: 0
Prudence: 0
Ambition: 0
Staff Trust: 0
Town Trust: 0
Resolved Scenes: []
Active Flags: {}
Active Scene Tableau: []
```

Keep the first prototype small.

Suggested minimal resources:

* Coins
* Stock
* Fatigue

Suggested minimal values:

* Compassion
* Prudence
* Ambition

Suggested minimal relationship tracks:

* Apprentice Trust
* Town Trust

## 3.7 Global state vs scene-local state

Global state handles continuity:

* shop resources
* values
* relationships
* reputation
* flags
* active clocks
* scene tableau

Scene-local state handles the micro-system for the current moment:

* pressure
* quality
* rapport
* risk
* customer need
* emotional distance
* fatigue impact

For the SLC, scene-local state can be very simple. Many scenes may resolve through choices with effects rather than complex local tracks.

## 3.8 Scene tableau

The player should see a small set of available scene opportunities each day.

Example Day 1 tableau:

```text
- The Desperate Stablehand
- Brew Under Pressure: Moon-Tonic Order
- Apprentice Hiding a Mistake
- A Gift Left at the Door
```

Each scene should show:

* title
* short description
* type
* visible boons
* visible banes
* timed status if relevant
* possible stakes

The player chooses which scene to enter.

## 3.9 Scene types for the prototype

Use a small number of scene types:

1. Customer Need Scene
2. Brew Under Pressure Scene
3. Staff Relationship Scene
4. Shop Pressure Scene
5. Quiet Reflection Scene

Do not build a potion brewing mini-game yet. Potion brewing is a scene type, not a separate game.

## 3.10 Shop sim layer

The shop sim should provide global pressure.

Tracked shop concerns:

* coins
* rent
* stock
* fatigue
* reputation/trust
* staff/apprentice relationship

Shop sim should generate drama scenes.

Examples:

| State pressure           | Possible scene                                             |
| ------------------------ | ---------------------------------------------------------- |
| Low coins                | Rent Comes Due, Noble Rush Order, Raise Prices?            |
| Low stock                | Substitute Ingredient, Turn Away a Patient, Risky Supplier |
| High fatigue             | Mistake in the Brew, Closing Early, Apprentice Concerned   |
| Low staff trust          | Apprentice Hides a Mistake, Someone Considers Leaving      |
| High kindness reputation | More desperate customers arrive                            |
| High ambition            | Bigger orders, guild attention, rival tension              |

The shop sim should create pressure, not dominate the experience.

## 3.11 Potion brewing in the SLC

Do not build a full mini-game.

Potion brewing should be story-based and resolved as a scene.

Example scene structure:

```text
Scene: Brew Under Pressure

Inputs:
- requested potion
- available stock
- customer stakes
- time pressure
- fatigue
- possible staff help

Choices:
- Safe brew
- Cheap substitute
- Experimental brew
- Delay and forage
- Ask apprentice to help
- Refuse the request

Outputs:
- stock change
- coins gained/lost
- fatigue change
- customer outcome
- reputation change
- possible side effect
- possible future scene
```

This is SLC enough to test the actual game.

## 3.12 Staff as shop management and relationship building

Staff should eventually be both a shop sim mechanic and a long-term relationship channel.

For the SLC, include one apprentice.

Apprentice state:

```text
Name: TBD
Trust: 0
Confidence: 0
Hidden Issue: wants approval but fears being a burden
```

Apprentice can:

* help brew
* handle customers
* make mistakes
* reduce fatigue
* create scenes
* become emotionally important

Principle:

> A mechanical asset should also be a person with needs, possible wounds, and future scenes.

## 3.13 Example scenes

### Scene: The Desperate Stablehand

Visible description:

> A young stablehand comes in near closing, soaked from the rain. His little sister has a fever. He has three copper coins. The fever draught costs twelve.

Boons:

* You have one fever draught already brewed.
* He helped you unload crates last week.

Banes:

* Stock is low.
* Rent is due soon.
* If you give medicine away, word may spread.

Core question:

> Is your shop a business, a refuge, or something in between?

Choices:

1. Give him the draught for three coins.
2. Give him the draught for free.
3. Offer credit, but write down the debt.
4. Refuse, explaining that you cannot save everyone.
5. Ask why he came here instead of the temple.

Possible effects:

```text
Give for free:
- Stock -1
- Coins +0
- Compassion +2
- Town Trust +1
- Flag: stablehand_grateful
- Add possible future scene: Temple Healer Visits

Refuse:
- Prudence +1
- Town Trust -1
- Coins +0
- Flag: stablehand_refused
- Add possible future scene: Rumour at Market
```

### Scene: Brew Under Pressure — Moon-Tonic Order

Visible description:

> A courier from the observatory needs a Moon-Tonic before nightfall. The pay is excellent, but the brew will consume ingredients you may need for ordinary customers.

Boons:

* The recipe is familiar.
* The courier can pay well.

Banes:

* Ingredient stock is low.
* Fatigue is rising.

Core question:

> Do you prioritise a profitable order when the town may need those ingredients later?

Possible choices:

1. Brew carefully and charge full price.
2. Brew quickly and risk a flaw.
3. Decline to preserve stock.
4. Ask the apprentice to handle part of the process.
5. Use a cheaper substitute.

### Scene: Apprentice Hiding a Mistake

Visible description:

> You find a cracked vial tucked behind the lower shelf. The label is in your apprentice’s handwriting.

Boons:

* You noticed before anyone was hurt.

Banes:

* The apprentice has been quiet all morning.
* You are tired.

Core question:

> Are you a mentor, a manager, or someone too exhausted to be either?

Possible choices:

1. Ask gently what happened.
2. Confront them sharply.
3. Clean it up yourself and say nothing.
4. Turn it into a lesson.
5. Dock their pay or privileges.

Possible outputs:

* Apprentice Trust changes
* Fatigue changes
* Prudence/Compassion/Ambition changes
* future staff scene added

### Scene: A Gift Left at the Door

Visible description:

> Before opening, you find a small bundle of rare moonleaf tied with blue thread. No note.

Boons:

* Rare ingredient gained if accepted.

Banes:

* Unknown source.
* Gifts often mean obligations.

Core question:

> Can you accept kindness without knowing what it will cost?

Choices:

1. Accept and use it.
2. Store it but do not use it yet.
3. Ask around town.
4. Throw it away.
5. Leave a thank-you charm by the door.

Possible outputs:

* Ingredient Stock +1
* Flag: mysterious_gift_accepted
* Add veiled scene: The Gift Giver
* Prudence/Trust changes

### Scene: Counting Coins at Midnight

Visible description:

> The shop is quiet. Rain taps against the window. You count the coins twice and still come up short.

Core question:

> What does security cost you?

Choices:

1. Raise prices tomorrow.
2. Work late and increase fatigue.
3. Write to family for help.
4. Trust that tomorrow will bring customers.
5. Close your eyes and let yourself rest.

Possible outputs:

* Coins/stock/fatigue changes
* Ambition/Prudence changes
* possible future scene: Letter From Home

## 3.14 Five-day prototype structure

Suggested structure:

### Day 1

Introduce shop, resources, apprentice, and first customer pressure.

Scenes:

* The Desperate Stablehand
* Brew Under Pressure: Moon-Tonic Order
* Apprentice Hiding a Mistake
* A Gift Left at the Door

### Day 2

Consequences of Day 1 begin to appear.

Scenes may include:

* Temple Healer Visits
* Rival’s Customer
* Forage in Bad Weather
* Apprentice Asks for Trust

### Day 3

Pressure increases. Introduce bigger choice.

Scenes may include:

* Noble Rush Order
* Fever Rumour Spreads
* Supplier Offers Cheap Stock
* Quiet Moment: Repairing the Sign

### Day 4

Rent pressure is high. Relationships react.

Scenes may include:

* Staff Burnout
* The Regular Who Is Not Okay
* Raise Prices?
* The Gift Giver Revealed

### Day 5

Rent due. Ending reflects both material and dramatic state.

Outcomes should not be only success/failure. They should reflect who the player became.

Possible ending dimensions:

* Paid rent / failed rent / negotiated rent
* shop reputation
* apprentice relationship
* town trust
* dominant value
* unresolved future hook

## 3.15 What AI does in the prototype

AI can be omitted entirely from the first mechanical prototype if needed.

If included, keep it narrow.

AI can:

* narrate scene openings from structured data
* narrate consequences after choices
* voice NPC lines
* summarise end-of-day changes
* generate flavour text from current state

AI should not:

* invent rules
* decide core scene effects
* override global state
* create arbitrary new scenes without constraints
* resolve money/stock/fatigue inconsistently

Initial AI prompt role:

> Given the scene, current state, selected choice, and mechanical effects, write a short emotionally grounded narration that reflects the consequence without changing the facts.

## 3.16 SLC technical direction

A simple local TypeScript prototype is enough.

Suggested stack:

* TypeScript
* Vite
* React or Vue
* local in-memory state
* JSON/TS scene definitions
* no backend
* no database
* no authentication
* no creator tools

Suggested structure:

```text
/src
  /engine
    state.ts
    scenes.ts
    resolveChoice.ts
    advanceDay.ts
  /content
    sceneLibrary.ts
    dayPlan.ts
  /ui
    App.tsx or App.vue
```

Core implementation needs:

* display global state
* display scene tableau
* choose a scene
* show scene description, boons, banes, choices
* apply choice effects
* update global state
* advance day
* show end-of-day reflection
* finish after Day 5

## 3.17 Example data model sketch

```ts
type ResourceKey = "coins" | "stock" | "fatigue";
type ValueKey = "compassion" | "prudence" | "ambition";
type RelationshipKey = "apprenticeTrust" | "townTrust";

type GameState = {
  day: number;
  resources: Record<ResourceKey, number>;
  values: Record<ValueKey, number>;
  relationships: Record<RelationshipKey, number>;
  flags: Record<string, boolean>;
  sceneTableau: string[];
  resolvedScenes: string[];
};

type Scene = {
  id: string;
  title: string;
  type: "customer" | "staff" | "shop" | "town" | "reflection" | "brew";
  description: string;
  coreQuestion: string;
  boons?: string[];
  banes?: string[];
  choices: SceneChoice[];
  clock?: SceneClock;
};

type SceneChoice = {
  id: string;
  label: string;
  description?: string;
  effects: Effect[];
};

type Effect =
  | { kind: "resource"; key: ResourceKey; delta: number }
  | { kind: "value"; key: ValueKey; delta: number }
  | { kind: "relationship"; key: RelationshipKey; delta: number }
  | { kind: "setFlag"; key: string; value: boolean }
  | { kind: "addScene"; sceneId: string }
  | { kind: "removeScene"; sceneId: string };

type SceneClock = {
  expiresOnDay?: number;
  transformsOnDay?: number;
  transformsInto?: string;
};
```

## 3.18 Acceptance criteria

The prototype is successful if:

1. The player can complete a five-day run.
2. Each day presents a small tableau of scene opportunities.
3. Scenes display visible boons/banes or stakes.
4. Choices mutate global state.
5. At least some choices create future scenes or alter later scenes.
6. Money, stock, and fatigue create pressure.
7. Compassion, Prudence, and Ambition shift through play.
8. The apprentice relationship can improve or worsen.
9. Rent on Day 5 creates a concrete shop sim objective.
10. The ending reflects both shop outcome and dramatic identity.
11. No potion mini-game is required.
12. No AI is required for the first build, though it can be added for narration.

## 3.19 Explicitly out of scope

Do not build yet:

* open world map
* full RPG combat
* complex potion brewing mini-game
* procedural town generation
* user accounts
* online saving
* content marketplace
* creator/editor UI
* long-term campaign system
* multiple protagonists
* complex AI memory
* visual novel renderer
* branching dialogue engine beyond scene choices
* elaborate ECS framework

## 3.20 Prototype thesis

The prototype should test this thesis:

> A small set of authored, stateful scenes combined with lightweight shop sim state can create a compelling solo Drama Play loop, where the player’s choices shape not only whether the shop survives, but what kind of person the shopkeeper becomes.
