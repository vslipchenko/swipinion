import {MESSAGE_TEASER_LENGTH} from '../constants/user-messages';

export const getInterlocutorId = (id1: string, id2: string, userId: string): string => (id1 === userId ? id2 : id1);
export const convertBodyToTeaser = (body: string): string => body.slice(0, MESSAGE_TEASER_LENGTH); // *Accepts TRIMMED body
