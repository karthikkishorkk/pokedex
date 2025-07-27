import { useEffect, useState, useCallback } from "react";
import './TypeFilter.css';

const TypeFilter = ({ onTypeSelect, selectedType = "" }) => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch types with proper error handling
  const fetchTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch("https://pokeapi.co/api/v2/type");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch types: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filter out unknown and shadow types, and sort alphabetically
      const filtered = data.results
        .filter(type => !['unknown', 'shadow'].includes(type.name))
        .sort((a, b) => a.name.localeCompare(b.name));
      
      setTypes(filtered);
    } catch (err) {
      console.error("Error fetching Pokemon types:", err);
      setError("Failed to load types");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  // Handle selection change
  const handleChange = useCallback((e) => {
    const type = e.target.value;
    onTypeSelect(type); // Let parent handle the state
  }, [onTypeSelect]);

  // Retry function for error state
  const handleRetry = useCallback(() => {
    fetchTypes();
  }, [fetchTypes]);

  // Capitalize first letter for display
  const formatTypeName = (typeName) => {
    return typeName.charAt(0).toUpperCase() + typeName.slice(1);
  };

  // Get type color for visual enhancement (optional)
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

  if (loading) {
    return (
      <div className="type-filter">
        <label className="type-filter-label">Filter by Type:</label>
        <div className="type-filter-loading">
          <div className="loading-spinner"></div>
          <span>Loading types...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="type-filter">
        <label className="type-filter-label">Filter by Type:</label>
        <div className="type-filter-error">
          <span className="error-text">{error}</span>
          <button 
            onClick={handleRetry}
            className="retry-button"
            aria-label="Retry loading types"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="type-filter">
      <label htmlFor="type-select" className="type-filter-label">
        Filter by Type:
      </label>
      <div className="type-select-wrapper">
        <select 
          id="type-select" 
          value={selectedType} // Use prop instead of local state
          onChange={handleChange}
          className="type-select"
          aria-label="Filter Pokemon by type"
        >
          <option value="" className="type-option">
            All Types ({types.length + 1})
          </option>
          {types.map(type => (
            <option 
              key={type.name} 
              value={type.name} 
              className="type-option"
              style={{ color: getTypeColor(type.name) }}
            >
              {formatTypeName(type.name)}
            </option>
          ))}
        </select>
        <div className="select-arrow">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      {/* Show selected type indicator */}
      {selectedType && (
        <div className="selected-type-indicator">
          <span 
            className="type-badge"
            style={{ backgroundColor: getTypeColor(selectedType) }}
          >
            {formatTypeName(selectedType)}
          </span>
        </div>
      )}
    </div>
  );
};

export default TypeFilter;