import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { connectWallet } from "../utils/contract";
import { AnimatePresence, motion } from "framer-motion";
import { Home, UserCheck, GraduationCap, Search, BarChart2 } from "lucide-react"; // icons

const links = [
  { to: "/", label: "Home", icon: <Home size={18} /> },
  { to: "/issuer", label: "Issuer", icon: <UserCheck size={18} /> },
  { to: "/student", label: "Student", icon: <GraduationCap size={18} /> },
  { to: "/verify", label: "Verify", icon: <Search size={18} /> },
  { to: "/analytics", label: "Analytics", icon: <BarChart2 size={18} /> },
];

export default function Navbar() {
  const location = useLocation();
  const [wallet, setWallet] = useState("");
  const [open, setOpen] = useState(false);

  const handleConnect = async () => {
    try {
      const addr = await connectWallet();
      setWallet(addr);
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.on("accountsChanged", (accounts) => {
      setWallet(accounts[0] || "");
    });
  }, []);

  const shortAddr = wallet ? wallet.slice(0, 6) + "..." + wallet.slice(-4) : "";

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <nav className="max-w-6xl mx-auto px-4 py-3 md:px-8 md:py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/40" />
            <div>
              <p className="text-sm font-semibold tracking-wide text-slate-100">ChainCred</p>
              <p className="text-[11px] text-slate-400">Student Credential Passport</p>
            </div>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-2 py-1">
            {links.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    active ? "bg-white/20 text-white shadow-sm" : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-slate-200 border border-white/10 px-2 py-1 rounded-lg text-sm"
          >
            ☰
          </button>

          {/* Wallet button (desktop) */}
          <button
            onClick={handleConnect}
            className="hidden md:flex text-[11px] md:text-xs gradient-btn px-3 py-1.5 rounded-2xl"
          >
            {!wallet ? "Connect Wallet" : (
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"/>
                <span className="font-mono">{shortAddr}</span>
              </span>
            )}
          </button>
        </nav>

        {/* Animated Dropdown Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="md:hidden bg-slate-950 border-t border-white/10 px-4 py-3 space-y-3"
            >
              {links.map((link) => {
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`block px-3 py-2 rounded-xl text-xs font-medium ${
                      active ? "bg-white/20 text-white" : "text-slate-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <button
                onClick={handleConnect}
                className="gradient-btn w-full text-[12px] py-2 mt-2 rounded-xl"
              >
                {!wallet ? "Connect Wallet" : shortAddr}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 🔥 Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/90 border-t border-white/10 backdrop-blur-xl">
        <div className="flex justify-around items-center py-2 text-[11px]">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex flex-col items-center gap-0.5 transition ${
                  active ? "text-indigo-300 scale-[1.05]" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
