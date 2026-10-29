/**
 * Privacy notice for the demo/pilot form. Portuguese is the text that applies.
 *
 * The controller's name, NIF and contact are placeholders until the operator
 * sets NEXT_PUBLIC_PRIVACY_CONTROLLER_NAME, _NIF and _CONTACT. This file does
 * not contain a real name, tax number or inbox.
 *
 * LEAD_RETENTION_DAYS must match backend LEADS_RETENTION_DAYS (default 365).
 */

export const LEAD_RETENTION_DAYS = 365;

export const CONTROLLER_PLACEHOLDERS = {
  name: "[NOME DO RESPONSÁVEL PELO TRATAMENTO — preencher]",
  nif: "[NIF — preencher]",
  contact: "[EMAIL OU CONTACTO PARA PEDIDOS DE PRIVACIDADE — preencher]",
} as const;

export type ControllerField = { value: string; placeholder: boolean };

export type PrivacyEnv = {
  NEXT_PUBLIC_PRIVACY_CONTROLLER_NAME?: string;
  NEXT_PUBLIC_PRIVACY_CONTROLLER_NIF?: string;
  NEXT_PUBLIC_PRIVACY_CONTROLLER_CONTACT?: string;
};

function field(raw: string | undefined, placeholder: string): ControllerField {
  const value = (raw ?? "").trim();
  if (!value) return { value: placeholder, placeholder: true };
  return { value, placeholder: false };
}

export function privacyController(env: PrivacyEnv = {
  NEXT_PUBLIC_PRIVACY_CONTROLLER_NAME: process.env.NEXT_PUBLIC_PRIVACY_CONTROLLER_NAME,
  NEXT_PUBLIC_PRIVACY_CONTROLLER_NIF: process.env.NEXT_PUBLIC_PRIVACY_CONTROLLER_NIF,
  NEXT_PUBLIC_PRIVACY_CONTROLLER_CONTACT: process.env.NEXT_PUBLIC_PRIVACY_CONTROLLER_CONTACT,
}): {
  name: ControllerField;
  nif: ControllerField;
  contact: ControllerField;
} {
  return {
    name: field(env.NEXT_PUBLIC_PRIVACY_CONTROLLER_NAME, CONTROLLER_PLACEHOLDERS.name),
    nif: field(env.NEXT_PUBLIC_PRIVACY_CONTROLLER_NIF, CONTROLLER_PLACEHOLDERS.nif),
    contact: field(env.NEXT_PUBLIC_PRIVACY_CONTROLLER_CONTACT, CONTROLLER_PLACEHOLDERS.contact),
  };
}

export const leadFormConsent = {
  before:
    "Ao enviar, os dados deste formulário são tratados para responder ao seu pedido, nos termos da",
  href: "/privacidade",
  linkLabel: "política de privacidade",
  after: ". O texto em português é o que prevalece.",
} as const;

export type PrivacySection = { heading: string; paragraphs: string[] };

export function privacySections(retentionDays = LEAD_RETENTION_DAYS): PrivacySection[] {
  return [
    {
      heading: "Que dados são recolhidos",
      paragraphs: [
        "No formulário de pedido de demonstração ou de piloto de 149 euros recolhemos o nome, o email profissional, a empresa, a função e a dimensão da equipa se as indicar, a mensagem se a escrever, e o tipo de pedido (demonstração ou piloto).",
        "Guardamos também a data e a hora do pedido e, se o browser a enviar, a identificação do programa de navegação (user agent). O endereço IP serve só, na memória deste processo, para limitar pedidos abusivos, e não fica gravado no pedido.",
        "Se um campo oculto anti-spam vier preenchido, o pedido é ignorado e não é guardado.",
      ],
    },
    {
      heading: "Para que fins",
      paragraphs: [
        "Os dados servem para responder ao pedido, combinar a demonstração ou o piloto, e tratar a fatura do piloto se avançar. Não usamos estes dados para newsletters nem para decisões automatizadas.",
      ],
    },
    {
      heading: "Fundamento de licitude",
      paragraphs: [
        "O fundamento é o artigo 6.º, n.º 1, alínea b), do RGPD: diligências pré-contratuais a pedido da pessoa que preenche o formulário. Não pedimos um consentimento separado, porque o tratamento é necessário para responder ao pedido que a própria pessoa fez.",
      ],
    },
    {
      heading: "Durante quanto tempo",
      paragraphs: [
        `Cada pedido é apagado ao fim de ${retentionDays} dias. O apagamento corre quando o serviço arranca, quando entra um pedido novo, ou quando a lista interna de pedidos é consultada. Não há uma tarefa separada todas as noites. Se pedir o apagamento antes disso, e não houver outro dever legal de conservar o registo, apagamos o pedido.`,
        "Se mais tarde existir um contrato e uma conta, os dados dessa conta são um tratamento diferente e não estão descritos nesta página.",
      ],
    },
    {
      heading: "Quem recebe os dados e para onde podem ir",
      paragraphs: [
        "O pedido fica na base de dados deste serviço. Se estiver configurado, uma cópia pode seguir por email para a caixa de correio definida pelo responsável, ou por um pedido HTTP para um endereço que o responsável configurou. Esses prestadores não estão nomeados aqui, porque não fazem parte fixa deste software.",
        "Esta página não indica um país de alojamento. Esse local depende de onde o serviço for instalado e tem de ser preenchido pelo responsável antes de o formulário ficar público.",
      ],
    },
    {
      heading: "Direitos",
      paragraphs: [
        "Pode pedir acesso, retificação, apagamento, limitação do tratamento, oposição e, neste caso, portabilidade. Também pode apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD), em www.cnpd.pt.",
        "Os pedidos de privacidade devem ir para o contacto indicado acima. Enquanto esse contacto for o espaço por preencher, o responsável ainda não publicou um endereço para estes pedidos. Esta página não nomeia um encarregado de proteção de dados.",
      ],
    },
    {
      heading: "Email para definir a palavra-passe",
      paragraphs: [
        "Quando é criado um espaço de trabalho, o proprietário pode receber um email com um link de uso único para definir a palavra-passe. O fundamento é o mesmo artigo 6.º, n.º 1, alínea b), do RGPD, já na execução da relação. O link expira (72 horas, salvo configuração diferente). Na base de dados fica só um resumo criptográfico do link, não o link em claro. Esse email não é uma fatura e não confirma um pagamento.",
      ],
    },
  ];
}
