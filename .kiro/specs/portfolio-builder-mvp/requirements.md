# Requirements Document

## Introduction

The Portfolio Builder MVP is a single-page website builder for a Next.js 13.5 (App Router) + React 18 + TypeScript + Tailwind CSS project. It helps beginners quickly create a clean, professional single-page portfolio or landing page while eliminating design-decision fatigue through curated themes, fonts, and per-section layouts.

This MVP completes the following end-to-end capability: a user enters content, sees a real-time preview, chooses curated layouts and themes, and generates a responsive website that can be exported as a standalone single HTML file that opens anywhere without a server.

The application is organized around a single lifted editor state that drives four sections (Hero, About, Projects, Contact), a theme palette injected as CSS custom properties, and a live preview canvas. This document defines the requirements to bring Projects, Contact, social links, persistence, responsive multi-viewport preview, standalone export, and shared-type groundwork to completion.

Publishing and hosting are explicitly out of scope for this MVP and are noted as a future consideration.

## Glossary

- **Portfolio_Builder**: The overall application that enables a User to author and export a single-page portfolio.
- **Editor_State**: The single lifted application state object holding all section content (Hero, About, Projects, Contact), font, theme, logo, and UI flags.
- **Editor**: The sidebar editing interface through which a User modifies section content, layout, theme, and font.
- **Canvas**: The live preview component that renders the current Editor_State and injects the active theme palette as CSS custom properties.
- **Hero_Section**: The portfolio profile header containing Name, Title, tagline, and profile photo.
- **About_Section**: The section containing a heading, a description, and an optional image.
- **Projects_Section**: The section containing an ordered list of Project_Item entries.
- **Project_Item**: A single project entry with the fields title, description, image, and link.
- **Contact_Section**: The section containing contact information (email, and optional phone and location) and social links.
- **Social_Link**: An entry with a platform (from a fixed set) and a url.
- **Section**: Any one of Hero_Section, About_Section, Projects_Section, or Contact_Section.
- **Layout_Selector**: The control that lets a User choose among curated per-section arrangements.
- **Theme_System**: The set of three curated themes (Professional, Warm, Cool) and font choices (Inter, Poppins, Montserrat).
- **Persistence_Store**: The browser localStorage mechanism used to autosave and restore Editor_State.
- **Exporter**: The component that generates a standalone single HTML file with inlined CSS and base64-embedded images.
- **Exported_Page**: The standalone HTML file produced by the Exporter.
- **Shared_Types_Module**: A single TypeScript module that defines the canonical types (Editor_State, section types, open-state, etc.) consumed across the codebase.
- **Data_URI**: A base64-encoded representation of an image embedded directly in HTML.
- **Viewport_Mode**: One of the three preview widths: mobile (< 640px), tablet (640-1024px), or desktop (> 1024px).
- **User**: The person authoring a portfolio using the Portfolio_Builder.

## Requirements

### Requirement 1: Shared Types Groundwork

**User Story:** As a developer, I want the duplicated TypeScript type definitions consolidated into one shared module, so that the type definitions stay consistent and do not drift across files.

#### Acceptance Criteria

1. THE Shared_Types_Module SHALL define exactly one canonical Editor_State type that contains a sections member (with Hero_Section, About_Section, Projects_Section, and Contact_Section members), a font type, a theme type, a logo type, and the UI open-state type, with no member omitted relative to the current combined set of type members.
2. WHEN a file references any section type, editor-state type, or open-state type, THE Portfolio_Builder SHALL resolve that reference to the Shared_Types_Module definition rather than a locally declared type.
3. THE Portfolio_Builder SHALL contain zero local declarations of Editor_State, Hero_Section, About_Section, Projects_Section, Contact_Section, or open-state types outside the Shared_Types_Module, across all files that previously declared them.
4. IF a file retains a local declaration of any type that duplicates a Shared_Types_Module type, THEN THE Portfolio_Builder SHALL surface a TypeScript compilation error identifying the conflicting declaration, and SHALL NOT silently resolve to the local duplicate.
5. THE Portfolio_Builder SHALL compile with zero TypeScript errors under the project's existing tsconfig configuration after all type references are migrated to the Shared_Types_Module.

