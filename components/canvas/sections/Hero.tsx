"use client";
import React from "react";
import { colorPalettes } from "@/app/theme";

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
                : editor.aboutLayout === "side"
                  ? "flex-row items-center"
                  : "flex-col text-center"
            }
          `}
      >
        {/* Text Group */}
        <div className="flex-1">
          <h1 className="text-6xl font-black text-[var(--text-main)] leading-tight mb-4 uppercase">
            {editor.aboutHeading}
          </h1>
          <p className="text-[var(--text-muted)] text-lg">{editor.aboutDesc}</p>
        </div>

        {/* logo Wrapper */}
        <div
          className={`flex-1 ${
            editor.aboutSection
              ? "none"
              : "bg-gray-100 aspect-square rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
          }`}
        >
          {editor.aboutSection ? (
            <img
              src={editor.aboutSection}
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
