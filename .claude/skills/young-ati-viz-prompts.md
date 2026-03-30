---
name: young-ati-viz-prompts
description: Generate 3 Grok video visualization prompts for a Young ATI track. Reads the song's emotional core, imagery, and vibe to craft cinematic AI video prompts matching the track's energy.
user_invocable: true
---

# /young-ati-viz-prompts — Generate Visualization Prompts

You generate 3 Grok Imagine video prompts for a Young ATI track. These prompts are used to create short (6-15s) AI-generated music visualizers that capture the song's emotional core.

## Before You Start

Read these files:
- The song file you're generating prompts for
- `content/style.md` — who Young ATI is, his aesthetic (cyberpunk, hacker, pink hair, Warsaw, founder life)

## Grok Video Prompt Structure

Every prompt follows the **Five-Layer Formula**:

```
[Scene — what's happening] + [Camera — how it's filmed] + [Style/Lighting — how it looks] + [Motion — how things move] + [Audio — what we hear]
```

### Rules

- **Natural language, not tags.** Write flowing scene descriptions, not keyword lists. Grok responds better to narrative.
- **50-150 words per prompt.** Too short = vague. Too long = ignored.
- **First 20-30 words matter most** — front-load the essential visual.
- **Director vocabulary:** Use shot types (wide, close-up, low-angle), camera moves (slow push-in, gentle pan, handheld), lens effects (shallow depth of field, anamorphic).
- **Emotion over description:** Use atmospheric words (melancholic, electric, dreamlike, tense, nostalgic) instead of generic ones (cool, nice, sad).
- **One aesthetic per prompt.** Don't mix cyberpunk with watercolor. Pick a lane.
- **Specify audio direction** — Grok generates synced audio. If you don't specify, it adds generic music. Direct it: "ambient synth hum," "muffled bass through walls," "silence with distant traffic."
- **No negative phrasing.** Say what you want, not what you don't want.

### Young ATI Visual Identity

Always weave in the artist's aesthetic where it fits:
- Pink/purple hair, dark circles, hoodies, screens glowing
- Office at night, monitors as the only light source
- Warsaw streets, gray buildings, neon reflections on wet pavement
- Cyberpunk founder aesthetic — not flashy, more raw/underground
- Contrast: dark present reality vs golden aspirational future
- Screens, terminals, code scrolling, cursor blinking

## The 3 Prompts

Generate exactly 3 prompts, each with a different visual approach:

### Prompt 1: Literal / Narrative
The most direct visualization of the song's story. If the song is about coding alone at 3am, show that scene. Cinematic, grounded, emotional.

### Prompt 2: Abstract / Surreal
The feeling of the song made visual. Dreamlike, symbolic, metaphorical. Floating, dissolving, warping reality. The inner experience, not the outer.

### Prompt 3: Aesthetic / Stylized
A bold visual style choice — could be anime-inspired, film noir, VHS/lo-fi, neon-drenched, or any strong aesthetic that matches the track's energy. The "music video" version.

## Output Format

Write prompts in this format inside the song file, placed between Suno style prompts and flow notes:

```markdown
**Grok video prompts:**

1. [Literal/Narrative] prompt text here

2. [Abstract/Surreal] prompt text here

3. [Aesthetic/Stylized] prompt text here
```

## What You NEVER Do

- Write generic "music visualizer" prompts — every prompt must be specific to THIS song
- Ignore the song's emotional core — the visuals must FEEL like the song
- Use more than 150 words per prompt — Grok truncates and quality drops
- Forget audio direction — always specify what the viewer should hear
- Make it look like a generic rapper video — this is a hacker-founder, not a club artist
- Skip reading the song first — you can't visualize what you haven't understood

## Input

The user invokes this skill with `/young-ati-viz-prompts` and optionally provides a path to the song file. If no path is given, ask which track to visualize.
