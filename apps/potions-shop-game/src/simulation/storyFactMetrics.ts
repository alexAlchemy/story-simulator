import type {
  Effect,
  GameContent,
  GameState,
  BeatChoice,
  Scene,
  SceneChoice
} from "@aphebis/core";
import { createInitialState } from "../content/initialState";
import { advanceDay } from "@aphebis/core";
import { resolveChoice } from "@aphebis/core";
import { getVisibleScenes } from "@aphebis/core";
import { getBooleanProperty } from "@aphebis/core";
import { getAllSceneChoices, getSceneChoices } from "@aphebis/core";

export type StoryFactEffectDefinition = {
  sceneId: string;
  choiceId: string;
  fact: string;
  value: boolean;
};

export type StoryFactEffectEvent = StoryFactEffectDefinition & {
  runId: string;
  day: number;
};

export type StoryFactMetric = {
  fact: string;
  setTrueCount: number;
  setFalseCount: number;
  finalTrueCount: number;
  finalFalseCount: number;
};

export type SimulatedChoice = {
  sceneId: string;
  choiceId: string;
  day: number;
};

export type SimulationRun = {
  id: string;
  finalState: GameState;
  selectedChoices: SimulatedChoice[];
  factEvents: StoryFactEffectEvent[];
};

export type StoryFactSimulationReport = {
  runs: SimulationRun[];
  factMetrics: StoryFactMetric[];
  factsDefinedInContent: string[];
  factsNeverObserved: string[];
  factChoiceEffectsNeverObserved: StoryFactEffectDefinition[];
};

type ChoiceTarget = {
  sceneId: string;
  choiceId: string;
};

const MAX_SIMULATION_STEPS = 200;

export function simulateStoryFactMetrics(
  content: GameContent,
  createState: () => GameState = createInitialState
): StoryFactSimulationReport {
  const factDefinitions = collectStoryFactEffectDefinitions(content);
  const targets = uniqueChoiceTargets(factDefinitions);
  const runs = targets.map((target, index) =>
    simulateRun(`fact-choice-${index + 1}`, content, createState(), target)
  );

  return buildStoryFactSimulationReport(runs, factDefinitions);
}

export function collectStoryFactEffectDefinitions(
  content: GameContent
): StoryFactEffectDefinition[] {
  const definitions: StoryFactEffectDefinition[] = [];

  for (const scene of Object.values(content.scenes)) {
    for (const choice of getAllSceneChoices(scene)) {
      for (const effect of choice.effects ?? []) {
        if (effect.kind === "setProperty" && effect.entityId === "story") {
          definitions.push({
            sceneId: scene.id,
            choiceId: choice.id,
            fact: effect.property,
            value: effect.value === true
          });
        }
      }
    }
  }

  return definitions;
}

function simulateRun(
  runId: string,
  content: GameContent,
  initialState: GameState,
  target: ChoiceTarget
): SimulationRun {
  let state = initialState;
  const selectedChoices: SimulatedChoice[] = [];
  const factEvents: StoryFactEffectEvent[] = [];
  let steps = 0;

  while (!state.ended && steps < MAX_SIMULATION_STEPS) {
    const visibleScenes = getVisibleScenes(state, content);

    if (visibleScenes.length === 0) {
      state = advanceDay(state, content);
      steps += 1;
      continue;
    }

    const scene = chooseScene(visibleScenes, target, state);
    const choice = chooseChoice(scene, target, state);

    selectedChoices.push({
      sceneId: scene.id,
      choiceId: choice.id,
      day: state.day
    });

    factEvents.push(
      ...getSetStoryFactEffects(choice.effects ?? []).map((effect) => ({
        runId,
        day: state.day,
        sceneId: scene.id,
        choiceId: choice.id,
        fact: effect.key,
        value: effect.value
      }))
    );

    state = resolveChoice(state, scene.id, choice.id, content);
    steps += 1;
  }

  if (steps >= MAX_SIMULATION_STEPS) {
    throw new Error(`Simulation exceeded ${MAX_SIMULATION_STEPS} steps`);
  }

  return {
    id: runId,
    finalState: state,
    selectedChoices,
    factEvents
  };
}

function buildStoryFactSimulationReport(
  runs: SimulationRun[],
  factDefinitions: StoryFactEffectDefinition[]
): StoryFactSimulationReport {
  const factsDefinedInContent = uniqueSorted(
    factDefinitions.map((definition) => definition.fact)
  );
  const events = runs.flatMap((run) => run.factEvents);
  const observedEventKeys = new Set(events.map(factEffectKey));

  const factMetrics = factsDefinedInContent.map((fact) => {
    const factEvents = events.filter((event) => event.fact === fact);

    return {
      fact,
      setTrueCount: factEvents.filter((event) => event.value).length,
      setFalseCount: factEvents.filter((event) => !event.value).length,
      finalTrueCount: runs.filter((run) => getBooleanProperty(run.finalState, "story", fact))
        .length,
      finalFalseCount: runs.filter((run) => !getBooleanProperty(run.finalState, "story", fact))
        .length
    };
  });

  return {
    runs,
    factMetrics,
    factsDefinedInContent,
    factsNeverObserved: factsDefinedInContent.filter(
      (fact) => !events.some((event) => event.fact === fact)
    ),
    factChoiceEffectsNeverObserved: factDefinitions.filter(
      (definition) => !observedEventKeys.has(factEffectKey(definition))
    )
  };
}

function chooseScene(
  visibleScenes: Scene[],
  target: ChoiceTarget,
  state: GameState
): Scene {
  if (state.activeScene) {
    return (
      visibleScenes.find((scene) => scene.id === state.activeScene?.sceneId) ??
      visibleScenes[0]
    );
  }

  return (
    visibleScenes.find((scene) => scene.id === target.sceneId) ?? visibleScenes[0]
  );
}

function chooseChoice(
  scene: Scene,
  target: ChoiceTarget,
  state: GameState
): SceneChoice | BeatChoice {
  const choices = getSceneChoices(scene, state.activeScene);

  if (scene.id === target.sceneId) {
    const targetedChoice = choices.find(
      (choice) => choice.id === target.choiceId
    );

    if (targetedChoice) {
      return targetedChoice;
    }
  }

  return choices[0];
}

function getSetStoryFactEffects(
  effects: Effect[]
): { key: string; value: boolean }[] {
  return effects.flatMap((effect) => {
    if (effect.kind === "setProperty" && effect.entityId === "story") {
      return [{ key: effect.property, value: effect.value === true }];
    }
    return [];
  });
}

function uniqueChoiceTargets(
  definitions: StoryFactEffectDefinition[]
): ChoiceTarget[] {
  const targets = new Map<string, ChoiceTarget>();

  for (const definition of definitions) {
    const key = `${definition.sceneId}:${definition.choiceId}`;
    targets.set(key, {
      sceneId: definition.sceneId,
      choiceId: definition.choiceId
    });
  }

  return [...targets.values()];
}

function factEffectKey(definition: StoryFactEffectDefinition): string {
  return `${definition.sceneId}:${definition.choiceId}:${definition.fact}:${definition.value}`;
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}
