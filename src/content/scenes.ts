import type { GameContent, SceneCard } from "../domain/types";
import { dayPlan } from "./dayPlan";

export const scenes: Record<string, SceneCard> = {
  "desperate-stablehand": {
    id: "desperate-stablehand",
    title: "The Desperate Stablehand",
    type: "customer",
    description:
      "A soaked stablehand arrives near closing. His little sister has a fever, and he has only three copper coins.",
    coreQuestion: "Is your shop a business, a refuge, or something in between?",
    boons: [{ label: "You have one fever draught already brewed." }],
    banes: [
      { label: "Stock is low." },
      { label: "Rent is due soon." }
    ],
    choices: [
      {
        id: "free-draught",
        label: "Give him the draught for free",
        description: "Let need matter more than the till.",
        effects: [
          { kind: "resource", key: "stock", delta: -1 },
          { kind: "value", key: "compassion", delta: 2 },
          { kind: "relationship", key: "townTrust", delta: 1 },
          { kind: "setFlag", key: "stablehand_grateful", value: true },
          { kind: "addScene", sceneId: "temple-healer-visits" },
          { kind: "log", text: "The stablehand leaves clutching the draught like a candle in the rain." }
        ]
      },
      {
        id: "sell-for-three",
        label: "Take his three coins",
        description: "Help him, but keep the sale recorded.",
        effects: [
          { kind: "resource", key: "stock", delta: -1 },
          { kind: "resource", key: "coins", delta: 3 },
          { kind: "value", key: "prudence", delta: 1 },
          { kind: "value", key: "compassion", delta: 1 },
          { kind: "relationship", key: "townTrust", delta: 1 },
          { kind: "log", text: "Three wet coins land in the drawer, lighter than they should feel." }
        ]
      },
      {
        id: "refuse",
        label: "Refuse the sale",
        description: "You cannot keep the doors open by giving away what you need.",
        effects: [
          { kind: "value", key: "prudence", delta: 2 },
          { kind: "relationship", key: "townTrust", delta: -1 },
          { kind: "setFlag", key: "stablehand_refused", value: true },
          { kind: "addScene", sceneId: "rumour-at-market" },
          { kind: "log", text: "He nods once, too politely, and the bell over the door sounds colder." }
        ]
      }
    ]
  },
  "moon-tonic-order": {
    id: "moon-tonic-order",
    title: "Brew Under Pressure: Moon-Tonic Order",
    type: "brew",
    description:
      "An observatory courier needs a Moon-Tonic before nightfall. The pay is excellent, but the brew will consume useful stock.",
    coreQuestion: "Do you chase a profitable order when the town may need those ingredients later?",
    boons: [{ label: "The recipe is familiar." }, { label: "The courier can pay well." }],
    banes: [{ label: "Fatigue is rising." }, { label: "Ordinary customers may need those ingredients." }],
    choices: [
      {
        id: "careful-full-price",
        label: "Brew carefully and charge full price",
        effects: [
          { kind: "resource", key: "stock", delta: -1 },
          { kind: "resource", key: "coins", delta: 12 },
          { kind: "resource", key: "fatigue", delta: 1 },
          { kind: "value", key: "ambition", delta: 1 },
          { kind: "log", text: "The Moon-Tonic clears silver in the vial, and the courier pays without haggling." }
        ]
      },
      {
        id: "ask-apprentice",
        label: "Ask the apprentice to help",
        description: "Share the work and the risk.",
        effects: [
          { kind: "resource", key: "stock", delta: -1 },
          { kind: "resource", key: "coins", delta: 10 },
          { kind: "relationship", key: "apprenticeTrust", delta: 1 },
          { kind: "value", key: "compassion", delta: 1 },
          { kind: "addScene", sceneId: "apprentice-asks-trust" },
          { kind: "log", text: "Your apprentice steadies the flame, glowing with the terror of being useful." }
        ]
      },
      {
        id: "decline",
        label: "Decline and preserve stock",
        effects: [
          { kind: "value", key: "prudence", delta: 2 },
          { kind: "relationship", key: "townTrust", delta: -1 },
          { kind: "log", text: "The courier leaves for a rival shop, but your shelves remain less bare." }
        ]
      }
    ]
  },
  "apprentice-hiding-mistake": {
    id: "apprentice-hiding-mistake",
    title: "Apprentice Hiding a Mistake",
    type: "staff",
    description:
      "You find a cracked vial tucked behind the lower shelf. The label is in your apprentice's handwriting.",
    coreQuestion: "Are you a mentor, a manager, or someone too exhausted to be either?",
    boons: [{ label: "You noticed before anyone was hurt." }],
    banes: [{ label: "The apprentice has been quiet all morning." }],
    choices: [
      {
        id: "ask-gently",
        label: "Ask gently what happened",
        effects: [
          { kind: "relationship", key: "apprenticeTrust", delta: 2 },
          { kind: "value", key: "compassion", delta: 1 },
          { kind: "resource", key: "fatigue", delta: 1 },
          { kind: "log", text: "The story comes out slowly: fear first, then the mistake itself." }
        ]
      },
      {
        id: "lesson",
        label: "Turn it into a lesson",
        effects: [
          { kind: "relationship", key: "apprenticeTrust", delta: 1 },
          { kind: "value", key: "prudence", delta: 1 },
          { kind: "log", text: "You clean the glass together and write a safer shelf rule in chalk." }
        ]
      },
      {
        id: "sharp-confrontation",
        label: "Confront them sharply",
        effects: [
          { kind: "relationship", key: "apprenticeTrust", delta: -2 },
          { kind: "value", key: "ambition", delta: 1 },
          { kind: "resource", key: "fatigue", delta: -1 },
          { kind: "log", text: "The shop is efficient for the next hour, and painfully quiet." }
        ]
      }
    ]
  },
  "gift-at-door": {
    id: "gift-at-door",
    title: "A Gift Left at the Door",
    type: "town",
    description:
      "Before opening, you find rare moonleaf tied with blue thread. No note, no footprints, no explanation.",
    coreQuestion: "Can you accept kindness without knowing what it will cost?",
    boons: [{ label: "Rare moonleaf can stretch your stock." }],
    banes: [{ label: "Gifts often mean obligations." }, { label: "The source is unknown.", hidden: true }],
    choices: [
      {
        id: "accept-use",
        label: "Accept and use it",
        effects: [
          { kind: "resource", key: "stock", delta: 2 },
          { kind: "value", key: "ambition", delta: 1 },
          { kind: "setFlag", key: "mysterious_gift_accepted", value: true },
          { kind: "addScene", sceneId: "gift-giver-revealed" },
          { kind: "log", text: "The moonleaf smells of rain, silver, and someone else's expectation." }
        ]
      },
      {
        id: "ask-around",
        label: "Ask around town",
        effects: [
          { kind: "relationship", key: "townTrust", delta: 1 },
          { kind: "value", key: "prudence", delta: 1 },
          { kind: "addScene", sceneId: "gift-giver-revealed" },
          { kind: "log", text: "By noon, three people have theories and nobody has an answer." }
        ]
      },
      {
        id: "leave-thanks",
        label: "Leave a thank-you charm by the door",
        effects: [
          { kind: "resource", key: "stock", delta: 1 },
          { kind: "value", key: "compassion", delta: 1 },
          { kind: "relationship", key: "townTrust", delta: 1 },
          { kind: "setFlag", key: "left_thanks_for_gift", value: true },
          { kind: "log", text: "The charm warms once at dusk, as if someone passed close enough to notice." }
        ]
      }
    ],
    clock: { transformsOnDay: 4, transformsInto: "gift-giver-revealed" }
  },
  "counting-coins": {
    id: "counting-coins",
    title: "Counting Coins at Midnight",
    type: "reflection",
    description:
      "The shop is quiet. Rain taps the window. You count the coins twice and still imagine the rent bell.",
    coreQuestion: "What does security cost you?",
    boons: [{ label: "A clear ledger can calm the heart." }],
    banes: [{ label: "Every plan costs either time, pride, or sleep." }],
    choices: [
      {
        id: "raise-prices-tomorrow",
        label: "Plan to raise prices tomorrow",
        effects: [
          { kind: "value", key: "prudence", delta: 1 },
          { kind: "addScene", sceneId: "raise-prices" },
          { kind: "log", text: "You mark three prices in darker ink and do not sleep immediately after." }
        ]
      },
      {
        id: "work-late",
        label: "Work late bottling simple remedies",
        effects: [
          { kind: "resource", key: "stock", delta: 1 },
          { kind: "resource", key: "fatigue", delta: 2 },
          { kind: "value", key: "ambition", delta: 1 },
          { kind: "log", text: "By candle-end, six labels are straight and your hands ache." }
        ]
      },
      {
        id: "rest",
        label: "Close your eyes and rest",
        effects: [
          { kind: "resource", key: "fatigue", delta: -2 },
          { kind: "value", key: "compassion", delta: 1 },
          { kind: "log", text: "For one night, you treat yourself like someone worth preserving." }
        ]
      }
    ]
  },
  "temple-healer-visits": {
    id: "temple-healer-visits",
    title: "Temple Healer Visits",
    type: "town",
    description:
      "The temple healer arrives with gratitude, concern, and a question about how often you treat people for free.",
    coreQuestion: "Can generosity become a partnership instead of a leak in the ledger?",
    boons: [{ label: "Your mercy reached the temple before you did." }],
    banes: [{ label: "The temple cannot pay full market rates either." }],
    choices: [
      {
        id: "share-referrals",
        label: "Create a referral arrangement",
        effects: [
          { kind: "relationship", key: "townTrust", delta: 2 },
          { kind: "resource", key: "coins", delta: 4 },
          { kind: "value", key: "compassion", delta: 1 },
          { kind: "log", text: "The healer promises small payments, honest referrals, and fewer desperate surprises." }
        ]
      },
      {
        id: "keep-boundary",
        label: "Set a firm charity boundary",
        effects: [
          { kind: "value", key: "prudence", delta: 2 },
          { kind: "relationship", key: "townTrust", delta: 0 },
          { kind: "log", text: "The healer respects the answer, though neither of you enjoys it." }
        ]
      }
    ]
  },
  "rumour-at-market": {
    id: "rumour-at-market",
    title: "Rumour at Market",
    type: "town",
    description:
      "A fruit seller stops talking when you approach. Your refusal has travelled faster than the rainwater.",
    coreQuestion: "Do you defend yourself, repair harm, or let the market talk?",
    boons: [{ label: "A clear explanation might steady your reputation." }],
    banes: [{ label: "People prefer simple stories." }],
    choices: [
      {
        id: "explain-rent",
        label: "Explain the rent pressure plainly",
        effects: [
          { kind: "relationship", key: "townTrust", delta: 1 },
          { kind: "value", key: "prudence", delta: 1 },
          { kind: "log", text: "Some faces soften. Others simply file the explanation away." }
        ]
      },
      {
        id: "offer-small-remedy",
        label: "Offer small remedies at cost",
        effects: [
          { kind: "resource", key: "stock", delta: -1 },
          { kind: "relationship", key: "townTrust", delta: 2 },
          { kind: "value", key: "compassion", delta: 1 },
          { kind: "log", text: "You cannot fix one closed door, but you open a smaller one." }
        ]
      }
    ]
  },
  "forage-bad-weather": {
    id: "forage-bad-weather",
    title: "Forage in Bad Weather",
    type: "shop",
    description:
      "The marsh path is slick, but the shelves look thin enough to make the walk tempting.",
    coreQuestion: "How much of tomorrow's strength do you spend on today's shortage?",
    boons: [{ label: "Mooncap mushrooms bloom after rain." }],
    banes: [{ label: "A bad fall could ruin the day." }],
    choices: [
      {
        id: "go-yourself",
        label: "Go yourself",
        effects: [
          { kind: "resource", key: "stock", delta: 2 },
          { kind: "resource", key: "fatigue", delta: 2 },
          { kind: "value", key: "ambition", delta: 1 },
          { kind: "log", text: "You return mud-streaked, triumphant, and more tired than you admit." }
        ]
      },
      {
        id: "send-apprentice",
        label: "Send the apprentice with instructions",
        effects: [
          { kind: "resource", key: "stock", delta: 1 },
          { kind: "relationship", key: "apprenticeTrust", delta: 1 },
          { kind: "value", key: "prudence", delta: 1 },
          { kind: "log", text: "They return soaked, proud, and carrying almost the right mushrooms." }
        ]
      },
      {
        id: "stay-in",
        label: "Stay in and preserve your strength",
        effects: [
          { kind: "resource", key: "fatigue", delta: -1 },
          { kind: "value", key: "prudence", delta: 1 },
          { kind: "log", text: "The shelves stay thin, but your hands stop shaking." }
        ]
      }
    ]
  },
  "apprentice-asks-trust": {
    id: "apprentice-asks-trust",
    title: "Apprentice Asks for Trust",
    type: "staff",
    description:
      "Your apprentice asks to handle the front counter alone for one hour while you prepare the back room.",
    coreQuestion: "Do you make room for someone else to become capable?",
    boons: [{ label: "They know the regulars by name." }],
    banes: [{ label: "One bad sale could cost more than time." }],
    choices: [
      {
        id: "trust-counter",
        label: "Trust them with the counter",
        effects: [
          { kind: "resource", key: "coins", delta: 5 },
          { kind: "resource", key: "fatigue", delta: -1 },
          { kind: "relationship", key: "apprenticeTrust", delta: 2 },
          { kind: "log", text: "They mispronounce one tincture and make three honest sales anyway." }
        ]
      },
      {
        id: "supervise",
        label: "Supervise closely",
        effects: [
          { kind: "resource", key: "coins", delta: 4 },
          { kind: "relationship", key: "apprenticeTrust", delta: -1 },
          { kind: "value", key: "prudence", delta: 1 },
          { kind: "log", text: "Nothing goes wrong, which somehow proves less than either of you hoped." }
        ]
      }
    ]
  },
  "noble-rush-order": {
    id: "noble-rush-order",
    title: "Noble Rush Order",
    type: "customer",
    description:
      "A noble's steward wants a vanity elixir by dusk and offers enough coin to make rent feel possible.",
    coreQuestion: "Do you serve vanity when survival is on the counter?",
    boons: [{ label: "The payment is immediate." }],
    banes: [{ label: "The order consumes medicine-grade stock." }],
    choices: [
      {
        id: "take-order",
        label: "Take the order",
        effects: [
          { kind: "resource", key: "stock", delta: -2 },
          { kind: "resource", key: "coins", delta: 18 },
          { kind: "value", key: "ambition", delta: 2 },
          { kind: "relationship", key: "townTrust", delta: -1 },
          { kind: "log", text: "The steward pays in silver. The shelf behind you looks suddenly vulnerable." }
        ]
      },
      {
        id: "redirect",
        label: "Offer a cheaper harmless tonic",
        effects: [
          { kind: "resource", key: "stock", delta: -1 },
          { kind: "resource", key: "coins", delta: 8 },
          { kind: "value", key: "prudence", delta: 1 },
          { kind: "log", text: "The steward sniffs at the bottle, then pays because it is still fashionable." }
        ]
      },
      {
        id: "refuse-vanity",
        label: "Refuse to spend medicine on vanity",
        effects: [
          { kind: "value", key: "compassion", delta: 2 },
          { kind: "relationship", key: "townTrust", delta: 1 },
          { kind: "log", text: "The steward is offended. The next fever case will not know your name, but they may live." }
        ]
      }
    ]
  },
  "supplier-cheap-stock": {
    id: "supplier-cheap-stock",
    title: "Supplier Offers Cheap Stock",
    type: "shop",
    description:
      "A travelling supplier offers discounted ingredients with labels that look almost official.",
    coreQuestion: "What kind of risk feels acceptable when scarcity is already risky?",
    boons: [{ label: "The price is very good." }],
    banes: [{ label: "Cheap stock can become expensive later." }],
    choices: [
      {
        id: "buy-cheap",
        label: "Buy the cheap stock",
        effects: [
          { kind: "resource", key: "coins", delta: -6 },
          { kind: "resource", key: "stock", delta: 3 },
          { kind: "value", key: "ambition", delta: 1 },
          { kind: "setFlag", key: "cheap_stock_bought", value: true },
          { kind: "log", text: "The bottles clink cheerfully in the crate. Too cheerfully, maybe." }
        ]
      },
      {
        id: "buy-little",
        label: "Buy only what you can inspect",
        effects: [
          { kind: "resource", key: "coins", delta: -3 },
          { kind: "resource", key: "stock", delta: 1 },
          { kind: "value", key: "prudence", delta: 1 },
          { kind: "log", text: "You reject half the crate and sleep better for it." }
        ]
      }
    ]
  },
  "quiet-repair-sign": {
    id: "quiet-repair-sign",
    title: "Quiet Moment: Repairing the Sign",
    type: "reflection",
    description:
      "The shop sign hangs crooked. Fixing it will not pay rent, but neglect has its own language.",
    coreQuestion: "What does care look like when nobody is asking for it?",
    boons: [{ label: "A better sign may draw kinder attention." }],
    banes: [{ label: "Time spent here is time not brewing." }],
    choices: [
      {
        id: "repair-carefully",
        label: "Repair it carefully",
        effects: [
          { kind: "relationship", key: "townTrust", delta: 1 },
          { kind: "value", key: "compassion", delta: 1 },
          { kind: "resource", key: "fatigue", delta: 1 },
          { kind: "log", text: "By dusk, the painted mortar and pestle swings straight again." }
        ]
      },
      {
        id: "paint-bold",
        label: "Paint it brighter",
        effects: [
          { kind: "resource", key: "coins", delta: 4 },
          { kind: "value", key: "ambition", delta: 1 },
          { kind: "log", text: "Two new customers find you before supper." }
        ]
      }
    ]
  },
  "regular-not-okay": {
    id: "regular-not-okay",
    title: "The Regular Who Is Not Okay",
    type: "customer",
    description:
      "A regular buys sleep drops for the fourth time this week and smiles as if that should settle the matter.",
    coreQuestion: "When does a sale become permission to ask a harder question?",
    boons: [{ label: "They trust your shop enough to return." }],
    banes: [{ label: "Pressing too hard may send them elsewhere." }],
    choices: [
      {
        id: "ask-hard",
        label: "Ask the harder question",
        effects: [
          { kind: "relationship", key: "townTrust", delta: 2 },
          { kind: "value", key: "compassion", delta: 2 },
          { kind: "resource", key: "coins", delta: 2 },
          { kind: "log", text: "They do not answer fully, but they sit down before leaving." }
        ]
      },
      {
        id: "sell-drops",
        label: "Sell the drops without prying",
        effects: [
          { kind: "resource", key: "stock", delta: -1 },
          { kind: "resource", key: "coins", delta: 6 },
          { kind: "value", key: "prudence", delta: 1 },
          { kind: "log", text: "The sale is clean. The smile is not." }
        ]
      }
    ]
  },
  "raise-prices": {
    id: "raise-prices",
    title: "Raise Prices?",
    type: "shop",
    description:
      "The rent figure glares from the ledger. A new price slate waits beside the till.",
    coreQuestion: "Can fairness survive arithmetic?",
    boons: [{ label: "Higher prices could close the rent gap." }],
    banes: [{ label: "Desperate people rely on predictable costs." }],
    choices: [
      {
        id: "raise-all",
        label: "Raise all prices",
        effects: [
          { kind: "resource", key: "coins", delta: 10 },
          { kind: "relationship", key: "townTrust", delta: -2 },
          { kind: "value", key: "prudence", delta: 2 },
          { kind: "log", text: "The new numbers look sensible until the first customer reads them." }
        ]
      },
      {
        id: "sliding-scale",
        label: "Use a quiet sliding scale",
        effects: [
          { kind: "resource", key: "coins", delta: 5 },
          { kind: "relationship", key: "townTrust", delta: 1 },
          { kind: "value", key: "compassion", delta: 1 },
          { kind: "log", text: "Nobody sees the whole system, but several people leave breathing easier." }
        ]
      }
    ]
  },
  "staff-burnout": {
    id: "staff-burnout",
    title: "Staff Burnout",
    type: "staff",
    description:
      "Your apprentice drops a tray, apologizes three times, and looks ready to disappear into the floorboards.",
    coreQuestion: "Is the shop worth saving if it teaches people to vanish inside it?",
    boons: [{ label: "You can still change the rhythm of the day." }],
    banes: [{ label: "Rent is tomorrow." }],
    choices: [
      {
        id: "close-early",
        label: "Close early and make tea",
        effects: [
          { kind: "resource", key: "fatigue", delta: -2 },
          { kind: "relationship", key: "apprenticeTrust", delta: 2 },
          { kind: "value", key: "compassion", delta: 1 },
          { kind: "log", text: "You lose an hour of trade and gain a conversation that should have happened sooner." }
        ]
      },
      {
        id: "push-through",
        label: "Push through until closing",
        effects: [
          { kind: "resource", key: "coins", delta: 6 },
          { kind: "relationship", key: "apprenticeTrust", delta: -2 },
          { kind: "value", key: "ambition", delta: 1 },
          { kind: "log", text: "The drawer is heavier. So is the silence." }
        ]
      }
    ]
  },
  "gift-giver-revealed": {
    id: "gift-giver-revealed",
    title: "The Gift Giver Revealed",
    type: "town",
    description:
      "An old hedge-witch admits the moonleaf was hers. She wanted to know what you do with unpriced kindness.",
    coreQuestion: "Do you accept a relationship that begins as a test?",
    boons: [{ label: "She knows suppliers nobody else trusts." }],
    banes: [{ label: "She has already judged you once." }],
    choices: [
      {
        id: "accept-mentor",
        label: "Accept her strange mentorship",
        effects: [
          { kind: "resource", key: "stock", delta: 2 },
          { kind: "relationship", key: "townTrust", delta: 1 },
          { kind: "value", key: "prudence", delta: 1 },
          { kind: "log", text: "She laughs when you ask for clearer terms, which is almost an answer." }
        ]
      },
      {
        id: "decline-test",
        label: "Decline the relationship",
        effects: [
          { kind: "value", key: "ambition", delta: 1 },
          { kind: "relationship", key: "townTrust", delta: -1 },
          { kind: "log", text: "She respects the refusal, perhaps more than she would have respected obedience." }
        ]
      }
    ]
  },
  "rent-comes-due": {
    id: "rent-comes-due",
    title: "Rent Comes Due",
    type: "shop",
    description:
      "The landlord's bell sounds at noon. The week has become a number, but not only a number.",
    coreQuestion: "What did the shop survive as?",
    boons: [{ label: "Every prior choice is already in the room." }],
    banes: [{ label: "Thirty coins are due today." }],
    choices: [
      {
        id: "pay-or-negotiate",
        label: "Open the ledger",
        description: "Face the final accounting.",
        effects: [
          { kind: "log", text: "You turn the ledger around and see the week written in coin, trust, and tired ink." }
        ]
      },
      {
        id: "look-around",
        label: "Look around the shop first",
        description: "Notice who you became before the bell finishes ringing.",
        effects: [
          { kind: "value", key: "compassion", delta: 0 },
          { kind: "log", text: "The bottles, broom, counter, and apprentice all seem to be waiting with you." }
        ]
      }
    ]
  }
};

export const content: GameContent = {
  scenes,
  dayPlan,
  rentDueDay: 5,
  rentAmount: 30
};
