import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default async function handler(req) {
  const { address = "0x0000", total = "$0", tokens = "N/A", change = "0%" } =
    Object.fromEntries(new URL(req.url).searchParams);

  const isLoss = change.startsWith("-");
  const changeColor = isLoss ? "#FF5F5F" : "#00FFC6";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle at 50% 50%, #0C0C0C 0%, #030303 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#E0E0E0",
          fontFamily: "monospace",
          letterSpacing: "-0.5px",
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: "bold",
            color: "#00BFFF",
            marginBottom: 20,
            textShadow: "0 0 15px #00BFFF",
          }}
        >
          ⚡ Thorvox Analyzer
        </div>
        <div style={{ fontSize: 32, opacity: 0.9 }}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <div
          style={{
            marginTop: 25,
            fontSize: 36,
            color: "#FFFFFF",
            textShadow: "0 0 5px #00FFC6",
          }}
        >
          {total}
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 26,
            color: "#A9A9A9",
          }}
        >
          Top Tokens: {tokens}
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 26,
            color: changeColor,
            textShadow: `0 0 8px ${changeColor}`,
          }}
        >
          7D Change: {change}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 20,
            color: "#555",
          }}
        >
          powered by thorvox_bot
        </div>

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background:
              "linear-gradient(90deg, rgba(0,191,255,0.8) 0%, rgba(0,255,198,0.8) 100%)",
            boxShadow: "0 0 10px #00FFC6",
          }}
        />
      </div>
    ),
    {
      width: 1000,
      height: 1000,
    }
  );
}
