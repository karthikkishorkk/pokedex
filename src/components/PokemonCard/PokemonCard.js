import { Link } from "react-router-dom";
import { useState, useCallback, memo } from "react";
import { useFavourites } from '../../context/FavouritesContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HeightIcon from '@mui/icons-material/Height';
import FitnessIcon from '@mui/icons-material/FitnessCenter';
import './PokemonCard.css';

const PokemonCard = memo(({ name, id, pokemon }) => {
  const { favourites, toggleFavourite } = useFavourites();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isFavourite = favourites.some((fav) => fav.id === id);

  // Handle favourite toggle with animation feedback
  const handleFavouriteClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavourite({ name, id, pokemon });
    
    // Add a little haptic feedback simulation
    const button = e.currentTarget;
    button.style.transform = 'scale(0.8)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 150);
  }, [name, id, pokemon, toggleFavourite]);

  // Handle card click for navigation
  const handleCardClick = useCallback((e) => {
    // Don't navigate if clicking on the favourite button
    if (e.target.closest('.favourite-btn')) {
      return;
    }
    // Navigation will be handled by the Link wrapper
  }, []);

  // Handle image loading states
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  // Get Pokemon type colors
  const getTypeColor = (typeName) => {
    const typeColors = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
    };
    return typeColors[typeName] || '#68A090';
  };

  // Get background gradient based on primary type
  const getCardGradient = () => {
    if (!pokemon?.types?.length) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    const primaryType = pokemon.types[0].type.name;
    const primaryColor = getTypeColor(primaryType);
    const secondaryColor = pokemon.types[1] 
      ? getTypeColor(pokemon.types[1].type.name)
      : primaryColor;
    
    return `linear-gradient(135deg, ${primaryColor}90 0%, ${secondaryColor}90 100%)`;
  };

  // Format stats for display
  const getTotalStats = () => {
    if (!pokemon?.stats) return 0;
    return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
  };

  // Get highest stat for display
  const getHighestStat = () => {
    if (!pokemon?.stats) return null;
    const highest = pokemon.stats.reduce((max, stat) => 
      stat.base_stat > max.base_stat ? stat : max
    );
    return {
      name: highest.stat.name.replace('-', ' ').toUpperCase(),
      value: highest.base_stat
    };
  };

  // Fallback image URLs
  const getImageUrl = () => {
    if (imageError) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  // Format Pokemon ID with leading zeros
  const formatId = (id) => {
    return `#${String(id).padStart(3, '0')}`;
  };

  // Capitalize first letter
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Link 
      to={`/details/${name}`} 
      className="pokemon-card-link"
      aria-label={`View details for ${name}`}
    >
      <article className="pokemon-card" onClick={handleCardClick}>
        {/* Card Background */}
        <div 
          className="card-background"
          style={{ background: getCardGradient() }}
        />
        
        {/* Favourite Button */}
        <button 
          className={`favourite-btn ${isFavourite ? 'favourite-active' : ''}`}
          onClick={handleFavouriteClick}
          title={isFavourite ? "Remove from favourites" : "Add to favourites"}
          aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
        >
          {isFavourite ? (
            <FavoriteIcon className="heart-icon filled" />
          ) : (
            <FavoriteBorderIcon className="heart-icon" />
          )}
        </button>

        {/* Pokemon ID Badge */}
        <div className="pokemon-id-badge">
          {formatId(id)}
        </div>

        {/* Pokemon Image */}
        <div className="pokemon-image-container">
          {!imageLoaded && (
            <div className="image-skeleton">
              <div className="skeleton-shimmer"></div>
            </div>
          )}
          <img 
            src={getImageUrl()}
            alt={`${name} artwork`} 
            className={`pokemon-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
          {imageError && (
            <div className="image-error">
              <span>🎭</span>
            </div>
          )}
        </div>

        {/* Pokemon Info */}
        <div className="pokemon-info">
          <h3 className="pokemon-name">{capitalize(name)}</h3>
          
          {/* Type Badges */}
          {pokemon?.types && (
            <div className="type-badges">
              {pokemon.types.map((type) => (
                <span 
                  key={type.type.name}
                  className="type-badge"
                  style={{ backgroundColor: getTypeColor(type.type.name) }}
                >
                  {capitalize(type.type.name)}
                </span>
              ))}
            </div>
          )}

          {/* Quick Stats */}
          {pokemon && (
            <div className="quick-stats">
              <div className="stat-item">
                <HeightIcon className="stat-icon" />
                <span className="stat-label">Height</span>
                <span className="stat-value">{(pokemon.height / 10).toFixed(1)}m</span>
              </div>
              <div className="stat-item">
                <FitnessIcon className="stat-icon" />
                <span className="stat-label">Weight</span>
                <span className="stat-value">{(pokemon.weight / 10).toFixed(1)}kg</span>
              </div>
            </div>
          )}

          {/* Stats Summary */}
          {pokemon?.stats && (
            <div className="stats-summary">
              <div className="total-stats">
                <span className="stats-label">Total Stats</span>
                <span className="stats-value">{getTotalStats()}</span>
              </div>
              {getHighestStat() && (
                <div className="highest-stat">
                  <span className="stats-label">Best: {getHighestStat().name}</span>
                  <span className="stats-value">{getHighestStat().value}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="view-details-btn">
            <VisibilityIcon className="btn-icon" />
            <span>View Details</span>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="hover-overlay">
          <div className="hover-content">
            <VisibilityIcon className="hover-icon" />
            <span>Click to explore</span>
          </div>
        </div>

        {/* Pokeball Pattern Background */}
        <div className="pokeball-pattern">
          <div className="pokeball-top"></div>
          <div className="pokeball-center"></div>
          <div className="pokeball-bottom"></div>
        </div>
      </article>
    </Link>
  );
});

PokemonCard.displayName = 'PokemonCard';

export default PokemonCard;