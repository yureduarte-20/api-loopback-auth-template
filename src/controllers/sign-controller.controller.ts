import {AuthenticationBindings, TokenService, authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  HttpErrors,
  del,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {securityId} from '@loopback/security';
import {TokenServiceBindings} from '../keys';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {BcryptService} from '../services/bcrypt.service';
import {UserProfileWithRole} from '../services/jwt.service';
import {Credentials} from '../services/user.service';
import {Roles} from '../types';

export class SignControllerController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @service(BcryptService)
    public hasherService: BcryptService,
    @inject(TokenServiceBindings.TOKEN_SERVICE) private tokenService: TokenService
  ) { }

  @post('/signup')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id', 'role'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    user.password = await this.hasherService.generateHash(user.password);
    user.role = Roles.USER
    return this.userRepository.create(user);
  }

  @post('/login')
  @response(200, {
    description: 'Login in aplication',
    content: {'application/json': {schema: {properties: {token: {type: 'string'}}}}},
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              email: {
                type: 'string'
              },
              password: {
                type: 'string'
              },

            },
            required: ['email', 'password']
          },
        },
      },
    })
    credentials: Credentials,
  ) {
    const user = await this.userRepository.findOne({where: {email: credentials.email}})
    if (!user) throw new HttpErrors.NotFound('Não encontrado');
    if (!await this.hasherService.compareHash(credentials.password, user.password)) {
      throw new HttpErrors.Unauthorized('Senha incorreta')
    }
    let a: UserProfileWithRole
    const token = await this.tokenService.generateToken({name: user.name, email: user.email, id: user.id, role: user.role, [securityId]: user.id} as UserProfileWithRole)
    return Promise.resolve({token})
  }
  @authenticate("jwt")
  @get('/profile')
  @response(200, {
    description: 'User model instances',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER)
    currUser: UserProfileWithRole,
  ): Promise<User> {
    return this.userRepository.findById(currUser[securityId]);
  }

  @authenticate("jwt")
  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(
    @inject(AuthenticationBindings.CURRENT_USER)
    currUser: UserProfileWithRole,
    @param.path.string('id') id: string): Promise<void> {
    if (currUser[securityId] !== id) throw new HttpErrors.Forbidden('Não autorizado')

    await this.userRepository.deleteById(id);
  }
}
