const User = require('../models/user');

module.exports = {
    signup: async (req, res, next) => {
        let { email: email, password: password } = req.body;
        let user = new User({ email, password });
        try {
            await user.save();
            res.send({ success: true });
        } catch (e) {
            res.status(422).send({ message: e.message });
        }
    }
};
