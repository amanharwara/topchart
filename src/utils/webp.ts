export const canUseWebP = (() => {
  const canvas = document.createElement("canvas");

  if (!!(canvas.getContext && canvas.getContext("2d"))) {
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  }

  return false;
})();

export const base64ToWebP = (base64: string) => {
  if (!canUseWebP) throw new Error("Browser does not support WebP");

  return new Promise<Blob>((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    const image = new Image();
    image.onload = (event) => {
      if (!(event.target instanceof HTMLImageElement)) {
        reject("Could not convert image to WebP (event.target is not Image)");
        return;
      }
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(event.target, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (data) => {
          if (!data) {
            reject(
              "Could not convert image to WebP (no data in toBlob callback)"
            );
            return;
          }
          resolve(data);
        },
        "image/webp",
        90
      );
    };
    image.onerror = (error) => reject(error);
    image.src = base64;
  });
};
