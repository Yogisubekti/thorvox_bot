import axios from "axios";

export default async function handler(req, res) {
  try {
    const apiKey = process.env.NEYNAR_API_KEY;
    const fid = process.env.FID;

    const { data } = await axios.get(
      `https://api.neynar.com/v2/farcaster/casts/mentions?fid=${422540}`,
      { headers: { api_key: 814103A3-9898-47AE-A977-BAAE44B61F20 } }
    );

    const mentions = data.result.casts || [];
    if (!mentions.length) return res.status(200).json({ ok: true, msg: "no mentions" });

    const latest = mentions[0];
    const text = latest.text;
    const match = text.match(/0x[a-fA-F0-9]{40}/);
    if (!match) return res.status(200).json({ ok: true, msg: "no address" });

    const address = match[0];
    const reply = `🧠 Thorvox Scanner
Detected wallet: ${address}
(Analysis incoming soon...)`;

    await axios.post(
      "https://api.neynar.com/v2/farcaster/cast",
      { text: reply, parent: latest.hash },
      { headers: { api_key: apiKey } }
    );

    return res.status(200).json({ ok: true, msg: "reply sent" });
  } catch (e) {
    console.error("cron error", e.message);
    res.status(500).json({ error: e.message });
  }
}
