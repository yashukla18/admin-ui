// import { getCurrentAccess } from '@stores/authStore';
import * as authStore from '@stores/authStore';
import {
  EMPLOYER_ADMIN_FILTER_BY_ROLE,
  ORG_ADMIN_FILTER_BY_ROLE,
  ORG_ADMIN_ROLE_CONTROLS,
  ROOT_ADMIN_FILTER_BY_ROLE,
  ROOT_ADMIN_ROLE_CONTROLS,
} from '@constants/accesses';
import { availableAccessByRole } from '../getAvailableAccessByRole';

describe('getAvailableAccessByRole', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return the correct access roles for Admin', () => {
    vi.spyOn(authStore, 'getCurrentAccess').mockImplementationOnce(() => ({
      role: 'Admin',
      tenantClassification: '',
      tenantId: import.meta.env.VITE_ROOT_ORG_ID,
      accessDocumentId: '123',
      userId: '123',
    }));

    const result = availableAccessByRole();

    expect(result).toEqual(ROOT_ADMIN_ROLE_CONTROLS);
  });

  it('should remove Learner role for Admin when removeLearners is true', () => {
    vi.spyOn(authStore, 'getCurrentAccess').mockImplementationOnce(() => ({
      role: 'Admin',
      tenantClassification: '',
      tenantId: import.meta.env.VITE_ROOT_ORG_ID,
      accessDocumentId: '123',
      userId: '123',
    }));

    const result = availableAccessByRole(true);

    expect(result).toEqual(ROOT_ADMIN_FILTER_BY_ROLE);
  });

  it('should show all roles if classification is employer but is a root admin', () => {
    vi.spyOn(authStore, 'getCurrentAccess').mockImplementationOnce(() => ({
      role: 'Admin',
      tenantClassification: 'employer',
      tenantId: import.meta.env.VITE_ROOT_ORG_ID,
      accessDocumentId: '123',
      userId: '123',
    }));

    const result = availableAccessByRole();

    expect(result).toEqual(ROOT_ADMIN_ROLE_CONTROLS);
  });

  it('should show all roles except Learners if classification is employer, a root admin and passed removeLearner param', () => {
    vi.spyOn(authStore, 'getCurrentAccess').mockImplementationOnce(() => ({
      role: 'Admin',
      tenantClassification: 'employer',
      tenantId: import.meta.env.VITE_ROOT_ORG_ID,
      accessDocumentId: '123',
      userId: '123',
    }));

    const result = availableAccessByRole(true);

    expect(result).toEqual(ROOT_ADMIN_FILTER_BY_ROLE);
  });

  it('should all roles for Org Admins', () => {
    vi.spyOn(authStore, 'getCurrentAccess').mockImplementationOnce(() => ({
      role: 'Admin',
      tenantClassification: '',
      tenantId: '34',
      accessDocumentId: '123',
      userId: '123',
    }));

    const result = availableAccessByRole();

    expect(result).toEqual(ORG_ADMIN_ROLE_CONTROLS);
  });

  it('should remove Learner role for Org Admins', () => {
    vi.spyOn(authStore, 'getCurrentAccess').mockImplementationOnce(() => ({
      role: 'Admin',
      tenantClassification: '',
      tenantId: '34',
      accessDocumentId: '123',
      userId: '123',
    }));

    const result = availableAccessByRole(true);

    expect(result).toEqual(ORG_ADMIN_FILTER_BY_ROLE);
  });

  it('should only show Admin, Staff and Learner roles for Employer Admins', () => {
    vi.spyOn(authStore, 'getCurrentAccess').mockImplementationOnce(() => ({
      role: 'Admin',
      tenantClassification: 'employer',
      tenantId: '34',
      accessDocumentId: '123',
      userId: '123',
    }));

    const result = availableAccessByRole();

    expect(result).toEqual(EMPLOYER_ADMIN_FILTER_BY_ROLE);
  });

  it('should only show Admin, Staff Employer Admins with removeLearner param', () => {
    vi.spyOn(authStore, 'getCurrentAccess').mockImplementationOnce(() => ({
      role: 'Admin',
      tenantClassification: 'employer',
      tenantId: '34',
      accessDocumentId: '123',
      userId: '123',
    }));

    const result = availableAccessByRole(true);

    expect(result).toEqual(['Admin', 'Staff']);
  });

  it('should all roles except Admin & Staff for Staff role', () => {
    vi.spyOn(authStore, 'getCurrentAccess').mockImplementationOnce(() => ({
      role: 'Staff',
      tenantClassification: '',
      tenantId: '34',
      accessDocumentId: '123',
      userId: '123',
    }));

    const result = availableAccessByRole();

    expect(result).toEqual(['Author', 'Learner', 'Proctor', 'Reviewer']);
  });

  it('should only show Author, Proctor and Reviewer roles Staff role with removeLearner', () => {
    vi.spyOn(authStore, 'getCurrentAccess').mockImplementationOnce(() => ({
      role: 'Staff',
      tenantClassification: '',
      tenantId: '34',
      accessDocumentId: '123',
      userId: '123',
    }));

    const result = availableAccessByRole(true);

    expect(result).toEqual(['Author', 'Proctor', 'Reviewer']);
  });

  it('should only show Staff and Learner Role for Employer Staff', () => {
    vi.spyOn(authStore, 'getCurrentAccess').mockImplementationOnce(() => ({
      role: 'Staff',
      tenantClassification: 'employer',
      tenantId: '34',
      accessDocumentId: '123',
      userId: '123',
    }));

    const result = availableAccessByRole();

    expect(result).toEqual(['Staff', 'Learner']);
  });

  it('should only show Staff Role for Employer Staff with removeLearner param', () => {
    vi.spyOn(authStore, 'getCurrentAccess').mockImplementationOnce(() => ({
      role: 'Staff',
      tenantClassification: 'employer',
      tenantId: '34',
      accessDocumentId: '123',
      userId: '123',
    }));

    const result = availableAccessByRole(true);

    expect(result).toEqual(['Staff']);
  });
});
