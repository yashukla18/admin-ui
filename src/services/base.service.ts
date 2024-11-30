import { baseConfig } from '@services/config';
import { Api } from './api.service';

export class BaseService extends Api {
  constructor() {
    super(baseConfig);
  }
}
