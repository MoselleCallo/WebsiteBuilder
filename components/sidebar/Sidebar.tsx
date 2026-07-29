"use client";
import React from "react";
import { colorPalettes } from "@/app/theme"; // CONTINUE COLOR PALLETE AND CLEAN YOUR PARAMETERS

import ThemeEditor from "./ThemeEditor";
import HeaderEditor from "./HeaderEditor";
import HeroEditor from "./sectionEditor/HeroEditor";

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

type OpenState =
  | "font"
  | "palette"
  | "page"
  | "menu"
  | "section"
  | "view"
  | "section"
  | "addSection"
  | null;

export default function Sidebar({
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

  const hero = document.getElementById("hero");

  const sections = [
    { name: "Hero", value: hero },
    { name: "About", value: "about" },
  ];

  return (
    <>
      <div className="w-full md:w-1/4 h-1/3 md:h-full bg-[#A2C2E0] rounded-t-xl flex flex-col">
        <header className="sticky top-0 w-full h-16 z-50 bg-[#B5CADE] rounded-t-xl mb-4">
          <div className="flex justify-between p-4 items-center">
            <p className="text-lg text-black">Editor</p>

            <button>
              <svg
                className="w-5 h-5 text-black"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>

            {/* SIDEBAR 
            <button>
              <svg
                className="w-6 h-6 text-black group-hover:text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
          
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </button> 
            */}
          </div>
        </header>

        <div className="px-4 overflow-y-auto overflow-hidden rounded-t-xl space-y-6">
          <ThemeEditor
            editor={editor}
            setEditor={setEditor}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />

          <hr />

          <HeaderEditor editor={editor} setEditor={setEditor} />

          <hr />

          <div className="space-y-2">
            {/* Body Page Tools */}
            <div className="relative">
              <div className="flex justify-between items-center">
                <h1 className="text-md font-bold text-black">Body</h1>
              </div>

              <div className="ml-4 mb-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center space-y-2">
                    <label className="text-sm font-bold text-black">
                      Section
                    </label>

                    {/* Plus Icon */}
                    <button
                      onClick={() =>
                        setIsOpen(isOpen === "addSection" ? null : "addSection")
                      }
                      className="flex items-center justify-center border-2 border-black w-4 h-4 rounded-full"
                    >
                      <svg
                        className={`w-5 h-5 text-black transition-transform duration-200 ${isOpen === "addSection" ? "rotate-45" : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      >
                        <line x1="12" y1="4" x2="12" y2="20" />
                        <line x1="4" y1="12" x2="20" y2="12" />
                      </svg>
                    </button>

                    {/* TO BE EDITTED */}
                    <ul
                      className={`absolute w-1/2 right-0 top-11 bg-white rounded-md shadow-md transition-all duration-300 ease-in-out origin-top
                  ${
                    isOpen === "addSection"
                      ? "opacity-100 scale-y-100 translate-y-0"
                      : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
                  }`}
                    >
                      {sections.map((s) => (
                        <li
                          key={s.value}
                          onClick={() => {
                            setEditor((prev) => ({
                              ...prev,
                              section: s.value as EditorState["section"],
                            }));
                            setIsOpen(null);
                          }}
                          className="cursor-pointer px-3 py-2 hover:bg-gray-100 hover:rounded-md"
                        >
                          {s.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Section Box Editors */}
                <HeroEditor
                  editor={editor}
                  setEditor={setEditor}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
