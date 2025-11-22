import { useState } from "react";
import { motion } from "framer-motion";
import { getContract, getProvider } from "../utils/contract"; 
import { writeFileSync } from "../utils/localWrite";

const variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export default function Issuer() {
  const [wallet, setWallet] = useState("");
  const [title, setTitle] = useState("");
  const [issuerName, setIssuerName] = useState("Demo University");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const handleIssue = async (e) => {
    e.preventDefault();
    if (!wallet || !title) {
      setToast("Please fill student wallet and certificate title.");
      return;
    }

    setLoading(true);
    setToast("");

    try {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const contract = await getContract(signer);

      // ⚠ For hackathon demo:
      // using certificate title as hash placeholder
      const tx = await contract.issueCertificate(wallet, title);
      await tx.wait();

      setToast("Certificate issued on blockchain 🚀");
      if (!students.includes(wallet)) {
        students.push(wallet);
        writeFileSync("src/data/students.json", JSON.stringify(students, null, 2));
      }
      setWallet("");
      setTitle("");
    } catch (err) {
      console.error(err);
      if (err.message?.includes("user rejected")) {
        setToast("Transaction rejected in MetaMask ❌");
      } else {
        setToast("Blockchain transaction failed ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="mt-8 grid md:grid-cols-[1.2fr,1fr] gap-6"
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: "easeOut" }}
      variants={variants}
    >
      <div className="glass-card p-6 md:p-7 space-y-4">
        <h2 className="text-xl font-semibold text-slate-50">
          Issuer Dashboard
        </h2>
        <p className="text-xs md:text-sm text-slate-300">
          Issue a blockchain-verified credential to a student wallet.
        </p>

        <form onSubmit={handleIssue} className="space-y-4 text-sm">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">
              Student wallet address
            </label>
            <input
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              placeholder="0xabc..."
              className="w-full rounded-xl bg-slate-900/60 border border-white/15 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300">Certificate title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="B.Tech in Computer Engineering"
              className="w-full rounded-xl bg-slate-900/60 border border-white/15 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300">Issuer name</label>
            <input
              value={issuerName}
              onChange={(e) => setIssuerName(e.target.value)}
              className="w-full rounded-xl bg-slate-900/60 border border-white/15 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            />
          </div>

          <button
            className="gradient-btn w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Issuing..." : "Issue certificate"}
          </button>

          {toast && (
            <p className="text-[11px] text-slate-300 mt-1">{toast}</p>
          )}
        </form>
      </div>

      <div className="glass-card p-6 md:p-7 space-y-4 text-xs text-slate-300 leading-relaxed">
  <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
    <span className="h-2 w-2 bg-indigo-400 rounded-full"></span>
    How Issuing Works on the Blockchain
  </h3>

  <p className="text-[11px] text-slate-400">
    Every credential issued here becomes a permanent, tamper-proof blockchain record.
    This enables global verification without paperwork or third-party validation.
  </p>

  <ol className="list-decimal ml-4 space-y-2 mt-1">
    <li className="text-slate-300">
      <span className="text-slate-100 font-medium">Issuer connects and signs with MetaMask</span><br />
      The institution’s wallet acts as the authenticated identity of the issuer.
    </li>

    <li className="text-slate-300">
      <span className="text-slate-100 font-medium">Smart contract call is executed</span><br />
      <code className="font-mono text-[10px]">issueCertificate(studentWallet, ipfsHash)</code>  
      — this links the student and certificate permanently.
    </li>

    <li className="text-slate-300">
      <span className="text-slate-100 font-medium">Certificate is stored on the Sepolia blockchain</span><br />
      Once mined, the record becomes immutable — nobody can alter or delete it.
    </li>

    <li className="text-slate-300">
      <span className="text-slate-100 font-medium">Students & employers retrieve data instantly</span><br />
      Any wallet can query <code className="font-mono text-[10px]">getCertificates(wallet)</code> to confirm authenticity.
    </li>
  </ol>

  <p className="text-[11px] text-slate-400 pt-2 border-t border-white/5">
    The institution owns issuance. The blockchain guarantees validation — forever.
  </p>
</div>

    </motion.div>
  );
}
