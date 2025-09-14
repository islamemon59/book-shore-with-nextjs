import { authOptions } from "@/lib/authOptions";
import { collectionObj, dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "newest";
    const genre = searchParams.get("genre");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "6", 10);

    // Filters
    const searchFilter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { genre: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const sortQueryMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      priceLow: { price: 1 },
      priceHigh: { price: -1 },
    };

    const sortQuery = sortQueryMap[sort] || { createdAt: -1 };
    const genreFilter = genre ? { genre } : {};
    const finalQuery = { ...searchFilter, ...genreFilter };

    const booksCollection = await dbConnect(collectionObj.booksCollection);

    // ✅ Count total
    const totalBooks = await booksCollection.countDocuments(finalQuery);

    // ✅ Apply pagination
    const books = await booksCollection
      .find(finalQuery)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      data: books,
      pagination: {
        totalBooks,
        totalPages: Math.ceil(totalBooks / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Failed to fetch books in API:", error);
    return NextResponse.json(
      { error: "Failed to fetch books", details: error.message },
      { status: 500 }
    );
  }
}



export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { title, author, description, price, discount, genre, imageURL } =
      body;
    const booksCollection = await dbConnect(collectionObj.booksCollection);
    const newBook = {
      title,
      author,
      description,
      price: Number(price),
      discount: Number(discount),
      genre,
      imageURL,
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
