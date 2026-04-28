import { howItWorks } from "@/lib/mock-data";

export function HowItWorks() {
  return (
    <section className="border-b border-border py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            How it works
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            From signed NDA to a working digital teammate — in three steps.
          </h2>
        </div>

        <div className="relative mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
          {howItWorks.map((s) => (
            <div key={s.step} className="relative text-center md:text-left">
              <div className="mx-auto md:mx-0 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card font-mono text-sm font-medium tracking-tight shadow-elev">
                <span className="bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                  {s.step}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
