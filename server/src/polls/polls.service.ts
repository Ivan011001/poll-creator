import { Injectable } from '@nestjs/common';

import { createPollID, createUserID } from 'src/utlis/ids';
import { PollsRepository } from './polls.repository';
import { CreatePollFields, JoinPollFields, RejoinPollField } from './types';

@Injectable()
export class PollsService {
  constructor(private readonly pollsRepository: PollsRepository) {}

  async create(fileds: CreatePollFields) {
    const pollID = createPollID();
    const userID = createUserID();

    const createdPoll = await this.pollsRepository.createPoll({
      ...fileds,
      pollID,
      userID,
    });

    return {
      poll: createdPoll,
      // access token
    };
  }

  async join(fileds: JoinPollFields) {
    // const userID = createUserID();

    const joinedPoll = await this.pollsRepository.getPoll(fileds.pollID);

    return {
      poll: joinedPoll,
      // access token
    };
  }

  async rejoin(fileds: RejoinPollField) {
    const joinedPoll = await this.pollsRepository.addParticipant(fileds);

    return joinedPoll;
  }
}
