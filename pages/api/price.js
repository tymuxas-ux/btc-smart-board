import axios from "axios";
export default async function handler(req, res) {
  try {
    const r = await axios.get(`${process.env.COINGECKO_URL}/simple/price`, {
      params: { ids: "bitcoin", vs_currencies: "usd", include_24hr_vol: true }
    });
    res.status(200).json(r.data);
  } catch (e) {
    // fallback mock
    res.status(200).json({ bitcoin: { usd: 105200, usd_24h_vol: 1234567890 } });
  }
}
