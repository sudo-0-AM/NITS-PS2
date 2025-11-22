import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export default function Home() {
  return (
    <motion.div
      className="mt-8 grid lg:grid-cols-[1.3fr,1fr] gap-8 items-center"
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: "easeOut" }}
      variants={variants}
    >
      {/* ------- TEXT SECTION ------- */}
      <div className="glass-card p-6 md:p-10 space-y-6">
        <p className="text-[11px] tracking-[0.25em] uppercase text-slate-400">
          Web3 • Credentials • Digital Identity
        </p>

        <h1 className="text-3xl md:text-4xl font-semibold text-slate-50 leading-tight">
          A tamper-proof academic passport powered by blockchain.
        </h1>

        <p className="text-sm md:text-base text-slate-300 leading-relaxed">
          Universities issue verifiable certificates to a student’s crypto
          wallet. Students own their credentials permanently. Employers verify
          authenticity with one click — no PDFs, no lost documents, no fraud.
        </p>

        <div className="flex flex-wrap gap-3 mt-2">
          <Link to="/issuer" className="gradient-btn text-sm">
            Issue credential
          </Link>
          <Link
            to="/student"
            className="px-4 py-2 rounded-xl border border-white/20 text-sm text-slate-100 bg-white/5 hover:bg-white/10 transition"
          >
            Student dashboard
          </Link>
        </div>

        {/* Key pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mt-6 text-[11px] text-slate-300">
          <div className="glass-card p-3">
            <p className="font-semibold text-slate-100 text-xs">Zero forgery</p>
            <p className="text-[11px] text-slate-400">
              Certificates cannot be edited or faked once on-chain.
            </p>
          </div>
          <div className="glass-card p-3">
            <p className="font-semibold text-slate-100 text-xs">Lifetime access</p>
            <p className="text-[11px] text-slate-400">
              Students never lose records — even if universities shut down.
            </p>
          </div>
          <div className="glass-card p-3">
            <p className="font-semibold text-slate-100 text-xs">Instant verification</p>
            <p className="text-[11px] text-slate-400">
              Employers verify in seconds using wallet address only.
            </p>
          </div>
          <div className="glass-card p-3">
            <p className="font-semibold text-slate-100 text-xs">Privacy first</p>
            <p className="text-[11px] text-slate-400">
              Students decide what to share — no centralized data leaks.
            </p>
          </div>
        </div>
      </div>

      {/* ------- VISUAL SECTION ------- */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 blur-3xl opacity-40 animate-pulse" />
        <div className="relative glass-card p-6 md:p-8 flex flex-col gap-4 text-sm text-slate-200">
          <h3 className="text-base font-semibold text-slate-100">
            Why blockchain for credentials?
          </h3>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            <li>PDF certificates are easy to forge.</li>
            <li>Traditional verification requires manual backend checks.</li>
            <li>
              Blockchain timestamps certificates and proves *who* issued them.
            </li>
            <li>Students gain control over portability and sharing.</li>
          </ul>

          <div className="text-[11px] text-slate-400 mt-2">
            Built for universities, bootcamps, private institutes, internship
            programs and online education platforms.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
