import axios from "axios";

export default async function handler(req, res) {
  try {
    const apiKey = process.env.NEYNAR_API_KEY; // simpan di .env.local
    const fid = process.env.FID;               // simpan di .env.local

    // Ambil mention terbaru dari bot FID kamu
    const { data } = await axios.get(
      `https://api.neynar.com/v2/farcaster/casts/mentions?fid=${fid}`,
      {
        headers: {
          "Content-Type": "application/json",
          api_key: apiKey,
        },
      }
    );

    const mentions = data.result?.casts || [];
    if (!mentions.length)
      return res.status(200).json({ ok: true, msg: "no mentions" });

    // Ambil mention terbaru
    const latest = mentions[0];
    const text = latest.text;

    // Deteksi wallet address di teks
    const match = text.match(/0x[a-fA-F0-9]{40}/);
    if (!match)
      return res.status(200).json({ ok: true, msg: "no address found" });

    const address = match[0];
    const reply = `🧠 Thorvox Scanner
Detected wallet: ${address}
(Analysis incoming soon...)`;

    // Kirim reply balik ke thread Farcaster
    await axios.post(
      "https://api.neynar.com/v2/farcaster/cast",
      {
        text: reply,
        parent: latest.hash, // reply ke cast yang mention
      },
      {
        headers: {
          "Content-Type": "application/json",
          api_key: apiKey,
        },
      }
    );

    return res.status(200).json({ ok: true, msg: "reply sent" });
  } catch (e) {
    console.error("cron error", e.message);
    return res.status(500).json({ error: e.message });
  }
}
