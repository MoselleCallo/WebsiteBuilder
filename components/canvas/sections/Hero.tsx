"use client";
import React from "react";
import { colorPalettes } from "@/app/theme";

type Hero = {
  heading: string;
  desc: string;
  layout: "side" | "vertical" | "cards";  
  aboutSection: string | null;
}

type About = {
   
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

type OpenState =
  | "font"
  | "palette"
  | "page"
  | "menu"
  | "view"
  | string
  | "addSection"
  | null;

  type SectionId = 
    "hero" 
    | "about"
    | "projects"
    | "contact";

export default function Hero({
  editor,
  changeView,
}: {
  editor: EditorState;
  changeView: boolean;
}) {
  return (
    <>
      <div
        className={`bg-[var(--color-main)] text-[var(--text-main)] p-12 flex gap-10 w-full rounded-t-xl
            ${
              changeView
                ? "flex-col text-center"
                : editor.sections.hero.layout === "side"
                  ? "flex-row items-center"
                  : "flex-col text-center"
            }
          `}
      >
        {/* Text Group */}
        <div className="flex-1">
          <h1 className="text-6xl font-black text-[var(--text-main)] leading-tight mb-4 uppercase">
            {editor.sections.hero.heading}
          </h1>
          <p className="text-[var(--text-muted)] text-lg">{editor.sections.hero.desc}</p>
        </div>

        {/* logo Wrapper */}
        <div
          className={`flex-1 ${
            editor.sections.hero.aboutSection
              ? "none"
              : "bg-gray-100 aspect-square rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
          }`}
        >
          {editor.sections.hero.aboutSection ? (
            <img
              src={editor.sections.hero.aboutSection}
              alt="logo"
              className="object-contain"
            />
          ) : (
            <span className="text-[var(--text-muted)] text-sm">
              Upload an image
            </span>
          )}
        </div>
      </div>
    </>
  );
}
