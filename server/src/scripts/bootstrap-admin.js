/**
 * Bootstrap: Create the first Admin user
 *
 * Inserts a User record with role "Admin" for the given email.
 * The user logs in via Google OAuth on first login — their Google identity
 * is then linked automatically by passport.js.
 *
 * Run once (before any user exists):
 *   npx tsx src/scripts/bootstrap-admin.js
 *
 * Set ADMIN_EMAIL env var or edit ADMIN_EMAIL below.
 */

import 'dotenv/config'
import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'rahul.adhikari@amniltech.com'
const ADMIN_NAME  = process.env.ADMIN_NAME  || 'Rahul Adhikari'

if (!MONGO_URI) {
  console.error('MONGO_URI is not set')
  process.exit(1)
}

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  picture:   { type: String },
  role:      { type: String, enum: ['HR', 'HR Admin', 'Admin'] },
  isLoggedIn:{ type: Boolean, default: false },
  status:    { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true })

const User = mongoose.model('users', userSchema)

async function run() {
  await mongoose.connect(MONGO_URI)
  console.log('Connected to MongoDB')

  const existing = await User.findOne({ email: ADMIN_EMAIL })
  if (existing) {
    if (existing.role !== 'Admin') {
      existing.role = 'Admin'
      await existing.save()
      console.log(`Updated existing user ${ADMIN_EMAIL} to Admin`)
    } else {
      console.log(`Admin user ${ADMIN_EMAIL} already exists — nothing to do`)
    }
  } else {
    await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, role: 'Admin', status: 'active' })
    console.log(`Created Admin user: ${ADMIN_EMAIL}`)
  }

  await mongoose.disconnect()
  console.log('Done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
