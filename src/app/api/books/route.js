import { collectionObj, dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";

    // The query is fine, no changes needed here
    const query = search ? { title: { $regex: search, $options: "i" } } : {};

    const booksCollection = await dbConnect(collectionObj.booksCollection);
    const books = await booksCollection.find(query).toArray();

    return NextResponse.json(books);
  } catch (error) {
    console.error("Failed to fetch books in API:", error); // Use console.error for better visibility
    return NextResponse.json(
      { error: "Failed to fetch books", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, author, description, price, discount, genre, coverImage } =
      body;
    const booksCollection = await dbConnect(collectionObj.booksCollection);
    const newBook = {
      title,
      author,
      description,
      price: Number(price),
      discount: Number(discount),
      genre,
      coverImage,
    };
    const result = await booksCollection.insertOne(newBook);
    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("Failed to add book:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add book", details: error.message },
      { status: 500 }
    );
  }
}
