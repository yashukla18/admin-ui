/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-array-index-key */
import { CoreBox, CoreButton } from '@youscience/core';
import { UserDocument } from '@youscience/user-service-common';
import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Components
import ConditionWrapper from '@components/ui/ConditionWrapper';
import { DetailsCard } from '@components/ui/DetailsCard';
import DetailsSectionWithWrap from '@components/ui/DetailsSectionWithWrap';
import { SingleObject } from '@interfaces';
import { formatUserData } from './formatUserData';
import { sxStyles } from './Details.styles';

export const Details: FC<{ selectedUser: UserDocument }> = ({ selectedUser }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { phones, addresses, emails, details, linkedIn, race } = formatUserData(selectedUser);

  const handleEdit = () => {
    navigate(`../edit/${userId ?? ''}`);
  };

  return (
    <DetailsCard
      containerStyles={{ mt: 3 }}
      title='User details'
      titleAdornment={
        <CoreButton color='secondary' onClick={handleEdit}>
          Edit
        </CoreButton>
      }
    >
      <table style={sxStyles.table}>
        <tbody>
          <ConditionWrapper condition={Boolean(details?.length)}>
            {details.map((detail, i) => {
              if (Object.keys(detail).length > 0)
                return (
                  <tr key={`details-wrapper-${i}`}>
                    <td style={sxStyles.td}>
                      <DetailsSectionWithWrap details={detail} />
                    </td>
                  </tr>
                );
              return null;
            })}
          </ConditionWrapper>
          <ConditionWrapper condition={Boolean(emails?.length)}>
            <tr>
              {emails?.map((email: SingleObject, i: number) => (
                <td style={sxStyles.td} key={`email-${i}`}>
                  <CoreBox>
                    <DetailsSectionWithWrap details={email} />
                  </CoreBox>
                </td>
              ))}
            </tr>
          </ConditionWrapper>
          <ConditionWrapper condition={Boolean(Object.keys(linkedIn).length)}>
            <tr>
              <td style={sxStyles.td}>
                <DetailsSectionWithWrap details={linkedIn} />
              </td>
            </tr>
          </ConditionWrapper>
          <ConditionWrapper condition={Boolean(phones?.length)}>
            <tr>
              {phones?.map((phone: SingleObject, i: number) => (
                <td style={sxStyles.td} key={`phone-${i}`}>
                  <CoreBox>
                    <DetailsSectionWithWrap details={phone} />
                  </CoreBox>
                </td>
              ))}
            </tr>
          </ConditionWrapper>
          <ConditionWrapper condition={Boolean(addresses?.length)}>
            <tr>
              {addresses?.map((address: SingleObject, i: number) => (
                <td style={sxStyles.td} key={`address-${i}`}>
                  <CoreBox>
                    <DetailsSectionWithWrap details={address} />
                  </CoreBox>
                </td>
              ))}
            </tr>
          </ConditionWrapper>
          <ConditionWrapper condition={Boolean(Object.keys(race).length)}>
            <tr>
              <td style={sxStyles.td}>
                <DetailsSectionWithWrap details={race} />
              </td>
            </tr>
          </ConditionWrapper>
        </tbody>
      </table>
    </DetailsCard>
  );
};
