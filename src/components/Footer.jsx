export default function Footer() {
  return (
    <footer className="mt-12 pb-10 px-4 text-center text-[11px] text-slate-400">
      <p>© {new Date().getFullYear()} ChainCred — A decentralized student credential passport.</p>
      <p className="mt-1">
        Built for hackathons. Designed for the future of education.
      </p>
    </footer>
  );
}
