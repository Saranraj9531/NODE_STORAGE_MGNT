const mongoose = require('mongoose')
const validator = require('validator')
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:   {  type: String,
                required: true
            },

    email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is invalid')
                }
                }
            },
    password: 
                {
                    type: String,
                    required: true,
                    minlength: 7,
                    trim: true,
                    validate(value) {
                        if (value.toLowerCase().includes('password')) {
                            throw new Error('Password cannot contain "password"')
                        }
                }
                },
    ph_no: 
                {
                    type: Number,
                    required: true
                }
})

module.exports = mongoose.model('User', userSchema)