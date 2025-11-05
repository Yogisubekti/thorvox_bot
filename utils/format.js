export function formatWalletSummary(data) {
  if (!data) return "❌ Wallet tidak ditemukan.";

  const tokens = data.topTokens?.slice(0, 3).map(t => t.symbol).join(", ") || "N/A";
  const totalValue = `$${data.totalValue?.toLocaleString() || 0}`;
  const lastTx = data.recentTransactions?.[0]?.description || "No recent tx";

  return `💎 Wallet: ${data.address}
💰 Total Value: ${totalValue}
🔥 Top Tokens: ${tokens}
🔍 Last Tx: ${lastTx}`;
}
