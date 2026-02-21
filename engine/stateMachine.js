export const GAME_STATES = Object.freeze({
  INTRO: 'intro',
  APPROACH: 'approach',
  COMBAT: 'combat',
  TRANSITION: 'transition',
  VICTORY: 'victory',
  DEATH: 'death',
});

const STATE_TABLE = Object.freeze({
  [GAME_STATES.INTRO]: Object.freeze({ duration: 180, next: GAME_STATES.APPROACH }),
  [GAME_STATES.APPROACH]: Object.freeze({ duration: 240, next: GAME_STATES.COMBAT }),
  [GAME_STATES.COMBAT]: Object.freeze({ duration: 360, next: GAME_STATES.TRANSITION }),
  [GAME_STATES.TRANSITION]: Object.freeze({ duration: 60, next: null }),
  [GAME_STATES.VICTORY]: Object.freeze({ duration: 180, next: null }),
  [GAME_STATES.DEATH]: Object.freeze({ duration: 180, next: null }),
});

export class KaratekaStateMachine {
  constructor() {
    this.state = GAME_STATES.INTRO;
    this.stateTick = 0;
    this.pendingCombatResult = 'victory';
    this.transitionLog = [`0:${this.state}`];
  }

  setState(nextState, tick) {
    this.state = nextState;
    this.stateTick = 0;
    this.transitionLog.push(`${tick}:${nextState}`);
  }

  update(tick, combatResult = 'victory') {
    this.stateTick += 1;
    const stateRow = STATE_TABLE[this.state];

    if (!stateRow || this.stateTick < stateRow.duration) {
      return;
    }

    if (this.state === GAME_STATES.COMBAT) {
      this.pendingCombatResult = combatResult;
    }

    if (this.state === GAME_STATES.TRANSITION) {
      const terminal = this.pendingCombatResult === 'death' ? GAME_STATES.DEATH : GAME_STATES.VICTORY;
      this.setState(terminal, tick);
      return;
    }

    if (stateRow.next) {
      this.setState(stateRow.next, tick);
    }
  }
}
