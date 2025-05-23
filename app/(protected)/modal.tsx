import React, { useEffect, useState } from "react";
import { View, Platform, Text as RNText, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { supabase } from "@/config/supabase";
import { useAuth } from "@/context/supabase-provider";
import { useLocalSearchParams } from "expo-router";

const appointmentLabels: Record<string, string> = {
	wellness: "Wellness Evaluation",
	club: "First Club Visit",
	ambassador: "Ambassador Opportunity Call",
};

export default function BookingScreen() {
	const { session } = useAuth();
	const { type } = useLocalSearchParams<{ type: string }>();
	const appointmentType = appointmentLabels[type ?? ""] || "Wellness Evaluation";

	const [userName, setUserName] = useState<string | null>(null);
	const [step, setStep] = useState<"date" | "time" | "summary">("date");
	const [date, setDate] = useState(new Date());
	const [tempDate, setTempDate] = useState(date);
	const [time, setTime] = useState<Date | null>(null);
	const [tempTime, setTempTime] = useState(new Date());

	useEffect(() => {
		async function fetchUserDetails() {
			if (!session?.user?.id) return;

			const { data, error } = await supabase
				.from("users")
				.select("full_name")
				.eq("id", session.user.id)
				.single();

			if (error) {
				console.error("Error fetching user full_name:", error);
				setUserName(null);
			} else {
				setUserName(data?.full_name ?? null);
			}
		}

		fetchUserDetails();
	}, [session]);

	const snapTo30Minutes = (selectedTime: Date) => {
		const snapped = new Date(selectedTime);
		const mins = snapped.getMinutes();
		if (mins < 15) snapped.setMinutes(0);
		else if (mins < 45) snapped.setMinutes(30);
		else {
			snapped.setHours(snapped.getHours() + 1);
			snapped.setMinutes(0);
		}
		snapped.setSeconds(0);
		snapped.setMilliseconds(0);
		return snapped;
	};

	const isFutureDateTime = (d: Date, t: Date) => {
		const fullDateTime = new Date(
			d.getFullYear(),
			d.getMonth(),
			d.getDate(),
			t.getHours(),
			t.getMinutes(),
			0,
			0
		);
		return fullDateTime > new Date();
	};

	const handleBack = () => {
		if (step === "time") setStep("date");
		else if (step === "summary") setStep("time");
	};

	return (
		<View className="flex-1 justify-start items-center gap-y-6 p-4 bg-white">
			<View className="items-center mb-4">
				<RNText className="text-xl font-bold mt-10">Confirm Booking</RNText>
				<Text className="text-muted-foreground text-center">
					You are booking a <Text className="font-semibold">{appointmentType}</Text>
				</Text>
			</View>

			{step === "date" && (
				<>
					<RNText className="text-lg">Select a Date</RNText>
					<DateTimePicker
						value={tempDate}
						mode="date"
						display={Platform.OS === "ios" ? "spinner" : "default"}
						onChange={(e, selected) => selected && setTempDate(selected)}
					/>
					<Button
						onPress={() => {
							setDate(tempDate);
							setStep("time");
						}}
					>
						<Text>Next</Text>
					</Button>
				</>
			)}

			{step === "time" && (
				<>
					<RNText className="text-lg">Select a Time</RNText>
					<DateTimePicker
						value={tempTime}
						mode="time"
						display={Platform.OS === "ios" ? "spinner" : "default"}
						onChange={(e, selected) => selected && setTempTime(selected)}
						minuteInterval={30}
					/>
					<View className="flex-row gap-x-4 mt-4">
						<Button variant="outline" onPress={handleBack}>
							<Text>Back</Text>
						</Button>
						<Button
							onPress={() => {
								const snapped = snapTo30Minutes(tempTime);
								if (!isFutureDateTime(date, snapped)) {
									Alert.alert("Invalid Time", "Please choose a time in the future.");
									return;
								}
								setTime(snapped);
								setStep("summary");
							}}
						>
							<Text>Next</Text>
						</Button>
					</View>
				</>
			)}

			{step === "summary" && time && (
				<View className="items-center gap-y-4">
					<Text>Date: {date.toDateString()}</Text>
					<Text>
						Time:{" "}
						{time.toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</Text>
					<View className="flex-row gap-x-4">
						<Button variant="outline" onPress={handleBack}>
							<Text>Back</Text>
						</Button>
						<Button
							onPress={() => {
								if (!isFutureDateTime(date, time)) {
									Alert.alert("Invalid Time", "Please choose a time in the future.");
									return;
								}

								const formattedDate = date.toISOString().split("T")[0];
								const formattedTime = time.toTimeString().slice(0, 5);

								console.log("📦 Backend-ready booking data:");
								console.log({
									user: userName ?? "Unknown User",
									appointmentType,
									date: formattedDate,
									time: formattedTime,
								});

								alert("Booking confirmed!");
							}}
						>
							<Text>Confirm Booking</Text>
						</Button>
					</View>
				</View>
			)}
		</View>
	);
}
