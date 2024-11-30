import { D2cPurchaseStatus, D2cRedemptionStatus } from '@youscience/user-service-common';

export const D2C_PURCHASE_STATUS_LABELS: { label: string; value: D2cPurchaseStatus }[] = [
  { label: 'Completed', value: 'complete' },
  { label: 'Refunded', value: 'refunded' },
  { label: 'Internal', value: 'internal' },
];

export const D2C_INVITE_STATUS_LABELS: { label: string; value: D2cRedemptionStatus }[] = [
  { label: 'Accepted', value: 'redeemed' },
  { label: 'Pending', value: 'pending' },
  { label: 'N/A', value: 'na' },
];
