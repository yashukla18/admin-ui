import { useFeatureStore } from '@stores/featureStore';
import { render, screen, waitFor } from '@utils/test-utils';
import { DevMode } from '@youscience/core/constants';
import { FeatureFlag } from './FeatureFlag';
import { FEATURE_FLAGS, FeatureFlagNames } from './constants';

describe('FeatureFlag', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_NODE_ENV', '');
    await waitFor(() =>
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      }),
    );
  });

  describe('Impersonation feature', () => {
    it('should show impersonation feature on development', () => {
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'development' as keyof DevMode);

      render(
        <FeatureFlag featureName='impersonation' featureId={import.meta.env.VITE_FEATURE_IMPERSONATION_ID}>
          Impersonation is rendered
        </FeatureFlag>,
      );

      expect(screen.getByText(/Impersonation is rendered/i)).toBeTruthy();
    });

    it('should show impersonation feature on sandbox', () => {
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'sandbox' as keyof DevMode);

      render(
        <FeatureFlag featureName='impersonation' featureId={import.meta.env.VITE_FEATURE_IMPERSONATION_ID}>
          Impersonation is rendered
        </FeatureFlag>,
      );

      expect(screen.queryByText(/Impersonation is rendered/i)).toBeTruthy();
    });

    it('should show impersonation feature on staging', () => {
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'stage' as keyof DevMode);

      render(
        <FeatureFlag featureName='impersonation' featureId={import.meta.env.VITE_FEATURE_IMPERSONATION_ID}>
          Impersonation is rendered
        </FeatureFlag>,
      );

      expect(screen.queryByText(/Impersonation is rendered/i)).toBeTruthy();
    });

    it('should show impersonation feature on production', () => {
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'production' as keyof DevMode);

      render(
        <FeatureFlag featureName='impersonation' featureId={import.meta.env.VITE_FEATURE_IMPERSONATION_ID}>
          Impersonation is rendered
        </FeatureFlag>,
      );

      expect(screen.queryByText(/Impersonation is rendered/i)).toBeTruthy();
    });

    it('should NOT show impersonation feature on prod', () => {
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'prod' as keyof DevMode);

      render(
        <FeatureFlag featureName='impersonation' featureId={import.meta.env.VITE_FEATURE_IMPERSONATION_ID}>
          Impersonation is rendered
        </FeatureFlag>,
      );

      expect(screen.queryByText(/Impersonation is rendered/i)).toBeTruthy();
    });
  });

  describe('Bulk Invite feature', () => {
    it('should show Org Bulk Invite on development', () => {
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'development' as keyof DevMode);

      render(
        <FeatureFlag featureName='orgBulkInvite' featureId={import.meta.env.VITE_FEATURE_ORG_BULK_INVITE_ID}>
          Bulk Invite is rendered
        </FeatureFlag>,
      );

      expect(screen.getByText(/Bulk Invite is rendered/i)).toBeTruthy();
    });

    it('should show Org Bulk Invite on sandbox', () => {
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'sandbox' as keyof DevMode);

      render(
        <FeatureFlag featureName='orgBulkInvite' featureId={import.meta.env.VITE_FEATURE_ORG_BULK_INVITE_ID}>
          Bulk Invite is rendered
        </FeatureFlag>,
      );

      expect(screen.getByText(/Bulk Invite is rendered/i)).toBeTruthy();
    });

    it('should NOT show Org Bulk Invite on stage', () => {
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'stage' as keyof DevMode);

      render(
        <FeatureFlag featureName='orgBulkInvite' featureId={import.meta.env.VITE_FEATURE_ORG_BULK_INVITE_ID}>
          Bulk Invite is rendered
        </FeatureFlag>,
      );

      expect(screen.getByText(/Bulk Invite is rendered/i)).toBeTruthy();
    });

    it('should NOT show Org Bulk Invite on production', () => {
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'production' as keyof DevMode);

      render(
        <FeatureFlag featureName='orgBulkInvite' featureId={import.meta.env.VITE_FEATURE_ORG_BULK_INVITE_ID}>
          Bulk Invite is rendered
        </FeatureFlag>,
      );

      expect(screen.getByText(/Bulk Invite is rendered/i)).toBeTruthy();
    });
  });

  describe('Add User feature', () => {
    it('should show Add User on development', () => {
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'development' as keyof DevMode);

      render(
        <FeatureFlag featureName='addUser' featureId={import.meta.env.VITE_FEATURE_ADD_USER_ID}>
          Add User is rendered
        </FeatureFlag>,
      );

      expect(screen.getByText(/Add User is rendered/i)).toBeTruthy();
    });

    it('should NOT show Add User on sandbox', () => {
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'sandbox' as keyof DevMode);

      render(
        <FeatureFlag featureName='addUser' featureId={import.meta.env.VITE_FEATURE_ADD_USER_ID}>
          Add User is rendered
        </FeatureFlag>,
      );

      expect(screen.queryByText(/Add User is rendered/i)).toBeTruthy();
    });

    it('should NOT show Add User on stage', () => {
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'stage' as keyof DevMode);

      render(
        <FeatureFlag featureName='addUser' featureId={import.meta.env.VITE_FEATURE_ADD_USER_ID}>
          Add User is rendered
        </FeatureFlag>,
      );

      expect(screen.queryByText(/Add User is rendered/i)).toBeTruthy();
    });

    it('should NOT show Add User on production', () => {
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'production' as keyof DevMode);

      render(
        <FeatureFlag featureName='addUser' featureId={import.meta.env.VITE_FEATURE_ADD_USER_ID}>
          Add User is rendered
        </FeatureFlag>,
      );

      expect(screen.queryByText(/Add User is rendered/i)).toBeTruthy();
    });
  });

  describe('Remove identity feature', () => {
    it('should show Remove Identity on development', () => {
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'development' as keyof DevMode);

      render(
        <FeatureFlag featureName='removeIdentity' featureId={import.meta.env.VITE_FEATURE_REMOVE_IDENTITY_ID}>
          Remove Identity is rendered
        </FeatureFlag>,
      );

      expect(screen.getByText(/Remove Identity is rendered/i)).toBeTruthy();
    });

    it('should show Remove Identity on sandbox', () => {
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'sandbox' as keyof DevMode);

      render(
        <FeatureFlag featureName='removeIdentity' featureId={import.meta.env.VITE_FEATURE_REMOVE_IDENTITY_ID}>
          Remove Identity is rendered
        </FeatureFlag>,
      );

      expect(screen.getByText(/Remove Identity is rendered/i)).toBeTruthy();
    });

    it('should show Remove Identity on stage', () => {
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'stage' as keyof DevMode);

      render(
        <FeatureFlag featureName='removeIdentity' featureId={import.meta.env.VITE_FEATURE_REMOVE_IDENTITY_ID}>
          Remove Identity is rendered
        </FeatureFlag>,
      );

      expect(screen.getByText(/Remove Identity is rendered/i)).toBeTruthy();
    });

    it('should show Remove Identity on production', () => {
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'production' as keyof DevMode);

      render(
        <FeatureFlag featureName='removeIdentity' featureId={import.meta.env.VITE_FEATURE_REMOVE_IDENTITY_ID}>
          Remove Identity is rendered
        </FeatureFlag>,
      );

      expect(screen.queryByText(/Remove Identity is rendered/i)).toBeTruthy();
    });
  });

  describe('Default functionality', () => {
    it('should show feature if featureId if all criteria is met', () => {
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'development' as keyof DevMode);

      render(
        <FeatureFlag featureName='impersonation' featureId={import.meta.env.VITE_FEATURE_IMPERSONATION_ID}>
          Impersonation is rendered
        </FeatureFlag>,
      );

      expect(screen.getByText(/Impersonation is rendered/i)).toBeTruthy();
    });

    it('should show feature in multiple environments if provided', () => {
      useFeatureStore.setState({
        features: [
          ...FEATURE_FLAGS,
          {
            ...((FEATURE_FLAGS[0].environments as unknown as DevMode) = [
              'development',
              'stage',
              'production',
            ] as unknown as DevMode),
          },
        ] as unknown as typeof FEATURE_FLAGS,
      });

      // expect to work on development
      vi.stubEnv('VITE_NODE_ENV', 'development' as keyof DevMode);

      expect(import.meta.env.VITE_NODE_ENV).toBe('development');

      const component = render(
        <FeatureFlag featureName='impersonation' featureId={import.meta.env.VITE_FEATURE_IMPERSONATION_ID}>
          Impersonation is rendered
        </FeatureFlag>,
      );

      expect(screen.getByText(/Impersonation is rendered/i)).toBeTruthy();

      // expect to work on stage
      vi.stubEnv('VITE_NODE_ENV', 'stage' as keyof DevMode);

      expect(import.meta.env.VITE_NODE_ENV).toBe('stage');

      component.rerender(
        <FeatureFlag featureName='impersonation' featureId={import.meta.env.VITE_FEATURE_IMPERSONATION_ID}>
          Impersonation is rendered
        </FeatureFlag>,
      );

      expect(component.getByText(/Impersonation is rendered/i)).toBeTruthy();

      // expect to work on production
      vi.stubEnv('VITE_NODE_ENV', 'production' as keyof DevMode);
      expect(import.meta.env.VITE_NODE_ENV).toBe('production');
      component.rerender(
        <FeatureFlag featureName='impersonation' featureId={import.meta.env.VITE_FEATURE_IMPERSONATION_ID}>
          Impersonation is rendered
        </FeatureFlag>,
      );
      expect(component.getByText(/Impersonation is rendered/i)).toBeTruthy();
    });

    it('should NOT show feature if env featureId exists but does not match feature store id', () => {
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      });

      render(
        <FeatureFlag featureName='impersonation' featureId={import.meta.env.VITE_FEATURE_ORG_BULK_INVITE_ID}>
          Impersonation is rendered
        </FeatureFlag>,
      );

      expect(screen.queryByText(/Impersonation is rendered/i)).toBeNull();
    });

    it('should NOT show feature if featureId does not match env featureId', () => {
      useFeatureStore.setState({
        features: FEATURE_FLAGS,
      });

      render(
        <FeatureFlag featureName='impersonation' featureId='123'>
          Impersonation is rendered
        </FeatureFlag>,
      );

      expect(screen.queryByText(/Impersonation is rendered/i)).toBeNull();
    });

    it('should NOT show feature if enabled is false and everything else is true', () => {
      useFeatureStore.setState({
        features: [
          {
            featureName: 'impersonation' as FeatureFlagNames,
            enabled: false as boolean,
            featureId: import.meta.env.VITE_FEATURE_IMPERSONATION_ID,
            environments: ['development'] as unknown as keyof DevMode,
          },
        ] as unknown as typeof FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'development' as keyof DevMode);

      render(
        <FeatureFlag featureName='impersonation' featureId='123'>
          Impersonation is rendered
        </FeatureFlag>,
      );

      expect(screen.queryByText(/Impersonation is rendered/i)).toBeNull();
    });

    it('should NOT show feature if featureName does not exist', () => {
      useFeatureStore.setState({
        features: [
          {
            featureName: 'test' as FeatureFlagNames,
            enabled: true as boolean,
            featureId: import.meta.env.VITE_FEATURE_IMPERSONATION_ID,
            environments: ['development'] as unknown as keyof DevMode,
          },
        ] as unknown as typeof FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'development' as keyof DevMode);

      render(
        <FeatureFlag featureName='impersonation' featureId={import.meta.env.VITE_FEATURE_IMPERSONATION_ID}>
          Impersonation is rendered
        </FeatureFlag>,
      );

      expect(screen.queryByText(/Impersonation is rendered/i)).toBeNull();
    });

    it('should NOT show feature on development if the environment is empty', () => {
      useFeatureStore.setState({
        features: [
          {
            featureName: 'impersonation' as FeatureFlagNames,
            enabled: true as boolean,
            featureId: import.meta.env.VITE_FEATURE_IMPERSONATION_ID,
            environments: [],
          },
        ] as unknown as typeof FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'development' as keyof DevMode);

      render(
        <FeatureFlag featureName='impersonation' featureId={import.meta.env.VITE_FEATURE_IMPERSONATION_ID}>
          Impersonation is rendered
        </FeatureFlag>,
      );

      expect(screen.queryByText(/Impersonation is rendered/i)).toBeNull();
    });

    it('should NOT show feature on stage if the environments is empty', () => {
      useFeatureStore.setState({
        features: [
          {
            featureName: 'impersonation' as FeatureFlagNames,
            enabled: true as boolean,
            featureId: import.meta.env.VITE_FEATURE_IMPERSONATION_ID,
            environments: [],
          },
        ] as unknown as typeof FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'stage' as keyof DevMode);

      render(
        <FeatureFlag featureName='impersonation' featureId={import.meta.env.VITE_FEATURE_IMPERSONATION_ID}>
          Impersonation is rendered
        </FeatureFlag>,
      );

      expect(screen.queryByText(/Impersonation is rendered/i)).toBeNull();
    });

    it('should NOT show feature on production if the environments is empty', () => {
      useFeatureStore.setState({
        features: [
          {
            featureName: 'impersonation' as FeatureFlagNames,
            enabled: true as boolean,
            featureId: import.meta.env.VITE_FEATURE_IMPERSONATION_ID,
            environments: [],
          },
        ] as unknown as typeof FEATURE_FLAGS,
      });

      vi.stubEnv('VITE_NODE_ENV', 'production' as keyof DevMode);

      render(
        <FeatureFlag featureName='impersonation' featureId={import.meta.env.VITE_FEATURE_IMPERSONATION_ID}>
          Impersonation is rendered
        </FeatureFlag>,
      );

      expect(screen.queryByText(/Impersonation is rendered/i)).toBeNull();
    });
  });
});
