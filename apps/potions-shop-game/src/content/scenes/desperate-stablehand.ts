import type { Scene } from "@aphebis/core";
import { flags, log, player, relation, shop } from "@aphebis/system-cosy-shop";

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
  choices: [
    {
      id: "free-draught",
      label: "Give him the draught for free",
      description: "Let need matter more than the till.",
      effects: [
        shop.spendStock(1),
        player.gainCompassion("moderately"),
        relation("town", "shop").gainTrust("slightly"),
        relation("town", "shop").addToken({
          id: "stablehand-helped",
          kind: "favour",
          label: "Helped the stablehand's sister",
          description: "Word may spread that the shop helps desperate families.",
          sourceSceneId: "desperate-stablehand"
        }),
        flags.set("stablehand_grateful", true),
        log("The stablehand leaves clutching the draught like a candle in the rain.")
      ]
    },
    {
      id: "sell-for-three",
      label: "Take his three coins",
      description: "Help him, but keep the sale recorded.",
      effects: [
        shop.spendStock(1),
        shop.gainCoins(3),
        player.gainPrudence("slightly"),
        player.gainCompassion("slightly"),
        relation("town", "shop").gainTrust("slightly"),
        log("Three wet coins land in the drawer, lighter than they should feel.")
      ]
    },
    {
      id: "refuse",
      label: "Refuse the sale",
      description: "You cannot keep the doors open by giving away what you need.",
      effects: [
        player.gainPrudence("moderately"),
        relation("town", "shop").loseTrust("slightly"),
        flags.set("stablehand_refused", true),
        log("He nods once, too politely, and the bell over the door sounds colder.")
      ]
    }
  ]
};

export default scene;
