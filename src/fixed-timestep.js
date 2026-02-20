const MICROSECONDS_PER_MILLISECOND = 1000n;
const MICROSECONDS_PER_SECOND = 1_000_000n;

function toMicroseconds(timeMs) {
  return BigInt(Math.round(timeMs * Number(MICROSECONDS_PER_MILLISECOND)));
}

export class FixedStepClock {
  constructor({ hz = 60, maxCatchupSteps = Number.POSITIVE_INFINITY } = {}) {
    if (!Number.isFinite(hz) || hz <= 0) {
      throw new Error('hz must be a positive number.');
    }

    this.hz = hz;
    this.maxCatchupSteps = maxCatchupSteps;
    this.stepUs = BigInt(Math.round(Number(MICROSECONDS_PER_SECOND) / hz));

    this.lastTimeUs = null;
    this.accumulatorUs = 0n;
    this.tick = 0;
  }

  reset(timeMs = 0) {
    this.lastTimeUs = toMicroseconds(timeMs);
    this.accumulatorUs = 0n;
    this.tick = 0;
  }

  advanceTo(timeMs, step) {
    if (typeof step !== 'function') {
      throw new Error('step callback is required.');
    }

    const nowUs = toMicroseconds(timeMs);

    if (this.lastTimeUs === null) {
      this.lastTimeUs = nowUs;
      return 0;
    }

    if (nowUs < this.lastTimeUs) {
      throw new Error('time must be monotonic.');
    }

    this.accumulatorUs += nowUs - this.lastTimeUs;
    this.lastTimeUs = nowUs;

    let executedSteps = 0;
    while (this.accumulatorUs >= this.stepUs && executedSteps < this.maxCatchupSteps) {
      this.accumulatorUs -= this.stepUs;
      this.tick += 1;
      step({
        dtSeconds: Number(this.stepUs) / Number(MICROSECONDS_PER_SECOND),
        tick: this.tick,
      });
      executedSteps += 1;
    }


    return executedSteps;
  }

  alpha() {
    return Number(this.accumulatorUs) / Number(this.stepUs);
  }
}
