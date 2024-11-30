import { notify } from '@stores/notifyStore';

const forceCopy = (text: string) => {
  const tempTextArea = document.createElement('textarea');

  tempTextArea.value = text;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);
};

export const copyTextToClipboard = async (
  text: string,
  condition = true,
  successMessage = 'Link copied',
  failureMessage = 'Failed to copy link',
) => {
  if (!condition) return;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // eslint-disable-next-line no-console
      console.warn('Clipboard is not supported');
      forceCopy(text);
    }
    notify({
      message: successMessage,
      severity: 'success',
    });
  } catch (error) {
    notify({
      message: failureMessage,
      severity: 'error',
    });
  }
};
