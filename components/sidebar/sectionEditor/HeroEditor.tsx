"use client";
import React, { useState } from "react";
import { EditorState, OpenState } from "@/types";
import { readFileAsDataURI } from "@/utils/imageUpload";

export default function HeroEditor({
  editor,
  setEditor,
  isOpen,
  setIsOpen,
}: {
  editor: EditorState;
  setEditor: React.Dispatch<React.SetStateAction<EditorState>>;
  isOpen: OpenState;
  setIsOpen: React.Dispatch<React.SetStateAction<OpenState>>;
}) {
  const [uploadError, setUploadError] = useState<string | null>(null);

  const imageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const result = await readFileAsDataURI(file);

    if ("error" in result) {
      setUploadError(result.error);
      return;
    }

    setEditor((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        hero: {
          ...prev.sections.hero,
          photo: result.dataUri,
        },
      },
    }));
  };

  const layouts: { label: string; value: "side" | "vertical" | "side-reverse" }[] = [
    { label: "Side", value: "side" },
    { label: "Vertical", value: "vertical" },
    { label: "Side-Reverse", value: "side-reverse" },
  ];

  return (
    <div
      className={`rounded-md bg-[#B8CCDE] space-y-4 px-4 py-2 overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen === "heroSection" ? "max-h-screen" : "max-h-10"
      }`}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <button
            onClick={() =>
              setIsOpen(isOpen === "heroSection" ? null : "heroSection")
            }
            className={`p-1 rounded-full bg-[#ACBECE] transition-transform duration-200 ${
              isOpen === "heroSection" ? "-scale-y-100" : ""
            }`}
          >
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
          <span className="text-gray-700 text-sm">HERO SECTION</span>
        </div>

        {/* Delete icon (placeholder — wired in Task 9) */}
        <button className="ml-2 hover:text-red-600 transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Layout selector */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-black">Layout</label>
        <div className="flex gap-2">
          {layouts.map((l) => (
            <button
              key={l.value}
              onClick={() =>
                setEditor((prev) => ({
                  ...prev,
                  sections: {
                    ...prev.sections,
                    hero: { ...prev.sections.hero, layout: l.value },
                  },
                }))
              }
              className={`flex-1 p-2 rounded border text-sm ${
                editor.sections.hero.layout === l.value
                  ? "bg-[#38BDF8] border-[#38BDF8]"
                  : "border-[#334155]"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content fields */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-black">Content</label>

        {/* Name */}
        <div className="space-y-1">
          <label className="text-xs text-gray-600">Name</label>
          <input
            type="text"
            maxLength={50}
            placeholder="Your Name"
            className="w-full px-4 py-2 bg-white/60 rounded-xl hover:bg-white/30 transition-all text-gray-700 text-sm"
            value={editor.sections.hero.name}
            onChange={(e) =>
              setEditor((prev) => ({
                ...prev,
                sections: {
                  ...prev.sections,
                  hero: { ...prev.sections.hero, name: e.target.value },
                },
              }))
            }
          />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs text-gray-600">Title</label>
          <input
            type="text"
            maxLength={50}
            placeholder="e.g. Front-End Developer"
            className="w-full px-4 py-2 bg-white/60 rounded-xl hover:bg-white/30 transition-all text-gray-700 text-sm"
            value={editor.sections.hero.title}
            onChange={(e) =>
              setEditor((prev) => ({
                ...prev,
                sections: {
                  ...prev.sections,
                  hero: { ...prev.sections.hero, title: e.target.value },
                },
              }))
            }
          />
        </div>

        {/* Tagline */}
        <div className="space-y-1">
          <label className="text-xs text-gray-600">Tagline</label>
          <input
            type="text"
            maxLength={100}
            placeholder="A short line about you"
            className="w-full px-4 py-2 bg-white/60 rounded-xl hover:bg-white/30 transition-all text-gray-700 text-sm"
            value={editor.sections.hero.tagline}
            onChange={(e) =>
              setEditor((prev) => ({
                ...prev,
                sections: {
                  ...prev.sections,
                  hero: { ...prev.sections.hero, tagline: e.target.value },
                },
              }))
            }
          />
        </div>

        {/* Photo upload */}
        <label
          htmlFor="hero-photo-upload"
          className="w-full flex items-center justify-between px-2 py-2 bg-white/20 border border-black rounded-xl hover:bg-white/30 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <span className="text-sm text-black font-medium">
              {editor.sections.hero.photo ? "Photo uploaded" : "Upload your photo"}
            </span>
          </div>

          {editor.sections.hero.photo && (
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}

          <input
            id="hero-photo-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={imageUpload}
          />
        </label>

        {uploadError && (
          <p className="text-red-600 text-xs mt-1">{uploadError}</p>
        )}
      </div>
    </div>
  );
}
