import { GAME_STATES } from './stateMachine.js';

export function createPhysicsState() {
  return {
    playerX: 28,
    playerY: 142,
    playerVx: 0,
    enemyX: 222,
    enemyY: 142,
    enemyVx: 0,
    collision: 0,
    distance: 194,
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function updatePhysics(state, gameState) {
  if (gameState === GAME_STATES.APPROACH || gameState === GAME_STATES.COMBAT) {
    state.playerX += state.playerVx;
    state.enemyX += state.enemyVx;
  }

  state.playerX = clamp(state.playerX, 8, 256);
  state.enemyX = clamp(state.enemyX, 20, 272);

  const minSpacing = 20;
  if (state.enemyX - state.playerX < minSpacing) {
    state.enemyX = state.playerX + minSpacing;
  }

  state.distance = state.enemyX - state.playerX;
  state.collision = state.distance <= 24 ? 1 : 0;
}
