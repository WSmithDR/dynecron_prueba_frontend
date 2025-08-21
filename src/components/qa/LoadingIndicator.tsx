import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import styles from '../../pages/QAPage/index.module.css';

const LoadingIndicator: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinnerContainer}>
        <FaSpinner className={styles.spinnerLarge} />
      </div>
      <p>Analizando tu pregunta...</p>
    </div>
  );
};

export default LoadingIndicator;
