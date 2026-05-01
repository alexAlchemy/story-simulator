import Alpine from "alpinejs";
import "../ui/styles.css";
import { content } from "../content/scenes";
import { createInitialState } from "../content/initialState";
import type { GameState, Scene } from "@aphebis/core";
import { advanceDay } from "@aphebis/core";
import { buildEnding, type EndingSummary } from "../engine/buildEnding";
import { resolveChoice } from "@aphebis/core";
import { getVisibleScenes } from "@aphebis/core";
import {
  getEntityCards,
  getResourceRows,
  getValueRows,
  getStandingRows,
  type DashboardRow,
  type EntityCardViewModel,
  type WorldStateSemanticContext
} from "../engine/selectors";

type AppTab = "dashboard" | "scenes" | "state" | "history";
type SceneBrowserView = "list" | "detail";
const EXPECTED_STOCK_DEMAND = 4;

type AppModel = {
  state: GameState;
  activeTab: AppTab;
  sceneBrowserView: SceneBrowserView;
  selectedSceneId: string | null;
  ending: EndingSummary | null;
  init: () => void;
  restart: () => void;
  selectTab: (tab: AppTab) => void;
  selectScene: (sceneId: string) => void;
  openScene: (sceneId: string) => void;
  backToSceneList: () => void;
  choose: (choiceId: string) => void;
  advance: () => void;
  visibleScenes: Scene[];
  selectedScene: Scene | null;
  resourceRows: DashboardRow[];
  valueRows: DashboardRow[];
  standingRows: DashboardRow[];
  entityCards: EntityCardViewModel[];
  worldStateSemanticContext: WorldStateSemanticContext;
  recentLog: GameState["log"];
  showEmptyTableau: boolean;
  rentText: string;
  tableauStatus: string;
  debugState: string;
};

function createAppModel(): AppModel {
  return {
    state: createInitialState(),
    activeTab: "dashboard",
    sceneBrowserView: "list",
    selectedSceneId: null,
    ending: null,
    init() {
      this.selectedSceneId = this.visibleScenes[0]?.id ?? null;
    },
    restart() {
      this.state = createInitialState();
      this.ending = null;
      this.activeTab = "dashboard";
      this.sceneBrowserView = "list";
      this.selectedSceneId = this.visibleScenes[0]?.id ?? null;
    },
    selectTab(tab) {
      this.activeTab = tab;
      if (tab === "scenes") {
        this.sceneBrowserView = "list";
      }
    },
    selectScene(sceneId: string) {
      this.selectedSceneId = sceneId;
    },
    openScene(sceneId: string) {
      this.selectedSceneId = sceneId;
      this.sceneBrowserView = "detail";
    },
    backToSceneList() {
      this.sceneBrowserView = "list";
    },
    choose(choiceId: string) {
      if (!this.selectedSceneId) {
        return;
      }

      this.state = resolveChoice(this.state, this.selectedSceneId, choiceId, content);
      this.selectedSceneId = this.visibleScenes[0]?.id ?? null;
      if (this.activeTab === "scenes") {
        this.sceneBrowserView = "list";
      }

      if (this.state.day >= content.rentDueDay && this.state.sceneTableau.length === 0) {
        this.state = { ...this.state, ended: true };
        this.ending = buildEnding(this.state, content);
      }
    },
    advance() {
      this.state = advanceDay(this.state, content);
      if (this.state.ended) {
        this.ending = buildEnding(this.state, content);
        this.selectedSceneId = null;
        this.sceneBrowserView = "list";
        return;
      }
      this.selectedSceneId = this.visibleScenes[0]?.id ?? null;
      this.sceneBrowserView = "list";
    },
    get visibleScenes() {
      return getVisibleScenes(this.state, content);
    },
    get selectedScene() {
      if (!this.selectedSceneId) {
        return null;
      }
      return this.visibleScenes.find((scene) => scene.id === this.selectedSceneId) ?? null;
    },
    get resourceRows() {
      return getResourceRows(this.state);
    },
    get valueRows() {
      return getValueRows(this.state);
    },
    get standingRows() {
      return getStandingRows(this.state);
    },
    get entityCards() {
      return getEntityCards(this.state, this.worldStateSemanticContext);
    },
    get worldStateSemanticContext() {
      return {
        rentAmount: content.rentAmount,
        expectedDemand: EXPECTED_STOCK_DEMAND
      };
    },
    get recentLog() {
      return this.state.log.slice(-6).reverse();
    },
    get showEmptyTableau() {
      return !this.state.ended && this.visibleScenes.length === 0;
    },
    get rentText() {
      const daysLeft = Math.max(0, content.rentDueDay - this.state.day);
      if (this.state.ended) {
        return "Run complete";
      }
      return `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`;
    },
    get tableauStatus() {
      const count = this.visibleScenes.length;
      return `${count} scene${count === 1 ? "" : "s"} available`;
    },
    get debugState() {
      return JSON.stringify(this.state, null, 2);
    }
  };
}

function createDashboardPanel() {
  return {};
}

function createWorldStatePanel() {
  return {};
}

function createEntityCard(entityId: string) {
  return {
    entityId,
    currentEntity(cards: EntityCardViewModel[]) {
      const entity = cards.find((card) => card.id === this.entityId);

      if (!entity) {
        throw new Error(`Missing entity card view model: ${this.entityId}`);
      }

      return entity;
    }
  };
}

declare global {
  interface Window {
    Alpine: typeof Alpine;
    potionsShop: () => AppModel;
  }
}

window.Alpine = Alpine;
window.potionsShop = createAppModel;
Alpine.data("dashboardPanel", createDashboardPanel);
Alpine.data("worldStatePanel", createWorldStatePanel);
Alpine.data("entityCard", createEntityCard);
Alpine.start();
