import { createRouter } from '../createRouter';
import { playerRouter } from './player';
import superjson from 'superjson';

export const appRouter = createRouter()
  .transformer(superjson)
  .query('healthz', {
    async resolve() {
      return 'yay!';
    },
  })
  .merge('player.', playerRouter);

export type AppRouter = typeof appRouter;
