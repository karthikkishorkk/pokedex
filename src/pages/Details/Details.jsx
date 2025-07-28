import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPokemonDetails, getEvolutionChain } from "../../services/pokemonService";
import { useFavourites } from '../../context/FavouritesContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HeightIcon from '@mui/icons-material/Height';
import FitnessIcon from '@mui/icons-material/FitnessCenter';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import './Details.css';

const Details = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { favourites, toggleFavourite } = useFavourites();
  const [pokemon, setPokemon] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("stats");
  const [showAllMoves, setShowAllMoves] = useState(false);
  const isFavourite = pokemon && favourites.some((fav) => fav.id === pokemon.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getPokemonDetails(name);
        setPokemon(data);

        // Fetch evolution chain
        try {
          const evoData = await getEvolutionChain(data.species.url);
          const evoChain = [];
          let evoStep = evoData.chain;

          while (evoStep) {
            evoChain.push({
              name: evoStep.species.name,
              id: evoStep.species.url.split('/').slice(-2, -1)[0]
            });
            evoStep = evoStep.evolves_to.length ? evoStep.evolves_to[0] : null;
          }

          setEvolution(evoChain);
        } catch (evoError) {
          console.warn("Failed to load evolution chain:", evoError);
          setEvolution([]);
        }
      } catch (error) {
        console.error("Failed to load Pokémon details:", error);
        setError("Failed to load Pokémon details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      fetchData();
    }
  }, [name]);

  const handleFavouriteClick = useCallback(() => {
    if (pokemon) {
      toggleFavourite({ name: pokemon.name, id: pokemon.id, pokemon });
    }
  }, [pokemon, toggleFavourite]);

  // Get Pokemon type colors
  const getTypeColor = (typeName) => {
    const typeColors = {
      normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
      grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
      ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
      rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
      steel: '#B8B8D0', fairy: '#EE99AC',
    };
    return typeColors[typeName] || '#68A090';
  };

  const getCardGradient = () => {
    if (!pokemon?.types?.length) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    const primaryType = pokemon.types[0].type.name;
    const primaryColor = getTypeColor(primaryType);
    const secondaryColor = pokemon.types[1] 
      ? getTypeColor(pokemon.types[1].type.name)
      : primaryColor;
    
    return `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
  };

  const getStatIcon = (statName) => {
    const icons = {
      'hp': <FavoriteIcon className="stat-icon" />,
      'attack': <SportsKabaddiIcon className="stat-icon" />,
      'defense': <SecurityIcon className="stat-icon" />,
      'special-attack': <FlashOnIcon className="stat-icon" />,
      'special-defense': <SecurityIcon className="stat-icon" />,
      'speed': <SpeedIcon className="stat-icon" />
    };
    return icons[statName] || <TrendingUpIcon className="stat-icon" />;
  };

  const getStatColor = (value) => {
    if (value >= 120) return '#10b981'; // Green
    if (value >= 90) return '#3b82f6';  // Blue
    if (value >= 60) return '#f59e0b';  // Orange
    return '#ef4444'; // Red
  };

  const formatStatName = (name) => {
    return name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) {
    return (
      <div className="details-container">
        <div className="loading-container">
          <div className="pokeball-spinner">
            <div className="pokeball-top"></div>
            <div className="pokeball-center"></div>
            <div className="pokeball-bottom"></div>
          </div>
          <p>Loading Pokémon details...</p>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="details-container">
        <div className="error-container">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <h2>Oops! Something went wrong</h2>
            <p>{error || "Pokémon not found"}</p>
            <div className="error-actions">
              <button onClick={() => navigate(-1)} className="back-btn">
                <ArrowBackIcon />
                Go Back
              </button>
              <button onClick={() => window.location.reload()} className="retry-btn">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="details-container">
      {/* Header with background */}
      <div className="details-header" style={{ background: getCardGradient() }}>
        <div className="header-content">
          <div className="header-navigation">
            <button onClick={() => navigate(-1)} className="back-button">
              <ArrowBackIcon />
              <span>Back</span>
            </button>
            <div className="header-actions">              
              <button 
                onClick={handleFavouriteClick}
                className={`action-button favourite-btn ${isFavourite ? 'favourite-active' : ''}`}
              >
                {isFavourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </button>
            </div>
          </div>

          <div className="pokemon-hero">
            <div className="pokemon-info-header">
              <div className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</div>
              <h1 className="pokemon-name">{capitalize(pokemon.name)}</h1>
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
            </div>

            <div className="pokemon-image-container">
              {!imageLoaded && (
                <div className="image-skeleton">
                  <div className="skeleton-shimmer"></div>
                </div>
              )}
              <img
                src={pokemon.sprites.other["official-artwork"].front_default}
                alt={pokemon.name}
                className={`main-pokemon-image ${imageLoaded ? 'loaded' : ''}`}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="details-main">
        {/* Quick Stats */}
        <div className="quick-stats-section">
          <div className="stat-card">
            <HeightIcon className="stat-card-icon" />
            <div className="stat-card-content">
              <span className="stat-card-label">Height</span>
              <span className="stat-card-value">{(pokemon.height / 10).toFixed(1)}m</span>
            </div>
          </div>
          <div className="stat-card">
            <FitnessIcon className="stat-card-icon" />
            <div className="stat-card-content">
              <span className="stat-card-label">Weight</span>
              <span className="stat-card-value">{(pokemon.weight / 10).toFixed(1)}kg</span>
            </div>
          </div>
          <div className="stat-card">
            <InfoIcon className="stat-card-icon" />
            <div className="stat-card-content">
              <span className="stat-card-label">Base Experience</span>
              <span className="stat-card-value">{pokemon.base_experience || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <TrendingUpIcon className="tab-icon" />
            Stats
          </button>
          <button 
            className={`tab-button ${activeTab === 'moves' ? 'active' : ''}`}
            onClick={() => setActiveTab('moves')}
          >
            <SportsKabaddiIcon className="tab-icon" />
            Moves
          </button>
          {evolution.length > 1 && (
            <button 
              className={`tab-button ${activeTab === 'evolution' ? 'active' : ''}`}
              onClick={() => setActiveTab('evolution')}
            >
              <TrendingUpIcon className="tab-icon" />
              Evolution
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'stats' && (
            <div className="stats-section">
              <h2 className="section-title">Base Stats</h2>
              <div className="stats-container">
                {pokemon.stats.map((stat, index) => (
                  <div className="stat-item" key={index}>
                    <div className="stat-header">
                      {getStatIcon(stat.stat.name)}
                      <span className="stat-name">{formatStatName(stat.stat.name)}</span>
                      <span className="stat-value" style={{ color: getStatColor(stat.base_stat) }}>
                        {stat.base_stat}
                      </span>
                    </div>
                    <div className="stat-bar-container">
                      <div 
                        className="stat-bar-fill"
                        style={{ 
                          width: `${Math.min(100, (stat.base_stat / 200) * 100)}%`,
                          backgroundColor: getStatColor(stat.base_stat)
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Total Stats */}
              <div className="total-stats">
                <h3>Total Base Stats: {pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)}</h3>
              </div>

              {/* Abilities */}
              <div className="abilities-section">
                <h3>Abilities</h3>
                <div className="abilities-list">
                  {pokemon.abilities.map((ability, index) => (
                    <div key={index} className="ability-item">
                      <span className="ability-name">{capitalize(ability.ability.name.replace('-', ' '))}</span>
                      {ability.is_hidden && <span className="hidden-ability">Hidden</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'moves' && (
            <div className="moves-section">
              <h2 className="section-title">Moves</h2>
              <div className="moves-grid">
                {(showAllMoves ? pokemon.moves : pokemon.moves.slice(0, 20)).map((move, index) => (
                  <div className="move-card" key={index}>
                    <span className="move-name">{capitalize(move.move.name.replace('-', ' '))}</span>
                  </div>
                ))}
              </div>
              
              {pokemon.moves.length > 20 && (
                <div className="moves-controls">
                  <p className="moves-note">
                    Showing {showAllMoves ? pokemon.moves.length : 20} of {pokemon.moves.length} moves
                  </p>
                  <button 
                    className="show-more-btn"
                    onClick={() => setShowAllMoves(!showAllMoves)}
                  >
                    {showAllMoves ? (
                      <>
                        <span>Show Less</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m18 15-6-6-6 6"/>
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>Show All {pokemon.moves.length} Moves</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}


          {activeTab === 'evolution' && evolution.length > 1 && (
            <div className="evolution-section">
              <h2 className="section-title">Evolution Chain</h2>
              <div className="evolution-chain">
                {evolution.map((evo, index) => (
                  <div key={index} className="evolution-step">
                    {index > 0 && <div className="evolution-arrow">→</div>}
                    <Link to={`/details/${evo.name}`} className="evolution-card">
                      <div className="evolution-image-container">
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`}
                          alt={evo.name}
                          className="evolution-image"
                          onError={(e) => {
                            e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`;
                          }}
                        />
                      </div>
                      <span className="evolution-name">{capitalize(evo.name)}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details;