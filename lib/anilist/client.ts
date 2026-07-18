export const ANILIST_ENDPOINT = "https://graphql.anilist.co";

interface GraphQLError {
  message: string;
  status?: number;
}

/** Drop undefined/null/empty values so AniList treats the argument as "not provided". */
export function pruneVariables(
  variables: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(variables)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (value === "") continue;
    out[key] = value;
  }
  return out;
}

/**
 * Server-side AniList fetch. POST requests made from Server Components go
 * through the Next.js Data Cache, so every distinct query+variables pair is
 * cached for `revalidate` seconds — this keeps us far below AniList's rate
 * limit even under traffic.
 */
export async function anilistFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidate = 3600,
): Promise<T> {
  const res = await fetch(ANILIST_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables: pruneVariables(variables) }),
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`AniList request failed with status ${res.status}`);
  }
  const json = (await res.json()) as { data?: T; errors?: GraphQLError[] };
  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }
  if (!json.data) {
    throw new Error("AniList returned no data");
  }
  return json.data;
}

/** Same fetch but returns null instead of throwing — pages render fallbacks. */
export async function anilistFetchSafe<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidate = 3600,
): Promise<T | null> {
  try {
    return await anilistFetch<T>(query, variables, revalidate);
  } catch (error) {
    console.error("[anilist]", error);
    return null;
  }
}
