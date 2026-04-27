const logos = [
  "NORTHWIND",
  "ACME",
  "GLOBEX",
  "CONSTELLA",
  "STRATA",
  "VERTEX",
  "ATLAS",
];

export function Logos() {
  return (
    <section className="border-b border-border bg-background py-12">
      <div className="container">
        <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Trusted by 140+ enterprises — from Series-B startups to listed groups
        </p>
        <div className="mt-8 grid grid-cols-2 items-center justify-items-center gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {logos.map((l) => (
            <span
              key={l}
              className="select-none text-base font-semibold tracking-[0.22em] text-muted-foreground/60 transition-colors duration-300 hover:text-foreground"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
