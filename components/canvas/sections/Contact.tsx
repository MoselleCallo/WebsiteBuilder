"use client";
import React from "react";
import { EditorState, SocialLink } from "@/types";
import { isValidUrl } from "@/utils/validation";

// ── Platform icon registry ────────────────────────────────────────────────────
// Returns an inline SVG for recognized platforms, null otherwise.
function PlatformIcon({ platform }: { platform: string }) {
  const name = platform.toLowerCase().trim();

  if (name === "github") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }

  if (name === "x" || name === "twitter") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 5.897zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    );
  }

  if (name === "youtube") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
      </svg>
    );
  }

  if (name === "dribbble") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.392-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4.006-.816zm-11.62-2.073c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.176zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.545 0-1.08.05-1.6.132zm9.44 3.967c-.22.29-1.955 2.553-5.77 4.054.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.27-6.4z" />
      </svg>
    );
  }

  if (name === "behance") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.69.747-.63.15-1.29.22-1.96.22H0V4.503h6.938zm-.34 4.832c.585 0 1.06-.14 1.42-.4.36-.273.54-.7.54-1.273 0-.32-.06-.58-.18-.79-.12-.21-.29-.376-.5-.5-.21-.124-.45-.21-.72-.257-.27-.05-.55-.07-.83-.07H3.5v3.29h3.1zm.17 5.12c.32 0 .62-.03.9-.09s.53-.17.74-.33c.21-.162.38-.37.5-.63.12-.26.18-.592.18-.99 0-.79-.22-1.35-.67-1.69-.45-.34-1.05-.5-1.8-.5H3.5v4.23h3.27zm8.586-1.44c.35.34.86.51 1.53.51.48 0 .89-.12 1.24-.35.35-.23.57-.48.66-.74h2.56c-.41 1.27-1.04 2.18-1.89 2.73-.85.55-1.88.82-3.09.82-.84 0-1.6-.13-2.28-.4-.68-.27-1.26-.65-1.74-1.14-.48-.5-.85-1.1-1.11-1.8-.26-.7-.39-1.47-.39-2.31 0-.82.13-1.57.4-2.26.27-.7.65-1.3 1.14-1.8.49-.5 1.07-.9 1.75-1.18.68-.28 1.43-.42 2.26-.42.92 0 1.73.18 2.42.54.69.36 1.26.84 1.71 1.45.45.61.77 1.31.97 2.1.2.79.27 1.62.21 2.49h-7.64c.04.77.28 1.36.62 1.71zm2.66-5.28c-.28-.31-.73-.46-1.35-.46-.4 0-.72.07-.98.2-.26.13-.47.3-.63.5-.16.2-.27.42-.33.65-.06.23-.1.45-.11.66h4.02c-.08-.7-.3-1.24-.59-1.55zM19.5 6.5h-4.5V5h4.5v1.5z" />
      </svg>
    );
  }

  if (name === "medium") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    );
  }

  return null;
}

// ── Social link renderer ──────────────────────────────────────────────────────
function SocialLinkItem({ link }: { link: SocialLink }) {
  const icon = <PlatformIcon platform={link.platform} />;
  const hasIcon = icon !== null;
  const validUrl = isValidUrl(link.url);

  if (validUrl) {
    return (
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[var(--color-primary)] hover:opacity-80 transition-opacity"
      >
        {hasIcon ? (
          icon
        ) : (
          <span className="text-sm font-medium">{link.platform}</span>
        )}
        {hasIcon && (
          <span className="text-sm font-medium">{link.platform}</span>
        )}
      </a>
    );
  }

  // Invalid URL — render platform name as plain text only
  return (
    <span className="flex items-center gap-2 text-[var(--text-muted)]">
      {hasIcon ? icon : null}
      <span className="text-sm">{link.platform}</span>
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Contact({ editor }: { editor: EditorState }) {
  const { email, phone, location, socialLinks } = editor.sections.contact;

  const hasContent =
    email || phone || location || socialLinks.length > 0;

  if (!hasContent) return <></>;

  return (
    <section className="bg-[var(--color-main)] px-12 py-16">
      <h2 className="text-3xl font-black text-[var(--text-main)] mb-10">
        Contact
      </h2>

      <div className="flex flex-col gap-4 max-w-lg">
        {/* Email — shown only when non-empty */}
        {email && (
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-[var(--color-primary)] shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="text-[var(--text-main)] text-sm">{email}</span>
          </div>
        )}

        {/* Phone — shown only when non-empty */}
        {phone && (
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-[var(--color-primary)] shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="text-[var(--text-main)] text-sm">{phone}</span>
          </div>
        )}

        {/* Location — shown only when non-empty */}
        {location && (
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-[var(--color-primary)] shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-[var(--text-main)] text-sm">{location}</span>
          </div>
        )}

        {/* Social links */}
        {socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-2">
            {socialLinks.map((link) => (
              <SocialLinkItem key={link.id} link={link} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
