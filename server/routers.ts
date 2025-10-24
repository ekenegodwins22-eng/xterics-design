import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getAllServices, getServiceById, createOrder, getUserOrders, createCustomOrder, getUserCustomOrders } from "./db";

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
  }),
});

export type AppRouter = typeof appRouter;

