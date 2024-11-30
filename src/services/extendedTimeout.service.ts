import { extendedTimeoutConfig } from '@services/config';
import { Api } from './api.service';

export class ExtendedTimeoutService extends Api {
  constructor() {
    super(extendedTimeoutConfig);
  }
}
