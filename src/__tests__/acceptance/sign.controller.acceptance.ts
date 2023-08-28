import {Client, expect} from '@loopback/testlab';
import {AuthJwtApplication} from '../..';
import {BcryptServiceBindings} from '../../keys';
import {UserRepository} from '../../repositories';
import {BcryptService} from '../../services/bcrypt.service';
import {Roles} from '../../types';
import {givenUserInstance, setupApplication} from './test-helper';

describe('Sign Controller', () => {
  let app: AuthJwtApplication;
  let client: Client;
  let hasher: BcryptService
  let userRepository: UserRepository;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    hasher = await app.get<BcryptService>(BcryptServiceBindings.HASHER_KEY)
    userRepository = await app.getRepository(UserRepository);
  });

  after(async () => {
    await app.stop();
  });


  it('Creates a user', async function () {
    const user = givenUserInstance()
    const response = await client
      .post('/signup')
      .send(user)
      .expect(200);

    expect(response.body).containDeep(
      {email: user.email, name: user.name, role: Roles.USER}
    )
    expect(await userRepository.findById(response.body.id)).containDeep(
      {name: response.body.name, email: response.body.email, id: response.body.id, role: Roles.USER}
    )

  })
  beforeEach(async () => {
    await userRepository.deleteAll()
  })
  it('login', async function () {
    const user = givenUserInstance()
    const response404 = await client
      .post('/login')
      .send({email: user.email, password: user.password})
      .expect(404);

    const response = await client
      .post('/signup')
      .send(user)
      .expect(200);
    expect(response.body).containDeep(
      {email: user.email, name: user.name, role: Roles.USER}
    )
    expect(await userRepository.findById(response.body.id)).containDeep(
      {name: response.body.name, email: response.body.email, id: response.body.id, role: Roles.USER}
    )
    const responseToken = await client
      .post('/login')
      .send({email: user.email, password: user.password})
      .expect(200);

    expect(responseToken.body).hasOwnProperty('token')
  })



});
