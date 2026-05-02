# Design Guide

Dramatic scenes should usually contain 3–5 beats.

A beat is not a line of dialogue. A beat is a change in the player’s understanding, pressure, or available stance.

Most scenes should include:
1. An opening situation.
2. A posture or interpretation choice.
3. A complication or reveal.
4. A commitment choice.
5. A consequence or echo.

At least one beat in a major scene should resist automatic optimisation. The player should need to interpret the situation, weigh values, or act under incomplete information.

Early beat choices should mostly affect local scene state, revealed information, tone, and later options. Global state changes should usually occur at commitment or consequence beats.

If the game asks the player to think, that thinking must pay off through altered information, altered choices, NPC reaction, future scene changes, or consequence text.

Scenes may have an internal design tension, but this is for authors and review tools, not player-facing UI. The player should encounter pressure, contradiction, and detail — not a labelled theme. If the tension is working, the player can infer what matters from the situation itself.

Do not expose the dramatic question to the player.
Let the scene imply it through situation, detail, pressure, and choice wording.

Give each scene a dramatic tension in authoring notes.
Express that tension through visible fictional pressure.

# Posture-First Choices

## Purpose

Aphebis scenes should encourage the player to choose from **character stance, interpretation, and intent**, not from obvious mechanical optimisation.

A weak choice asks:

> Which stat do you want to improve?

A strong choice asks:

> What kind of person are you being in this moment?

The mechanics still matter, but they should usually sit behind the fiction. The player should feel they are making a dramatic choice first and discovering the consequences second.

---

## Core Principle

Choice labels should describe **stance and intent**, not mechanical rewards.

Prefer:

```text
“Take it. Pay me when she’s better.”
```

Over:

```text
Give potion for credit. +Town Trust, -Stock.
```

Prefer:

```text
“You should have told me. But I want to understand why you didn’t.”
```

Over:

```text
Gentle reprimand. +Apprentice Trust.
```

The player should be choosing a posture toward the situation, not selecting from a visible stat menu.

---

## What “Posture” Means

A posture is the emotional, moral, or social stance the player-character takes in a situation.

Examples:

```text
Warm
Guarded
Professional
Suspicious
Merciful
Proud
Pragmatic
Tender
Controlling
Avoidant
Generous
Hard-nosed
Curious
Defensive
Ashamed
```

Posture is not the same as action.

Two characters may perform the same action with very different posture:

```text
Give the draught freely.
Give the draught because people are watching.
Give the draught while making the debt explicit.
Give the draught angrily, because refusing would make you feel worse.
```

Mechanically, these may share some effects but diverge in values, relationships, memories, and future scene tone.

---

## Design Rule

A scene choice should usually answer one or more of these questions:

```text
What do you believe is happening?
What emotion do you lead with?
What are you protecting?
What are you risking?
Who are you prioritising?
What do you refuse to admit?
What kind of relationship are you creating?
What do you want this moment to mean?
```

Avoid choices that only answer:

```text
Which resource do you spend?
Which stat do you raise?
Which obvious good/bad branch do you pick?
```

---

## Good Choice Shape

A good posture-first choice has:

```text
1. A clear fictional action.
2. A visible emotional or moral stance.
3. A plausible cost or risk.
4. Consequences that are not fully reducible to numbers.
```

Example:

```text
“You can take the fever draught. But come back tomorrow and tell me the truth about the temple.”
```

This implies:

```text
Action: give the draught
Posture: compassionate but not naive
Risk: stock loss, delayed truth
Future hook: temple story
Relationship signal: help with boundaries
```

---

## Weak vs Strong Examples

### Customer Need Scene

Weak:

```text
Give potion for free.
Sell potion at full price.
Refuse customer.
```

Better:

```text
“Take it. Your sister matters more than my ledger tonight.”
“I can help, but not for nothing. We write the debt down properly.”
“I am sorry. If I give away the last draught, someone else may die tomorrow.”
“Before I decide, tell me why the temple turned you away.”
```

Why this is better:

```text
Each choice expresses a worldview.
The player is not just selecting generosity, profit, refusal, or investigation.
They are defining what kind of shopkeeper they are.
```

---

### Apprentice Mistake Scene

Weak:

```text
Comfort apprentice.
Punish apprentice.
Ignore mistake.
```

Better:

```text
“You made a mistake. Hiding it is the part we need to talk about.”
“I should have noticed you were afraid to tell me.”
“Clean it up. Then we go through the recipe together.”
“This shop cannot survive if I have to doubt your hands.”
“Say nothing yet. Let them decide whether to confess.”
```

Possible tracked posture:

```text
Mentoring
Control
Trust
Resentment
Avoidance
Professionalism
```

---

### Suspicious Gift Scene

Weak:

```text
Accept gift.
Reject gift.
Investigate gift.
```

Better:

```text
“Kindness is rare enough. Accept it before suspicion spoils it.”
“Store it untouched. A gift with no name is still a hook.”
“Ask quietly around town before using a single leaf.”
“Burn it. Obligations enter through open doors.”
“Leave a thank-you charm outside and see who notices.”
```