### Requirement 2: Edit Hero Profile Content

**User Story:** As a User, I want to edit my Hero profile header, so that visitors immediately see who I am and what I do.

#### Acceptance Criteria

1. THE Hero_Section SHALL provide an editable single-line Name field accepting 0 to 100 characters.
2. THE Hero_Section SHALL provide an editable single-line Title field accepting 0 to 100 characters.
3. THE Hero_Section SHALL provide an editable single-line tagline field accepting 0 to 200 characters.
4. THE Hero_Section SHALL provide a profile photo field that accepts image file types only.
5. WHEN a User edits the Name field, THE Canvas SHALL update the rendered Hero_Section Name to display the current field value within 200 milliseconds.
6. WHEN a User edits the Title field, THE Canvas SHALL update the rendered Hero_Section Title to display the current field value within 200 milliseconds.
7. WHEN a User edits the tagline field, THE Canvas SHALL update the rendered Hero_Section tagline to display the current field value within 200 milliseconds.
8. WHEN a User selects a profile photo file whose type is an image type, THE Canvas SHALL display the selected image in the Hero_Section profile photo region.
9. IF a User selects a profile photo file whose type is not an image type, THEN THE Hero_Section SHALL reject the file, retain any previously set profile photo, and indicate to the User that the selection was not accepted.
10. IF the Name field is empty, THEN THE Canvas SHALL render the Hero_Section with an editor-only placeholder in the Name region, and THE Exported_Page SHALL omit the Name region entirely.
11. IF the Title field is empty, THEN THE Canvas SHALL render the Hero_Section with an editor-only placeholder in the Title region, and THE Exported_Page SHALL omit the Title region entirely.
12. IF the tagline field is empty, THEN THE Canvas SHALL render the Hero_Section with an editor-only placeholder in the tagline region, and THE Exported_Page SHALL omit the tagline region entirely.

### Requirement 3: Edit About Content

**User Story:** As a User, I want to edit an About section with a heading, description, and optional image, so that visitors can learn more about my background.

#### Acceptance Criteria

1. THE About_Section SHALL provide an editable single-line heading field, an editable multi-line description field, and an optional image field that accepts image file types.
2. WHEN a User changes the About heading field, THE Canvas SHALL update the rendered About_Section heading to display the current field value.
3. WHEN a User changes the About description field, THE Canvas SHALL update the rendered About_Section description to display the current field value, preserving line breaks.
4. WHERE a User provides an About image, THE Canvas SHALL display the provided image within the About_Section image region.
5. IF the About image is absent, THEN THE Canvas SHALL render the About_Section image region as a placeholder that prompts the User to upload an image.
6. IF a User selects an About image file whose type is not an image, THEN THE About_Section SHALL reject the file, retain any previously set image, and indicate to the User that the selection was not accepted.

### Requirement 4: Manage Projects List

**User Story:** As a User, I want to add and remove projects, so that I can showcase my work.

#### Acceptance Criteria

1. WHEN a User activates the add control, THE Projects_Section SHALL append one Project_Item with title, description, image, and link fields initialized to empty values.
2. WHEN a User activates the remove control on a Project_Item, THE Projects_Section SHALL delete that Project_Item and retain all other Project_Item entries unchanged.
3. THE Project_Item SHALL provide editable fields for title (0 to 100 characters), description (0 to 500 characters), image, and link.
4. WHEN a User edits a Project_Item field, THE Canvas SHALL update the rendered Projects_Section to reflect the new value.
5. IF the Projects_Section contains zero Project_Item entries, THEN THE Canvas SHALL render the Projects_Section without an empty items region and without editor placeholder text, and THE export SHALL omit the Projects_Section entirely.
6. WHERE a Project_Item has a link value but no image value, THE Canvas SHALL render the Project_Item omitting the image element and displaying the remaining populated fields.
7. WHERE a Project_Item has an image value but no title value, THE Canvas SHALL render the Project_Item omitting the title element and displaying the remaining populated fields.
8. IF a User enters a link value that is not a valid absolute URL, THEN THE Projects_Section SHALL reject the value, retain the previous valid link value, and display an indication that the link is invalid.

