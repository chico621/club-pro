import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { Image } from "@/components/image";
import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

export default function WelcomeScreen() {
	const router = useRouter();
	const { colorScheme } = useColorScheme();
	const appIcon =
		colorScheme === "dark"
			? require("@/assets/icon.png")
			: require("@/assets/icon-dark.png");

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.mainContainer}>
				<Image source={appIcon} style={styles.appIcon} />
				<H1 style={styles.heading}> <H1 style={styles.headingHolborn}> Holborn </H1>Nutrition</H1>
				<Muted style={styles.mutedText}>
					A comprehensive starter project for developing React Native and Expo
					applications with Supabase as the backend.
				</Muted>
			</View>
			<View style={styles.buttonContainer}>
				<Button
					size="default"
					variant="default"
					onPress={() => {
						router.push("/sign-up");
					}}
				>
					<Text>Sign Up</Text>
				</Button>
				<Button
					size="default"
					variant="secondary"
					onPress={() => {
						router.push("/sign-in");
					}}
				>
					<Text>Sign In</Text>
				</Button>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "white",
		padding: 16,
	},
	mainContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: 16,
		marginHorizontal: 16,
	},
	appIcon: {
		width: 64,
		height: 64,
		borderRadius: 8,
	},
	headingHolborn: {
		color: "#339966",
	},
	heading: {
		textAlign: "center",
	},
	mutedText: {
		textAlign: "center",
	},
	buttonContainer: {
		flexDirection: "column",
		gap: 16,
		marginHorizontal: 16,
	},
});