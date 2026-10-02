"use client";
import React, { useState } from "react";

import Header from "@/components/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import Canvas from "@/components/canvas/Canvas";
import { EditorState, OpenState, DEFAULT_EDITOR_STATE } from "@/types";

export default function App() {
  const [editor, setEditor] = useState<EditorState>(DEFAULT_EDITOR_STATE);

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
