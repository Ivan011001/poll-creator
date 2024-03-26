import { Module } from '@nestjs/common';
import { PollsController } from './polls.controller';
import { ConfigModule } from '@nestjs/config';
import { PollsService } from './polls.service';
import { redisModule } from 'src/modules.config';

@Module({
  imports: [ConfigModule, redisModule],
  controllers: [PollsController],
  providers: [PollsService],
})
export class PollsModule {}
