function downloadURL(url: string, filename: string) {
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.click();
  URL.revokeObjectURL(url);
}

export function saveBlobAsFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  downloadURL(url, filename);
}

export function saveDataAsFile(data: string, filename: string, type?: string) {
  const blob = new Blob([data], {
    type: type ? type : "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  downloadURL(url, filename);
}
