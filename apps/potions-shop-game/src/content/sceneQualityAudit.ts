import type { BeatChoice, Effect, Scene, SceneBeat } from "@aphebis/core";

export type SceneQualitySeverity = "info" | "warning" | "error";

export type SceneQualityIssue = {
  severity: SceneQualitySeverity;
  code: string;
  message: string;
  sceneId: string;
  beatId?: string;
  choiceId?: string;
  path?: string[];
};

export type SceneQualityAuditOptions = {
  pathDepth?: {
    warnBelow?: number;
    errorAtOrBelow?: number;
    warnAbove?: number;
    errorAbove?: number;
  };
};

export type SceneQualityAudit = {
  sceneId: string;
  issues: SceneQualityIssue[];
  summary: {
    beatCount: number;
    choiceCount: number;
    terminalChoiceCount: number;
    pathCount: number;
    minimumPathDepth: number;
    maximumPathDepth: number;
  };
};

export type SceneQualityFailSeverity = "info" | "warning" | "error";

type ResolvedSceneQualityAuditOptions = {
  pathDepth: Required<NonNullable<SceneQualityAuditOptions["pathDepth"]>>;
};

type TraversedPath = {
  beatIds: string[];
  choiceIds: string[];
  terminalChoice?: BeatChoice;
};

const defaultOptions = {
  pathDepth: {
    warnBelow: 2,
    errorAtOrBelow: 1,
    warnAbove: 5,
    errorAbove: 7
  }
} satisfies Required<SceneQualityAuditOptions>;

export function auditScenes(
  scenes: Record<string, Scene>,
  options: SceneQualityAuditOptions = {}
): SceneQualityAudit[] {
  return Object.values(scenes)
    .map((scene) => auditScene(scene, options))
    .sort((left, right) => left.sceneId.localeCompare(right.sceneId));
}

export function auditScene(
  scene: Scene,
  options: SceneQualityAuditOptions = {}
): SceneQualityAudit {
  const auditOptions = mergeOptions(options);
  const issues: SceneQualityIssue[] = [];
  const beats = scene.beats ?? {};
  const beatEntries = Object.entries(beats);
  let choiceCount = 0;
  let terminalChoiceCount = 0;

  addSceneFieldIssues(scene, issues);

  if (!scene.beats) {
    pushIssue(issues, scene, {
      severity: "error",
      code: "scene.missingBeats",
      message: "Scene must define beats."
    });
  }

  if (scene.choices) {
    pushIssue(issues, scene, {
      severity: "error",
      code: "scene.usesRootChoices",
      message: "Beat scenes should not define root choices."
    });
  }

  if (!scene.startBeatId) {
    pushIssue(issues, scene, {
      severity: "error",
      code: "scene.missingStartBeatId",
      message: "Scene must define startBeatId."
    });
  } else if (!beats[scene.startBeatId]) {
    pushIssue(issues, scene, {
      severity: "error",
      code: "scene.unknownStartBeatId",
      message: `startBeatId "${scene.startBeatId}" does not exist.`
    });
  }

  const seenChoiceIds = new Map<string, string>();
  for (const [beatId, beat] of beatEntries) {
    choiceCount += beat.choices.length;
    terminalChoiceCount += beat.choices.filter((choice) => choice.endsScene === true).length;
    addBeatIssues(scene, beatId, beat, beats, seenChoiceIds, issues);
  }

  addReachabilityIssues(scene, beats, issues);

  const paths = scene.startBeatId && beats[scene.startBeatId]
    ? collectTerminalPaths(scene, beats, issues)
    : [];
  addPathDepthIssues(scene, paths, auditOptions, issues);

  const depths = paths.map((path) => path.beatIds.length);

  return {
    sceneId: scene.id,
    issues,
    summary: {
      beatCount: beatEntries.length,
      choiceCount,
      terminalChoiceCount,
      pathCount: paths.length,
      minimumPathDepth: depths.length === 0 ? 0 : Math.min(...depths),
      maximumPathDepth: depths.length === 0 ? 0 : Math.max(...depths)
    }
  };
}

