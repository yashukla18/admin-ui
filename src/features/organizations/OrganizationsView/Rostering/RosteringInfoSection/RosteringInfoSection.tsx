import { Fragment } from 'react';
import { CoreTypography } from '@youscience/core';
import { SsoSettings } from '@youscience/user-service-common';
import { sxStyles } from '../Rostering.style';

interface RosteringInfoSectionProps {
  formattedSsoSettings: SsoSettings;
}

export const RosteringInfoSection = ({ formattedSsoSettings }: RosteringInfoSectionProps) => (
  <>
    {Object.keys(formattedSsoSettings.provider ?? {}).map((item) => (
      <Fragment key={item}>
        <CoreTypography sx={sxStyles.rosteringHeading}>
          {item === 'type' ? 'Rostering provider/SSO' : item || ''}
        </CoreTypography>

        {formattedSsoSettings.provider ? (
          <CoreTypography sx={{ mt: 2 }}>
            {formattedSsoSettings.provider !== undefined &&
            formattedSsoSettings.provider[item as keyof SsoSettings['provider']] === 'GADOE'
              ? 'Georgia DOE'
              : (formattedSsoSettings.provider !== undefined &&
                  formattedSsoSettings.provider[item as keyof SsoSettings['provider']]) ||
                ''}
          </CoreTypography>
        ) : null}
      </Fragment>
    ))}
  </>
);

export default RosteringInfoSection;
