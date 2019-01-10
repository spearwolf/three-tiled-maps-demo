import * as spearwolf from 'spearwolf-js';

export type ImageSource = HTMLImageElement | HTMLCanvasElement | HTMLVideoElement;

const convertToPowerOf2 = (image: ImageSource) => {
  const w = spearwolf.findNextPowerOf2(image.width);
  const h = spearwolf.findNextPowerOf2(image.height);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(image, 0, 0);

  return canvas;
};

/**
 * Represents a `<img>` or `<canvas>` element which sizes (width and height) are
 * always power of 2.
 */
export class PowerOf2Image {

  readonly onLoaded: Promise<PowerOf2Image>;

  imgEl: ImageSource;

  origWidth: number;
  origHeight: number;

  /**
   * If image source dimension is NOT power of 2 then create a new `<canvas>`
   * (with power of 2 dimension) and copy the original image content onto it.
   * Since fetching imge data from server is a *async* operation the `imgEl` property
   * can be `null` right after object construction and will be set later after
   * image is loaded (and possible converted).
   */
  constructor(from: string | ImageSource) {
    let imgEl: ImageSource;
    let waitUntilLoading = false;
    if (typeof from === 'string') {
      imgEl = new Image();
      imgEl.src = from;
      waitUntilLoading = true;
    } else {
      imgEl = from;
    }
    const imageHasValidSize = imgEl.width > 0 && imgEl.height > 0;
    if (waitUntilLoading || !imageHasValidSize) {
      this.imgEl = null;
      this.onLoaded = new Promise((resolve) => {
        const origOnLoad = imgEl.onload;
        imgEl.onload = () => {
          if (origOnLoad) { origOnLoad.call(imgEl); }
          this.setImgEl(imgEl);
          resolve(this);
        };
      });
    } else {
      this.setImgEl(imgEl);
      this.onLoaded = Promise.resolve(this);
    }
  }

  /**
   * Returns `true` if the image has loaded and possible converted.
   */
  get isLoaded() {
    return this.imgEl != null;
  }

  /**
   * Returns image width or `0` if image loading is not finished.
   */
  get width() {
    return (this.imgEl && this.imgEl.width) || 0;
  }

  /**
   * Returns image height or `0` if image loading is not finished.
   */
  get height() {
    return (this.imgEl && this.imgEl.height) || 0;
  }

  private setImgEl(imgEl: ImageSource) {
    this.imgEl = spearwolf.isPowerOf2(imgEl.width) && spearwolf.isPowerOf2(imgEl.height) ? imgEl : convertToPowerOf2(imgEl);
    this.origWidth = imgEl.width;
    this.origHeight = imgEl.height;
  }
}
