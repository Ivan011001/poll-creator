import { Inject, InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { IORedisKey } from 'src/redis.module';
import {
  AddNominationData,
  AddParticipantData,
  AddParticipantRankingsData,
  CreatePollData,
} from './types';
import { Poll, Results } from 'shared';

@Injectable()
export class PollsRepository {
  private readonly ttl: string;

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
      rankings: {},
      results: [],
      adminID: userID,
      hasStarted: false,
    };

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

  async startPoll(pollID: string): Promise<Poll> {
    const key = `polls:${pollID}`;
    const hasStaredPath = '.hasStarted';

    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        hasStaredPath,
        JSON.stringify(true),
      );

      const poll = await this.getPoll(pollID);

      return poll;
    } catch {
      throw new InternalServerErrorException('Failed to start poll');
    }
  }

  async addParticipantRankings({
    userID,
    pollID,
    rankings,
  }: AddParticipantRankingsData): Promise<Poll> {
    const key = `polls:${pollID}`;
    const rankingsPath = `.rankings.${userID}`;

    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        rankingsPath,
        JSON.stringify(rankings),
      );

      const poll = await this.getPoll(pollID);

      return poll;
    } catch {
      throw new InternalServerErrorException('Failed to add ranking');
    }
  }

  async addResults(pollID: string, results: Results): Promise<Poll> {
    const key = `polls:${pollID}`;
    const resultsPath = '.results';

    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        resultsPath,
        JSON.stringify(results),
      );

      const poll = await this.getPoll(pollID);

      return poll;
    } catch {
      throw new InternalServerErrorException('Failed to add results');
    }
  }

  async deletePoll(pollID: string) {
    const key = `polls:${pollID}`;

    try {
      await this.redisClient.call('JSON.DEL', key);
    } catch {
      throw new InternalServerErrorException('Failed to delete poll');
    }
  }
}
