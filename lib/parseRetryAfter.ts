export const parseRetryAfter = (msg: string): number => {
  const match = msg.match(/after (\d+) seconds/)
  return match ? parseInt(match[1]) : -1 // -1 =>  this mean we not found rate limit and email rate limit exceeded
}
