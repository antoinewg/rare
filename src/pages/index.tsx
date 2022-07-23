import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import Link from 'next/link';

const IndexPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const playersQuery = trpc.useQuery(['player.all']);
  const addPlayer = trpc.useMutation('player.add', {
    async onSuccess() {
      // refetches players after a player is added
      await utils.invalidateQueries(['player.all']);
    },
  });

  return (
    <>
      <h1>List of players</h1>
      <h2>
        Players
        {playersQuery.status === 'loading' && '...'}
      </h2>
      {playersQuery.data?.map((item) => (
        <article key={item.id}>
          <h3>{item.name}</h3>
          <Link href={`/player/${item.id}`}>
            <a>View more</a>
          </Link>
        </article>
      ))}

      <hr />

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const $name: HTMLInputElement = (e as any).target.elements.name;
          try {
            await addPlayer.mutateAsync({ name: $name.value });
            $name.value = '';
          } catch {}
        }}
      >
        <label htmlFor="name">Name:</label>
        <br />
        <input
          id="name"
          name="name"
          type="text"
          disabled={addPlayer.isLoading}
        />

        <br />
        <input type="submit" disabled={addPlayer.isLoading} />
        {addPlayer.error && (
          <p style={{ color: 'red' }}>{addPlayer.error.message}</p>
        )}
      </form>
    </>
  );
};

export default IndexPage;
