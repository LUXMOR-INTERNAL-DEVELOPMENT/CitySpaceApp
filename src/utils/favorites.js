const FAVORITES_KEY = "cityspace_favorites";

export function getFavorites() {
  try {
    const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(favorites) ? favorites : [];
  } catch {
    return [];
  }
}

export function setFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  window.dispatchEvent(new Event("favorites-change"));
}

export function toggleFavorite(item) {
  const favorites = getFavorites();
  const exists = favorites.some((favorite) => favorite.id === item.id);
  setFavorites(
    exists
      ? favorites.filter((favorite) => favorite.id !== item.id)
      : [item, ...favorites]
  );
  return !exists;
}