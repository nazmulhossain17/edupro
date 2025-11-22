import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle"; // your drizzle instance
import { schema } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "@/email/send-email";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: schema
    }),
    emailVerification: {
        sendVerificationEmail: async ({url, user}) =>{
            await sendEmail(url, user);
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false
    },
    plugins: [nextCookies()]
});