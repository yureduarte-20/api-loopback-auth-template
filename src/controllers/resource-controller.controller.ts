// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {get, response} from '@loopback/rest';
import {Roles} from '../types';

// import {inject} from '@loopback/core';

@authenticate("jwt")
export class ResourceControllerController {
  constructor() { }
  @authorize({allowedRoles: [Roles.ADMIN]})
  @get('/admin-resource')
  @response(200, {
    description: 'User model instances',
    content: {
      'application/json': {
        schema: {message: {type: 'string'}},
      },
    },
  })
  async adminResource(
  ): Promise<any> {
    return {message: 'Admin Resource'};
  }

  @authorize({allowedRoles: [Roles.USER]})
  @get('/user-resource')
  @response(200, {
    description: 'User model instances',
    content: {
      'application/json': {
        schema: {message: {type: 'string'}},
      },
    },
  })
  async userResource(
  ): Promise<any> {
    return {message: 'User Resource'};
  }


}
