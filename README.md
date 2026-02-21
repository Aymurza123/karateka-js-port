# karateka-js-port

Deterministic JavaScript gameplay prototype for Karateka with fixed-step simulation, sprite animation rendering, enemy combat AI, and reproducible validation logs.

## Run in browser

Open `index.html` in a modern browser.

## Controls

- Arrow Left / Arrow Right: move while in combat
- Z: punch
- X: kick

## Deterministic validation

```bash
npm test
```

Validation tests assert deterministic state transitions and animation/combat logs between runs.
