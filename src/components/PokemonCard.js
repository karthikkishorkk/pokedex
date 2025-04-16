import { Link } from "react-router-dom";
import './PokemonCard.css';

const PokemonCard = ({ name, id }) => {
  return (
    <div className="pokemon-card">
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
