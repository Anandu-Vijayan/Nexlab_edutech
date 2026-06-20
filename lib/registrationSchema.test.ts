import { describe, expect, it } from "vitest";
import {
  parseRegistrationSubmit,
  registrationFieldsSchema,
  toSheetPayload,
} from "./registrationSchema";

const validFields = {
  name: "Aarav Sharma",
  phone: "9876543210",
  email: "aarav@example.com",
  address: "123 Main Street, Kochi",
  studentClass: "Grade 8",
  course: "Nexup course (Prekg to +2) (academics)",
  school: "Demo School",
};

const validPayload = {
  ...validFields,
  website: "",
  formOpenedAt: Date.now() - 5000,
};

function fieldError(result: ReturnType<typeof registrationFieldsSchema.safeParse>, field: string) {
  if (result.success) return undefined;
  return result.error.issues.find((issue) => issue.path[0] === field)?.message;
}

describe("registrationFieldsSchema", () => {
  it("accepts valid registration fields", () => {
    const result = registrationFieldsSchema.safeParse(validFields);
    expect(result.success).toBe(true);
  });

  it("allows an empty optional school field", () => {
    const result = registrationFieldsSchema.safeParse({ ...validFields, school: "" });
    expect(result.success).toBe(true);
  });

  it.each([
    ["name", { name: "" }, "Full name is required"],
    ["phone", { phone: "" }, "Phone number is required"],
    ["email", { email: "" }, "Email is required"],
    ["address", { address: "" }, "Address is required"],
    ["studentClass", { studentClass: "" }, "Please select a class / grade"],
    ["course", { course: "" }, "Please select a course"],
  ] as const)("rejects empty %s", (_field, override, message) => {
    const result = registrationFieldsSchema.safeParse({ ...validFields, ...override });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldError(result, _field)).toBe(message);
    }
  });

  it("rejects a name that is too short", () => {
    const result = registrationFieldsSchema.safeParse({ ...validFields, name: "A" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldError(result, "name")).toBe("Name must be at least 2 characters");
    }
  });

  it.each([
    ["letters", "abc123"],
    ["spaces and plus sign", "+91 98765 43210"],
    ["symbols", "98765-43210"],
  ])("rejects phone numbers with %s", (_label, phone) => {
    const result = registrationFieldsSchema.safeParse({ ...validFields, phone });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldError(result, "phone")).toBe("Phone number must contain digits only");
    }
  });

  it("rejects a phone number that is too short", () => {
    const result = registrationFieldsSchema.safeParse({ ...validFields, phone: "12345" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldError(result, "phone")).toBe("Phone number is too short");
    }
  });

  it("rejects a phone number that is too long", () => {
    const result = registrationFieldsSchema.safeParse({
      ...validFields,
      phone: "1".repeat(16),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldError(result, "phone")).toBe("Phone number is too long");
    }
  });

  it.each([
    ["missing @", "not-an-email"],
    ["missing domain", "user@"],
    ["missing local part", "@example.com"],
  ])("rejects invalid email format: %s", (_label, email) => {
    const result = registrationFieldsSchema.safeParse({ ...validFields, email });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldError(result, "email")).toBe("Enter a valid email address");
    }
  });

  it("accepts a valid email address", () => {
    const result = registrationFieldsSchema.safeParse({
      ...validFields,
      email: "student.name+tag@school.edu",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an address that is too short", () => {
    const result = registrationFieldsSchema.safeParse({ ...validFields, address: "abc" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldError(result, "address")).toBe("Address is too short");
    }
  });
});

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

describe("toSheetPayload", () => {
  it("maps validated registration data to sheet columns", () => {
    const parsed = parseRegistrationSubmit(validPayload);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    expect(toSheetPayload(parsed.data)).toEqual({
      name: validFields.name,
      phone: validFields.phone,
      email: validFields.email,
      address: validFields.address,
      studentClass: validFields.studentClass,
      course: validFields.course,
      school: validFields.school,
    });
  });

  it("uses an empty string when school is omitted", () => {
    const parsed = parseRegistrationSubmit({ ...validPayload, school: "" });
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    expect(toSheetPayload(parsed.data).school).toBe("");
  });
});
