import { FixedTimestep } from './engine/timestep.js';
import { KaratekaStateMachine, GAME_STATES } from './engine/stateMachine.js';
import { Renderer } from './engine/renderer.js';
import { createAnimationState, updateAnimation } from './engine/sprites.js';
import { createPhysicsState, updatePhysics } from './engine/physics.js';
import { InputController } from './engine/input.js';

function createCombatState() {
  return {
    playerHealth: 100,
    enemyHealth: 100,
    currentAction: 'combat_idle',
    actionTicksRemaining: 0,
    playerCooldown: 0,
    enemyCooldown: 0,
    enemyPattern: 0,
    playerHitApplied: 0,
    enemyHitApplied: 0,
  };
}

export function createWorld() {
  return {
    tick: 0,
    stateMachine: new KaratekaStateMachine(),
    physics: createPhysicsState(),
    animation: createAnimationState(),
    combat: createCombatState(),
    validationLog: [],
  };
}

function playerIntent(input) {
  if (input.keys.punch) {
    return 'player_punch';
  }

  if (input.keys.kick) {
    return 'player_kick';
  }

  return null;
}

function actionDuration(action) {
  if (action.includes('punch')) {
    return 14;
  }

  if (action.includes('kick')) {
    return 18;
  }

  if (action.includes('hurt')) {
    return 12;
  }

  return 0;
}

function moveIntent(world, input) {
  world.physics.playerVx = 0;
  world.physics.enemyVx = 0;

  if (world.stateMachine.state === GAME_STATES.APPROACH) {
    world.physics.playerVx = 1;
    world.physics.enemyVx = -1;
    return;
  }

  if (world.stateMachine.state !== GAME_STATES.COMBAT) {
    return;
  }

  if (world.combat.currentAction.includes('hurt')) {
    return;
  }

  if (input.keys.left) {
    world.physics.playerVx = -1;
  } else if (input.keys.right) {
    world.physics.playerVx = 1;
  }

  if (world.physics.distance > 42 && world.combat.currentAction === 'combat_idle') {
    world.physics.enemyVx = -1;
  } else if (world.physics.distance < 24 && world.combat.currentAction === 'combat_idle') {
    world.physics.enemyVx = 1;
  }
}

function applyHits(world) {
  const combat = world.combat;
  const distance = world.physics.distance;

  if (combat.currentAction === 'player_punch' && !combat.playerHitApplied && combat.actionTicksRemaining <= 9 && distance <= 34) {
    combat.enemyHealth = Math.max(0, combat.enemyHealth - 12);
    combat.playerHitApplied = 1;
    combat.currentAction = 'enemy_hurt';
    combat.actionTicksRemaining = actionDuration('enemy_hurt');
    combat.enemyHitApplied = 0;
  }

  if (combat.currentAction === 'player_kick' && !combat.playerHitApplied && combat.actionTicksRemaining <= 12 && distance <= 42) {
    combat.enemyHealth = Math.max(0, combat.enemyHealth - 18);
    combat.playerHitApplied = 1;
    combat.currentAction = 'enemy_hurt';
    combat.actionTicksRemaining = actionDuration('enemy_hurt');
    combat.enemyHitApplied = 0;
  }

  if (combat.currentAction === 'enemy_punch' && !combat.enemyHitApplied && combat.actionTicksRemaining <= 9 && distance <= 34) {
    combat.playerHealth = Math.max(0, combat.playerHealth - 10);
    combat.enemyHitApplied = 1;
    combat.currentAction = 'player_hurt';
    combat.actionTicksRemaining = actionDuration('player_hurt');
    combat.playerHitApplied = 0;
  }

  if (combat.currentAction === 'enemy_kick' && !combat.enemyHitApplied && combat.actionTicksRemaining <= 12 && distance <= 42) {
    combat.playerHealth = Math.max(0, combat.playerHealth - 16);
    combat.enemyHitApplied = 1;
    combat.currentAction = 'player_hurt';
    combat.actionTicksRemaining = actionDuration('player_hurt');
    combat.playerHitApplied = 0;
  }
}

function updateCombat(world, input) {
  if (world.stateMachine.state !== GAME_STATES.COMBAT) {
    world.combat.currentAction = world.stateMachine.state === GAME_STATES.APPROACH ? 'approach' : world.stateMachine.state;
    return;
  }

  const combat = world.combat;
  combat.playerCooldown = Math.max(0, combat.playerCooldown - 1);
  combat.enemyCooldown = Math.max(0, combat.enemyCooldown - 1);

  if (combat.actionTicksRemaining > 0) {
    combat.actionTicksRemaining -= 1;
    applyHits(world);
    if (combat.actionTicksRemaining === 0 && world.combat.playerHealth > 0 && world.combat.enemyHealth > 0) {
      combat.currentAction = 'combat_idle';
      combat.playerHitApplied = 0;
      combat.enemyHitApplied = 0;
    }
    return;
  }

  const intent = playerIntent(input);
  if (intent && combat.playerCooldown === 0) {
    combat.currentAction = intent;
    combat.actionTicksRemaining = actionDuration(intent);
    combat.playerCooldown = intent === 'player_kick' ? 26 : 18;
    return;
  }

  if (combat.enemyCooldown === 0 && world.physics.distance <= 44) {
    combat.enemyPattern = (combat.enemyPattern + 1) % 4;
    const enemyAction = combat.enemyPattern % 2 === 0 ? 'enemy_punch' : 'enemy_kick';
    combat.currentAction = enemyAction;
    combat.actionTicksRemaining = actionDuration(enemyAction);
    combat.enemyCooldown = enemyAction === 'enemy_kick' ? 30 : 22;
    return;
  }

  combat.currentAction = 'combat_idle';
}

export function updateGameState(world, input) {
  world.tick += 1;
  moveIntent(world, input);
  updatePhysics(world.physics, world.stateMachine.state);
  updateCombat(world, input);
  world.stateMachine.update(world.tick, world);
  updateAnimation(world.animation, world);

  if (world.tick % 30 === 0) {
    world.validationLog.push(
      `${world.tick}|${world.stateMachine.state}|X${world.physics.playerX}|E${world.physics.enemyX}|PH${world.combat.playerHealth}|EH${world.combat.enemyHealth}|A${world.combat.currentAction}`,
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
