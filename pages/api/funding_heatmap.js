import axios from "axios";
export default async function handler(req, res) {
  try {
    const r = await axios.get("https://api.coinalyze.net/v1/public/funding", {
      headers: { "x-api-key": process.env.COINALYZE_KEY }
    });
    const series = r.data.map((d) => ({ exchange: d.exchange, long: d.long_rate, short: d.short_rate }));
    res.status(200).json({ series });
  } catch (e) {
    // fallback mock
    const series = [
      { exchange: "Binance", long: 0.0008, short: -0.0004 },
      { exchange: "Bybit", long: 0.0006, short: -0.0002 },
      { exchange: "Deribit", long: 0.0003, short: -0.0001 }
    ];
    res.status(200).json({ series });
  }
}
