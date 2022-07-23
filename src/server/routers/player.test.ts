import { createContextInner } from '../context';
import { appRouter } from './_app';
import { inferMutationInput } from '~/utils/trpc';

test('add and get player', async () => {
  const ctx = await createContextInner({});
  const caller = appRouter.createCaller(ctx);

  const input: inferMutationInput<'player.add'> = { name: 'player 1' };
  const player = await caller.mutation('player.add', input);
  const byId = await caller.query('player.byId', { id: player.id });

  expect(byId).toMatchObject(input);
});
