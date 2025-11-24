import axios from "axios";
export default async function handler(req, res) {
  try {
    const r = await axios.get("https://api.coinalyze.net/v1/public/funding", {
      headers: { "x-api-key": process.env.COINALYZE_KEY }
    });
    const series = r.data.map((d) => ({ t: d.time, value: d.funding_rate }));
    res.status(200).json({ series });
  } catch (e) {
    // fallback mock
    const now = Date.now();
    const series = Array.from({ length: 24 }).map((_, i) => ({ t: new Date(now - (23 - i) * 60 * 60 * 1000).toISOString(), value: (Math.sin(i / 4) * 0.001).toFixed(6) }));
    res.status(200).json({ series });
  }
}
