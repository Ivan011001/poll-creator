import { v4 as uuidv4 } from 'uuid';

export const createPollID = () => uuidv4().substr(0, 6).toUpperCase();

export const createUserID = () => uuidv4();

export const createNominationID = () => uuidv4().substr(0, 8);
