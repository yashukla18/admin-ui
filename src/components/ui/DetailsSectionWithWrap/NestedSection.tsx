/* eslint-disable no-nested-ternary */
import { CoreBox, CoreTypography } from '@youscience/core';
import { FC, useId } from 'react';

export const NestedSection: FC<{ detail: unknown }> = ({ detail }) => {
  const id = useId();

  return (
    <CoreBox key={id}>
      {Array.isArray(detail) ? (
        detail?.map((item: string) => <CoreTypography key={item}>{item || '--'}</CoreTypography>)
      ) : (
        <CoreTypography>{(detail as string) || '--'}</CoreTypography>
      )}
    </CoreBox>
  );
};
