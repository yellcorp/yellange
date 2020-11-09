/**
 * Functions translate `geom` objects for use with `CanvasRenderingContext2D`
 * methods.
 */

function convertCanvasMatrixFunction(methodName) {
  return (context, mat3) => {
    const m = mat3.array;
    return context[methodName](m[0], m[1], m[3], m[4], m[6], m[7]);
  };
}
export const transform = convertCanvasMatrixFunction('transform');
export const setTransform = convertCanvasMatrixFunction('setTransform');

function convertCanvasRectangleFunction(methodName) {
  return (context, rect) =>
    context[methodName](
      rect.min.x,
      rect.min.y,
      rect.max.x - rect.min.x,
      rect.max.y - rect.min.y
    );
}
export const clearRect = convertCanvasRectangleFunction('clearRect');
export const fillRect = convertCanvasRectangleFunction('fillRect');
export const strokeRect = convertCanvasRectangleFunction('strokeRect');
export const rect = convertCanvasRectangleFunction('rect');
export const getImageData = convertCanvasRectangleFunction('getImageData');

export function putImageData(context, imageData, dx, dy, dirtyRect) {
  if (dirtyRect) {
    context.putImageData(
      imageData,
      dx,
      dy,
      dirtyRect.min.x,
      dirtyRect.min.y,
      dirtyRect.max.x - dirtyRect.min.x,
      dirtyRect.max.y - dirtyRect.min.y
    );
  } else {
    context.putImageData(imageData, dx, dy);
  }
}

export function drawImage(context, source, rect0, rect1) {
  const args = [
    source,
    rect0.min.x,
    rect0.min.y,
    rect0.max.x - rect0.min.x,
    rect0.max.y - rect0.min.y,
  ];

  if (rect1) {
    args.push(
      rect1.min.x,
      rect1.min.y,
      rect1.max.x - rect1.min.x,
      rect1.max.y - rect1.min.y
    );
  }

  context.drawImage(...args);
}