### Requirement 5: Manage Social Links

**User Story:** As a User, I want to add and remove social links from a fixed set of platforms, so that visitors can find me on other services.

#### Acceptance Criteria

1. WHEN a User adds a Social_Link, THE Contact_Section SHALL append the Social_Link to the social links list, up to a maximum of 10 Social_Links.
2. WHEN a User removes a Social_Link, THE Contact_Section SHALL delete that Social_Link from the social links list.
3. THE Social_Link SHALL provide a platform value selected from a fixed set consisting of GitHub, LinkedIn, and X/Twitter, and THE Contact_Section SHALL reject any platform value not in this fixed set.
4. THE Social_Link SHALL provide an editable url value with a maximum length of 2048 characters.
5. IF a Social_Link url does not match a valid http or https URL pattern, THEN THE Editor SHALL mark the url as invalid and display an indication to the User that the url is invalid, while retaining the entered url value.
6. IF a Social_Link url is marked invalid, THEN THE Canvas SHALL render the Contact_Section without a link for that Social_Link.
7. WHEN a portfolio is exported, IF a Social_Link url is marked invalid, THEN THE Exporter SHALL omit that Social_Link from the exported output.

### Requirement 6: Edit Contact Information

**User Story:** As a User, I want to enter my contact information, so that visitors can reach me.

#### Acceptance Criteria

1. THE Contact_Section SHALL provide editable fields for a required email, an optional phone, and an optional location, where each field accepts up to 254 characters.
2. WHEN a User edits the email, phone, or location field, THE Canvas SHALL update the rendered Contact_Section to reflect the new value within 200 milliseconds.
3. IF the phone field is empty, THEN THE Canvas SHALL render the Contact_Section without a phone region.
4. IF the location field is empty, THEN THE Canvas SHALL render the Contact_Section without a location region.
5. IF the email field is empty or does not contain a value in the form local-part@domain, THEN THE Contact_Section SHALL display a validation indicator identifying the email field as invalid and SHALL retain the entered value without discarding phone or location values.
6. IF the email field is empty, THEN THE Canvas SHALL render the Contact_Section without an email region.

### Requirement 7: Select Per-Section Layouts

**User Story:** As a User, I want to choose among curated arrangements for each section, so that I can vary the look without making low-level design decisions.

#### Acceptance Criteria

1. THE Layout_Selector SHALL offer at least two named curated arrangements for each Section that supports layout selection.
2. WHEN a User selects one of the offered arrangements for a Section, THE Canvas SHALL render that Section using the selected arrangement within 500 milliseconds and SHALL indicate the selected arrangement as active in the Layout_Selector.
3. THE Portfolio_Builder SHALL apply each layout selection to a single Section independently, leaving the arrangement of all other Sections unchanged.
4. WHILE no User selection has been made for a Section that supports layout selection, THE Canvas SHALL render that Section using that Section's default arrangement.
5. IF a Section is assigned an arrangement value that is not one of the arrangements offered for that Section, THEN THE Portfolio_Builder SHALL retain the Section's most recent valid arrangement and SHALL surface an indication that the requested arrangement was not applied.
6. WHEN a User exports the portfolio, THE Portfolio_Builder SHALL produce output that renders each Section using that Section's currently selected arrangement.

### Requirement 8: Select Theme and Font

**User Story:** As a User, I want to choose from curated themes and fonts, so that my portfolio looks professional without deep customization.

