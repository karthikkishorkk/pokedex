import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPokemonDetails, getEvolutionChain } from "../../services/pokemonService";
import './Details.css';

const Details = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [evolution, setEvolution] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPokemonDetails(name);
        setPokemon(data);
        const evoData = await getEvolutionChain(data.species.url);

        const evoChain = [];
        let evoStep = evoData.chain;

        while (evoStep) {
          evoChain.push(evoStep.species.name);
          evoStep = evoStep.evolves_to.length ? evoStep.evolves_to[0] : null;
        }

        setEvolution(evoChain);
      } catch (error) {
        console.error("Failed to load Pokémon details:", error);
      }
    };

    fetchData();
  }, [name]);

  if (!pokemon) return <p>Loading...</p>;

  return (
    <div className="details-layout">
      <div className="container">
        <div className="header-section">
          <h1 className="capitalize">{pokemon.name}</h1>
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            className="main-pokemon-img"
          />
          <p className="pokedex-number">Pokédex Number: #{pokemon.id}</p>
        </div>

        <div className="basic-info-section">
          <h2>Basic Info</h2>
          <p>Height: {pokemon.height}</p>
          <p>Weight: {pokemon.weight}</p>
          <p>Abilities: {pokemon.abilities.map((a) => a.ability.name).join(", ")}</p>
        </div>

        {evolution.length > 1 && (
          <div>
            <h2>Evolution Chain</h2>
            <div className="evolution-chain">
              {evolution.map((evo, index) => (
                <div className="evolution-step" key={index}>
                  <Link to={`/details/${evo}`} className="evolution-link">
                    <img
                      src={`https://img.pokemondb.net/artwork/large/${evo}.jpg`}
                      alt={evo}
                      className="evolution-image"
                    />
                    <p className="capitalize">{evo}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="moves-section">
          <h2>Moves</h2>
          <div className="moves-list">
            {pokemon.moves.slice(0, 10).map((move, index) => (
              <div className="move-item" key={index}>
                <h3>{move.move.name}</h3>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-section">
          <h2>Stats</h2>
          <div className="stats-grid">
            {pokemon.stats.map((stat, index) => (
              <div className="stat-bar" key={index}>
                <label>{stat.stat.name}</label>
                <div className="bar-bg">
                  <div
                    className="bar-fill"
                    style={{ width: `${stat.base_stat}%` }}
                  >
                    {stat.base_stat}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>      
      </div>
    </div>
  );
};

export default Details;
