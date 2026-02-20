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

  drawRect(x, y, width, height, color) {
    this.backContext.fillStyle = color;
    this.backContext.fillRect(x, y, width, height);
  }

  render(world) {
    this.backContext.fillStyle = '#000000';
    this.backContext.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    this.drawRect(0, 160, LOGICAL_WIDTH, 32, '#303030');

    this.drawRect(world.physics.playerX, world.physics.playerY, 10, 24, '#f0f0f0');
    this.drawRect(world.physics.enemyX, world.physics.enemyY, 10, 24, '#d04040');

    this.backContext.fillStyle = '#00ff00';
    this.backContext.fillText(`state:${world.stateMachine.state}`, 8, 12);
    this.backContext.fillText(`tick:${world.tick}`, 8, 24);

    this.frontContext.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    this.frontContext.drawImage(this.backBuffer, 0, 0);
  }
}
