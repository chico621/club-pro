import { useEffect, useState } from "react";
import { View, ActivityIndicator, FlatList, StyleSheet, Alert } from "react-native";
import { H1, Muted } from "@/components/ui/typography";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { supabase } from "@/config/supabase";
import { router } from "expo-router";

export default function MyBookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchBookings = async () => {
        setLoading(true);
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("bookings")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (!error && data) {
            setBookings(data);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Booking",
            "Are you sure you want to delete this booking?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setDeletingId(id);
                        const { error } = await supabase.from("bookings").delete().eq("id", id);
                        if (error) {
                            Alert.alert("Error", "Failed to delete booking.");
                        } else {
                            setBookings((prev) => prev.filter((b) => b.id !== id));
                        }
                        setDeletingId(null);
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleEdit = (id: string) => {
        // Navigate to your edit booking screen
        // Example: router.push(`/edit-booking/${id}`);
        Alert.alert("Edit Booking", `Edit booking with id: ${id}`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <H1>My Bookings</H1>
            </View>

            {loading ? (
                <ActivityIndicator size="large" />
            ) : bookings.length === 0 ? (
                <Muted>No bookings found.</Muted>
            ) : (
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.bookingCard}>
                            <View style={styles.bookingInfo}>
                                <Text style={styles.bookingType}>{item.appointment_type}</Text>
                                <Muted style={styles.bookingDate}>
                                    {item.appointment_date} @ {item.appointment_time}
                                </Muted>
                            </View>

                            <View style={styles.buttonsRow}>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    style={styles.buttonMargin}
                                    onPress={() => handleEdit(item.id)}
                                >
                                    <Text>Edit</Text>
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onPress={() => handleDelete(item.id)}
                                >
                                    <Text>Delete</Text>
                                </Button>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
    },
    header: {
        marginTop: 60,
        marginBottom: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    bookingCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        backgroundColor: "#f9f9f9",
    },
    bookingInfo: {
        flexShrink: 1,
    },
    bookingType: {
        fontWeight: "600",
        textTransform: "capitalize",
        fontSize: 16,
    },
    bookingDate: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 4,
    },
    buttonsRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    buttonMargin: {
        marginRight: 8,
    },
});
