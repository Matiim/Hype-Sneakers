const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    products : {
        type: Array
    }
})

module.exports = mongoose.model('carts', cartSchema)