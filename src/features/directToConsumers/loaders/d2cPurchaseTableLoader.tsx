import { d2cPurchaseListResponse } from '@interfaces/d2c';
import { commonService } from '@services';
import { setD2CPurchaseCallback } from '@stores/useD2CPurchaseStore';

const CommonService = commonService;

export const loader = async () => {
  const { data } = await CommonService.fetchData<unknown, d2cPurchaseListResponse>({
    url: '/admin/licenses/d2c',
    method: 'get',
  }).catch((error) => {
    throw error;
  });

  setD2CPurchaseCallback({ items: data?.items || [], total: data?.total });
  return { items: data?.items || [], total: data?.total };
};
