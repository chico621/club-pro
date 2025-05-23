import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";

import { supabase } from "@/config/supabase";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";

export default function Home() {
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		const fetchRole = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) return;

			const { data, error } = await supabase
				.from("users")
				.select("role")
				.eq("id", user.id)
				.single();

			if (!error && data?.role === "club_owner") {
				setIsAdmin(true);
			}
		};

		fetchRole();
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.headerCard}>
				<H1 style={styles.heading}>Welcome Back</H1>
				<Muted style={styles.subtext}>
					You are authenticated. Your session will persist even after closing the app.
				</Muted>
			</View>

			<View style={styles.mainCard}>
				<Button
					variant="default"
					size="default"
					onPress={() => router.push("/viewAnnouncement")}
				>
					<Text>View Announcements</Text>
				</Button>

				<Button
					variant="default"
					size="default"
					onPress={() => router.push("/JoinClub")}
				>
					<Text>Join a Club</Text>
				</Button>

				{isAdmin && (
					<Button
						variant="outline"
						size="default"
						onPress={() => router.push("/addAnnouncement")}
					>
						<Text>Add Announcement * ADMIN ONLY FEATURE *</Text>
					</Button>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 50,
		backgroundColor: "#f4f4f5",
		padding: 16,
		gap: 20,
	},
	headerCard: {
		backgroundColor: "white",
		padding: 20,
		borderRadius: 16,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
	},
	mainCard: {
		flex: 1,
		backgroundColor: "white",
		padding: 20,
		borderRadius: 16,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
		gap: 16,
	},
	heading: {
		fontSize: 24,
		textAlign: "center",
		color: "#111827",
	},
	subtext: {
		textAlign: "center",
		color: "#6b7280",
		marginTop: 8,
	},
});
