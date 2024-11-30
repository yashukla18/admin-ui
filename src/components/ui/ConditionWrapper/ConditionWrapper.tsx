import { FC, ReactNode } from 'react';

export const ConditionWrapper: FC<{ children: ReactNode; condition: boolean }> = ({ children, condition = false }) =>
  condition ? children : null;
