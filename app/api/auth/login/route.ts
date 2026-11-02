import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { clientIp, isEmail, rateLimit, str } from "@/lib/validation";
import Admin from "@/models/Admin";

export const runtime = "nodejs";

// Used to keep response timing similar when the email does not exist.
const DUMMY_HASH = bcrypt.hashSync("velocity-spur-timing-guard", 10);

export async function POST(req: Request) {
  if (!rateLimit(`login:${clientIp(req)}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = str(body.email, 200).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (!isEmail(email) || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    await connectDB();
    const admin = await Admin.findOne({ email }).select("+passwordHash");
    const ok = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);
    if (!admin || !ok) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    await setSessionCookie({ sub: admin._id.toString(), email: admin.email, role: admin.role ?? "admin" });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Login failed", err);
    return NextResponse.json({ error: "Login is temporarily unavailable" }, { status: 500 });
  }
}
