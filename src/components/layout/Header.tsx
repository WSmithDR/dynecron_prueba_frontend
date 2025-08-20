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

  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">DocSearch</Link>
        </div>
        <div className={styles.navContainer}>
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
          <div 
            className={styles.themeToggle} 
            onClick={toggleTheme} 
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' ? (
              <FiSun size={20} className={styles.themeIcon} />
            ) : (
              <FiMoon size={20} className={styles.themeIcon} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
