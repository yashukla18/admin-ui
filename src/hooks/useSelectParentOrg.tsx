import { fetchTenantById } from '@features/organizations/services/organizations-service';
import { notify } from '@stores/notifyStore';
import { useEffect, useState } from 'react';

export interface SelectParentOrgHookProps {
  currentOrgId: string;
  errors: boolean;
  setParentLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentDirectParentRef: string;
}
const useSelectParentOrg = ({
  currentOrgId,
  errors,
  setParentLoading,
  currentDirectParentRef,
}: SelectParentOrgHookProps) => {
  const [updatedPath, setUpdatedPath] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const rootParent = import.meta.env.VITE_ROOT_ORG_ID;
  const [pathError, setPathError] = useState<boolean>(false);

  const resettingPath = (resetCallback?: () => void) => {
    setIsError(errors);
    setParentLoading(false);
    setUpdatedPath('');
    resetCallback?.();
  };

  const checkIfOrgExists = (parentId: string) => {
    if (parentId === rootParent) return false;
    if (currentOrgId === parentId) {
      setIsError(true);
      setParentLoading(false);
      return true;
    }
    return false;
  };

  const getNewParentPath = async (parentId: string) => {
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(parentId)) {
      setParentLoading(true);
      setPathError(false);
      if (parentId === rootParent) {
        setUpdatedPath(`,${rootParent},`);
        setParentLoading(false);
        setIsError(false);
      } else {
        const tenant = await fetchTenantById(parentId);
        const parentPath = tenant?.data?.path;

        if (parentPath) {
          setUpdatedPath(`${parentPath}${parentId},`);
          setIsError(false);
        }
      }
      setParentLoading(false);
    } else if (parentId !== currentDirectParentRef) {
      setUpdatedPath('');
      setPathError(true);
    }
  };

  const setPathIfNewParent = (parentId: string) => {
    if (checkIfOrgExists(parentId)) {
      notify({ message: 'You can not make this organization as it parent organization', severity: 'error' });
    } else {
      void getNewParentPath(parentId);
    }
  };

  useEffect(() => {
    if (errors) resettingPath();
  }, [errors]);
  return { updatedPath, isError, setIsError, setPathIfNewParent, resettingPath, pathError };
};

export default useSelectParentOrg;
