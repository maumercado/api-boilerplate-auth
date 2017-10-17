const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Model Definition

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: String
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

// Create Model Class
const ModelClass = mongoose.model('User', userSchema);

// Export the model
module.exports = ModelClass;
