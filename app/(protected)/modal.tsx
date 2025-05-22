import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { View, Alert, TextInput } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";

export default function BookingModal() {
	const { type } = useLocalSearchParams();
	const [name, setName] = useState("");
	const [date, setDate] = useState(""); // e.g. "2025-06-03"
	const [time, setTime] = useState(""); // e.g. "14:00"

	const handleConfirm = () => {
		if (!name || !date || !time) {
			Alert.alert("Missing info", "Please enter your name, date, and time.");
			return;
		}

		// Basic validation for date and time format (YYYY-MM-DD and HH:MM)
		const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
		const timeRegex = /^\d{2}:\d{2}$/;

		if (!dateRegex.test(date)) {
			Alert.alert("Invalid Date", "Date must be in format YYYY-MM-DD.");
			return;
		}

		if (!timeRegex.test(time)) {
			Alert.alert("Invalid Time", "Time must be in format HH:MM (24-hour).");
			return;
		}

		// TODO: Save these fields separately in your database
		Alert.alert(
			"Booking Confirmed",
			`Thanks ${name}, you booked a ${type} on ${date} at ${time}.`
		);

		router.back();
	};

	return (
		<View className="flex-1 justify-center p-6 gap-y-4 bg-background">
			<H1 className="text-center">Confirm Booking</H1>
			<Text className="text-center">
				You're booking: <Text className="font-bold">{type}</Text>
			</Text>

			<TextInput
				placeholder="Your Name"
				className="border p-3 rounded-md bg-white"
				value={name}
				onChangeText={setName}
			/>

			<TextInput
				placeholder="Date (YYYY-MM-DD)"
				className="border p-3 rounded-md bg-white"
				keyboardType="numbers-and-punctuation"
				value={date}
				onChangeText={setDate}
			/>

			<TextInput
				placeholder="Time (HH:MM, 24-hour)"
				className="border p-3 rounded-md bg-white"
				keyboardType="numbers-and-punctuation"
				value={time}
				onChangeText={setTime}
			/>

			<Button onPress={handleConfirm}>
				<Text>Confirm Booking</Text>
			</Button>

			<Button variant="outline" onPress={() => router.back()}>
				<Text>Cancel</Text>
			</Button>
		</View>
	);
}
