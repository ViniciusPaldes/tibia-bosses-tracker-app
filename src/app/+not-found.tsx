import { Screen } from '@/components';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';

export default function NotFoundScreen() {
  const { t } = useTranslation('common');

  return (
    <Screen name="404 - Not Found">
      <Text>Not Found</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
