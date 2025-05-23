import React from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';

import { useColorScheme } from "@/lib/useColorScheme";
import { colors } from "@/constants/colors";

export default function TabsLayout() {
	const { colorScheme } = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor:
						colorScheme === "dark"
							? colors.dark.background
							: colors.light.background,
					borderTopWidth: 0,
					elevation: 0,
				},
				tabBarActiveTintColor: "black", // Text color when active
				tabBarInactiveTintColor: "gray", // Text color when inactive
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "500",
					marginBottom: 4,
				},
				tabBarItemStyle: {
					paddingVertical: 8,
				},
				tabBarShowLabel: true,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ focused }) => (
						<MaterialIcons
							name="home"
							size={20}
							color={focused ? "black" : "gray"}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="myClub"
				options={{
					title: "My Club",
					tabBarIcon: ({ focused }) => (
						<MaterialIcons
							name="people-alt"
							size={20}
							color={focused ? "black" : "gray"}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="booking"
				options={{
					title: "Booking",
					tabBarIcon: ({ focused }) => (
						<AntDesign
							name="book"
							size={20}
							color={focused ? "black" : "gray"}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Settings",
					tabBarIcon: ({ focused }) => (
						<MaterialIcons
							name="settings"
							size={20}
							color={focused ? "black" : "gray"}
						/>
					),
				}}
			/>
		</Tabs>
	);
}