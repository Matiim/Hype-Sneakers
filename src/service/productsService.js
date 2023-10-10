const ProductsRepository = require('../repository/productRepository')

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
		const exist = this.repository.getProductByCode(data.code);

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
			return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios' })
		}

		const newProduct = this.repository.addProduct(data)
		return newProduct

	}
	async updateProduct(id, data){
		return this.repository.updateProduct(id,data)

	}
	async deleteProduct(id){
		return this.repository.deleteProduct(id)

	}
}

module.exports = productsService