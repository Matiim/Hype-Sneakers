const ProductsRepository = require('../repository/productRepository')
const customError =require('../service/customErrors')
const EErrors = require('./enums')
const {transportGmail} = require('../config/nodemailer')
const UsersReposiroty = require('../repository/usersRepository')
const usersRepository = new UsersReposiroty()



class productsService{
	constructor(){
		this.repository = new ProductsRepository()
	}

async getProducts(filters, query) {
        return this.repository.getProducts(filters, query);
    }

	async getProductById(pid){
		return this.repository.getProductById(pid)

	}

	async addProduct(data){
		const exist = await this.repository.getProductByCode(data.code);

		if(exist){
			throw new Error(`Ya existe el producto con el codigo ${data.code}`)
		}

		if(
			!data.title ||
			!data.description ||
			!data.code ||
			!data.price ||
			data.status === undefined||
			data.status === null||
			data.status === ''||
			!data.stock ||
			!data.category
		){
         throw new Error(`Todos los campos son obligatorios`)
        }

		const newProduct = await this.repository.addProduct(data)
		return newProduct

	}


	async updateProduct(pid, productData, userId) {

		const product = await this.repository.getProductById(pid)
		if(!product){
			const error = customError.createError({
				name: 'Error al actualizar el producto',
				cause: 'Producto no encontrado',
				message: 'Producto no encontrado',
				code: EErrors.DATABASE_ERROR
			});
		throw error
	}

	if (userId !== '1' && userId && userId !== product.owner) {
		throw new Error('No eres propietario de este producto')
	}

	return this.repository.updateProduct(pid, productData);
	}

	async deleteProduct(pid, userId) {
        try {
            const product = await this.repository.getProductById(pid)
			if(!product){
				throw new Error('Producto no encontrado')
			}

			if(userId !== '1' &&  userId !== product.owner){
				throw new Error('No eres propietario de este producto')

			}

			
            if (product.owner !== 'ADMIN') {
                const ownerUser = await usersRepository.getUserById(product.owner)
                if (ownerUser && ownerUser.role === 'PREMIUM' && ownerUser.email) {
					await transportGmail.sendMail({
						from: `hype sneakers < ${process.env.EMAIL_USER}>`,
                   		to: ownerUser.email,
                    	subject:'Producto eliminado',
                    	html: `<div>
								<p>Usuario premium</p>
								<p>Su producto "${product.title}" fue eliminado por el ADMIN</p>
								<p>Gracias por comprender</p>
							 </div>`,
                    	attachments: [],
					})
				}
			}
			return this.repository.deleteProduct(pid);

		}catch(error){
			
		}
	}
}

module.exports = productsService