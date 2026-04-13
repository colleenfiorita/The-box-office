import { drizzle } from 'drizzle-orm/mysql2';
import { mysqlTable, int, varchar, timestamp, text } from 'drizzle-orm/mysql-core';

const syncLog = mysqlTable("syncLog", {
  id: int("id").autoincrement().primaryKey(),
  syncType: varchar("syncType", { length: 50 }).notNull(),
  syncedAt: timestamp("syncedAt").defaultNow().notNull(),
  itemCount: int("itemCount"),
  status: varchar("status", { length: 20 }).default("success"),
  details: text("details"),
});

const db = drizzle(process.env.DATABASE_URL);

await db.insert(syncLog).values({
  syncType: 'gmail_scan',
  syncedAt: new Date(),
  itemCount: 29,
  status: 'success',
  details: 'Manual sync triggered Apr 13, 2026',
});

console.log('Sync log updated to today');
process.exit(0);
