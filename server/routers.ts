import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getAllServices, getServiceById, createOrder, getUserOrders, createCustomOrder, getUserCustomOrders, updateOrderStatus, updateCustomOrderStatus, getAllPortfolioProjects, getFeaturedPortfolioProjects, getPortfolioProjectById, getPortfolioImagesForProject, createPortfolioProject, updatePortfolioProject, deletePortfolioProject, addPortfolioImage, deletePortfolioImage } from "./db";
import { getDb } from "./db";
import { orders, customOrders, portfolioProjects, portfolioImages } from "../drizzle/schema";

const ADMIN_EMAIL = "whestwhest5@gmail.com";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ Services ============
  services: router({
    list: publicProcedure.query(async () => {
      return await getAllServices();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getServiceById(input.id);
      }),
  }),

  // ============ Orders ============
  orders: router({
    create: publicProcedure
      .input(z.object({
        serviceId: z.number(),
        clientName: z.string().min(1),
        clientEmail: z.string().email(),
        description: z.string().min(10),
      }))
      .mutation(async ({ input, ctx }) => {
        const service = await getServiceById(input.serviceId);
        if (!service) {
          throw new Error("Service not found");
        }

        const order = await createOrder({
          userId: ctx.user?.id || 0,
          serviceId: input.serviceId,
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          description: input.description,
          price: service.price,
          status: "pending",
        });

        return order;
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserOrders(ctx.user.id);
    }),

    getAllOrders: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.email !== ADMIN_EMAIL) {
        throw new Error("Unauthorized");
      }
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(orders);
    }),

    updateStatus: protectedProcedure
      .input(z.object({ orderId: z.number(), status: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.email !== ADMIN_EMAIL) {
          throw new Error("Unauthorized");
        }
        return await updateOrderStatus(input.orderId, input.status);
      }),
  }),

  // ============ Custom Orders ============
  customOrders: router({
    create: publicProcedure
      .input(z.object({
        clientName: z.string().min(1),
        clientEmail: z.string().email(),
        description: z.string().min(10),
        budget: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const customOrder = await createCustomOrder({
          userId: ctx.user?.id,
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          description: input.description,
          budget: input.budget,
          status: "pending",
        });

        return customOrder;
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserCustomOrders(ctx.user.id);
    }),

    getAllCustomOrders: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.email !== ADMIN_EMAIL) {
        throw new Error("Unauthorized");
      }
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(customOrders);
    }),

    updateStatus: protectedProcedure
      .input(z.object({ customOrderId: z.number(), status: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.email !== ADMIN_EMAIL) {
          throw new Error("Unauthorized");
        }
        return await updateCustomOrderStatus(input.customOrderId, input.status);
      }),
  }),

  // ============ Portfolio ============
  portfolio: router({
    list: publicProcedure.query(async () => {
      return await getAllPortfolioProjects();
    }),

    featured: publicProcedure.query(async () => {
      return await getFeaturedPortfolioProjects(4);
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const project = await getPortfolioProjectById(input.id);
        if (!project) return null;
        const images = await getPortfolioImagesForProject(input.id);
        return { ...project, images };
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        category: z.string().min(1),
        price: z.number().optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.email !== ADMIN_EMAIL) {
          throw new Error("Unauthorized");
        }
        return await createPortfolioProject({
          title: input.title,
          description: input.description || null,
          category: input.category,
          price: input.price || null,
          isFeatured: input.isFeatured || false,
          isPublished: true,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        price: z.number().optional(),
        isFeatured: z.boolean().optional(),
        isPublished: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.email !== ADMIN_EMAIL) {
          throw new Error("Unauthorized");
        }
        const { id, ...updates } = input;
        return await updatePortfolioProject(id, updates);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.email !== ADMIN_EMAIL) {
          throw new Error("Unauthorized");
        }
        return await deletePortfolioProject(input.id);
      }),

    addImage: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        imageUrl: z.string(),
        imageKey: z.string(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.email !== ADMIN_EMAIL) {
          throw new Error("Unauthorized");
        }
        return await addPortfolioImage({
          projectId: input.projectId,
          imageUrl: input.imageUrl,
          imageKey: input.imageKey,
          displayOrder: input.displayOrder || 0,
        });
      }),

    deleteImage: protectedProcedure
      .input(z.object({ imageId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.email !== ADMIN_EMAIL) {
          throw new Error("Unauthorized");
        }
        return await deletePortfolioImage(input.imageId);
      }),
  }),
});

export type AppRouter = typeof appRouter;

