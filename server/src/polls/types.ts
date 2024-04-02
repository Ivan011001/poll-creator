import { Request } from 'express';
import { Socket } from 'socket.io';
import { Nomination } from 'shared';

//service interfaces
export interface CreatePollFields {
  topic: string;
  votesPerVoter: number;
  name: string;
}

export interface JoinPollFields {
  pollID: string;
  name: string;
}

export interface RejoinPollField {
  pollID: string;
  userID: string;
  name: string;
}

export interface AddParticipantFileds {
  pollID: string;
  userID: string;
  name: string;
}

export interface AddNominationFields {
  pollID: string;
  userID: string;
  text: string;
}

export interface SubmitRankingsFields {
  pollID: string;
  userID: string;
  rankings: string[];
}

//repository interfaces
export interface CreatePollData {
  pollID: string;
  topic: string;
  votesPerVoter: number;
  userID: string;
}

export interface AddParticipantData {
  pollID: string;
  userID: string;
  name: string;
}

export interface RemoveParticipantData {
  pollID: string;
  userID: string;
}

export interface AddNominationData {
  pollID: string;
  nominationID: string;
  nomination: Nomination;
}

export interface AddParticipantRankingsData {
  pollID: string;
  userID: string;
  rankings: string[];
}

// guard types
export interface AuthPayload {
  user: {
    userID: string;
    pollID: string;
    name: string;
  };
}

export type RequestWithAuth = Request & AuthPayload;

export type SocketWithAuth = Socket & AuthPayload;
