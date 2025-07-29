import React from 'react';
import { useFavourites } from '../../context/FavouritesContext';
import PokemonCard from '../../components/PokemonCard/PokemonCard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ClearIcon from '@mui/icons-material/Clear';
import './Favourites.css';

const Favourites = () => {
  const { favourites, removeFavourite } = useFavourites();

  const handleRemoveAll = () => {
    if (window.confirm('Are you sure you want to remove all favourites? This action cannot be undone.')) {
      favourites.forEach(pokemon => removeFavourite(pokemon.id));
    }
  };

  return (
    <div className="favourites-container">
      {/* Header */}
      <div className="favourites-header">
        <div className="header-content">
          <div className="header-title">
            <FavoriteIcon className="header-icon" />
            <div>
              <h1>Your Favourite Pokémon</h1>
              <p className="header-subtitle">
                {favourites.length === 0 
                  ? "Start building your collection!" 
                  : `${favourites.length} Pokémon in your collection`
                }
              </p>
            </div>
          </div>
          
          {favourites.length > 0 && (
            <button 
              className="remove-all-btn"
              onClick={handleRemoveAll}
            >
              <ClearIcon />
              Clear All
            </button>
          )}
        </div>
      </div>

      {favourites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-content">
            <div className="empty-icon">
              <FavoriteIcon />
            </div>
            <h2>No Favourite Pokémon Yet</h2>
            <p>Start exploring and add your favourite Pokémon to see them here!</p>
            <div className="empty-tips">
              <div className="tip">
                <span className="tip-number">1</span>
                <span>Browse the Pokédex</span>
              </div>
              <div className="tip">
                <span className="tip-number">2</span>
                <span>Click the heart icon on any Pokémon</span>
              </div>
              <div className="tip">
                <span className="tip-number">3</span>
                <span>Watch them appear here!</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="favourites-grid">
          {favourites.map((pokemon) => (
            <div key={pokemon.id} className="favourite-card-wrapper">
              <PokemonCard 
                name={pokemon.name} 
                id={pokemon.id} 
              />
              <button 
                className="remove-favourite-btn"
                onClick={() => removeFavourite(pokemon.id)}
                title="Remove from favourites"
              >
                <ClearIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;