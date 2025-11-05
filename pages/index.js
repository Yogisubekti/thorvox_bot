export default function Home() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>💎 Farcaster Wallet Analyzer</h1>
      <p>Tempelkan address wallet kamu untuk analisis cepat!</p>
      <form action="/api/analyze" method="get">
        <input
          type="text"
          name="address"
          placeholder="0x1234..."
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        />
        <button type="submit">Analyze</button>
      </form>
    </div>
  );
}
