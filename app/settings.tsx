// app/settings.tsx
import { Screen } from '@/components/ui/Screen';
import SelectModal from '@/components/ui/SelectModal';
import { loadSelectedWorld, saveSelectedWorld, useWorlds } from '@/data/worlds/hooks';
import { changeLanguage } from '@/src/i18n';
import { useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

const Row = styled.View(({ theme }) => ({
  backgroundColor: theme.tokens.colors.card,
  borderRadius: theme.tokens.radius,
  padding: 16,
  marginBottom: 12,
}));

const Label = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
}));

const ValueButton = styled.Pressable(({ theme }) => ({
  marginTop: 8,
  paddingVertical: 12,
  borderRadius: theme.tokens.radius,
  backgroundColor: theme.tokens.colors.backgroundDark,
  alignItems: 'center',
  justifyContent: 'center',
}));

const ValueText = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.body,
}));


export default function Settings() {
  const { data: worlds, loading, error, refetch } = useWorlds();
  const [selected, setSelected] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { t, i18n } = useTranslation('common');
  const navigation = useNavigation();

  useEffect(() => {
    loadSelectedWorld().then((w) => { if (w) setSelected(w); });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t('titleSettings') });
  }, [navigation]);


  const canOpenPicker = !loading && !error && worlds.length > 0;

  return (
    <Screen name="Settings">
      <Row>
        <Label>{t('world')}</Label>

        <ValueButton
          disabled={!canOpenPicker}
          onPress={() => setPickerOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Choose world"
        >
          <ValueText>
            {loading ? t('loadingWorlds') : selected ?? t('selectWorld')}
          </ValueText>
        </ValueButton>

        {!!error && (
          <ValueButton onPress={refetch}>
            <ValueText>{t('retry')}</ValueText>
          </ValueButton>
        )}
      </Row>

      <Row>
        <Label>{t('language')}</Label>
        <ValueButton onPress={() => setLangOpen(true)} accessibilityRole="button" accessibilityLabel="Change language">
          <ValueText>
            {i18n.language === 'pt-BR' ? t('portugueseBR') : i18n.language === 'es' ? t('spanish') : i18n.language === 'pl' ? t('polish') : t('english')}
          </ValueText>
        </ValueButton>
      </Row>

      {/* <Row>
        <Label>{t('about')}</Label>
      </Row>

      <Row>
        <Label>{t('benchmark')}</Label>
        <ValueButton onPress={() => router.push("/benchmark/bench-storage")}>
          <ValueText>{t('mmkvVsAsyncStorage')}</ValueText>
        </ValueButton>
      </Row> */}

      <SelectModal
        visible={pickerOpen}
        title={t('chooseWorld')}
        data={worlds}
        onSelect={async (w) => {
          setSelected(w);
          await saveSelectedWorld(w);
        }}
        onClose={() => setPickerOpen(false)}
      />

      <SelectModal
        visible={langOpen}
        title={t('language')}
        data={[t('english'), t('portugueseBR'), t('spanish'), t('polish')]}
        onSelect={async (label) => {
          const map: Record<string, 'en' | 'pt-BR' | 'es' | 'pl'> = {
            [t('english')]: 'en',
            [t('portugueseBR')]: 'pt-BR',
            [t('spanish')]: 'es',
            [t('polish')]: 'pl',
          };
          const code = map[label] ?? 'en';
          await changeLanguage(code);
        }}
        onClose={() => setLangOpen(false)}
      />
    </Screen>
  );
}