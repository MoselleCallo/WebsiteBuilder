"use client";
import React from "react";
import { colorPalettes } from "@/app/theme";

type Hero = {
  heading: string;
  desc: string;
  layout: "side" | "vertical" | "cards";  
  image: string | null;
}

type About = {
  heading: string;
  desc: string;
  layout: "side" | "vertical" | "side-reverse";
  image: string | null;   
}

type Projects = {

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

type OpenState =
  | "font"
  | "palette"
  | "page"
  | "menu"
  | "view"
  | "heroSection"
  | "aboutSection"
  | null;

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
  const imageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setEditor((prev) => ({
        ...prev,
          sections: {
            ...prev.sections,
            hero: {
              ...prev.sections.hero,
              image: imageUrl,
            }
          }
    }));
  }

  return (
    <div
      className={`rounded-md bg-[#B8CCDE] space-y-4 px-4 py-2 overflow-hidden transition-all duration-300 ease-in-out ${isOpen === "heroSection" ? "max-h-screen" : "max-h-10"}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          {/* Upward Icon */}
          <button
            onClick={() => setIsOpen(isOpen === "heroSection" ? null : "heroSection")}
            className={`p-1 rounded-full bg-[#ACBECE] transition-transform duration-200 ${isOpen === "heroSection" ? "-scale-y-100" : ""}`}
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

          <span className="flex items-center justify-between rounded-xl hover:bg-white/30 transition-all text-gray-700 text-sm">
            HERO SECTION
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-black"> Layout </label>

        <div className="flex gap-4">
          <button
            onClick={(e) =>
              setEditor((prev) => ({
                ...prev,
                sections: {
                  ...prev.sections, 
                    hero: {
                      ...prev.sections.hero,
                      layout: "side",
            },},}))
            }
            className={`flex-1 p-2 rounded border ${
              editor.sections.hero.layout === "side"
                ? "bg-[#38BDF8] border-[#38BDF8]"
                : "border-[#334155]"
            }`}
          >
            {" "}
            Side{" "}
          </button>

          <button
            onClick={(e) =>
              setEditor((prev) => ({
                ...prev,
                sections: {
                  ...prev.sections,
                  hero: {
                    ...prev.sections.hero,
                    layout: "vertical",
                  },
                },
              }))
            }
            className={`flex-1 p-2 rounded border ${
              editor.sections.hero.layout === "vertical"
                ? "bg-[#38BDF8] border-[#38BDF8]"
                : "border-[#334155]"
            }`}
          >
            {" "}
            Vertical{" "}
          </button>

          <button
            onClick={(e) =>
              setEditor((prev) => ({
                ...prev,
                sections: {
                  ...prev.sections,
                  hero: {
                    ...prev.sections.hero,
                    layout: "cards",
                  }
                }
              }))
            }
            className={`flex-1 p-2 rounded border ${
              editor.sections.hero.layout === "cards"
                ? "bg-[#38BDF8] border-[#38BDF8]"
                : "border-[#334155]"
            }`}
          >
            {" "}
            Cards{" "}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-black">Content</label>

        <input
          type="text"
          className="flex items-center justify-between px-4 py-2 w-4/5 bg-white/60 rounded-xl hover:bg-white/30 transition-all text-gray-700 text-sm"
          value={editor.sections.hero.heading}
          onChange={(e) =>
            setEditor((prev) => ({
              ...prev,
              sections: {
                ...prev.sections,
                hero: {
                  ...prev.sections.hero,
                    heading: e.target.value,
                },
              },
            }))
          }
        />

        <textarea
          className="w-full items-center justify-between px-4 py-2 bg-white/60 rounded-xl hover:bg-white/30 transition-all text-gray-700 text-sm"
          rows={4}
          value={editor.sections.hero.desc}
          onChange={(e) =>
            setEditor((prev) => ({
              ...prev,
              sections: {
                ...prev.sections,
                hero:{
                ...prev.sections.hero,
                desc: e.target.value,
                },
              },
            }))
          }
        ></textarea>

        <label
          htmlFor="image-upload"
          className="w-full flex items-center justify-between px-2 py-2 bg-white/20 border border-black rounded-xl hover:bg-white/30 transition-all"
        >
          <div className="flex items-center gap-3">
            {/* Upload Icon (Left) */}
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

            {/* Text */}
            <span className="text-sm text-black font-medium">
              {editor.sections.hero.image ? "Uploaded" : "Upload your image"}
            </span>
          </div>

          {/* Checkmark Icon (Right) */}
          {editor.sections.hero.image ? (
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
          ) : null}

          {/* HIDDEN ACTUAL INPUT */}
          <input
            id="image-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={imageUpload}
          />
        </label>
      </div>
    </div>
  );
}
