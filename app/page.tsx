"use client";
import React, { useState } from "react";

import Header from "@/components/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import Canvas from "@/components/canvas/Canvas";
import { EditorState, OpenState, ViewportMode, DEFAULT_EDITOR_STATE } from "@/types";

export default function App() {
  const [editor, setEditor] = useState<EditorState>(DEFAULT_EDITOR_STATE);

  const [isOpen, setIsOpen] = useState<OpenState>(null);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("mobile");

  return (
    <main className="flex flex-col h-screen bg-[#09213D] overflow-hidden md:flex-row">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          viewportMode={viewportMode}
          setViewportMode={setViewportMode}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setEditor={setEditor}
        />
        <Canvas
          editor={editor}
          viewportMode={viewportMode}
        />
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
