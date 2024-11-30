import { Column } from 'react-table';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { CoreTable } from '@components/ui/Table';
import { CoreDialog, CoreDialogContent, CoreDialogTitle, CoreTypography } from '@youscience/core';

export interface ValidationError {
  line: number;
  message: string;
}

interface ErrorDialogProps {
  open: boolean;
  onClose: () => void;
  validationErrors: ValidationError[];
}

const ERROR_LIST_COLUMNS: Column<ValidationError>[] = [
  {
    Header: 'Line',
    width: 'none',
    Cell: ({ row }) => <CoreTypography fontWeight={400}>{row.original.line + 1 || '--'}</CoreTypography>,
  },
  {
    Header: 'Message',
    width: 'max-width',
    Cell: ({ row }) => <CoreTypography color='error'>{row.original.message || '--'}</CoreTypography>,
  },
];

export const ErrorDialog = ({ open, onClose, validationErrors }: ErrorDialogProps) => {
  return (
    <CoreDialog open={open} onClose={onClose}>
      <CoreDialogTitle>
        Error in Bulk Invitation
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </CoreDialogTitle>
      <CoreDialogContent sx={{ maxHeight: '600px', overflowY: 'auto' }}>
        <CoreTable columns={ERROR_LIST_COLUMNS} data={validationErrors} minHeight={100} key='_id' />
      </CoreDialogContent>
    </CoreDialog>
  );
};
