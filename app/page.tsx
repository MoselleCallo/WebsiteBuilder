"use client";
import React, { useState, useEffect } from "react";

import Header from "@/components/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import Canvas from "@/components/canvas/Canvas";
import { EditorState, OpenState, ViewportMode, DEFAULT_EDITOR_STATE } from "@/types";
import { loadEditorState, saveEditorState } from "@/utils/storage";

export default function App() {
  const [editor, setEditor] = useState<EditorState>(
    () => loadEditorState() ?? DEFAULT_EDITOR_STATE
  );

  const [isOpen, setIsOpen] = useState<OpenState>(null);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("mobile");

  // Debounced auto-save to localStorage on every editor change.
  useEffect(() => {
    const timer = setTimeout(() => saveEditorState(editor), 500);
    return () => clearTimeout(timer);
  }, [editor]);

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
