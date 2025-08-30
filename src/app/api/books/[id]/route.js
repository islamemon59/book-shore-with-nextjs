import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';
import { collectionObj, dbConnect } from "@/lib/dbConnect";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
    }

    const booksCollection = await dbConnect(collectionObj.booksCollection);
    const book = await booksCollection.findOne({ _id: new ObjectId(id) });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error("Failed to fetch book:", error);
    return NextResponse.json(
      { error: "Failed to fetch book details" },
      { status: 500 }
    );
  }
}