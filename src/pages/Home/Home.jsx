import { useCallback, useEffect, useState, useMemo } from "react";
import { getPokemonList, searchPokemonByName } from "../../services/pokemonService";
import PokemonCard from "../../components/PokemonCard/PokemonCard";
import TypeFilter from "../../components/TypeFilter/TypeFilter";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import ClearIcon from '@mui/icons-material/Clear';
import './Home.css';

const TOTAL_POKEMON = 1298;
const ITEMS_PER_PAGE = 20;
const TOTAL_PAGES = Math.ceil(TOTAL_POKEMON / ITEMS_PER_PAGE);

// Custom hook for debounced search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Home = () => {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Debounce search input for better performance
  const debouncedSearch = useDebounce(search, 300);

  // Enhanced error handling
  const setErrorWithTimeout = useCallback((message) => {
    setError(message);
    setTimeout(() => setError(""), 5000); // Clear error after 5 seconds
  }, []);

  // Improved fetchDefaultPokemon with better error handling
  const fetchDefaultPokemon = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    try {
      const data = await getPokemonList(ITEMS_PER_PAGE, offset);
      
      // Use Promise.allSettled for better error handling
      const pokemonPromises = data.results.map(async (p) => {
        try {
          const res = await fetch(p.url);
          if (!res.ok) throw new Error(`Failed to fetch ${p.name}`);
          return await res.json();
        } catch (error) {
          console.warn(`Failed to fetch ${p.name}:`, error);
          return null; // Return null for failed fetches
        }
      });

      const results = await Promise.allSettled(pokemonPromises);
      const validPokemon = results
        .filter(result => result.status === 'fulfilled' && result.value !== null)
        .map(result => result.value);

      setPokemon(validPokemon);
      setIsSearchMode(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setErrorWithTimeout("Failed to fetch Pokémon. Please try again.");
      setPokemon([]);
    } finally {
      setLoading(false);
    }
  }, [setErrorWithTimeout]);

  // Enhanced fetchByType with better performance
  const fetchByType = useCallback(async (type) => {
    if (!type) {
      fetchDefaultPokemon(currentPage);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      
      if (!res.ok) throw new Error('Failed to fetch Pokemon by type');
      
      const data = await res.json();
      const limited = data.pokemon.slice(0, ITEMS_PER_PAGE);
      
      const pokemonPromises = limited.map(async (p) => {
        try {
          const res = await fetch(p.pokemon.url);
          if (!res.ok) throw new Error(`Failed to fetch ${p.pokemon.name}`);
          return await res.json();
        } catch (error) {
          console.warn(`Failed to fetch ${p.pokemon.name}:`, error);
          return null;
        }
      });

      const results = await Promise.allSettled(pokemonPromises);
      const validPokemon = results
        .filter(result => result.status === 'fulfilled' && result.value !== null)
        .map(result => result.value);

      setPokemon(validPokemon);
      setIsSearchMode(false);
    } catch (err) {
      console.error("Type fetch error:", err);
      setErrorWithTimeout("Failed to fetch Pokémon by type. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, fetchDefaultPokemon, setErrorWithTimeout]);

  // Enhanced search with better UX
  const handleSearchPokemon = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setError("");
      const result = await searchPokemonByName(searchTerm.trim());
      setPokemon([result]);
      setIsSearchMode(true);
    } catch (err) {
      console.error("Search error:", err);
      setPokemon([]);
      setIsSearchMode(true);
      setErrorWithTimeout(`Pokémon "${searchTerm}" not found. Try a different name or ID.`);
    } finally {
      setLoading(false);
    }
  }, [setErrorWithTimeout]);

  // Handle search input changes
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearch(value);
    setCurrentPage(1);
  }, []);

  // Handle search execution
  useEffect(() => {
    if (debouncedSearch && !selectedType) {
      handleSearchPokemon(debouncedSearch);
    } else if (!debouncedSearch && !selectedType) {
      fetchDefaultPokemon(currentPage);
    }
  }, [debouncedSearch, selectedType, currentPage, handleSearchPokemon, fetchDefaultPokemon]);

  // Handle type selection
  const handleTypeSelect = useCallback((type) => {
    setSelectedType(type);
    setSearch("");
    setError("");
    setCurrentPage(1);
    setIsSearchMode(false);
    
    if (type) {
      fetchByType(type);
    } else {
      fetchDefaultPokemon(1);
    }
  }, [fetchByType, fetchDefaultPokemon]);

  // Handle pagination
  const handlePageChange = useCallback((event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearch("");
    setSelectedType("");
    setSortOption("default");
    setError("");
    setCurrentPage(1);
    setIsSearchMode(false);
    fetchDefaultPokemon(1);
  }, [fetchDefaultPokemon]);

  // Optimized sorting function with useMemo
  const sortedPokemon = useMemo(() => {
    if (sortOption === "default") return pokemon;
    
    const sorted = [...pokemon].sort((a, b) => {
      switch (sortOption) {
        case "name":
          return a.name.localeCompare(b.name);
        case "id":
          return a.id - b.id;
        case "height":
          return b.height - a.height; // Tallest first
        case "weight":
          return b.weight - a.weight; // Heaviest first
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [pokemon, sortOption]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="pokemon-card skeleton">
          <div className="skeleton-image"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text short"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="main-heading">
          <span className="gradient-text">Pokédex</span>
        </h1>
        <p className="hero-subtitle">
          Discover and explore the world of Pokémon
        </p>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-wrapper">
          <div className="search-input-container">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              aria-label="Search Pokémon by name or ID"
              placeholder="Search Pokémon by name or ID..."
              value={search}
              onChange={handleSearchChange}
              className="search-input"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="clear-search-btn"
                aria-label="Clear search"
              >
                <ClearIcon />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="controls-section">
        <div className="controls-row">
          <div className="filter-group">
            <FilterListIcon className="control-icon" />
            <TypeFilter onTypeSelect={handleTypeSelect} selectedType={selectedType} />
          </div>

          <div className="sort-group">
            <SortIcon className="control-icon" />
            <div className="sort-dropdown">
              <label htmlFor="sort" className="sr-only">Sort Pokemon</label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="sort-select"
              >
                <option value="default">Default Order</option>
                <option value="name">Name (A-Z)</option>
                <option value="id">Pokédex Number</option>
                <option value="height">Height (Tallest)</option>
                <option value="weight">Weight (Heaviest)</option>
              </select>
            </div>
          </div>

          {(search || selectedType || sortOption !== "default") && (
            <button
              onClick={clearAllFilters}
              className="clear-filters-btn"
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Results Info */}
        <div className="results-info">
          <span className="results-count">
            {loading ? "Loading..." : `${sortedPokemon.length} Pokémon found`}
          </span>
          {(search || selectedType) && (
            <span className="filter-info">
              {search && `Searching: "${search}"`}
              {search && selectedType && " • "}
              {selectedType && `Type: ${selectedType}`}
            </span>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-container">
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        </div>
      )}

      {/* Pokemon Grid */}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {sortedPokemon.length > 0 ? (
            <div className="pokemon-grid">
              {sortedPokemon.map((p) => (
                <PokemonCard 
                  key={`${p.id}-${p.name}`} 
                  name={p.name} 
                  id={p.id}
                  pokemon={p} // Pass full pokemon data for enhanced card
                />
              ))}
            </div>
          ) : (
            !loading && (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No Pokémon Found</h3>
                <p>Try adjusting your search terms or filters</p>
                <button onClick={clearAllFilters} className="retry-btn">
                  Show All Pokémon
                </button>
              </div>
            )
          )}
        </>
      )}

      {/* Pagination - Only show when not in search mode and has results */}
      {!isSearchMode && !selectedType && sortedPokemon.length > 0 && (
        <div className="pagination-container">
          <Stack spacing={2}>
            <Pagination
              count={TOTAL_PAGES}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPagination-ul': {
                  justifyContent: 'center',
                },
                '& .MuiPaginationItem-root': {
                  fontSize: '1rem',
                  fontWeight: 500,
                }
              }}
            />
          </Stack>
          <div className="pagination-info">
            Page {currentPage} of {TOTAL_PAGES} • Showing {sortedPokemon.length} Pokémon
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;