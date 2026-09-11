# Midnight Havana — DESIGN.md

## 1. Design direction

### Core idea

**Midnight Havana = vintage Havana nightlife character expressed through a contemporary Berlin editorial interface.**

The current flyer is intentionally rich: warm amber/orange lighting, Havana/Cuba references, a decorative Victorian display wordmark, illustrated architecture, dancing, a vintage car, and dense event information. The website should **retain that cultural and nocturnal character without copying the flyer literally**.

The existing website direction already establishes the right product behavior: mobile-first, bilingual, a full-viewport flyer-led hero, scrollable frames, and an event-detail page that presents the poster before the schedule. The PDF explicitly describes the current version as **“MOBILE-FIRST V2 · ZWEISPRACHIG”**, with German as the standard language, English as a switchable alternative, the flyer hero filling the viewport, and the header/lower bar appearing on scroll. It also defines Event Detail as **“Erst das Poster, dann der Zeitplan”** and the menu as full-screen and thumb-reachable. fileciteturn0file0L2-L11

The design system should therefore be a **translation layer** between the expressive flyer and a calm digital interface.

---

## 2. Brand personality

### Desired adjectives

- nocturnal
- warm
- sensual
- social
- cultured
- handcrafted
- metropolitan
- editorial
- confident
- intimate

### Avoid

- generic “Latin party” styling
- overly tropical UI
- casino aesthetics
- glossy nightclub gradients
- generic startup/SaaS cards
- excessive gold everywhere
- fake parchment textures as a UI background
- making every element decorative

### Ratio of expression

Use roughly:

**70% contemporary editorial system**  
**20% Havana / nightlife atmosphere**  
**10% vintage ornament**

The flyer can remain 100% expressive. The website UI should be quieter because the wordmark, photography, and poster already carry the brand's personality.

---

## 3. Logo / wordmark

### Primary wordmark

Use the custom **MIDNIGHT HAVANA** Victorian cigar-label serif wordmark as the principal brand mark.

Characteristics to preserve:

- high stroke contrast
- sharp bracketed/flared serifs
- pointed apexes
- decorative M and H swashes
- long final-A tail
- tightly stacked two-line construction
- flat cream lettering
- transparent background when used as SVG

### Recommended usage

**Primary:** cream wordmark on dark imagery or near-black surfaces.

**Secondary:** near-black wordmark on parchment/cream surfaces.

Do not redraw the logo in a system font. Do not apply bevels, metallic effects, drop shadows, gradients, outlines, or texture.

### Clear-space rule

Maintain a minimum clear space around the wordmark equal to approximately **0.35× the cap height of “MIDNIGHT”**.

Never place dense UI text directly against the swashes or final-A tail.

---

## 4. Typography

The logo is the expressive serif. Supporting typography should be deliberately neutral.

### A. UI / functional type

Preferred family:

**Inter**

Alternative commercial choices:

- Neue Haas Grotesk
- Suisse Int'l
- Helvetica Now

Use the neutral grotesk for:

- navigation
- buttons
- dates
- prices
- event metadata
- descriptions
- forms
- labels
- language controls

### B. Editorial accent

Optional:

**Instrument Serif**

Use sparingly for:

- pull quotes
- editorial intros
- occasional section statements

It should never compete with the Midnight Havana wordmark.

### C. Type hierarchy

Recommended scale:

| Role | Weight | Treatment |
|---|---:|---|
| Hero event title | 700–800 | condensed/large sans or poster-derived display type |
| Section title | 600–700 | uppercase, compact sans |
| Body | 400 | neutral sans |
| Metadata | 500–600 | uppercase, tracked |
| Labels | 500–600 | small uppercase, tracked |
| Price | 600–700 | compact sans |

### Tracking

Use tracking as a major part of the identity.

- small labels: **0.10–0.16em**
- navigation: **0.05–0.10em**
- section headings: **0.03–0.08em**
- body copy: normal / near-zero tracking

---

## 5. Color system

The flyer currently leans heavily into orange, amber, brown, black, and cream. Keep the warmth, but convert it into a restrained digital palette rather than reproducing the full illustration palette everywhere.

### Core tokens

