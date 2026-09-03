"use client";
import React from "react";
import { colorPalettes } from "@/app/theme";

type Hero = {
  heading: string;
  desc: string;
  layout: "side" | "vertical" | "cards";  
  aboutSection: string | null;
}

type About = {
   
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
  | string
  | "addSection"
  | null;

  type SectionId = 
    "hero" 
    | "about"
    | "projects"
    | "contact";

export default function HeaderEditor({
  editor,
  setEditor,
}: {
  editor: EditorState;
  setEditor: React.Dispatch<React.SetStateAction<EditorState>>;
}) {
  const imageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo" | "aboutSection",
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const logoUrl = URL.createObjectURL(file);

    setEditor((prev) => ({
      ...prev,
      [field]: logoUrl,
    }));
  };

  return (
    <>
      {/* Header Editor */}
      <div className="space-y-2">
        <h1 className="text-md font-bold text-black">Header</h1>

        <div className="space-y-4 ml-4">
          <div className="space-y-4">
            {/* Logo */}
            <div className="w-full space-y-2">
              <label className="text-sm font-bold text-black">Logo</label>

              <label
                htmlFor="logo-upload"
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
                  <span className="text-sm text-[#334155] font-medium">
                    {editor.logo ? "Uploaded" : "Upload your logo"}
                  </span>
                </div>

                {/* Checkmark Icon (Right) */}
                {editor.logo ? (
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
                  id="logo-upload"
                  type="file"
                  className="hidden"
                  accept="logo/*"
                  onChange={(e) => imageUpload(e, "logo")}
                />
              </label>
            </div>
          </div>

          {/* Menu editor */}
          <div className="">
            <label className="text-sm font-bold text-black">Menus</label>

            <div className="space-y-4">
              <div className="flex items-center gap-3 w-full space-y-2">
                <span className="text-gray-700 font-medium text-sm">1</span>

                {/* 2. The Input Field */}
                <div className="flex-1">
                  <input
                    type="text"
                    defaultValue="Home"
                    className="w-full flex items-center justify-between px-4 py-2 bg-white/60 rounded-xl hover:bg-white/30 transition-all text-gray-700 text-sm"
                  />
                </div>

                {/* Edit Icons */}
                <div className="flex items-center gap-2 text-gray-800">
                  {/* Bold Icon */}
                  <button className="hover:text-black font-black text-lg transition-colors">
                    B
                  </button>

                  {/* Italic Icon */}
                  <button className="hover:text-black font-serif font-bold italic text-lg transition-colors">
                    I
                  </button>

                  {/* Delete/Trash Icon */}
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
              </div>

              {/* Add menu button */}
              <div>
                <button className="w-2/3 ml-4 flex items-center justify-center py-2 gap-2 bg-white/20 border border-black rounded-xl hover:bg-white/30 transition-all">
                  <svg
                    className="w-4 h-4 text-black"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  >
                    <line x1="12" y1="4" x2="12" y2="20" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                  </svg>

                  <p className="text-black text-xs mt-1 font-bold">Add Menu</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
