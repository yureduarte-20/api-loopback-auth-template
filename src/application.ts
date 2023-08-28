import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {AuthorizationComponent, AuthorizationDecision, AuthorizationOptions, AuthorizationTags} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {JWTAuthenticationStrategy} from './authentication-strategy/jwt.strategy';
import {BcryptServiceBindings, TokenServiceBindings, TokenServiceConstants, UserServiceBindings} from './keys';

import {SECURITY_SCHEME_SPEC} from './api-spects';
import {AuthorizationProvider} from './providers/AuthorizationProvider.provider';
import {MySequence} from './sequence';
import {BcryptService} from './services/bcrypt.service';
import {JWTService} from './services/jwt.service';
import {MyUserService} from './services/user.service';

export {ApplicationConfig};

export class AuthJwtApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.addSecuritySpec()
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(TokenServiceConstants.TOKEN_SECRET_VALUE)
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE)
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService)
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService)
    //this.addSecuritySpec()
    this.component(RestExplorerComponent);
    this.component(AuthenticationComponent);
    const AuthorizeOptions: AuthorizationOptions = {
      precedence: AuthorizationDecision.DENY,
      defaultDecision: AuthorizationDecision.DENY,
    };

    const binding = this.component(AuthorizationComponent);
    this.configure(binding.key).to(AuthorizeOptions);

    this
      .bind('authorizationProviders.my-authorizer-provider')
      .toProvider(AuthorizationProvider)
      .tag(AuthorizationTags.AUTHORIZER);
    this.component(JWTAuthenticationStrategy);
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);
    this.service(BcryptService, BcryptServiceBindings.HASHER_KEY)

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
  addSecuritySpec(): void {
    this.api({
      openapi: '3.0.0',
      info: {
        title: 'access-control-example',
        version: require('.././package.json').version,
      },
      paths: {},
      components: {securitySchemes: SECURITY_SCHEME_SPEC},
      security: [
        {
          jwt: [],
        },
      ],
      servers: [{url: '/'}],
    });
  }
}
