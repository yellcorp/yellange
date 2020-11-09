import { channelToIndex } from '../lib/raster/channelnotation';
import { getLumaWeights } from './colorspace';
import { reduceSum } from '../math';

export function create() {
  const histo = new Array(256);
  for (let i = 0; i < 256; i++) {
    histo[i] = 0;
  }
  return histo;
}

export function findExtremaPercentile(histogram, clipLow, clipHigh) {
  const maxBin = histogram.length - 1;
  const sum = reduceSum(histogram);
  const lowThreshold = sum * clipLow;
  const highThreshold = sum * clipHigh;

  let acc = 0;
  let lowBin = -1;
  while (++lowBin < maxBin && acc <= lowThreshold) {
    acc += histogram[lowBin];
  }

  acc = 0;
  let highBin = maxBin + 1;
  while (--highBin > lowBin && acc <= highThreshold) {
    acc += histogram[highBin];
  }

  return [lowBin, highBin];
}

export function getChannelHistogram(pixelData, channel, pixelStep) {
  let stride = pixelStep << 2;
  if (stride <= 0) {
    stride = 4;
  }

  const histo = create();
  const length = pixelData.length;
  const channelIndex = channelToIndex(channel);
  for (let i = 0; i < length; i += stride) {
    histo[pixelData[i + channelIndex]] += 1;
  }

  return histo;
}

export function getChannelHistogramWithAlpha(pixelData, channel, pixelStep) {
  let stride = pixelStep << 2;
  if (stride <= 0) {
    stride = 4;
  }

  const histo = create();
  const length = pixelData.length;
  const channelIndex = channelToIndex(channel);
  for (let i = 0; i < length; i += stride) {
    histo[pixelData[i + channelIndex]] += pixelData[i + 3];
  }

  return histo;
}

export function getLumaHistogramWithAlpha(
  pixelData,
  pixelStep = 1,
  lumaCoefficients = null
) {
  let stride = pixelStep << 2;
  if (stride <= 0) {
    stride = 4;
  }

  if (!lumaCoefficients) {
    lumaCoefficients = getLumaWeights('srgb');
  }
  const [rf, gf, bf] = lumaCoefficients;

  const histo = create();
  const length = pixelData.length;
  for (let i = 0; i < length; i += stride) {
    const luma =
      pixelData[i] * rf + pixelData[i + 1] * gf + pixelData[i + 2] * bf;
    histo[luma | 0] += pixelData[i + 3];
  }

  return histo;
}
