import { useState } from "react";
import { motion } from "framer-motion";
import CertificateCard from "../components/CertificateCard";
import { getContract } from "../utils/contract";  // 🔥 blockchain import

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

export default function Verify() {
  const [wallet, setWallet] = useState("");
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [toast, setToast] = useState("");

  const handleVerify = async () => {
    if (!wallet) {
      setToast("Enter candidate wallet first");
      return;
    }

    setToast("");
    setLoading(true);
    setChecked(false);
    setCerts([]);

    try {
      const contract = await getContract();
      const result = await contract.getCertificates(wallet);

      if (!result || result.length === 0) {
        setCerts([]);
        setChecked(true);
        setToast("❌ No on-chain credentials found");
        return;
      }

      const parsed = result.map((c) => ({
        title: c.ipfsHash,                             // title placeholder
        issuer: c.issuer,
        wallet,
        issuedAt: new Date(Number(c.issuedAt) * 1000).toLocaleString(),
        type: "On-chain Credential",
      }));

      setCerts(parsed);
      setChecked(true);
      setToast(`✔ ${parsed.length} credential(s) verified`);
    } catch (err) {
      console.error(err);
      setChecked(true);
      setToast("Blockchain read failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const statusColor =
    toast.includes("✔")
      ? "text-emerald-300"
      : toast.includes("❌")
      ? "text-rose-300"
      : "text-slate-300";

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
          Employer Verification
        </h2>
        <p className="text-xs md:text-sm text-slate-300">
          Enter a candidate's wallet address to verify their credentials on the
          blockchain.
        </p>

        <div className="space-y-3 text-sm">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">
              Candidate wallet address
            </label>
            <input
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              placeholder="0xabc..."
              className="w-full rounded-xl bg-slate-900/60 border border-white/15 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            />
          </div>

          <button
            className="gradient-btn w-full"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? "Verifying on blockchain..." : "Verify credentials"}
          </button>

          {toast && (
            <p className={`text-[11px] mt-1 ${statusColor}`}>{toast}</p>
          )}
        </div>
      </div>

      <div className="glass-card p-6 md:p-7 space-y-4">
        <h3 className="text-sm font-semibold text-slate-100">
          Verification result
        </h3>

        {loading && (
          <div className="grid gap-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {!loading && checked && certs.length === 0 && (
          <p className="text-xs text-rose-300">
            No blockchain credential matches this wallet.
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