export function getSceneQualityIssues(
  scenes: Record<string, Scene>,
  options: SceneQualityAuditOptions = {}
): SceneQualityIssue[] {
  return auditScenes(scenes, options).flatMap((audit) => audit.issues);
}

export function getFailingSceneQualityIssues(
  audit: SceneQualityAudit,
  failOn: SceneQualityFailSeverity = "warning"
): SceneQualityIssue[] {
  return audit.issues.filter((issue) => severityRank(issue.severity) >= severityRank(failOn));
}

export function formatSceneQualityAudit(
  audit: SceneQualityAudit,
  failOn: SceneQualityFailSeverity = "warning"
): string {
  const failingIssues = getFailingSceneQualityIssues(audit, failOn);
  const summary = [
    `Scene: ${audit.sceneId}`,
    `Beats: ${audit.summary.beatCount}`,
    `Choices: ${audit.summary.choiceCount}`,
    `Terminal choices: ${audit.summary.terminalChoiceCount}`,
    `Paths: ${audit.summary.pathCount}`,
    `Depth: ${audit.summary.minimumPathDepth}-${audit.summary.maximumPathDepth}`,
    `Failing threshold: ${failOn}+`
  ].join("\n");

  const issueLines = audit.issues.length === 0
    ? ["No deterministic issues found."]
    : ["Issues:", ...audit.issues.map(formatSceneQualityIssue)];

  const status = failingIssues.length === 0
    ? "PASS: no issues at or above the failing threshold."
    : `FAIL: ${failingIssues.length} issue(s) at or above the failing threshold.`;

  return [summary, "", ...issueLines, "", status].join("\n");
}

export function formatSceneQualityIssue(issue: SceneQualityIssue): string {
  const parts = [
    issue.severity.toUpperCase(),
    issue.code,
    `scene=${issue.sceneId}`
  ];

  if (issue.beatId) {
    parts.push(`beat=${issue.beatId}`);
  }

  if (issue.choiceId) {
    parts.push(`choice=${issue.choiceId}`);
  }

  if (issue.path) {
    parts.push(`path=${issue.path.join(" > ")}`);
  }

  return `- ${parts.join(" | ")}\n  ${issue.message}`;
}

function addSceneFieldIssues(scene: Scene, issues: SceneQualityIssue[]): void {
  if (!scene.id.trim()) {
    pushIssue(issues, scene, {
      severity: "error",
      code: "scene.missingId",
      message: "Scene id must not be empty."
    });
  }

  if (!scene.title.trim()) {
    pushIssue(issues, scene, {
      severity: "error",
      code: "scene.missingTitle",
      message: "Scene title must not be empty."
    });
  }

  if (!scene.type.trim()) {
    pushIssue(issues, scene, {
      severity: "error",
      code: "scene.missingType",
      message: "Scene type must not be empty."
    });
  }

  if (!scene.description.trim()) {
    pushIssue(issues, scene, {
      severity: "warning",
      code: "scene.missingDescription",
      message: "Scene description should establish the dramatic premise."
    });
  }
}

function addBeatIssues(
  scene: Scene,
  beatId: string,
  beat: SceneBeat,
  beats: Record<string, SceneBeat>,
  seenChoiceIds: Map<string, string>,
  issues: SceneQualityIssue[]
): void {
  if (beat.id !== beatId) {
    pushIssue(issues, scene, {
      severity: "error",
      code: "beat.idMismatch",
      beatId,
      message: `Beat key "${beatId}" does not match beat.id "${beat.id}".`
    });
  }

  if (!beat.title?.trim()) {
    pushIssue(issues, scene, {
      severity: "warning",
      code: "beat.missingTitle",
      beatId,
      message: "Beat should have a title for debugging and authoring."
    });
  }

  if (!beat.text.trim()) {
    pushIssue(issues, scene, {
      severity: "error",
      code: "beat.missingText",
      beatId,
      message: "Beat text must not be empty."
    });
  }

  if (beat.choices.length === 0) {
    pushIssue(issues, scene, {
      severity: "error",
      code: "beat.missingChoices",
      beatId,
      message: "Beat must offer at least one choice."
    });
  }

  for (const choice of beat.choices) {
    addChoiceIssues(scene, beatId, choice, beats, seenChoiceIds, issues);
  }
}

