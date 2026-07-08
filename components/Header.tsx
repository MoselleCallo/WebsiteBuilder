"use client";
import React from "react";
import { colorPalettes } from "@/app/theme";

type OpenState =
  | "font"
  | "palette"
  | "page"
  | "menu"
  | "section"
  | "view"
  | null;

type EditorState = {
  aboutHeading: string;
  aboutDesc: string;
  aboutLayout: "side" | "vertical";
  font: "inter" | "poppins" | "montserrat";
  theme: keyof typeof colorPalettes;

  logo: string | null;
  aboutSection: string | null;
};
export default function Header({
  changeView,
  setChangeView,
  isOpen,
  setIsOpen,
  setEditor,
}: {
  isOpen: OpenState;
  setIsOpen: React.Dispatch<React.SetStateAction<OpenState>>;
  changeView: boolean;
  setChangeView: React.Dispatch<React.SetStateAction<boolean>>;
  setEditor: React.Dispatch<React.SetStateAction<EditorState>>;
}) {
  const mobileView = () => {
    setChangeView(!changeView);
    setEditor((prev) => ({
      ...prev,
      aboutLayout: "side",
    }));
  };

  return (
    <header className="sticky top-0 w-full h-16 z-50 bg-[#09213D]">
      <div className="flex justify-between p-4 items-center">
        {/* Left side */}
        <div className="flex gap-4 items-center">
          <input
            type-text
            className="bg-transparent text-white w-1/4 px-2"
            defaultValue="Untitled1"
          />
          {/* Change View to Mobile */}
          <button onClick={mobileView} className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="w-6 h-6"
            >
              <path d="M12 18h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2" />
              <rect x="4" y="11" width="6" height="10" rx="1.5" />
              <circle cx="7" cy="18" r="0.5" fill="currentColor" />
            </svg>
          </button>
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
