import { CoreBox, CoreTypography } from '@youscience/core';
import { ErrorMessage, ErrorPageProps, errorMessages } from './constants';
import { sxStyles } from './ErrorPages.styles';
import { ErrorPageButtons } from './ErrorPageButtons';

export const ErrorPages = ({ errorType = 'unknown', homePageLink }: ErrorPageProps) => {
  const errorMessage: ErrorMessage = errorMessages[errorType] || errorMessages.unknown;

  return (
    <CoreBox sx={sxStyles.container}>
      {errorMessage.error ? <CoreTypography sx={sxStyles.error}>{errorMessage.error}</CoreTypography> : null}
      <CoreTypography sx={sxStyles.mainMessage}>{errorMessage.mainMessage}</CoreTypography>
      <CoreTypography sx={sxStyles.subMessage}>{errorMessage.subMessage}</CoreTypography>
      <ErrorPageButtons homePageLink={homePageLink} impersonating={errorType === 'impersonating'} />
    </CoreBox>
  );
};

export default ErrorPages;
