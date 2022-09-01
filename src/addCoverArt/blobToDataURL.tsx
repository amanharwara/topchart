export const blobToDataURL = (blob: Blob) => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (!reader.result) {
        throw new Error("Could not parse retrieved data");
      }
      resolve(reader.result.toString());
    };
    reader.readAsDataURL(blob);
  });
};
