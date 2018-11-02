import * as THREE from 'three';

export class TextureBakery {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly texture: THREE.Texture;

  backgroundStyle: string = '#789';
  borderStyle: string = '#567';
  textStyle: string = '#ffa';
  textShadowStyle: string = '#234';

  private lastText: string;

  constructor(width: number, height: number) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.textAlign = 'center';
    this.setFont('16px monospace');
    this.ctx.lineWidth = 2;
    this.texture = new THREE.CanvasTexture(this.canvas);
  }

  get width() { return this.canvas.width; }
  get height() { return this.canvas.height; }

  setFont(font: string) {
    this.ctx.font = font;
  }

  clear() {
    const { ctx } = this;
    ctx.fillStyle = this.backgroundStyle;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  drawText(text: string) {
    const { ctx } = this;
    const textWidth = ctx.measureText(text).width;
    const x = ((this.width - textWidth) >> 1) + (textWidth >> 1);
    const y = this.height >> 1;
    ctx.fillStyle = this.textShadowStyle;
    ctx.fillText(text, x + 1, y + 1, this.width);
    ctx.fillStyle = this.textStyle;
    ctx.fillText(text, x, y, this.width);
  }

  drawBorder() {
    const { ctx } = this;
    ctx.strokeStyle = this.borderStyle;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.width, 0);
    ctx.lineTo(this.width, this.height);
    ctx.lineTo(0, this.height);
    ctx.lineTo(0, 0);
    ctx.lineTo(this.width, this.height);
    ctx.moveTo(0, this.height);
    ctx.lineTo(this.height, 0);
    ctx.stroke();
  }

  make(text: string) {
    if (text !== this.lastText) {
      this.clear();
      this.drawBorder();
      this.drawText(text);
      this.lastText = text;
      this.texture.needsUpdate = true;
    }
  }

  appendTo(el: HTMLElement) {
    const { canvas } = this;
    canvas.classList.add('textureBakery');
    el.appendChild(canvas);
  }
}
