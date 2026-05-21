'use client';
import React, { useState } from 'react';
import { colorPalettes } from '@/app/theme'; // CONTINUE COLOR PALLETE AND CLEAN YOUR PARAMETERS

import Header from '@/components/Header';
import Sidebar from "@/components/Sidebar";
import Canvas from "@/components/Canvas";

type EditorState = {
  aboutHeading: string;
  aboutDesc: string;
  aboutLayout: 'side' | 'vertical';
  font: 'inter' | 'poppins' | 'montserrat';
  theme: keyof typeof colorPalettes;

  logo: string | null;
  aboutSection: string | null;
};

type OpenState =
  | 'font'
  | 'palette'
  | 'page'
  | 'menu'
  | 'section'
  | 'view'
  | null;

export default function App() {
  const [editor, setEditor] = useState<EditorState>({
    aboutHeading: 'LARGE HEADING HERE',
    aboutDesc: 'Type your description here.',
    aboutLayout: 'side',
    font: 'inter',
    theme: 'Professional',

    logo: null,
    aboutSection: null,
  });

  const [isOpen, setIsOpen] = useState<OpenState>(null);

  return (
    <main className="flex h-screen bg-[#09213D] overflow-hidden">
      <Sidebar
        editor={editor}
        setEditor={setEditor}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <Canvas editor={editor} />
      </div>
    </main>
  );
}
