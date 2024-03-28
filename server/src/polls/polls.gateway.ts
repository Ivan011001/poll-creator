import { Logger } from '@nestjs/common';
import { PollsService } from './polls.service';
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Namespace } from 'socket.io';

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

  handleConnection(client: Socket) {
    const sockets = this.io.sockets;

    this.logger.log(`New connection is: ${client.id}`);
    this.logger.log(`Number of connected sockets: ${sockets.size}`);

    this.io.emit('hello', `from ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;

    this.logger.log(`Disconnection is: ${client.id}`);
    this.logger.log(`Number of connected sockets: ${sockets.size}`);
  }
}
