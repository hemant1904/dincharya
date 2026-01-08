import { NextResponse } from "next/server";
import { requireFields, isNonEmptyString } from "@/app/utils/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1️⃣ Validate input
    const requiredCheck = requireFields(body, ["habit"]);
    if (!requiredCheck.valid) {
      return NextResponse.json(
        { status: "error", message: requiredCheck.message },
        { status: 400 }
      );
    }

    if (!isNonEmptyString(body.habit)) {
      return NextResponse.json(
        { status: "error", message: "Habit must be a non-empty string" },
        { status: 400 }
      );
    }

    // 2️⃣ Mock Sheets entry
    const mockEntry = {
      rowId: Math.floor(Math.random() * 1000),
      habit: body.habit,
      date: new Date().toISOString().split("T")[0],
      status: "logged"
    };

    // 3️⃣ Return mock success
    return NextResponse.json({
      status: "ok",
      message: "Habit logged successfully (mock)",
      data: mockEntry
    });

  } catch {
    return NextResponse.json(
      { status: "error", message: "Invalid request body" },
      { status: 400 }
    );
  }
}
