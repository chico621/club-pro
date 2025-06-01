import { useState, useEffect } from "react";
import { View, FlatList, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { supabase } from "@/config/supabase";

export default function ViewAnnouncement() {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                Alert.alert("You must be logged in.");
                setLoading(false);
                return;
            }

            // Get user's club_id
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("club_id")
                .eq("id", user.id)
                .single();

            if (userError || !userData?.club_id) {
                Alert.alert("Failed to find your club.");
                setLoading(false);
                return;
            }

            // Fetch announcements for user's club
            const { data, error } = await supabase
                .from("announcements")
                .select("id, message, created_at")
                .eq("club_id", userData.club_id)
                .order("created_at", { ascending: false });

            if (error) {
                Alert.alert("Error loading announcements:", error.message);
            } else {
                setAnnouncements(data || []);
            }

            setLoading(false);
        };

        fetchAnnouncements();
    }, []);

    if (loading) {
        return <ActivityIndicator style={{ marginTop: 20 }} />;
    }

    if (announcements.length === 0) {
        return (
            <View style={styles.container}>
                <Text>No announcements available.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={announcements}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.announcementItem}>
                        <Text style={styles.message}>{item.message}</Text>
                        <Text style={styles.date}>
                            {new Date(item.created_at).toLocaleString()}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    announcementItem: {
        backgroundColor: "white",
        padding: 15,
        marginBottom: 12,
        borderRadius: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    message: {
        fontSize: 16,
        marginBottom: 8,
    },
    date: {
        fontSize: 12,
        color: "#666",
    },
});
