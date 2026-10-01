# Product: Portfolio Builder MVP

A browser-based, single-page website builder for beginners who want a clean, professional portfolio or landing page without making low-level design decisions.

## Core Value Proposition
Eliminates design-decision fatigue by offering curated themes, fonts, and per-section layouts instead of free-form customization.

## Features
- Real-time WYSIWYG editor: sidebar edits reflect on the canvas within 200ms
- Four content sections: **Hero**, **About**, **Projects**, **Contact**
- Three curated color themes: Professional, Warm, Cool
- Three font options: Inter, Poppins, Montserrat
- Per-section layout selectors (side, vertical, side-reverse; cards-only for Projects)
- Mobile / tablet / desktop viewport preview toggle
- Image uploads (stored as base64 Data URIs for portability)
- Social links management
- Auto-save via `localStorage`
- **Export to standalone HTML** — all CSS inlined, all images base64-embedded, no server required

## Out of Scope (MVP)
Publishing/hosting, backend, authentication, custom color pickers, arbitrary font choices, additional section types.

## Target User
Beginner developers or creatives who want a portfolio without design expertise.
