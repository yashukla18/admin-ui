/* eslint-disable no-nested-ternary */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CoreBox, CoreTypography, CoreButton } from '@youscience/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AssociatedOrgSchema } from '@interfaces/associatedOrgs';
import { ASSOCIATED_ORG_DEFAULT_VALUES } from '@constants/associatedOrgs';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import { apiUpsertUser, apiGetUserAccess } from '@features/users/services/UserService';
import { notify } from '@stores/notifyStore';
import { CircularProgress } from '@mui/material';
import { useAccessInvitation } from '@hooks/useAccessInvitation';
import { AccessDocument } from '@youscience/user-service-common';
import { useOrgListStore } from '@stores/orgListStore';
import { isUtahOnlyAccess } from '@utils/helper';
import { sxStyles } from './UserInvite.styles';
import {
  USER_INVITE_DEFAULT_VALUES,
  USER_INVITE_VALIDATION_SCHEMA,
  USER_INVITE_VALIDATION_SCHEMA_FOR_UTAH,
  UserInviteSchema,
} from './constants';
import { AssociatedOrgs } from './Forms/AssociatedOrgsDetails';
import { UserInviteDetailsForm } from './Forms/UserDetails/UserInviteDetailsForm';
import { inviteUserFormSanitizer } from './Forms/UserDetails/inviteUserFormSanitizer';

export const UserInvite = () => {
  const navigate = useNavigate();

  const { orgList } = useOrgListStore((state) => state);
  const utahOnlyAccess = isUtahOnlyAccess(orgList);

  const [activeStep, setActiveStep] = useState<number>(0);
  const [userInvite, setUserInvite] = useState<UserInviteSchema>(USER_INVITE_DEFAULT_VALUES);
  const [loading, setLoading] = useState<boolean>(false);
  const [isNoAssociatedOrg, setIsNoAssociatedOrg] = useState<boolean>(true);
  const [associatedOrgs, setAssociatedOrgs] = useState<AccessDocument[]>([]);

  const userDetails = useForm<UserInviteSchema>({
    defaultValues: userInvite,
    resolver: zodResolver(utahOnlyAccess ? USER_INVITE_VALIDATION_SCHEMA_FOR_UTAH : USER_INVITE_VALIDATION_SCHEMA),
  });

  const orgDetails = useForm<AssociatedOrgSchema>({ defaultValues: ASSOCIATED_ORG_DEFAULT_VALUES });

  const steps = [
    {
      label: 'Enter user details',
      component: <UserInviteDetailsForm methods={userDetails} />,
    },
    {
      label: 'Enter associated organizations details',
      component: (
        <AssociatedOrgs
          methods={orgDetails}
          userName={userInvite.fullName ?? ''}
          userId={userInvite.userId}
          emailAddress={userInvite.profile.emails[0].address || ''}
          dateOfBirth={userInvite.profile.dateOfBirth ?? ''}
        />
      ),
    },
  ];

  const { sendAccessInvitation } = useAccessInvitation();

  const onSubmit = async (userData: UserInviteSchema) => {
    try {
      setLoading(true);
      const sanitizedData = inviteUserFormSanitizer(userData);
      const response = await apiUpsertUser(sanitizedData);

      // new user
      if (response.status === 201) {
        setUserInvite(response?.data);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        notify({ message: 'User created successfully', severity: 'success' });
      }

      // existing user
      if (response.status === 200) {
        const userId = response?.data?.userId ?? '';

        const isOrgAssociated = await apiGetUserAccess(userId);

        setIsNoAssociatedOrg(!isOrgAssociated?.data?.length);
        if (isOrgAssociated.data) {
          setAssociatedOrgs(isOrgAssociated.data);
        }

        setUserInvite(response?.data);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        notify({ message: 'User updated successfully', severity: 'success' });
      }
    } catch (error) {
      notify({ message: 'Error while creating the user', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const onError = () => {
    notify({ message: 'Please enter valid details', severity: 'error' });
  };

  const onContinue = () => {
    void userDetails.handleSubmit(onSubmit, onError)();
  };

  const handleUserNavigation = (userId: string) => {
    navigate(`../${userId}`);
  };

  const onFinish = async () => {
    try {
      setLoading(true);
      const associatedOrgData = orgDetails.getValues();
      const response = await sendAccessInvitation(associatedOrgData, false, isNoAssociatedOrg, associatedOrgs);

      if (response) {
        userDetails.reset();
        orgDetails.reset();
        handleUserNavigation(userInvite.userId ?? '');
      }
    } catch (error) {
      notify({ message: 'Error while adding the organization', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      void onFinish();
    } else {
      onContinue();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <CoreBox>
      <Stepper activeStep={activeStep} orientation='vertical'>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel sx={sxStyles.iconStyles}>
              <CoreTypography>{step.label}</CoreTypography>
            </StepLabel>
            <StepContent>
              {step.component}
              <CoreBox sx={{ mb: 2 }}>
                {index !== 0 && (
                  <CoreButton onClick={handleBack} color='secondary' variant='outlined' sx={sxStyles.buttonStyles}>
                    Back
                  </CoreButton>
                )}
                <CoreButton
                  type='submit'
                  onClick={handleNext}
                  variant='contained'
                  color='secondary'
                  sx={sxStyles.buttonStyles}
                  disabled={loading || !orgList.length}
                >
                  {loading ? (
                    <CircularProgress size={20} color='inherit' />
                  ) : index === steps.length - 1 ? (
                    'Finish'
                  ) : (
                    'Continue'
                  )}
                </CoreButton>
              </CoreBox>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </CoreBox>
  );
};
