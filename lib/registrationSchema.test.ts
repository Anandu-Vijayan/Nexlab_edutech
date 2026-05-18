import { describe, expect, it } from "vitest";
import { parseRegistrationSubmit } from "./registrationSchema";

const validPayload = {
  name: "Aarav Sharma",
  phone: "+91 98765 43210",
  email: "aarav@example.com",
  address: "123 Main Street, Kochi",
  studentClass: "Grade 8",
  school: "Demo School",
  website: "",
  formOpenedAt: Date.now() - 5000,
};

describe("parseRegistrationSubmit", () => {
  it("accepts valid registration data", () => {
    const result = parseRegistrationSubmit(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = parseRegistrationSubmit({ ...validPayload, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid phone", () => {
    const result = parseRegistrationSubmit({ ...validPayload, phone: "abc" });
    expect(result.success).toBe(false);
  });

  it("rejects non-empty honeypot", () => {
    const result = parseRegistrationSubmit({ ...validPayload, website: "http://spam.example" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "website")).toBe(true);
    }
  });

  it("rejects submissions faster than minimum fill time", () => {
    const result = parseRegistrationSubmit({
      ...validPayload,
      formOpenedAt: Date.now() - 500,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "formOpenedAt")).toBe(true);
    }
  });
});
