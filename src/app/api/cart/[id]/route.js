import { authOptions } from "@/lib/authOptions";
import { collectionObj, dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { change } = await req.json();
  try {
    const cartDataCollection = await dbConnect(
      collectionObj.cartDataCollection
    );
    const result = await cartDataCollection.findOneAndUpdate(
      { _id: new ObjectId(id), userEmail: session?.user?.email },
      { $inc: { quantity: change } },
      { returnDocument: "after" }
    );
    if (result.value) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ remove: true });
  } catch (error) {
    console.error("Cart update error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const cartDataCollection = await dbConnect(collectionObj.cartDataCollection);
  const result = await cartDataCollection.deleteOne({
    _id: new ObjectId(id),
    userEmail: session.user.email,
  });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, deletedId: id });
}
