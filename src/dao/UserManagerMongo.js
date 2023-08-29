const userModel = require('./models/userModel')
const {createHash}=require('../utils/passwordHash')


class UserManager {
	constructor(){
		this.model = userModel
	}

	async getUserByEmail(email) {
        try {
            const user = await this.model.findOne({ email: email })
            return user
        } catch (error) {
			return error
        }
    }

    async getUserById(id) {
        try {
            const user = await this.model.findOne({ _id: id })
            return user.toObject()
        } catch (error) {
			return error
        }
    }
	async getUserByUsername(username) {
        try {
            const user = await this.model.findOne({name: username})
            return user
        } catch (error) {
            return error
        }
    }

	async createUser(data){
		try{
			const newUser = await this.model.create({
				name: data.name,
				lastname: data.lastname,
				age: parseInt(data.age),
				email: data.email,
				password:data.password !== '' ? createHash(data.password):undefined
			})
			return newUser
		}catch(error){
			throw error
		}
	}

	async userAuthenticate(user){
		try{
			const userAuthenticate = user.toObject()
			delete userAuthenticate.password
			return userAuthenticate
		}catch (error){
			throw error
		}
	}

	async recoveryPassword(email,password){
		try {
            const user = await this.model.findOne({ email })

            if (!user) {
                throw new Error(`El usuario con el email "${email}" no existe`)
            }

            const newPassword = createHash(password)
            await this.model.updateOne({ email: user.email }, { password: newPassword })

        } catch (error) {
            console.log(error)
            throw error
        }
    }
}

module.exports = UserManager