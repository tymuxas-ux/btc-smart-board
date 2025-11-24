import axios from "axios";

export default async function handler(req, res) {
  try {
    // Evaluate triggers quickly using internal macro score endpoint
    const base = process.env.BASE_URL || "http://localhost:3000";
    const macro = await axios.get(`${base}/api/macro_score`).then((r) => r.data).catch(() => ({ score: 0 }));
    const triggers = [];

    if (macro.score >= 8) triggers.push(`Macro score high: ${macro.score}`);
    if (triggers.length > 0 && process.env.SLACK_WEBHOOK) {
      await axios.post(process.env.SLACK_WEBHOOK, { text: `BTC Alerts: ${triggers.join(", ")}` });
    }
    if (triggers.length > 0 && process.env.TELEGRAM_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: `BTC Alerts: ${triggers.join(", ")}`
      });
    }
    res.status(200).json({ triggers });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
