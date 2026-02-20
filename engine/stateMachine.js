export const GAME_STATES = Object.freeze({
  INTRO: 'intro',
  APPROACH: 'approach',
  COMBAT: 'combat',
  TRANSITION: 'transition',
  VICTORY: 'victory',
  DEATH: 'death',
});

const STATE_DURATIONS = Object.freeze({
  [GAME_STATES.INTRO]: 180,
  [GAME_STATES.APPROACH]: 240,
  [GAME_STATES.COMBAT]: 360,
  [GAME_STATES.TRANSITION]: 60,
  [GAME_STATES.VICTORY]: 180,
  [GAME_STATES.DEATH]: 180,
});

export class KaratekaStateMachine {
  constructor() {
    this.state = GAME_STATES.INTRO;
    this.stateTick = 0;
    this.transitionLog = [`0:${this.state}`];
  }

  setState(nextState, tick) {
    this.state = nextState;
    this.stateTick = 0;
    this.transitionLog.push(`${tick}:${nextState}`);
  }

  update(tick, combatResult = 'victory') {
    this.stateTick += 1;

    if (this.state === GAME_STATES.INTRO && this.stateTick >= STATE_DURATIONS[GAME_STATES.INTRO]) {
      this.setState(GAME_STATES.APPROACH, tick);
      return;
    }

    if (this.state === GAME_STATES.APPROACH && this.stateTick >= STATE_DURATIONS[GAME_STATES.APPROACH]) {
      this.setState(GAME_STATES.COMBAT, tick);
      return;
    }

    if (this.state === GAME_STATES.COMBAT && this.stateTick >= STATE_DURATIONS[GAME_STATES.COMBAT]) {
      this.setState(GAME_STATES.TRANSITION, tick);
      this.pendingCombatResult = combatResult;
      return;
    }

    if (this.state === GAME_STATES.TRANSITION && this.stateTick >= STATE_DURATIONS[GAME_STATES.TRANSITION]) {
      this.setState(this.pendingCombatResult === 'death' ? GAME_STATES.DEATH : GAME_STATES.VICTORY, tick);
      return;
    }
  }
}
