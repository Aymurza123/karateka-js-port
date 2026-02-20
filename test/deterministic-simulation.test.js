import test from 'node:test';
import assert from 'node:assert/strict';
import { DeterministicSimulation } from '../src/port.js';

function runSimulation(frameTimes, hz = 60) {
  const sim = new DeterministicSimulation({ hz });
  sim.setState({ x: 0, vx: 3, aiCounter: 0, animationFrame: 0 });

  sim.addSystem('physics', (state, dt) => {
    state.x += state.vx * dt;
  });

  sim.addSystem('ai', (state, _dt, tick) => {
    if (tick % 10 === 0) {
      state.aiCounter += 1;
    }
  });

  sim.addSystem('animation', (state, _dt, tick) => {
    state.animationFrame = tick % 6;
  });

  sim.start(0);
  for (const t of frameTimes) {
    sim.frame(t);
  }

  return {
    ...sim.state,
    tick: sim.clock.tick,
    alpha: sim.interpolationAlpha(),
  };
}

test('identical outcome at different CPU/frame rates', () => {
  const slowFrames = [16, 33, 50, 66, 83, 100, 116, 133, 150, 166, 183, 200, 216, 233, 250, 266, 283, 300, 316, 333, 350, 366, 383, 400, 416, 433, 450, 466, 483, 500, 516, 533, 550, 566, 583, 600, 616, 633, 650, 666, 683, 700, 716, 733, 750, 766, 783, 800, 816, 833, 850, 866, 883, 900, 916, 933, 950, 966, 983, 1000];
  const fastFrames = Array.from({ length: 250 }, (_, i) => (i + 1) * 4);

  const slow = runSimulation(slowFrames);
  const fast = runSimulation(fastFrames);

  assert.equal(slow.tick, fast.tick);
  assert.equal(slow.aiCounter, fast.aiCounter);
  assert.equal(slow.animationFrame, fast.animationFrame);
  assert.ok(Math.abs(slow.x - fast.x) < 1e-10);
});

test('split vs single-frame progression ends in same state', () => {
  const single = runSimulation([1000]);
  const split = runSimulation([250, 500, 750, 1000]);

  assert.equal(single.tick, split.tick);
  assert.equal(single.aiCounter, split.aiCounter);
  assert.equal(single.animationFrame, split.animationFrame);
  assert.ok(Math.abs(single.x - split.x) < 1e-10);
});
