import { useState } from 'react';
import './Compare.css';

const Compare = () => {
  const [inputName, setInputName] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [error, setError] = useState('');

  const fetchPokemon = async (name) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      if (!res.ok) throw new Error('Pokémon Not Found');
      const data = await res.json();

      // Avoid duplicates
      if (pokemonList.find((p) => p.name === data.name)) {
        setError('Pokémon Already Added.');
        return;
      }

      setPokemonList((prev) => [...prev, data]);
      setInputName('');
      setError('');
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const handleAdd = () => {
    if (!inputName) {
      setError('Please enter a Pokémon name.');
      return;
    }
    fetchPokemon(inputName);
  };

  const handleRemove = (name) => {
    setPokemonList(pokemonList.filter((p) => p.name !== name));
  };

  return (
    <div className="compare-container">
      <h2>Compare Multiple Pokémon</h2>
      <div className="compare-inputs">
        <input
          type="text"
          placeholder="Enter Pokémon Name"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="compare-result-multi">
        {pokemonList.map((p) => (
          <div className="pokemon-card" key={p.id}>
            <button className="remove-btn" onClick={() => handleRemove(p.name)}>×</button>
            <img src={p.sprites.other['official-artwork'].front_default} alt={p.name} />
            <h3 className="capitalize">{p.name}</h3>
            {p.stats.map((stat) => (
              <p key={stat.stat.name}>
                {stat.stat.name.toUpperCase()}: {stat.base_stat}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Compare;
