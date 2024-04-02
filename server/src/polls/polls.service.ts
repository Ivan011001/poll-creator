import { BadRequestException, Injectable } from '@nestjs/common';
import { createPollID, createUserID, createNominationID } from 'src/utlis/ids';
import { PollsRepository } from './polls.repository';
import {
  AddNominationFields,
  AddParticipantFileds,
  CreatePollFields,
  JoinPollFields,
  RejoinPollField,
  SubmitRankingsFields,
} from './types';
import { JwtService } from '@nestjs/jwt';
import { Poll } from 'shared';
import { getResults } from 'src/helpers/getResults';

@Injectable()
export class PollsService {
  constructor(
    private readonly pollsRepository: PollsRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create(fileds: CreatePollFields) {
    const pollID = createPollID();
    const userID = createUserID();

    const createdPoll = await this.pollsRepository.createPoll({
      ...fileds,
      pollID,
      userID,
    });

    const accessToken = this.jwtService.sign(
      {
        pollID: createdPoll.id,
        name: fileds.name,
      },
      {
        subject: userID,
      },
    );

    return {
      poll: createdPoll,
      accessToken,
    };
  }

  async join(fileds: JoinPollFields) {
    const userID = createUserID();

    const joinedPoll = await this.pollsRepository.getPoll(fileds.pollID);

    const accessToken = this.jwtService.sign(
      {
        pollID: joinedPoll.id,
        name: fileds.name,
      },
      {
        subject: userID,
      },
    );

    return {
      poll: joinedPoll,
      accessToken,
    };
  }

  async rejoin(fileds: RejoinPollField) {
    const joinedPoll = await this.pollsRepository.addParticipant(fileds);

    return joinedPoll;
  }

  async add(fields: AddParticipantFileds) {
    return this.pollsRepository.addParticipant(fields);
  }

  async remove(pollID: string, userID: string): Promise<Poll | void> {
    const poll = await this.pollsRepository.getPoll(pollID);

    if (poll.hasStarted) {
      return;
    }

    const updatedPoll = await this.pollsRepository.removeParticipant(
      pollID,
      userID,
    );

    return updatedPoll;
  }

  async get(pollID: string): Promise<Poll> {
    return this.pollsRepository.getPoll(pollID);
  }

  async addNomination({
    pollID,
    userID,
    text,
  }: AddNominationFields): Promise<Poll> {
    const nominationID = createNominationID();

    return await this.pollsRepository.addNomination({
      pollID,
      nominationID,
      nomination: {
        userID,
        text,
      },
    });
  }

  async removeNomination(pollID: string, nominationID: string): Promise<Poll> {
    return await this.pollsRepository.removeNomination(pollID, nominationID);
  }

  async startPoll(pollID: string): Promise<Poll> {
    return await this.pollsRepository.startPoll(pollID);
  }

  async submitRankings({
    pollID,
    userID,
    rankings,
  }: SubmitRankingsFields): Promise<Poll> {
    const poll = await this.pollsRepository.getPoll(pollID);

    if (!poll.hasStarted) {
      throw new BadRequestException(
        "Participants cannot rank while poll hasn't started",
      );
    }

    return await this.pollsRepository.addParticipantRankings({
      pollID,
      userID,
      rankings,
    });
  }

  async computeResults(pollID: string): Promise<Poll> {
    const poll = await this.pollsRepository.getPoll(pollID);
    const { rankings, nominations, votesPerVoter } = poll;

    const results = getResults(rankings, nominations, votesPerVoter);

    return await this.pollsRepository.addResults(pollID, results);
  }

  async cancelPoll(pollID: string): Promise<void> {
    return await this.pollsRepository.deletePoll(pollID);
  }
}
