import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const vitals = await request.json();

    //log to analytics system
    console.log("Core Web Vitals:", vitals);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to record vitals:", error);
    return NextResponse.json(
      { error: "Failed to record vitals" },
      { status: 500 },
    );
  }
}
