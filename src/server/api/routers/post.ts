import { z } from 'zod'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc'
import { posts } from '~/server/db/schema'

export const postRouter = createTRPCRouter({
  hello: publicProcedure.input(z.object({ text: z.string() })).query(({ input }) => {
    return {
      greeting: `Hello ${input.text}`,
    }
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id) {
        await ctx.db.insert(posts).values({
          name: input.name,
          createdById: ctx.session.user.id,
        })
      }
      return '创建失败。'
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    try {
      const post = await ctx.db.query.posts.findFirst({
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      })
      return post ?? null
    } catch (e) {
      console.log(e)
      return null
    }
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return 'you can now see this secret message!'
  }),
})