#### Acceptance Criteria

1. THE Theme_System SHALL provide exactly three curated themes, named Professional, Warm, and Cool, each defined in app/theme.ts.
2. THE Theme_System SHALL provide exactly three font choices: Inter, Poppins, and Montserrat.
3. WHILE no theme has been selected by a User, THE Canvas SHALL apply the Professional theme as the default.
4. WHILE no font has been selected by a User, THE Canvas SHALL apply Inter as the default font.
5. WHEN a User selects a theme, THE Canvas SHALL inject the selected theme palette as CSS custom properties and re-render all sections using those CSS custom properties.
6. WHEN a User selects a font, THE Canvas SHALL apply the selected font to the rendered content of all sections.
7. WHEN a User exports the portfolio, THE Exported_Page SHALL render using the currently selected theme's palette and the currently selected font.
8. IF the selected theme value is not one of Professional, Warm, or Cool, THEN THE Canvas SHALL apply the Professional theme and SHALL indicate that the requested theme was not applied.
9. IF the selected font value is not one of Inter, Poppins, or Montserrat, THEN THE Canvas SHALL apply Inter and SHALL indicate that the requested font was not applied.

### Requirement 9: Multi-Viewport Live Preview

**User Story:** As a User, I want to preview my portfolio at mobile, tablet, and desktop widths, so that I can confirm it looks correct on all devices.

#### Acceptance Criteria

1. THE Canvas SHALL support exactly three Viewport_Modes: mobile, tablet, and desktop.
2. WHEN a User selects the mobile Viewport_Mode, THE Canvas SHALL render the preview at a fixed width of 375 pixels.
3. WHEN a User selects the tablet Viewport_Mode, THE Canvas SHALL render the preview at a fixed width of 768 pixels.
4. WHEN a User selects the desktop Viewport_Mode, THE Canvas SHALL render the preview at a fixed width of 1280 pixels.
5. WHEN the Editor_State changes, THE Canvas SHALL update the preview in the active Viewport_Mode within 200 milliseconds.
6. THE Canvas SHALL set mobile as the default Viewport_Mode when no Viewport_Mode has been selected.
7. WHEN a User selects a Viewport_Mode, THE Canvas SHALL preserve the current Editor_State without discarding or altering any content.

### Requirement 10: Responsive Output Contract

**User Story:** As a User, I want both the preview and the exported page to be responsive, so that visitors get a correct layout on any device.

#### Acceptance Criteria

1. WHILE the viewport width is 639 pixels or less, THE Canvas SHALL render the mobile layout; WHILE the viewport width is between 640 and 1024 pixels inclusive, THE Canvas SHALL render the tablet layout; and WHILE the viewport width is 1025 pixels or greater, THE Canvas SHALL render the desktop layout, with no horizontal scrollbar present at any viewport width from 320 to 2560 pixels.
2. WHILE the viewport width is 639 pixels or less, THE Exported_Page SHALL render the mobile layout; WHILE the viewport width is between 640 and 1024 pixels inclusive, THE Exported_Page SHALL render the tablet layout; and WHILE the viewport width is 1025 pixels or greater, THE Exported_Page SHALL render the desktop layout, with no horizontal scrollbar present at any viewport width from 320 to 2560 pixels.
3. IF a text field contains a value longer than the width of its section container, THEN THE Canvas SHALL wrap the text onto additional lines within the section container width, keeping all rendered text visually inside the section bounds with no horizontal overflow or clipping.
4. IF a text field contains a value longer than the width of its section container, THEN THE Exported_Page SHALL wrap the text onto additional lines within the section container width, keeping all rendered text visually inside the section bounds with no horizontal overflow or clipping.

### Requirement 11: Persist and Restore Work

**User Story:** As a User, I want my work saved automatically, so that a page refresh does not wipe my progress.

#### Acceptance Criteria

