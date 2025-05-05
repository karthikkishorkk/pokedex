import React, { createContext, useContext, useEffect, useState } from 'react';

const FavouritesContext = createContext();

export const useFavourites = () => useContext(FavouritesContext);

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);

  // Load favourites from localStorage on first render
  useEffect(() => {
    const storedFavourites = JSON.parse(localStorage.getItem('favourites')) || [];
    setFavourites(storedFavourites);
  }, []);

  // Save to localStorage whenever favourites change
  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites));
  }, [favourites]);

  const addFavourite = (pokemon) => {
    if (!favourites.find((fav) => fav.id === pokemon.id)) {
      setFavourites([...favourites, pokemon]);
    }
  };

  const removeFavourite = (id) => {
    setFavourites(favourites.filter((fav) => fav.id !== id));
  };

  const toggleFavourite = (pokemon) => {
    if (favourites.find((fav) => fav.id === pokemon.id)) {
      removeFavourite(pokemon.id);
    } else {
      addFavourite(pokemon);
    }
  };

  return (
    <FavouritesContext.Provider value={{ favourites, addFavourite, removeFavourite, toggleFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
};
