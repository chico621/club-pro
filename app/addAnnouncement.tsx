import { useState } from "react";
import { View, TextInput, Alert } from "react-native";
import { router } from "expo-router";

import { supabase } from "@/config/supabase";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";

export default function AddAnnouncement() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!message) {
            Alert.alert("Please enter a message.");
            return;
        }

        setLoading(true);

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

        const { error } = await supabase.from("announcements").insert([
            {
                message,
                user_id: user.id,
                club_id: userData.club_id,
            },
        ]);

        setLoading(false);

        if (error) {
            Alert.alert("Error", error.message);
        } else {
            Alert.alert("Success", "Announcement added!");
            router.back();
        }
    };

    return (
        <View className="flex-1 p-4 bg-background">
            <H1 className="mb-4 text-center">Add Announcement</H1>

            <TextInput
                className="border border-gray-300 rounded-md p-2 mb-4 text-base h-32 text-start"
                placeholder="Write your announcement message here"
                value={message}
                onChangeText={setMessage}
                multiline
            />

            <Button onPress={handleSubmit} disabled={loading}>
                <Text>{loading ? "Posting..." : "Post Announcement"}</Text>
            </Button>
        </View>
    );
}
