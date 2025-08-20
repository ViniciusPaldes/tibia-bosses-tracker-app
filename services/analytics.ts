import { getAnalytics, logEvent, setUserId, setUserProperties } from "@react-native-firebase/analytics";

const analytics = getAnalytics();

export const setupUser = async (userId: string, properties?: Record<string, string>) => {
    await setUserId(analytics, userId);
    if (properties) {
        await setUserProperties(analytics, properties);
    }
};

export const logAnalyticsEvent = async (title: string, data: any) => {
    await logEvent(analytics, title, data);
};
