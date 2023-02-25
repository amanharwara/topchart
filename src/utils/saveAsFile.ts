export const saveAsFile = (data: string, filename: string, type?: string) => {
  const blob = new Blob([data], {
    type: type ? type : "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.click();
  URL.revokeObjectURL(url);
};
