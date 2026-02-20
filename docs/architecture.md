# Karateka JS Port — Phase 1 Architecture Analysis

## Scope and current repository state

This repository currently contains no game source files to analyze (only `.git` metadata and `.gitkeep`).
As a result, there is no existing implementation from which to extract concrete architecture, state transitions, timing constants, memory layouts, or rendering behavior.

Because the objective requires a **behavioral port with exact equivalence**, Phase 1 can only establish a reverse-engineering checklist and analysis template pending import/access to the original Karateka source/assets.

---

## Codebase inventory (actual)

- Present files: `.gitkeep`
- Missing: original game source, data tables, sprite/frame data, state definitions, timing constants, input maps, collision tables

---

## Required architecture elements to extract (once source is available)

The following items must be mapped directly from original code before implementing Phases 2–10.

### 1) Main game loop

To capture exactly:
- Loop driver (timer interrupt, frame tick, polling loop, etc.)
- Update cadence and render cadence relationship
- Order of operations per tick (input → logic → physics → collisions → animation → render)
- Any frame-skipping, slowdown, or pause behavior

### 2) State machine

To capture exactly:
- State enum/IDs
- Transition triggers and guards
- Entry/exit actions per state
- One-shot vs persistent substates

### 3) Game states

Expected classes of states to verify in source:
- Intro/title
- Story/cutscene transitions
- Gameplay traversal
- Combat
- Hit/stun/fall/death sequences
- Victory/end sequences

### 4) Rendering pipeline

To capture exactly:
- Background composition order
- Sprite draw order (z-priority)
- Clipping rules
- Camera/scroll model
- Screen clear/update policy

### 5) Sprite handling

To capture exactly:
- Sprite/frame memory layout
- Frame index tables
- Mirroring/flipping rules
- Anchor/pivot/origin usage

### 6) Animation timing system

To capture exactly:
- Animation step counters and tick divisors
- Per-animation frame durations
- Transition conditions between animations
- Interruptibility rules

### 7) Input handling

To capture exactly:
- Input sampling cadence
- Debounce/edge detection vs level-triggered checks
- Priority when simultaneous inputs occur
- Input lockout windows during animations/states

### 8) Collision detection

To capture exactly:
- Hitbox/hurtbox definitions per frame
- Broadphase/narrowphase ordering
- Collision response precedence
- Invulnerability windows

### 9) Physics/movement logic

To capture exactly:
- Position representation (integer/fixed-point)
- Velocity/acceleration constants
- Gravity/jump/fall equations
- Grounding, knockback, and movement constraints

### 10) Memory structures representing game state

To capture exactly:
- Global structures and object records
- Bitfields/flags
- Counters/timers
- Entity arrays and indexing strategy

---

## Phase 1 deliverables status

- ✅ Architecture analysis document created.
- ⚠️ Concrete architectural mapping is blocked until original code/assets are added to this repository.

---

## Immediate next step required before Phase 2

Provide/import the original Karateka implementation artifacts to this repository, including at minimum:

1. Source code files containing loop/state/logic
2. Sprite/frame definitions and animation tables
3. Timing constants and any data-driven state tables
4. Input mapping logic
5. Collision/physics routines

Once those are present, this document will be updated with exact, source-cited architecture and a one-to-one JS module mapping.
