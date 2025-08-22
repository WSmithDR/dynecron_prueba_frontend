import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import styles from './index.module.css';

interface NoResultsProps {
  title?: string;
  message?: string;
}

const NoResults: React.FC<NoResultsProps> = ({
  title = 'No se pudo generar una respuesta',
  message = 'Intenta reformular tu pregunta o verifica que hayas cargado documentos.'
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <FaQuestionCircle />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default NoResults;
