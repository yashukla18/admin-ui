import { Link } from '@mui/material';

export type ErrorType = 404 | 401 | 'unknown' | 'not-found' | 'impersonating';

export interface ErrorPageProps {
  errorType?: ErrorType;
  homePageLink: string;
}

export interface ErrorMessage {
  error?: string;
  mainMessage: string;
  subMessage: string | JSX.Element;
}
const ScheduleDemoLink = () => {
  return (
    <Link
      href='https://www.youscience.com/demo-request?utm_medium=referral&utm_source=direct&utm_campaign=brightpath_ep'
      color='secondary'
    >
      schedule a demo
    </Link>
  );
};

export const errorMessages: { [key in ErrorType]: ErrorMessage } = {
  401: {
    error: 'ERROR 401',
    mainMessage: `This feature isn't available to you right now`,
    subMessage: (
      <>
        Want to expand your toolkit? Please contact your school&apos;s YouScience account admin, speak with your
        YouScience representative, <ScheduleDemoLink /> to get started
        {'\n\n'}
        Return home to continue your experience.
      </>
    ),
  },
  'not-found': {
    error: 'Not Found',
    mainMessage: `This feature isn't available to you right now`,
    subMessage: (
      <>
        Want to expand your toolkit? Please contact your school&apos;s YouScience account admin, speak with your
        YouScience representative, <ScheduleDemoLink /> to get started
        {'\n\n'}
        Return home to continue your experience.
      </>
    ),
  },
  404: {
    error: 'ERROR 404',
    mainMessage: `We can’t find the page you are looking for.`,
    subMessage: `Let’s get you back on track so you can continue exploring.`,
  },
  unknown: {
    error: 'Unknown',
    mainMessage: 'Oops!',
    subMessage: 'Sorry, an unexpected error has occurred.',
  },
  impersonating: {
    mainMessage: 'This page is not available while impersonating.',
    subMessage:
      'You can click the back button from your browser window,  head to this user’s homepage, or stop impersonating.',
  },
};
