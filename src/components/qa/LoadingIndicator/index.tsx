import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import styles from './index.module.css';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = 'Analizando tu pregunta...' 
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.spinnerContainer}>
        <FaSpinner className={styles.spinner} />
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoadingIndicator;
