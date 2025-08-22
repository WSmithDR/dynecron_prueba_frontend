import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';
import Button from '../common/Button';
import styles from './index.module.css';

interface FileUploaderProps {
  onDrop: (acceptedFiles: File[]) => void;
  isDragActive: boolean;
  onSelectFiles: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onDrop,
  isDragActive,
  onSelectFiles,
  fileInputRef,
  handleFileInputChange,
  disabled = false,
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
    disabled,
  });

  return (
    <div className={styles.uploadCard}>
      <div 
        {...getRootProps()} 
        className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}
      >
        <input {...getInputProps()} />
        <FiUpload size={48} className={styles.uploadIcon} />
        <h3>Arrastra y suelta archivos aquí</h3>
        <p>o</p>
        <Button 
          type="button" 
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onSelectFiles();
          }}
          disabled={disabled}
        >
          Seleccionar archivos
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".pdf,.txt"
          multiple
          style={{ display: 'none' }}
        />
        <p className={styles.fileTypes}>Formatos soportados: PDF, TXT</p>
      </div>
    </div>
  );
};

export default FileUploader;
