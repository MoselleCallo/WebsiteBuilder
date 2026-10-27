"use client";
import React from "react";
import { EditorState } from "@/types";

type NavSection = { id: string; label: string };

/**
 * Pure function: derives the ordered list of sections that have content.
 * Extracted for testability (Property 12).
 */
export function getVisibleSections(editor: EditorState): NavSection[] {
  const { hero, about, projects, contact } = editor.sections;
  const sections: NavSection[] = [];

  if (
    hero.name.trim() ||
    hero.title.trim() ||
    hero.tagline.trim() ||
    hero.photo
  ) {
    sections.push({ id: "hero", label: "Home" });
  }

  if (about.heading.trim() || about.desc.trim() || about.image) {
    sections.push({ id: "about", label: "About" });
  }

  if (projects.items.length > 0) {
    sections.push({ id: "projects", label: "Projects" });
  }

  if (
    contact.email.trim() ||
    contact.phone.trim() ||
    contact.location.trim() ||
    contact.socialLinks.length > 0
  ) {
    sections.push({ id: "contact", label: "Contact" });
  }

  return sections;
}

export default function FloatingNav({ editor }: { editor: EditorState }) {
  const sections = getVisibleSections(editor);

  // Nothing to navigate to — render nothing
  if (sections.length === 0) return <></>;

  return (
    <nav
      className="sticky top-0 z-50 w-full bg-[var(--color-main)] border-b border-[var(--color-secondary)]"
      style={{ position: "sticky", top: 0 }}
    >
      <ul className="flex items-center justify-center gap-6 py-4 px-6">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="text-[var(--text-main)] text-sm font-semibold hover:text-[var(--color-primary)] transition-colors"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
