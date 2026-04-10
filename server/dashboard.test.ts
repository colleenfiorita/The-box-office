import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("dashboard routes", () => {
  it("dashboard.tickets returns an array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.dashboard.tickets();
    expect(Array.isArray(result)).toBe(true);
  });

  it("dashboard.tests returns an array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.dashboard.tests();
    expect(Array.isArray(result)).toBe(true);
  });

  it("dashboard.tasks returns an array with parsed tags", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.dashboard.tasks();
    expect(Array.isArray(result)).toBe(true);
    // If there are tasks, tags should be an array (parsed from JSON)
    if (result.length > 0) {
      expect(Array.isArray(result[0].tags)).toBe(true);
    }
  });

  it("dashboard.lastSync returns null or a sync record", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.dashboard.lastSync();
    // Can be null if no syncs yet, or an object with syncType
    if (result !== null) {
      expect(result).toHaveProperty("syncType");
      expect(result).toHaveProperty("syncedAt");
    }
  });

  it("dashboard.sync upserts data and returns success", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.dashboard.sync({
      tickets: [
        {
          externalId: "TEST-VITEST-001",
          type: "Case",
          subject: "Vitest Test Ticket",
          issue: "Testing",
          status: "Open",
          client: "Test Client",
          clientEmail: "test@test.com",
          clientCompany: "Test Co",
          firstDate: "2026-04-10",
          lastActivity: "2026-04-10",
          messageCount: 1,
          priority: "Low",
          snippet: "This is a test ticket from vitest",
          gmailLink: "https://mail.google.com/test",
        },
      ],
      tests: [
        {
          externalId: "TEST-VITEST-T001",
          subject: "Vitest Test Experiment",
          testType: "A/B Test",
          status: "Active",
          brand: "Test Brand",
          client: "Test Client",
          clientEmail: "test@test.com",
          firstDate: "2026-04-10",
          lastActivity: "2026-04-10",
          messageCount: 1,
          snippet: "This is a test experiment from vitest",
          gmailLink: "https://mail.google.com/test",
        },
      ],
      tasks: [
        {
          taskNumber: "T999999999",
          title: "Vitest Test Task",
          owner: "Test Owner",
          ownerEmail: "test@test.com",
          progress: "In Progress",
          priority: "Medium",
          creationDate: "2026-04-10",
          tags: ["vitest", "test"],
          taskLink: "https://tasks.example.com/T999999999",
        },
      ],
    });

    expect(result.success).toBe(true);
    expect(result.itemsSynced).toBe(3);
  });
});
