const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');
const config = require('../config');

// Setup options for JWT Strategy
const JWTOptions = {
    jwtFromRequest: ExtractJWT.fromHeader('authorization'),
    secretOrKey: config.secret
};

// Create JWT Strategy
const JWTLogin = new JWTStrategy(JWTOptions, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub).exec();
        if (!user) return done(null, false);
        return done(null, user);
    } catch (error) {
        return done(error);
    }
});

// Tell passport to use this strategy
passport.use(JWTLogin);
