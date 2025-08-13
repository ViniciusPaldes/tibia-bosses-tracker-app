// components/ui/BossListItem.tsx
import { Image } from 'expo-image';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';

type Chance = 'high' | 'medium' | 'low' | 'no chance' | 'lost track';

export type BossListItemProps = {
    name: string;
    city?: string | null;
    daysSince?: number | null;
    chance: Chance;
    imageUrl: string;            // e.g., getBossImageUrl(name)
    onPress: () => void;
};

const Card = styled(Pressable)(({ theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.tokens.colors.card,
    borderRadius: theme.tokens.radius,
    padding: 12,
    marginBottom: 12,
    // nice subtle shadow/glow
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
}));

const Avatar = styled(Image)(({ theme }) => ({
    width: 56,
    height: 56,
    borderRadius: theme.tokens.radius,
    marginRight: 12,
}));

const Info = styled.View({
    flex: 1,
});

const Row = styled.View({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
});

// add this helper wrapper
const TitleWrap = styled.View({
    flex: 1,
    minWidth: 0,      // <- allows shrinking inside a row
    paddingRight: 8,
});

const Name = styled.Text(({ theme }) => ({
    color: theme.tokens.colors.text,
    fontFamily: theme.tokens.typography.fonts.title,
    fontSize: theme.tokens.typography.sizes.h3,
    flexShrink: 1,    // <- let it truncate instead of pushing the badge
}));


const City = styled.Text(({ theme }) => ({
    color: theme.tokens.colors.textSecondary,
    marginTop: 4,
}));

const Meta = styled.View({
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
});

const Muted = styled.Text(({ theme }) => ({
    color: theme.tokens.colors.textSecondary,
    fontSize: 14,
}));

const Badge = styled.View<{ bg: string }>(({ bg }) => ({
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: bg,
}));

const BadgeText = styled.Text({
    color: '#111',
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 12,
});

function chanceColor(theme: any, chance: Chance) {
    switch (chance) {
        case 'high':
            return theme.tokens.colors.success; // green
        case 'medium':
            return theme.tokens.colors.warning; // yellow
        case 'low':
            return '#7a7a7a';                   // gray
        case 'no chance':
            return '#b94a48';                   // red-ish
        case 'lost track':
        default:
            return '#555';                      // dark gray
    }
}

export function BossListItem({
    name,
    city,
    daysSince,
    chance,
    imageUrl,
    onPress,
}: BossListItemProps) {
    return (
        <Card onPress={onPress}>
            <Avatar source={{ uri: imageUrl }} contentFit="contain" />
            <Info>
                <Row>
                    <TitleWrap>
                        <Name numberOfLines={1} ellipsizeMode="tail">{name}</Name>
                    </TitleWrap>
                    <Badge bg={chanceColor({ tokens: { colors: { success: '#28a745', warning: '#ffc107' } } }, chance)}>
                        <BadgeText>{chance}</BadgeText>
                    </Badge>
                </Row>

                {city ? <City>{city}</City> : null}

                <Meta>
                    {typeof daysSince === 'number' ? (
                        <Muted>last seen {daysSince === 0 ? 'today' : `${daysSince}d ago`}</Muted>
                    ) : null}
                    {/* Add more muted bits later (e.g., region) */}
                </Meta>
            </Info>
        </Card >
    );
}