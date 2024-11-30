import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BaseService } from './base.service';

export class CommonService extends BaseService {
  public fetchData<T, Y>(param: AxiosRequestConfig<T>) {
    return new Promise<AxiosResponse<Y, unknown>>((resolve, reject) => {
      this.api(param)
        .then((response) => {
          resolve(response);
        })
        .catch((errors) => {
          reject(errors);
        });
    });
  }
}

export const commonService = new CommonService();
