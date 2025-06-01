import { useEffect, useState } from "react";
import {
    FlatList,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "@/components/safe-area-view";
import { H1 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/context/supabase-provider";
import { supabase } from "@/config/supabase";
import BackButton from "../../components/backButton"; // your back button

export default function JoinClub() {
    const { session } = useAuth();
    const userId = session?.user?.id;

    const [clubs, setClubs] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        const fetchClubs = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("clubs")
                .select("*")
                .ilike("name", `%${search}%`);

            if (error) console.error(error.message);
            setClubs(data || []);
            setLoading(false);
        };

        fetchClubs();
    }, [search]);

    const handleJoin = async () => {
        if (!selected || !userId) return;

        setJoining(true);
        const { error } = await supabase
            .from("users")
            .update({ club_id: selected.id })
            .eq("id", userId);

        if (error) {
            console.error("Join failed:", error.message);
        } else {
            alert(`Welcome to ${selected.name}!`);
        }
        setJoining(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <BackButton />

            <H1 style={styles.header}>Join a Club</H1>

            <TextInput
                placeholder="Search for clubs..."
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
                placeholderTextColor="#888"
            />

            {loading ? (
                <ActivityIndicator size="large" style={styles.loader} />
            ) : (
                <FlatList
                    data={clubs}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No clubs found.</Text>
                    }
                    renderItem={({ item }) => {
                        const isSelected = selected?.id === item.id;

                        return (
                            <TouchableOpacity
                                onPress={() => setSelected(item)}
                                style={[styles.clubItem, isSelected && styles.clubItemSelected]}
                            >
                                <Text style={styles.clubName}>{item.name}</Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}

            {selected && (
                <View style={styles.joinButtonContainer}>
                    <Button onPress={handleJoin} disabled={joining}>
                        <Text style={styles.joinButtonText}>
                            {joining ? "Joining..." : `Join ${selected.name}`}
                        </Text>
                    </Button>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F9FAFB", // example light background
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    header: {
        marginBottom: 24,
        textAlign: "center",
    },
    searchInput: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#D1D5DB", // Tailwind gray-300
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 16,
        color: "#111827", // Tailwind gray-900
    },
    loader: {
        marginTop: 40,
    },
    emptyText: {
        marginTop: 40,
        textAlign: "center",
        color: "#6B7280", // Tailwind gray-500
    },
    clubItem: {
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB", // Tailwind gray-200
        borderRadius: 16,
        backgroundColor: "#fff",
    },
    clubItemSelected: {
        backgroundColor: "rgba(59, 130, 246, 0.1)", // Tailwind primary/10
        borderColor: "#3B82F6", // Tailwind blue-500
    },
    clubName: {
        fontSize: 16,
        fontWeight: "500",
        color: "#111827",
    },
    joinButtonContainer: {
        marginTop: 32,
    },
    joinButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});
