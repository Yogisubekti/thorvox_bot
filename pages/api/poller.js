import axios from "axios";

export const config = { runtime: "edge" };

export default async function handler(req) {
  const apiKey = process.env.NEYNAR_API_KEY;
  const fid = process.env.FID;

  try {
    // ambil mention terbaru
    const { data } = await axios.get(
      `https://api.neynar.com/v2/farcaster/casts/mentions?fid=${fid}`,
      { headers: { api_key: apiKey } }
    );

    const mentions = data.result.casts || [];
    if (!mentions.length) return new Response("No mentions", { status: 200 });

    const latest = mentions[0];
    const text = latest.text;
    const match = text.match(/0x[a-fA-F0-9]{40}/);
    if (!match) return new Response("No address found", { status: 200 });

    const address = match[0];
    const replyText = `🔍 Analyzing ${address}... stay tuned!`;

    await axios.post(
      "https://api.neynar.com/v2/farcaster/cast",
      {
        text: replyText,
        parent: latest.hash,
      },
      {
        headers: {
          api_key: apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    return new Response("Replied", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}
