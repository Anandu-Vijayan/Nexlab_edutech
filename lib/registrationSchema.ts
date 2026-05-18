import { z } from "zod";

const MIN_FORM_FILL_MS = 3000;

export const registrationFieldsSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{6,18}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Invalid email").max(255, "Email too long"),
  address: z.string().trim().min(5, "Address is too short").max(300, "Address too long"),
  studentClass: z.string().min(1, "Please select a class"),
  school: z.string().trim().max(150, "School name too long").optional().or(z.literal("")),
});

export const registrationSubmitSchema = registrationFieldsSchema
  .extend({
    website: z.string().max(0).optional(),
    formOpenedAt: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.website && data.website.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid submission",
        path: ["website"],
      });
    }
    if (data.formOpenedAt !== undefined) {
      const elapsed = Date.now() - data.formOpenedAt;
      if (elapsed < MIN_FORM_FILL_MS) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please take a moment to complete the form",
          path: ["formOpenedAt"],
        });
      }
    }
  });

export type RegistrationFields = z.infer<typeof registrationFieldsSchema>;
export type RegistrationSubmitPayload = z.infer<typeof registrationSubmitSchema>;

export function parseRegistrationSubmit(body: unknown) {
  return registrationSubmitSchema.safeParse(body);
}

export function toSheetPayload(data: RegistrationSubmitPayload) {
  return {
    name: data.name,
    phone: data.phone,
    email: data.email,
    address: data.address,
    studentClass: data.studentClass,
    school: data.school || "",
  };
}
