import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PrivacyPage from "@/app/(marketing)/privacidade/page";
import {
  CONTROLLER_PLACEHOLDERS,
  LEAD_RETENTION_DAYS,
  leadFormConsent,
  privacyController,
  privacySections,
} from "./privacy";

describe("privacy notice placeholders", () => {
  it("leaves the controller name, NIF and contact empty of real values", () => {
    const controller = privacyController({});
    expect(controller.name).toEqual({ value: CONTROLLER_PLACEHOLDERS.name, placeholder: true });
    expect(controller.nif).toEqual({ value: CONTROLLER_PLACEHOLDERS.nif, placeholder: true });
    expect(controller.contact).toEqual({
      value: CONTROLLER_PLACEHOLDERS.contact,
      placeholder: true,
    });
    const blob = `${controller.name.value} ${controller.nif.value} ${controller.contact.value}`;
    expect(blob).toContain("preencher");
    expect(blob).not.toMatch(/\d{9}/);
    expect(blob).not.toMatch(/@/);
  });

  it("shows operator-supplied values only when they are actually set", () => {
    const controller = privacyController({
      NEXT_PUBLIC_PRIVACY_CONTROLLER_NAME: "  Nome vindo do ambiente  ",
      NEXT_PUBLIC_PRIVACY_CONTROLLER_NIF: "",
      NEXT_PUBLIC_PRIVACY_CONTROLLER_CONTACT: "privacidade@example.com",
    });
    expect(controller.name).toEqual({ value: "Nome vindo do ambiente", placeholder: false });
    expect(controller.nif.placeholder).toBe(true);
    expect(controller.contact.value).toBe("privacidade@example.com");
  });
});

describe("privacy notice contents", () => {
  it("covers collection, purpose, basis, retention and rights in Portuguese", () => {
    const text = privacySections()
      .flatMap((section) => [section.heading, ...section.paragraphs])
      .join("\n");
    expect(text).toContain("user agent");
    expect(text).toContain("não fica gravado");
    expect(text).toContain("artigo 6.º, n.º 1, alínea b)");
    expect(text).toContain(`${LEAD_RETENTION_DAYS} dias`);
    expect(LEAD_RETENTION_DAYS).toBe(365);
    expect(text).toContain("acesso, retificação, apagamento");
    expect(text).toContain("CNPD");
    expect(text).toContain("resumo criptográfico");
    expect(text).not.toMatch(/\b\d{9}\b/);
  });

  it("points the form at the privacy page", () => {
    expect(leadFormConsent.href).toBe("/privacidade");
    expect(leadFormConsent.linkLabel).toBe("política de privacidade");
    expect(leadFormConsent.before).toContain("Ao enviar");
    expect(leadFormConsent.after).toContain("português");
  });

  it("renders the placeholders and the consent topics on the page", () => {
    const html = renderToStaticMarkup(createElement(PrivacyPage));
    expect(html).toContain(CONTROLLER_PLACEHOLDERS.name);
    expect(html).toContain(CONTROLLER_PLACEHOLDERS.nif);
    expect(html).toContain(CONTROLLER_PLACEHOLDERS.contact);
    expect(html).toContain("Não são um nome, um NIF nem um contacto");
    expect(html).toContain("artigo 6.º, n.º 1, alínea b)");
    expect(html).toContain("365 dias");
    expect(html).toContain("www.cnpd.pt");
    expect(html).not.toMatch(/\b\d{9}\b/);
  });
});
