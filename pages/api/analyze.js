import { getWalletData } from "@/utils/cielo";
import { formatWalletSummary } from "@/utils/format";

export default async function handler(req, res) {
  const { address } = req.query;
  if (!address) return res.status(400).json({ error: "No address provided" });

  const data = await getWalletData(address);
  const text = formatWalletSummary(data);

  return res.status(200).json({
    frame: {
      title: "Farcaster Wallet Analyzer",
      description: text,
      image: `https://thorvox-bot.vercel.app/api/og?address=${address}&total=${encodeURIComponent(totalValue)}&tokens=${encodeURIComponent(tokens)}&change=${encodeURIComponent(change)}`,
      buttons: [
        { label: "🔁 Analyze another", action: "post", target: "/" },
      ],
    },
  });
}
