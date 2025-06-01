import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { supabase } from "@/config/supabase";
import BackButton from "../../components/backButton";
import { useRouter } from "expo-router";

interface Booking {
    id: string;
    user_id: string;
    appointment_type: string;
    appointment_date: string; // YYYY-MM-DD
    appointment_time: string; // HH:mm
    duration_minutes: number;
    created_at: string;
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });

    const getSuffix = (n: number) => {
        if (n >= 11 && n <= 13) return "th";
        switch (n % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    };

    return `${day}${getSuffix(day)} ${month}`;
}

export default function CalendarScreen() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});

    useEffect(() => {
        async function fetchBookings() {
            const { data, error } = await supabase
                .from("bookings")
                .select("*")
                .order("appointment_date", { ascending: true });

            if (error) {
                console.error("Error loading bookings:", error);
                return;
            }

            if (data) {
                setBookings(data);
            }
        }

        fetchBookings();
    }, []);

    useEffect(() => {
        const marks: { [key: string]: any } = {};

        bookings.forEach((booking) => {
            const date = booking.appointment_date;
            if (marks[date]) {
                marks[date].dots.push({ key: booking.id, color: "blue" });
            } else {
                marks[date] = {
                    dots: [{ key: booking.id, color: "blue" }],
                };
            }
        });

        if (marks[selectedDate]) {
            marks[selectedDate].selected = true;
            marks[selectedDate].selectedColor = "orange";
        } else {
            marks[selectedDate] = {
                selected: true,
                selectedColor: "orange",
            };
        }

        setMarkedDates(marks);
    }, [bookings, selectedDate]);

    const bookingsForDate = bookings.filter(
        (b) => b.appointment_date === selectedDate
    );

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <View style={styles.backButtonWrapper}>
                <BackButton />
            </View>

            <View style={styles.calendarWrapper}>
                <Calendar
                    markingType={"multi-dot"}
                    markedDates={markedDates}
                    onDayPress={(day) => setSelectedDate(day.dateString)}
                    theme={{
                        backgroundColor: "#fff",
                        calendarBackground: "#fff",
                        textSectionTitleColor: "#000",
                        selectedDayBackgroundColor: "#ffa726",
                        selectedDayTextColor: "#fff",
                        todayTextColor: "#ffa726",
                        dayTextColor: "#2d4150",
                        arrowColor: "#ffa726",
                        monthTextColor: "#000",
                    }}
                />
            </View>

            <View style={styles.bookingsContainer}>
                <Text style={styles.heading}>
                    Bookings for {formatDate(selectedDate)}
                </Text>

                {bookingsForDate.length === 0 ? (
                    <Text>No bookings on this day.</Text>
                ) : (
                    <FlatList
                        data={bookingsForDate}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.bookingItem}>
                                <Text style={styles.bookingTitle}>
                                    {item.appointment_type}
                                </Text>
                                <Text>Time: {item.appointment_time}</Text>
                                <Text>Duration: {item.duration_minutes} minutes</Text>
                            </View>
                        )}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f6f6f6",
    },
    backButtonWrapper: {
        position: "absolute",
        top: 50,
        left: 20,
        zIndex: 10,
        padding: 10,
        backgroundColor: "transparent",
    },
    calendarWrapper: {
        marginHorizontal: 16,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        marginTop: 110, // <-- shift calendar down to clear the back button
    },
    bookingsContainer: {
        padding: 16,
        flex: 1,
    },
    heading: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 10,
    },
    bookingItem: {
        backgroundColor: "white",
        padding: 15,
        marginBottom: 10,
        borderRadius: 16,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    bookingTitle: {
        fontWeight: "bold",
        fontSize: 16,
    },
});