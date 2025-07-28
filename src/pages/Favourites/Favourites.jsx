import React, { useState, useMemo } from 'react';
import { useFavourites } from '../../context/FavouritesContext';
import PokemonCard from '../../components/PokemonCard/PokemonCard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import './Favourites.css';

const Favourites = () => {
  const { favourites, removeFavourite } = useFavourites();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Get unique types from favourites
  const uniqueTypes = useMemo(() => {
    const types = new Set();
    favourites.forEach(pokemon => {
      if (pokemon.pokemon?.types) {
        pokemon.pokemon.types.forEach(type => types.add(type.type.name));
      }
    });
    return Array.from(types).sort();
  }, [favourites]);

  // Filter and sort favourites
  const filteredAndSortedFavourites = useMemo(() => {
    let filtered = favourites.filter(pokemon => {
      // Search filter
      const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Type filter
      const matchesType = filterType === 'all' || 
        (pokemon.pokemon?.types?.some(type => type.type.name === filterType));
      
      return matchesSearch && matchesType;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'id':
          return a.id - b.id;
        case 'type':
          const aType = a.pokemon?.types?.[0]?.type?.name || '';
          const bType = b.pokemon?.types?.[0]?.type?.name || '';
          return aType.localeCompare(bType);
        default:
          return 0;
      }
    });

    return filtered;
  }, [favourites, searchTerm, sortBy, filterType]);

  const handleRemoveAll = () => {
    if (window.confirm('Are you sure you want to remove all favourites? This action cannot be undone.')) {
      favourites.forEach(pokemon => removeFavourite(pokemon.id));
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSortBy('name');
    setFilterType('all');
  };

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
        <>
          {/* Controls */}
          <div className="favourites-controls">
            <div className="search-bar">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search your favourites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  <ClearIcon />
                </button>
              )}
            </div>

            <div className="filter-controls">
              <div className="sort-control">
                <SortIcon className="control-icon" />
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="control-select"
                >
                  <option value="name">Sort by Name</option>
                  <option value="id">Sort by Number</option>
                  <option value="type">Sort by Type</option>
                </select>
              </div>

              <div className="filter-control">
                <FilterListIcon className="control-icon" />
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className="control-select"
                >
                  <option value="all">All Types</option>
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {(searchTerm || sortBy !== 'name' || filterType !== 'all') && (
                <button 
                  className="clear-filters-btn"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="favourites-stats">
            <div className="stat-item">
              <span className="stat-value">{filteredAndSortedFavourites.length}</span>
              <span className="stat-label">
                {filteredAndSortedFavourites.length === 1 ? 'Pokémon' : 'Pokémon'} Shown
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{uniqueTypes.length}</span>
              <span className="stat-label">
                {uniqueTypes.length === 1 ? 'Type' : 'Types'} Collected
              </span>
            </div>
            {uniqueTypes.length > 0 && (
              <div className="type-preview">
                {uniqueTypes.slice(0, 5).map(type => (
                  <span 
                    key={type}
                    className="type-dot"
                    style={{ backgroundColor: getTypeColor(type) }}
                    title={type.charAt(0).toUpperCase() + type.slice(1)}
                  />
                ))}
                {uniqueTypes.length > 5 && (
                  <span className="type-more">+{uniqueTypes.length - 5}</span>
                )}
              </div>
            )}
          </div>

          {/* Results */}
          {filteredAndSortedFavourites.length === 0 ? (
            <div className="no-results">
              <SearchIcon className="no-results-icon" />
              <h3>No Pokémon Found</h3>
              <p>Try adjusting your search or filters</p>
              <button 
                className="clear-filters-btn"
                onClick={handleClearFilters}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="favourites-grid">
              {filteredAndSortedFavourites.map((pokemon) => (
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
        </>
      )}
    </div>
  );
};

export default Favourites;