import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { collectionObj, dbConnect } from "@/lib/dbConnect";


export async function POST(request) {
  try {
    const data = await request.json();

    const { name, email, password, photo } = data;

    const userCollection = await dbConnect(collectionObj.userCollection);

    // Check if user already exists
    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 }
      );
    }

    // Hash the password and create the new user document
    const hashedPassword = await hash(password, 12);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      photo: photo || null,
      role: "user", // Assign a default role
      createdAt: new Date(),
    };

    const createdUser = await userCollection.insertOne(newUser);

    return NextResponse.json(
      { message: "Registration successful!", userId: createdUser.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error during registration:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
