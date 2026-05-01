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
  choices: [
    {
      id: "accept-use",
      label: "Accept and use it",
      effects: [
        shop.gainStock(2),
        player.gainAmbition("slightly"),
        story.setFact("mysterious_gift_accepted", true),
        scenes.add("gift-giver-revealed"),
        log("The moonleaf smells of rain, silver, and someone else's expectation.")
      ]
    },
    {
      id: "ask-around",
      label: "Ask around town",
      effects: [
        shop.gainStanding("slightly"),
        player.gainPrudence("slightly"),
        scenes.add("gift-giver-revealed"),
        log("By noon, three people have theories and nobody has an answer.")
      ]
    },
    {
      id: "leave-thanks",
      label: "Leave a thank-you charm by the door",
      effects: [
        shop.gainStock(1),
        player.gainCompassion("slightly"),
        shop.gainStanding("slightly"),
        story.setFact("left_thanks_for_gift", true),
        log("The charm warms once at dusk, as if someone passed close enough to notice.")
      ]
    }
  ]
};

export default scene;
