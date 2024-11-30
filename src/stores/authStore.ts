/* eslint-disable @typescript-eslint/no-unused-vars */
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { devtools } from 'zustand/middleware';
import {
  AccessDocument,
  AccessRoleEnum,
  PreferencesRecord,
  UserDocument,
  MeWithAccessRecordsApiResponse,
} from '@youscience/user-service-common';
import { authService } from '@services/auth.api.service';
import { CurrentAccess } from '@interfaces/user';

type AuthSession<Y = AccessRoleEnum, T = boolean> = T extends true
  ? {
      currentAccess: CurrentAccess;
      impersonatedBy?: MeWithAccessRecordsApiResponse['impersonatedBy'];
      isAuthenticated: T;
      isImpersonated: boolean;
      userData: MeWithAccessRecordsApiResponse;
      userType: Y;
    }
  : {
      currentAccess?: never;
      impersonatedBy?: never;
      isAuthenticated: T;
      isImpersonated?: never;
      userData?: never;
      userType?: never;
    };

export interface AuthSessionContext {
  authSession: AuthSession;
  initializedUser: boolean;
  getMe: () => Promise<void>;
  resetAuthSession: () => void;
  setPreferences: (newPreference: string) => void;
  signIn: (param?: string, search?: string) => unknown;
  signOut: () => void;
}

const initialAuthSession: AuthSession = {
  currentAccess: undefined,
  impersonatedBy: undefined,
  isAuthenticated: false,
  userData: undefined,
  userType: undefined,
};

const initialState: AuthSessionContext = {
  authSession: { ...initialAuthSession },
  initializedUser: false,
  getMe: async () => {},
  resetAuthSession: () => {},
  setPreferences: (newPreference: string) => {},
  signIn: (param?: string, search?: string) => {},
  signOut: () => {},
};

export const useAuthStore = createWithEqualityFn<AuthSessionContext>()(
  devtools((set, get) => ({
    ...initialState,
    signIn: (pathname?: string, search?: string) => {
      window.location.replace(
        `${import.meta.env.VITE_IDENTITY_URL}?redirectUrl=${window.location.protocol}//${
          window.location.host
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        }${pathname}${search}`,
      );
    },
    signOut: () => {
      window.location.replace(
        `${import.meta.env.VITE_IDENTITY_URL}/logout?logoutRedirectUrl=${window.location.protocol}//${
          window.location.host
        }`,
      );
    },
    resetAuthSession: () => {
      set((state) => ({ ...state, authSession: initialAuthSession, initializedUser: false }));
      window.location.assign(`${window.location.protocol}//${window.location.host}/`);
    },
    setPreferences: (newPreference: string) => {
      const { authSession } = get();

      let currentAccess: CurrentAccess;
      let isAuthenticated: boolean;
      let newAuthSession: AuthSession;
      let newPreferredAccess:
        | (AccessDocument & { tenant: { classification: { type: string }; private: unknown } })
        | undefined;
      let userType: AccessRoleEnum;

      if (authSession.userData?.access.length) {
        newPreferredAccess = authSession.userData.access.find(
          (access) => (access._id as unknown as string) === newPreference,
        ) as AccessDocument & { tenant: { classification: { type: string }; private: unknown } };
      }

      if (newPreferredAccess) {
        currentAccess = {
          accessDocumentId: newPreferredAccess._id as unknown as string,
          constraintTags: newPreferredAccess?.user.grants ?? [],
          role: newPreferredAccess?.tenant?.permission?.role ?? 'Learner',
          tenantId: newPreferredAccess?.tenant.tenantId ?? '',
          tenantClassification: newPreferredAccess?.tenant?.classification?.type ?? '',
          tenantName: newPreferredAccess?.tenant.name ?? '',
          userId: newPreferredAccess?.user.userId ?? '',
        };

        userType = currentAccess.role;
        isAuthenticated = true;

        newAuthSession = {
          ...authSession,
          // accessDocumentId: newPreferredAccess._id as unknown as string,
          currentAccess,
          isAuthenticated,
          userType,
          userData: {
            ...authSession.userData,
            fullName: newPreferredAccess.user.fullName,
            userId: newPreferredAccess.user.userId,
          } as UserDocument,
        } as AuthSession;

        set(() => ({ authSession: { ...newAuthSession } }));
      }
    },
    getMe: async () => {
      set((state) => ({ ...state }));

      try {
        const userData = (await authService.getUser()) as MeWithAccessRecordsApiResponse;

        const receivedPreference = (await authService.getUserPreferences()) as PreferencesRecord;

        if (userData) {
          let currentAccess: CurrentAccess;

          // Default to learner if no access
          currentAccess = {
            accessDocumentId: '',
            role: 'Learner',
            tenantId: '',
            constraintTags: [],
            tenantClassification: '',
            tenantName: '',
            userId: '',
          };

          if (userData?.access?.length > 0) {
            currentAccess = {
              accessDocumentId: userData.access?.[0]._id as unknown as string,
              constraintTags: userData.access?.[0].user.grants,
              role: userData.access?.[0].tenant.permission?.role ?? 'Learner',
              tenantId: userData.access?.[0].tenant.tenantId ?? '',
              tenantClassification: userData.access?.[0].tenant?.classification?.type ?? '',
              tenantName: userData.access?.[0].tenant.name ?? '',
              userId: userData.access?.[0].user.userId ?? '',
            };
          }

          set(() => ({
            authSession: {
              currentAccess,
              impersonatedBy: userData.impersonatedBy ?? undefined,
              isAuthenticated: true,
              isImpersonated: !!userData.impersonatedBy,
              userData,
              userType: currentAccess.role,
            },
          }));

          if (
            (receivedPreference as unknown as string) &&
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            receivedPreference.currentAccess !== (userData.access[0]._id as unknown as string)
          ) {
            get().setPreferences(receivedPreference.currentAccess as unknown as string);
          }
        }
      } catch (err: unknown) {
        // TODO: set error
      } finally {
        set({ initializedUser: true });
      }
    },
  })),
  shallow,
);

export const signOutCallback: () => void = () => {
  const closure = useAuthStore.getState().signOut;

  return closure;
};

export const getMeCallback: () => Promise<void> = () => {
  const closure = useAuthStore.getState().getMe;

  return closure();
};

export const setPreferences: (preferredAccess: string) => void = (preferredAccess: string) => {
  const closure = useAuthStore.getState().setPreferences;

  return closure(preferredAccess);
};

export const getAuthSession: () => AuthSession | undefined = (): AuthSession | undefined => {
  const { authSession } = useAuthStore.getState();

  return authSession;
};

export const getCurrentAccess: () => CurrentAccess | undefined = () => {
  const closure = useAuthStore.getState().authSession.currentAccess;

  return closure;
};

export const resetAuthSession: () => void = () => {
  const closure = useAuthStore.getState().resetAuthSession;

  return closure();
};
