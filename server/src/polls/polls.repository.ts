import { Inject, InternalServerErrorException } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { IORedisKey } from 'src/redis.module';
import { AddNominationData, AddParticipantData, CreatePollData } from './types';
import { Poll } from 'shared';

@Injectable()
export class PollsRepository {
  private readonly ttl: string;
  private readonly logger = new Logger(PollsRepository.name);

  constructor(
    configService: ConfigService,
    @Inject(IORedisKey) private readonly redisClient: Redis,
  ) {
    this.ttl = configService.get('POLL_DURATION');
  }

  async createPoll({
    pollID,
    topic,
    votesPerVoter,
    userID,
  }: CreatePollData): Promise<Poll> {
    const initialPoll = {
      id: pollID,
      topic,
      votesPerVoter,
      participants: {},
      nominations: {},
      adminID: userID,
      hasStarted: false,
    };

    this.logger.log(
      `Creating new poll ${JSON.stringify(initialPoll, null, 2)} with TTL ${this.ttl}`,
    );

    const key = `polls:${pollID}`;

    try {
      await this.redisClient
        .multi([
          ['send_command', 'JSON.SET', key, '.', JSON.stringify(initialPoll)],
          ['expire', key, this.ttl],
        ])
        .exec();

      return initialPoll;
    } catch {
      throw new InternalServerErrorException('Failed to create poll');
    }
  }

  async getPoll(pollID: string): Promise<Poll> {
    const key = `polls:${pollID}`;

    try {
      const poll = await this.redisClient.call('JSON.GET', key, '.');

      // if (currentPoll.hasStarted) {
      //   throw new BadRequestException('Poll has already started');
      // }

      return JSON.parse(poll as string);
    } catch {
      throw new InternalServerErrorException(`Failed to get poll ${pollID}`);
    }
  }

  async addParticipant({
    pollID,
    userID,
    name,
  }: AddParticipantData): Promise<Poll> {
    const key = `polls:${pollID}`;
    const participantPath = `.participants.${userID}`;

    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        participantPath,
        JSON.stringify(name),
      );

      const poll = await this.getPoll(pollID);

      return poll;
    } catch {
      throw new InternalServerErrorException('Failed to add participant');
    }
  }

  async removeParticipant(pollID: string, userID: string): Promise<Poll> {
    const key = `polls:${pollID}`;
    const participantPath = `.participants.${userID}`;

    try {
      await this.redisClient.call('JSON.DEL', key, participantPath);

      const poll = await this.getPoll(pollID);

      return poll;
    } catch {
      throw new InternalServerErrorException('Failed to remove participant');
    }
  }

  async addNomination({
    pollID,
    nominationID,
    nomination,
  }: AddNominationData): Promise<Poll> {
    const key = `polls:${pollID}`;
    const nominationPath = `.nominations.${nominationID}`;

    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        nominationPath,
        JSON.stringify(nomination),
      );

      const poll = await this.getPoll(pollID);

      return poll;
    } catch {
      throw new InternalServerErrorException('Failed to add nomination');
    }
  }

  async removeNomination(pollID: string, nominationID: string): Promise<Poll> {
    const key = `polls:${pollID}`;
    const nominationPath = `.nominations.${nominationID}`;

    try {
      await this.redisClient.call('JSON.DEL', key, nominationPath);

      const poll = await this.getPoll(pollID);

      return poll;
    } catch {
      throw new InternalServerErrorException('Failed to remove nomination');
    }
  }
}
