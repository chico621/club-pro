import { useState } from "react";
import { View, TextInput, Alert } from "react-native";
import { router } from "expo-router";

import { supabase } from "@/config/supabase";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";

export default function AddAnnouncement() {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!title || !message) {
            Alert.alert("Please fill in all fields.");
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

        const { error } = await supabase.from("announcements").insert([
            {
                title,
                message,
                created_by: user.id,
            },
        ]);

        setLoading(false);

        if (error) {
            Alert.alert("Error", error.message);
        } else {
            Alert.alert("Success", "Announcement added!");
            router.back(); // or router.push("/(protected)/announcements");
        }
    };

    return (
        <View className="flex-1 p-4 bg-background">
            <H1 className="mb-4 text-center">Add Announcement</H1>

            <TextInput
                className="border border-gray-300 rounded-md p-2 mb-4 text-base"
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                className="border border-gray-300 rounded-md p-2 mb-4 text-base h-32 text-start"
                placeholder="Message"
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
