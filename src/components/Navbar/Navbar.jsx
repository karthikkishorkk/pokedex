import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">Pokédex</h1>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/favourites">Favourites</Link></li>
        <li><Link to="/compare">Compare</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
