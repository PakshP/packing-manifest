"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          backgroundColor: "rgb(245, 241, 234)",
          color: "rgb(31, 36, 25)",
          fontFamily:
            '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
        }}
      >
        <main
          style={{
            width: "100%",
            maxWidth: "36rem",
            padding: "3rem 2rem",
            border: "1px solid rgb(229, 220, 203)",
            borderRadius: "0.75rem",
            backgroundColor: "rgb(251, 248, 241)",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
          }}
        >
          <p
            style={{
              fontFamily:
                '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              fontSize: "0.6875rem",
              color: "rgb(138, 135, 117)",
              margin: 0,
            }}
          >
            condition&nbsp;·&nbsp;trail closed
          </p>

          <h1
            style={{
              fontFamily: '"Fraunces", ui-serif, Georgia, serif',
              fontSize: "2rem",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              marginTop: "0.875rem",
              marginBottom: 0,
              color: "rgb(31, 36, 25)",
            }}
          >
            The whole route is washed out.
          </h1>

          <p
            style={{
              marginTop: "1rem",
              marginBottom: 0,
              fontSize: "1rem",
              lineHeight: 1.55,
              color: "rgb(74, 82, 70)",
            }}
          >
            Something went wrong loading the application itself. Reload to try
            the path again.
          </p>

          {error?.digest ? (
            <p
              style={{
                marginTop: "1rem",
                marginBottom: 0,
                display: "inline-block",
                padding: "0.375rem 0.75rem",
                border: "1px solid rgb(229, 220, 203)",
                borderRadius: "0.375rem",
                backgroundColor: "rgb(245, 241, 234)",
                fontFamily:
                  '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
                fontSize: "0.75rem",
                color: "rgb(138, 135, 117)",
              }}
            >
              ref&nbsp;·&nbsp;{error.digest}
            </p>
          ) : null}

          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                padding: "0.625rem 1rem",
                borderRadius: "0.375rem",
                border: "1px solid rgb(196, 184, 150)",
                backgroundColor: "rgb(90, 107, 62)",
                color: "rgb(251, 248, 241)",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Reload the trail
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                padding: "0.625rem 1rem",
                borderRadius: "0.375rem",
                border: "1px solid rgb(196, 184, 150)",
                backgroundColor: "rgb(251, 248, 241)",
                color: "rgb(31, 36, 25)",
                fontSize: "0.875rem",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Return to base camp
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
