export const TIMESTEP_MS = 1000 / 60;

export class FixedTimestep {
  constructor(updateFn) {
    if (typeof updateFn !== 'function') {
      throw new Error('FixedTimestep requires an update function.');
    }

    this.updateFn = updateFn;
    this.accumulatorMs = 0;
    this.lastTimeMs = 0;
    this.tick = 0;
    this.started = false;
  }

  start(startTimeMs) {
    this.accumulatorMs = 0;
    this.lastTimeMs = startTimeMs;
    this.tick = 0;
    this.started = true;
  }

  runFrame(currentTimeMs) {
    if (!this.started) {
      this.start(currentTimeMs);
      return 0;
    }

    this.accumulatorMs += currentTimeMs - this.lastTimeMs;
    this.lastTimeMs = currentTimeMs;

    let steps = 0;
    while (this.accumulatorMs >= TIMESTEP_MS) {
      this.tick += 1;
      this.updateFn(this.tick);
      this.accumulatorMs -= TIMESTEP_MS;
      steps += 1;
    }

    return steps;
  }
}
