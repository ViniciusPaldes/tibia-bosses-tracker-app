// components/ui/SelectModal.tsx
import { FlatList, Modal, Pressable, View } from 'react-native';
import styled from 'styled-components/native';

const Overlay = styled(Pressable)(() => ({
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Panel = styled.View(({ theme }) => ({
  width: '88%',
  maxHeight: 420, // scrolls if content exceeds this height
  backgroundColor: theme.tokens.colors.card,
  borderRadius: theme.tokens.radius,
  padding: 16,
}));

const Title = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontFamily: theme.tokens.typography.fonts.title,
  fontSize: theme.tokens.typography.sizes.h3,
  textAlign: 'center',
  marginBottom: 8,
}));

const Item = styled.Pressable(({ theme }) => ({
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: theme.tokens.colors.backgroundDark,
}));

const ItemText = styled.Text(({ theme }) => ({
  color: theme.tokens.colors.text,
  fontSize: theme.tokens.typography.sizes.body,
  fontFamily: theme.tokens.typography.fonts.body,
}));

type Props = {
  visible: boolean;
  title?: string;
  data: string[];
  onSelect: (value: string) => void;
  onClose: () => void;
};

export default function SelectModal({ visible, title = 'Select', data, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Overlay onPress={onClose}>
        <Pressable onPress={() => {}} style={{ width: '100%', alignItems: 'center' }}>
          <Panel>
            <Title>{title}</Title>
            <FlatList
              data={data}
              keyExtractor={(v) => v}
              renderItem={({ item }) => (
                <Item onPress={() => { onSelect(item); onClose(); }}>
                  <ItemText>{item}</ItemText>
                </Item>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
              showsVerticalScrollIndicator
            />
          </Panel>
        </Pressable>
      </Overlay>
    </Modal>
  );
}