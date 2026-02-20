# Timing model

## Phase 1: analyze original timing model

The Apple II Karateka runtime is tied to fixed hardware cadence. The port therefore uses a fixed simulation cadence of 60Hz. Render cadence is decoupled and can vary with the browser refresh rate and CPU speed.

## Phase 2: implement fixed timestep engine

`engine/timestep.js` implements a fixed-size simulation step (`1000 / 60` ms per tick) with an accumulator. Each frame:

1. elapsed wall-clock time is added to accumulator
2. while accumulator has at least one step, the simulation updates exactly once per step
3. render runs after all pending updates

No simulation update depends on rendering speed.

## Phase 3: implement state machine

`engine/stateMachine.js` keeps the original-style state ordering with explicit states:

- `intro`
- `approach`
- `combat`
- `transition`
- `victory`
- `death`

Each state has a deterministic tick duration and transitions are logged with tick numbers.

## Phase 4: implement rendering

`engine/renderer.js` configures exact logical resolution: `280x192`. A same-sized offscreen back buffer is rendered first, then copied to the visible canvas. Pixel smoothing is disabled in both contexts.

## Phase 5: implement animation timing

`engine/sprites.js` advances sprite frame indexes with integer counters only. Frame durations are state-specific integer tick counts. Animation is independent from render timing.

## Phase 6: integrate everything

`main.js` integrates input, state machine, physics, animation, renderer, and fixed-step loop. Validation logs for transitions and animation frames can be reproduced through `runValidationTicks` for deterministic cross-run comparison.
