import { authOptions } from "@/lib/authOptions";
import { collectionObj, dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, email, image } = body;

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email required" },
      { status: 400 }
    );
  }

  const userDataCollection = await dbConnect(collectionObj.userCollection);

  const result = await userDataCollection.findOneAndUpdate(
    { email: session.user.email },
    { $set: { name, email, image } },
    { returnDocument: "after" }
  );

  // Check if a document was found and updated
  if (!result) {
    return NextResponse.json(
      { error: "User not found or not authorized to update" },
      { status: 404 } // Use 404 Not Found for resource not found
    );
  }

  return NextResponse.json({ success: true, user: result });
}
