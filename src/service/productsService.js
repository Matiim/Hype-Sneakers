const ProductsRepository = require('../repository/productRepository')
const customError =require('../service/customErrors')
const {generateProductErrorInfo}=require('../service/info')
const EErrors = require('./enums')

class productsService{
	constructor(){
		this.repository = new ProductsRepository()
	}

	async getProducts(filters, query){
		return this.repository.getProducts(filters,query)
	}

	async getProductById(pid){
		return this.repository.getProductById(pid)

	}

	async addProduct(data){
		const exist = await this.repository.getProductByCode(data.code);

		if(exist){
			const error = customError.createError({
				name:'Error al crear el producto',
				cause:`Ya existe el producto con el code '${data.code}'`,
				message:`Ya existe el producto con el code '${data.code}'`,
				code: EErrors.DUPLICATE_PRODUCT_ERROR
			})
			throw error
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
            const error = customError.createError({
                name: 'Error al crear el producto',
                cause: generateProductErrorInfo(data),
                message: 'Error al crear el producto',
                code: EErrors.INVALID_TYPE_ERROR
            });

            throw error
        }

		const newProduct = await this.repository.addProduct(data)
		return newProduct

	}


	async updateProduct(pid, productData,userId){

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

	if(userId !== '1' && userId && userId !== product.owner){
		throw new Error('No eres propietario de este producto')
	}

	return this.repository.updateProduct(pid,productData)
	}



	async saveProduct(pid){
		return this.repository.saveProduct(pid)
	}

	async deleteProduct(pid,userId){
	const product = await this.repository.getProductById(pid) 
	if(!product){
		throw new Error('Producto no encontrado')
	}

	if(userId !== '1' &&  userId !== product.owner){
		throw new Error('No eres propietario de este producto')

	}
		return this.repository.deleteProduct(pid)

	}
}

module.exports = productsService