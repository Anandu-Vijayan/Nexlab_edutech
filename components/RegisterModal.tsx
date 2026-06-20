'use client';

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { registrationFieldsSchema } from "@/lib/registrationSchema";
import { isRegistrationConfigured, submitRegistrationToSheet } from "@/lib/submitRegistrationToSheet";

type RegisterModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const classOptions = [
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
  "Grade 11", "Grade 12",
];

const courseOptions = [
  "Nexseed course (Prekg to +2) (foundation)",
  "Nexup course (Prekg to +2) (academics)",
  "Vedic maths 5 to 10 (Non-NeXseed students)",
  "Speak lab course",
  "Vacation courses",
  "Madrasa classes",
  "Arabic reading and writing",
];

const SUBMIT_COOLDOWN_MS = 30_000;

const RegisterModal = ({ open, onOpenChange }: RegisterModalProps) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitCooldown, setSubmitCooldown] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formOpenedAtRef = useRef<number>(Date.now());
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    studentClass: "",
    course: "",
    school: "",
    website: "",
  });

  useEffect(() => {
    if (open) {
      formOpenedAtRef.current = Date.now();
      setForm((p) => ({ ...p, website: "" }));
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    isRegistrationConfigured().then((value) => {
      if (!cancelled) setConfigured(value);
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleChange = (field: keyof typeof form, value: string) => {
    const nextValue = field === "phone" ? value.replace(/\D/g, "") : value;
    setForm((p) => ({ ...p, [field]: nextValue }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = registrationFieldsSchema.safeParse(form);
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
      if (configured === true) {
        const submitResult = await submitRegistrationToSheet({
          name: result.data.name,
          phone: result.data.phone,
          email: result.data.email,
          address: result.data.address,
          studentClass: result.data.studentClass,
          course: result.data.course,
          school: result.data.school || "",
          website: form.website,
          formOpenedAt: formOpenedAtRef.current,
        });

        if (!submitResult.ok) {
          if (submitResult.retryAfterSeconds) {
            const minutes = Math.max(1, Math.ceil(submitResult.retryAfterSeconds / 60));
            toast({
              variant: "destructive",
              title: "Too many attempts",
              description: `Please try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
            });
          } else {
            toast({
              variant: "destructive",
              title: "Could not submit",
              description: submitResult.error || "Something went wrong. Please try again.",
            });
          }
          return;
        }
      } else {
        console.warn(
          "[RegisterModal] GOOGLE_SHEETS_WEB_APP_URL is not set on the server. Data is only acknowledged locally."
        );
        await new Promise((r) => setTimeout(r, 400));
      }

      toast({
        title: "Registration received! 🎉",
        description: configured
          ? "We'll reach out to you shortly."
          : "Saved locally for demo. Set GOOGLE_SHEETS_WEB_APP_URL in .env to send rows to Google Sheets.",
      });
      setForm({ name: "", phone: "", email: "", address: "", studentClass: "", course: "", school: "", website: "" });
      setSubmitCooldown(true);
      window.setTimeout(() => setSubmitCooldown(false), SUBMIT_COOLDOWN_MS);
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
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={form.website}
            onChange={(e) => handleChange("website", e.target.value)}
            className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
          />

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
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                maxLength={15}
                placeholder="9876543210"
                className={inputBase}
                aria-invalid={Boolean(errors.phone)}
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

          <div>
            <label htmlFor="course" className="mb-1.5 block text-sm font-bold text-foreground">
              Course
            </label>
            <select
              id="course"
              value={form.course}
              onChange={(e) => handleChange("course", e.target.value)}
              className={inputBase}
            >
              <option value="">Select course</option>
              {courseOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.course && <p className="mt-1 text-xs font-semibold text-brand-red">{errors.course}</p>}
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
              disabled={submitting || submitCooldown}
              className="inline-flex h-12 items-center justify-center rounded-[10px] border-2 border-foreground bg-brand-pink px-6 text-sm font-black text-white shadow-[6px_6px_0_hsl(var(--foreground))] transition-transform hover:-translate-y-0.5 disabled:opacity-70"
            >
              {submitting ? "Submitting..." : submitCooldown ? "Please wait..." : "Register Now"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
