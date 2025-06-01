import { useState, useCallback, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/config/supabase";
import { useFocusEffect } from "expo-router";

interface ClubVisit {
    club_id: string;
    visit_time: string;
}

interface ClubInfo {
    id: string;
    name: string;
}

const STORAGE_KEY_VISITS = "cached_visits_by_club";
const STORAGE_KEY_CLUB_NAMES = "cached_club_names";

export default function VisitCountScreen() {
    const [visitsByClub, setVisitsByClub] = useState<Record<string, number>>({});
    const [clubNames, setClubNames] = useState<Record<string, string>>({});

    // Load cached data on mount immediately
    useEffect(() => {
        async function loadCache() {
            try {
                const cachedVisits = await AsyncStorage.getItem(STORAGE_KEY_VISITS);
                const cachedClubs = await AsyncStorage.getItem(STORAGE_KEY_CLUB_NAMES);

                if (cachedVisits) setVisitsByClub(JSON.parse(cachedVisits));
                if (cachedClubs) setClubNames(JSON.parse(cachedClubs));
            } catch (e) {
                console.warn("Failed to load cache:", e);
            }
        }
        loadCache();
    }, []);

    const fetchVisits = async () => {
        try {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                console.warn("No user found");
                return;
            }

            // Get all visits for this user
            const { data: visits, error: visitError } = await supabase
                .from("user_visits")
                .select("club_id, visit_time")
                .eq("user_id", user.id);

            if (visitError || !visits) {
                console.error("Error fetching visits:", visitError);
                return;
            }

            // Count visits per club_id
            const visitCounts: Record<string, number> = {};
            visits.forEach((visit) => {
                visitCounts[visit.club_id] = (visitCounts[visit.club_id] || 0) + 1;
            });

            // Get club names from clubs table
            const uniqueClubIds = Object.keys(visitCounts);
            const { data: clubs, error: clubError } = await supabase
                .from("clubs")
                .select("id, name")
                .in("id", uniqueClubIds);

            if (clubError || !clubs) {
                console.error("Error fetching club names:", clubError);
                return;
            }

            const clubNameMap: Record<string, string> = {};
            clubs.forEach((club) => {
                clubNameMap[club.id] = club.name;
            });

            // Update state and cache
            setVisitsByClub(visitCounts);
            setClubNames(clubNameMap);

            await AsyncStorage.setItem(STORAGE_KEY_VISITS, JSON.stringify(visitCounts));
            await AsyncStorage.setItem(STORAGE_KEY_CLUB_NAMES, JSON.stringify(clubNameMap));
        } catch (e) {
            console.error("Error fetching visits or clubs:", e);
        }
    };

    // Refetch on screen focus
    useFocusEffect(
        useCallback(() => {
            fetchVisits();
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Visit Stats</Text>
            {Object.entries(visitsByClub).map(([clubId, count]) => (
                <View key={clubId} style={styles.row}>
                    <Text style={styles.clubName}>
                        {clubNames[clubId] || "Unknown Club"}
                    </Text>
                    <Text style={styles.visitCount}>Visits: {count}</Text>

                    {count % 10 === 0 && count !== 0 && (
                        <Text style={styles.reviewReminder}>It’s time to book a review!</Text>
                    )}
                </View>
            ))}
            {Object.keys(visitsByClub).length === 0 && (
                <Text>No visits yet.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, marginTop: 60 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    row: { marginBottom: 12 },
    clubName: { fontSize: 18, fontWeight: "600" },
    visitCount: { fontSize: 16, color: "#555" },
    reviewReminder: {
        marginTop: 4,
        color: "#d97706", // amber-600
        fontSize: 16,
        fontWeight: "500",
    },
});
