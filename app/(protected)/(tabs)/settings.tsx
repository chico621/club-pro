import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/supabase-provider";
import { supabase } from "@/config/supabase";

export default function Settings() {
	const { signOut, session } = useAuth();
	const [userDetails, setUserDetails] = useState<{ full_name: string; email: string; role: string } | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchUser() {
			if (!session?.user?.id) return;

			setLoading(true);
			const { data, error } = await supabase
				.from("users")
				.select("full_name, email, role, club_id")
				.eq("id", session.user.id)
				.single();

			if (error) {
				console.error("Error fetching user details:", error);
			} else {
				setUserDetails(data);
			}
			setLoading(false);
		}

		fetchUser();
	}, [session]);

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<Text>Loading...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* <H1 style={styles.heading}>User Profile</H1> */}
			{userDetails ? (
				<>

					<H1 style={styles.heading}> {userDetails.full_name || "Not set"}</H1>
					<Text style={styles.subheading}>{userDetails.role}</Text>
					<Text style={styles.text}>Email: {userDetails.email}</Text>
				</>
			) : (
				<Text style={styles.noUserText}>No user details found.</Text>
			)}

			<Muted style={styles.mutedText}>
				Sign out and return to the welcome screen.
			</Muted>
			<Button
				style={styles.button}
				size="default"
				variant="default"
				onPress={async () => {
					await signOut();
				}}
			>
				<Text>Sign Out</Text>
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#ffffff",
		padding: 16,
	},
	noUserText: {
		marginTop: 50,
	},
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#ffffff",
		padding: 32,
		gap: 24,
	},
	heading: {
		paddingTop: 40,
		textAlign: "center",
		fontSize: 32,
		fontWeight: "600",
		color: "#222222",
		marginBottom: 0,
		letterSpacing: 0.5,
	},
	subheading: {
		textAlign: "center",
		color: "#2e8b57",
		fontSize: 20,
		fontWeight: "500",
		textTransform: "uppercase",
		letterSpacing: 1,
		marginBottom: 24,
	},
	text: {
		width: "100%",
		textAlign: "center",
		fontSize: 16,
		color: "#444444",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	mutedText: {
		textAlign: "center",
		color: "#888888",
		marginTop: 16,
		marginBottom: 8,
		fontStyle: "italic",
	},
	button: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#2e8b57",
		paddingVertical: 16,
		borderRadius: 8,
		shadowColor: "#2e8b57",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 4,
		marginTop: 24,
	},
});