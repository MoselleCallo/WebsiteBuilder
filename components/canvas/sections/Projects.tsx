"use client";
import React from "react";
import { EditorState, ViewportMode } from "@/types";
import { isValidUrl } from "@/utils/validation";

export default function Projects({
  editor,
  viewportMode,
}: {
  editor: EditorState;
  viewportMode: ViewportMode;
}) {
  const { items } = editor.sections.projects;

  // Render nothing when there are no projects
  if (items.length === 0) return <></>;

  // In mobile view, show one full-width card at a time in a horizontal,
  // snap-scrolling row. Tablet/desktop keep the multi-column grid.
  const isMobile = viewportMode === "mobile";

  const listClass = isMobile
    ? "flex overflow-x-auto snap-x snap-mandatory gap-6 -mx-12 px-12 pb-4"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

  const cardClass = isMobile
    ? "bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden flex flex-col shrink-0 w-full snap-center"
    : "bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden flex flex-col";

  return (
    <section className="bg-[var(--color-main)] px-12 py-16">
      <h2 className="text-3xl font-black text-[var(--text-main)] mb-10">
        Projects
      </h2>

      <div className={listClass}>
        {items.map((item) => (
          <div key={item.id} className={cardClass}>
            {/* Project image */}
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-5 flex flex-col flex-1 gap-2">
              {/* Title */}
              {item.title && (
                <h3 className="text-lg font-bold text-[var(--text-main)] leading-snug">
                  {item.title}
                </h3>
              )}

              {/* Description */}
              {item.description && (
                <p className="text-[var(--text-muted)] text-sm flex-1 whitespace-pre-line">
                  {item.description}
                </p>
              )}

              {/* Link — only rendered when URL is valid */}
              {isValidUrl(item.link) && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-block py-2 px-4 rounded-full bg-[var(--color-primary)] text-[var(--text-onPrimary)] text-sm font-semibold text-center hover:opacity-90 transition-opacity"
                >
                  View Project
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
