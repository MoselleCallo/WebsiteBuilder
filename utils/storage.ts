import { EditorState } from "@/types";

const STORAGE_KEY = "portfolio-builder-mvp-state";

/**
 * Serializes the editor state and writes it to localStorage.
 * Silent no-op if localStorage is unavailable (SSR guard) or quota is exceeded.
 */
export function saveEditorState(state: EditorState): void {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded or SSR — silent
  }
}

/**
 * Reads and parses the editor state from localStorage.
 * Returns null if the key is absent, JSON.parse throws, or the parsed object
 * fails structural validation (missing required keys). A null result signals
 * the caller to fall back to DEFAULT_EDITOR_STATE.
 */
export function loadEditorState(): EditorState | null {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    // Structural validation: check all required keys exist
    if (
      !parsed?.sections?.hero ||
      !parsed?.sections?.about ||
      !parsed?.sections?.projects ||
      !parsed?.sections?.contact ||
      parsed?.sections?.contact?.location === undefined ||
      !parsed?.font ||
      !parsed?.theme
    ) {
      return null; // triggers default state + overwrites on next save
    }

    return parsed as EditorState;
  } catch {
    return null;
  }
}
