import { useEffect, useState } from "react";
import { getPokemonList, searchPokemonByName,API_URL } from "../services/pokemonService";
import PokemonCard from "../components/PokemonCard";
import './Home.css'; 


const Home = () => {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getPokemonList(20, 0).then((data) => setPokemon(data.results));
  }, []);

  const extractId = (url) => {
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1];
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);
    setError("");

    if (!value) {
      const data = await getPokemonList(20, 0);
      setPokemon(data.results);
      return;
    }

    try {
      const result = await searchPokemonByName(value);
      setPokemon([
        {
          name: result.name,
          url: `${API_URL}pokemon/${result.id}/`, 
        },
      ]);
    } catch (err) {
      setPokemon([]);
      setError("Pokémon not found.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Pokédex</h1>
      <input
        type="text"
        placeholder="Search Pokémon..."
        className="border p-2 rounded w-full my-4"
        value={search}
        onChange={handleSearch}
      />
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemon.map((p) => (
          <PokemonCard key={p.name} name={p.name} id={extractId(p.url)} />
        ))}
      </div>
    </div>
  );
};

export default Home;
