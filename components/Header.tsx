"use client";
import React from "react";
import { colorPalettes } from "@/app/theme";
import { EditorState, OpenState, ViewportMode } from "@/types";

export default function Header({
  viewportMode,
  setViewportMode,
  isOpen,
  setIsOpen,
  setEditor,
}: {
  isOpen: OpenState;
  setIsOpen: React.Dispatch<React.SetStateAction<OpenState>>;
  viewportMode: ViewportMode;
  setViewportMode: React.Dispatch<React.SetStateAction<ViewportMode>>;
  setEditor: React.Dispatch<React.SetStateAction<EditorState>>;
}) {
  const viewports: { mode: ViewportMode; label: string; icon: React.ReactNode }[] = [
    {
      mode: "mobile",
      label: "Mobile",
      icon: (
        <>
          <rect x="7" y="4" width="10" height="16" rx="2" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </>
      ),
    },
    {
      mode: "tablet",
      label: "Tablet",
      icon: (
        <>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </>
      ),
    },
    {
      mode: "desktop",
      label: "Desktop",
      icon: (
        <>
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <line x1="8" y1="20" x2="16" y2="20" />
          <line x1="12" y1="16" x2="12" y2="20" />
        </>
      ),
    },
  ];

  return (
    <header className="sticky top-0 w-full h-16 z-50 bg-[#09213D]">
      <div className="flex justify-between p-4 items-center">
        {/* Left side */}
        <div className="flex gap-4 items-center">
          <input
            type="text"
            className="bg-transparent text-white w-1/4 px-2"
            defaultValue="Untitled1"
          />
          {/* Viewport mode selector */}
          <div className="flex gap-1 bg-[#0F2B4D] rounded-full p-1">
            {viewports.map((v) => (
              <button
                key={v.mode}
                onClick={() => setViewportMode(v.mode)}
                aria-label={v.label}
                title={v.label}
                className={`flex items-center p-1.5 rounded-full transition-colors ${
                  viewportMode === v.mode
                    ? "bg-[#349BC9] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  {v.icon}
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex gap-4">
          <button className="py-2 px-3 bg-white font-semibold text-sm rounded-full">
            Preview
          </button>
          <button className="py-2 px-3 bg-[#349BC9] text-white font-semibold text-sm rounded-full">
            Publish
          </button>
        </div>
      </div>
    </header>
  );
}
