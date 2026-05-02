import type { Scene } from "@aphebis/core";
import { apprentice, story, log, player, shop } from "@aphebis/system-cosy-shop";

/**
 * PREMISE: A soaked stranger arrives at closing with three copper coins and a dying sister.
 * The shop's first test: does a potion shop serve the desperate, or just those who can pay?
 */
const scene: Scene = {
  id: "desperate-stablehand",
  title: "The Desperate Stablehand",
  type: "customer",
  description:
    "A soaked stablehand arrives near closing. His little sister has a fever, and he has only three copper coins.",
  localProperties: {
    trust: { initial: 0, min: 0, max: 3 },
    suspicion: { initial: 0, min: 0, max: 3 },
    pressure: { initial: 0, min: 0, max: 3 },
    posture: { initial: "undecided" },
    apprenticeConsulted: { initial: false }
  },
  startBeatId: "arrival",
  beats: {
    arrival: {
      id: "arrival",
      title: "Arrival",
      text:
        "A stablehand waits by the counter, soaked through. He asks for fever draught, but his eyes keep flicking toward the temple road.",
      choices: [
        {
          id: "ask-what-happened",
          label: "Ask what happened before discussing payment",
          description: "Treat the story as part of the need.",
          localEffects: [
            { kind: "changeLocal", key: "trust", delta: 1 },
            { kind: "setLocal", key: "posture", value: "gentle" }
          ],
          nextBeatId: "story-shifts"
        },
        {
          id: "ask-payment",
          label: "Ask whether he can pay",
          description: "Start with the shop's limits.",
          localEffects: [
            { kind: "changeLocal", key: "pressure", delta: 1 },
            { kind: "setLocal", key: "posture", value: "transactional" }
          ],
          nextBeatId: "story-shifts"
        },
        {
          id: "notice-temple-road",
          label: "Ask why he keeps looking toward the temple",
          description: "Name the thing he is trying not to show.",
          localEffects: [
            { kind: "changeLocal", key: "suspicion", delta: 1 },
            { kind: "changeLocal", key: "pressure", delta: 1 },
            { kind: "setLocal", key: "posture", value: "probing" }
          ],
          nextBeatId: "story-shifts"
        },
        {
          id: "call-apprentice",
          label: "Call your apprentice to check the fever stock",
          description: "Let the room hear what the choice may cost.",
          localEffects: [
            { kind: "setLocal", key: "apprenticeConsulted", value: true },
            { kind: "changeLocal", key: "pressure", delta: 1 }
          ],
          nextBeatId: "story-shifts"
        }
      ]
    },
    "story-shifts": {
      id: "story-shifts",
      title: "The Story Shifts",
      text:
        "He admits he has only three coppers. The temple turned him away, he says, but the wax on his sleeve is temple-green and too fresh for a closed door.",
      choices: [
        {
          id: "press-story",
          label: "Press him on what he is not saying",
          description: "The fever may be real, but the story has a hidden hinge.",
          localEffects: [
            { kind: "changeLocal", key: "suspicion", delta: 1 },
            { kind: "changeLocal", key: "pressure", delta: 1 }
          ],
          nextBeatId: "last-draught"
        },
        {
          id: "need-only-fact",
          label: "Treat the fever as the only fact that matters",
          description: "Refuse to make help depend on a perfect confession.",
          localEffects: [{ kind: "changeLocal", key: "trust", delta: 1 }],
          nextBeatId: "last-draught"
        },
        {
          id: "ask-apprentice-stock",
          label: "Ask your apprentice what stock you can spare",
          description: "Move the question from pity to capacity.",
          localEffects: [
            { kind: "setLocal", key: "apprenticeConsulted", value: true },
            { kind: "changeLocal", key: "pressure", delta: 1 }
          ],
          nextBeatId: "last-draught"
        },
        {
          id: "offer-credit",
          label: "Offer credit, but make the debt explicit",
          description: "Help him without pretending the shop is untouched.",
          localEffects: [
            { kind: "changeLocal", key: "trust", delta: 1 },
            { kind: "changeLocal", key: "pressure", delta: 1 }
          ],
          nextBeatId: "last-draught"
        }
      ]
    },
    "last-draught": {
      id: "last-draught",
      title: "The Last Draught",
      text:
        "Your apprentice quietly sets one blue bottle on the counter. It is the last brewed fever draught. The next batch will take half a day, and old Mistress Vale comes every week for one.",
      choices: [
        {
          id: "free-draught",
          label: "Give him the draught anyway",
          description: "Let the need in front of you claim the bottle.",
          endsScene: true,
          effects: [
            shop.spendStock(1),
            player.gainCompassion("moderately"),
            shop.gainGoodwill("slightly"),
            apprentice.gainTrust("slightly"),
            story.setFact("stablehand_helped", true),
            story.setFact("stablehand_grateful", true),
            log(
              "The stablehand leaves with the draught held under his coat. Your apprentice says nothing, but starts cleaning the counter more slowly than usual."
            )
          ]
        },
        {
          id: "sell-for-three",
          label: "Take his three coins and record the debt forgiven",
          description: "Let the till show both mercy and loss.",
          endsScene: true,
          effects: [
            shop.spendStock(1),
            shop.gainCoins(3),
            player.gainPrudence("slightly"),
            player.gainCompassion("slightly"),
            shop.gainStanding("slightly"),
            story.setFact("stablehand_helped", true),
            log("Three wet coins land in the drawer, lighter than they should feel.")
          ]
        },
        {
          id: "split-dose",
          label: "Split the dose and warn him it may be weaker",
          description: "Try to answer two futures with one bottle.",
          endsScene: true,
          effects: [
            shop.spendStock(1),
            player.gainPrudence("slightly"),
            player.gainCompassion("slightly"),
            apprentice.gainConfidence("slightly"),
            story.setFact("stablehand_helped", true),
            log(
              "You divide the draught into two smaller bottles. He thanks you, but the second bottle on the counter looks suddenly fragile."
            )
          ]
        },
        {
          id: "refuse",
          label: "Keep the draught and offer to brew overnight",
          description: "Protect the promised stock, but spend yourself instead.",
          endsScene: true,
          effects: [
            player.gainPrudence("moderately"),
            player.gainFatigue("slightly"),
            shop.loseStanding("slightly"),
            story.setFact("stablehand_refused", true),
            log("He nods once, too politely. You set water to boil before the bell stops moving.")
          ]
        },
        {
          id: "written-guarantee",
          label: "Send him to the temple with your written guarantee",
          description: "Risk your name instead of the last bottle.",
          endsScene: true,
          availability: { any: [{ key: "suspicion", min: 1 }, { key: "trust", min: 1 }] },
          effects: [
            player.gainPrudence("slightly"),
            shop.gainStanding("slightly"),
            story.setFact("stablehand_helped", true),
            log(
              "You seal a note in shop wax. He takes it like it might burn him, then runs for the temple road."
            )
          ]
        }
      ]
    }
  }
};

export default scene;
