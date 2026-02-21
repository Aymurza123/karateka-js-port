const ANIMATION_TABLE = Object.freeze({
  intro: Object.freeze({
    playerFrames: Object.freeze([0, 1, 2, 1]),
    enemyFrames: Object.freeze([0]),
    frameDurations: Object.freeze([10, 10, 10, 10]),
  }),
  approach: Object.freeze({
    playerFrames: Object.freeze([3, 4, 5, 4]),
    enemyFrames: Object.freeze([1]),
    frameDurations: Object.freeze([6, 6, 6, 6]),
  }),
  combat: Object.freeze({
    playerFrames: Object.freeze([6, 7, 8, 7]),
    enemyFrames: Object.freeze([2, 3]),
    frameDurations: Object.freeze([5, 5, 5, 5]),
  }),
  transition: Object.freeze({
    playerFrames: Object.freeze([9, 10]),
    enemyFrames: Object.freeze([4]),
    frameDurations: Object.freeze([8, 8]),
  }),
  victory: Object.freeze({
    playerFrames: Object.freeze([11, 12]),
    enemyFrames: Object.freeze([5]),
    frameDurations: Object.freeze([12, 12]),
  }),
  death: Object.freeze({
    playerFrames: Object.freeze([13, 14]),
    enemyFrames: Object.freeze([6]),
    frameDurations: Object.freeze([12, 12]),
  }),
});

export function createAnimationState() {
  return {
    activeState: null,
    playerFrameIndex: 0,
    enemyFrameIndex: 0,
    frameCounter: 0,
    frameLog: [],
  };
}

function resetForState(animationState, gameState) {
  if (animationState.activeState === gameState) {
    return;
  }

  animationState.activeState = gameState;
  animationState.playerFrameIndex = 0;
  animationState.enemyFrameIndex = 0;
  animationState.frameCounter = 0;
}

export function updateAnimation(animationState, gameState, tick) {
  resetForState(animationState, gameState);

  const row = ANIMATION_TABLE[gameState];
  const currentFrameDuration = row.frameDurations[animationState.playerFrameIndex];

  animationState.frameCounter += 1;
  if (animationState.frameCounter < currentFrameDuration) {
    return;
  }

  animationState.frameCounter = 0;
  animationState.playerFrameIndex = (animationState.playerFrameIndex + 1) % row.playerFrames.length;
  animationState.enemyFrameIndex = (animationState.enemyFrameIndex + 1) % row.enemyFrames.length;

  const playerFrame = row.playerFrames[animationState.playerFrameIndex];
  const enemyFrame = row.enemyFrames[animationState.enemyFrameIndex];
  animationState.frameLog.push(`${tick}:P${playerFrame}-E${enemyFrame}`);
}

export function getPlayerFrame(gameState, animationState) {
  return ANIMATION_TABLE[gameState].playerFrames[animationState.playerFrameIndex];
}

export function getEnemyFrame(gameState, animationState) {
  return ANIMATION_TABLE[gameState].enemyFrames[animationState.enemyFrameIndex];
}
