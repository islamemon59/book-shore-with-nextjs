// Corrected authOptions.js file

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { collectionObj, dbConnect } from "./dbConnect";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const userCollection = await dbConnect(collectionObj.userCollection);
        const user = await userCollection.findOne({ email: credentials.email });

        if (!user) {
          throw new Error(
            "No user found with this email. Please register first."
          );
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Incorrect password.");
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image, // Ensure the image field is correctly returned
          role: user.role || "user",
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account.provider === "google") {
          const userCollection = await dbConnect(collectionObj.userCollection);
          const existingUser = await userCollection.findOne({
            email: user.email,
          });

          if (!existingUser) {
            await userCollection.insertOne({
              name: user.name,
              email: user.email,
              image: user.image,
              role: "user",
              createdAt: new Date(),
            });
          }
        }
        return true;
      } catch (err) {
        console.error("Error in signIn callback:", err);
        return false;
      }
    },
    async jwt({ token, user }) {
      // If a user object exists (i.e., this is the sign-in),
      // add the user's properties to the token.
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image; // Pass the image URL from the user to the token
      }
      return token;
    },
    async session({ session, token }) {
      // Always add properties from the token to the session object
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.image = token.image; // Pass the image URL from the token to the session
      return session;
    },
  },
};
