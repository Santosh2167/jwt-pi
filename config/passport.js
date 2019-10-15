const passport = require("passport");
const LocalStrategy = require("passport-local");
const UserModel = require("./../database/models/user_ model");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

// passport.serializeUser((user, done) => {
//   done(null, user._id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await UserModel.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error);
//   }
// })

passport.use(new LocalStrategy(
  {
    usernameField: "email"

  },
  async (email, password, done) => {
    try {
      const user = await UserModel.findOne({ email });

      if (!user || !user.verifyPasswordSync(password)) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      done(error);
    }

  }
));

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET

},
  async (JWTPayload, done) => {
    try {
      const user = await UserModel.findOne(JWTPayload.sub);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      done(error);
    }

  }));