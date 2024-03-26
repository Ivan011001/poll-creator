import { Controller, Post, Logger, Body } from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from './dtos';

@Controller('polls')
export class PollsController {
  @Post()
  async create(@Body() createPollDto: CreatePollDto) {
    Logger.log('in create');
    return createPollDto;
  }

  @Post('/join')
  async join(@Body() joinPollDto: JoinPollDto) {
    Logger.log('in join');
    return joinPollDto;
  }

  @Post('/rejoin')
  async rejoin() {
    Logger.log('in rejoin');
  }
}
