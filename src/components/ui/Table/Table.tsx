/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import { MouseEvent } from 'react';
import { Row, useTable } from 'react-table';
import {
  CircularProgress,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { CoreBox } from '@youscience/core';
import { brightpathTheme as theme } from '@youscience/theme';
import { SORT_OPTIONS } from './constants';
import { StyledHeaderCell, StyledLoader, StyledTableContainer, sxStyles } from './Table.styles';
import { CoreTableProps } from './interfaces';

interface ClickableCoreTableProps<C extends object> extends Omit<CoreTableProps<C>, 'onRowClick'> {
  onRowClick?: (data: Row<C>, e?: MouseEvent<HTMLTableRowElement>) => void;
}

export const CoreTable = <C extends object>({
  columns,
  data,
  disabledColumnsSort = [],
  emptyView,
  isDisableSort,
  isLoading,
  minHeight = 439,
  numberOfLoadingRows = 10,
  onRowClick = (data: Row<C>, e?: MouseEvent<HTMLTableRowElement>) => {},
  onSort,
  onScroll,
  pagination,
  showLoadingSpinner = false,
  showHeaderCellDivider = true,
  sortOption,
  stickyHeader = true,
  toolbar,
  containerRef,
  ...rest
}: ClickableCoreTableProps<C>) => {
  const { getTableBodyProps, headerGroups, rows, prepareRow } = useTable<C>({
    columns,
    data,
  });

  const hasData = data?.length > 0;

  return (
    <StyledTableContainer
      ref={containerRef}
      onScroll={onScroll}
      hasPagination={!!pagination}
      sx={{ minHeight, paddingBottom: '3%' }}
    >
      <CoreBox>
        {toolbar}
        <Table stickyHeader={stickyHeader} {...rest}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow
                {...headerGroup.getHeaderGroupProps({ style: { pointerEvents: hasData ? 'all' : 'none' } })}
                sx={sxStyles.headCell}
              >
                {headerGroup.headers.map((headCell) => {
                  const headersProps = {
                    ...headCell.getHeaderProps(),
                  };

                  if (!sortOption || disabledColumnsSort.includes(headCell.id)) {
                    return (
                      <StyledHeaderCell
                        align='left'
                        {...headersProps}
                        sx={{
                          width: headCell.width,
                          minWidth: headCell.minWidth,
                          maxWidth: headCell.maxWidth,
                          borderBottom: showHeaderCellDivider ? `1px solid ${theme.palette.divider}` : 'none',
                        }}
                      >
                        {headCell.render('Header')}
                      </StyledHeaderCell>
                    );
                  }

                  const { order, orderBy } = sortOption;
                  const isOrderBy = orderBy === headCell.id;

                  const handleHeadCellClick = () => {
                    if (onSort) {
                      onSort({
                        orderBy: headCell.id,
                        order: isOrderBy && order === SORT_OPTIONS.ASC ? SORT_OPTIONS.DESC : SORT_OPTIONS.ASC,
                      });
                    }
                  };

                  if (!sortOption || disabledColumnsSort.includes(headCell.id)) {
                    return (
                      <StyledHeaderCell align='left' {...headersProps}>
                        {headCell.render('Header')}
                      </StyledHeaderCell>
                    );
                  }

                  return (
                    <TableCell
                      {...headersProps}
                      sortDirection={isOrderBy === true ? order : false}
                      sx={{
                        ...sxStyles.headCell,
                        minWidth: headCell.minWidth,
                        maxWidth: headCell.maxWidth,
                        width: headCell.width,
                        borderBottom: showHeaderCellDivider ? `1px solid ${theme.palette.divider}` : 'none',
                      }}
                    >
                      <TableSortLabel
                        active={isOrderBy}
                        direction={isOrderBy ? order : SORT_OPTIONS.ASC}
                        onClick={handleHeadCellClick}
                        disabled={!hasData || isDisableSort}
                      >
                        {headCell.render('Header')}
                      </TableSortLabel>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);

              const handleClickRow = (e?: MouseEvent<HTMLTableRowElement>) => {
                if (onRowClick) {
                  onRowClick(row, e);
                }
              };

              return (
                <TableRow sx={sxStyles.tableRow} {...row.getRowProps()} onClick={handleClickRow}>
                  {row.cells.map((cell) => {
                    return (
                      <TableCell
                        {...cell.getCellProps()}
                        sx={{
                          maxWidth: cell.column.maxWidth,
                          minWidth: cell.column.minWidth,
                          width: cell.column.width,
                          borderBottom: showHeaderCellDivider ? `1px solid ${theme.palette.divider}` : 'none',
                        }}
                      >
                        {cell.render('Cell')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}

            {emptyView && !hasData && !isLoading ? (
              <TableRow>
                <TableCell aria-label='Empty data' sx={sxStyles.emptyCellView} colSpan={columns.length}>
                  {emptyView}
                </TableCell>
              </TableRow>
            ) : null}

            {isLoading && showLoadingSpinner ? (
              <TableRow>
                <TableCell aria-label='Loading' sx={sxStyles.loaderCell} colSpan={columns.length}>
                  <StyledLoader minHeight={minHeight}>
                    <CircularProgress size={60} thickness={2} disableShrink />
                  </StyledLoader>
                </TableCell>
              </TableRow>
            ) : null}

            {isLoading && !showLoadingSpinner
              ? Array.from(new Array(numberOfLoadingRows)).map((row, i) => (
                  <TableRow key={`loading-row${i}`} sx={sxStyles.tableRow}>
                    {Array.from(new Array(columns.length)).map((cell, i) => (
                      <TableCell aria-label='Loading' key={`loading-cell${i}`}>
                        <Skeleton />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CoreBox>
    </StyledTableContainer>
  );
};
