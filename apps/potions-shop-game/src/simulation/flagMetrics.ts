import type {
  Effect,
  GameContent,
  GameState,
  SceneCard,
  SceneChoice
} from "../domain";
import { createInitialState } from "../content/initialState";
import { advanceDay } from "../engine/advanceDay";
import { resolveChoice } from "../engine/resolveChoice";
import { getVisibleScenes } from "../engine/sceneTableau";

export type FlagEffectDefinition = {
  sceneId: string;
  choiceId: string;
  flag: string;
  value: boolean;
};

export type FlagEffectEvent = FlagEffectDefinition & {
  runId: string;
  day: number;
};

export type FlagMetric = {
  flag: string;
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
  flagEvents: FlagEffectEvent[];
};

export type FlagSimulationReport = {
  runs: SimulationRun[];
  flagMetrics: FlagMetric[];
  flagsDefinedInContent: string[];
  flagsNeverObserved: string[];
  flagChoiceEffectsNeverObserved: FlagEffectDefinition[];
};

type ChoiceTarget = {
  sceneId: string;
  choiceId: string;
};

const MAX_SIMULATION_STEPS = 200;

export function simulateFlagMetrics(
  content: GameContent,
  createState: () => GameState = createInitialState
): FlagSimulationReport {
  const flagDefinitions = collectFlagEffectDefinitions(content);
  const targets = uniqueChoiceTargets(flagDefinitions);
  const runs = targets.map((target, index) =>
    simulateRun(`flag-choice-${index + 1}`, content, createState(), target)
  );

  return buildFlagSimulationReport(runs, flagDefinitions);
}

export function collectFlagEffectDefinitions(
  content: GameContent
): FlagEffectDefinition[] {
  const definitions: FlagEffectDefinition[] = [];

  for (const scene of Object.values(content.scenes)) {
    for (const choice of scene.choices) {
      for (const effect of choice.effects) {
        if (effect.kind === "setFlag") {
          definitions.push({
            sceneId: scene.id,
            choiceId: choice.id,
            flag: effect.key,
            value: effect.value
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
  const flagEvents: FlagEffectEvent[] = [];
  let steps = 0;

  while (!state.ended && steps < MAX_SIMULATION_STEPS) {
    const visibleScenes = getVisibleScenes(state, content);

    if (visibleScenes.length === 0) {
      state = advanceDay(state, content);
      steps += 1;
      continue;
    }

    const scene = chooseScene(visibleScenes, target);
    const choice = chooseChoice(scene, target);

    selectedChoices.push({
      sceneId: scene.id,
      choiceId: choice.id,
      day: state.day
    });

    flagEvents.push(
      ...getSetFlagEffects(choice.effects).map((effect) => ({
        runId,
        day: state.day,
        sceneId: scene.id,
        choiceId: choice.id,
        flag: effect.key,
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
    flagEvents
  };
}

function buildFlagSimulationReport(
  runs: SimulationRun[],
  flagDefinitions: FlagEffectDefinition[]
): FlagSimulationReport {
  const flagsDefinedInContent = uniqueSorted(
    flagDefinitions.map((definition) => definition.flag)
  );
  const events = runs.flatMap((run) => run.flagEvents);
  const observedEventKeys = new Set(events.map(flagEffectKey));

  const flagMetrics = flagsDefinedInContent.map((flag) => {
    const flagEvents = events.filter((event) => event.flag === flag);

    return {
      flag,
      setTrueCount: flagEvents.filter((event) => event.value).length,
      setFalseCount: flagEvents.filter((event) => !event.value).length,
      finalTrueCount: runs.filter((run) => run.finalState.flags[flag] === true)
        .length,
      finalFalseCount: runs.filter((run) => run.finalState.flags[flag] !== true)
        .length
    };
  });

  return {
    runs,
    flagMetrics,
    flagsDefinedInContent,
    flagsNeverObserved: flagsDefinedInContent.filter(
      (flag) => !events.some((event) => event.flag === flag)
    ),
    flagChoiceEffectsNeverObserved: flagDefinitions.filter(
      (definition) => !observedEventKeys.has(flagEffectKey(definition))
    )
  };
}

function chooseScene(visibleScenes: SceneCard[], target: ChoiceTarget): SceneCard {
  return (
    visibleScenes.find((scene) => scene.id === target.sceneId) ?? visibleScenes[0]
  );
}

function chooseChoice(scene: SceneCard, target: ChoiceTarget): SceneChoice {
  if (scene.id === target.sceneId) {
    const targetedChoice = scene.choices.find(
      (choice) => choice.id === target.choiceId
    );

    if (targetedChoice) {
      return targetedChoice;
    }
  }

  return scene.choices[0];
}

function getSetFlagEffects(
  effects: Effect[]
): Extract<Effect, { kind: "setFlag" }>[] {
  return effects.filter(
    (effect): effect is Extract<Effect, { kind: "setFlag" }> =>
      effect.kind === "setFlag"
  );
}

function uniqueChoiceTargets(
  definitions: FlagEffectDefinition[]
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

function flagEffectKey(definition: FlagEffectDefinition): string {
  return `${definition.sceneId}:${definition.choiceId}:${definition.flag}:${definition.value}`;
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}
