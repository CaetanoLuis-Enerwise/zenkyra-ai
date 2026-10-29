import { privacyController, privacySections, LEAD_RETENTION_DAYS } from "@/lib/privacy";

export const metadata = {
  title: "Política de privacidade",
  description:
    "Informação sobre o tratamento dos dados do formulário de demonstração ou de piloto. O texto em português é o que prevalece.",
};

export default function PrivacyPage() {
  const controller = privacyController();
  const missing = controller.name.placeholder || controller.nif.placeholder || controller.contact.placeholder;
  const sections = privacySections(LEAD_RETENTION_DAYS);

  return (
    <article className="border-b border-border">
      <div className="container max-w-3xl py-16 sm:py-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
          Privacidade
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Política de privacidade
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Esta página descreve o tratamento dos dados pessoais do formulário de pedido de
          demonstração ou de piloto no site Zenkyra. O texto em português é o que prevalece.
          Atualização: 29 de outubro de 2026.
        </p>

        <section className="mt-10 rounded-xl border border-border bg-secondary/40 p-5">
          <h2 className="text-lg font-semibold tracking-tight">
            Responsável pelo tratamento
          </h2>
          {missing && (
            <p className="mt-3 text-sm leading-6">
              Os espaços abaixo estão por preencher. Não são um nome, um NIF nem um contacto
              reais. Não os trate como dados de uma empresa.
            </p>
          )}
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Nome" field={controller.name} />
            <Row label="NIF" field={controller.nif} />
            <Row label="Contacto para pedidos de privacidade" field={controller.contact} />
          </dl>
        </section>

        {sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="text-lg font-semibold tracking-tight">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-sm leading-6 text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-lg font-semibold tracking-tight">English note</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Portuguese is the version that applies. The form collects your name, work email,
            company, and any role, team size and message you add, plus the date and the browser
            user agent, so we can reply to a demo or pilot request. The legal basis is steps
            before a contract, at your request (GDPR Article 6(1)(b)). Requests are deleted after{" "}
            {LEAD_RETENTION_DAYS} days.
            {missing
              ? " The controller name, Portuguese tax number (NIF) and contact shown above are placeholders until they are filled in. They are not real identifiers."
              : " The controller name, NIF and contact shown above come from the site configuration."}
          </p>
        </section>
      </div>
    </article>
  );
}

function Row({
  label,
  field,
}: {
  label: string;
  field: { value: string; placeholder: boolean };
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className={field.placeholder ? "mt-1 font-medium" : "mt-1"}>{field.value}</dd>
    </div>
  );
}
