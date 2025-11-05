import Neynar from "neynar";

export const neynarClient = new Neynar({
  apiKey: process.env.NEYNAR_API_KEY,
});
