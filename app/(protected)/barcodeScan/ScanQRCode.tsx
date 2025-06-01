import { CameraView } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import {
    AppState,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    View,
    Alert,
} from "react-native";
import { useEffect, useRef } from "react";
import Overlay from "./Overlay";
import { supabase } from "@/config/supabase";
import BackButton from "../../../components/backButton";

export default function ScanQRCode() {
    const router = useRouter();
    const qrLock = useRef(false);
    const appState = useRef(AppState.currentState);

    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                qrLock.current = false;
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const handleBarcodeScanned = async ({ data }: { data: string }) => {
        if (!data || qrLock.current) return;

        if (!uuidV4Regex.test(data)) {
            Alert.alert("Invalid QR Code", "Scanned QR code is not a valid club ID.");
            return;
        }

        qrLock.current = true;

        try {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                console.warn("No logged-in user or error fetching user:", userError);
                qrLock.current = false;
                return;
            }

            const { error: insertError } = await supabase.from("user_visits").insert([
                {
                    user_id: user.id,
                    club_id: data,
                    visit_time: new Date().toISOString(),
                },
            ]);

            if (insertError) {
                console.warn("Error inserting visit:", insertError);
                qrLock.current = false;
                return;
            }

            Alert.alert("Success", "Successfully checked in!", [
                {
                    text: "OK",
                    onPress: () => router.back(),
                },
            ]);
        } catch (e) {
            console.error("Unexpected error scanning QR:", e);
            qrLock.current = false;
        }
    };

    return (
        <SafeAreaView style={StyleSheet.absoluteFillObject}>
            <Stack.Screen
                options={{
                    title: "Scan QR Code",
                    headerShown: false,
                }}
            />

            {Platform.OS === "android" ? <StatusBar hidden /> : null}

            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={handleBarcodeScanned}
            />

            <Overlay />

            {/* ✅ Use the reusable BackButton */}
            <BackButton style={styles.backButtonPosition} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    backButtonPosition: {
        position: "absolute",
        top: 50,
        left: 20,
        zIndex: 10,
    },
});
