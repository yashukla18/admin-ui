/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FC } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { CoreBox } from '@youscience/core';
import { COMMON_COLORS } from '@constants/theme';
import { CoreDataGridProps } from './CoreDataGrid.types';

// TODO: need to memoize this component
export const CoreDataGrid: FC<CoreDataGridProps> = ({ containerHeight = 400, ...rest }) => {
  return (
    <CoreBox sx={{ height: containerHeight, width: '100%' }}>
      <DataGrid
        {...rest}
        sx={{
          border: 'none',
          '.MuiDataGrid-cell ': {
            border: 'none',
            p: 0,
          },
          borderRadius: '0.5rem',
          '.MuiDataGrid-row': {
            borderColor: 'transparent',
            color: 'info.main',
            cursor: 'pointer',
            textDecoration: 'underline',
            typography: 'body1',
            '&:hover': {
              backgroundColor: `${COMMON_COLORS.primaryHoverColor}`,
              cursor: 'pointer',
            },
            '&:nth-of-type(odd)': {
              backgroundColor: 'action.disabledBackground',
              '&:hover': {
                backgroundColor: `${COMMON_COLORS.primaryHoverColor}`,
                cursor: 'pointer',
              },
            },
          },
          '.MuiTablePagination-input': {
            '.MuiSvgIcon-root': {
              color: 'primary.main',
            },
          },
          '.MuiTablePagination-actions': {
            button: {
              color: 'primary.main',
              ':disabled': {
                color: 'action.disabled',
              },
            },
          },
        }}
      />
    </CoreBox>
  );
};
