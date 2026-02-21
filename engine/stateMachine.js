export const GAME_STATES = Object.freeze({
  INTRO: 'intro',
  APPROACH: 'approach',
  COMBAT: 'combat',
  TRANSITION: 'transition',
  VICTORY: 'victory',
  DEATH: 'death',
});

const STATE_DURATIONS = Object.freeze({
  [GAME_STATES.INTRO]: 120,
  [GAME_STATES.APPROACH]: 9999,
  [GAME_STATES.COMBAT]: 9999,
  [GAME_STATES.TRANSITION]: 36,
  [GAME_STATES.VICTORY]: 180,
  [GAME_STATES.DEATH]: 180,
});

export class KaratekaStateMachine {
  constructor() {
    this.state = GAME_STATES.INTRO;
    this.stateTick = 0;
    this.transitionLog = [`0:${this.state}`];
    this.pendingCombatResult = 'victory';
  }

  setState(nextState, tick) {
    this.state = nextState;
    this.stateTick = 0;
    this.transitionLog.push(`${tick}:${nextState}`);
  }

  update(tick, world) {
    this.stateTick += 1;

    if (this.state === GAME_STATES.INTRO && this.stateTick >= STATE_DURATIONS[GAME_STATES.INTRO]) {
      this.setState(GAME_STATES.APPROACH, tick);
      return;
    }

    if (this.state === GAME_STATES.APPROACH) {
      if (world.physics.distance <= 48 || this.stateTick >= STATE_DURATIONS[GAME_STATES.APPROACH]) {
        this.setState(GAME_STATES.COMBAT, tick);
      }
      return;
    }

    if (this.state === GAME_STATES.COMBAT) {
      if (world.combat.playerHealth <= 0) {
        this.pendingCombatResult = 'death';
        this.setState(GAME_STATES.TRANSITION, tick);
        return;
      }

      if (world.combat.enemyHealth <= 0) {
        this.pendingCombatResult = 'victory';
        this.setState(GAME_STATES.TRANSITION, tick);
      }
      return;
    }

    if (this.state === GAME_STATES.TRANSITION && this.stateTick >= STATE_DURATIONS[GAME_STATES.TRANSITION]) {
      this.setState(this.pendingCombatResult === 'death' ? GAME_STATES.DEATH : GAME_STATES.VICTORY, tick);
    }
  }
}
