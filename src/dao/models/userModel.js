const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
	first_name: String,
    last_name:  String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    role: {
        type: String,
        default: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
	cart: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'carts' 
	}
});

module.exports = mongoose.model('users',userSchema)