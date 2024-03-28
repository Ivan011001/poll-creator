import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const { authorization } = request.headers;
      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('No token provided!');
      }
      const authToken = authorization.replace(/bearer/gim, '').trim();
      const resp = await this.jwtService.verify(authToken);

      request.user = resp;
      return true;
    } catch {
      throw new ForbiddenException('Invalid token!');
    }
  }
}