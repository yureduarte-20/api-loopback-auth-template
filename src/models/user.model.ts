import {Entity, model, property} from '@loopback/repository';
import {Roles} from '../types';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;
  @property({
    type: 'string',
    required: true,
  })
  name: string;


  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    hidden: true
  })
  password: string;

  @property({
    type: 'string',
    default: Roles.USER
  })
  role: string;

  @property({type: 'date', defaultFn: 'now'})
  createdAt?: string

  @property({type: 'string', defaultFn: 'uuid'})
  testField: string
  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
