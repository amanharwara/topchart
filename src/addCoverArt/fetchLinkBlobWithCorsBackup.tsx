export const fetchLinkBlobWithCorsBackup = async (link: string) => {
  try {
    const response = await fetch(link);
    return await response.blob();
  } catch {
    const corsBackupResponse = await fetch("/api/cors-proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        link,
      }),
    });
    return await corsBackupResponse.blob();
  }
};
