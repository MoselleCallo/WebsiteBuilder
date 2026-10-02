"use client";
import React from "react";
import { EditorState } from "@/types";

export default function About({ editor }: { editor: EditorState }) {
  const { heading, desc, image, layout } = editor.sections.about;

  const layoutClass =
    layout === "vertical"
      ? "flex-col text-center items-center"
      : layout === "side-reverse"
        ? "flex-row-reverse items-center"
        : "flex-row items-center";

  return (
    <div
      className={`bg-[var(--color-main)] text-[var(--text-main)] p-12 flex gap-10 w-full ${layoutClass}`}
    >
      {/* Text group */}
      <div className="flex-1">
        <h1 className="text-2xl font-black text-[var(--text-main)] leading-tight mb-4">
          {heading}
        </h1>
        <p className="text-[var(--text-muted)] text-md whitespace-pre-line">
          {desc}
        </p>
      </div>

      {/* Image / placeholder */}
      <div
        className={`flex-1 ${
          image
            ? ""
            : "bg-gray-100 aspect-square rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
        }`}
      >
        {image ? (
          <img
            src={image}
            alt="About section"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-[var(--text-muted)] text-sm">
            Upload an image
          </span>
        )}
      </div>
    </div>
  );
}
