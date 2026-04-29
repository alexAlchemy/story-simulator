import Alpine from "alpinejs";
import "../ui/styles.css";
import { content } from "../content/scenes";
import { createInitialState } from "../domain/initialState";
import type { EndingSummary, GameState, SceneCard } from "../domain/types";
import { advanceDay } from "../engine/advanceDay";
import { buildEnding } from "../engine/buildEnding";
import { resolveChoice } from "../engine/resolveChoice";
import { getVisibleScenes } from "../engine/sceneTableau";
import {
  getRelationshipRows,
  getResourceRows,
  getValueRows,
  type DashboardRow
} from "../engine/selectors";

type AppModel = {
  state: GameState;
  selectedSceneId: string | null;
  ending: EndingSummary | null;
  init: () => void;
  restart: () => void;
  selectScene: (sceneId: string) => void;
  choose: (choiceId: string) => void;
  advance: () => void;
  visibleScenes: SceneCard[];
  selectedScene: SceneCard | null;
  visibleBanes: NonNullable<SceneCard["banes"]>;
  resourceRows: DashboardRow[];
  valueRows: DashboardRow[];
  relationshipRows: DashboardRow[];
  recentLog: GameState["log"];
  showEmptyTableau: boolean;
  rentText: string;
  tableauStatus: string;
  debugState: string;
};

function createAppModel(): AppModel {
  return {
    state: createInitialState(),
    selectedSceneId: null,
    ending: null,
    init() {
      this.selectedSceneId = this.visibleScenes[0]?.id ?? null;
    },
    restart() {
      this.state = createInitialState();
      this.ending = null;
      this.selectedSceneId = this.visibleScenes[0]?.id ?? null;
    },
    selectScene(sceneId: string) {
      this.selectedSceneId = sceneId;
    },
    choose(choiceId: string) {
      if (!this.selectedSceneId) {
        return;
      }

      this.state = resolveChoice(this.state, this.selectedSceneId, choiceId, content);
      this.selectedSceneId = this.visibleScenes[0]?.id ?? null;

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
        return;
      }
      this.selectedSceneId = this.visibleScenes[0]?.id ?? null;
    },
    get visibleScenes() {
      return getVisibleScenes(this.state, content);
    },
    get selectedScene() {
      if (!this.selectedSceneId) {
        return null;
      }
      return content.scenes[this.selectedSceneId] ?? null;
    },
    get visibleBanes() {
      return this.selectedScene?.banes?.filter((bane) => !bane.hidden) ?? [];
    },
    get resourceRows() {
      return getResourceRows(this.state);
    },
    get valueRows() {
      return getValueRows(this.state);
    },
    get relationshipRows() {
      return getRelationshipRows(this.state);
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
      if (daysLeft === 0) {
        return `${content.rentAmount} coins due today`;
      }
      return `${content.rentAmount} coins due in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`;
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

declare global {
  interface Window {
    Alpine: typeof Alpine;
    potionsShop: () => AppModel;
  }
}

window.Alpine = Alpine;
window.potionsShop = createAppModel;
Alpine.start();
