import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestWithAuth } from './types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: RequestWithAuth = context.switchToHttp().getRequest();

      const { authorization } = request.headers;
      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('No token provided!');
      }
      const authToken = authorization.replace(/bearer/gim, '').trim();
      const resp = await this.jwtService.verify(authToken);

      request.user = {
        userID: resp.sub,
        pollID: resp.pollID,
        name: resp.name,
      };
      return true;
    } catch {
      throw new ForbiddenException('Invalid token!');
    }
  }
}
