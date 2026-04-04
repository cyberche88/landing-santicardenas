```markdown
# Design System Documentation: High-Urgency Financial Intelligence

## 1. Overview & Creative North Star: "The Sovereign Crisis"
This design system is engineered for high-stakes financial environments where information is a weapon and seconds are currency. Our Creative North Star is **"The Sovereign Crisis"**—an aesthetic that merges the aggressive urgency of a trading floor with the elite, guarded feel of a private vault.

To break the "template" look, we move away from safe, centered layouts. Instead, we utilize **intentional asymmetry**, **brutalist edges**, and **editorial layering**. Elements should feel "pasted" onto a digital terminal, using finance-inspired grid lines and glitch artifacts to suggest a live, volatile data feed. We do not design for comfort; we design for impact, provocation, and elite decision-making.

---

## 2. Colors & Surface Philosophy
The palette is a high-contrast battleground. We use deep blacks to represent stability and "Fire Red" to signal immediate action or systemic threat. "Aged Gold" is used sparingly to denote premium status and exclusive insights.

### The "No-Line" Rule
Standard 1px solid borders are strictly prohibited for sectioning. They feel "web-standard" and cheap. Boundaries must be defined through:
- **Tonal Shifts:** Placing a `surface-container-low` section against a `surface` background.
- **Negative Space:** Using the spacing scale to create hard breaks in content.
- **Grid Artifacts:** Using the `outline-variant` token at 10% opacity to create "technical" hairline crosshairs or corner brackets rather than full boxes.

### Surface Hierarchy & Nesting
Treat the UI as a series of recessed or extruded physical layers.
- **The Base:** All core layouts start at `surface` (#131313).
- **The Depth:** Use `surface-container-lowest` (#0e0e0e) for backgrounds of high-data density areas to make them feel "sunken" into the screen.
- **The Callout:** Use `surface-bright` (#393939) only for transient elements like hover states or active terminal lines.

### Signature Textures & "Glass & Gradient"
To provide "soul" to the darkness, use subtle linear gradients on primary CTAs, transitioning from `primary` (#ffb4aa) to `primary-container` (#ff5545). For floating HUD elements, utilize **Glassmorphism**: semi-transparent `surface-container-highest` with a 20px backdrop-blur to create an "advanced optics" feel.

---

## 3. Typography: Authority & Precision
The typography scale is a dialogue between raw power and clinical clarity.

* **Display & Headlines (`Space Grotesk`):** These must always be **All-Caps**. The aggressive tracking (e.g., -0.05em) and heavy weight convey the urgency of a headline that cannot be ignored. Use `display-lg` for market-moving alerts.
* **Body & Labels (`Inter`):** This is your tactical data. It must be hyper-legible. We use `body-md` for standard intel and `label-sm` for technical metadata.
* **The Contrast Rule:** Never pair two sans-serifs of similar weights. If the headline is Heavy, the sub-headline must be Light or Medium to maintain an editorial, high-end hierarchy.

---

## 4. Elevation & Depth: Tonal Layering
We reject the "Material" drop shadow. In this system, depth is a product of light and material density.

* **The Layering Principle:** Stack `surface-container` tiers. A `surface-container-high` card should sit on a `surface-container-low` background. This creates a "machined" look, as if the UI was carved from a single block of dark matte metal.
* **Ambient Glows:** Instead of shadows, use "Alarm Glows." When an element is urgent, apply an outer glow using the `primary` (Fire Red) token with a 30px blur at 10% opacity. It should look like a warning light reflecting off a dark surface.
* **The "Ghost Border" Fallback:** If containment is required for accessibility, use the `outline-variant` (#5d3f3b) at **15% opacity**. This creates a "whisper" of a line that feels like a technical blueprint rather than a container.

---

## 5. Components

### Buttons (The "Trigger" Component)
* **Primary:** Solid `primary` (#ffb4aa) background, `on-primary` (#690003) text. Hard 0px corners. Use a glitch-hover effect where the button slightly offsets or shifts color on interaction.
* **Secondary:** `surface-container-highest` background with an `Aged Gold` (`secondary`) left-side accent bar (2px).
* **Tertiary:** All-caps text using `label-md` with a subtle `primary` underline that expands on hover.

### Input Fields
* **Styling:** No background. Only a bottom-border using `outline-variant`.
* **States:** On focus, the bottom border transitions to `primary` (Fire Red) with a faint `primary` glow. Helper text must use `label-sm` and feel like "system code."

### Cards & Lists
* **Forbidden:** Divider lines between list items.
* **Requirement:** Use a 4px vertical "status bar" on the left edge of cards to indicate urgency—`primary` for high, `secondary` for premium/neutral. Separate items using `surface-container-lowest` as a "trench" between sections.

### Financial HUD (Specialty Component)
* **Grid Lines:** Overly thin (0.5px) vertical and horizontal lines using `outline-variant` at 10% opacity to mimic a financial terminal.
* **Glitch Indicators:** For "Elite" or "Critical" data, use a CSS-clip path animation to create a subtle flickering effect on the `display-sm` typography.

---

## 6. Do’s and Don’ts

### Do:
* **Use 0px Border Radius:** Everything is sharp. Sharpness equals precision.
* **Embrace Asymmetry:** Align high-level stats to the far right while keeping headlines to the left.
* **Layer Textures:** Use subtle scan-line patterns or noise textures on `surface` backgrounds to avoid a flat "digital" look.

### Don’t:
* **Don't use Rounded Corners:** Ever. It breaks the "aggressive/elite" persona.
* **Don't use Grey Shadows:** Shadows should always be a tinted variant of the background or a red "glow."
* **Don't use Standard Icons:** Use technical, thin-line iconography that looks like instrumentation, not "friendly" consumer app icons.
* **Don't Overuse Gold:** Gold (`secondary`) is for the 1%. Use it only for premium features, elite tiers, or "Buy" signals. Overuse dilutes the "Aged Gold" prestige.