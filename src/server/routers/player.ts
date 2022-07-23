import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';

const defaultPlayerSelect = Prisma.validator<Prisma.PlayerSelect>()({
  id: true,
  name: true,
});

export const playerRouter = createRouter()
  // create
  .mutation('add', {
    input: z.object({
      name: z.string().min(1).max(32),
    }),
    async resolve({ input }) {
      const player = await prisma.player.create({
        data: input,
        select: defaultPlayerSelect,
      });
      return player;
    },
  })
  .query('all', {
    async resolve() {
      return prisma.player.findMany({
        select: defaultPlayerSelect,
      });
    },
  })
  .query('byId', {
    input: z.object({ id: z.string() }),
    async resolve({ input }) {
      const { id } = input;
      const player = await prisma.player.findUnique({
        where: { id },
        select: defaultPlayerSelect,
      });
      if (!player) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No player with id '${id}'`,
        });
      }
      return player;
    },
  })
  .mutation('edit', {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        name: z.string().min(1).max(32).optional(),
      }),
    }),
    async resolve({ input }) {
      const { id, data } = input;
      const player = await prisma.player.update({
        where: { id },
        data,
        select: defaultPlayerSelect,
      });
      return player;
    },
  })
  .mutation('delete', {
    input: z.object({ id: z.string() }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.player.delete({ where: { id } });
      return { id };
    },
  });
