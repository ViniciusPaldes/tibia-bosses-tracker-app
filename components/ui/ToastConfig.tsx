// components/ui/toast/config.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { BaseToast, ToastConfig } from 'react-native-toast-message';
import { useTheme } from 'styled-components/native';

function useToastStyles() {
    const t = useTheme();

    const cardBase = {
        borderRadius: t.tokens.radius * 1.5,
        backgroundColor: t.tokens.colors.card, 
        borderWidth: 2,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6,
        opacity: 0.9,
    };

    const textTitle = {
        fontFamily: t.tokens.typography.fonts.title,
        fontSize: 14,
        fontWeight: 'normal',
        letterSpacing: 0.5,
        color: t.tokens.colors.text,
    };

    const accents = {
        gold: t.tokens.colors.primary,
        green: t.tokens.colors.success ?? '#4CAF50',
        red: t.tokens.colors.danger ?? '#F44336',
    };

    return { cardBase, textTitle, accents };
}

const CustomToast = (props: any) => {
    const s = useToastStyles();

    const getToastConfig = (type: string) => {
        switch (type) {
            case 'success':
                return { color: s.accents.green, icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap };
            case 'error':
                return { color: s.accents.red, icon: 'warning-outline' as keyof typeof Ionicons.glyphMap };
            case 'info':
            default:
                return { color: s.accents.gold, icon: 'information-circle' as keyof typeof Ionicons.glyphMap };
        }
    };

    const config = getToastConfig(props.type);

    return (
        <BaseToast
            {...props}
            style={[s.cardBase, { borderColor: config.color }]}
            contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8 }}
            renderTrailingIcon={() => null}
            text1Style={s.textTitle}
            renderLeadingIcon={() => <View style={{ paddingTop: 6, paddingLeft: 12 }}><Ionicons name={config.icon} size={20} color={config.color} /></View>}
        >
            {props.children}
        </BaseToast>
    );
};


export const toastConfig: ToastConfig = {
    info: (p) => <CustomToast {...p} type="info" />,
    success: (p) => <CustomToast {...p} type="success" />,
    error: (p) => <CustomToast {...p} type="error" />,
};