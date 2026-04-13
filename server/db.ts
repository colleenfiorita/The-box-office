import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, tickets, tests, tasks, syncLog, InsertTicket, InsertTest, InsertTask } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ Ticket Queries ============

export async function getAllTickets() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tickets).orderBy(desc(tickets.lastActivity));
}

export async function upsertTicket(ticket: InsertTicket) {
  const db = await getDb();
  if (!db) return;
  
  const existing = await db.select().from(tickets).where(eq(tickets.externalId, ticket.externalId)).limit(1);
  
  if (existing.length > 0) {
    await db.update(tickets).set({
      subject: ticket.subject,
      issue: ticket.issue,
      status: ticket.status,
      client: ticket.client,
      clientEmail: ticket.clientEmail,
      clientCompany: ticket.clientCompany,
      lastActivity: ticket.lastActivity,
      messageCount: ticket.messageCount,
      priority: ticket.priority,
      snippet: ticket.snippet,
      gmailLink: ticket.gmailLink,
    }).where(eq(tickets.externalId, ticket.externalId));
  } else {
    await db.insert(tickets).values(ticket);
  }
}

export async function bulkUpsertTickets(ticketList: InsertTicket[]) {
  for (const ticket of ticketList) {
    await upsertTicket(ticket);
  }
}

// ============ Test Queries ============

export async function getAllTests() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tests).orderBy(desc(tests.lastActivity));
}

export async function upsertTest(test: InsertTest) {
  const db = await getDb();
  if (!db) return;
  
  const existing = await db.select().from(tests).where(eq(tests.externalId, test.externalId)).limit(1);
  
  if (existing.length > 0) {
    await db.update(tests).set({
      subject: test.subject,
      testType: test.testType,
      status: test.status,
      brand: test.brand,
      client: test.client,
      clientEmail: test.clientEmail,
      lastActivity: test.lastActivity,
      messageCount: test.messageCount,
      snippet: test.snippet,
      gmailLink: test.gmailLink,
    }).where(eq(tests.externalId, test.externalId));
  } else {
    await db.insert(tests).values(test);
  }
}

export async function bulkUpsertTests(testList: InsertTest[]) {
  for (const test of testList) {
    await upsertTest(test);
  }
}

export async function clearAllTests() {
  const db = await getDb();
  if (!db) return;
  await db.delete(tests);
}

export async function replaceAllTests(testList: InsertTest[]) {
  await clearAllTests();
  for (const test of testList) {
    await upsertTest(test);
  }
}

// ============ Task Queries ============

export async function getAllTasks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tasks).orderBy(desc(tasks.createdAt));
}

export async function upsertTask(task: InsertTask) {
  const db = await getDb();
  if (!db) return;
  
  const existing = await db.select().from(tasks).where(eq(tasks.taskNumber, task.taskNumber)).limit(1);
  
  if (existing.length > 0) {
    await db.update(tasks).set({
      title: task.title,
      owner: task.owner,
      ownerEmail: task.ownerEmail,
      progress: task.progress,
      priority: task.priority,
      tags: task.tags,
      taskLink: task.taskLink,
    }).where(eq(tasks.taskNumber, task.taskNumber));
  } else {
    await db.insert(tasks).values(task);
  }
}

export async function bulkUpsertTasks(taskList: InsertTask[]) {
  for (const task of taskList) {
    await upsertTask(task);
  }
}

// ============ Sync Log Queries ============

export async function getLastSync() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(syncLog).orderBy(desc(syncLog.syncedAt)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function logSync(syncType: string, itemCount: number, status: string = "success", details?: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(syncLog).values({ syncType, itemCount, status, details });
}
