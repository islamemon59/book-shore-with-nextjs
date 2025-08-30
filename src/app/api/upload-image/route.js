import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image");

    if (!imageFile) {
      return NextResponse.json(
        { message: "No image file provided." },
        { status: 400 }
      );
    }

    const imgBBFormData = new FormData();
    imgBBFormData.append("image", imageFile);

    const imgBBResponse = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
      {
        method: "POST",
        body: imgBBFormData,
      }
    );

    const imgBBData = await imgBBResponse.json();

    if (!imgBBData.success) {
      return NextResponse.json(
        {
          message: "Image upload to ImgBB failed.",
          error: imgBBData.error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { url: imgBBData.data.url, message: "Image uploaded successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
