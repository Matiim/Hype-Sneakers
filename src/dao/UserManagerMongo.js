const userModel = require('./models/userModel')

class UserManager {
	constructor(){
		this.model = userModel
	}

	async createUser(data){
		try{
			if(!data.name || !data.lastname || !data.email || !data.age || !data.password){
				throw new Error('Todos los campos son obligatorios')
			}
	
			const exist = await this.model.findOne({email: data.email})

			if(exist){
				throw new Error(`email ${data.email} ya registrado`)
			}

			await this.model.create({
				name: data.name,
				lastname: data.lastname,
				age: parseInt(data.age),
				email: data.email,
				password: data.password
			})

		}catch(error){
			throw error
		}
	}

	async userAuthenticate(email, password,res){
		try{
			const user = await this.model.findOne({email})

			if(!user){
				throw new Error('El usuario no existe')
			}

			if(user.password !== password){
				throw new Error('Datos incorrectos')
			}

			const userAuthenticate = user.toObject()
			delete userAuthenticate.password

			return userAuthenticate
		}catch (error){
			throw error
		}
	}
}

module.exports = UserManager