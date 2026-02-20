import { FixedStepClock } from './fixed-timestep.js';

/**
 * DeterministicSimulation updates all systems on a fixed-rate tick.
 * Variable rendering/frame rates only influence how many ticks run,
 * never dt size.
 */
export class DeterministicSimulation {
  constructor({ hz = 60, maxCatchupSteps = Number.POSITIVE_INFINITY } = {}) {
    this.clock = new FixedStepClock({ hz, maxCatchupSteps });
    this.systems = [];
    this.state = {};
  }

  addSystem(name, updateFn) {
    if (typeof updateFn !== 'function') {
      throw new Error(`system ${name} must provide an update function`);
    }
    this.systems.push({ name, updateFn });
  }

  setState(initialState) {
    this.state = initialState;
  }

  start(atMs = 0) {
    this.clock.reset(atMs);
  }

  frame(nowMs) {
    return this.clock.advanceTo(nowMs, ({ dtSeconds, tick }) => {
      for (const system of this.systems) {
        system.updateFn(this.state, dtSeconds, tick);
      }
    });
  }

  interpolationAlpha() {
    return this.clock.alpha();
  }
}
