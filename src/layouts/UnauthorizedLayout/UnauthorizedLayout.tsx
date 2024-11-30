import { FC, ReactNode } from 'react';
import { CoreBox } from '@youscience/core';
import { Footer } from '@youscience/brightpath-header';
import { MAIN_LOGO_PATH } from '@constants';
import { UNAUTHORIZED_LAYOUT_TESTID } from '@layouts/layout.testIds';
import { SignInPageContainer, ContentWrapper, ChildContainer } from './UnauthorizedLayout.styles';

export const UnauthorizedLayout: FC<{ children?: ReactNode; signIn?: VoidFunction }> = ({ children, signIn }) => {
  signIn?.();

  return (
    <SignInPageContainer data-testid={UNAUTHORIZED_LAYOUT_TESTID}>
      <ContentWrapper>
        <ChildContainer>
          <img
            alt='YouScience logo'
            height='60px'
            loading='lazy'
            src={MAIN_LOGO_PATH}
            style={{ marginBottom: 100 }}
            width='200px'
          />
          <CoreBox>{children}</CoreBox>
        </ChildContainer>
      </ContentWrapper>
      <Footer />
    </SignInPageContainer>
  );
};
