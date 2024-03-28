import { BadRequestException, Logger, UseFilters } from '@nestjs/common';
import { PollsService } from './polls.service';
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { SocketWithAuth } from './types';
import { WsCatchAllException } from 'src/exceptions/ws-catch-all.filter';

@UseFilters(new WsCatchAllException())
@WebSocketGateway({
  namespace: 'polls',
})
export class PollsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(PollsGateway.name);
  constructor(private readonly pollsService: PollsService) {}

  @WebSocketServer() io: Namespace;

  afterInit(): void {
    this.logger.log('Websoket gateway');
  }

  handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    this.logger.debug(
      `Socket connected with userID: ${client.user.userID}, pollID: ${client.user.pollID}, and name:${client.user.name}`,
    );

    this.logger.log(`New connection is: ${client.id}`);
    this.logger.log(`Number of connected sockets: ${sockets.size}`);

    this.io.emit('hello', `from ${client.id}`);
  }

  handleDisconnect(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    this.logger.log(`Disconnection is: ${client.id}`);
    this.logger.log(`Number of connected sockets: ${sockets.size}`);
  }

  @SubscribeMessage('test')
  async test() {
    throw new BadRequestException('Invalid empty data :)');
  }
}
