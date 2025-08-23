import React, { useState } from 'react';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { message } from 'antd';
import styles from './index.module.css';

interface CopyButtonProps {
  textToCopy: string;
  successMessage?: string;
  className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ 
  textToCopy, 
  successMessage = '¡Contenido copiado al portapapeles!',
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      message.success(successMessage);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Error al copiar el texto: ', err);
      message.error('No se pudo copiar el texto');
    }
  };

  return (
    <button 
      onClick={handleCopy} 
      className={`${styles.copyButton} ${className}`}
      aria-label="Copiar al portapapeles"
      title="Copiar al portapapeles"
    >
      {copied ? <CheckOutlined /> : <CopyOutlined />}
    </button>
  );
};

export default CopyButton;
