import { useEffect, useState } from "react";
import { useParams, Link} from "react-router-dom";
import { getPokemonDetails, getEvolutionChain } from "../services/pokemonService";
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
    <div className="container">
      <h1 className="capitalize">{pokemon.name}</h1>
      <img
        src={pokemon.sprites.other["official-artwork"].front_default}
        alt={pokemon.name}
        className="main-pokemon-img"
      />
      <p>Height: {pokemon.height}</p>
      <p>Weight: {pokemon.weight}</p>
      <p>
        Abilities:{" "}
        {pokemon.abilities.map((a) => a.ability.name).join(", ")}
      </p>

      {evolution.length > 1 && (
        <div>
          <h2>Evolution Chain</h2>
          <div className="evolution-chain">
            {evolution.map((evo, index) => (
              <Link to={`/details/${evo}`} key={index} className="evolution-step">
                <img
                  src={`https://img.pokemondb.net/artwork/large/${evo}.jpg`}
                  alt={evo}
                />
                <p className="capitalize">{evo}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Details;