```css
:root {
  --ink: #151413;
  --black: #000000;
  --graphite: #3D3A36;
  --stone: #77736C;
  --parchment: #F3EEE5;
  --bone: #E6DED2;
  --cream: #F5ECE0;
  --tobacco: #8A5A3B;
  --signal: #E85E22;
}
```

### Roles

**Ink `#151413`**  
Primary application background and dark surface.

**Black `#000000`**  
Maximum-contrast moments, logo treatment, photographic overlays.

**Parchment `#F3EEE5`**  
Primary light surface.

**Cream `#F5ECE0`**  
Wordmark and key reversed text.

**Graphite `#3D3A36`**  
Secondary text.

**Stone `#77736C`**  
Quiet metadata / tertiary copy.

**Tobacco `#8A5A3B`**  
Optional heritage accent, used very sparingly.

**Signal `#E85E22`**  
Interactive CTA accent derived from the flyer’s orange-red warmth.

### Important rule

Do **not** make gold the default UI color. The flyer can contain luminous gold/amber tones; the website should use warm neutrals and one controlled orange accent.

---

## 6. Surfaces and backgrounds

### Default dark mode

The primary digital experience should feel like a dim venue after sunset:

- near-black background
- warm cream typography
- subtle warm hairlines
- orange only for emphasis

Avoid gradients in the UI itself.

### Photography

Photography is where atmospheric color should live.

Use:

- warm tungsten light
- deep shadows
- amber highlights
- occasional red stage lighting
- human presence and social energy

Apply dark overlays only as needed for legibility.

### Texture

Do not use paper grain as a default UI treatment.

Texture belongs to the **source material / flyer**, not to every interface surface.

---

## 7. Layout system

### Principle

**Editorial rhythm over component density.**

The flyer is dense. The website should create breathing room around the same information.

### Grid

Desktop:

- 12-column grid
- max content width: 1200–1280px
- generous outer margins
- strong asymmetric compositions where appropriate

Mobile:

- 4-column conceptual grid
- 16–20px side padding
- 12–16px internal gaps
- full-bleed media when editorially justified

### Spacing scale

Use a compact spacing system based on 4px increments:

`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`

Reserve the larger values for section transitions and hero compositions.

---

## 8. Components

### Buttons

Buttons should resemble **small printed tickets / labels**, not app pills.

Preferred:

- squared or minimally rounded corners
- 1px border
- uppercase labels
- tracked typography
- high-contrast fill for primary actions

Primary:

- orange fill
- near-black text

Secondary:

- transparent / dark fill
- cream border
- cream text

Avoid oversized rounded capsules.

### Cards

Use cards only when they improve scanning.

Preferred treatment:

- thin warm border
- dark surface
- no shadow
- compact metadata
- strong title hierarchy

For the event page, a large poster image should function as the primary visual object rather than putting the poster inside a generic “card.”

### Dividers

Use **1px warm hairlines**.

Dividers are a major part of the visual system and should replace decorative frames.

### Icons

Use simple line icons with a consistent stroke.

Avoid illustrated icon badges unless they directly reference the flyer / dance identity.

---

## 9. Hero system

The existing PDF direction is correct: the flyer should be treated as the hero and fill the viewport. fileciteturn0file0L3-L7

### Home hero

Structure:

1. full-height flyer / event visual
2. logo or wordmark
3. event date / title
4. one concise value proposition
5. primary CTA
6. unobtrusive scroll cue

Do not place a large navigation bar over the hero by default on mobile.

The current spec explicitly delays the header and lower navigation until scrolling; preserve that behavior. fileciteturn0file0L4-L7

### Hero treatment

The flyer itself can remain highly detailed, but the UI overlay should be restrained.

Use a dark readability gradient only if needed to support text over photography. Do not add ornamental glow effects.

---

## 10. Event-detail page

The current information architecture says:

> **Poster first, schedule second.**

That is the right choice. fileciteturn0file0L8-L9

Recommended order:

1. poster / event artwork
2. event title + date
3. short description
4. key facts
5. schedule
6. booking / calendar actions
7. location
8. related events

The event page should feel like opening a physical event poster and then reading the practical details below it.

---

## 11. Schedule / course styling

The flyer presents:

- course types
- times
- entry price
- social dance timing
- location information