function addChoiceIssues(
  scene: Scene,
  beatId: string,
  choice: BeatChoice,
  beats: Record<string, SceneBeat>,
  seenChoiceIds: Map<string, string>,
  issues: SceneQualityIssue[]
): void {
  if (!choice.id.trim()) {
    pushIssue(issues, scene, {
      severity: "error",
      code: "choice.missingId",
      beatId,
      message: "Choice id must not be empty."
    });
  } else {
    const firstBeatId = seenChoiceIds.get(choice.id);
    if (firstBeatId) {
      pushIssue(issues, scene, {
        severity: "warning",
        code: "choice.duplicateId",
        beatId,
        choiceId: choice.id,
        message: `Choice id is also used in beat "${firstBeatId}".`
      });
    } else {
      seenChoiceIds.set(choice.id, beatId);
    }
  }

  if (!choice.label.trim()) {
    pushIssue(issues, scene, {
      severity: "error",
      code: "choice.missingLabel",
      beatId,
      choiceId: choice.id,
      message: "Choice label must not be empty."
    });
  }

  if (!choice.description?.trim()) {
    pushIssue(issues, scene, {
      severity: "warning",
      code: "choice.missingDescription",
      beatId,
      choiceId: choice.id,
      message: "Choice should explain its dramatic intent or trade-off."
    });
  }

  const advancesBeat = Boolean(choice.nextBeatId);
  const endsScene = choice.endsScene === true;
  if (advancesBeat === endsScene) {
    pushIssue(issues, scene, {
      severity: "error",
      code: "choice.invalidTransition",
      beatId,
      choiceId: choice.id,
      message: "Choice must either advance to one next beat or end the scene."
    });
  }

  if (choice.nextBeatId && !beats[choice.nextBeatId]) {
    pushIssue(issues, scene, {
      severity: "error",
      code: "choice.unknownNextBeat",
      beatId,
      choiceId: choice.id,
      message: `nextBeatId "${choice.nextBeatId}" does not exist.`
    });
  }

  if (choice.nextBeatId === beatId) {
    pushIssue(issues, scene, {
      severity: "error",
      code: "choice.selfLoop",
      beatId,
      choiceId: choice.id,
      message: "Choice loops back to its own beat."
    });
  }

  addLocalStateIssues(scene, beatId, choice, issues);
  addEndingIssues(scene, beatId, choice, issues);
}

function addLocalStateIssues(
  scene: Scene,
  beatId: string,
  choice: BeatChoice,
  issues: SceneQualityIssue[]
): void {
  for (const effect of choice.localEffects ?? []) {
    const property = scene.localProperties?.[effect.key];
    if (!property) {
      pushIssue(issues, scene, {
        severity: "error",
        code: "localEffect.unknownProperty",
        beatId,
        choiceId: choice.id,
        message: `localEffect references unknown local property "${effect.key}".`
      });
      continue;
    }

    if (effect.kind === "changeLocal" && typeof property.initial !== "number") {
      pushIssue(issues, scene, {
        severity: "error",
        code: "localEffect.changeNonNumericProperty",
        beatId,
        choiceId: choice.id,
        message: `changeLocal references non-numeric local property "${effect.key}".`
      });
    }
  }

  for (const condition of [
    ...(choice.availability?.all ?? []),
    ...(choice.availability?.any ?? [])
  ]) {
    const property = scene.localProperties?.[condition.key];
    if (!property) {
      pushIssue(issues, scene, {
        severity: "error",
        code: "localAvailability.unknownProperty",
        beatId,
        choiceId: choice.id,
        message: `availability references unknown local property "${condition.key}".`
      });
      continue;
    }

    if (
      (condition.min !== undefined || condition.max !== undefined) &&
      typeof property.initial !== "number"
    ) {
      pushIssue(issues, scene, {
        severity: "error",
        code: "localAvailability.comparesNonNumericProperty",
        beatId,
        choiceId: choice.id,
        message: `availability compares non-numeric local property "${condition.key}".`
      });
    }
  }
}

