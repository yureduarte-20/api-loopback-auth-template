import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer} from '@loopback/authorization';
import {Provider} from '@loopback/core';

export class AuthorizationProvider implements Provider<Authorizer>{
  value(): Authorizer {
    return this.authorize.bind(this)
  }
  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ) {
    const clientRole = authorizationCtx.principals[0].role;
    const allowedRoles = metadata.allowedRoles;
    if (!allowedRoles) return AuthorizationDecision.DENY
    return allowedRoles.includes(clientRole)
      ? AuthorizationDecision.ALLOW
      : AuthorizationDecision.DENY;
  }
}
