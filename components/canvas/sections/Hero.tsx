"use client";
import React from "react";
import { EditorState, ViewportMode } from "@/types";

export default function Hero({
  editor,
  viewportMode,
}: {
  editor: EditorState;
  viewportMode: ViewportMode;
}) {
  const { name, title, tagline, photo, layout } = editor.sections.hero;

  // In mobile view, side layouts are muted — always render vertical.
  const isMobile = viewportMode === "mobile";
  const isVertical = isMobile || layout === "vertical";

  // Container layout
  // Side layouts: no top padding so the image bleeds to the top edge (navbar overlaps it);
  // a min height keeps the hero tall enough for the image to fill.
  const containerClass = isVertical
    ? "flex-col text-center items-center px-12 pt-32 pb-24 gap-10"
    : layout === "side-reverse"
      ? "flex-row-reverse items-stretch min-h-[520px]"
      : "flex-row items-stretch min-h-[520px]";

  // Text column:
  // - vertical: no fixed width, centered
  // - side layouts: fixed half width; extra top padding so text clears the floating navbar
  const textColClass = isVertical
    ? "flex flex-col items-center"
    : "w-1/2 flex flex-col justify-center px-12 pt-32 pb-24";

  // Photo column:
  // - vertical: contained square, normal width
  // - side layouts: fixed half width, full height, edge-to-edge (no padding/margin)
  const photoColClass = isVertical
    ? "w-full max-w-md aspect-square"
    : "w-1/2 self-stretch";

  return (
    <div
      className={`bg-[var(--color-main)] text-[var(--text-main)] flex w-full ${containerClass}`}
    >
      {/* Text group */}
      <div className={textColClass}>
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
        className={`flex items-center justify-center overflow-hidden ${photoColClass} ${
          photo
            ? ""
            : `bg-gray-100 border-2 border-dashed border-gray-300 ${
                isVertical ? "rounded-lg" : ""
              }`
        }`}
      >
        {photo ? (
          <img
            src={photo}
            alt={name || "Profile photo"}
            className={`w-full h-full object-cover ${
              isVertical ? "rounded-lg" : ""
            }`}
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
