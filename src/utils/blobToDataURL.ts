export const blobToDataURL = (blob: Blob) => {
  return new Promise<FileReader["result"]>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};
