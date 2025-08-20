import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import styles from './index.module.css';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Página no encontrada</h2>
        <p className={styles.message}>
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Button 
          onClick={handleGoHome}
          variant="primary"
          className={styles.button}
        >
          Volver al inicio
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
