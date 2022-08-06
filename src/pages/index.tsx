import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import NextLink from 'next/link';
import { Button, Input, Grid, Card, Col, Row, Text } from '@nextui-org/react';
import { SendButton } from '~/atoms/SendButton';
import { SendIcon } from '~/atoms/SendIcon';
import { FormEvent } from 'react';

const IndexPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const playersQuery = trpc.useQuery(['player.all']);

  const addPlayer = trpc.useMutation('player.add', {
    onSuccess: async () => await utils.invalidateQueries(['player.all']),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const $name: HTMLInputElement = (e as any).target.elements.name;
    try {
      await addPlayer.mutateAsync({ name: $name.value });
      $name.value = '';
    } catch {}
  };

  return (
    <>
      <h1>List of players</h1>
      <h2>
        Players
        {playersQuery.status === 'loading' && '...'}
      </h2>

      <div style={{ padding: 24 }}>
        <form onSubmit={handleSubmit}>
          <Input
            id="name"
            contentRightStyling={false}
            placeholder="Name..."
            type="text"
            disabled={addPlayer.isLoading}
            contentRight={
              <SendButton type="submit" disabled={addPlayer.isLoading}>
                <SendIcon fill="#fff" />
              </SendButton>
            }
            helperText={addPlayer.error?.message ?? ''}
            helperColor="error"
          />
        </form>
      </div>

      <Grid.Container gap={2} justify="center">
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
                borderTop:
                  '$borderWeights$light solid rgba(255, 255, 255, 0.2)',
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
      </Grid.Container>
    </>
  );
};

export default IndexPage;
