import { CoreBox, CoreButton } from '@youscience/core';
import { Link } from 'react-router-dom';
import { envWindowReplaceCallback } from '@utils/envWindowReplaceCallback';
import { FC } from 'react';
import { useImpersonation } from '@hooks/useImpersonation';

export const ErrorPageButtons: FC<{ homePageLink: string; impersonating: boolean }> = ({
  homePageLink,
  impersonating = false,
}) => {
  const { removeImpersonation } = useImpersonation();

  if (impersonating) {
    return (
      <CoreBox>
        <CoreButton color='secondary' onClick={removeImpersonation} size='large' sx={{ mr: 2 }} variant='outlined'>
          Stop impersonating
        </CoreButton>
        <CoreButton
          color='secondary'
          component={impersonating ? Link : 'button'}
          onClick={impersonating ? () => envWindowReplaceCallback('https://brightpath.youscience.com/home') : undefined}
          size='large'
          to='/'
        >
          Go to user's homepage
        </CoreButton>
      </CoreBox>
    );
  }

  return homePageLink.includes('http') ? (
    <CoreButton color='secondary' onClick={() => envWindowReplaceCallback(homePageLink)} size='large'>
      Take me home
    </CoreButton>
  ) : (
    <CoreButton color='secondary' component={Link} to={homePageLink} size='large'>
      Take me home
    </CoreButton>
  );
};
