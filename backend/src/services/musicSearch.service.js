// Free music catalogs we can search without a paid plan.
// iTunes needs no key and returns 30s previews for most songs worldwide.
// Jamendo returns full-length tracks when JAMENDO_CLIENT_ID is set (free key).

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80";

const searchItunes = async (query, limit) => {
  const params = new URLSearchParams({
    term: query,
    media: "music",
    entity: "song",
    limit: String(limit),
  });
  const res = await fetch(`https://itunes.apple.com/search?${params}`);
  if (!res.ok) throw new Error(`iTunes responded ${res.status}`);
  const { results = [] } = await res.json();

  return results
    .filter((t) => t.previewUrl)
    .map((t) => ({
      id: `itunes-${t.trackId}`,
      title: t.trackName,
      artistName: t.artistName || "Unknown Artist",
      album: t.collectionName || "Single",
      genre: "30s preview",
      // iTunes returns 100px artwork; the same URL works at a larger size
      coverUrl: t.artworkUrl100?.replace("100x100bb", "600x600bb") || DEFAULT_COVER,
      duration: Math.round((t.trackTimeMillis || 30000) / 1000),
      uri: t.previewUrl,
      source: "itunes",
      isFullTrack: false,
    }));
};

const searchJamendo = async (query, limit, clientId) => {
  const params = new URLSearchParams({
    client_id: clientId,
    format: "json",
    limit: String(limit),
    namesearch: query,
    audioformat: "mp32",
  });
  const res = await fetch(`https://api.jamendo.com/v3.0/tracks/?${params}`);
  if (!res.ok) throw new Error(`Jamendo responded ${res.status}`);
  const { results = [] } = await res.json();

  return results
    .filter((t) => t.audio)
    .map((t) => ({
      id: `jamendo-${t.id}`,
      title: t.name,
      artistName: t.artist_name || "Unknown Artist",
      album: t.album_name || "Single",
      genre: "Full song",
      coverUrl: t.album_image || t.image || DEFAULT_COVER,
      duration: t.duration || 180,
      uri: t.audio,
      source: "jamendo",
      isFullTrack: true,
    }));
};

// Full-length matches first, then 30s previews from iTunes.
const searchMusic = async (query, limit = 20) => {
  const clientId = process.env.JAMENDO_CLIENT_ID;

  const [jamendo, itunes] = await Promise.allSettled([
    clientId ? searchJamendo(query, limit, clientId) : Promise.resolve([]),
    searchItunes(query, limit),
  ]);

  // one provider being down shouldn't blank the whole search
  if (jamendo.status === "rejected") console.warn("Jamendo search failed:", jamendo.reason.message);
  if (itunes.status === "rejected") console.warn("iTunes search failed:", itunes.reason.message);

  return [
    ...(jamendo.status === "fulfilled" ? jamendo.value : []),
    ...(itunes.status === "fulfilled" ? itunes.value : []),
  ];
};

module.exports = { searchMusic };
