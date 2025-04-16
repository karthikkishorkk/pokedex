import axios from "axios";

export const API_URL = "https://pokeapi.co/api/v2/";

export const getPokemonList = async (limit = 20, offset = 0) => {
  const response = await axios.get(`${API_URL}pokemon?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const getPokemonDetails = async (name) => {
  const response = await axios.get(`${API_URL}pokemon/${name}`);
  return response.data;
};

export const getEvolutionChain = async (speciesUrl) => {
  const speciesId = speciesUrl.split("/").slice(-2, -1)[0]; // Used to Extract ID from URL
  const speciesResponse = await axios.get(`${API_URL}pokemon-species/${speciesId}`);
  const evolutionUrl = speciesResponse.data.evolution_chain.url;
  const evolutionResponse = await axios.get(evolutionUrl);
  return evolutionResponse.data;
};

export const searchPokemonByName = async (name) => {
  const response = await axios.get(`${API_URL}pokemon/${name.toLowerCase()}`);
  return response.data;
};
