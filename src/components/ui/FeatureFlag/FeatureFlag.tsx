/* eslint-disable react/jsx-no-useless-fragment */
import { FC, ReactNode } from 'react';
import { useFeatureStore } from '@stores/featureStore';
import { shallow } from 'zustand/shallow';
import { FeatureFlagNames } from './constants';

export const FeatureFlag: FC<{
  children: ReactNode;
  featureName: FeatureFlagNames;
  featureId: string;
}> = ({ children, featureName, featureId }) => {
  const { getEnabledFeature } = useFeatureStore((state) => state, shallow);
  const feature = getEnabledFeature(featureName);

  // extra catch to only show feature if featureId matches returned id
  return feature.featureId === featureId ? <>{children}</> : null;
};
