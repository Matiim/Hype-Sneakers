const userModel = require('./models/userModel')
const {createHash}=require('../utils/passwordHash')
const CartManager = require('./CartsManagerMongo')
const cartManager = new CartManager()
const cartModel = require('./models/cartModel')


class UserManager {
	constructor(){
		this.model = userModel
	}

	async getUserByEmail(email) {
        try {
            const user = await this.model.findOne({ email: email })
            return user
        } catch (error) {
            throw error
        }
    }

    async getUserById(id) {
        try {
            const user = await this.model.findOne({ _id: id })
            if (!user) {
                throw new Error('El usuario no existe')
            }
            return user.toObject()
        } catch (error) {
            throw error
        }
    }


	async getUserByUsername(username) {
        try {
            const user = await this.model.findOne({ first_name: username });
            if (!user) {
                return null;
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

	async createUser(data) {

        try {
            const newCart = await cartManager.addCart()
            const newUser = await this.model.create({
                first_name: data.first_name,
                last_name: data.last_name,
                age: parseInt(data.age),
                password: data.password !== '' ? createHash(data.password) : undefined,
                cart: newCart._id
            })

            return newUser

        } catch (error) {
            throw error
        }
    }

	async addToMyCart(userId, productId){
		try {
            const user = await this.model.findOne({ _id: userId })
            const cart = await cartManager.getCartById(user.cart)

            if (!cart) {
                throw new Error('Carrito no encontrado')
            } else {
                await cartManager.addProductToCart(user.cart, productId)
            }

        } catch (error) {
            console.log(error);
            throw error
        }

    }

	async userAuthenticate(user){
		try {
            const authenticateUser = user.toObject()
            delete authenticateUser.password
            return authenticateUser
        } catch (error) {
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
            throw error
        }
    }

	async deleteUser(id) {
		try {
            const user = await this.model.findOne({ _id: id })
            if (!user) {
                throw new Error('El usuario no existe')
            }
            const cart = await cartManager.getCartById(user.cart)
            await cartModel.deleteOne({ _id: cart })

            await this.model.deleteOne({ _id: id });

        } catch (error) {
            throw error
        }
    }
}

module.exports = UserManager