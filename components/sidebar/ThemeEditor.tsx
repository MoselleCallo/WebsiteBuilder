"use client";
import React from "react";
import { colorPalettes } from "@/app/theme"; // CONTINUE COLOR PALLETE AND CLEAN YOUR PARAMETERS

type EditorState = {
  aboutHeading: string;
  aboutDesc: string;
  aboutLayout: "side" | "vertical" | "cards";
  font: "inter" | "poppins" | "montserrat";
  theme: keyof typeof colorPalettes;
  logo: string | null;
  aboutSection: string | null;
};

type OpenState = | "font"
  | "palette"
  | "page"
  | "menu"
  | "section"
  | "view"
  | "section"
  | "addSection"
  | null;

export default function ThemeEditor({
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
  const fonts = [
    { name: "Classic", value: "inter" },
    { name: "Clean", value: "montserrat" },
    { name: "Modern", value: "poppins" },
  ];

  return (
    <>
      {/* Full Page Theme */}
      <div className="mb-4 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">Palette</label>

          <div className="relative">
            {/* Select Bar */}
            <button
              onClick={() => setIsOpen(isOpen === "palette" ? null : "palette")}
              className="w-full flex items-center justify-between px-2 py-2 bg-white/20 border border-black rounded-xl hover:bg-white/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    backgroundColor: colorPalettes[editor.theme].main,
                  }}
                  className="w-5 h-5 rounded-md shadow-sm"
                />
                <span className="text-[#334155] text-sm font-medium">
                  {editor.theme}
                </span>
              </div>

              {/* Down Arrow */}
              <svg
                className={`w-5 h-5 text-gray-800 transition-transform duration-200 ${isOpen === "palette" ? "-scale-y-100" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <ul
              className={`absolute w-full left-0 bg-white rounded-md shadow-md transition-all duration-300 ease-in-out origin-top
                  ${
                    isOpen === "palette"
                      ? "opacity-100 scale-y-100 translate-y-0 z-50"
                      : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
                  }`}
            >
              {Object.keys(colorPalettes).map((palette) => (
                <li
                  key={palette}
                  onClick={() => {
                    setEditor((prev) => ({
                      ...prev,
                      theme: palette as EditorState["theme"],
                    }));
                    setIsOpen(null);
                  }}
                  className="cursor-pointer flex gap-3 px-3 py-2 hover:bg-gray-100 hover:rounded-md"
                >
                  <div
                    style={{
                      backgroundColor:
                        colorPalettes[palette as keyof typeof colorPalettes]
                          .main,
                    }}
                    className="w-5 h-5 rounded-md shadow-sm"
                  />
                  {palette}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Full Page Font */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">Font</label>

          <div className="relative">
            {/* Select Bar */}
            <button
              onClick={() => setIsOpen(isOpen === "font" ? null : "font")}
              className="w-full flex items-center justify-between px-2 py-2 bg-white/20 border border-black rounded-xl hover:bg-white/30 transition-all"
            >
              <span className="text-[#334155] text-sm font-medium">
                {editor.font === "inter"
                  ? "Classic"
                  : editor.font === "poppins"
                    ? "Modern"
                    : "Clean"}
              </span>

              {/* Down Arrow */}
              <svg
                className={`w-5 h-5 text-gray-800 transition-transform duration-200 ${
                  isOpen === "font" ? "-scale-y-100" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <ul
              className={`absolute w-full left-0 bg-white rounded-md shadow-md transition-all duration-300 ease-in-out origin-top
                  ${
                    isOpen === "font"
                      ? "opacity-100 scale-y-100 translate-y-0"
                      : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
                  }`}
            >
              {fonts.map((f) => (
                <li
                  key={f.value}
                  onClick={() => {
                    setEditor((prev) => ({
                      ...prev,
                      font: f.value as EditorState["font"],
                    }));
                    setIsOpen(null);
                  }}
                  className="cursor-pointer px-3 py-2 hover:bg-gray-100 hover:rounded-md"
                >
                  {f.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
