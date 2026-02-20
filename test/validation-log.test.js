import test from 'node:test';
import assert from 'node:assert/strict';
import { runValidationTicks } from '../main.js';

test('validation sequence is deterministic across runs', () => {
  const first = runValidationTicks(900);
  const second = runValidationTicks(900);

  assert.deepEqual(first.transitions, second.transitions);
  assert.deepEqual(first.frames, second.frames);
  assert.deepEqual(first.validation, second.validation);
});

test('state machine visits required states in original order', () => {
  const result = runValidationTicks(900);
  const states = result.transitions.map((entry) => entry.split(':')[1]);

  assert.deepEqual(states, ['intro', 'approach', 'combat', 'transition', 'victory']);
});
