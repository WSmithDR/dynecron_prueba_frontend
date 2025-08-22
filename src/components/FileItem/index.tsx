import React from 'react';
import { FiFile, FiX, FiCheckCircle } from 'react-icons/fi';
import styles from './index.module.css';

export interface FileWithPreview extends File {
  preview: string;
}

interface FileItemProps {
  file: FileWithPreview;
  onRemove: () => void;
  disabled?: boolean;
  isUploaded?: boolean;
}

const FileItem: React.FC<FileItemProps> = ({
  file,
  onRemove,
  disabled = false,
  isUploaded = false,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <li className={styles.fileItem}>
      <div className={styles.fileInfo}>
        <FiFile className={styles.fileIcon} />
        <div className={styles.fileDetails}>
          <span className={styles.fileName}>{file.name}</span>
          <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
        </div>
      </div>
      <div className={styles.fileActions}>
        {isUploaded ? (
          <div className={styles.uploadedIndicator}>
            <FiCheckCircle className={styles.uploadedIcon} />
            <span>Subido</span>
          </div>
        ) : (
          <button 
            type="button" 
            className={styles.removeButton}
            onClick={onRemove}
            disabled={disabled}
            aria-label="Eliminar archivo"
          >
            <FiX />
          </button>
        )}
      </div>
    </li>
  );
};

export default FileItem;
