"use client";
import React, { useState } from "react";
import { EditorState, OpenState, ProjectItem } from "@/types";
import { readFileAsDataURI } from "@/utils/imageUpload";
import { isValidUrl } from "@/utils/validation";

// Per-item collapsible state is tracked locally — not in EditorState
type ItemOpenState = Record<string, boolean>;

export default function ProjectsEditor({
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
  const [itemOpen, setItemOpen] = useState<ItemOpenState>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  const items = editor.sections.projects.items;

  const addProject = () => {
    const id = crypto.randomUUID();
    const newItem: ProjectItem = {
      id,
      title: "",
      description: "",
      image: null,
      link: "",
    };
    setEditor((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        projects: {
          ...prev.sections.projects,
          items: [...prev.sections.projects.items, newItem],
        },
      },
    }));
    // Auto-open the new item
    setItemOpen((prev) => ({ ...prev, [id]: true }));
  };

  const removeProject = (id: string) => {
    setEditor((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        projects: {
          ...prev.sections.projects,
          items: prev.sections.projects.items.filter((item) => item.id !== id),
        },
      },
    }));
    setItemOpen((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setUploadErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const updateItem = (id: string, patch: Partial<Omit<ProjectItem, "id">>) => {
    setEditor((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        projects: {
          ...prev.sections.projects,
          items: prev.sections.projects.items.map((item) =>
            item.id === id ? { ...item, ...patch } : item
          ),
        },
      },
    }));
  };

  const handleImageUpload = async (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    const result = await readFileAsDataURI(file);
    if ("error" in result) {
      setUploadErrors((prev) => ({ ...prev, [id]: result.error }));
      return;
    }

    updateItem(id, { image: result.dataUri });
  };

  const toggleItem = (id: string) =>
    setItemOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div
      className={`rounded-md bg-[#B8CCDE] space-y-4 px-4 py-2 overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen === "projectsSection" ? "max-h-[9999px]" : "max-h-10"
      }`}
    >
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <button
            onClick={() =>
              setIsOpen(isOpen === "projectsSection" ? null : "projectsSection")
            }
            className={`p-1 rounded-full bg-[#ACBECE] transition-transform duration-200 ${
              isOpen === "projectsSection" ? "-scale-y-100" : ""
            }`}
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
          <span className="text-gray-700 text-sm">PROJECTS SECTION</span>
        </div>
      </div>

      {/* Layout selector — Cards only, others greyed out */}
      <div className="space-y-1">
        <label className="text-sm font-bold text-black">Layout</label>
        <div className="flex gap-2">
          {(["Side", "Side-Reverse", "Vertical"] as const).map((label) => (
            <button
              key={label}
              disabled
              className="flex-1 p-2 rounded border border-[#334155] text-sm text-gray-400 cursor-not-allowed opacity-50"
            >
              {label}
            </button>
          ))}
          <button
            disabled
            className="flex-1 p-2 rounded border text-sm bg-[#38BDF8] border-[#38BDF8]"
          >
            Cards
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Projects always use cards layout
        </p>
      </div>

      {/* Project items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-md bg-[#ACBECE] overflow-hidden">
            {/* Item header */}
            <div className="flex items-center justify-between px-3 py-2">
              <button
                onClick={() => toggleItem(item.id)}
                className="flex items-center gap-2 flex-1 text-left"
              >
                <svg
                  className={`w-4 h-4 text-gray-700 transition-transform duration-200 ${
                    itemOpen[item.id] ? "-scale-y-100" : ""
                  }`}
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
                <span className="text-sm text-gray-700 truncate">
                  {item.title || "Untitled Project"}
                </span>
              </button>

              {/* Delete button */}
              <button
                onClick={() => removeProject(item.id)}
                className="ml-2 hover:text-red-600 transition-colors"
                aria-label="Delete project"
              >
                <svg
                  className="w-4 h-4"
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

            {/* Item body — collapsible */}
            {itemOpen[item.id] && (
              <div className="px-3 pb-3 space-y-2">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Title
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    placeholder="Project title"
                    className="w-full px-3 py-1.5 bg-white/60 rounded-lg text-gray-700 text-sm"
                    value={item.title}
                    onChange={(e) =>
                      updateItem(item.id, { title: e.target.value })
                    }
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Description
                  </label>
                  <textarea
                    maxLength={500}
                    placeholder="What did you build?"
                    rows={3}
                    className="w-full px-3 py-1.5 bg-white/60 rounded-lg text-gray-700 text-sm resize-none"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, { description: e.target.value })
                    }
                  />
                </div>

                {/* Image upload */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Image
                  </label>
                  <label
                    htmlFor={`project-img-${item.id}`}
                    className="w-full flex items-center justify-between px-2 py-1.5 bg-white/20 border border-black rounded-lg hover:bg-white/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-700"
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
                      <span className="text-xs text-black font-medium">
                        {item.image ? "Image uploaded" : "Upload image"}
                      </span>
                    </div>
                    {item.image && (
                      <svg
                        className="w-4 h-4 text-gray-600"
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
                    )}
                    <input
                      id={`project-img-${item.id}`}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(item.id, e)}
                    />
                  </label>
                  {uploadErrors[item.id] && (
                    <p className="text-red-600 text-xs">
                      {uploadErrors[item.id]}
                    </p>
                  )}
                </div>

                {/* Link */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Link
                  </label>
                  <input
                    type="text"
                    placeholder="https://github.com/you/project"
                    className={`w-full px-3 py-1.5 bg-white/60 rounded-lg text-gray-700 text-sm border ${
                      item.link && !isValidUrl(item.link)
                        ? "border-red-500"
                        : "border-transparent"
                    }`}
                    value={item.link}
                    onChange={(e) =>
                      updateItem(item.id, { link: e.target.value })
                    }
                  />
                  {item.link && !isValidUrl(item.link) && (
                    <p className="text-red-600 text-xs">
                      Enter a valid http or https URL
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Project button */}
      <button
        onClick={addProject}
        className="w-full flex items-center justify-center gap-2 py-2 bg-white/20 border border-black rounded-xl hover:bg-white/30 transition-all"
      >
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
        <span className="text-black text-xs font-bold">Add Project</span>
      </button>
    </div>
  );
}
