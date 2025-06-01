import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";

import { Image } from "@/components/image";
import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
	const router = useRouter();
	const { colorScheme } = useColorScheme();
	const appIcon =
		colorScheme === "dark"
	//	? require("@/assets/Herb.png")
	//	: require("@/assets/Herb.png");

	return (
		<SafeAreaView style={[styles.safeArea, colorScheme === "dark" && styles.darkBackground]}>
			{/* Top: App icon */}
			<View style={styles.topContainer}>
				{/*}	<Image source={appIcon} style={styles.appIcon} resizeMode="contain" /> */}
			</View>

			{/* Middle: Heading + Description */}
			<View style={styles.mainContainer}>
				<H1 style={styles.heading}>
					<H1 style={styles.headingHolborn}>Holborn </H1>
					Nutrition
				</H1>
				<Muted style={styles.mutedText}>
					Welcome to Holborn Nutrition — your companion for healthy living. Track
					your progress, get personalized tips, and connect with a community that
					cares.
				</Muted>
			</View>

			{/* Bottom: Buttons */}
			<View style={styles.buttonContainer}>
				<Muted style={styles.mutedText}>
					By signing up, you agree to our{" "}
					<Text style={{ color: "#339966" }}>Terms of Service</Text> and{" "}
					<Text style={{ color: "#339966" }}>Privacy Policy</Text>.
				</Muted>

				<Button
					size="default"
					variant="default"
					style={styles.primaryButton}
					onPress={() => {
						router.push("/sign-up");
					}}
				>
					<Text style={styles.primaryButtonText}>Sign Up</Text>
				</Button>
				<Button
					size="default"
					variant="secondary"
					style={styles.secondaryButton}
					onPress={() => {
						router.push("/sign-in");
					}}
				>
					<Text style={styles.secondaryButtonText}>Sign In</Text>
				</Button>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#f7f9fc",
		paddingHorizontal: 24,
		paddingTop: 32,
		paddingBottom: 40,
		justifyContent: "space-between",  // spread top, middle, bottom
	},
	darkBackground: {
		backgroundColor: "#121212",
	},
	topContainer: {
		alignItems: "center",
		marginBottom: 24,
	},
	appIcon: {
		width: "60%",
		height: 80,
		borderRadius: 12,
	},
	mainContainer: {
		flexShrink: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 20,
	},
	headingHolborn: {
		color: "#339966",
		fontWeight: "700",
	},
	heading: {
		fontSize: 32,
		textAlign: "center",
		color: "#222",
		marginBottom: 12,
	},
	mutedText: {
		fontSize: 16,
		textAlign: "center",
		color: "#555",
		maxWidth: 320,
		lineHeight: 22,
	},
	buttonContainer: {
		flexDirection: "column",
		gap: 20,
		paddingHorizontal: 16,
	},
	primaryButton: {
		backgroundColor: "#339966",
		borderRadius: 10,
		paddingVertical: 18,
		justifyContent: "center",  // vertically center content
		height: 45,                // explicit height
	},
	primaryButtonText: {
		color: "white",
		fontWeight: "600",
		fontSize: 16,
		lineHeight: 22,            // line height > font size
		textAlignVertical: "center",
	},
	secondaryButton: {
		borderColor: "#339966",
		borderWidth: 2,
		borderRadius: 10,
		paddingVertical: 18,
		justifyContent: "center",
		height: 45,
	},
	secondaryButtonText: {
		color: "#339966",
		fontWeight: "600",
		fontSize: 16,
		lineHeight: 22,
		textAlignVertical: "center",
	},
});