function addEndingIssues(
  scene: Scene,
  beatId: string,
  choice: BeatChoice,
  issues: SceneQualityIssue[]
): void {
  if (choice.endsScene !== true) {
    return;
  }

  if ((choice.effects?.length ?? 0) === 0) {
    pushIssue(issues, scene, {
      severity: "warning",
      code: "ending.missingEffects",
      beatId,
      choiceId: choice.id,
      message: "Ending choice should usually mutate global state or log a consequence."
    });
  }

  if (!choice.aftermath) {
    pushIssue(issues, scene, {
      severity: "error",
      code: "ending.missingAftermath",
      beatId,
      choiceId: choice.id,
      message: "Ending choice must define aftermath."
    });
    return;
  }

  if (!choice.aftermath.narration.trim()) {
    pushIssue(issues, scene, {
      severity: "error",
      code: "ending.missingAftermathNarration",
      beatId,
      choiceId: choice.id,
      message: "Ending aftermath must include narration."
    });
  }

  if ((choice.aftermath.futureEchoText?.length ?? 0) === 0) {
    pushIssue(issues, scene, {
      severity: "warning",
      code: "ending.missingFutureEcho",
      beatId,
      choiceId: choice.id,
      message: "Ending aftermath should include at least one future echo."
    });
  }

  addSpotlightIssues(scene, beatId, choice, issues);
}

function addSpotlightIssues(
  scene: Scene,
  beatId: string,
  choice: BeatChoice,
  issues: SceneQualityIssue[]
): void {
  const changedProperties = new Set(
    (choice.effects ?? []).flatMap(getChangedPropertyKeys)
  );
  const spotlightProperties = new Set(
    (choice.aftermath?.spotlightProperties ?? []).map(
      (property) => `${property.entityId}.${property.property}`
    )
  );

  for (const spotlight of spotlightProperties) {
    if (!changedProperties.has(spotlight)) {
      pushIssue(issues, scene, {
        severity: "warning",
        code: "ending.spotlightsUnchangedProperty",
        beatId,
        choiceId: choice.id,
        message: `Aftermath spotlights "${spotlight}", but the ending does not change it.`
      });
    }
  }

  for (const changed of changedProperties) {
    if (!spotlightProperties.has(changed)) {
      pushIssue(issues, scene, {
        severity: "info",
        code: "ending.changedPropertyNotSpotlighted",
        beatId,
        choiceId: choice.id,
        message: `Ending changes "${changed}" without spotlighting it.`
      });
    }
  }
}

function addReachabilityIssues(
  scene: Scene,
  beats: Record<string, SceneBeat>,
  issues: SceneQualityIssue[]
): void {
  if (!scene.startBeatId || !beats[scene.startBeatId]) {
    return;
  }

  const reachable = new Set<string>();
  const pending = [scene.startBeatId];

  while (pending.length > 0) {
    const beatId = pending.pop();
    if (!beatId || reachable.has(beatId)) {
      continue;
    }

    reachable.add(beatId);

    for (const choice of beats[beatId]?.choices ?? []) {
      if (choice.nextBeatId) {
        pending.push(choice.nextBeatId);
      }
    }
  }

  for (const beatId of Object.keys(beats)) {
    if (!reachable.has(beatId)) {
      pushIssue(issues, scene, {
        severity: "error",
        code: "beat.unreachable",
        beatId,
        message: "Beat is not reachable from startBeatId."
      });
    }
  }
}

