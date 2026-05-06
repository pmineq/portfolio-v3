const decodedImages = new Map<string, Promise<void>>();

function decodeImage(src: string) {
  if (decodedImages.has(src)) return decodedImages.get(src)!;

  const promise = new Promise<void>((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.loading = 'eager';
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });

  decodedImages.set(src, promise);
  return promise;
}

export function preloadImages(srcs: string[]) {
  return Promise.all(srcs.map(decodeImage)).then(() => undefined);
}
