import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import { collectionObj, dbConnect } from "@/lib/dbConnect";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    console.log("user email", userEmail);

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartDataCollection = await dbConnect(
      collectionObj.cartDataCollection
    );
    const cartItems = await cartDataCollection.find({ userEmail }).toArray();

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("GET /api/cart error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
