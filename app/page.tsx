"use client";
import React, { useState } from "react";
import { colorPalettes } from "@/app/theme"; // CONTINUE COLOR PALLETE AND CLEAN YOUR PARAMETERS

import Header from "@/components/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import Canvas from "@/components/canvas/Canvas";

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

export default function App() {
  const [editor, setEditor] = useState<EditorState>({
    sections: {
      hero: {
        heading: "LARGE HEADING HERE",
        desc: "Type your description here.",
        layout: "side",
        aboutSection: null,
      },

      about: {
        
      },

      projects: {
        
      },

      contact: {
        
      },
    },
    
    font: "inter",
    theme: "Professional",
    logo: null,
  });

  const [isOpen, setIsOpen] = useState<OpenState>(null);
  const [changeView, setChangeView] = useState(false);

  return (
    <main className="flex flex-col h-screen bg-[#09213D] overflow-hidden md:flex-row">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          changeView={changeView}
          setChangeView={setChangeView}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setEditor={setEditor}
        />
        <Canvas editor={editor} changeView={changeView}/>
      </div>
      
      <Sidebar
        editor={editor}
        setEditor={setEditor}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </main>
  );
}
