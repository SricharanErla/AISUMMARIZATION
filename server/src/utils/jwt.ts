export const signToken = (userId: string) => {
  return `runtime-token:${userId}`;
};
