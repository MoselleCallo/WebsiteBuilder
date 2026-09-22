"use client";
import React from "react";
import { colorPalettes } from "@/app/theme";

type Hero = {
  heading: string;
  desc: string;
  layout: "side" | "vertical";
  image: string | null;
}

type About = {
   heading: string;
  desc: string;
  layout: "side" | "vertical" | "side-reverse";
  image: string | null;
}

type Projects = {
  layout: "side" | "vertical" | "side-reverse" | "cards";
  cards: {
    title: string;
    desc: string;
    image: string | null;
  };
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

export default function HeaderEditor({
  editor,
  setEditor,
}: {
  editor: EditorState;
  setEditor: React.Dispatch<React.SetStateAction<EditorState>>;
}) {
  const imageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const logoUrl = URL.createObjectURL(file);

    setEditor((prev) => ({
      ...prev,
      logo: logoUrl,
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
                  accept="image/*"
                  onChange={imageUpload}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
