import type { Scene } from "@aphebis/core";
import { describe, expect, it } from "vitest";
import {
  auditScene,
  auditScenes,
  formatSceneQualityAudit,
  getFailingSceneQualityIssues
} from "./sceneQualityAudit";
import { scenes } from "./scenes";

declare const process: {
  env: Record<string, string | undefined>;
};

describe("scene quality audit", () => {
  it("accepts a well-shaped two-beat scene", () => {
    const audit = auditScene(createTwoBeatScene());

    expect(audit.summary).toMatchObject({
      beatCount: 2,
      choiceCount: 2,
      terminalChoiceCount: 1,
      pathCount: 1,
      minimumPathDepth: 2,
      maximumPathDepth: 2
    });
    expect(audit.issues).toEqual([]);
  });

  it("reports graph, local-state, and ending quality issues with severity", () => {
    const audit = auditScene({
      ...createTwoBeatScene(),
      startBeatId: "opening",
      localProperties: {
        mood: { initial: "uneasy" }
      },
      beats: {
        opening: {
          id: "wrong-id",
          text: "",
          choices: [
            {
              id: "loop",
              label: "Loop",
              nextBeatId: "opening"
            },
            {
              id: "missing-next",
              label: "Missing next",
              localEffects: [{ kind: "changeLocal", key: "mood", delta: 1 }],
              nextBeatId: "gone"
            }
          ]
        },
        ending: {
          id: "ending",
          title: "Ending",
          text: "A real ending beat.",
          choices: [
            {
              id: "empty-ending",
              label: "End",
              endsScene: true
            }
          ]
        },
        unused: {
          id: "unused",
          title: "Unused",
          text: "No route reaches this beat.",
          choices: [
            {
              id: "unused-end",
              label: "End",
              endsScene: true,
              effects: [{ kind: "log", text: "Unused." }],
              aftermath: {
                narration: "Unused.",
                futureEchoText: ["Unused."]
              }
            }
          ]
        }
      }
    });

    expect(codes(audit)).toEqual(
      expect.arrayContaining([
        "beat.idMismatch",
        "beat.missingTitle",
        "beat.missingText",
        "choice.missingDescription",
        "choice.selfLoop",
        "choice.unknownNextBeat",
        "localEffect.changeNonNumericProperty",
        "beat.unreachable",
        "path.cycle",
        "path.noEnding"
      ])
    );
    expect(audit.issues.some((issue) => issue.severity === "error")).toBe(true);
    expect(audit.issues.some((issue) => issue.severity === "warning")).toBe(true);
  });

  it("applies configurable path-depth thresholds", () => {
    const shallow = auditScene(createSingleBeatScene());
    expect(codes(shallow)).toContain("path.tooShallow");
    expect(shallow.issues.find((issue) => issue.code === "path.tooShallow")).toMatchObject({
      severity: "error",
      path: ["opening"]
    });

    const allowed = auditScene(createSingleBeatScene(), {
      pathDepth: { errorAtOrBelow: 0, warnBelow: 1 }
    });
    expect(codes(allowed)).not.toContain("path.tooShallow");
  });

  it("formats single-scene audit reports and filters by failure threshold", () => {
    const audit = auditScene(createSingleBeatScene());

    expect(getFailingSceneQualityIssues(audit, "error").map((issue) => issue.code)).toEqual([
      "path.tooShallow"
    ]);
    expect(formatSceneQualityAudit(audit)).toContain("Scene: single-beat");
    expect(formatSceneQualityAudit(audit)).toContain("ERROR | path.tooShallow");
    expect(formatSceneQualityAudit(audit)).toContain("FAIL: 1 issue(s)");
  });

  it("can print the current content audit when requested", () => {
    const audits = auditScenes(scenes);

    if (process.env.SCENE_QUALITY_AUDIT === "1") {
      console.table(
        audits.map((audit) => ({
          scene: audit.sceneId,
          beats: audit.summary.beatCount,
          choices: audit.summary.choiceCount,
          paths: audit.summary.pathCount,
          minDepth: audit.summary.minimumPathDepth,
          maxDepth: audit.summary.maximumPathDepth,
          info: audit.issues.filter((issue) => issue.severity === "info").length,
          warnings: audit.issues.filter((issue) => issue.severity === "warning").length,
          errors: audit.issues.filter((issue) => issue.severity === "error").length
        }))
      );
      console.table(
        audits.flatMap((audit) =>
          audit.issues.map((issue) => ({
            scene: issue.sceneId,
            severity: issue.severity,
            code: issue.code,
            beat: issue.beatId,
            choice: issue.choiceId,
            message: issue.message
          }))
        )
      );
    }

    expect(audits).toHaveLength(Object.keys(scenes).length);
  });
});

function codes(audit: ReturnType<typeof auditScene>): string[] {
  return audit.issues.map((issue) => issue.code).sort();
}

function createSingleBeatScene(): Scene {
  return {
    id: "single-beat",
    title: "Single Beat",
    type: "test",
    description: "A scene that ends immediately.",
    startBeatId: "opening",
    beats: {
      opening: {
        id: "opening",
        title: "Opening",
        text: "A choice arrives before the moment has room to turn.",
        choices: [
          {
            id: "end-now",
            label: "End now",
            description: "Resolve before the scene has developed.",
            endsScene: true,
            effects: [{ kind: "log", text: "It ended." }],
            aftermath: {
              narration: "The moment ended as soon as it began.",
              futureEchoText: ["Nothing had much room to change."]
            }
          }
        ]
      }
    }
  };
}

function createTwoBeatScene(): Scene {
  return {
    id: "two-beat",
    title: "Two Beat",
    type: "test",
    description: "A scene with a turn before its ending.",
    startBeatId: "opening",
    beats: {
      opening: {
        id: "opening",
        title: "Opening",
        text: "The first beat poses the question and lets the player lean in.",
        choices: [
          {
            id: "continue",
            label: "Continue",
            description: "Let the scene reveal its second pressure.",
            nextBeatId: "decision"
          }
        ]
      },
      decision: {
        id: "decision",
        title: "Decision",
        text: "The second beat turns the premise into a consequence.",
        choices: [
          {
            id: "accept",
            label: "Accept",
            description: "Take the consequence into the shop's future.",
            endsScene: true,
            effects: [
              {
                kind: "changeProperty",
                entityId: "shop",
                property: "goodwill",
                direction: "increase",
                amount: 0.1
              }
            ],
            aftermath: {
              narration: "The decision changes how the shop is seen.",
              spotlightProperties: [{ entityId: "shop", property: "goodwill" }],
              futureEchoText: ["Someone will remember the shape of this answer."]
            }
          }
        ]
      }
    }
  };
}
