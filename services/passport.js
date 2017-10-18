const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const User = require('../models/user');
const config = require('../config');

// Setup options for JWT Strategy
const JWTOptions = {
    jwtFromRequest: ExtractJWT.fromHeader('authorization'),
    secretOrKey: config.secret
};

const localOptions = {
    usernameField: 'email'
};

// Create Local Strategy
const localLogin = new LocalStrategy(
    localOptions,
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email: email }).exec();
            if (!user) {
                return done(null, false);
            }

            const isMatch = await user.comparePassword(password);

            if (!isMatch) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
);

// Create JWT Strategy
const JWTLogin = new JWTStrategy(JWTOptions, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub).exec();
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
});

// Tell passport to use this strategy
passport.use(JWTLogin);
passport.use(localLogin);
