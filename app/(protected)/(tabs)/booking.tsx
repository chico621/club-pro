import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";

const appointmentOptions = [
    { label: "Wellness Evaluation", value: "wellness" },
    { label: "First Club Visit", value: "club" },
    { label: "Ambassador Opportunity Call", value: "ambassador" },
];

export default function Booking() {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
            <H1 className="text-center">Bookings</H1>
            <Muted className="text-center">
                Book today and get a free consultation with our nutritionist.
            </Muted>

            {appointmentOptions.map((option) => (
                <Button
                    key={option.value}
                    variant="outline"
                    className={`w-full ${selected === option.value ? "bg-green-600 border-green-600" : ""
                        }`}
                    onPress={() => setSelected(option.value)}
                >
                    <Text className={selected === option.value ? "text-white" : ""}>
                        {option.label}
                    </Text>
                </Button>
            ))}
            <Muted className="text-center">
                By booking, you agree to our{" "}
                <Text className="text-blue-500">Terms of Service</Text> and{" "}
                <Text className="text-blue-500">Privacy Policy</Text>.
                <Text className="text-blue-500">Learn more</Text>.
            </Muted>

            <Button
                className="w-full"
                disabled={!selected}
                onPress={() =>
                    router.push({
                        pathname: "/(protected)/modal",
                        params: { type: selected },
                    })
                }
            >
                <Text>Continue</Text>
            </Button>
        </View>
    );
}
