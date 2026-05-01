import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  if (!authHeader.toLowerCase().startsWith("bearer ")) {
    return NextResponse.json(
      { error: "Missing bearer token." },
      { status: 401 }
    );
  }
  const token = authHeader.slice(7).trim();
  if (!token) {
    return NextResponse.json(
      { error: "Empty bearer token." },
      { status: 401 }
    );
  }

  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server misconfigured.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  // Verify the caller's token and resolve their user id.
  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData.user) {
    return NextResponse.json(
      { error: "Invalid or expired session." },
      { status: 401 }
    );
  }

  const userId = userData.user.id;

  // ON DELETE CASCADE on packing_lists.user_id removes their list automatically.
  const { error: deleteErr } = await admin.auth.admin.deleteUser(userId);
  if (deleteErr) {
    return NextResponse.json(
      { error: deleteErr.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
