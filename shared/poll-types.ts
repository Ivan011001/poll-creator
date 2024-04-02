export interface Nomination {
  userID: string;
  text: string;
}
export interface Participants {
  [participantID: string]: string;
}

type NominationID = string;

export interface Nominations {
  [nominationID: NominationID]: Nomination;
}

export interface Rankings {
  [userID: string]: NominationID[];
}

export type Results = Array<{
  nominationID: string;
  nominationText: string;
  score: number;
}>;

export interface Poll {
  id: string;
  topic: string;
  votesPerVoter: number;
  participants: Participants;
  adminID: string;
  nominations: Nominations;
  rankings: Rankings;
  results: Results;
  hasStarted: boolean;
}
