import watchlistData from "@/data/idx-watchlist.json";

export function getDefaultWatchlist(): string[] {
  return watchlistData.watchlist;
}
