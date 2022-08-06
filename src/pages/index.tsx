import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import NextLink from 'next/link';
import { Button, Card, Col, Row, Text } from '@nextui-org/react';

const IndexPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const playersQuery = trpc.useQuery(['player.all']);

  const addPlayer = trpc.useMutation('player.add', {
    onSuccess: async () => await utils.invalidateQueries(['player.all']),
  });

  return (
    <>
      <h1>List of players</h1>
      <h2>
        Players
        {playersQuery.status === 'loading' && '...'}
      </h2>
      {playersQuery.data?.map((item, index) => (
        <Card key={item.id} css={{ maxWidth: 260, m: 24 }}>
          <Card.Header css={{ position: 'absolute', zIndex: 1, top: 5 }}>
            <Col>
              <Text h4 color="white" weight="bold" transform="uppercase">
                {item.name}
              </Text>
            </Col>
          </Card.Header>
          <Card.Image
            src={`https://nextui.org/images/card-example-${
              1 + (index % 3)
            }.jpeg`}
            objectFit="cover"
            width="100%"
            height={420}
            alt={item.name}
          />
          <Card.Footer
            isBlurred
            css={{
              position: 'absolute',
              bgBlur: '#ffffff66',
              borderTop: '$borderWeights$light solid rgba(255, 255, 255, 0.2)',
              bottom: 0,
              zIndex: 1,
            }}
          >
            <Row>
              <Col>
                <Text color="#000" size={12}>
                  Available soon.
                </Text>
                <Text color="#000" size={12}>
                  Get notified.
                </Text>
              </Col>
              <Col>
                <Row justify="flex-end">
                  <NextLink href={`/player/${item.id}`}>
                    <Button flat auto rounded color="default">
                      <Text
                        css={{ color: 'inherit' }}
                        size={12}
                        weight="bold"
                        transform="uppercase"
                      >
                        View more
                      </Text>
                    </Button>
                  </NextLink>
                </Row>
              </Col>
            </Row>
          </Card.Footer>
        </Card>
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
