import { useState } from 'react';
import { useNotifyStore } from '@stores/notifyStore';
import { useOrgListStore } from '@stores/orgListStore';
import { apiGenerateSignedUrl, bulkInviteValidate } from '@features/organizations/services/organizations-service';
import { validateCsvData } from '@utils/csvUtils';
import { uploadFileToS3 } from '@services';
import { TenantDocument } from '@youscience/user-service-common';
import { convertCSVToBulkInvitations } from '@utils/csvUtils/csvUtils';
import { ValidationError } from '@features/invitations/BulkInvite/ErrorDialog';

export const useBulkInvitation = () => {
  const notify = useNotifyStore((state) => state.notify);
  const { resetOrgListStore } = useOrgListStore((state) => state);
  const resetTenantId = useOrgListStore((state) => state.resetTenantId);

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ validationErrors: ValidationError[]; generalizedError: string }>({
    validationErrors: [],
    generalizedError: '',
  });

  const notifyError = (message: string) => {
    notify({ severity: 'error', message });
  };

  const sendBulkInvitation = async (file: File, selectedOrg: TenantDocument) => {
    try {
      setLoading(true);

      const fileReader = new FileReader();
      const csvDataForUpload = await new Promise<string>((resolve, reject) => {
        fileReader.onload = (event) => resolve(event?.target?.result as string);
        fileReader.onerror = (error) => reject(error);
        fileReader.readAsText(file);
      });

      if (!csvDataForUpload) {
        notifyError(`Error while parsing the file: ${file.name}, Please try again`);
        return;
      }
      const validationInfo = validateCsvData(csvDataForUpload);

      const { isInvalidHeader, processedCsvString } = validationInfo;

      if (isInvalidHeader) {
        notifyError(`Invalid file ${file.name}, Please use the provided template and upload again`);
        return;
      }

      const bulkInvitations = convertCSVToBulkInvitations(processedCsvString, selectedOrg.tenantId);

      const result = await bulkInviteValidate(bulkInvitations);

      const { isValid, validationErrors, generalizedError } = result.data;

      if (!isValid) {
        const errors = {
          validationErrors: validationErrors ?? [],
          generalizedError: generalizedError ?? '',
        };

        setErrors(errors);

        const errorMessage = generalizedError
          ? `${generalizedError}`
          : 'Validation errors detected. Please fix them and upload again';

        notifyError(errorMessage);
        return;
      }

      const blob = new Blob([processedCsvString], { type: 'text/csv' });

      const processedCsvFile = new File([blob], `${Date.now().toString()}.csv`, { type: 'text/csv' });

      const res = await apiGenerateSignedUrl(
        {
          contentType: processedCsvFile.type,
          fileName: processedCsvFile.name,
        },
        selectedOrg.tenantId ?? '',
      );

      await uploadFileToS3(res?.data?.url, processedCsvFile);

      resetTenantId();
      resetOrgListStore();

      setIsSuccess(true);
    } catch (error) {
      notifyError(`Upload failed for file: ${file.name}, Please try again`);
    } finally {
      setLoading(false);
    }
  };

  return { loading, isSuccess, sendBulkInvitation, errors };
};
