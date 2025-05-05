import { Link } from "react-router-dom";
import './PokemonCard.css';
import { useFavourites } from '../context/FavouritesContext';

const PokemonCard = ({ name, id }) => {
  const { favourites, toggleFavourite } = useFavourites();

  const isFavourite = favourites.some((fav) => fav.id === id);

  const handleFavouriteClick = () => {
    toggleFavourite({ name, id });
  };

  return (
    <div className="pokemon-card relative">
      <button 
        className="absolute top-2 right-2 text-xl bg-transparent border-none cursor-pointer"
        onClick={handleFavouriteClick}
        title={isFavourite ? "Remove from favourites" : "Add to favourites"}
      >
        {isFavourite ? '❤️' : '🤍'}
      </button>
      
      <img 
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`} 
        alt={name} 
        className="h-32 w-32 mx-auto"
      />
      <h3 className="capitalize">{name}</h3>
      <Link to={`/details/${name}`} className="text-blue-500">View Details</Link>
    </div>
  );
};

export default PokemonCard;
