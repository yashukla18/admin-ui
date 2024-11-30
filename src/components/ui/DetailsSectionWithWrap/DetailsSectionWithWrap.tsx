import { Fragment, ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';
import { CoreBox, CoreTypography } from '@youscience/core';
import { NestedSection } from './NestedSection';

export type DetailsObject = Record<string, ReactNode>;

export interface DetailsSectionWithWrapProps {
  containerSx?: SxProps<Theme>;
  details: DetailsObject;
  title?: string;
}

export const DetailsSectionWithWrap = ({ containerSx, details, title }: DetailsSectionWithWrapProps) => {
  const headers = {
    ...{ containerSx },
    ...{ minWidth: 'min-content', fontWeight: 600 },
  };

  return (
    <CoreBox sx={containerSx}>
      {title ? (
        <CoreTypography variant='subtitle2' sx={{ mb: '24px' }}>
          {title}
        </CoreTypography>
      ) : null}
      <CoreBox
        sx={{
          display: 'grid',
          gap: 1,
          gridTemplateColumns: '200px auto',
          overflowWrap: 'anywhere',
        }}
      >
        {Object.keys(details).map((detail: string) =>
          detail ? (
            <Fragment key={detail}>
              <CoreTypography sx={headers}>
                {`${detail
                  .split(/(?=[A-Z])/)
                  .map((item: string) => item[0].toUpperCase() + item.slice(1, item.length + 1).toLowerCase())
                  .join(' ')}:`}
              </CoreTypography>
              <NestedSection detail={details[detail]} />
            </Fragment>
          ) : null,
        )}
      </CoreBox>
    </CoreBox>
  );
};

export default DetailsSectionWithWrap;
