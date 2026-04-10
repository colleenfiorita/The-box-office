import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Support tickets / cases tracked from Gmail
 */
export const tickets = mysqlTable("tickets", {
  id: int("id").autoincrement().primaryKey(),
  externalId: varchar("externalId", { length: 128 }).notNull(),
  type: varchar("type", { length: 32 }).notNull(),
  subject: text("subject"),
  issue: text("issue"),
  status: varchar("status", { length: 32 }).notNull().default("Open"),
  client: varchar("client", { length: 255 }),
  clientEmail: varchar("clientEmail", { length: 320 }),
  clientCompany: varchar("clientCompany", { length: 255 }),
  firstDate: varchar("firstDate", { length: 32 }),
  lastActivity: varchar("lastActivity", { length: 32 }),
  messageCount: int("messageCount").default(0),
  priority: varchar("priority", { length: 32 }).default("Medium"),
  snippet: text("snippet"),
  gmailLink: text("gmailLink"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = typeof tickets.$inferInsert;

/**
 * Tests & experiments tracked from Gmail
 */
export const tests = mysqlTable("tests", {
  id: int("id").autoincrement().primaryKey(),
  externalId: varchar("externalId", { length: 128 }).notNull(),
  subject: text("subject"),
  testType: varchar("testType", { length: 64 }),
  status: varchar("status", { length: 32 }).notNull().default("Active"),
  brand: varchar("brand", { length: 255 }),
  client: varchar("client", { length: 255 }),
  clientEmail: varchar("clientEmail", { length: 320 }),
  firstDate: varchar("firstDate", { length: 32 }),
  lastActivity: varchar("lastActivity", { length: 32 }),
  messageCount: int("messageCount").default(0),
  snippet: text("snippet"),
  gmailLink: text("gmailLink"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Test = typeof tests.$inferSelect;
export type InsertTest = typeof tests.$inferInsert;

/**
 * Open tasks from internal task systems
 */
export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  taskNumber: varchar("taskNumber", { length: 64 }).notNull(),
  title: text("title"),
  owner: varchar("owner", { length: 255 }),
  ownerEmail: varchar("ownerEmail", { length: 320 }),
  progress: varchar("progress", { length: 32 }),
  priority: varchar("priority", { length: 32 }),
  creationDate: varchar("creationDate", { length: 32 }),
  tags: text("tags"),
  taskLink: text("taskLink"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

/**
 * Sync metadata - tracks when data was last refreshed
 */
export const syncLog = mysqlTable("syncLog", {
  id: int("id").autoincrement().primaryKey(),
  syncType: varchar("syncType", { length: 32 }).notNull(),
  syncedAt: timestamp("syncedAt").defaultNow().notNull(),
  itemCount: int("itemCount").default(0),
  status: varchar("status", { length: 32 }).default("success"),
  details: text("details"),
});

export type SyncLog = typeof syncLog.$inferSelect;
export type InsertSyncLog = typeof syncLog.$inferInsert;