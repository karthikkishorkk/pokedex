import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFavourites } from '../../context/FavouritesContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { favourites } = useFavourites();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: <HomeIcon className="nav-icon" />,
    },
    {
      path: '/favourites',
      label: 'Favourites',
      icon: <FavoriteIcon className="nav-icon" />,
      badge: favourites.length > 0 ? favourites.length : null,
    },
  ];

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Logo/Brand */}
          <Link to="/" className="navbar-brand">
            <div className="brand-container">
              <div className="pokeball-logo">
                <div className="pokeball-top"></div>
                <div className="pokeball-center">
                  <div className="pokeball-button"></div>
                </div>
                <div className="pokeball-bottom"></div>
              </div>
              <h1 className="navbar-title">
                <span className="gradient-text">Pokédex</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-nav-desktop">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActiveRoute(item.path) ? 'nav-link-active' : ''}`}
              >
                <div className="nav-link-content">
                  {item.icon}
                  <span className="nav-label">{item.label}</span>
                  {item.badge && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="menu-icon" />
            ) : (
              <MenuIcon className="menu-icon" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'mobile-nav-open' : ''}`}>
          <div className="mobile-nav-content">
            <div className="mobile-nav-header">
              <h2 className="gradient-text">Navigation</h2>
            </div>
            <div className="mobile-nav-links">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-link ${isActiveRoute(item.path) ? 'mobile-nav-link-active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="mobile-nav-link-content">
                    {item.icon}
                    <span className="mobile-nav-label">{item.label}</span>
                    {item.badge && (
                      <span className="mobile-nav-badge">{item.badge}</span>
                    )}
                  </div>
                  <div className="mobile-nav-arrow">→</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-nav-backdrop" 
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;