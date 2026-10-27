"use client";
import React from "react";
import { colorPalettes } from "@/app/theme";
import { EditorState, ViewportMode } from "@/types";

import HeroSection from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import { getVisibleSections } from "./FloatingNav";

export default function Canvas({
  editor,
  viewportMode,
}: {
  editor: EditorState;
  viewportMode: ViewportMode;
}) {
  const fontOptions = {
    inter: "font-inter",
    poppins: "font-poppins",
    montserrat: "font-montserrat",
  };

  const viewportWidth: Record<ViewportMode, string> = {
    mobile: "w-[375px]",
    tablet: "w-[768px]",
    desktop: "w-[1280px]",
  };

  const currentPalette = colorPalettes[editor.theme];

  const navSections = getVisibleSections(editor);

  return (
    <div
      style={
        {
          "--color-main": currentPalette.main,
          "--color-surface": currentPalette.surface,
          "--color-border": currentPalette.border,
          "--color-primary": currentPalette.primary,
          "--color-secondary": currentPalette.secondary,
          "--color-accent": currentPalette.accent,

          "--text-main": currentPalette.textMain,
          "--text-muted": currentPalette.textMuted,
          "--text-onPrimary": currentPalette.textOnPrimary,
        } as React.CSSProperties
      }
      className="px-12 overflow-y-auto h-screen scroll-smooth"
    >
      <div
        className={`relative items-start rounded-xl mx-auto bg-[var(--color-main)] ${fontOptions[editor.font]} ${viewportWidth[viewportMode]}`}
      >
        <header className="sticky top-4 -mb-20 mx-auto rounded-full w-3/4 h-16 z-50 bg-black shadow-2xl items-center">
          <div
            className={`flex items-center p-4 ${
              viewportMode === "mobile" ? "justify-center" : "justify-between"
            }`}
          >
            {/* Logo Container — hidden in mobile viewport */}
            {viewportMode !== "mobile" && (
              <div className="items-center">
                {editor.logo ? (
                  <img
                    src={editor.logo}
                    alt="Logo"
                    className="h-10 object-contain"
                  />
                ) : (
                  <span className="text-white text-[var(--text-muted)]">
                    Logo
                  </span>
                )}
              </div>
            )}

            {/* Menu links — each appears only when its section has content.
                Centered in mobile, aligned to the end otherwise. */}
            <nav className="flex items-center gap-6">
              {navSections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-white text-sm font-semibold hover:text-[var(--color-primary)] transition-colors"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </header>

      {/* Sections */}
      <div id="hero">
        <HeroSection editor={editor} viewportMode={viewportMode} />
      </div>
      <div id="about">
        <About editor={editor} viewportMode={viewportMode} />
      </div>
      <div id="projects">
        <Projects editor={editor} viewportMode={viewportMode} />
      </div>
      <div id="contact">
        <Contact editor={editor} viewportMode={viewportMode} />
      </div>

      {/* Thin footer */}
      <footer className="bg-[var(--color-main)] border-t border-[var(--color-border)] py-4 text-center">
        <p className="text-[var(--text-muted)] text-xs">
          Created with WebsiteBuilder - Moselle Callo 2026
        </p>
      </footer>
      </div>
    </div>
  );
}
