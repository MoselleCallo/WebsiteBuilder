"use client";
import React from "react";
import { EditorState, OpenState, SocialLink } from "@/types";
import { isValidEmail, isValidUrl } from "@/utils/validation";

export default function ContactEditor({
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
  const contact = editor.sections.contact;

  const updateContact = (patch: Partial<typeof contact>) => {
    setEditor((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        contact: { ...prev.sections.contact, ...patch },
      },
    }));
  };

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: crypto.randomUUID(),
      platform: "",
      url: "",
    };
    updateContact({ socialLinks: [...contact.socialLinks, newLink] });
  };

  const removeSocialLink = (id: string) => {
    updateContact({
      socialLinks: contact.socialLinks.filter((l) => l.id !== id),
    });
  };

  const updateSocialLink = (
    id: string,
    patch: Partial<Omit<SocialLink, "id">>
  ) => {
    updateContact({
      socialLinks: contact.socialLinks.map((l) =>
        l.id === id ? { ...l, ...patch } : l
      ),
    });
  };

  return (
    <div
      className={`rounded-md bg-[#B8CCDE] space-y-4 px-4 py-2 overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen === "contactSection" ? "max-h-[9999px]" : "max-h-10"
      }`}
    >
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <button
            onClick={() =>
              setIsOpen(isOpen === "contactSection" ? null : "contactSection")
            }
            className={`p-1 rounded-full bg-[#ACBECE] transition-transform duration-200 ${
              isOpen === "contactSection" ? "-scale-y-100" : ""
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
          <span className="text-gray-700 text-sm">CONTACT SECTION</span>
        </div>
      </div>

      {/* Contact fields */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-black">Contact Info</label>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs text-gray-600">Email</label>
          <input
            type="text"
            maxLength={254}
            placeholder="you@example.com"
            className={`w-full px-3 py-2 bg-white/60 rounded-xl text-gray-700 text-sm border ${
              contact.email && !isValidEmail(contact.email)
                ? "border-red-500"
                : "border-transparent"
            }`}
            value={contact.email}
            onChange={(e) => updateContact({ email: e.target.value })}
          />
          {contact.email && !isValidEmail(contact.email) && (
            <p className="text-red-600 text-xs">Enter a valid email address</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-xs text-gray-600">Phone (optional)</label>
          <input
            type="text"
            maxLength={254}
            placeholder="+1 (555) 000-0000"
            className="w-full px-3 py-2 bg-white/60 rounded-xl text-gray-700 text-sm border border-transparent"
            value={contact.phone}
            onChange={(e) => updateContact({ phone: e.target.value })}
          />
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label className="text-xs text-gray-600">Location (optional)</label>
          <input
            type="text"
            maxLength={254}
            placeholder="City, Country"
            className="w-full px-3 py-2 bg-white/60 rounded-xl text-gray-700 text-sm border border-transparent"
            value={contact.location}
            onChange={(e) => updateContact({ location: e.target.value })}
          />
        </div>
      </div>

      {/* Social links */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-black">Social Links</label>

        {contact.socialLinks.map((link) => (
          <div
            key={link.id}
            className="rounded-md bg-[#ACBECE] px-3 py-2 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600">
                {link.platform || "Social Link"}
              </span>
              <button
                onClick={() => removeSocialLink(link.id)}
                className="hover:text-red-600 transition-colors"
                aria-label="Remove social link"
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

            {/* Platform */}
            <input
              type="text"
              maxLength={100}
              placeholder="Platform (e.g. GitHub)"
              className="w-full px-3 py-1.5 bg-white/60 rounded-lg text-gray-700 text-sm"
              value={link.platform}
              onChange={(e) =>
                updateSocialLink(link.id, { platform: e.target.value })
              }
            />

            {/* URL */}
            <input
              type="text"
              placeholder="https://github.com/you"
              className={`w-full px-3 py-1.5 bg-white/60 rounded-lg text-gray-700 text-sm border ${
                link.url && !isValidUrl(link.url)
                  ? "border-red-500"
                  : "border-transparent"
              }`}
              value={link.url}
              onChange={(e) =>
                updateSocialLink(link.id, { url: e.target.value })
              }
            />
            {link.url && !isValidUrl(link.url) && (
              <p className="text-red-600 text-xs">
                Enter a valid http or https URL
              </p>
            )}
          </div>
        ))}

        {/* Add Social Link */}
        <button
          onClick={addSocialLink}
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
          <span className="text-black text-xs font-bold">Add Social Link</span>
        </button>
      </div>
    </div>
  );
}
