import React from 'react';
import { useFavourites } from '../../context/FavouritesContext';
import PokemonCard from '../../components/PokemonCard/PokemonCard';

const Favourites = () => {
  const { favourites } = useFavourites();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Favourite Pokémon</h2>
      
      {favourites.length === 0 ? (
        <p>You haven’t added any favourites yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favourites.map((pokemon) => (
            <PokemonCard key={pokemon.id} name={pokemon.name} id={pokemon.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;
