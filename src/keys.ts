import {TokenService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {BcryptService} from './services/bcrypt.service';
import {MyUserService} from './services/user.service';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'secret_alpha';
  export const TOKEN_EXPIRES_IN_VALUE = `${60 * 60 * 60}`;
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}
export namespace BcryptServiceBindings {
  export const HASHER_KEY = BindingKey.create<BcryptService>('services.hasher.bcrypt')
}
export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<MyUserService>('services.user')
}
