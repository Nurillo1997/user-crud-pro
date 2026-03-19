const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");

/* ================= GOOGLE ================= */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
      process.env.NODE_ENV === "production"
        ? "https://nurstore.onrender.com/auth/google/callback"
        : "http://localhost:4000/auth/google/callback",
    },
    async (_, __, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        user = await User.findOne({ email });

        if (user) {
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email,
        });

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

/* ================= LOCAL ================= */

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user || !user.password) return done(null, false);

        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false);

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

/* ================= SESSION ================= */

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;