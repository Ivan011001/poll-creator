import { Injectable } from '@nestjs/common';
import { createPollID, createUserID } from 'src/utlis/ids';
import { PollsRepository } from './polls.repository';
import {
  AddParticipantFileds,
  CreatePollFields,
  JoinPollFields,
  RejoinPollField,
} from './types';
import { JwtService } from '@nestjs/jwt';
import { Poll } from 'shared';

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
}
