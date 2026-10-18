import { describe, expect, it } from "vitest";
import { readToken, setPasswordErrorMessage, validatePasswords } from "./set-password";

const TOKEN = "AbCdEf0123456789_-xyzAbCdEf0123456789_-xyz";

describe("readToken", () => {
  it("reads ?token= from a query string or URLSearchParams", () => {
    expect(readToken(`?token=${TOKEN}`)).toBe(TOKEN);
    expect(readToken(new URLSearchParams({ token: TOKEN }))).toBe(TOKEN);
  });
  it("rejects missing, too short and too long tokens (backend: 16..256)", () => {
    expect(readToken("")).toBeNull();
    expect(readToken(null)).toBeNull();
    expect(readToken("?token=short")).toBeNull();
    expect(readToken(`?token=${"a".repeat(257)}`)).toBeNull();
  });
});

describe("validatePasswords", () => {
  it("requires 8+ characters (backend min_length=8)", () => {
    expect(validatePasswords("1234567", "1234567")).toMatch(/at least 8/);
  });
  it("requires both fields to match", () => {
    expect(validatePasswords("12345678", "12345679")).toMatch(/do not match/);
  });
  it("accepts a valid pair", () => {
    expect(validatePasswords("correct-horse", "correct-horse")).toBeNull();
  });
});

describe("setPasswordErrorMessage", () => {
  it("explains invalid/expired/used links (backend 400)", () => {
    expect(setPasswordErrorMessage({ status: 400 })).toMatch(/invalid, expired or already used/);
  });
  it("maps network errors", () => {
    expect(setPasswordErrorMessage({ status: 0, kind: "network" })).toMatch(/Cannot reach/);
  });
  it("has a generic fallback", () => {
    expect(setPasswordErrorMessage(new Error("x"))).toBe("Something went wrong. Try again.");
  });
});
