const passport = require('passport');
const passportService = require('./services/passport');
const Authentication = require('./controllers/authentication');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function (app) {
    app.post('/signin', requireSignin, Authentication.signin);
    app.post('/signup', Authentication.signup);
};
