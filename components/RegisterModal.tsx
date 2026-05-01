'use client';

import { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { isGoogleSheetConfigured, submitRegistrationToSheet } from "@/lib/submitRegistrationToSheet";

const registerSchema = z.object({
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

type RegisterModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const classOptions = [
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
  "Grade 11", "Grade 12",
];

const RegisterModal = ({ open, onOpenChange }: RegisterModalProps) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    studentClass: "",
    school: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const next: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        if (i.path[0]) next[i.path[0] as string] = i.message;
      });
      setErrors(next);
      return;
    }
    setSubmitting(true);
    try {
      if (isGoogleSheetConfigured()) {
        await submitRegistrationToSheet({
          name: result.data.name,
          phone: result.data.phone,
          email: result.data.email,
          address: result.data.address,
          studentClass: result.data.studentClass,
          school: result.data.school || "",
        });
      } else {
        console.warn(
          "[RegisterModal] NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL is not set. Data is only acknowledged locally."
        );
        await new Promise((r) => setTimeout(r, 400));
      }
      toast({
        title: "Registration received! 🎉",
        description: isGoogleSheetConfigured()
          ? "We'll reach out to you shortly."
          : "Saved locally for demo. Add NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL to send rows to Google Sheets.",
      });
      setForm({ name: "", phone: "", email: "", address: "", studentClass: "", school: "" });
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast({
        variant: "destructive",
        title: "Could not submit",
        description: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    "block w-full rounded-[10px] border-2 border-foreground bg-white px-4 py-3 text-sm font-medium text-foreground placeholder:text-foreground/40 shadow-[2px_2px_0_hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-1 focus:ring-offset-background sm:shadow-[4px_4px_0_hsl(var(--foreground))]";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] w-[calc(100vw-1.5rem)] max-w-[560px] overflow-x-hidden overflow-y-auto rounded-[20px] border-2 border-foreground bg-background p-0 shadow-[6px_6px_0_hsl(var(--foreground))] sm:rounded-[24px] sm:shadow-[12px_12px_0_hsl(var(--foreground))]">
        {/* Header strip */}
        <div className="relative overflow-hidden rounded-t-[18px] bg-brand-purple px-5 py-6 sm:rounded-t-[22px] sm:px-8 sm:py-7">
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-brand-lime opacity-80" />
          <div className="absolute -bottom-6 -left-6 h-16 w-16 rounded-full bg-brand-pink opacity-90" />
          <DialogHeader className="relative space-y-2 text-left">
            <span className="inline-block w-fit rounded-full border-2 border-foreground bg-white px-4 py-1 text-xs font-extrabold text-brand-pink">
              Join NeXlab
            </span>
            <DialogTitle className="font-sans text-2xl font-extrabold text-white sm:text-3xl">
              Register Now
            </DialogTitle>
            <DialogDescription className="text-sm text-white/85">
              Fill in your details and we'll get you started on your immersive learning journey.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 pb-7 pr-6 pt-6 sm:px-8 sm:pb-8 sm:pt-6">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-bold text-foreground">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              maxLength={100}
              placeholder="e.g. Aarav Sharma"
              className={inputBase}
            />
            {errors.name && <p className="mt-1 text-xs font-semibold text-brand-red">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-bold text-foreground">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                maxLength={20}
                placeholder="+91 98765 43210"
                className={inputBase}
              />
              {errors.phone && <p className="mt-1 text-xs font-semibold text-brand-red">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                maxLength={255}
                placeholder="you@example.com"
                className={inputBase}
              />
              {errors.email && <p className="mt-1 text-xs font-semibold text-brand-red">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="address" className="mb-1.5 block text-sm font-bold text-foreground">
              Address
            </label>
            <textarea
              id="address"
              rows={2}
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              maxLength={300}
              placeholder="Street, City, State"
              className={`${inputBase} resize-none`}
            />
            {errors.address && <p className="mt-1 text-xs font-semibold text-brand-red">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="studentClass" className="mb-1.5 block text-sm font-bold text-foreground">
                Class / Grade
              </label>
              <select
                id="studentClass"
                value={form.studentClass}
                onChange={(e) => handleChange("studentClass", e.target.value)}
                className={inputBase}
              >
                <option value="">Select grade</option>
                {classOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.studentClass && <p className="mt-1 text-xs font-semibold text-brand-red">{errors.studentClass}</p>}
            </div>
            <div>
              <label htmlFor="school" className="mb-1.5 block text-sm font-bold text-foreground">
                School <span className="font-normal text-foreground/50">(optional)</span>
              </label>
              <input
                id="school"
                type="text"
                value={form.school}
                onChange={(e) => handleChange("school", e.target.value)}
                maxLength={150}
                placeholder="School name"
                className={inputBase}
              />
              {errors.school && <p className="mt-1 text-xs font-semibold text-brand-red">{errors.school}</p>}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex h-12 items-center justify-center rounded-[10px] border-2 border-foreground bg-white px-6 text-sm font-extrabold text-foreground shadow-[4px_4px_0_hsl(var(--foreground))] transition-transform hover:-translate-y-0.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 items-center justify-center rounded-[10px] border-2 border-foreground bg-brand-pink px-6 text-sm font-black text-white shadow-[6px_6px_0_hsl(var(--foreground))] transition-transform hover:-translate-y-0.5 disabled:opacity-70"
            >
              {submitting ? "Submitting..." : "Register Now"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
