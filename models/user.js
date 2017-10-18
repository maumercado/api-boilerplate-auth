const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config');

// Model Definition

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    token: { type: String, index: { sparse: true } },
    password: { type: String, required: true }
});

// Validations
userSchema.path('email').validate({
    isAsync: true,
    validator: async value => {
        try {
            const count = await mongoose
                .model('User', userSchema)
                .count({ email: value });

            if (count > 0) await Promise.reject();
            await Promise.resolve();
        } catch (error) {
            await Promise.reject(error);
        }
    },
    message: 'Email already exists'
});

// Pre Saves
userSchema.pre('save', async function (next) {
    const user = this;
    try {
        if (!this.isModified('password')) {
            return next();
        }
        let salt = await bcrypt.genSalt(10); // this works
        let result = await bcrypt.hash(user.password, salt, null);
        user.password = result; // returns NULL
        return next();
    } catch (error) {
        return next(error);
    }
});

// Custom Instance methods
userSchema.method('generateToken', function () {
    const user = this;
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user._id, iat: timestamp }, config.secret);
});

// Create Model Class
const ModelClass = mongoose.model('User', userSchema);

// Export the model
module.exports = ModelClass;
