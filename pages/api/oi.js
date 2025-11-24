import axios from "axios";
export default async function handler(req, res) {
  try {
    const r = await axios.get("https://api.coinalyze.net/v1/public/openinterest", {
      headers: { "x-api-key": process.env.COINALYZE_KEY }
    });
    const series = r.data.map((d) => ({ t: d.time, value: d.open_interest }));
    res.status(200).json({ series });
  } catch (e) {
    // fallback mock
    const now = Date.now();
    const series = Array.from({ length: 24 }).map((_, i) => ({ t: new Date(now - (23 - i) * 60 * 60 * 1000).toISOString(), value: Math.round(30e9 + Math.sin(i / 3) * 5e8) }));
    res.status(200).json({ series });
  }
}
