const User = require('../models/user');
const utils = require('../utils');

module.exports = {
    signup: utils.asyncWrap(async (req, res) => {
        let { email: email, password: password } = req.body;

        if (!password || !email) {
            return res
                .status(422)
                .send({ error: 'You must provide username and password' });
        }

        let user = new User({ email, password });
        try {
            await user.save();
            res.send({ token: user.generateToken(), email: user.email });
        } catch (error) {
            req.log.error({ error: error }, 'Registration Error');
            res.status(422).send({ error: 'Bad registration information' });
        }
    }),

    signin: utils.asyncWrap(async (req, res) => {
        res.send({ token: req.user.generateToken() });
    })
};
