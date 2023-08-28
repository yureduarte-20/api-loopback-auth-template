import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {randomBytes} from 'crypto';
import {AuthJwtApplication} from '../..';
import {User} from '../../models';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new AuthJwtApplication({
    rest: restConfig,
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: AuthJwtApplication;
  client: Client;
}

export function givenUserInstance(user?: Partial<User>): Partial<User> {
  return Object.assign<Partial<User>, Partial<User>>({
    email: `${randomBytes(5).toString('hex')}@email.com`,
    password: randomBytes(4).toString('hex'),
    name: randomBytes(4).toString('hex')
  }, user ?? {})
}
