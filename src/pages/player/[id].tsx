import NextError from 'next/error';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '~/pages/_app';
import { trpc } from '~/utils/trpc';

const PlayerViewPage: NextPageWithLayout = () => {
  const id = useRouter().query.id as string;
  const playerQuery = trpc.useQuery(['player.byId', { id }]);

  if (playerQuery.error) {
    return (
      <NextError
        title={playerQuery.error.message}
        statusCode={playerQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (playerQuery.status !== 'success') {
    return <>Loading...</>;
  }
  const { data } = playerQuery;
  return (
    <>
      <h1>{data.name}</h1>

      <h2>Raw data:</h2>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </>
  );
};

export default PlayerViewPage;
