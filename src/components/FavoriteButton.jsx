import { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { getFavorites, toggleFavorite } from "../utils/favorites";
import "./FavoriteButton.css";

const FavoriteButton = ({ item, className = "" }) => {
  const [isFavorite, setIsFavorite] = useState(() =>
    getFavorites().some((favorite) => favorite.id === item.id)
  );

  useEffect(() => {
    const syncFavorites = () => {
      setIsFavorite(getFavorites().some((favorite) => favorite.id === item.id));
    };

    window.addEventListener("favorites-change", syncFavorites);
    window.addEventListener("storage", syncFavorites);
    return () => {
      window.removeEventListener("favorites-change", syncFavorites);
      window.removeEventListener("storage", syncFavorites);
    };
  }, [item.id]);

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsFavorite(toggleFavorite(item));
  };

  return (
    <button
      className={`favorite-button ${isFavorite ? "is-favorite" : ""} ${className}`.trim()}
      type="button"
      aria-label={isFavorite ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`}
      aria-pressed={isFavorite}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      onClick={handleClick}
    >
      <FiHeart aria-hidden="true" />
    </button>
  );
};

export default FavoriteButton;