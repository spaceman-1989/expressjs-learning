import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Name is required and should be a string.'],
        minlength: [3, 'Name should be between 3 and 20 characters.'],
        maxlength: [20, 'Name should be between 3 and 20 characters.'],
        validate: {
            validator: function(value) {
                return /^[a-zA-Z0-9 ]*$/.test(value);
            },
            message: 'Name should not contain special characters.'
        }
    },

    email: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Email is required and should be a valid email address.'],
        unique: true,
        validate: {
            validator: function(value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Please enter a valid email address.'
        }
    },

    password: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    
});

export const User = mongoose.model("User", userSchema);



