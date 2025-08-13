// app/settings.tsx
import { Screen } from '@/components/ui/Screen';
import SelectModal from '@/components/ui/SelectModal';
import { loadSelectedWorld, saveSelectedWorld, useWorlds } from '@/data/worlds/hooks';
import { useEffect, useState } from 'react';
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

export const options = { title: 'Settings' };

export default function Settings() {
  const { data: worlds, loading, error, refetch } = useWorlds();
  const [selected, setSelected] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    loadSelectedWorld().then((w) => { if (w) setSelected(w); });
  }, []);

  const canOpenPicker = !loading && !error && worlds.length > 0;

  return (
    <Screen>
      <Row>
        <Label>World</Label>

        <ValueButton
          disabled={!canOpenPicker}
          onPress={() => setPickerOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Choose world"
        >
          <ValueText>
            {loading ? 'Loading…' : selected ?? 'Select world'}
          </ValueText>
        </ValueButton>

        {!!error && (
          <ValueButton onPress={refetch}>
            <ValueText>Retry</ValueText>
          </ValueButton>
        )}
      </Row>

      <Row>
        <Label>Language</Label>
      </Row>

      <Row>
        <Label>About</Label>
      </Row>

      <SelectModal
        visible={pickerOpen}
        title="Choose your world"
        data={worlds}
        onSelect={async (w) => {
          setSelected(w);
          await saveSelectedWorld(w);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </Screen>
  );
}