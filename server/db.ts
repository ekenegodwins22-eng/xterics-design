import { eq, and } from "drizzle-orm";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, services, orders, customOrders, InsertOrder, InsertCustomOrder, portfolioProjects, portfolioImages, InsertPortfolioProject, InsertPortfolioImage } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      // Parse the database URL and remove SSL query parameter
      const url = new URL(process.env.DATABASE_URL);
      url.searchParams.delete('ssl');
      const dbUrl = url.toString();
      
      // Create pool with proper SSL config for TiDB Cloud
      const pool = mysql.createPool({
        uri: dbUrl,
        ssl: {},
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      
      _db = drizzle(pool);
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

// ============ Services ============

export async function getAllServices() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(services).where(eq(services.isActive, true));
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ Orders ============

export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(orders).values(order);
  return result;
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(orders).where(eq(orders.userId, userId));
}

export async function updateOrderStatus(orderId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(orders).set({ status: status as any }).where(eq(orders.id, orderId));
}

// ============ Custom Orders ============

export async function createCustomOrder(customOrder: InsertCustomOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(customOrders).values(customOrder);
  return result;
}

export async function getCustomOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(customOrders).where(eq(customOrders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserCustomOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(customOrders).where(eq(customOrders.userId, userId));
}

export async function updateCustomOrderStatus(customOrderId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(customOrders).set({ status: status as any }).where(eq(customOrders.id, customOrderId));
}

// ============ Portfolio ============

export async function getAllPortfolioProjects() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(portfolioProjects).where(eq(portfolioProjects.isPublished, true));
}

export async function getFeaturedPortfolioProjects(limit: number = 4) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(portfolioProjects)
    .where(and(eq(portfolioProjects.isPublished, true), eq(portfolioProjects.isFeatured, true)))
    .limit(limit);
}

export async function getPortfolioProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(portfolioProjects).where(eq(portfolioProjects.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPortfolioImagesForProject(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(portfolioImages).where(eq(portfolioImages.projectId, projectId));
}

export async function createPortfolioProject(project: InsertPortfolioProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(portfolioProjects).values(project);
  return result;
}

export async function updatePortfolioProject(projectId: number, updates: Partial<InsertPortfolioProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(portfolioProjects).set(updates).where(eq(portfolioProjects.id, projectId));
}

export async function deletePortfolioProject(projectId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Delete images first
  await db.delete(portfolioImages).where(eq(portfolioImages.projectId, projectId));
  // Then delete project
  return await db.delete(portfolioProjects).where(eq(portfolioProjects.id, projectId));
}

export async function addPortfolioImage(image: InsertPortfolioImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(portfolioImages).values(image);
}

export async function deletePortfolioImage(imageId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(portfolioImages).where(eq(portfolioImages.id, imageId));
}

