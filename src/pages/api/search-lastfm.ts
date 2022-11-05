import type { NextApiRequest, NextApiResponse } from "next";

const TwoDaysInSeconds = 60 * 60 * 24 * 2;

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  response.setHeader("Cache-Control", `s-maxage=${TwoDaysInSeconds}`);

  const { query } = request.body;

  if (!query) {
    response.status(400).json({ error: "Missing query" });
  }

  const lastFmResponse = await (
    await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${query}&limit=25&api_key=${process.env.LASTFM_API_KEY}&format=json`
    )
  ).json();

  return response.status(200).json(lastFmResponse);
}
