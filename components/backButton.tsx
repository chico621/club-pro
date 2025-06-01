import React from "react";
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { useRouter } from "expo-router";

interface BackButtonProps {
    label?: string;
    style?: ViewStyle;
}

export default function BackButton({ label = "← Back", style }: BackButtonProps) {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButtonContainer, style]}
        >
            <Text style={styles.backButtonText}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    backButtonContainer: {
        marginBottom: 12,
        paddingVertical: 6,
        paddingHorizontal: 12,
        alignSelf: 'flex-start',
        borderRadius: 8,
        backgroundColor: '#E5E7EB', // light gray bg
    },
    backButtonText: {
        fontSize: 16,
        color: '#3B82F6', // blue
        fontWeight: '600',
    },
});
