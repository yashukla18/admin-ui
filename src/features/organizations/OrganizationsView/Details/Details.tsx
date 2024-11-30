/* eslint-disable react/no-array-index-key */
import { FC, Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CoreBox, CoreButton, CoreTypography } from '@youscience/core';
import { TenantDocument, SsoSettings } from '@youscience/user-service-common';
// Components
import { DetailsCard } from '@components/ui/DetailsCard';
import ConditionWrapper from '@components/ui/ConditionWrapper';
import DetailsSectionWithWrap from '@components/ui/DetailsSectionWithWrap';
import { useIsAdmin } from '@hooks/useIsAdmin';
import { formatOrgData } from './formatOrgData';
import { sxStyles } from './Details.styles';

export const Details: FC<{ organization: TenantDocument }> = ({ organization }) => {
  const { filteredAddresses, filteredPhones, newOrganization, deepPath, uniqueId } = formatOrgData(organization);

  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { isRootAdmin, rootTenantId } = useIsAdmin();
  const handleEdit = () => {
    navigate(`../edit/${id}`);
  };

  const isRootOrg = organization?.tenantId === rootTenantId;

  return (
    <DetailsCard
      containerStyles={{ mt: 3 }}
      title='Organization details'
      titleAdornment={
        <ConditionWrapper condition={isRootAdmin && !isRootOrg}>
          <CoreButton color='secondary' onClick={handleEdit}>
            Edit
          </CoreButton>
        </ConditionWrapper>
      }
    >
      <DetailsSectionWithWrap containerSx={{ marginBottom: 4 }} details={newOrganization} />

      <ConditionWrapper condition={!!Object.keys(uniqueId).length}>
        <CoreBox sx={sxStyles.multipleFieldsWrapper}>
          <CoreBox>
            <DetailsSectionWithWrap containerSx={{ textTransform: 'uppercase' }} details={uniqueId} />
          </CoreBox>
        </CoreBox>
      </ConditionWrapper>

      <ConditionWrapper condition={Boolean(filteredAddresses?.length)}>
        <CoreBox sx={sxStyles.multipleFieldsWrapper}>
          {filteredAddresses?.map((address, i) => (
            <CoreBox key={`address-${i}`}>
              <DetailsSectionWithWrap containerSx={{ mt: 0 }} details={address} />
            </CoreBox>
          ))}
        </CoreBox>
      </ConditionWrapper>

      <ConditionWrapper condition={Boolean(filteredPhones?.length)}>
        <CoreBox sx={sxStyles.multipleFieldsWrapper}>
          {filteredPhones?.map((phone, i) => (
            <CoreBox key={`phone-${i}`}>
              <CoreTypography sx={{ ...sxStyles.title, mt: 4 }}>
                Phone {filteredPhones.length > 1 ? i + 1 : null}:
              </CoreTypography>

              <DetailsSectionWithWrap containerSx={{ mt: -4 }} details={phone} />
            </CoreBox>
          ))}
        </CoreBox>
      </ConditionWrapper>

      <ConditionWrapper condition={deepPath?.length > 1}>
        <CoreBox sx={sxStyles.wrapper}>
          <CoreTypography sx={sxStyles.title}>Parent Tenants:</CoreTypography>
          <CoreBox>
            {deepPath?.length
              ? deepPath?.map((parent, i) =>
                  parent?.tenantId !== import.meta.env.VITE_ROOT_ORG_ID ? (
                    <CoreTypography key={`${parent.name}-${i}`} sx={{ minWidth: 'min-content' }}>
                      <Link to={`/organizations/${parent.tenantId}`}>{parent.name}</Link>
                    </CoreTypography>
                  ) : null,
                )
              : '--'}
          </CoreBox>
        </CoreBox>
      </ConditionWrapper>
    </DetailsCard>
  );
};
