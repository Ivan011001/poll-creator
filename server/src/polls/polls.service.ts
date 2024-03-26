import { Injectable } from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from './dtos';

import { createPollID, createUserID } from 'src/utlis/ids';

@Injectable()
export class PollsService {
  async create(createPollDto: CreatePollDto) {
    const pollID = createPollID();
    const userID = createUserID();

    return {
      userID,
      pollID,
      ...createPollDto,
    };
  }

  async join(joinPollDto: JoinPollDto) {
    const userID = createUserID();

    return { userID, ...joinPollDto };
  }

  async rejoin() {
    return 'In rejoin';
  }
}
