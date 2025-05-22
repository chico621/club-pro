import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { SplashScreen, useRouter } from "expo-router";

import { Session, User } from "@supabase/supabase-js"; // Add the

import { supabase } from "@/config/supabase";

SplashScreen.preventAutoHideAsync();

type AuthState = {
	initialized: boolean;
	session: Session | null;
	user: User | null;
	signUp: (email: string, password: string, fullName: string) => Promise<void>;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthState>({
	initialized: false,
	session: null,
	user: null,
	signUp: async () => { },
	signIn: async () => { },
	signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: PropsWithChildren) {
	const [initialized, setInitialized] = useState(false);
	const [session, setSession] = useState<Session | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const router = useRouter();

	const signUp = async (email: string, password: string, fullName: string) => {
		const { data, error } = await supabase.auth.signUp({ email, password });

		if (error) {
			console.error("Error signing up:", error);
			throw error;
		}

		if (data.user) {
			const { error: insertError } = await supabase.from("users").insert({
				id: data.user.id,
				email: data.user.email,
				role: "member",
				full_name: fullName,
			});

			if (insertError) {
				console.error("Error inserting user profile:", insertError);
				throw insertError;
			}

			setSession(data.session);
			console.log("User signed up:", data.user);
		}
	};


	const signIn = async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error("Error signing in:", error);
			return;
		}

		if (data.session) {
			setSession(data.session);
			console.log("User signed in:", data.user);
		} else {
			console.log("No user returned from sign in");
		}
	};

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error("Error signing out:", error);
			return;
		} else {
			console.log("User signed out");
		}
	};

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setUser(session?.user ?? null);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
		});

		setInitialized(true);
	}, []);

	useEffect(() => {
		if (initialized) {
			SplashScreen.hideAsync();
			if (session) {
				router.replace("/");
			} else {
				router.replace("/welcome");
			}
		}
		// eslint-disable-next-line
	}, [initialized, session]);

	return (
		<AuthContext.Provider
			value={{
				initialized,
				session,
				user,
				signUp,
				signIn,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
