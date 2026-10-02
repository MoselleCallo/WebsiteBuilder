"use client";
import React from "react";
import { EditorState } from "@/types";

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
        className={`bg-[var(--color-main)] text-[var(--text-main)] flex w-full rounded-t-xl
            ${
              changeView
                ? "flex-col text-center"
                : editor.sections.hero.layout === "side"
                  ? "flex-row items-start"
                  : "flex-col text-center"
            }
          `}
      >
        {/* Text Group */}
        <div className="flex-1 px-12 pt-32 pb-32">
          <h1 className="text-6xl font-black text-[var(--text-main)] leading-tight mb-4 uppercase">
            {editor.sections.hero.heading}
          </h1>
          <p className="text-[var(--text-muted)] text-lg">{editor.sections.hero.desc}</p>
        </div>

        {/* logo Wrapper */}
        <div
          className={`flex-1 ${
            editor.sections.hero.image
              ? "none"
              : "bg-gray-100 aspect-square rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
          }`}
        >
          {editor.sections.hero.image ? (
            <img
              src={editor.sections.hero.image}
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
