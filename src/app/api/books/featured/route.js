import { collectionObj, dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const booksCollection = await dbConnect(collectionObj.booksCollection);

    const featuredBooks = await booksCollection
      .aggregate([{ $sample: { size: 6 } }])
      .toArray();

    return NextResponse.json(featuredBooks);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch featured books" },
      { status: 500 }
    );
  }
}
