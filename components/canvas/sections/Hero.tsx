"use client";
import React from "react";
import { EditorState } from "@/types";

export default function Hero({ editor }: { editor: EditorState }) {
  const { name, title, tagline, photo, layout } = editor.sections.hero;

  const layoutClass =
    layout === "side"
      ? "flex-row items-center"
      : layout === "side-reverse"
        ? "flex-row-reverse items-center"
        : "flex-col text-center items-center";

  return (
    <div
      className={`bg-[var(--color-main)] text-[var(--text-main)] flex gap-10 w-full px-12 pt-32 pb-24 ${layoutClass}`}
    >
      {/* Text group */}
      <div className={`flex-1 ${layout === "vertical" ? "flex flex-col items-center" : ""}`}>
        <h1 className="text-6xl font-black text-[var(--text-main)] leading-tight mb-3 uppercase">
          {name ? (
            name
          ) : (
            <span className="italic text-[var(--text-muted)]">Your Name</span>
          )}
        </h1>

        <p className="text-2xl font-semibold text-[var(--text-main)] mb-2">
          {title ? (
            title
          ) : (
            <span className="italic text-[var(--text-muted)] text-xl font-normal">
              Your Title
            </span>
          )}
        </p>

        <p className="text-[var(--text-muted)] text-lg">
          {tagline ? (
            tagline
          ) : (
            <span className="italic">Your tagline goes here</span>
          )}
        </p>
      </div>

      {/* Photo / placeholder */}
      <div
        className={`flex-1 flex items-center justify-center ${
          photo
            ? ""
            : "bg-gray-100 aspect-square rounded-lg border-2 border-dashed border-gray-300"
        }`}
      >
        {photo ? (
          <img
            src={photo}
            alt={name || "Profile photo"}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-[var(--text-muted)] text-sm">
            Upload a photo
          </span>
        )}
      </div>
    </div>
  );
}
