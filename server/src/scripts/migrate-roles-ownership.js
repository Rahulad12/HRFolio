/**
 * Migration: Candidate Ownership & User Roles (Issue #40)
 *
 * What this does:
 *  1. Assigns the default role 'HR' to any existing user that has no role set.
 *  2. Finds an Admin user (or falls back to the oldest active user) to use as the
 *     default owner for candidates that have no createdBy value.
 *  3. Populates createdBy on those candidates.
 *
 * Run once:
 *   node --experimental-vm-modules src/scripts/migrate-roles-ownership.js
 *   or via npm:
 *   npx tsx src/scripts/migrate-roles-ownership.js
 */

import "dotenv/config";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL;

if (!MONGO_URI) {
  console.error("ERROR: MONGO_URI or DATABASE_URL environment variable is required.");
  process.exit(1);
}

await mongoose.connect(MONGO_URI);
console.log("Connected to MongoDB.");

// ── Schemas (minimal, for migration purposes) ──────────────────────────────

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    role: { type: String, enum: ["HR", "HR Admin", "Admin"] },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

const candidateSchema = new mongoose.Schema(
  {
    name: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

// Use existing collections
const User = mongoose.models.users || mongoose.model("users", userSchema);
const Candidate = mongoose.models.candidates || mongoose.model("candidates", candidateSchema);

// ── Step 1: Assign default role 'HR' to users with no role ─────────────────

const noRoleResult = await User.updateMany(
  { role: { $exists: false } },
  { $set: { role: "HR" } }
);
console.log(`Step 1: Assigned default role 'HR' to ${noRoleResult.modifiedCount} users with no role.`);

const nullRoleResult = await User.updateMany(
  { role: null },
  { $set: { role: "HR" } }
);
console.log(`Step 1b: Assigned default role 'HR' to ${nullRoleResult.modifiedCount} users with null role.`);

// ── Step 2: Find default owner for orphaned candidates ─────────────────────

let defaultOwner = await User.findOne({ role: "Admin", status: "active" }).sort({ createdAt: 1 });

if (!defaultOwner) {
  // Fallback: oldest active user
  defaultOwner = await User.findOne({ status: "active" }).sort({ createdAt: 1 });
}

if (!defaultOwner) {
  console.warn("WARNING: No active user found to assign as default owner. Skipping candidate ownership migration.");
} else {
  console.log(`Step 2: Using '${defaultOwner.name}' (${defaultOwner.role}) as default owner for orphaned candidates.`);

  // ── Step 3: Populate createdBy for candidates missing it ───────────────

  const orphanResult = await Candidate.updateMany(
    { createdBy: { $exists: false } },
    { $set: { createdBy: defaultOwner._id } }
  );
  console.log(`Step 3: Set createdBy on ${orphanResult.modifiedCount} candidates with no owner (missing field).`);

  const nullOwnerResult = await Candidate.updateMany(
    { createdBy: null },
    { $set: { createdBy: defaultOwner._id } }
  );
  console.log(`Step 3b: Set createdBy on ${nullOwnerResult.modifiedCount} candidates with null owner.`);
}

// ── Summary ────────────────────────────────────────────────────────────────

const totalUsers = await User.countDocuments();
const totalCandidates = await Candidate.countDocuments();
const orphanedCandidates = await Candidate.countDocuments({ createdBy: { $exists: false } });

console.log("\n── Migration Complete ──────────────────────────────");
console.log(`Total users:               ${totalUsers}`);
console.log(`Total candidates:          ${totalCandidates}`);
console.log(`Remaining orphan candidates: ${orphanedCandidates}`);

await mongoose.disconnect();
console.log("Disconnected from MongoDB.");
