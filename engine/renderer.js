import { ACTOR_SPRITES, PALETTE } from './spriteData.js';
import { getEnemyFrame, getPlayerFrame } from './sprites.js';

export const LOGICAL_WIDTH = 280;
export const LOGICAL_HEIGHT = 192;
export const SCALE = 3;

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.canvas.width = LOGICAL_WIDTH;
    this.canvas.height = LOGICAL_HEIGHT;
    this.canvas.style.width = `${LOGICAL_WIDTH * SCALE}px`;
    this.canvas.style.height = `${LOGICAL_HEIGHT * SCALE}px`;

    this.frontContext = this.canvas.getContext('2d');
    this.frontContext.imageSmoothingEnabled = false;

    this.backBuffer = document.createElement('canvas');
    this.backBuffer.width = LOGICAL_WIDTH;
    this.backBuffer.height = LOGICAL_HEIGHT;
    this.backContext = this.backBuffer.getContext('2d');
    this.backContext.imageSmoothingEnabled = false;
  }

  drawSprite(frame, x, y) {
    for (let row = 0; row < frame.height; row += 1) {
      const data = frame.rows[row];
      for (let col = 0; col < frame.width; col += 1) {
        const paletteKey = data[col];
        const color = PALETTE[paletteKey];
        if (!color) {
          continue;
        }

        this.backContext.fillStyle = color;
        this.backContext.fillRect(x + col, y + row, 1, 1);
      }
    }
  }

  drawHealth(x, y, width, value, color) {
    this.backContext.fillStyle = '#151515';
    this.backContext.fillRect(x, y, width, 5);
    this.backContext.fillStyle = color;
    this.backContext.fillRect(x, y, Math.floor((width * value) / 100), 5);
  }

  render(world) {
    this.backContext.fillStyle = '#0a1024';
    this.backContext.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    this.backContext.fillStyle = '#121212';
    this.backContext.fillRect(0, 148, LOGICAL_WIDTH, 44);

    this.backContext.fillStyle = '#473420';
    this.backContext.fillRect(0, 160, LOGICAL_WIDTH, 8);

    const playerFrame = ACTOR_SPRITES.player[getPlayerFrame(world.stateMachine.state, world.animation)];
    const enemyFrame = ACTOR_SPRITES.enemy[getEnemyFrame(world.stateMachine.state, world.animation)];

    this.drawSprite(playerFrame, world.physics.playerX, world.physics.playerY);
    this.drawSprite(enemyFrame, world.physics.enemyX, world.physics.enemyY);

    this.drawHealth(12, 10, 100, world.combat.playerHealth, '#95c57f');
    this.drawHealth(168, 10, 100, world.combat.enemyHealth, '#c57f7f');

    this.backContext.fillStyle = '#f0f0f0';
    this.backContext.fillText(world.stateMachine.state, 126, 14);

    this.frontContext.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    this.frontContext.drawImage(this.backBuffer, 0, 0);
  }
}
