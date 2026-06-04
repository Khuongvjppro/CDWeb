import React from "react";

export default function CheckoutLayout({
  title,
  subtitle,
  stepper,
  main,
  children,
  summary,
}) {
  return (
    <div className="page-shell">
      <div className="page-content section-wrap pt-6 sm:pt-8 lg:pt-10">
        <header className="relative overflow-hidden rounded-[2.25rem] border border-[#d9c2ab] bg-[linear-gradient(135deg,#ead8bd_0%,#f5eadb_58%,#ead5ba_100%)] px-5 py-7 shadow-[0_24px_70px_rgba(90,62,54,0.15)] sm:px-8 sm:py-9 lg:px-10">
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(123,30,43,0.12)_1px,transparent_0)] [background-size:20px_20px]" />
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#7b1e2b]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-[35%] h-48 w-48 rounded-full bg-white/70 blur-3xl" />

          <div className="relative grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d6bda2] bg-white/65 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.26em] text-[#7b1e2b] shadow-sm backdrop-blur">
                Secure checkout
              </span>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-[#5a3e36] sm:text-4xl lg:text-5xl">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#715d52] sm:text-base">
                {subtitle}
              </p>
            </div>
            <div className="lg:justify-self-end">{stepper}</div>
          </div>
        </header>

        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(330px,0.8fr)] lg:items-start">
          <div className="min-w-0">{main || children}</div>
          <div className="min-w-0">{summary}</div>
        </div>
      </div>
    </div>
  );
}
