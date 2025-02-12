import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import axiosInstance from "@/utils/axios";
import { jwtDecode } from "jwt-decode";

export interface IRole {
	userRoleId: number;
	userRoleName: string;
}

export interface DecodedAccessToken {
	sub: number;
	username: string;
	fullName: string;
	role: string;
	iat: number;
	exp: number;
	aud: string;
	iss: string;
}

declare module "next-auth/jwt" {
	interface JWT {
		accessToken: string;
		refreshToken: string;
		role?: string;
	}
}

declare module "next-auth" {
	interface Session {
		error?: string;
		accessToken: string;
		refreshToken: string;
		role?: string;
		user: {} & DefaultSession["user"];
	}
	interface User {
		accessToken: string;
		refreshToken: string;
		error?: string;
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			credentials: {
				username: {
					label: "Username",
					type: "text",
					placeholder: "Enter your username.",
				},
				password: { label: "Password", type: "password" },
				deviceId: { type: "text" },
			},
			authorize: async (credentials) => {
				try {
					console.log("credentials: ", credentials);
					// send credentials to backend
					const res = await axiosInstance.post("/user/login", {
						username: credentials.username,
						password: credentials.password,
					});

					// handle unauthorized
					if (res.status === 200) {
						return res.data;
					}
					// Non-200 => fail
					throw new Error("Failed login");
				} catch (error: any) {
					if (error.response?.status === 401) {
						throw new Error("Invalid credentials");
					}
					// other cases
					throw new Error("Unknown error");
				}
			},
		}),
	],
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async jwt({ token, user, trigger, session }) {
			console.log("come here - 123456789");
			console.log("user: ", user);
			console.log("trigger: ", trigger);
			console.log("session: ", session);
			console.log("token: ", token);
			if (user) {
				console.log("user88: ", user);
				if (user.error) {
					console.log("user.error: ", user.error);
					return { error: user.error };
				}
				// Decode the tokens to retrieve user info
				const decodedAccessToken = jwtDecode<DecodedAccessToken>(
					user.accessToken
				);

				return {
					...token,
					...user,
					role: decodedAccessToken.role,
					id: decodedAccessToken.sub,
					name: decodedAccessToken.fullName,
				};
			}
			if (trigger === "update") {
				console.log("session: ", session);
				console.log("token: ", token);
				return {
					...token,
					...session,
				};
			}
			return token;
		},
		async session({ token, session }) {
			console.log("come here - 2222222");
			console.log("token: ", token);
			console.log("session: ", session);
			session = { ...session, ...token };
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
});
