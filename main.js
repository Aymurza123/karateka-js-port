import { FixedTimestep } from './engine/timestep.js';
import { KaratekaStateMachine } from './engine/stateMachine.js';
import { Renderer } from './engine/renderer.js';
import { createAnimationState, updateAnimation } from './engine/sprites.js';
import { createPhysicsState, updatePhysics } from './engine/physics.js';
import { InputController } from './engine/input.js';

export function createWorld() {
  return {
    tick: 0,
    stateMachine: new KaratekaStateMachine(),
    physics: createPhysicsState(),
    animation: createAnimationState(),
    validationLog: [],
  };
}

export function updateGameState(world, input) {
  world.tick += 1;

  if (input.keys.left) {
    world.physics.playerVx = -1;
  } else if (input.keys.right) {
    world.physics.playerVx = 1;
  }

  world.stateMachine.update(world.tick);
  updatePhysics(world.physics, world.stateMachine.state);
  updateAnimation(world.animation, world.stateMachine.state, world.tick);

  if (world.tick % 30 === 0) {
    world.validationLog.push(
      `${world.tick}|${world.stateMachine.state}|X${world.physics.playerX}|E${world.physics.enemyX}|F${world.animation.playerFrameIndex}`,
    );
  }
}

export function runValidationTicks(totalTicks = 600) {
  const world = createWorld();
  const input = { keys: { left: 0, right: 0, punch: 0, kick: 0 } };

  for (let i = 0; i < totalTicks; i += 1) {
    updateGameState(world, input);
  }

  return {
    transitions: [...world.stateMachine.transitionLog],
    frames: [...world.animation.frameLog],
    validation: [...world.validationLog],
  };
}

if (typeof document !== 'undefined') {
  const canvas = document.getElementById('screen');
  const renderer = new Renderer(canvas);
  const input = new InputController(window);
  const world = createWorld();

  const stepper = new FixedTimestep(() => {
    updateGameState(world, input);
  });

  function render() {
    renderer.render(world);
  }

  function loop(currentTime) {
    stepper.runFrame(currentTime);
    render();
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}
