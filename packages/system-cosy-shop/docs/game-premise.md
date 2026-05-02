# Cosy Shop System Vision

`@aphebis/system-cosy-shop` is the reusable grammar for cosy shopkeeping dramas in
Aphebis: stories about care, livelihood, reputation, fatigue, obligation, and the
small choices that reveal what kind of person a shopkeeper becomes.

It does not need to reinvent the potion-shop genre. The familiar pleasures are
already strong: opening the shop, managing stock, earning coins, serving unusual
customers, tending relationships, surviving rent, and watching a small business
become part of a town's emotional life. The system's job is to make those
pleasures narratively charged. Every sale, favour, refusal, shortcut, apology, and
act of generosity should be able to leave a mark.

## The Promise

A cosy shop game built on this system should feel like this:

> You run a small magical shop in a community that notices what you do. Customers
> arrive with needs, secrets, grievances, and hopes. Your resources are limited,
> your energy is finite, and your choices shape the shop, your reputation, your
> relationships, and your own sense of self.

The fantasy is not only "I brewed the right potion." It is also:

- "I helped someone when it cost me something."
- "I kept the shop alive, but I became harder to do it."
- "The town trusts me now, and that trust brings new burdens."
- "My apprentice is becoming braver because of how I treated them."
- "I can afford rent, but I know exactly who paid the hidden price."

Cosiness here is not the absence of trouble. It is trouble held at human scale:
warm lamps, scarce stock, neighbourly gossip, tired hands, moral knots, and the
quiet satisfaction of seeing yesterday's choice return as today's story.

## What This System Contributes

The system layer provides reusable shop-drama concepts that many concrete games
can build from:

- **Material pressure:** coins, stock, rent-readiness, scarcity, and the tradeoffs
  between generosity and survival.
- **Personal pressure:** fatigue, compassion, prudence, ambition, and the way a
  player-character is changed by repeated choices.
- **Relationship pressure:** trust, affection, confidence, fear, obligation,
  resentment, and other qualities that let recurring characters remember how they
  have been treated.
- **Community pressure:** shop standing, goodwill, gossip heat, and the sense that
  a town is not a backdrop but an audience, support network, and source of risk.
- **Story continuity:** facts and flags that let authored scenes return to
  earlier events without hard-coding one linear route.

These are not meant to be exhaustive simulation variables. They are dramatic
handles: stateful ways for content to create pressure, reveal consequence, and
make later scenes feel earned.

## The Play Loop

A cosy shop game using this system will usually orbit a daily rhythm:

1. The shop opens under visible pressures: money, stock, fatigue, promises,
   rumours, unresolved relationships, or approaching obligations.
2. The player chooses which scenes to enter: customers, errands, shop events,
   apprentice moments, town encounters, quiet recovery, or risky opportunities.
3. Scenes ask for a stance, not just an optimisation answer. Do you give freely,
   bargain hard, protect your apprentice, hide a mistake, chase profit, preserve
   reputation, or spend your last reserves on kindness?
4. Choices apply Aphebis effects: resources shift, relationships move, facts are
   recorded, future scenes appear or disappear, and semantic labels explain the
   new state in human terms.
5. The day closes with the shop changed a little, the town changed a little, and
   the player carrying the emotional residue of what they chose.

This gives the genre's familiar management loop a dramatic spine. Coins and stock
matter because they decide what kind of choices are painful. Relationships matter
because they make efficiency emotionally incomplete. Reputation matters because
the shop is embedded in a community.

## Why Aphebis

Aphebis is a strong fit because this kind of game wants authored structure without
static branching.

Traditional branching can make consequences legible, but it often becomes brittle:
one path, one outcome, one forgotten choice. Pure simulation can create surprise,
but it may struggle to produce scenes with emotional shape. The Aphebis approach
sits between them: authored scenes with stateful availability, reusable effects,
semantic interpretation, and consequences that accumulate across play.

That means a cosy shop game can be built from scenes that know what they are
dramatically about:

- a desperate customer tests compassion against scarcity
- a debt collector turns coins into dread
- an apprentice's mistake tests patience, trust, and authority
- a rumour makes reputation feel socially alive
- a quiet cup of tea lets recovery become a meaningful choice

The system does not ask every moment to be mechanically huge. It asks every
meaningful moment to be stateful. A small kindness can become goodwill. A sharp
rebuke can become fear. A profitable compromise can become gossip. A day of
overwork can make tomorrow's generosity harder.

## Mechanical Tone

The system should support shop-game mechanics with a light but consequential hand.

Good mechanics for this system are:

- **Readable:** the player understands the kind of pressure they are under, even
  when exact outcomes are not fully exposed.
- **Dramatic:** a number changing should imply a future scene, altered
  relationship, changed self-image, or harder tradeoff.
- **Forgiving but memorable:** the game should rarely collapse from one mistake,
  but it should remember patterns of behaviour.
- **Composable:** app content should be able to combine material, personal,
  relational, and community effects without inventing new machinery each time.
- **Cosy with teeth:** consequences should sting, soften, complicate, or mature
  the story rather than merely punish the player.

The best use of mechanics is to make the player pause for reasons that feel
fictional: "Can I afford this?" "Will they forgive me?" "What will the town think?"
"Am I too tired to be kind?" "What am I teaching my apprentice by doing this?"

## System Boundaries

`system-cosy-shop` should stay reusable. It owns the grammar of cosy shop drama,
not one particular campaign.

It may define shared properties, semantic thresholds, archetypal entities, helper
effects, and reusable interpretations of shop state. It should not own a specific
app's scene list, endings, UI flow, town canon, named customers, or final authored
plot.

The system should make it easy for apps to say:

- this choice spends stock and earns goodwill
- this scene is about fatigue and patience
- this relationship has moved from wary to trusting
- the shop is rent-ready but socially fragile
- the town is quiet, murmuring, buzzing, or scandalous

Apps then decide who knocked on the door, what they wanted, what the prose sounds
like, and how the story concludes.

## North Star

The north star for the cosy shop system is:

> A reusable Aphebis system for warm, stateful shopkeeping dramas where business
> mechanics create pressure, authored scenes create meaning, and accumulated
> consequences reveal who the shopkeeper becomes.

When the system is working, a player should want to play one more day not only to
earn more coins or unlock more recipes, but because the bell over the door might
ring, and they will care who comes in.
