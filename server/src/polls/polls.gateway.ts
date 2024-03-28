import { Logger } from '@nestjs/common';
import { PollsService } from './polls.service';
import { WebSocketGateway, OnGatewayInit } from '@nestjs/websockets';

@WebSocketGateway({
  namespace: 'polls',
})
export class PollsGateway implements OnGatewayInit {
  private logger = new Logger(PollsGateway.name);
  constructor(private readonly pollsService: PollsService) {}

  afterInit(): void {
    this.logger.log('Websoket gateway');
  }
}
