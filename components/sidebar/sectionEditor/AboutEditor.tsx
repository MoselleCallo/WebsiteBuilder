"use client";
import React, { useState } from "react";
import { EditorState, OpenState } from "@/types";
import { readFileAsDataURI } from "@/utils/imageUpload";

export default function AboutEditor({
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
        about: {
          ...prev.sections.about,
          image: result.dataUri,
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
        isOpen === "aboutSection" ? "max-h-screen" : "max-h-10"
      }`}
    >
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <button
            onClick={() =>
              setIsOpen(isOpen === "aboutSection" ? null : "aboutSection")
            }
            className={`p-1 rounded-full bg-[#ACBECE] transition-transform duration-200 ${
              isOpen === "aboutSection" ? "-scale-y-100" : ""
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
          <span className="text-gray-700 text-sm">ABOUT SECTION</span>
        </div>
      </div>

      {/* Layout selector — active state derived entirely from editor.sections.about.layout */}
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
                    about: { ...prev.sections.about, layout: l.value },
                  },
                }))
              }
              className={`flex-1 p-2 rounded border text-sm ${
                editor.sections.about.layout === l.value
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
      <div className="space-y-2">
        <label className="text-sm font-bold text-black">Content</label>

        <input
          type="text"
          placeholder="Heading"
          className="flex items-center justify-between px-4 py-2 w-4/5 bg-white/60 rounded-xl hover:bg-white/30 transition-all text-gray-700 text-sm"
          value={editor.sections.about.heading}
          onChange={(e) =>
            setEditor((prev) => ({
              ...prev,
              sections: {
                ...prev.sections,
                about: { ...prev.sections.about, heading: e.target.value },
              },
            }))
          }
        />

        <textarea
          placeholder="Tell your story..."
          className="w-full px-4 py-2 bg-white/60 rounded-xl hover:bg-white/30 transition-all text-gray-700 text-sm"
          rows={4}
          value={editor.sections.about.desc}
          onChange={(e) =>
            setEditor((prev) => ({
              ...prev,
              sections: {
                ...prev.sections,
                about: { ...prev.sections.about, desc: e.target.value },
              },
            }))
          }
        />

        <label
          htmlFor="about-image-upload"
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
              {editor.sections.about.image ? "Image uploaded" : "Upload your image"}
            </span>
          </div>

          {editor.sections.about.image && (
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
            id="about-image-upload"
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
