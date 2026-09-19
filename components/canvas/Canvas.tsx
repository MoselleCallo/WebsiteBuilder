"use client";
import React from "react";
import { colorPalettes } from "@/app/theme";

import Hero from "./sections/Hero";
import About from "./sections/About";

type Hero = {
  heading: string;
  desc: string;
  layout: "side" | "vertical" | "cards";  
  image: string | null;
}

type About = {
  heading: string;
  desc: string;
  layout: "side" | "vertical" | "side-reverse";  
  image: string | null;   
}

type Projects = {

}

type Contact = {
  
}

type EditorState = {
  sections: {
    hero: Hero;
    about: About;
    projects: Projects;
    contact: Contact;
  }

  font: "inter" | "poppins" | "montserrat";
  theme: keyof typeof colorPalettes;
  logo: string | null;
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

export default function Canvas({
  editor,
  changeView,
  layoutIsActive,
}: {
  editor: EditorState;
  changeView: boolean;
  layoutIsActive: boolean;
}) {
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
      className="px-12 overflow-y-auto h-screen"
    >
      <div
        className={`relative items-start rounded-xl mx-auto bg-[var(--color-main)] ${fontOptions[editor.font]}
        ${
          changeView
            ? "w-[375px]" // Device frame dimensions for mobile
            : "w-full" // Native full dimensions for desktop
        } `}
      >
        <header className="absolute top-8 left-1/2 -translate-x-1/2 rounded-full w-3/4 h-16 z-50 bg-black shadow-2xl items-center">
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
      <Hero editor={editor} changeView={changeView} />
      <About editor={editor} changeView={changeView} layoutIsActive={layoutIsActive}/>
      </div>
    </div>
  );
}
