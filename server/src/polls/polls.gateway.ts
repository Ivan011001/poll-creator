import {
  Logger,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PollsService } from './polls.service';
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { SocketWithAuth } from './types';
import { WsCatchAllException } from 'src/exceptions/ws-catch-all.filter';
import { GatewayAdminGuard } from './gateway-admin.guard';
import { NominationDto } from './dtos';

@UsePipes(new ValidationPipe())
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

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage('remove_participant')
  async removeParticipant(
    @MessageBody('id') id: string,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    const updatedPoll = await this.pollsService.remove(client.user.pollID, id);

    if (updatedPoll) {
      this.io.to(client.id).emit('poll_updated', updatedPoll);
    }
  }

  @SubscribeMessage('nominate')
  async nominate(
    @MessageBody() nomination: NominationDto,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    const { pollID, userID } = client.user;

    const updatedPoll = await this.pollsService.addNomination({
      pollID,
      userID,
      text: nomination.text,
    });

    this.io.to(pollID).emit('poll_updated', updatedPoll);
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage('remove_nomination')
  async removeNomination(
    @MessageBody('id') nominationID: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    const { pollID } = client.user;

    const updatedPoll = await this.pollsService.removeNomination(
      pollID,
      nominationID,
    );

    this.io.to(pollID).emit('poll_updated', updatedPoll);
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage('start_vote')
  async startPoll(@ConnectedSocket() client: SocketWithAuth) {
    const { pollID } = client.user;

    const updatedPoll = await this.pollsService.startPoll(pollID);

    this.io.to(pollID).emit('poll_updated', updatedPoll);
  }

  @SubscribeMessage('submit_rankings')
  async submitRankings(
    @MessageBody('rankings') rankings: string[],
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    const { pollID, userID } = client.user;

    const updatedPoll = await this.pollsService.submitRankings({
      pollID,
      userID,
      rankings,
    });

    this.io.to(pollID).emit('poll_updated', updatedPoll);
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage('close_poll')
  async closePoll(@ConnectedSocket() client: SocketWithAuth) {
    const { pollID } = client.user;

    const updatedPoll = await this.pollsService.computeResults(pollID);

    this.io.to(pollID).emit('poll_updated', updatedPoll);
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage('cancel_poll')
  async cancelPoll(@ConnectedSocket() client: SocketWithAuth) {
    const { pollID } = client.user;

    await this.pollsService.cancelPoll(pollID);

    this.io.to(pollID).emit('poll_cancelled');
  }
}
