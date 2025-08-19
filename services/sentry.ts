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

export function captureException(error: unknown, module: string, extra?: Record<string, any>): void {
  const err = error instanceof Error ? error : new Error(String(error));
  Sentry.captureException(err, { tags: { module }, extra });
}

export function setSentryUser(user: { id?: string; email?: string } | null): void {
  if (user && (user.id || user.email)) {
    Sentry.setUser({ id: user.id, email: user.email } as any);
  } else {
    Sentry.setUser(null);
  }
}


