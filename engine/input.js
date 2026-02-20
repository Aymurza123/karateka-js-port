export class InputController {
  constructor(target = window) {
    this.keys = { left: 0, right: 0, punch: 0, kick: 0 };

    target.addEventListener('keydown', (event) => this.onKey(event, 1));
    target.addEventListener('keyup', (event) => this.onKey(event, 0));
  }

  onKey(event, value) {
    if (event.code === 'ArrowLeft') {
      this.keys.left = value;
    }

    if (event.code === 'ArrowRight') {
      this.keys.right = value;
    }

    if (event.code === 'KeyZ') {
      this.keys.punch = value;
    }

    if (event.code === 'KeyX') {
      this.keys.kick = value;
    }
  }
}
