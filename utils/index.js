const Boom = require('boom');

module.exports = {
    asyncWrap: fn => {
        return (req, res, next) => {
            fn(req, res, next).catch(err => res.json(Boom.wrap(err)));
        };
    }
};
