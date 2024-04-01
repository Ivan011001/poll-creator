import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsUnauthorizedException } from 'src/exceptions/ws-exception';
import { PollsService } from './polls.service';
import { SocketWithAuth } from './types';

@Injectable()
export class GatewayAdminGuard implements CanActivate {
  constructor(
    private readonly pollsService: PollsService,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket: SocketWithAuth = context.switchToWs().getClient();

    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];

    if (!token) {
      throw new WsUnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify<{ sub: string; pollID: string }>(
        token,
      );

      const { sub, pollID } = payload;

      const poll = await this.pollsService.get(pollID);

      if (sub !== poll.adminID) {
        throw new WsUnauthorizedException('Admin privileges required');
      }

      return true;
    } catch {
      throw new WsUnauthorizedException('Admin privileges required');
    }
  }
}
