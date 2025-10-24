import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

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
  /** Google OAuth identifier (sub) returned from the OAuth callback. Unique per user. */
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
 * Services table - stores available graphic design services
 */
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: int("price").notNull(), // Price in cents (e.g., 5000 = $50.00)
  category: varchar("category", { length: 100 }).notNull(), // e.g., "logo", "branding", "social-media"
  image: varchar("image", { length: 500 }), // URL to service image
  features: text("features"), // JSON array of features
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Orders table - stores customer orders for services
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Foreign key to users
  serviceId: int("serviceId").notNull(), // Foreign key to services
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientEmail: varchar("clientEmail", { length: 320 }).notNull(),
  description: text("description").notNull(), // Detailed description of what client wants
  price: int("price").notNull(), // Price in cents
  status: mysqlEnum("status", ["pending", "paid", "in-progress", "completed", "cancelled"]).default("pending").notNull(),
  paymentId: varchar("paymentId", { length: 255 }), // Stripe or payment processor ID
  notes: text("notes"), // Admin notes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * CustomOrders table - stores custom order requests
 */
export const customOrders = mysqlTable("customOrders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // Foreign key to users (nullable for guest orders)
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientEmail: varchar("clientEmail", { length: 320 }).notNull(),
  description: text("description").notNull(), // Detailed custom requirements
  budget: int("budget"), // Budget in cents (optional)
  status: mysqlEnum("status", ["pending", "quoted", "accepted", "in-progress", "completed", "cancelled"]).default("pending").notNull(),
  quotedPrice: int("quotedPrice"), // Price quoted by admin
  paymentId: varchar("paymentId", { length: 255 }), // Payment processor ID
  notes: text("notes"), // Admin notes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomOrder = typeof customOrders.$inferSelect;
export type InsertCustomOrder = typeof customOrders.$inferInsert;

