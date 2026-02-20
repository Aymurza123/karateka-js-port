# karateka-js-port

Refactored to use deterministic fixed-timestep simulation throughout the port.

## Deterministic simulation

- `FixedStepClock` (`src/fixed-timestep.js`) advances world state in fixed-size ticks.
- `DeterministicSimulation` (`src/port.js`) executes all simulation systems (physics, AI, animation, etc.) on the same fixed tick.
- Frame/render timing differences only change **how many** ticks run during a frame, never tick size.

## Run tests

```bash
npm test
```
