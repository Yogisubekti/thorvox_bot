import axios from "axios";
import { getWalletData } from "@/utils/cielo";
import { formatWalletSummary } from "@/utils/format";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Only POST allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const cast = body.data.cast;
    const text = cast.text || "";

    // cari wallet address (0x... atau Solana pattern)
    const match = text.match(/(0x[a-fA-F0-9]{40}|[1-9A-HJ-NP-Za-km-z]{32,44})/);
    if (!match) {
      return new Response("No address found", { status: 200 });
    }

    const address = match[0];

    // deteksi chain sederhana
    const chain =
      address.startsWith("0x") ? (Math.random() > 0.5 ? "ethereum" : "base") : "solana";

    // ambil data wallet
    const data = await getWalletData(address);
    if (!data) {
      return new Response("Failed to get wallet data", { status: 500 });
    }

    const totalValue = `$${data.totalValue?.toLocaleString() || 0}`;
    const tokens = data.topTokens?.slice(0, 3).map((t) => t.symbol).join(", ") || "N/A";
    const change = data.portfolioChange || "0%";

    // mood otomatis
    let mood = "😎";
    let insight = "Stable portfolio vibes.";
    const numericChange = parseFloat(change);
    if (!isNaN(numericChange)) {
      if (numericChange > 5) {
        mood = "🤑";
        insight = "Profitable week! Keep it up!";
      } else if (numericChange < -5) {
        mood = "😬";
        insight = "Rough week, but you'll bounce back!";
      }
    }

    // frame image
    const imageUrl = `https://thorvox-bot.vercel.app/api/og?address=${address}&total=${encodeURIComponent(
      totalValue
    )}&tokens=${encodeURIComponent(tokens)}&change=${encodeURIComponent(change)}`;

    // teks respons
    const summary = `💠 **${chain.toUpperCase()} Wallet Analysis**
${mood} ${insight}
💰 Total: ${totalValue}
🔹 Tokens: ${tokens}
📈 7D: ${change}
`;

    // kirim reply ke farcaster
    await axios.post(
      "https://api.neynar.com/v2/farcaster/cast",
      {
        text: summary,
        embeds: [imageUrl],
        parent: cast.hash,
      },
      {
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return new Response("Reply sent", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Internal error", { status: 500 });
  }
}
