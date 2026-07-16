import { describe, it, expect } from "vitest";
import { isValidEmail } from "../utils/sendEmail.js";

describe("isValidEmail", () => {
  it("accepts valid addresses, including a hyphen in the local part", () => {
    for (const email of [
      "user@example.com",
      "user.name@example.com",
      "user+tag@example.com",
      "user_name@example.com",
      "a-b@example.com",
      "first%last@example.com",
    ]) {
      expect(isValidEmail(email)).toBe(true);
    }
  });

  it("rejects characters outside the intended local-part set", () => {
    for (const email of [
      "a'()*@example.com",
      "a b@example.com",
      "a<b@example.com",
    ]) {
      expect(isValidEmail(email)).toBe(false);
    }
  });

  it("rejects addresses without a valid TLD", () => {
    expect(isValidEmail("a@b")).toBe(false);
    expect(isValidEmail("user@example")).toBe(false);
  });
});
