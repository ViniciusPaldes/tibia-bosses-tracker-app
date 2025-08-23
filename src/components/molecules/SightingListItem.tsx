import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

export type SightingStatus = 'spotted' | 'killed' | 'checked';

type Props = {
  title: string;
  subtitle: string;
  status: SightingStatus;
  accessibilityHint?: string;
};

const Row = styled.View(({ theme }) => ({
  paddingVertical: 8,
  paddingHorizontal: 10,
  borderRadius: theme.tokens.radius,
  marginBottom: 6,
  backgroundColor: theme.tokens.colors.card,
}));

const RowKilled = styled(Row)(({ theme }) => ({
  borderLeftWidth: 3,
  borderLeftColor: theme.tokens.colors.danger,
  paddingLeft: 10,
  backgroundColor: 'rgba(185,74,72,0.08)',
}));

const Line = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
});

const Title = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
}));

const Subtitle = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.textSecondary,
}));

const KilledTag = styled.View(({ theme }) => ({
  backgroundColor: theme.tokens.colors.danger,
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: 999,
}));

const KilledTagText = styled.Text(() => ({
  color: '#111',
  fontWeight: '700',
  fontSize: 12,
}));

export function SightingListItem({ title, subtitle, status, accessibilityHint }: Props) {
  const { t } = useTranslation('common');

  if (status === 'killed') {
    return (
      <RowKilled accessibilityHint={accessibilityHint ?? t('killed')}>
        <Line>
          <Ionicons name="skull-outline" size={16} color="#b94a48" />
          <Title>{title}</Title>
          <KilledTag>
            <KilledTagText>{t('killed')}</KilledTagText>
          </KilledTag>
        </Line>
        <Subtitle style={{ marginTop: 2 }}>{subtitle}</Subtitle>
      </RowKilled>
    );
  }

  return (
    <Row>
      <Title>{title}</Title>
      <Subtitle style={{ marginTop: 2 }}>{subtitle}</Subtitle>
    </Row>
  );
}

export default SightingListItem;


