import { Controller, Post, Body } from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from './dtos';
import { PollsService } from './polls.service';

@Controller('polls')
export class PollsController {
  constructor(private pollsService: PollsService) {}

  @Post()
  async create(@Body() createPollDto: CreatePollDto) {
    return await this.pollsService.create(createPollDto);
  }

  @Post('/join')
  async join(@Body() joinPollDto: JoinPollDto) {
    return await this.pollsService.join(joinPollDto);
  }

  @Post('/rejoin')
  async rejoin() {
    const mockFileds = {
      pollID: '66994B',
      userID: 'string',
      name: 'sd',
    };
    return await this.pollsService.rejoin(mockFileds);
  }
}
