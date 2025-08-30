import { collectionObj, dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const booksCollection = await dbConnect(collectionObj.booksCollection);
    const books = await booksCollection.find().toArray();
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch books" },
      {
        status: 500,
      }
    );
  }
}