Translate this into a clean editorial data system.

Example pattern:

```text
KURSE

19:00    Rueda de Casino
         Beginner

20:00    Rueda de Casino
         Advanced
```

Do not recreate the flyer’s decorative icons for every row.

Use typography, dividers, and alignment to create hierarchy.

---

## 12. Navigation

The PDF calls for a full-screen, thumb-reachable mobile menu with language switching. fileciteturn0file0L9-L11

### Mobile navigation

Use:

- full-screen overlay
- large tap targets
- minimal ornament
- clear active state
- language selector near the bottom
- Instagram / community action at the bottom

Menu ordering should remain editorial and simple:

1. Neu hier?
2. Neues Format
3. Nächste Termine
4. Kurse & Preise
5. Lehrer:innen
6. Location
7. FAQ

### Language switch

German is the default.

English should be a first-class alternative, not a separate site.

Keep language control visible and predictable.

---

## 13. Photography direction

The flyer establishes a cinematic visual language that should carry into the website photography.

### Subject matter

- social dancing
- couples and groups
- intimate venue scenes
- late-evening arrivals
- DJ / music moments
- dance-floor movement
- Berlin urban context

### Treatment

Prefer:

- tungsten warmth
- strong contrast
- natural skin tones
- selective red/orange highlights
- environmental storytelling

Avoid sterile studio photography.

Avoid stock-photo Latin dance clichés.

---

## 14. Flyer-to-web translation

| Flyer element | Website translation |
|---|---|
| ornate Victorian wordmark | primary brand mark |
| amber / orange glow | restrained orange interaction accent + warm photography |
| dense poster composition | spacious editorial layout |
| vintage car / skyline / Cuba imagery | atmospheric photography rather than decorative illustration everywhere |
| banner / ribbon | compact event labels or section bars |
| star ornaments | occasional micro-detail only |
| hand-lettered headings | typography reserved for brand moments, not UI |
| illustrated badges | selective iconography |
| strong central poster | full-bleed hero / event artwork |

The goal is **not** to remove the flyer’s identity. It is to prevent the digital product from becoming visually noisy.

---

## 15. Motion

Motion should feel like a slow, confident entrance rather than a flashy nightclub animation system.

### Recommended

- 180–300ms UI transitions
- subtle image parallax
- opacity + translate reveals
- smooth section transitions
- sticky CTA on mobile after the hero

### Avoid

- bouncing UI
- excessive hover animation
- rotating decorative elements
- animated gold shimmer
- continuous background motion

---

## 16. Accessibility

Maintain WCAG-conscious contrast even though the identity is dark and atmospheric.

Required:

- clear focus states
- large mobile tap targets
- keyboard-accessible menus
- semantic headings
- alt text for event images
- language attribute changes when switching languages
- no information conveyed by color alone

The warm accent should never be the only indicator of state.

---

## 17. Responsive behavior

### Mobile-first

The current PDF explicitly defines a **390 × 844** mobile view and uses scroll-based framing. fileciteturn0file0L6-L8

Design from that baseline upward.

### Mobile

Priority:

- poster / hero
- date
- event title
- CTA
- essential metadata
- next action

### Tablet

Increase whitespace and allow poster + supporting content to breathe side by side where appropriate.

### Desktop

Introduce wider editorial compositions, but keep the same hierarchy and interaction model.

Do not turn the desktop version into a completely different visual language.

---

## 18. Content voice

The brand should sound warm, direct, confident, and human.

Prefer:

- concise sentences
- concrete invitations
- short labels
- culturally specific language used naturally
- occasional poetic phrasing in hero/editorial moments

Avoid:

- corporate marketing language
- excessive exclamation marks
- generic nightlife clichés
- overuse of “experience,” “vibes,” or “epic”

---

## 19. Final art direction

The final system should visually read as:

> **An old Havana night remembered through a modern Berlin design studio.**

The **flyer** remains expressive, illustrative, warm, and maximal.

The **website** becomes restrained, editorial, typographic, and highly usable.

The **wordmark** bridges both worlds: ornate, recognizable, and unmistakably Midnight Havana.

### One-line rule

**Keep the soul of the flyer; remove the visual noise when it becomes interface.**
