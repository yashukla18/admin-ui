import { useAuthStore } from '@stores/authStore';
import { act, renderHook, waitFor } from '@utils/test-utils';
import { TEST_TENANT } from '@test/constants';
import { useNotifyStore } from '@stores/notifyStore';
import { defaultUploadFile, invalidFile, utahUploadFile } from '@features/invitations/BulkInvite/testCsvs';
import { AxiosResponse } from 'axios';
import { BulkInviteValidationResult } from '@youscience/user-service-common';
import { MockInstance } from 'vitest';
import * as TenantsServiceModule from '@features/organizations/services/organizations-service';
import * as useBulkInvitationModule from './useBulkInvitation';

describe('useBulkInvitation Tests', () => {
  let validationSpy: MockInstance;
  let apiGenerateSignedUrlSpy: MockInstance;

  beforeEach(async () => {
    useAuthStore.setState({
      authSession: {
        isAuthenticated: false,
        currentAccess: undefined,
        userData: undefined,
        userType: undefined,
      },
    });
    useNotifyStore.setState({ notifications: [], notificationInfo: undefined, clearNotifications: vi.fn() });
    useNotifyStore.getState().clearNotifications();
    validationSpy = vi.spyOn(TenantsServiceModule, 'bulkInviteValidate');
    apiGenerateSignedUrlSpy = vi.spyOn(TenantsServiceModule, 'apiGenerateSignedUrl');
    vi.clearAllMocks();
  });

  vi.mock('@services', () => ({
    uploadFileToS3: vi.fn().mockResolvedValue(true),
  }));

  it('should handle file parsing failure', async () => {
    const { result } = renderHook(() => useBulkInvitationModule.useBulkInvitation());

    const blob = new Blob(undefined);
    const file = new File([blob], 'test.csv', {
      type: 'text/csv',
    });

    await waitFor(() => expect(result.current.sendBulkInvitation(file, TEST_TENANT)));

    await waitFor(() =>
      expect(useNotifyStore.getState().notifications[0].message).toMatch(/Error while parsing the file/i),
    );
  });

  it('should handle an invalid file', async () => {
    const { result } = renderHook(() => useBulkInvitationModule.useBulkInvitation());
    const blob = new Blob([invalidFile]);
    const file = new File([blob], 'invalidFile.csv', {
      type: 'text/csv',
    });

    await waitFor(() => expect(result.current.sendBulkInvitation(file, TEST_TENANT)));

    await waitFor(() => expect(useNotifyStore.getState().notifications[0].message).toMatch(/Invalid file/i));
  });

  it('should handle validation errors', async () => {
    validationSpy.mockImplementation(() =>
      Promise.resolve({
        data: {
          isValid: false,
          validationErrors: [
            {
              line: 4,
              message:
                "Learner/Proctor can't be added to a school district. Please add Learner/Proctor to a specific school",
            },
          ],
        },
        status: 201,
        statusText: 'OK',
        headers: {},
        config: {},
      } as AxiosResponse<BulkInviteValidationResult>),
    );
    const { result } = renderHook(() => useBulkInvitationModule.useBulkInvitation());
    const blob = new Blob([defaultUploadFile]);
    const file = new File([blob], 'test.csv', {
      type: 'text/csv',
    });

    await waitFor(() => expect(result.current.sendBulkInvitation(file, TEST_TENANT)));

    await waitFor(() =>
      expect(useNotifyStore.getState().notifications[0].message).toEqual(
        'Validation errors detected. Please fix them and upload again',
      ),
    );
  });

  it('should send bulk invitation successfully', async () => {
    validationSpy.mockImplementation(() =>
      Promise.resolve({
        data: {
          isValid: true,
        },
        status: 201,
        statusText: 'OK',
        headers: {},
        config: {},
      } as AxiosResponse<BulkInviteValidationResult>),
    );
    apiGenerateSignedUrlSpy.mockImplementation(() =>
      Promise.resolve({
        data: {
          url: 'mocked-signed-url',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as AxiosResponse<{ url: string }>),
    );
    const { result } = renderHook(() => useBulkInvitationModule.useBulkInvitation());
    const blob = new Blob([utahUploadFile]);
    const file = new File([blob], 'utahUploadFile.csv', {
      type: 'text/csv',
    });

    await waitFor(() => expect(result.current.sendBulkInvitation(file, TEST_TENANT)));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
