import { SxProps, Theme } from '@mui/system';

export const DEFAULT_FILE_ACCEPTS = '.csv';
export const DEFAULT_FILE_SIZE = 10;

export interface CoreDragAndDropProps {
  acceptedFileTypes?: string;
  disableSubmit?: boolean;
  imageSizeLimitMB?: number;
  subtitleNode?: React.ReactNode;
  customButton?: React.ReactNode;
  sx?: SxProps<Theme>;
  onSubmit: (files: File[]) => void;
}
