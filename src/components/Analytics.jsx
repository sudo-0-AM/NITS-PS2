import { useState } from "react";
import { motion } from "framer-motion";
import students from "../data/students.json";
import { getContract } from "../utils/contract";

// charts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#818cf8", "#a78bfa", "#c084fc", "#f472b6", "#fb7185"];

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const contract = await getContract();
      let total = 0;
      let latest = null;
      let perStudent = [];

      for (const wallet of students) {
        const certs = await contract.getCertificates(wallet);
        if (certs.length > 0) {
          total += certs.length;
          perStudent.push({ wallet, count: certs.length });

          for (const c of certs) {
            if (!latest || Number(c.issuedAt) > Number(latest.issuedAt)) {
              latest = { ...c, wallet };
            }
          }
        }
      }

      perStudent.sort((a, b) => b.count - a.count);

      setStats({
        total,
        latest,
        leaderboard: perStudent.slice(0, 5),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = stats
    ? stats.leaderboard.map((x) => ({
        name: x.wallet.slice(0, 6) + "…" + x.wallet.slice(-4),
        certificates: x.count,
      }))
    : [];

  return (
    <motion.div
      className="mt-8 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-semibold text-slate-50">Analytics Dashboard</h2>
        <p className="text-slate-300 text-sm">
          Real-time certificate statistics from the blockchain.
        </p>

        <button className="gradient-btn" onClick={loadAnalytics} disabled={loading}>
          {loading ? "Calculating..." : "Load Analytics"}
        </button>
      </div>

      {stats && (
        <motion.div
          className="glass-card p-6 space-y-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Summary */}
          <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-200">
            <div className="glass-card p-4">
              <p className="text-xs text-slate-400 mb-1">Total Certificates Issued</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>

            <div className="glass-card p-4">
              <p className="text-xs text-slate-400 mb-1">Tracked Students</p>
              <p className="text-2xl font-bold">{students.length}</p>
            </div>

            {stats.latest && (
              <div className="glass-card p-4">
                <p className="text-xs text-slate-400 mb-1">Most Recent Certificate</p>
                <p className="font-semibold text-xs break-all">{stats.latest.ipfsHash}</p>
                <p className="text-[11px]">{stats.latest.wallet}</p>
              </div>
            )}
          </div>

          {/* Bar chart */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-2">
              Certificates per Student
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="certificates">
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-2">
              Distribution of Certificates
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="certificates"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  fill="#8884d8"
                  label
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
