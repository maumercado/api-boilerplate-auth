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
        user.token = user.generateToken();
        await user.save();
        res.send({ token: user.token, email: user.email });
    })
};
