import React, { useCallback, useRef, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../store';

import type { FileWithPreview } from '../../components/FileItem';
import FileList from '../../components/FileList';
import FileUploader from '../../components/FileUploader';
import Button from '../../components/common/Button';
import { uploadFilesAction } from '../../store/uploader/uploader.actions';
import { selectUploaderLoading } from '../../store/uploader/uploader.selectors';
import uploaderService, { type UploadedFile } from '../../services/uploaderService';
import styles from './index.module.css';

const UploadPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectUploaderLoading);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [serverFiles, setServerFiles] = useState<UploadedFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // We'll use serverFiles for the uploaded files list instead of uploadedFiles

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsDragActive(false);
    // Filter out duplicates
    const filesWithPreview = acceptedFiles
      .filter(file => 
        (file.type === 'application/pdf' || file.type === 'text/plain') &&
        file.size <= 10 * 1024 * 1024 &&
        !files.some(f => f.name === file.name && f.size === file.size)
      )
      .map(file => Object.assign(file, { preview: URL.createObjectURL(file) }) as FileWithPreview);

    if (filesWithPreview.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...filesWithPreview]);
    }

    if (filesWithPreview.length < acceptedFiles.length) {
      toast.error('Algunos archivos no son válidos. Solo se permiten archivos PDF y TXT (máx. 10MB)');
    }
  }, [files]);

  const handleRemoveFile = useCallback((index: number) => {
    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      const [removedFile] = newFiles.splice(index, 1);
      // Revoke the object URL to avoid memory leaks
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return newFiles;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    // Revoke all object URLs to avoid memory leaks
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [files]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter(file => 
        (file.type === 'application/pdf' || file.type === 'text/plain') && 
        file.size <= 10 * 1024 * 1024 &&
        !files.some(f => f.name === file.name && f.size === file.size)
      );

      if (newFiles.length > 0) {
        const filesWithPreview = newFiles.map(file => 
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ) as FileWithPreview[];
        
        setFiles(prevFiles => [...prevFiles, ...filesWithPreview]);
      }

      if (newFiles.length < e.target.files.length) {
        toast.error('Algunos archivos no son válidos. Solo se permiten archivos PDF y TXT (máx. 10MB)');
      }
    }
  }, [files]);

  // Load files from server
  const loadServerFiles = useCallback(async () => {
    try {
      setIsLoadingFiles(true);
      const files = await uploaderService.getUploadedFiles();
      setServerFiles(files);
    } catch (error) {
      console.error('Error loading files:', error);
      toast.error('Error al cargar los archivos del servidor');
    } finally {
      setIsLoadingFiles(false);
    }
  }, []);

  // Load files on component mount
  useEffect(() => {
    loadServerFiles();
  }, [loadServerFiles]);

  const handleUpload = useCallback(async () => {
    if (files.length === 0) {
      toast.error('No hay archivos para subir');
      return;
    }

    try {
      await dispatch(uploadFilesAction(files)).unwrap();
      toast.success('Archivos subidos correctamente');
      
      // Clean up object URLs after successful upload
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      
      // Refresh the file list
      const updatedFiles = await uploaderService.getUploadedFiles();
      setServerFiles(updatedFiles);
      
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al subir los archivos';
      toast.error(errorMessage);
    }
  }, [dispatch, files]);
  
  // Handle file deletion
  const handleDeleteFile = useCallback(async (index: number) => {
    const fileToDelete = serverFiles[index];
    if (!fileToDelete) return;

    try {
      await uploaderService.deleteFile(fileToDelete.id);
      toast.success(`Archivo "${fileToDelete.name}" eliminado correctamente`);
      // Refresh the file list after deletion
      await loadServerFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error(`Error al eliminar el archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }, [serverFiles, loadServerFiles]);
  
  const handleDeleteAllFiles = useCallback(async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar todos los archivos? Esta acción no se puede deshacer.')) {
      try {
        await uploaderService.deleteAllFiles();
        toast.success('Todos los archivos han sido eliminados');
        setServerFiles([]);
      } catch (error) {
        console.error('Error deleting all files:', error);
        toast.error('Error al eliminar los archivos');
      }
    }
  }, []);

  const handleSelectFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.uploadPage}>
      <h1 className={styles.title}>Subir Documentos</h1>
      
      <FileUploader
        onDrop={onDrop}
        isDragActive={isDragActive}
        onSelectFiles={handleSelectFiles}
        fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
        handleFileInputChange={handleFileInputChange}
        disabled={loading === 'pending'}
      />
        <div className={styles.actions}>
        <Button 
          onClick={handleUpload}
          disabled={files.length === 0 || loading === 'pending'}
          isLoading={loading === 'pending'}
        >
          Subir archivos
        </Button>
      </div>
      
      {files.length > 0 && (
        <FileList
          files={files}
          title="Archivos a subir"
          onRemove={handleRemoveFile}
          onClearAll={handleClearAll}
          showClearAll={true}
          disabled={loading === 'pending'}
        />
      )}
      
      {isLoadingFiles ? (
        <div className={styles.loading}>Cargando archivos...</div>
      ) : serverFiles.length > 0 ? (
        <FileList
          files={serverFiles.map(file => ({
            name: file.name,
            size: file.size,
            type: file.content_type,
            lastModified: new Date(file.upload_date).getTime(),
            preview: '',
            // Add required File interface methods
            webkitRelativePath: '',
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
            slice: (_start?: number, _end?: number, _contentType?: string) => new Blob(),
            stream: () => new ReadableStream(),
            text: () => Promise.resolve('')
          } as unknown as FileWithPreview))}
          title="Archivos subidos"
          onRemove={handleDeleteFile}
          onClearAll={handleDeleteAllFiles}
          showClearAll={true}
          disabled={loading === 'pending'}
          isUploadedList={true}
        />
      ) : (
        <div className={styles.noFiles}>No hay archivos subidos.</div>
      )}
      
     
    </div>
  );
};

export default UploadPage;
