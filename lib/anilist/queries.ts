/** Shared field set for cards, rails and grids. */
export const LIST_MEDIA_FIELDS = `
  id
  title { romaji english native }
  coverImage { extraLarge large color }
  bannerImage
  format
  status
  season
  seasonYear
  episodes
  duration
  averageScore
  popularity
  favourites
  genres
  description
  studios(isMain: true) { nodes { id name } }
  nextAiringEpisode { airingAt timeUntilAiring episode }
  isAdult
`;

/**
 * The whole landing page in one request — four rails batched via aliases to
 * stay well under AniList's rate limit.
 */
export const HOME_QUERY = `
  query Home($season: MediaSeason, $seasonYear: Int, $nextSeason: MediaSeason, $nextSeasonYear: Int) {
    trending: Page(page: 1, perPage: 14) {
      media(sort: TRENDING_DESC, type: ANIME, isAdult: false) { ${LIST_MEDIA_FIELDS} }
    }
    season: Page(page: 1, perPage: 14) {
      media(season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC, type: ANIME, isAdult: false) { ${LIST_MEDIA_FIELDS} }
    }
    top: Page(page: 1, perPage: 14) {
      media(sort: SCORE_DESC, type: ANIME, isAdult: false) { ${LIST_MEDIA_FIELDS} }
    }
    upcoming: Page(page: 1, perPage: 14) {
      media(season: $nextSeason, seasonYear: $nextSeasonYear, sort: POPULARITY_DESC, type: ANIME, isAdult: false) { ${LIST_MEDIA_FIELDS} }
    }
  }
`;

export const BROWSE_QUERY = `
  query Browse(
    $page: Int = 1
    $perPage: Int = 24
    $search: String
    $genres: [String]
    $tags: [String]
    $season: MediaSeason
    $seasonYear: Int
    $formats: [MediaFormat]
    $status: MediaStatus
    $minScore: Int
    $sort: [MediaSort] = [POPULARITY_DESC]
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { total currentPage lastPage hasNextPage }
      media(
        type: ANIME
        isAdult: false
        search: $search
        genre_in: $genres
        tag_in: $tags
        season: $season
        seasonYear: $seasonYear
        format_in: $formats
        status: $status
        averageScore_greater: $minScore
        sort: $sort
      ) { ${LIST_MEDIA_FIELDS} }
    }
  }
`;

export const DETAIL_QUERY = `
  query Detail($id: Int!) {
    Media(id: $id, type: ANIME) {
      ${LIST_MEDIA_FIELDS}
      startDate { year month day }
      trailer { id site thumbnail }
      tags { id name rank isMediaSpoiler isGeneralSpoiler }
      characters(sort: [ROLE, RELEVANCE, ID], perPage: 12) {
        edges {
          id
          role
          node { id name { full } image { large } }
          voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) {
            id
            name { full }
            image { large }
          }
        }
      }
      relations {
        edges {
          id
          relationType(version: 2)
          node {
            id
            type
            format
            title { romaji english native }
            coverImage { extraLarge large color }
            averageScore
            seasonYear
          }
        }
      }
      recommendations(perPage: 12, sort: [RATING_DESC]) {
        nodes {
          rating
          mediaRecommendation { ${LIST_MEDIA_FIELDS} }
        }
      }
    }
  }
`;

export const SEARCH_QUERY = `
  query Search($search: String!, $perPage: Int = 8) {
    Page(page: 1, perPage: $perPage) {
      media(search: $search, type: ANIME, isAdult: false, sort: [SEARCH_MATCH, POPULARITY_DESC]) {
        id
        title { romaji english native }
        coverImage { large color }
        format
        seasonYear
        episodes
        averageScore
        genres
      }
    }
  }
`;

/** Live airing data for the vault's countdown widget — fetched client-side. */
export const AIRING_QUERY = `
  query Airing($ids: [Int]) {
    Page(page: 1, perPage: 25) {
      media(id_in: $ids, type: ANIME) {
        id
        title { romaji english native }
        coverImage { large color }
        nextAiringEpisode { airingAt timeUntilAiring episode }
      }
    }
  }
`;
