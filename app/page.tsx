"use client";
import React, { useState } from "react";
import { colorPalettes } from "@/app/theme"; // CONTINUE COLOR PALLETE AND CLEAN YOUR PARAMETERS

import Header from "@/components/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import Canvas from "@/components/Canvas";

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

  type Section = {
    id: string;
    type: string;
  };

export default function App() {
  const [editor, setEditor] = useState<EditorState>({
    aboutHeading: "LARGE HEADING HERE",
    aboutDesc: "Type your description here.",
    aboutLayout: "side",
    font: "inter",
    theme: "Professional",

    logo: null,
    aboutSection: null,
    section: "Hero",
  });

  const [isOpen, setIsOpen] = useState<OpenState>(null);
  const [changeView, setChangeView] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);

  const addSection = (type: string) => {
  const newSection: Section = {
    id: crypto.randomUUID(),
    type: type,
  };

  setSections((prev) => [...prev, newSection]);
};

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
        <Canvas editor={editor} changeView={changeView} />
      </div>
      
      <Sidebar
        editor={editor}
        setEditor={setEditor}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        addSection={addSection}
        sections={sections}
      />
    </main>
  );
}
