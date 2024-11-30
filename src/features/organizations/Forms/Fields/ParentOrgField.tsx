import OrgList from '@components/ui/OrgList';
import { OrganizationFormValues } from '@features/organizations/constants/detailsForm';
import { CoreBox } from '@youscience/core';
import { DeepPath } from '@youscience/user-service-common';
import { FC, useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import useSelectParentOrg, { SelectParentOrgHookProps } from '@hooks/useSelectParentOrg';

interface ParentOrgFieldProps {
  deepPath: DeepPath[];
  originalPath: string;
  setParentLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
export const ParentOrgField: FC<ParentOrgFieldProps> = ({ deepPath, originalPath, setParentLoading }) => {
  const { id = '' } = useParams();
  const havingParent = Boolean(originalPath?.split(',')?.filter((item) => item !== '')?.length);
  const currentDirectParent = havingParent ? deepPath?.[(deepPath?.length ?? 0) - 1]?.name : '';
  const [parentId, setParentId] = useState<string>(currentDirectParent);

  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<OrganizationFormValues>();

  useController({
    control,
    name: 'path',
    defaultValue: originalPath,
  });

  const hookProps: SelectParentOrgHookProps = {
    currentOrgId: id || '',
    errors: Boolean(errors?.path?.message),
    setParentLoading,
    currentDirectParentRef: currentDirectParent,
  };
  const { isError, updatedPath, setPathIfNewParent, resettingPath, pathError } = useSelectParentOrg(hookProps);

  const resetCallBack = () => {
    setValue('path', originalPath, { shouldDirty: true });
    setParentId('');
  };

  useEffect(() => {
    if (parentId) {
      setPathIfNewParent(parentId);
      if (pathError) {
        setValue('path', '', { shouldDirty: true });
      }
      if (updatedPath) {
        setValue('path', updatedPath, { shouldDirty: true });
      }
    } else if (parentId === '') {
      setValue('path', '', { shouldDirty: true });
    } else {
      resettingPath(resetCallBack);
    }
  }, [parentId, updatedPath, pathError]);

  return (
    <CoreBox>
      <OrgList
        error={isError}
        label='Parent organization'
        placeholder='Organization name'
        orgNameAsParentProp={currentDirectParent}
        required
        setNewPath={setParentId}
        sx={{ width: '100%' }}
        textFieldProps={{ autoFocus: true }}
      />
    </CoreBox>
  );
};
