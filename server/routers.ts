import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getAllTickets,
  getAllTests,
  getAllTasks,
  getLastSync,
  upsertTicket,
  bulkUpsertTickets,
  bulkUpsertTests,
  bulkUpsertTasks,
  logSync,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  dashboard: router({
    /** Get all tickets */
    tickets: publicProcedure.query(async () => {
      return getAllTickets();
    }),

    /** Get all tests */
    tests: publicProcedure.query(async () => {
      return getAllTests();
    }),

    /** Get all tasks */
    tasks: publicProcedure.query(async () => {
      const rawTasks = await getAllTasks();
      // Parse the JSON tags field back into an array
      return rawTasks.map(t => ({
        ...t,
        tags: t.tags ? JSON.parse(t.tags) : [],
      }));
    }),

    /** Get last sync info */
    lastSync: publicProcedure.query(async () => {
      return getLastSync();
    }),

    /** Create a single ticket manually */
    createTicket: publicProcedure
      .input(
        z.object({
          externalId: z.string(),
          type: z.string().default("manual"),
          subject: z.string().optional(),
          issue: z.string(),
          status: z.string().default("Open"),
          client: z.string().optional(),
          clientEmail: z.string().optional(),
          clientCompany: z.string().optional(),
          priority: z.string().default("Medium"),
          snippet: z.string().optional(),
          gmailLink: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await upsertTicket({
          ...input,
          firstDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          lastActivity: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          messageCount: 1,
        });
        return { success: true };
      }),

    /** Seed / sync data — accepts arrays of tickets, tests, tasks */
    sync: publicProcedure
      .input(
        z.object({
          tickets: z.array(
            z.object({
              externalId: z.string(),
              type: z.string(),
              subject: z.string().optional(),
              issue: z.string().optional(),
              status: z.string().default("Open"),
              client: z.string().optional(),
              clientEmail: z.string().optional(),
              clientCompany: z.string().optional(),
              firstDate: z.string().optional(),
              lastActivity: z.string().optional(),
              messageCount: z.number().optional(),
              priority: z.string().optional(),
              snippet: z.string().optional(),
              gmailLink: z.string().optional(),
            })
          ).optional(),
          tests: z.array(
            z.object({
              externalId: z.string(),
              subject: z.string().optional(),
              testType: z.string().optional(),
              status: z.string().default("Active"),
              brand: z.string().optional(),
              client: z.string().optional(),
              clientEmail: z.string().optional(),
              firstDate: z.string().optional(),
              lastActivity: z.string().optional(),
              messageCount: z.number().optional(),
              snippet: z.string().optional(),
              gmailLink: z.string().optional(),
            })
          ).optional(),
          tasks: z.array(
            z.object({
              taskNumber: z.string(),
              title: z.string().optional(),
              owner: z.string().optional(),
              ownerEmail: z.string().optional(),
              progress: z.string().optional(),
              priority: z.string().optional(),
              creationDate: z.string().optional(),
              tags: z.array(z.string()).optional(),
              taskLink: z.string().optional(),
            })
          ).optional(),
        })
      )
      .mutation(async ({ input }) => {
        let totalItems = 0;

        if (input.tickets && input.tickets.length > 0) {
          await bulkUpsertTickets(input.tickets);
          totalItems += input.tickets.length;
        }

        if (input.tests && input.tests.length > 0) {
          await bulkUpsertTests(input.tests);
          totalItems += input.tests.length;
        }

        if (input.tasks && input.tasks.length > 0) {
          const tasksWithJsonTags = input.tasks.map(t => ({
            ...t,
            tags: t.tags ? JSON.stringify(t.tags) : undefined,
          }));
          await bulkUpsertTasks(tasksWithJsonTags);
          totalItems += input.tasks.length;
        }

        await logSync("full", totalItems, "success");

        return { success: true, itemsSynced: totalItems };
      }),
  }),
});

export type AppRouter = typeof appRouter;
