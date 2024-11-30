import { createWithEqualityFn } from 'zustand/traditional';
import { devtools } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { Feature, FEATURE_FLAGS } from '@components/ui/FeatureFlag/constants';
import { DevMode } from '@youscience/core/constants';

export interface FeatureStore {
  features: typeof FEATURE_FLAGS;
  getEnabledFeature: (featureName: string) => Feature;
}

export const useFeatureStore = createWithEqualityFn<FeatureStore>()(
  devtools((set, get) => ({
    features: [...FEATURE_FLAGS],
    getEnabledFeature: (featureName: string) => {
      const { features } = get();
      const environment = import.meta.env.VITE_NODE_ENV as unknown as DevMode;

      const enabledFeature = features.filter(
        (feature) => feature.name === featureName && feature.enabled && feature.environments.includes(environment),
      );

      return enabledFeature.length
        ? enabledFeature[0]
        : { enabled: false, featureId: null, name: null, environments: [] };
    },
  })),
  shallow,
);
