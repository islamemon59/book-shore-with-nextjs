import { collectionObj, dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const booksCollection = await dbConnect(collectionObj.booksCollection);
    const result = await booksCollection
      .aggregate([
        {
          $group: {
            _id: "$genre",
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ])
      .toArray();
    return NextResponse.json(result);
  } catch (error) {
    console.log("Failed to fetch genres:", error);
    return NextResponse.json(
      { error: "Failed to fetch genres", details: error.message },
      { status: 500 }
    );
  }
}
