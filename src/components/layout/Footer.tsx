import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} DocSearch. Todos los derechos reservados.
        </div>
        <div className={styles.links}>
          <a href="#" className={styles.link}>Términos de servicio</a>
          <a href="#" className={styles.link}>Política de privacidad</a>
          <a href="#" className={styles.link}>Contacto</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
