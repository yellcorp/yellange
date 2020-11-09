import { reduceMax } from '../math';

export function plotHistogram(
  context2d,
  x,
  y,
  height,
  red,
  green = null,
  blue = null
) {
  if (height <= 0) {
    return;
  }

  const max = Math.max(
    reduceMax(red),
    green ? reduceMax(green) : 0,
    blue ? reduceMax(blue) : 0
  );

  if (!green) {
    green = red;
  }

  if (!blue) {
    blue = green;
  }

  const heightFactor = max / height;
  const raster = context2d.getImageData(x, y, 256, height);

  for (let row = 0, rowBase = 0; row < height; row++, rowBase += 1024) {
    const threshold = (height - row - 1) * heightFactor;
    for (let col = 0, colBase = 0; col < 256; col++, colBase += 4) {
      raster.data[rowBase + colBase] = red[col] > threshold ? 255 : 0;
      raster.data[rowBase + colBase + 1] = green[col] > threshold ? 255 : 0;
      raster.data[rowBase + colBase + 2] = blue[col] > threshold ? 255 : 0;
      raster.data[rowBase + colBase + 3] = 255;
    }
  }
  context2d.putImageData(raster, x, y);
}

function plotSingleLutAsGraph(targetPixelData, channel, lut) {
  for (let i = 0; i < lut.length; i++) {
    const v = lut[i] | 0;
    if (v >= 0 && v <= 255) {
      targetPixelData[((255 - v) << 10) | (i << 2) | channel] = 255;
    }
  }
}

export function plotLutAsGraph(
  context2d,
  x,
  y,
  red,
  green = null,
  blue = null
) {
  if (!green) {
    green = red;
  }
  if (!blue) {
    blue = green;
  }

  context2d.save();
  context2d.fillStyle = '#000';
  context2d.fillRect(x, y, 256, 256);

  const raster = context2d.getImageData(x, y, 256, 256);
  plotSingleLutAsGraph(raster.data, 0, red);
  plotSingleLutAsGraph(raster.data, 1, green);
  plotSingleLutAsGraph(raster.data, 2, blue);
  context2d.putImageData(raster, x, y);

  context2d.restore();
}

export function plotLutAsGradient(context2d, x, y, height, red, green, blue) {
  if (height <= 0) {
    return;
  }

  if (!green) {
    green = red;
  }

  if (!blue) {
    blue = green;
  }

  const raster = context2d.getImageData(x, y, 256, height);

  // plot first row
  for (let col = 0, colBase = 0; col < 256; col++, colBase += 4) {
    raster.data[colBase] = red[col];
    raster.data[colBase + 1] = green[col];
    raster.data[colBase + 2] = blue[col];
    raster.data[colBase + 3] = 255;
  }

  // copy first row to rest of drawing area
  for (let i = 1024; i < raster.data.length; i++) {
    raster.data[i] = raster.data[i & 0x3ff];
  }

  context2d.putImageData(raster, x, y);
}
