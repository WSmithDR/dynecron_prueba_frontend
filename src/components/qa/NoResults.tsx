import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import styles from '../../pages/QAPage/index.module.css';

const NoResults: React.FC = () => {
  return (
    <div className={styles.noResults}>
      <div className={styles.noResultsIcon}>
        <FaQuestionCircle />
      </div>
      <h3>No se pudo generar una respuesta</h3>
      <p>Intenta reformular tu pregunta o verifica que hayas cargado documentos.</p>
    </div>
  );
};

export default NoResults;
