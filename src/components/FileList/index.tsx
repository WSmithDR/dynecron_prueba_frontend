import React from 'react';
import Button from '../common/Button';
import type { FileWithPreview } from '../FileItem';
import FileItem from '../FileItem';
import styles from './index.module.css';

interface FileListProps {
  files: FileWithPreview[];
  title: string;
  onRemove: (index: number) => void;
  onClearAll?: () => void;
  showClearAll?: boolean;
  disabled?: boolean;
  isUploadedList?: boolean;
}

const FileList: React.FC<FileListProps> = ({
  files,
  title,
  onRemove,
  onClearAll,
  showClearAll = true,
  disabled = false,
  isUploadedList = false,
}) => {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className={styles.fileListContainer}>
      <div className={styles.fileListHeader}>
        <h3>{title} ({files.length})</h3>
        {showClearAll && onClearAll && (
          <Button 
            variant="outline" 
            onClick={onClearAll}
            disabled={disabled}
          >
            Limpiar todo
          </Button>
        )}
      </div>
      <ul className={styles.fileList}>
        {files.map((file, index) => (
          <FileItem
            key={`${file.name}-${file.size}-${index}`}
            file={file}
            onRemove={() => onRemove(index)}
            disabled={disabled}
            isUploaded={isUploadedList}
          />
        ))}
      </ul>
    </div>
  );
};

export default FileList;
