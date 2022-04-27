const mongoose = require('mongoose')
const validator = require('validator')

const storeSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true
             },
        user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

        description: String,
        status: Boolean,
        storeImage: {type: String, required: true}
    }
)

module.exports = mongoose.model('Store', storeSchema)