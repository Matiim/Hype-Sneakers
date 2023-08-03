const mongoose = require('mongoose') //requerimos mongoose

const messageShema = mongoose.Schema({  //creamos el esquema de message
	user: {
		type: String,
		required: true
	},
	content:{
		type: String,
		required: true
	},
	timestamp:{
		type: Date,
		default: Date.now,
		required:true

	}
	
})

module.exports = mongoose.model('messages', messageShema) // lo exportamos 