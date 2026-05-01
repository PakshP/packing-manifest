import { CONTACT_EMAIL, APP_NAME } from "@/lib/config";
import TrailDivider from "@/components/patterns/TrailDivider";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-4">
      <TrailDivider className="mb-6" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-ink-secondary">
        <p>
          Questions?{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-ink-primary underline decoration-border-strong underline-offset-4 hover:decoration-accent-moss"
          >
            Email {CONTACT_EMAIL}
          </a>
        </p>
        <p className="font-mono text-xs uppercase tracking-widest text-ink-tertiary">
          © {year} · {APP_NAME}
        </p>
      </div>
    </footer>
  );
}
