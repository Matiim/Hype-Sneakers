const mongoose = require('mongoose') //requerimos mongoose

const productSchema = mongoose.Schema({  //creamos el esquema de cart
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	code: {
		type: String,
		required: true,
		unique: true
	},
	price: {
		type: Number,
		required: true,
		set: value => parseFloat(value)
	},
	status: {
		type: Boolean,
		required: true
	},
	stock: {
		type: Number,
		required: true,
		set: value => parseInt(value)
	},
	category: {
		type: String,
		required: true
	},
	thumbnails: {
		type: Array,
		validate: {
			validator: value =>{
				if(!value){
					return []
				}
			}
		}
	},
})

module.exports = mongoose.model('products', productSchema) // lo exportamos 