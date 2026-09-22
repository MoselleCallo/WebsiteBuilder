"use client";
import React from "react";
import { colorPalettes } from "@/app/theme"; // CONTINUE COLOR PALLETE AND CLEAN YOUR PARAMETERS

import ThemeEditor from "./ThemeEditor";
import HeaderEditor from "./HeaderEditor";
import HeroEditor from "./sectionEditor/HeroEditor";
import AboutEditor from "./sectionEditor/AboutEditor";


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

export default function Sidebar({
  editor,
  setEditor,
  isOpen,
  setIsOpen,
  layoutIsActive,
  setLayout,
}: {
  editor: EditorState;
  setEditor: React.Dispatch<React.SetStateAction<EditorState>>;
  isOpen: OpenState;
  setIsOpen: React.Dispatch<React.SetStateAction<OpenState>>;
  layoutIsActive: boolean;
  setLayout: React.Dispatch<React.SetStateAction<boolean>>;
}) {

  const sect = [
    { name: "Hero", value: "hero" },
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

              <div className="ml-4 mt-2 mb-4 space-y-4">
                    <label className="text-sm font-bold text-black">
                      Section
                    </label>

                {/* Section Box Editors */}
                
                          <HeroEditor
                            editor={editor}
                            setEditor={setEditor}
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                          />

                          <AboutEditor
                            editor={editor}
                            setEditor={setEditor}
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            layoutIsActive={layoutIsActive}
                            setLayout={setLayout}
                          />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
