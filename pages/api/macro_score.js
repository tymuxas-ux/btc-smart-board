import axios from "axios";

function baseUrl() {
  return process.env.BASE_URL || `http://localhost:3000`;
}

export default async function handler(req, res) {
  try {
    // call internal endpoints (use Base URL so it works in serverless too if BASE_URL set)
    const [oiResp, fundingResp, netflowResp, onchainResp] = await Promise.all([
      axios.get(`${baseUrl()}/api/oi`).then((r) => r.data).catch(() => null),
      axios.get(`${baseUrl()}/api/funding`).then((r) => r.data).catch(() => null),
      axios.get(`${baseUrl()}/api/netflow`).then((r) => r.data).catch(() => null),
      axios.get(`${baseUrl()}/api/onchain`).then((r) => r.data).catch(() => null)
    ]);

    const latestOI = oiResp?.series?.slice(-1)[0]?.value || 0;
    const latestFunding = Math.abs(parseFloat(fundingResp?.series?.slice(-1)[0]?.value || 0));
    const latestNetflow = netflowResp?.series?.slice(-1)[0]?.btc || 0;
    const latestActive = onchainResp?.series?.slice(-1)[0]?.active_addrs || 0;

    let score = 0;
    // weights — tweak as you like
    if (latestOI > 1e10) score += 3;
    if (latestOI > 5e9) score += 2;
    if (latestFunding > 0.003) score += 3;
    if (latestNetflow > 1000) score += 2;
    if (latestActive < 200000) score += 1;

    if (score > 10) score = 10;
    res.status(200).json({ score });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
