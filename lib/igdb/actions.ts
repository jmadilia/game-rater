"use server";

let accessToken: string | null = null;
let tokenExpiration = 0;
let clientId = process.env.TWITCH_CLIENT_ID;
let clientSecret = process.env.TWITCH_CLIENT_SECRET;

export async function getTwitchAccessTokenAction() {
  if (accessToken && Date.now() < tokenExpiration) {
    return accessToken;
  }

  const response = await fetch(
    "https://id.twitch.tv/oauth2/token?client_id=" +
      clientId +
      "&client_secret=" +
      clientSecret +
      "&grant_type=client_credentials",
    {
      method: "POST",
    }
  );

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiration = Date.now() + data.expires_in * 1000;
  return accessToken;
}

export async function searchGamesAction(query: string) {
  if (!query) {
    return [];
  }

  try {
    const token = await getTwitchAccessTokenAction();

    const igdbResponse = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Client-ID": process.env.TWITCH_CLIENT_ID!,
      },
      body: `search "${query}"; fields name,cover.url; limit 10;`,
    });

    if (!igdbResponse.ok) {
      const errorData = await igdbResponse.json();
      console.error("IGDB API error:", errorData);
      throw new Error(`IGDB API error: ${igdbResponse.statusText}`);
    }

    const games = await igdbResponse.json();

    if (Array.isArray(games)) {
      return games;
    } else {
      console.error("Unexpected response format from IGDB:", games);
      return [];
    }
  } catch (error) {
    console.error("Error fetching games:", error);
    throw error;
  }
}

export async function getPopularGamesAction() {
  try {
    const token = await getTwitchAccessTokenAction();

    const igdbResponsePopularityPrimitives = await fetch(
      "https://api.igdb.com/v4/popularity_primitives",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Client-ID": process.env.TWITCH_CLIENT_ID!,
        },
        body: `fields game_id; sort value desc; where popularity_type = 1;`,
      }
    );

    if (!igdbResponsePopularityPrimitives.ok) {
      const errorData = await igdbResponsePopularityPrimitives.json();
      console.error("IGDB API error:", errorData);
      throw new Error(
        `IGDB API Popularity Primitives error: ${igdbResponsePopularityPrimitives.statusText}`
      );
    }

    const popularGameIds = await igdbResponsePopularityPrimitives.json();
    const gameIdsString = popularGameIds
      .map((item: { game_id: number }) => item.game_id)
      .join(",");

    const igdbResponsePopularGameInfo = await fetch(
      "https://api.igdb.com/v4/games",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Client-ID": process.env.TWITCH_CLIENT_ID!,
        },
        body: `fields name,cover.url; where id = (${gameIdsString});`,
      }
    );

    if (!igdbResponsePopularGameInfo.ok) {
      const errorData = await igdbResponsePopularGameInfo.json();
      console.error("IGDB API error:", errorData);
      throw new Error(
        `IGDB API error: ${igdbResponsePopularGameInfo.statusText}`
      );
    }

    const games = await igdbResponsePopularGameInfo.json();

    if (Array.isArray(games)) {
      return games;
    } else {
      console.error("Unexpected response format from IGDB:", games);
      return [];
    }
  } catch (error) {
    console.error("Error fetching popular games:", error);
    throw error;
  }
}
