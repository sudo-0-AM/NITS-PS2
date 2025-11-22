import { useState } from "react";
import { motion } from "framer-motion";
import CertificateCard from "../components/CertificateCard";
import { getContract } from "../utils/contract";   // 🔥 blockchain import

const variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

function SkeletonCard() {
  return (
    <div className="glass-card p-4 md:p-5 animate-pulse space-y-2">
      <div className="h-4 w-2/3 bg-slate-500/40 rounded" />
      <div className="h-3 w-1/2 bg-slate-500/30 rounded" />
      <div className="h-3 w-full bg-slate-500/20 rounded" />
    </div>
  );
}

export default function Student() {
  const [wallet, setWallet] = useState("");
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const handleFetch = async () => {
    if (!wallet) {
      setToast("Please enter wallet address");
      return;
    }

    setLoading(true);
    setToast("");
    setCerts([]);

    try {
      const contract = await getContract();
      const result = await contract.getCertificates(wallet);

      if (!result || result.length === 0) {
        setToast("No credentials found for this wallet ❌");
        return;
      }

      const parsed = result.map((c) => ({
        title: c.ipfsHash, // temporarily using title as hash placeholder
        issuer: c.issuer,
        wallet,
        issuedAt: new Date(Number(c.issuedAt) * 1000).toLocaleString(),
        type: "On-chain Credential",
      }));

      setCerts(parsed);
      setToast(`✔ Loaded ${parsed.length} credential(s)`);

    } catch (err) {
      console.error(err);
      setToast("Failed to read blockchain ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="mt-8 grid md:grid-cols-[1.05fr,1.3fr] gap-6"
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: "easeOut" }}
      variants={variants}
    >
      <div className="glass-card p-6 md:p-7 space-y-4">
        <h2 className="text-xl font-semibold text-slate-50">
          Student Dashboard
        </h2>
        <p className="text-xs md:text-sm text-slate-300">
          View all credentials stored on the blockchain for your wallet.
        </p>

        <div className="space-y-3 text-sm">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Your wallet address</label>
            <input
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              placeholder="0xabc..."
              className="w-full rounded-xl bg-slate-900/60 border border-white/15 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            />
          </div>

          <button
            className="gradient-btn w-full"
            onClick={handleFetch}
            disabled={loading}
          >
            {loading ? "Fetching from blockchain..." : "Fetch my credentials"}
          </button>

          {toast && (
            <p className="text-[11px] text-slate-300 mt-1">{toast}</p>
          )}
        </div>
      </div>

      <div className="glass-card p-6 md:p-7 space-y-4">
        <h3 className="text-sm font-semibold text-slate-100">
          Credentials
        </h3>

        {loading && (
          <div className="grid gap-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {!loading && certs.length === 0 && !toast && (
          <p className="text-xs text-slate-400">
            Enter a wallet and fetch credentials.
          </p>
        )}

        {!loading && certs.length > 0 && (
          <div className="grid gap-3">
            {certs.map((c, i) => (
              <CertificateCard key={i} cert={c} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
