import axios from "axios";
export default async function handler(req, res) {
  try {
    const r = await axios.get(`https://api.cryptoquant.com/v1/btc/exchange-flows/netflow?api_key=${process.env.CRYPTOQUANT_KEY}`);
    // adapt to series of { t, btc }
    const series = r.data.result.map((p) => ({ t: p.timestamp, btc: p.btc_amount }));
    res.status(200).json({ series });
  } catch (e) {
    // fallback mock 14 days
    const now = Date.now();
    const series = Array.from({ length: 14 }).map((_, i) => ({ t: new Date(now - (13 - i) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), btc: Math.round(Math.sin(i / 2) * 1200) }));
    res.status(200).json({ series });
  }
}
