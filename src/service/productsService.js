const ProductsRepository = require('../repository/productRepository')
const customError =require('../service/customErrors')
const {generateProductErrorInfo}=require('../service/info')
const EErrors = require('./enums')

class productsService{
	constructor(){
		this.repository = new ProductsRepository
	}

	async getProducts(filters, query){
		return this.repository.getProducts(filters,query)
	}

	async getProductById(id){
		return this.repository.getProductById(id)

	}

	async addProduct(data){
		const exist = await this.repository.getProductByCode(data.code);

		if(exist){
			throw new Error('Ya existe el codigo')
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
	async updateProduct(id, productData,userId){
		return this.repository.updateProduct(id,productData,userId)

	}
	async saveProduct(pid){
		return this.repository.saveProduct(pid)
	}
	async deleteProduct(pid,userId){
		return this.repository.deleteProduct(pid,userId)

	}
}

module.exports = productsService