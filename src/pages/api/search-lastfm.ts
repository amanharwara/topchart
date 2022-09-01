import { type NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(request: NextRequest) {
  const { query } = await request.json();
  return fetch(
    `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${query}&limit=25&api_key=${process.env.LASTFM_API_KEY}&format=json`
  );
}
