import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, TouchableOpacity, Switch } from "react-native";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/supabase-provider";
import { supabase } from "@/config/supabase";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useColorScheme } from "@/lib/useColorScheme";

const APP_VERSION = "1.0.0"; // keep in sync with app.json

export default function Settings() {
	const { signOut, session } = useAuth();
	const { colorScheme, toggleColorScheme } = useColorScheme();
	const [userDetails, setUserDetails] = useState<any>(null);
	const [clubName, setClubName] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

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
				if (data.club_id) {
					const { data: club, error: clubError } = await supabase
						.from("clubs")
						.select("name")
						.eq("id", data.club_id)
						.single();
					if (!clubError && club?.name) setClubName(club.name);
				}
			}
			setLoading(false);
		}
		fetchUser();
	}, [session]);

	const handleSignOut = async () => {
		setShowSignOutConfirm(false);
		await signOut();
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<Text>Loading...</Text>
			</View>
		);
	}

	const initials = userDetails?.full_name
		? userDetails.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
		: "?";

	return (
		<View style={styles.screen}>
			<View style={styles.card}>
				<H1 style={styles.heading}>{userDetails?.full_name || "Not set"}</H1>
				<View style={styles.roleBadgeRow}>
					<View style={styles.roleBadge}>
						<MaterialIcons name="verified-user" size={16} color="#fff" />
						<Text style={styles.roleBadgeText}>{userDetails?.role?.toUpperCase()}</Text>
					</View>
				</View>
				<Text style={styles.text}><MaterialIcons name="email" size={16} color="#2e8b57" />  {userDetails?.email}</Text>
				{clubName && (
					<Text style={styles.text}><MaterialIcons name="group" size={16} color="#2e8b57" />  Club: {clubName}</Text>
				)}
			</View>

			{/* Sign out */}
			<View style={styles.card}>
				<Muted style={styles.mutedText}>Sign out and return to the welcome screen.</Muted>
				<Button
					style={styles.button}
					size="default"
					variant="destructive"
					onPress={() => setShowSignOutConfirm(true)}
				>
					<Text><MaterialIcons name="logout" size={18} color="#fff" />  Sign Out</Text>
				</Button>
			</View>

			{/* Sign out confirmation dialog */}
			{showSignOutConfirm && (
				<View style={styles.confirmOverlay}>
					<View style={styles.confirmBox}>
						<Text style={styles.confirmText}>Are you sure you want to sign out?</Text>
						<View style={styles.confirmActions}>
							<Button variant="outline" onPress={() => setShowSignOutConfirm(false)}><Text>Cancel</Text></Button>
							<Button variant="destructive" onPress={handleSignOut}><Text>Sign Out</Text></Button>
						</View>
					</View>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: "#f4f4f5",
		padding: 16,
		gap: 20,
	},
	card: {
		marginTop: 50,
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 24,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
	},
	avatarContainer: {
		flexDirection: "row",
		alignItems: "center",
		position: "relative",
		marginBottom: 8,
	},
	editBtnAbsolute: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#e6f4ea",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 6,
		position: "absolute",
		top: 0,
		right: 0,
		zIndex: 10,
	},
	editBtnText: {
		color: "#2e8b57",
		fontWeight: "600",
		marginLeft: 4,
	},
	roleBadgeRow: {
		alignItems: "center",
		marginBottom: 8,
	},
	roleBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#2e8b57",
		borderRadius: 12,
		paddingHorizontal: 10,
		paddingVertical: 2,
		marginTop: 4,
	},
	roleBadgeText: {
		color: "#fff",
		fontWeight: "600",
		fontSize: 13,
		marginLeft: 4,
		letterSpacing: 1,
	},
	text: {
		width: "100%",
		textAlign: "left",
		fontSize: 16,
		color: "#444444",
		paddingVertical: 8,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		marginLeft: 8,
		color: "#222",
	},
	versionText: {
		fontSize: 14,
		color: "#888",
		fontWeight: "500",
	},
	rowBetween: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 4,
	},
	mutedText: {
		textAlign: "center",
		color: "#888888",
		marginTop: 8,
		marginBottom: 8,
		fontStyle: "italic",
	},
	button: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#d32f2f",
		paddingVertical: 16,
		borderRadius: 8,
		shadowColor: "#d32f2f",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 4,
		marginTop: 8,
	},
	confirmOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.2)",
		alignItems: "center",
		justifyContent: "center",
		zIndex: 100,
	},
	confirmBox: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 24,
		alignItems: "center",
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 4 },
	},
	confirmText: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 16,
		color: "#222",
	},
	confirmActions: {
		flexDirection: "row",
		gap: 16,
	},
	loadingContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#f4f4f5",
		padding: 16,
	},
	heading: {
		textAlign: "center",
		fontSize: 32,
		fontWeight: "600",
		color: "#222222",
		marginBottom: 0,
		letterSpacing: 0.5,
	},
});