function collectTerminalPaths(
  scene: Scene,
  beats: Record<string, SceneBeat>,
  issues: SceneQualityIssue[]
): TraversedPath[] {
  const paths: TraversedPath[] = [];
  const startBeatId = scene.startBeatId;
  if (!startBeatId) {
    return paths;
  }

  const walk = (beatId: string, beatIds: string[], choiceIds: string[]): void => {
    if (beatIds.includes(beatId)) {
      pushIssue(issues, scene, {
        severity: "error",
        code: "path.cycle",
        beatId,
        path: [...beatIds, beatId],
        message: `Path contains a cycle through beat "${beatId}".`
      });
      return;
    }

    const beat = beats[beatId];
    if (!beat) {
      return;
    }

    const nextBeatIds = [...beatIds, beatId];
    for (const choice of beat.choices) {
      const nextChoiceIds = [...choiceIds, choice.id];
      if (choice.endsScene === true) {
        paths.push({
          beatIds: nextBeatIds,
          choiceIds: nextChoiceIds,
          terminalChoice: choice
        });
        continue;
      }

      if (choice.nextBeatId) {
        walk(choice.nextBeatId, nextBeatIds, nextChoiceIds);
      }
    }
  };

  walk(startBeatId, [], []);

  if (paths.length === 0) {
    pushIssue(issues, scene, {
      severity: "error",
      code: "path.noEnding",
      message: "No path from startBeatId reaches an ending choice."
    });
  }

  return paths;
}

function addPathDepthIssues(
  scene: Scene,
  paths: TraversedPath[],
  options: ResolvedSceneQualityAuditOptions,
  issues: SceneQualityIssue[]
): void {
  for (const path of paths) {
    const depth = path.beatIds.length;
    const location = {
      beatId: path.beatIds[path.beatIds.length - 1],
      choiceId: path.terminalChoice?.id,
      path: path.beatIds
    };

    if (depth <= options.pathDepth.errorAtOrBelow) {
      pushIssue(issues, scene, {
        ...location,
        severity: "error",
        code: "path.tooShallow",
        message: `Ending path has depth ${depth}; expected more than ${options.pathDepth.errorAtOrBelow}.`
      });
    } else if (depth < options.pathDepth.warnBelow) {
      pushIssue(issues, scene, {
        ...location,
        severity: "warning",
        code: "path.short",
        message: `Ending path has depth ${depth}; consider at least ${options.pathDepth.warnBelow} beats.`
      });
    }

    if (depth > options.pathDepth.errorAbove) {
      pushIssue(issues, scene, {
        ...location,
        severity: "error",
        code: "path.tooDeep",
        message: `Ending path has depth ${depth}; expected at most ${options.pathDepth.errorAbove}.`
      });
    } else if (depth > options.pathDepth.warnAbove) {
      pushIssue(issues, scene, {
        ...location,
        severity: "warning",
        code: "path.long",
        message: `Ending path has depth ${depth}; consider at most ${options.pathDepth.warnAbove} beats.`
      });
    }
  }
}

function getChangedPropertyKeys(effect: Effect): string[] {
  switch (effect.kind) {
    case "changeProperty":
    case "setProperty":
      return [`${effect.entityId}.${effect.property}`];
    default:
      return [];
  }
}

function mergeOptions(options: SceneQualityAuditOptions): ResolvedSceneQualityAuditOptions {
  return {
    pathDepth: {
      ...defaultOptions.pathDepth,
      ...options.pathDepth
    }
  };
}

function pushIssue(
  issues: SceneQualityIssue[],
  scene: Scene,
  issue: Omit<SceneQualityIssue, "sceneId">
): void {
  issues.push({
    sceneId: scene.id,
    ...issue
  });
}

function severityRank(severity: SceneQualitySeverity): number {
  switch (severity) {
    case "info":
      return 1;
    case "warning":
      return 2;
    case "error":
      return 3;
  }
}
