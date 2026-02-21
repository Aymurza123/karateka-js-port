export const PLAYER_ANIMATION = Object.freeze({
  intro: ['idle'],
  approach: ['walk1', 'idle', 'walk2', 'idle'],
  combat_idle: ['idle'],
  player_punch: ['punch', 'idle'],
  player_kick: ['kick', 'idle'],
  player_hurt: ['hurt', 'idle'],
  enemy_punch: ['idle'],
  enemy_kick: ['idle'],
  enemy_hurt: ['idle'],
  transition: ['idle'],
  victory: ['victory'],
  death: ['death'],
});

export const ENEMY_ANIMATION = Object.freeze({
  intro: ['idle'],
  approach: ['walk1', 'idle', 'walk2', 'idle'],
  combat_idle: ['idle'],
  player_punch: ['idle'],
  player_kick: ['idle'],
  player_hurt: ['hurt', 'idle'],
  enemy_punch: ['punch', 'idle'],
  enemy_kick: ['kick', 'idle'],
  enemy_hurt: ['hurt', 'idle'],
  transition: ['idle'],
  victory: ['victory'],
  death: ['death'],
});

const FRAME_DURATIONS = Object.freeze({
  intro: 14,
  approach: 8,
  combat_idle: 10,
  player_punch: 5,
  player_kick: 7,
  player_hurt: 6,
  enemy_punch: 5,
  enemy_kick: 7,
  enemy_hurt: 6,
  transition: 8,
  victory: 14,
  death: 14,
});

export function createAnimationState() {
  return {
    playerFrameIndex: 0,
    enemyFrameIndex: 0,
    frameCounter: 0,
    frameLog: [],
    activePose: 'intro',
    playerSpriteName: 'idle',
    enemySpriteName: 'idle',
  };
}

function resolvePose(world) {
  if (world.stateMachine.state === 'combat') {
    return world.combat.currentAction;
  }

  return world.stateMachine.state;
}

export function updateAnimation(animationState, world) {
  const pose = resolvePose(world);
  animationState.activePose = pose;
  animationState.frameCounter += 1;
  const frameDuration = FRAME_DURATIONS[pose] ?? 8;

  if (animationState.frameCounter >= frameDuration) {
    animationState.frameCounter = 0;
    const playerFrames = PLAYER_ANIMATION[pose] ?? PLAYER_ANIMATION.combat_idle;
    const enemyFrames = ENEMY_ANIMATION[pose] ?? ENEMY_ANIMATION.combat_idle;

    animationState.playerFrameIndex = (animationState.playerFrameIndex + 1) % playerFrames.length;
    animationState.enemyFrameIndex = (animationState.enemyFrameIndex + 1) % enemyFrames.length;
    animationState.playerSpriteName = playerFrames[animationState.playerFrameIndex];
    animationState.enemySpriteName = enemyFrames[animationState.enemyFrameIndex];

    animationState.frameLog.push(
      `${world.tick}:P${animationState.playerSpriteName}-E${animationState.enemySpriteName}-${pose}`,
    );
  }
}

export function getPlayerFrame(_gameState, animationState) {
  return animationState.playerSpriteName;
}

export function getEnemyFrame(_gameState, animationState) {
  return animationState.enemySpriteName;
}
