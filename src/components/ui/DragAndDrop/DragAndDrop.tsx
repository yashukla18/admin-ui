import { DragEvent, useRef, useState } from 'react';
import { commonColors } from '@youscience/theme';
import { CoreBox, CoreButton, CoreTypography } from '@youscience/core';
import { Form, Input, Label, StyledFileUploadIcon, Wrapper } from './styles';
import { CoreDragAndDropProps, DEFAULT_FILE_ACCEPTS, DEFAULT_FILE_SIZE } from './dragAndDropConstants';

export const CoreDragAndDrop = ({
  acceptedFileTypes = DEFAULT_FILE_ACCEPTS,
  disableSubmit = true,
  imageSizeLimitMB = DEFAULT_FILE_SIZE,
  subtitleNode,
  customButton,
  sx,
  onSubmit,
}: CoreDragAndDropProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const handleUpload = (file: File) => {
    if (!file.name.endsWith(DEFAULT_FILE_ACCEPTS)) {
      setError('Unsupported file type. Please upload a .csv file.');
      return;
    }

    if (file.name.includes(' ')) {
      file.name.replaceAll(' ', '_');
    }

    if (file.size > imageSizeLimitMB * 1024 * 1024) {
      setError(`The file size is too big. Max file size: ${imageSizeLimitMB}MB`);
      return;
    }

    setError(null);
    setFiles([file]);
  };

  // event handlers for drag/drop and manual selection
  const handleDrag = (e: DragEvent) => {
    e.nativeEvent.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    setError(null);
    e.nativeEvent.preventDefault();
    if (!e) return;
    const uploadedFile = e.nativeEvent?.dataTransfer?.files[0]; // Only handle the first file

    if (uploadedFile) {
      setDragActive(false);
      handleUpload(uploadedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const uploadedFile = e.target.files?.[0];

    if (uploadedFile) {
      handleUpload(uploadedFile);
    }
  };

  return (
    <Wrapper sx={sx}>
      <Form
        id='form-file-upload'
        data-testid='form-file-upload-test-id'
        onSubmit={(e) => e.preventDefault()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onDragOver={handleDrop}
      >
        <Label
          data-testid='form-drag-and-drop-area-test-id'
          id='label-file-upload'
          className={dragActive ? 'drag-active' : ''}
          htmlFor='input-file-upload'
        >
          <Input
            data-testid='drag-and-drop-csv-uploader-test-id'
            id='input-file-upload'
            onChange={(e) => handleFileSelect(e)}
            type='file'
            ref={inputFileRef}
          />
          <StyledFileUploadIcon color='primary' />
          {files.length ? (
            <CoreTypography variant='body1' sx={{ pointerEvents: 'none' }}>
              {files[0].name}
            </CoreTypography>
          ) : (
            <>
              <CoreTypography variant='body1' sx={{ pointerEvents: 'none' }}>
                Click or drag file to this area to upload
              </CoreTypography>
              <CoreTypography variant='body2' align='center' color='text.disabled' sx={{ pointerEvents: 'none' }}>
                Only .csv files are accepted
              </CoreTypography>
            </>
          )}
        </Label>
      </Form>

      {subtitleNode}

      {error && (
        <CoreTypography variant='body2' color={commonColors.orange} py={5}>
          {error}
        </CoreTypography>
      )}

      <CoreBox sx={{ width: 'fit-content', marginTop: '35px' }}>
        {(files.length || error) && (
          <CoreButton
            color='error'
            variant='outlined'
            sx={{ mr: 5 }}
            onClick={() => {
              setFiles([]);
              setError(null);
              if (inputFileRef.current) inputFileRef.current.value = '';
            }}
          >
            Clear
          </CoreButton>
        )}

        {!(files.length || error) && customButton}
        <CoreButton
          color='secondary'
          disabled={files.length === 0 || disableSubmit}
          onClick={() => onSubmit(files)}
          sx={{ mr: 5 }}
        >
          Submit
        </CoreButton>
      </CoreBox>
    </Wrapper>
  );
};
