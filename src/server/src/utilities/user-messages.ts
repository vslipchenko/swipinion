export const getInterlocutorId = (id1: string, id2: string, userId: string): string => (id1 === userId ? id2 : id1);
