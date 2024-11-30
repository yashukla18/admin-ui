import { useD2CPurchaseStore } from '@stores/useD2CPurchaseStore';
import { useRef } from 'react';
import { notify } from '@stores/notifyStore';
import { commonService } from '@services';
import { d2cPurchaseListResponse } from '@interfaces/d2c';
import { returnPresentKeyVals } from '@utils/returnPresentKeyVals';
import { D2CFilters, D2CPurchaseListRequestFilter } from '../interfaces/d2cPurchaseTable.types';

const useD2C = () => {
  const setD2CList = useD2CPurchaseStore((state) => state.setD2CList);
  const setFilters = useD2CPurchaseStore((state) => state.setFilters);
  const setPagination = useD2CPurchaseStore((state) => state.setPagination);
  const setLoading = useD2CPurchaseStore((state) => state.setLoading);
  const resetD2CPurchaseStore = useD2CPurchaseStore((state) => state.resetD2CPurchaseStore);
  const { purchaseStatus, redemptionStatus, searchText } = useD2CPurchaseStore((state) => state.filters);
  const { limit, total } = useD2CPurchaseStore((state) => state.pagination);
  const newSkipRef = useRef<number>(0);

  // Request
  const getD2CPurchaseList = async (params: D2CPurchaseListRequestFilter) => {
    try {
      setLoading(true);

      const sanitizedParams = returnPresentKeyVals(params) as D2CPurchaseListRequestFilter;
      const response = await commonService.fetchData<unknown, d2cPurchaseListResponse>({
        params: { ...sanitizedParams, ...{ limit } },
        url: '/admin/licenses/d2c',
        method: 'get',
      });

      const { items, total } = response.data;

      setD2CList({ items: items || [], total });
      setPagination({ total, skip: params.skip, limit });
      setFilters({
        purchaseStatus: params?.purchaseStatus ?? null,
        redemptionStatus: params?.redemptionStatus ?? null,
        searchText: params?.searchText ?? '',
      });
    } catch (e) {
      notify({
        message: 'There was an error in loading D2C',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetAndFetch = (params: D2CPurchaseListRequestFilter) => {
    resetD2CPurchaseStore();
    newSkipRef.current = 0;
    void getD2CPurchaseList(params);
  };

  const handlePage = async () => {
    const newSkip = newSkipRef.current + limit;

    if (!total) return;
    newSkipRef.current = newSkip;
    await getD2CPurchaseList({
      skip: newSkip,
      limit,
      purchaseStatus: purchaseStatus!,
      redemptionStatus: redemptionStatus!,
      searchText,
    });
  };

  const onSearch = async (query?: string) => {
    resetAndFetch({
      skip: 0,
      searchText: query,
      purchaseStatus: purchaseStatus!,
      redemptionStatus: redemptionStatus!,
    });
  };

  const applyD2CRequestFilters = (filters: D2CFilters) => {
    resetAndFetch({
      skip: 0,
      searchText,
      purchaseStatus: filters?.purchaseStatus ?? purchaseStatus!,
      redemptionStatus: filters?.redemptionStatus ?? redemptionStatus!,
    });
  };

  const resetFilter = (filter: string) => {
    resetAndFetch({
      skip: 0,
      searchText,
      purchaseStatus: (filter === 'purchaseStatus' ? null : purchaseStatus)!,
      redemptionStatus: (filter === 'redemptionStatus' ? null : redemptionStatus)!,
    });
  };

  return {
    resetFilter,
    onSearch,
    applyD2CRequestFilters,
    handlePage,
  };
};

export default useD2C;
