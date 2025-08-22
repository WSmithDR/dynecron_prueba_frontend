import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? styles.active : '';
  };

  const { isDark, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">DocSearch</Link>
        </div>
        
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link to="/" className={`${styles.navLink} ${isActive('/')}`}>
                Inicio
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/upload" className={`${styles.navLink} ${isActive('/upload')}`}>
                Cargar Documentos
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/search" className={`${styles.navLink} ${isActive('/search')}`}>
                Buscar
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/ask" className={`${styles.navLink} ${isActive('/ask')}`}>
                Preguntar
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className={styles.actions}>
          <button 
            className={styles.themeToggle}
            onClick={toggleTheme}
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDark ? (
              <FiSun className={styles.themeIcon} />
            ) : (
              <FiMoon className={styles.themeIcon} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
