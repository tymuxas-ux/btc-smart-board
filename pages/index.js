// pages/index.js
import useSWR from "swr";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";

const fetcher = (url) => axios.get(url).then((r) => r.data);

// small helper to format numbers
const fmt = (v) => (typeof v === "number" ? v.toLocaleString() : v ?? "--");

export default function Dashboard() {
  const { data: price } = useSWR("/api/price", fetcher, { refreshInterval: 30000 });
  const { data: oi } = useSWR("/api/oi", fetcher, { refreshInterval: 30000 });
  const { data: funding } = useSWR("/api/funding", fetcher, { refreshInterval: 30000 });
  const { data: netflow } = useSWR("/api/netflow", fetcher, { refreshInterval: 30000 });
  const { data: onchain } = useSWR("/api/onchain", fetcher, { refreshInterval: 60000 });
  const { data: liquidation } = useSWR("/api/liquidation_heatmap", fetcher, { refreshInterval: 60000 });
  const { data: fundingHeat } = useSWR("/api/funding_heatmap", fetcher, { refreshInterval: 60000 });
  const { data: macro } = useSWR("/api/macro_score", fetcher, { refreshInterval: 60000 });

  const btcPrice = price?.bitcoin?.usd;
  const btcVol = price?.bitcoin?.usd_24h_vol;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">BTC Smart Macro Board</h1>
            <p className="text-sm text-neutral-400">Realtime monitoring — price, derivatives, on-chain, heatmaps, alerts</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-neutral-400">Data sources: CoinGecko, Coinalyze, CryptoQuant, Glassnode</div>
          </div>
        </header>

        {/* Top stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="text-sm text-neutral-400">BTC Price (USD)</div>
            <div className="text-2xl font-semibold mt-2">{btcPrice ? `$${fmt(btcPrice)}` : "--"}</div>
            <div className="text-xs text-neutral-400 mt-1">24h vol: {btcVol ? fmt(Math.round(btcVol)) : "--"}</div>
          </Card>

          <Card>
            <div className="text-sm text-neutral-400">Active Addresses</div>
            <div className="text-2xl font-semibold mt-2">{fmt(onchain?.series?.[onchain.series.length - 1]?.active_addrs)}</div>
            <div className="text-xs text-neutral-400 mt-1">Glassnode</div>
          </Card>

          <Card>
            <div className="text-sm text-neutral-400">Macro Risk Score</div>
            <div className="text-2xl font-semibold mt-2">{fmt(macro?.score)}</div>
            <div className="text-xs text-neutral-400 mt-1">0 low — 10 extreme</div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <Panel title="Open Interest (24h)">
            <MiniLine data={oi?.series} dataKey="value" />
          </Panel>
          <Panel title="Funding Rate">
            <MiniLine data={funding?.series} dataKey="value" />
          </Panel>
          <Panel title="Exchange Netflow (14d)">
            <MiniBar data={netflow?.series} dataKey="btc" />
          </Panel>
          <Panel title="Macro Score History (last values)">
            <div className="p-4 text-sm text-neutral-400">Latest score: {fmt(macro?.score)}</div>
          </Panel>
        </div>

        {/* Heatmaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Heatmap title="Liquidations (24h)" data={liquidation?.series} valueKey="long" altKey="short" />
          <Heatmap title="Funding by Exchange" data={fundingHeat?.series} valueKey="long" altKey="short" />
        </div>

        <footer className="mt-8 text-sm text-neutral-500">
          Demo: if any API fails, endpoints use fallback/mock data. Configure .env.local with real keys and redeploy to remove mocks.
        </footer>
      </div>
    </div>
  );
}

/* UI helper components */
function Card({ children }) {
  return <div className="bg-neutral-800 p-4 rounded-2xl shadow">{children}</div>;
}

function Panel({ title, children }) {
  return (
    <div className="bg-neutral-800 p-4 rounded-2xl shadow">
      <div className="text-sm text-neutral-400 mb-2">{title}</div>
      {children}
    </div>
  );
}

function MiniLine({ data = [], dataKey }) {
  if (!data || data.length === 0) return <div className="h-40 flex items-center justify-center text-neutral-400">No data</div>;
  return (
    <div className="h-40">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="t" hide />
          <YAxis hide />
          <Tooltip />
          <Line dataKey={dataKey} stroke="#4ade80" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function MiniBar({ data = [], dataKey }) {
  if (!data || data.length === 0) return <div className="h-40 flex items-center justify-center text-neutral-400">No data</div>;
  return (
    <div className="h-40">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="t" hide />
          <YAxis hide />
          <Tooltip />
          <Bar dataKey={dataKey} fill="#60a5fa" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Heatmap({ title, data = [], valueKey = "long", altKey = "short" }) {
  if (!data || data.length === 0) return <div className="bg-neutral-800 p-4 rounded-2xl shadow">No data</div>;
  // compute max for scaling
  const max = Math.max(...data.map((d) => Math.max(d[valueKey] || 0, d[altKey] || 0)), 1);
  return (
    <div className="bg-neutral-800 p-4 rounded-2xl shadow">
      <div className="text-sm text-neutral-400 mb-2">{title}</div>
      <div className="grid grid-cols-2 gap-2">
        {data.map((d) => {
          const intensity = ((d[valueKey] || 0) / max) * 0.9 + 0.05;
          return (
            <div key={d.exchange} className="p-2 rounded" style={{ background: `rgba(255,40,40,${intensity})` }}>
              <div className="text-xs">{d.exchange}</div>
              <div className="text-sm">L: {fmt(d[valueKey])} / S: {fmt(d[altKey])}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
