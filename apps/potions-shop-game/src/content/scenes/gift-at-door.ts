import type { Scene } from "@aphebis/core";
import { story, log, player, scenes, shop } from "@aphebis/system-cosy-shop";

/**
 * PREMISE: Rare moonleaf appears at your door, tied with blue thread, no note, no explanation.
 * An invitation into mystery: what kindness asks for nothing, and what does silence really mean?
 */
const scene: Scene = {
  id: "gift-at-door",
  title: "A Gift Left at the Door",
  type: "town",
  description:
    "Before opening, you find rare moonleaf tied with blue thread. No note, no footprints, no explanation.",
  startBeatId: "moonleaf",
  beats: {
    moonleaf: {
      id: "moonleaf",
      title: "Blue Thread",
      text:
        "The moonleaf is fresh, rare, and tied with blue thread. Whoever left it knew exactly when the shop door would open.",
      choices: [
        {
          id: "inspect-thread",
          label: "Inspect the knot and thread",
          description:
            "Look for intent before deciding whether the gift is generosity, bait, or a request made without words.",
          nextBeatId: "unpriced-kindness"
        },
        {
          id: "check-threshold",
          label: "Check the threshold for signs",
          description:
            "Treat the doorway as evidence and decide how much mystery the shop can afford before opening.",
          nextBeatId: "unpriced-kindness"
        },
        {
          id: "wake-shop",
          label: "Bring it inside before customers arrive",
          description:
            "Protect the rare herb first, then decide what accepting it might mean once the bell is awake.",
          nextBeatId: "unpriced-kindness"
        }
      ]
    },
    "unpriced-kindness": {
      id: "unpriced-kindness",
      title: "Unpriced Kindness",
      text:
        "There is no curse-salt on the step, no threatening sigil, no dropped purse to prove an ordinary errand. Only the blue thread, a clean cut on each stem, and moonleaf your shop could use before noon.",
      choices: [
        {
          id: "accept-use",
          label: "Accept and use it",
          description:
            "Let the shop benefit from the gift now, even if the giver later expects your answer.",
          endsScene: true,
          effects: [
            shop.gainStock(2),
            player.gainAmbition("slightly"),
            story.setFact("mysterious_gift_accepted", true),
            scenes.add("gift-giver-revealed"),
            log("The moonleaf smells of rain, silver, and someone else's expectation.")
          ],
          aftermath: {
            narration:
              "You brought the moonleaf inside and set it among your working stock. By midday its scent had threaded through the shop, useful and unsettling at once.",
            spotlightProperties: [
              { entityId: "shop", property: "stock" },
              { entityId: "player", property: "ambition" },
              { entityId: "story", property: "mysterious_gift_accepted" }
            ],
            futureEchoText: ["Someone may come to see what you did with an unpriced gift."]
          }
        },
        {
          id: "ask-around",
          label: "Ask around town",
          description:
            "Spend reputation and daylight on caution before letting the moonleaf become ordinary stock.",
          endsScene: true,
          effects: [
            shop.gainStanding("slightly"),
            player.gainPrudence("slightly"),
            scenes.add("gift-giver-revealed"),
            log("By noon, three people have theories and nobody has an answer.")
          ],
          aftermath: {
            narration:
              "You carried the question into town instead of carrying the moonleaf straight to the shelf. By noon, three people had theories and none of them had proof.",
            spotlightProperties: [
              { entityId: "shop", property: "shopStanding" },
              { entityId: "player", property: "prudence" }
            ],
            futureEchoText: ["The giver may hear that you looked for the hand behind the kindness."]
          }
        },
        {
          id: "leave-thanks",
          label: "Leave a thank-you charm by the door",
          description:
            "Accept less of the bounty and answer silence with courtesy instead of investigation.",
          endsScene: true,
          effects: [
            shop.gainStock(1),
            player.gainCompassion("slightly"),
            shop.gainStanding("slightly"),
            story.setFact("left_thanks_for_gift", true),
            log("The charm warms once at dusk, as if someone passed close enough to notice.")
          ],
          aftermath: {
            narration:
              "You used what the shop needed and left thanks where silence had been. At dusk, the charm warmed once, briefly, as if someone had passed close enough to notice.",
            spotlightProperties: [
              { entityId: "shop", property: "stock" },
              { entityId: "player", property: "compassion" },
              { entityId: "shop", property: "shopStanding" },
              { entityId: "story", property: "left_thanks_for_gift" }
            ],
            futureEchoText: ["A quiet courtesy now waits by the threshold."]
          }
        }
      ]
    }
  }
};

export default scene;
