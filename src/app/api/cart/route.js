import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { collectionObj, dbConnect } from "@/lib/dbConnect";
import { authOptions } from "@/lib/authOptions";


export async function POST(req) {
  try {
    // 1. Check user session
    const session = await getServerSession(authOptions);
    console.log(session);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get request body
    const {
      bookId,
      quantity,
      title,
      price,
      discount,
      imageURL,
      author,
      genre,
    } = await req.json();
    if (!bookId) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    // 3. Connect to DB
    const cartCollection = await dbConnect(collectionObj.cartDataCollection);

    // 4. Check if this book already exists in user's cart
    const existing = await cartCollection.findOne({
      userEmail: session.user.email,
      bookId,
    });

    if (existing) {
      // If already exists, update quantity
      await cartCollection.updateOne(
        { _id: existing._id },
        { $inc: { quantity: quantity || 1 } }
      );
    } else {
      // If not, insert new
      await cartCollection.insertOne({
        userEmail: session.user.email,
        bookId,
        quantity: quantity || 1,
        title,
        price,
        discount,
        imageURL,
        author,
        genre,
        addedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Book added to cart",
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
    console.log(session);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  console.log("session user email",user);
  const cartCollection = await dbConnect(collectionObj.cartDataCollection);
  const cartItems = await cartCollection.find({ userEmail: session.user.email }).toArray();

  return NextResponse.json(cartItems);
}
