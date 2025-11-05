import axios from "axios";

export async function getWalletData(address) {
  const url = `https://api.cielo.finance/v1/profile/${address}`;
  try {
    const res = await axios.get(url, {
      headers: { "x-api-key": process.env.CIELO_API_KEY },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching wallet data:", err);
    return null;
  }
}
