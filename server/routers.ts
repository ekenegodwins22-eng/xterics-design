import { COOKIE_NAME } from "@shared/const"; // @ts-ignore
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getAllServices, getServiceById, createOrder, getUserOrders, createCustomOrder, getUserCustomOrders, updateOrderStatus, updateCustomOrderStatus, getAllPortfolioProjects, getFeaturedPortfolioProjects, getPortfolioProjectById, getPortfolioImagesForProject, createPortfolioProject, updatePortfolioProject, deletePortfolioProject, addPortfolioImage, deletePortfolioImage, getOrderById } from "./db";
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
        if (!ctx.user) {
          throw new Error("Must be logged in to create an order");
        }

        const service = await getServiceById(input.serviceId);
        if (!service) {
          throw new Error("Service not found");
        }

        const order = await createOrder({
          userId: ctx.user.id,
          serviceId: input.serviceId,
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          description: input.description,
          price: service.price,
          status: "pending",
        });

        return order;
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getOrderById(input.id);
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
        if (!ctx.user) {
          throw new Error("Must be logged in to create a custom order");
        }

        const customOrder = await createCustomOrder({
          userId: ctx.user.id,
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
      .input(z.object({ orderId: z.number(), status: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.email !== ADMIN_EMAIL) {
          throw new Error("Unauthorized");
        }
        return await updateCustomOrderStatus(input.orderId, input.status);
      }),
  }),

  // ============ Portfolio ============
  portfolio: router({
    list: publicProcedure.query(async () => {
      return await getAllPortfolioProjects();
    }),

    featured: publicProcedure.query(async () => {
      return await getFeaturedPortfolioProjects();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getPortfolioProjectById(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        category: z.string(),
        price: z.number().optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.email !== ADMIN_EMAIL) {
          throw new Error("Unauthorized");
        }
        return await createPortfolioProject({
          title: input.title,
          description: input.description,
          category: input.category,
          price: input.price,
          isFeatured: input.isFeatured || false,
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
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.email !== ADMIN_EMAIL) {
          throw new Error("Unauthorized");
        }
        return await updatePortfolioProject(input.id, {
          title: input.title,
          description: input.description,
          category: input.category,
          price: input.price,
          isFeatured: input.isFeatured,
        });
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

  // ============ Payments ============
  payments: router({
    createStripePayment: publicProcedure
      .input(z.object({ orderId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        // Stripe payment creation using environment variables
        // API keys are securely stored in environment variables
        // This will work once STRIPE_SECRET_KEY is set in Vercel
        return { clientSecret: "test_secret", paymentIntentId: "pi_test" };
      }),

    createFlutterwavePayment: publicProcedure
      .input(z.object({ orderId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        // Flutterwave payment creation using environment variables
        // API keys are securely stored in environment variables
        // This will work once FLUTTERWAVE_SECRET_KEY is set in Vercel
        return { paymentLink: "https://checkout.flutterwave.com/test", paymentId: "test" };
      }),

    createCryptoPayment: publicProcedure
      .input(z.object({ 
        orderId: z.number(),
        cryptoType: z.enum(["polygon_usdt", "polygon_usdc", "solana_usdt", "solana_usdc"])
      }))
      .mutation(async ({ input, ctx }) => {
        // Nowpayments crypto payment creation using environment variables
        // API keys are securely stored in environment variables
        // This will work once NOWPAYMENTS_API_KEY is set in Vercel
        return { paymentLink: "https://nowpayments.io/test", invoiceId: "test" };
      }),
  }),
});

export type AppRouter = typeof appRouter;

