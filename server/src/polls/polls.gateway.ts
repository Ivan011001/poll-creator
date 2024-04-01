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

  async handleConnection(client: SocketWithAuth) {
    // const sockets = this.io.sockets;

    const roomName = client.user.pollID;
    await client.join(roomName);

    // const connectedClients = this.io.adapter.rooms?.get(roomName)?.size ?? 0;

    const updatedPoll = await this.pollsService.add({
      pollID: client.user.pollID,
      userID: client.user.userID,
      name: client.user.name,
    });

    this.io.to(roomName).emit('poll_updated', updatedPoll);
  }

  async handleDisconnect(client: SocketWithAuth) {
    // const sockets = this.io.sockets;

    const { pollID, userID } = client.user;

    const updatedPoll = await this.pollsService.remove(pollID, userID);

    const roomName = client.user.pollID;
    // const connectedClients = this.io.adapter.rooms?.get(roomName)?.size ?? 0;

    if (updatedPoll) {
      this.io.to(roomName).emit('poll_updated', updatedPoll);
    }
  }

  @SubscribeMessage('test')
  async test() {
    throw new BadRequestException('Invalid empty data :)');
  }
}
