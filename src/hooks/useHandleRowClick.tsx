import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export const useHandleRowClick = () => {
  const navigate = useNavigate();

  const handleRowClick = (
    id: string,
    entityType: 'user' | 'organization' | 'd2c',
    event?: MouseEvent<HTMLTableRowElement>,
  ) => {
    if (entityType === 'd2c') return;

    const redirectUrl = entityType === 'user' ? `/users/${id}` : `/organizations/${id}`;

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const ctrlClickUrl = event?.metaKey || event?.ctrlKey ? redirectUrl : null;

    if (ctrlClickUrl) {
      if (event?.shiftKey) {
        setTimeout(() => {
          window.open(ctrlClickUrl, '_blank');
        }, 1);
        return;
      }

      window.open(ctrlClickUrl, '_blank');
    } else {
      navigate(redirectUrl);
    }
  };

  return handleRowClick;
};
