import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppDispatch, useAppSelector } from '../../store';
import { toast } from 'react-toastify';
import { FiUpload, FiX, FiFile, FiCheckCircle } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import styles from './index.module.css';
import { selectUploaderLoading } from '../../store/uploader/uploader.selectors';
import { selectUploadedFiles } from '../../store/uploader/uploader.selectors';
import { uploadFilesAction } from '../../store/uploader/uploader.actions';

interface FileWithPreview extends File {
  preview: string;
}

const UploadPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectUploaderLoading);
  const uploadedFiles = useAppSelector(selectUploadedFiles);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filtrar archivos duplicados
    const filesWithPreview = acceptedFiles
      .filter(file => !files.some(f => f.name === file.name && f.size === file.size))
      .map(file => {
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file)
        }) as FileWithPreview;
        return fileWithPreview;
      });

    if (filesWithPreview.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...filesWithPreview]);
    }

    if (acceptedFiles.length > filesWithPreview.length) {
      toast.error('Algunos archivos no son válidos. Solo se permiten archivos PDF y TXT (máx. 10MB)');
    }
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
    disabled: loading === 'pending'
  });

  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    // Revoke object URLs to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
    setFiles([]);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.warning('Por favor, selecciona al menos un archivo para subir');
      return;
    }

    try {
      const resultAction = await dispatch(uploadFilesAction(files));
      
      if (uploadFilesAction.fulfilled.match(resultAction)) {
        toast.success('Archivos subidos exitosamente');
        setFiles([]);
      } else if (uploadFilesAction.rejected.match(resultAction)) {
        throw new Error('Error al subir los archivos');
      }
    } catch (error) {
      console.error('Error al subir archivos:', error);
      toast.error('Ocurrió un error al subir los archivos. Por favor, inténtalo de nuevo.');
    }
  };

  const handleSelectFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      const validFiles = fileList.filter(file => 
        ['application/pdf', 'text/plain'].includes(file.type) && 
        file.size <= 10 * 1024 * 1024
      );
      
      const newFiles = validFiles
        .filter(file => !files.some(f => f.name === file.name && f.size === file.size))
        .map(file => {
          const fileWithPreview = Object.assign(file, {
            preview: URL.createObjectURL(file)
          }) as FileWithPreview;
          return fileWithPreview;
        });
      
      if (newFiles.length > 0) {
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
      }
      
      if (fileList.length > validFiles.length) {
        toast.error('Algunos archivos no son válidos. Solo se permiten archivos PDF y TXT (máx. 10MB)');
      }
      
      // Limpiar el input para permitir seleccionar el mismo archivo de nuevo si es necesario
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.uploadPage}>
      <h1>Cargar Documentos</h1>
      <p className={styles.subtitle}>
        Sube tus archivos PDF o TXT (máx. 10MB por archivo)
      </p>

      <Card className={styles.uploadCard}>
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
              handleSelectFiles();
            }}
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
      </Card>

      {(files.length > 0 || uploadedFiles.length > 0) && (
        <div className={styles.fileLists}>
          {files.length > 0 && (
            <div className={styles.fileListContainer}>
              <div className={styles.fileListHeader}>
                <h3>Archivos a subir ({files.length})</h3>
                <Button 
                  variant="outline" 
                  onClick={handleClearAll}
                  disabled={loading === 'pending'}
                >
                  Limpiar todo
                </Button>
              </div>
              <ul className={styles.fileList}>
                {files.map((file, index) => (
                  <li key={`${file.name}-${file.size}-${index}`} className={styles.fileItem}>
                    <div className={styles.fileInfo}>
                      <FiFile className={styles.fileIcon} />
                      <div className={styles.fileDetails}>
                        <span className={styles.fileName}>{file.name}</span>
                        <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className={styles.removeButton}
                      onClick={() => handleRemoveFile(index)}
                      disabled={loading === 'pending'}
                      aria-label="Eliminar archivo"
                    >
                      <FiX />
                    </button>
                  </li>
                ))}
              </ul>
              <div className={styles.uploadActions}>
                <Button 
                  variant="primary" 
                  onClick={handleUpload}
                  disabled={loading === 'pending' || files.length === 0}
                  fullWidth
                >
                  {loading === 'pending' ? (
                    <>
                      <Spinner size="sm" variant="light" />
                      <span>Subiendo...</span>
                    </>
                  ) : (
                    `Subir ${files.length} archivo${files.length !== 1 ? 's' : ''}`
                  )}
                </Button>
              </div>
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className={styles.fileListContainer}>
              <h3>Archivos subidos recientemente</h3>
              <ul className={styles.fileList}>
                {uploadedFiles.map((file, index) => (
                  <li key={`${file.name}-${index}`} className={`${styles.fileItem} ${styles.uploadedFile}`}>
                    <div className={styles.fileInfo}>
                      <FiCheckCircle className={styles.uploadedIcon} />
                      <div className={styles.fileDetails}>
                        <span className={styles.fileName}>{file.name}</span>
                        <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadPage;
