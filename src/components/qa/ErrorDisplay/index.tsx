import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import styles from './index.module.css';

interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <div className={styles.container}>
      <FaExclamationCircle className={styles.icon} />
      <p className={styles.text}>{error}</p>
    </div>
  );
};

export default ErrorDisplay;
