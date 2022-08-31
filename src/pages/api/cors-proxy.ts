import { type NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(request: NextRequest) {
  const { link } = await request.json();
  return fetch(link);
}
