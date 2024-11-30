import { AccessDocument } from '@youscience/user-service-common';
import { UseFormReturn } from 'react-hook-form';

export interface AssociatedOrgSchema {
  fullName: string;
  tenantId: string;
  studentId?: string;
  userId?: string;
  emailAddress?: string;
  role: string;
  emailInvite: boolean;
  dateOfBirth?: string | null | Date;
}

export interface AssociatedOrgFormProps {
  methods: UseFormReturn<AssociatedOrgSchema>;
  userName: string;
  userId?: string;
  emailAddress?: string;
  dateOfBirth?: string | null | Date;
  displayHeader?: boolean;
}

export interface AssociatedOrgsProps {
  access: AccessDocument[];
  userName: string;
  emailAddress?: string;
  dateOfBirth?: string | null | Date;
}
