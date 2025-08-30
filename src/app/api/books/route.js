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