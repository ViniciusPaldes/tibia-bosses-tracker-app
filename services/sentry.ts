import * as Sentry from '@sentry/react-native';

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
const sendDefaultPii = true;
const replaysSessionSampleRate = 0.1;
const replaysOnErrorSampleRate = 1;
const enableMobileReplay = true;
const enableFeedback = true;

Sentry.init({
  dsn,
  sendDefaultPii,
  replaysSessionSampleRate,
  replaysOnErrorSampleRate,
  integrations: [
    ...(enableMobileReplay ? [Sentry.mobileReplayIntegration()] : []),
    ...(enableFeedback ? [Sentry.feedbackIntegration()] : []),
  ],
});

export { Sentry };


