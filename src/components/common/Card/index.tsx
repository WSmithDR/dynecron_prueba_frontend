import React from 'react';
import classNames from 'classnames';
import styles from './index.module.css';

type CardVariant = 'default' | 'outlined' | 'elevated';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  hoverable = false,
  className = '',
  children,
  ...props
}) => {
  const cardClasses = classNames(
    styles.card,
    styles[`card--${variant}`],
    {
      [styles['card--hoverable'] as string]: hoverable,
    },
    className
  );

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;
