import { useEffect, useRef, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { useNotifyStore } from '@stores/notifyStore';

const useScrollHandler = (handlePage: () => Promise<void>) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const previousScrollTopRef = useRef(0);
  const notify = useNotifyStore((state) => state.notify);

  const handleScroll = useCallback(
    debounce(async (): Promise<void> => {
      if (!tableRef.current) return;

      const table = tableRef.current;

      const distanceToBottom = table.scrollHeight - table.scrollTop - table.clientHeight;
      const inchesBeforeEnd = 100;
      const isScrollingDownward = table.scrollTop > previousScrollTopRef.current;

      previousScrollTopRef.current = table.scrollTop;

      if (isScrollingDownward && distanceToBottom <= inchesBeforeEnd) {
        try {
          await handlePage();
        } catch (error) {
          notify({ message: 'There was an error loading data', severity: 'error' });
        }
      }
    }, 200),
    [handlePage],
  );

  useEffect(() => {
    const table = tableRef.current;

    if (table) {
      table.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (table) {
        table.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  return { tableRef, handleScroll };
};

export default useScrollHandler;
