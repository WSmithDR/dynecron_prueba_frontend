import React from 'react';
import classNames from 'classnames';
import styles from './index.module.css';

type SpinnerSize = 'sm' | 'md' | 'lg';
type SpinnerVariant = 'primary' | 'secondary' | 'light' | 'dark';

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className = '',
}) => {
  const spinnerClasses = classNames(
    styles.spinner,
    styles[`spinner--${size}`],
    styles[`spinner--${variant}`],
    className
  );

  return (
    <div className={styles.spinnerContainer}>
      <div className={spinnerClasses}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Spinner;
