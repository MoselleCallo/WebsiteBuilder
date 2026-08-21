"use client";
import React from "react";
import { colorPalettes } from "@/app/theme";

import Hero from "./sections/Hero";

type EditorState = {
  aboutHeading: string;
  aboutDesc: string;
  aboutLayout: "side" | "vertical" | "cards";
  font: "inter" | "poppins" | "montserrat";
  theme: keyof typeof colorPalettes;

  logo: string | null;
  aboutSection: string | null;
  section: "Hero" | "About";
};

  type Section = {
    id: string;
    type: string;
  };

const getLayout = { // continue when other features are completed
  side: {
    title: "flex-row items-center"
  },
  vertical: {
    title: "flex-col text-center"
  },
  cards: "md: flex-col cols-3"
};

export default function Canvas({ editor, changeView, sections }: { editor: EditorState; changeView: boolean; sections: Section[]; }) {
  const fontOptions = {
    inter: "font-inter",
    poppins: "font-poppins",
    montserrat: "font-montserrat",
  };

  const currentPalette = colorPalettes[editor.theme];

  return (
    <div
      style={
        {
          "--color-main": currentPalette.main,
          "--color-primary": currentPalette.primary,
          "--color-secondary": currentPalette.secondary,
          "--color-accent": currentPalette.accent,

          "--text-main": currentPalette.textMain,
          "--text-muted": currentPalette.textMuted,
          "--text-onPrimary": currentPalette.textOnPrimary,
        } as React.CSSProperties
      }
      className="p-12 overflow-y-auto h-screen"
    >
      <div
        className={`rounded-xl mx-auto bg-[var(--color-main)] ${fontOptions[editor.font]}
        ${
          changeView
            ? "w-[375px]" // Device frame dimensions for mobile
            : "w-full" // Native full dimensions for desktop
        } `}
      >
        <header className="relative fixed top-0 w-full h-18 z-50 bg-[var(--color-main)] rounded-t-xl shadow-2xl items-center">
          <div className="flex justify-between p-4 items-center">
            {/* Logo Container */}
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

            {/* Menu side */}
            <div className="flex gap-4">
              <button className="py-2 px-3 bg-[var(--color-secondary)] text-[var(--text-main)] font-semibold text-sm rounded-full">
                Preview
              </button>
              <button className="py-2 px-3 bg-[var(--color-primary)] text-[var(--text-onPrimary)] font-semibold text-sm rounded-full">
                Publish
              </button>
            </div>
          </div>
        </header>

      {/* Sections */}
      {sections.map((s) => {
        if (s.type === "hero")
          return(<Hero editor={editor} changeView={changeView} />)
      })}
      </div>
    </div>
  );
}