These choices are not just actions. They say something about trust, fear, gratitude, caution, and worldview.

---

## Mechanical Implications

The system should support posture-first design, but it should not try to enforce good writing.

Useful mechanics include:

```text
Properties that track values, tendencies, and relationships.
Scene-local state for temporary posture and pressure.
Memory tokens or flags that preserve how a choice was made.
Semantic labels that describe changes in human-readable terms.
Future scene availability based on posture, not only outcomes.
```

Examples of useful tracked properties:

```text
Compassion
Prudence
Ambition
Trust
Suspicion
Resentment
Obligation
Reputation
Fatigue
Confidence
Fear
```

Examples of scene-local posture variables:

```text
rapport
pressure
suspicion
vulnerability
distance
urgency
leverage
```

Examples of memory tokens:

```text
apprentice_felt_trusted
apprentice_felt_shamed
stablehand_helped_with_boundary
stablehand_helped_without_question
temple_story_challenged
gift_accepted_despite_doubt
```

The important distinction:

```text
Global properties track who the character is becoming.
Scene-local state tracks how this moment is unfolding.
Memory tokens track what specific people remember.
```

---

## Avoid Stat Translation Labels

Do not write choice labels like:

```text
Compassionate response
Prudent response
Ambitious response
Increase trust
Reduce suspicion
Take reputation hit
```

These are design notes, not player-facing choices.

Instead, write the actual thing the character does or says.

Bad:

```text
Compassionate response
```

Good:

```text
“You look frozen. Sit by the stove before we talk about coin.”
```

Bad:

```text
Increase Apprentice Trust
```

Good:

```text
“Show me where the mixture turned. We fix it together.”
```

Bad:

```text
Prudent refusal
```

Good:

```text
“If I sell the last draught tonight, I open tomorrow with empty shelves.”
```

---

## When to Show Mechanics

Mechanical consequences can still be shown, but usually **after** the choice.

Recommended order:

```text
1. Player sees fictional choices.
2. Player chooses based on stance.
3. Scene shows narrative consequence.
4. UI shows mechanical impact as a summary.
```

Example after choosing:

```text
He takes the draught with both hands, as if warmth might leak out of it.

Consequences:
- Fever Draught Stock fell to Empty.
- Town Trust shifted from Unknown to Quietly Hopeful.
- Apprentice remembers that you helped without asking for coin.
- New future scene added: Temple Healer Visits.
```

The numbers are useful. They are not the main meal.

---

## Hidden vs Visible Stakes

Do not make choices feel random. The player should understand the **kind** of risk, even if they do not know the exact mechanical result.

Good visible stakes:

```text
This may cost scarce stock.
This may make the apprentice feel trusted.
This may encourage more desperate customers.
This may preserve money but damage your reputation.
This may reveal why the temple refused him.
```

Avoid:

```text
No clue what this will do.
Secretly punishes the player for a reasonable interpretation.
Exact stat maths shown upfront every time.
```

The player should think about the situation, not reverse-engineer the spreadsheet.

---

## Posture Can Change the Same Outcome

The same material action can have different dramatic meaning.

Example: the player gives the fever draught.

Possible postures:

```text
Give it freely.
Give it as credit.
Give it while demanding the truth.
Give it because the apprentice is watching.
Give it resentfully.
Give it as an act of defiance against the temple.
```

Potentially shared effect:

```text
Stock -1
```

Divergent effects:

```text
Compassion increases
Prudence increases
Suspicion increases
Temple tension increases
Apprentice trust changes
Stablehand memory changes
Future scene tone changes
```

This is why posture matters. It lets the game distinguish between identical actions with different emotional meanings.

---

## Authoring Checklist

For each player-facing choice, ask:

```text
Does this sound like something a character would actually say or do?
Does it express a stance, not just an outcome?
Would two reasonable players disagree about it?
Is the cost or risk fictionally understandable?
Could this choice affect how an NPC remembers the player?
Could this choice alter a later scene?
Am I hiding the mechanics behind fiction, or hiding the fiction behind mechanics?
```

For each scene, ask:

```text
What is the core dramatic question?
What is the obvious optimisation choice?
How can the scene complicate that choice?
Where does the player express interpretation?
Where does the player commit?
How does the world prove it noticed?
```

---

## Pattern: Interpretation Before Commitment

A strong scene often lets the player interpret before forcing the main decision.

Example structure:

```text
Beat 1: Situation appears.
Beat 2: Player chooses posture or interpretation.
Beat 3: Scene reveals complication based on that posture.
Beat 4: Player commits to action.
Beat 5: Consequence lands.
```

This helps avoid instant optimisation because the player does not yet fully know what kind of scene they are in.

Example:

```text
Beat 1:
A stablehand asks for fever draught.

Beat 2:
Do you lead with concern, payment, suspicion, or urgency?

Beat 3:
His response reveals different information.

Beat 4:
Now decide what help, boundary, refusal, or bargain you offer.

Beat 5:
The shop, apprentice, and town remember the choice.
```
