"use client";
import React from "react";
import { colorPalettes } from "@/app/theme";

type Hero = {
  heading: string;
  desc: string;
  layout: "side" | "vertical";
  image: string | null;
}

type About = {
  heading: string;
  desc: string;
  layout: "side" | "vertical" | "side-reverse";  
  image: string | null;   
}

type Projects = {
  layout: "side" | "vertical" | "side-reverse" | "cards";
  cards: {
    title: string;
    desc: string;
    image: string | null;
  };
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

export default function About({
  editor,
  changeView,
  layoutIsActive,
}: {
  editor: EditorState;
  changeView: boolean;
  layoutIsActive: boolean;
}) {
  const layoutClass =
    editor.sections.about.layout === "vertical"
    ? "flex-col text-center"
    : editor.sections.about.layout === "side"
      ? "flex-row items-center"
      : layoutIsActive
        ? "flex-row-reverse items-center"
        : "flex-row items-center";

  return (
    <>
      <div
        className={`bg-[var(--color-main)] text-[var(--text-main)] p-12 flex gap-10 w-full rounded-t-xl
            ${changeView ? "flex-col text-center" : layoutClass}
          `}
      >
        {/* Text Group */}
        <div className="flex-1">
          <h1 className="text-2xl font-black text-[var(--text-main)] leading-tight mb-4">
            {editor.sections.about.heading}
          </h1>
          <p className="text-[var(--text-muted)] text-md whitespace-pre-line">
            {editor.sections.about.desc}
          </p>
        </div>

        {/* logo Wrapper */}
        <div
          className={`flex-1 ${
            editor.sections.about.image
              ? "none"
              : "bg-gray-100 aspect-square rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
          }`}
        >
          {editor.sections.about.image ? (
            <img
              src={editor.sections.about.image}
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