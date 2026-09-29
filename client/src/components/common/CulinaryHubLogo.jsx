import React from "react";
import { Link } from "react-router-dom";

export default function CulinaryHubLogo({
  className = "",
  linkTo = "/",
  brand = "CulinaryHub",
  logoUrl = "",
}) {
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={brand}
          className="h-9 w-9 rounded-full object-cover shadow-sm ring-1 ring-black/10"
        />
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-maroon text-white shadow-sm">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-5 w-5"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c-1.8 1.5-3 3.6-3 5.8 0 1.4.5 2.7 1.3 3.7L9 21h6l-1.3-8.5c.8-1 1.3-2.3 1.3-3.7C15 6.6 13.8 4.5 12 3z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.2 8.5h5.6M8 11.5h8"
            />
          </svg>
        </span>
      )}
      <span className="font-serif text-xl font-bold tracking-tight text-hub-ink">
        {brand}
      </span>
    </span>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="shrink-0 transition hover:opacity-80">
        {content}
      </Link>
    );
  }
  return content;
}
