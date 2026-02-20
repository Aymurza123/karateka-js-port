const PLAYER_ANIMATION = Object.freeze({
  intro: [0, 1, 2, 1],
  approach: [3, 4, 5, 4],
  combat: [6, 7, 8, 7],
  transition: [9, 10],
  victory: [11, 12],
  death: [13, 14],
});

const ENEMY_ANIMATION = Object.freeze({
  intro: [0],
  approach: [1],
  combat: [2, 3],
  transition: [4],
  victory: [5],
  death: [6],
});

const FRAME_DURATIONS = Object.freeze({
  intro: 10,
  approach: 6,
  combat: 5,
  transition: 8,
  victory: 12,
  death: 12,
});

export function createAnimationState() {
  return {
    playerFrameIndex: 0,
    enemyFrameIndex: 0,
    frameCounter: 0,
    frameLog: [],
  };
}

export function updateAnimation(animationState, gameState, tick) {
  animationState.frameCounter += 1;
  const frameDuration = FRAME_DURATIONS[gameState];

  if (animationState.frameCounter >= frameDuration) {
    animationState.frameCounter = 0;
    const playerFrames = PLAYER_ANIMATION[gameState];
    const enemyFrames = ENEMY_ANIMATION[gameState];

    animationState.playerFrameIndex = (animationState.playerFrameIndex + 1) % playerFrames.length;
    animationState.enemyFrameIndex = (animationState.enemyFrameIndex + 1) % enemyFrames.length;

    const playerFrame = playerFrames[animationState.playerFrameIndex];
    const enemyFrame = enemyFrames[animationState.enemyFrameIndex];
    animationState.frameLog.push(`${tick}:P${playerFrame}-E${enemyFrame}`);
  }
}

export function getPlayerFrame(gameState, animationState) {
  return PLAYER_ANIMATION[gameState][animationState.playerFrameIndex];
}

export function getEnemyFrame(gameState, animationState) {
  return ENEMY_ANIMATION[gameState][animationState.enemyFrameIndex];
}
