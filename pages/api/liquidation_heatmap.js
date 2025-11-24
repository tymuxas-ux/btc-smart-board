import axios from "axios";
export default async function handler(req, res) {
  try {
    const r = await axios.get("https://api.coinalyze.net/v1/futures/liquidations", {
      headers: { "x-api-key": process.env.COINALYZE_KEY }
    });
    const series = r.data.map((d) => ({ exchange: d.exchange, long: d.long_liquidations, short: d.short_liquidations }));
    res.status(200).json({ series });
  } catch (e) {
    // fallback mock
    const series = [
      { exchange: "Binance", long: 420, short: 120 },
      { exchange: "Bybit", long: 300, short: 200 },
      { exchange: "Deribit", long: 120, short: 80 },
      { exchange: "OKX", long: 90, short: 60 }
    ];
    res.status(200).json({ series });
  }
}
