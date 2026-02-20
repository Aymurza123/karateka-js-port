import { GAME_STATES } from './stateMachine.js';

export function createPhysicsState() {
  return {
    playerX: 24,
    playerY: 144,
    playerVx: 1,
    enemyX: 220,
    enemyY: 144,
    enemyVx: -1,
    collision: 0,
  };
}

export function updatePhysics(state, gameState) {
  if (gameState === GAME_STATES.APPROACH) {
    state.playerX += state.playerVx;
  }

  if (gameState === GAME_STATES.COMBAT) {
    state.playerX += state.playerVx;
    state.enemyX += state.enemyVx;
  }

  if (state.playerX < 8) {
    state.playerX = 8;
  }

  if (state.playerX > 256) {
    state.playerX = 256;
  }

  state.collision = Math.abs(state.enemyX - state.playerX) <= 14 ? 1 : 0;
}
