import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../model/User.js'
import Identity from '../model/Identity.js'
import dotenv from 'dotenv'
dotenv.config()

const ALLOWED_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value

        // Domain restriction — skip if env var not set (dev mode)
        if (ALLOWED_DOMAIN && !email.endsWith(`@${ALLOWED_DOMAIN}`)) {
          return done(null, false, { message: 'Only company emails are allowed' })
        }

        // Returning user — look up by existing identity
        const existingIdentity = await Identity.findOne({
          provider: 'google',
          externalId: profile.id,
        }).populate('userId')

        if (existingIdentity) {
          return done(null, existingIdentity.userId)
        }

        // First-time login — find pre-created User by email (Admin must create user first)
        const user = await User.findOne({ email })
        if (!user) {
          return done(null, false, { message: 'Account not found. Contact your administrator.' })
        }

        // Link this Google identity to the existing User
        await Identity.create({
          userId: user._id,
          provider: 'google',
          externalId: profile.id,
          providerEmail: email,
        })

        if (!user.picture) {
          user.picture = profile.photos[0]?.value || ''
          await user.save()
        }

        return done(null, user)
      } catch (err) {
        return done(err, null)
      }
    }
  )
)
