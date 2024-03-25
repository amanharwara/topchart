import { z } from "zod";
import { env } from "../env/client.mjs";
import { useQuery } from "@tanstack/react-query";

const SpotifyClientId = env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const SpotifyCodeVerifierKey = "spotify-code-verifier";
const SpotifyAccessTokenKey = "spotify-access-token";
const SpotifyAccessTokenExpiresAtKey = "spotify-access-token-expires-at";
const SpotifyRefreshTokenKey = "spotify-refresh-token";
const SpotifyUserKey = "spotify-user";

const GetRedirectUri = () => `${window.location.origin}/?authorizeSpotify=true`;

const SpotifyImageParser = z.object({
  url: z.string(),
});

const SpotifyUserParser = z.object({
  id: z.string(),
  display_name: z.string().nullable(),
  images: z.array(SpotifyImageParser),
});
type SpotifyUser = z.infer<typeof SpotifyUserParser>;

function generateRandomString(length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function base64encode(string: ArrayBuffer) {
  return btoa(
    String.fromCharCode.apply(null, Array.from(new Uint8Array(string)))
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function generateCodeChallenge(codeVerifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);

  return base64encode(digest);
}

export function spotifyLogIn() {
  const codeVerifier = generateRandomString(128);

  generateCodeChallenge(codeVerifier)
    .then((codeChallenge) => {
      const state = generateRandomString(16);

      localStorage.setItem(SpotifyCodeVerifierKey, codeVerifier);

      const args = new URLSearchParams({
        response_type: "code",
        client_id: SpotifyClientId,
        redirect_uri: GetRedirectUri(),
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        scope: "user-top-read",
        state,
      });

      window.location.href = `https://accounts.spotify.com/authorize?${args}`;
    })
    .catch(console.error);
}

export function spotifyLogOut() {
  localStorage.removeItem(SpotifyAccessTokenKey);
  localStorage.removeItem(SpotifyAccessTokenExpiresAtKey);
  localStorage.removeItem(SpotifyRefreshTokenKey);
  localStorage.removeItem(SpotifyUserKey);
  window.location.reload();
}

export async function handleSpotifyAuthorization() {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get("authorizeSpotify") !== "true") {
    return;
  }

  const code = urlParams.get("code");

  if (!code) {
    throw new Error("Missing spotify authorization code");
  }

  fetchAndSetSpotifyAccessToken(code)
    .then(() => {
      fetchSpotifyUser()
        .then(() => {
          window.location.href = window.location.origin;
        })
        .catch(console.error);
    })
    .catch(console.error);
}

async function fetchAndSetSpotifyAccessToken(code: string) {
  const codeVerifier = localStorage.getItem(SpotifyCodeVerifierKey);

  if (!codeVerifier) {
    throw new Error("Missing spotify code verifier");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: GetRedirectUri(),
    client_id: SpotifyClientId,
    code_verifier: codeVerifier,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch spotify access token (HTTP Status: ${response.status})`
    );
  }

  const { access_token, refresh_token, expires_in } = await response.json();

  if (!access_token) {
    throw new Error("Access token not found in spotify response");
  }

  localStorage.setItem(SpotifyAccessTokenKey, access_token);
  localStorage.setItem(SpotifyRefreshTokenKey, refresh_token);

  const expiresAt = Date.now() + expires_in * 1000;
  localStorage.setItem(SpotifyAccessTokenExpiresAtKey, expiresAt.toString());
}

async function refreshSpotifyAccessToken() {
  const refreshToken = localStorage.getItem(SpotifyRefreshTokenKey);

  if (!refreshToken) {
    throw new Error("Missing spotify refresh token");
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: SpotifyClientId,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to refresh spotify access token (HTTP Status: ${response.status})`
    );
  }

  const { access_token, refresh_token, expires_in } = await response.json();

  if (!access_token) {
    throw new Error("Access token not found in spotify response");
  }

  localStorage.setItem(SpotifyAccessTokenKey, access_token);

  const expiresAt = Date.now() + expires_in * 1000;
  localStorage.setItem(SpotifyAccessTokenExpiresAtKey, expiresAt.toString());

  if (refresh_token) {
    localStorage.setItem(SpotifyRefreshTokenKey, refresh_token);
  }
}

async function getLatestSpotifyAccessToken() {
  const accessToken = localStorage.getItem(SpotifyAccessTokenKey);
  const accessTokenExpiresAt = localStorage.getItem(
    SpotifyAccessTokenExpiresAtKey
  );

  if (!accessToken || !accessTokenExpiresAt) {
    return null;
  }

  const expiresAt = parseInt(accessTokenExpiresAt);

  if (expiresAt < Date.now()) {
    await refreshSpotifyAccessToken();
  }

  return localStorage.getItem(SpotifyAccessTokenKey);
}

async function fetchSpotifyUser() {
  const accessToken = await getLatestSpotifyAccessToken();

  if (!accessToken) {
    throw new Error("Missing spotify access token");
  }

  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch spotify user (HTTP Status: ${response.status})`
    );
  }

  const user = await response.json();

  if (!SpotifyUserParser.safeParse(user).success) {
    throw new Error("Failed to parse spotify user");
  }

  localStorage.setItem(SpotifyUserKey, JSON.stringify(user));
}

export function getSpotifyUser(): SpotifyUser | null {
  const user = localStorage.getItem(SpotifyUserKey);

  if (!user) {
    return null;
  }

  return JSON.parse(user) as SpotifyUser;
}

export type SpotifyTopType = "artists" | "tracks";
export type SpotifyTimeRange = "short_term" | "medium_term" | "long_term";

const SpotifyArtistParser = z.object({
  id: z.string(),
  name: z.string(),
  images: z.array(SpotifyImageParser),
  type: z.literal("artist"),
});
export type SpotifyArtist = z.infer<typeof SpotifyArtistParser>;

const SpotifyTrackAlbumParser = z.object({
  id: z.string(),
  name: z.string(),
  images: z.array(SpotifyImageParser),
});

const SpotifyTrackParser = z.object({
  id: z.string(),
  name: z.string(),
  artists: z.array(
    SpotifyArtistParser.omit({
      images: true,
    })
  ),
  album: SpotifyTrackAlbumParser,
  type: z.literal("track"),
});
export type SpotifyTrack = z.infer<typeof SpotifyTrackParser>;

const SpotifyTopItemsListParser = z.object({
  items: z
    .discriminatedUnion("type", [SpotifyArtistParser, SpotifyTrackParser])
    .array(),
});
type SpotifyTopItemsList = z.infer<typeof SpotifyTopItemsListParser>;

export function useSpotifyTopItems(
  type: SpotifyTopType,
  range: SpotifyTimeRange,
  limit = 10
) {
  return useQuery(
    [type, range, limit],
    async () => {
      const accessToken = await getLatestSpotifyAccessToken();

      if (!accessToken) {
        throw new Error("Missing spotify access token");
      }

      const response = await fetch(
        `https://api.spotify.com/v1/me/top/${type}?time_range=${range}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch spotify top items (HTTP Status: ${response.status})`
        );
      }

      const json = await response.json();

      const { items } = SpotifyTopItemsListParser.parse(json);

      return items;
    },
    {
      retry: 0,
    }
  );
}
