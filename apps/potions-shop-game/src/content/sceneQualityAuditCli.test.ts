import { describe, expect, it } from "vitest";
import {
  auditScene,
  formatSceneQualityAudit,
  getFailingSceneQualityIssues,
  type SceneQualityFailSeverity
} from "./sceneQualityAudit";
import { scenes } from "./scenes";

declare const process: {
  env: Record<string, string | undefined>;
  stdout: {
    write(chunk: string): void;
  };
};

describe("single scene quality audit", () => {
  it("prints actionable audit feedback for exactly one scene", () => {
    if (!hasSelectedScene() && process.env.npm_lifecycle_event !== "audit:scene") {
      return;
    }

    const sceneId = resolveSceneId();
    const scene = scenes[sceneId];
    const failOn = resolveFailOn();

    if (!scene) {
      throw new Error(
        [
          `Unknown scene "${sceneId}".`,
          "",
          "Available scenes:",
          ...Object.keys(scenes).sort().map((id) => `- ${id}`)
        ].join("\n")
      );
    }

    const audit = auditScene(scene);
    const report = formatSceneQualityAudit(audit, failOn);
    const failingIssues = getFailingSceneQualityIssues(audit, failOn);

    process.stdout.write(`\n${report}\n`);

    expect(failingIssues, report).toEqual([]);
  });
});

function hasSelectedScene(): boolean {
  return Boolean((process.env.SCENE_ID ?? process.env.SCENE_FILE)?.trim());
}

function resolveSceneId(): string {
  const raw = process.env.SCENE_ID ?? process.env.SCENE_FILE;

  if (!raw?.trim()) {
    throw new Error(
      [
        "Set SCENE_ID or SCENE_FILE to audit exactly one scene.",
        "",
        "Examples:",
        "SCENE_ID=apprentice-asks-trust pnpm --filter @aphebis/potions-shop-game audit:scene",
        "SCENE_FILE=apps/potions-shop-game/src/content/scenes/apprentice-asks-trust.ts pnpm --filter @aphebis/potions-shop-game audit:scene"
      ].join("\n")
    );
  }

  return raw
    .trim()
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    ?.replace(/\.ts$/, "") ?? raw.trim();
}

function resolveFailOn(): SceneQualityFailSeverity {
  const raw = process.env.SCENE_QUALITY_FAIL_ON ?? "warning";

  if (raw === "info" || raw === "warning" || raw === "error") {
    return raw;
  }

  throw new Error('SCENE_QUALITY_FAIL_ON must be "info", "warning", or "error".');
}
