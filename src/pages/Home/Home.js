import { useCallback, useEffect, useState } from "react";
import { getPokemonList, searchPokemonByName } from "../../services/pokemonService";
import PokemonCard from "../../components/PokemonCard";
import TypeFilter from "../../components/TypeFilter";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import './Home.css';

const TOTAL_POKEMON = 1298;
const ITEMS_PER_PAGE = 20;
const TOTAL_PAGES = Math.ceil(TOTAL_POKEMON / ITEMS_PER_PAGE);

const Home = () => {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Memoize fetchDefaultPokemon function
  const fetchDefaultPokemon = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");
    const offset = (page - 1) * ITEMS_PER_PAGE;
    try {
      const data = await getPokemonList(ITEMS_PER_PAGE, offset);
      const detailed = await Promise.all(
        data.results.map(async (p) => {
          const res = await fetch(p.url);
          return res.json();
        })
      );
      setPokemon(detailed);
    } catch (err) {
      setError("Failed to fetch Pokémon.");
      setPokemon([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoize fetchByType function
  const fetchByType = useCallback(async (type) => {
    if (!type) {
      fetchDefaultPokemon(currentPage);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      const data = await res.json();
      const limited = data.pokemon.slice(0, ITEMS_PER_PAGE);
      const detailed = await Promise.all(
        limited.map(async (p) => {
          const res = await fetch(p.pokemon.url);
          return res.json();
        })
      );
      setPokemon(detailed);
    } catch (err) {
      setError("Failed to fetch Pokémon by type.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, fetchDefaultPokemon]); // Add fetchDefaultPokemon as dependency

  // Memoize handleSearch function
  const handleSearch = useCallback(async (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setError("");
    setCurrentPage(1);

    if (!value && !selectedType) {
      fetchDefaultPokemon(1);
      return;
    }

    if (!value && selectedType) {
      fetchByType(selectedType);
      return;
    }

    try {
      setLoading(true);
      const result = await searchPokemonByName(value);
      setPokemon([result]);
    } catch (err) {
      setPokemon([]);
      setError("Pokémon not found.");
    } finally {
      setLoading(false);
    }
  }, [selectedType, fetchByType, fetchDefaultPokemon]); // Add fetchByType and fetchDefaultPokemon as dependencies

  // useEffect hook to trigger the fetch operation
  useEffect(() => {
    if (search || selectedType) {
      if (search) {
        handleSearch({ target: { value: search } });
      } else if (selectedType) {
        fetchByType(selectedType);
      }
    } else {
      fetchDefaultPokemon(currentPage);
    }
  }, [currentPage, search, selectedType, fetchByType, handleSearch, fetchDefaultPokemon]); // Add fetchDefaultPokemon as dependency

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setSearch("");
    setError("");
    setCurrentPage(1);
    fetchByType(type);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const sortPokemon = (list) => {
    if (sortOption === "name") {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortOption === "height") {
      return [...list].sort((a, b) => a.height - b.height);
    }
    if (sortOption === "weight") {
      return [...list].sort((a, b) => a.weight - b.weight);
    }
    return list;
  };

  const filteredAndSortedPokemon = () => {
    let filteredPokemon = pokemon
      .filter((poke) => poke.name.toLowerCase().includes(search.toLowerCase()))
      .filter((poke) =>
        !selectedType ? true : poke.types.some((type) => type.type.name === selectedType)
      );

    return sortPokemon(filteredPokemon);
  };

  return (
    <div className="container">
      <h1 className="heading">Pokédex</h1>

      <div className="search-wrapper">
        <input
          type="text"
          aria-label="Search Pokémon"
          placeholder="Search Pokémon..."
          value={search}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="controls-row">
        <TypeFilter onTypeSelect={handleTypeSelect} />

        <div className="sort-dropdown">
          <label htmlFor="sort">Sort By:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">Select</option>
            <option value="name">Name</option>
            <option value="height">Height</option>
            <option value="weight">Weight</option>
          </select>
        </div>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading Pokémon...</p>}

      <div className="grid">
        {filteredAndSortedPokemon().map((p) => (
          <PokemonCard key={p.id} name={p.name} id={p.id} />
        ))}
      </div>

      {!search && !selectedType && (
        <div style={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}>
          <Stack spacing={2}>
            <Pagination
              count={TOTAL_PAGES}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </div>
      )}
    </div>
  );
};

export default Home;
