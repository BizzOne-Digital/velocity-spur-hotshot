// Creates or resets an admin account.
// Usage: npm run create-admin -- admin@example.com "StrongPassword123!"
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ quiet: true });

const [email, password] = process.argv.slice(2);

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set. Add it to .env or .env.local first.");
  process.exit(1);
}
if (!email || !password) {
  console.error('Usage: npm run create-admin -- <email> "<password>"');
  process.exit(1);
}
if (password.length < 10) {
  console.error("Password must be at least 10 characters.");
  process.exit(1);
}

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

await mongoose.connect(process.env.MONGODB_URI);
const passwordHash = await bcrypt.hash(password, 12);
const res = await Admin.updateOne(
  { email: email.toLowerCase() },
  { $set: { passwordHash, role: "admin" } },
  { upsert: true }
);
console.log(res.upsertedCount ? `Created admin ${email}` : `Updated password for ${email}`);
await mongoose.disconnect();
