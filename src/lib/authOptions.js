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

        // If user does not exist, throw a specific error
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

          // If the user does not exist in the database, insert them
          if (!existingUser) {
            await userCollection.insertOne({
              name: user.name,
              email: user.email,
              image: user.image,
              role: "user", // Set default role
              createdAt: new Date(),
            });
          }
        }
        return true; // Allow sign-in for all valid users
      } catch (err) {
        console.error("Error in signIn callback:", err);
        return false; // Block sign-in on error
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
};
