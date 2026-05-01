import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="font-display text-6xl font-extrabold text-foreground sm:text-8xl">404</h1>
      <p className="mt-4 text-lg text-foreground/70">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-[10px] border-2 border-foreground bg-brand-purple px-6 text-sm font-extrabold text-white shadow-[6px_6px_0_hsl(var(--foreground))] transition-transform hover:-translate-y-0.5"
      >
        Go back home
      </Link>
    </div>
  );
}