1. WHEN the Editor_State changes, THE Portfolio_Builder SHALL save the current Editor_State to the Persistence_Store within 1000 milliseconds, overwriting any previously saved state.
2. WHEN the Portfolio_Builder loads and a saved state exists in the Persistence_Store, THE Portfolio_Builder SHALL restore the Editor_State so that all sections, content, and settings match their values at the time of the last save.
3. IF no saved state exists in the Persistence_Store when the Portfolio_Builder loads, THEN THE Portfolio_Builder SHALL initialize the Editor_State with default content.
4. IF the saved state in the Persistence_Store cannot be parsed or is structurally invalid, THEN THE Portfolio_Builder SHALL initialize the Editor_State with default content and replace the invalid saved state on the next save.
5. THE Portfolio_Builder SHALL store image content in the Persistence_Store as Data_URI values.
6. WHEN the Portfolio_Builder restores an Editor_State containing image Data_URIs, THE Canvas SHALL render those images after reload without requiring re-upload.

### Requirement 12: Image Upload Guardrails

**User Story:** As a User, I want image uploads validated, so that unsupported or oversized files do not break my portfolio or export.

#### Acceptance Criteria

1. WHEN a User selects an image file of an accepted image type (JPEG, PNG, GIF, WebP, or SVG) and of size 5 MB or less for the Hero photo, About image, a Project image, or the logo, THE Editor SHALL convert the image to a Data_URI and set it as the corresponding image value.
2. IF a selected image file is not one of the accepted image types (JPEG, PNG, GIF, WebP, or SVG), THEN THE Editor SHALL reject the file, retain the previous image value unchanged, and display an error message indicating the file type is not supported.
3. IF a selected image file size exceeds 5 MB, THEN THE Editor SHALL reject the file, retain the previous image value unchanged, and display an error message indicating the file exceeds the maximum allowed size.
4. WHEN the Editor successfully converts a selected image to a Data_URI, THE Editor SHALL display the converted image in the corresponding preview.

### Requirement 13: Export Standalone HTML

**User Story:** As a User, I want to export my portfolio as a single standalone HTML file, so that I can open or share it anywhere without a server.

#### Acceptance Criteria

1. WHEN a User requests an export, THE Exporter SHALL generate a single HTML file that contains all currently configured portfolio content and trigger a browser download of that file.
2. THE Exporter SHALL inline all CSS into the Exported_Page such that the Exported_Page contains no external stylesheet references.
3. THE Exporter SHALL embed all images in the Exported_Page as base64 Data_URI values such that the Exported_Page contains no external image references.
4. THE Exported_Page SHALL render all portfolio content when opened directly from the file system without a running server and without issuing any network request to load CSS or images.
5. THE Exporter SHALL escape the HTML special characters (&, <, >, ", ') in user-provided text content so that field values containing HTML markup are rendered as literal text rather than interpreted as markup.
6. THE Exporter SHALL exclude editor placeholder text from the Exported_Page such that fields left at their default placeholder value produce no corresponding text in the Exported_Page.
7. IF a social or project link URL does not match a valid http or https URL pattern, THEN THE Exporter SHALL omit that link from the Exported_Page while retaining all other content.

## Out of Scope

The following are explicitly excluded from this MVP:

- **Publishing and hosting**: Deploying the portfolio to a live URL is deferred to a future phase. The MVP delivers export as a standalone HTML file only.
- **Backend and accounts**: No server-side storage, authentication, or multi-device sync. Persistence is local to the browser via the Persistence_Store.
- **Deep customization**: Custom color pickers, arbitrary fonts, or free-form layout editing. The Theme_System is intentionally limited to three curated themes and three fonts.
- **Whole-page templates**: Layout selection is per-section only.
- **Additional sections**: Only Hero, About, Projects, and Contact are in scope for the MVP.

## Future Considerations

- Publishing/hosting the generated portfolio to a live URL (phase 2).
- Expanded theme and font libraries.
- Additional section types.
