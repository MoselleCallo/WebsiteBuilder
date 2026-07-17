"use client";
import React from "react";
import { colorPalettes } from "@/app/theme"; // CONTINUE COLOR PALLETE AND CLEAN YOUR PARAMETERS

type EditorState = {
  aboutHeading: string;
  aboutDesc: string;
  aboutLayout: "side" | "vertical" | "cards";
  font: "inter" | "poppins" | "montserrat";
  theme: keyof typeof colorPalettes;
  logo: string | null;
  aboutSection: string | null;
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

export default function Sidebar({
  editor,
  setEditor,
  isOpen,
  setIsOpen,
}: {
  editor: EditorState;
  setEditor: React.Dispatch<React.SetStateAction<EditorState>>;
  isOpen: OpenState;
  setIsOpen: React.Dispatch<React.SetStateAction<OpenState>>;
}) {
  const fonts = [
    { name: "Classic", value: "inter" },
    { name: "Clean", value: "montserrat" },
    { name: "Modern", value: "poppins" },
  ];

  const imageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo" | "aboutSection",
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const logoUrl = URL.createObjectURL(file);

    setEditor((prev) => ({
      ...prev,
      [field]: logoUrl,
    }));
  };

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
          {/* Full Page Theme */}
          <div className="mb-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-black">Palette</label>

              <div className="relative">
                {/* Select Bar */}
                <button
                  onClick={() =>
                    setIsOpen(isOpen === "palette" ? null : "palette")
                  }
                  className="w-full flex items-center justify-between px-2 py-2 bg-white/20 border border-black rounded-xl hover:bg-white/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        backgroundColor: colorPalettes[editor.theme].main,
                      }}
                      className="w-5 h-5 rounded-md shadow-sm"
                    />
                    <span className="text-[#334155] text-sm font-medium">
                      {editor.theme}
                    </span>
                  </div>

                  {/* Down Arrow */}
                  <svg
                    className={`w-5 h-5 text-gray-800 transition-transform duration-200 ${isOpen === "palette" ? "-scale-y-100" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <ul
                  className={`absolute w-full left-0 bg-white rounded-md shadow-md transition-all duration-300 ease-in-out origin-top
                  ${
                    isOpen === "palette"
                      ? "opacity-100 scale-y-100 translate-y-0 z-50"
                      : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  {Object.keys(colorPalettes).map((palette) => (
                    <li
                      key={palette}
                      onClick={() => {
                        setEditor((prev) => ({
                          ...prev,
                          theme: palette as EditorState["theme"],
                        }));
                        setIsOpen(null);
                      }}
                      className="cursor-pointer flex gap-3 px-3 py-2 hover:bg-gray-100 hover:rounded-md"
                    >
                      <div
                        style={{
                          backgroundColor:
                            colorPalettes[palette as keyof typeof colorPalettes]
                              .main,
                        }}
                        className="w-5 h-5 rounded-md shadow-sm"
                      />
                      {palette}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Full Page Font */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-black">Font</label>

              <div className="relative">
                {/* Select Bar */}
                <button
                  onClick={() => setIsOpen(isOpen === "font" ? null : "font")}
                  className="w-full flex items-center justify-between px-2 py-2 bg-white/20 border border-black rounded-xl hover:bg-white/30 transition-all"
                >
                  <span className="text-[#334155] text-sm font-medium">
                    {editor.font === "inter"
                      ? "Classic"
                      : editor.font === "poppins"
                        ? "Modern"
                        : "Clean"}
                  </span>

                  {/* Down Arrow */}
                  <svg
                    className={`w-5 h-5 text-gray-800 transition-transform duration-200 ${
                      isOpen === "font" ? "-scale-y-100" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <ul
                  className={`absolute w-full left-0 bg-white rounded-md shadow-md transition-all duration-300 ease-in-out origin-top
                  ${
                    isOpen === "font"
                      ? "opacity-100 scale-y-100 translate-y-0"
                      : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  {fonts.map((f) => (
                    <li
                      key={f.value}
                      onClick={() => {
                        setEditor((prev) => ({
                          ...prev,
                          font: f.value as EditorState["font"],
                        }));
                        setIsOpen(null);
                      }}
                      className="cursor-pointer px-3 py-2 hover:bg-gray-100 hover:rounded-md"
                    >
                      {f.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <hr />

          {/* Header Editor */}
          <div className="space-y-2">
            <h1 className="text-md font-bold text-black">Header</h1>

            <div className="space-y-4 ml-4">
              <div className="space-y-4">
                {/* Logo */}
                <div className="w-full space-y-2">
                  <label className="text-sm font-bold text-black">Logo</label>

                  <label
                    htmlFor="logo-upload"
                    className="w-full flex items-center justify-between px-2 py-2 bg-white/20 border border-black rounded-xl hover:bg-white/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {/* Upload Icon (Left) */}
                      <svg
                        className="w-5 h-5 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>

                      {/* Text */}
                      <span className="text-sm text-[#334155] font-medium">
                        {editor.logo ? "Uploaded" : "Upload your logo"}
                      </span>
                    </div>

                    {/* Checkmark Icon (Right) */}
                    {editor.logo ? (
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : null}

                    {/* HIDDEN ACTUAL INPUT */}
                    <input
                      id="logo-upload"
                      type="file"
                      className="hidden"
                      accept="logo/*"
                      onChange={(e) => imageUpload(e, "logo")}
                    />
                  </label>
                </div>
              </div>

              {/* Menu editor */}
              <div className="">
                <label className="text-sm font-bold text-black">Menus</label>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 w-full space-y-2">
                    <span className="text-gray-700 font-medium text-sm">1</span>

                    {/* 2. The Input Field */}
                    <div className="flex-1">
                      <input
                        type="text"
                        defaultValue="Home"
                        className="w-full flex items-center justify-between px-4 py-2 bg-white/60 rounded-xl hover:bg-white/30 transition-all text-gray-700 text-sm"
                      />
                    </div>

                    {/* Edit Icons */}
                    <div className="flex items-center gap-2 text-gray-800">
                      {/* Bold Icon */}
                      <button className="hover:text-black font-black text-lg transition-colors">
                        B
                      </button>

                      {/* Italic Icon */}
                      <button className="hover:text-black font-serif font-bold italic text-lg transition-colors">
                        I
                      </button>

                      {/* Delete/Trash Icon */}
                      <button className="ml-2 hover:text-red-600 transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Add menu button */}
                  <div>
                    <button className="w-2/3 ml-4 flex items-center justify-center py-2 gap-2 bg-white/20 border border-black rounded-xl hover:bg-white/30 transition-all">
                      <svg
                        className="w-4 h-4 text-black"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      >
                        <line x1="12" y1="4" x2="12" y2="20" />
                        <line x1="4" y1="12" x2="20" y2="12" />
                      </svg>

                      <p className="text-black text-xs mt-1 font-bold">
                        Add Menu
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className="space-y-2">
            {/* Body Page Tools */}
            <div className="relative">
            <div className="flex justify-between items-center">
              <h1 className="text-md font-bold text-black">Body</h1>
            </div>

            <div className="ml-4 mb-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center space-y-2">
                  <label className="text-sm font-bold text-black">
                    Section
                  </label>

                  {/* Plus Icon */}
                    <button
                      onClick={() =>
                        setIsOpen(isOpen === "addSection" ? null : "addSection")
                      }
                      className="flex items-center justify-center border-2 border-black w-4 h-4 rounded-full"
                    >
                      <svg
                        className={`w-5 h-5 text-black transition-transform duration-200 ${isOpen === "addSection" ? "rotate-45" : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      >
                        <line x1="12" y1="4" x2="12" y2="20" />
                        <line x1="4" y1="12" x2="20" y2="12" />
                      </svg>
                    </button>

                    <ul
                      className={`absolute w-1/2 right-0 top-11 bg-white rounded-md shadow-md transition-all duration-300 ease-in-out origin-top
                  ${
                    isOpen === "addSection"
                      ? "opacity-100 scale-y-100 translate-y-0"
                      : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
                  }`}
                    >
                      {fonts.map((f) => (
                        <li
                          key={f.value}
                          onClick={() => {
                            setEditor((prev) => ({
                              ...prev,
                              font: f.value as EditorState["font"],
                            }));
                            setIsOpen(null);
                          }}
                          className="cursor-pointer px-3 py-2 hover:bg-gray-100 hover:rounded-md"
                        >
                          {f.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Section Box Editor */}
                <div
                  className={`rounded-md bg-[#B8CCDE] space-y-4 px-4 py-2 overflow-hidden transition-all duration-300 ease-in-out ${isOpen === "section" ? "max-h-auto" : "max-h-10"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      {/* Upward Icon */}
                      <button
                        onClick={() =>
                          setIsOpen(isOpen === "section" ? null : "section")
                        }
                        className={`p-1 rounded-full bg-[#ACBECE] transition-transform duration-200 ${isOpen === "section" ? "-scale-y-100" : ""}`}
                      >
                        <svg
                          className="w-5 h-5 text-gray-800"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      </button>

                      <span className="flex items-center justify-between rounded-xl hover:bg-white/30 transition-all text-gray-700 text-sm">
                        HERO SECTION
                      </span>
                    </div>

                    {/* delete Icon */}
                    <button className="ml-2 hover:text-red-600 transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-black">
                      {" "}
                      Layout{" "}
                    </label>

                    <div className="flex gap-4">
                      <button
                        onClick={(e) =>
                          setEditor((prev) => ({
                            ...prev,
                            aboutLayout: "side",
                          }))
                        }
                        className={`flex-1 p-2 rounded border ${
                          editor.aboutLayout === "side"
                            ? "bg-[#38BDF8] border-[#38BDF8]"
                            : "border-[#334155]"
                        }`}
                      >
                        {" "}
                        Side{" "}
                      </button>

                      <button
                        onClick={(e) =>
                          setEditor((prev) => ({
                            ...prev,
                            aboutLayout: "vertical",
                          }))
                        }
                        className={`flex-1 p-2 rounded border ${
                          editor.aboutLayout === "vertical"
                            ? "bg-[#38BDF8] border-[#38BDF8]"
                            : "border-[#334155]"
                        }`}
                      >
                        {" "}
                        Vertical{" "}
                      </button>

                      <button
                        onClick={(e) =>
                          setEditor((prev) => ({
                            ...prev,
                            aboutLayout: "cards",
                          }))
                        }
                        className={`flex-1 p-2 rounded border ${
                          editor.aboutLayout === "cards"
                            ? "bg-[#38BDF8] border-[#38BDF8]"
                            : "border-[#334155]"
                        }`}
                      >
                        {" "}
                        Cards{" "}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-black">
                      Content
                    </label>

                    <input
                      type="text"
                      className="flex items-center justify-between px-4 py-2 w-4/5 bg-white/60 rounded-xl hover:bg-white/30 transition-all text-gray-700 text-sm"
                      value={editor.aboutHeading}
                      onChange={(e) =>
                        setEditor((prev) => ({
                          ...prev,
                          aboutHeading: e.target.value,
                        }))
                      }
                    />

                    <textarea
                      className="w-full items-center justify-between px-4 py-2 bg-white/60 rounded-xl hover:bg-white/30 transition-all text-gray-700 text-sm"
                      rows={4}
                      value={editor.aboutDesc}
                      onChange={(e) =>
                        setEditor((prev) => ({
                          ...prev,
                          aboutDesc: e.target.value,
                        }))
                      }
                    ></textarea>

                    <label
                      htmlFor="image-upload"
                      className="w-full flex items-center justify-between px-2 py-2 bg-white/20 border border-black rounded-xl hover:bg-white/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {/* Upload Icon (Left) */}
                        <svg
                          className="w-5 h-5 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          />
                        </svg>

                        {/* Text */}
                        <span className="text-sm text-black font-medium">
                          {editor.aboutSection
                            ? "Uploaded"
                            : "Upload your image"}
                        </span>
                      </div>

                      {/* Checkmark Icon (Right) */}
                      {editor.logo ? (
                        <svg
                          className="w-5 h-5 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : null}

                      {/* HIDDEN ACTUAL INPUT */}
                      <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="logo/*"
                        onChange={(e) => imageUpload(e, "aboutSection")}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
