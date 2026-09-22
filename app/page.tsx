"use client";
import React, { useState } from "react";
import { colorPalettes } from "@/app/theme"; // CONTINUE COLOR PALLETE AND CLEAN YOUR PARAMETERS

import Header from "@/components/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import Canvas from "@/components/canvas/Canvas";

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

type OpenState =
  | "font"
  | "palette"
  | "page"
  | "menu"
  | "view"
  | "heroSection"
  | "aboutSection"
  | "projectsSection"
  | null;

export default function App() {
  const [editor, setEditor] = useState<EditorState>({
    sections: {
      hero: {
        heading: "LARGE HEADING HERE",
        desc: "Type your description here.",
        layout: "side",
        image: null,
      },

      about: {
        heading: "LARGE HEADING HERE",
        desc: "Type your description here.",
        layout: "side",
        image: null,
      },

      projects: {
        layout: "side",
        cards: {
          title: "PROJECT TITLE",
          desc: "Type your project description here.",
          image: null,
        },
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
  const [layoutIsActive, setLayout] = useState(false);

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
        <Canvas
          editor={editor}
          changeView={changeView}
          layoutIsActive={layoutIsActive}
        />
      </div>
      
      <Sidebar
        editor={editor}
        setEditor={setEditor}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        layoutIsActive={layoutIsActive}
        setLayout={setLayout}
      />
    </main>
  );
}
