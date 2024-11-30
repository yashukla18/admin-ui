import { useAuthStore } from '@stores/authStore';
import { useNotifyStore } from '@stores/notifyStore';
import { waitFor } from '@testing-library/react';
import { copyTextToClipboard } from '@utils/copyText';

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
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn(),
    },
    writable: true,
  });

  Object.defineProperty(window, 'isSecureContext', { value: true });

  vi.clearAllMocks();
});

describe('copyTextToClipboard', () => {
  it('should copy text to clipboard successfully', async () => {
    const text = 'test text';
    const successMessage = 'Link copied';

    await copyTextToClipboard(text, true, successMessage);
    await waitFor(() => expect(useNotifyStore.getState().notifications[0]?.message).toEqual(successMessage));
  });

  it('should copy text to clipboard using forceCopy when clipboard is not supported', async () => {
    const text = 'test text';

    const successMessage = 'Link copied';

    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      value: null,
    });

    document.execCommand = vi.fn();

    await copyTextToClipboard(text, true, successMessage);

    await waitFor(() => expect(useNotifyStore.getState().notifications[0]?.message).toEqual(successMessage));
  });

  it('should not copy text when condition is false', async () => {
    const text = 'test text';

    const copyToClipboardSpy = vi.spyOn(navigator.clipboard, 'writeText');

    await copyTextToClipboard(text, false);

    expect(copyToClipboardSpy).not.toHaveBeenCalled();
  });

  it('should show error message when copying text to clipboard fails', async () => {
    const text = 'test text';

    const failureMessage = 'Failed to copy link';

    Object.defineProperty(navigator.clipboard, 'writeText', {
      writable: true,
      value: () => Promise.reject(new Error('Failed to copy')),
    });

    await copyTextToClipboard(text, true, 'success', failureMessage);
    await waitFor(() => expect(useNotifyStore.getState().notifications[0]?.message).toEqual(failureMessage));
  });
});
