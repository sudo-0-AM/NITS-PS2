export default function CertificateCard({ cert }) {
  return (
    <div className="glass-card p-4 md:p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm md:text-base font-semibold text-slate-50">
          {cert.title}
        </h3>
        <span className="text-[10px] md:text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
          {cert.status || "Verified (mock)"}
        </span>
      </div>

      <p className="text-xs text-slate-300">
        Issuer: <span className="text-slate-100">{cert.issuer}</span>
      </p>

      {cert.type && (
        <p className="text-[11px] text-slate-400">
          Type: <span className="text-slate-200">{cert.type}</span>
        </p>
      )}

      <p className="text-[11px] text-slate-500 font-mono truncate">
        Wallet: {cert.wallet}
      </p>

      {cert.issuedAt && (
        <p className="text-[11px] text-slate-500">
          Issued: <span className="text-slate-300">{cert.issuedAt}</span>
        </p>
      )}

      {cert.link && (
        <a
          href={cert.link}
          target="_blank"
          rel="noreferrer"
          className="mt-2 text-[11px] underline text-indigo-300 hover:text-indigo-200"
        >
          View certificate file
        </a>
      )}
    </div>
  );
}
