import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable } from '@nestjs/common';
import { AuthJwtPayload } from '../types/auth-jwt-payload';
import refreshJwtConfig from '../config/refresh-jwt.config';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof refreshJwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguration.secret || 'secret',
      ignoreExpiration: false,
    });
  }

  validate(payload: AuthJwtPayload) {
    //Брать из req токен, убирать беарер из него, и отпарвлять  this.authService.validateRefreshToken(userId, refreshToken);
    return { id: payload.sub };
  }
}