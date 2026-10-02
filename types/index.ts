import { colorPalettes } from "@/app/theme";

// ── Section types ──────────────────────────────────────────────

export type HeroSection = {
  name: string;        // 0–50 chars; shown as the large heading
  title: string;       // 0–50 chars; role / job title line
  tagline: string;     // 0–100 chars; short descriptive line
  photo: string | null; // Data URI or null
  layout: "side" | "vertical" | "side-reverse";
};

export type AboutSection = {
  heading: string;     // 0–unlimited (display heading)
  desc: string;        // multi-line, preserves \n
  image: string | null; // Data URI or null
  layout: "side" | "vertical" | "side-reverse";
};

export type ProjectItem = {
  id: string;           // crypto.randomUUID() — stable React key
  title: string;        // 0–100 chars
  description: string;  // 0–500 chars
  image: string | null; // Data URI or null
  link: string;         // raw user input; validated separately
};

export type ProjectsSection = {
  items: ProjectItem[];
  layout: "cards"; // fixed — always "cards", not user-selectable
};

export type SocialLink = {
  id: string;        // stable React key
  platform: string;  // 0–100 chars; free-form
  url: string;       // raw user input; validated separately
};

export type ContactSection = {
  email: string;         // validated; required for display
  phone: string;         // optional
  location: string;      // optional
  socialLinks: SocialLink[];
};

// ── Root EditorState ──────────────────────────────────────────

export type EditorState = {
  sections: {
    hero: HeroSection;
    about: AboutSection;
    projects: ProjectsSection;
    contact: ContactSection;
  };
  font: "inter" | "poppins" | "montserrat";
  theme: keyof typeof colorPalettes;
  logo: string | null; // Data URI or null
};

// ── UI state types ────────────────────────────────────────────

// NOTE: "page" | "menu" | "view" are retained here because grep found active
// references in Header.tsx, page.tsx, Sidebar.tsx, ThemeEditor.tsx,
// HeroEditor.tsx, and AboutEditor.tsx. Task 3 will remove these values
// once all files are migrated to import from this shared module.
export type OpenState =
  | "font"
  | "palette"
  | "page"
  | "menu"
  | "view"
  | "heroSection"
  | "aboutSection"
  | "projectsSection"
  | "contactSection"
  | null;

export type ViewportMode = "mobile" | "tablet" | "desktop";

// ── Default state ─────────────────────────────────────────────

export const DEFAULT_EDITOR_STATE: EditorState = {
  sections: {
    hero: {
      name: "",
      title: "",
      tagline: "",
      photo: null,
      layout: "side",
    },
    about: {
      heading: "",
      desc: "",
      image: null,
      layout: "side",
    },
    projects: {
      items: [],
      layout: "cards",
    },
    contact: {
      email: "",
      phone: "",
      location: "",
      socialLinks: [],
    },
  },
  font: "inter",
  theme: "Professional",
  logo: null,
};
