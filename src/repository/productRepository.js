const {getProductsDao} = require('../factories/productosDaoFactory')


class productsRepository{
	constructor(){
		this.dao = getProductsDao(process.env.STORAGE)
	}

	async getProducts(filters, query){
		return this.dao.getProducts(filters,query)
	}

	async getProductById(pid){
		return this.dao.getProductById(pid)

	}
	async getProductByCode(code){
		return this.dao.getProductByCode(code)

	}
	async addProduct(data){
		return this.dao.addProduct(data)


	}
	async updateProduct(pid, productData,userId){
		return this.dao.updateProduct(pid, productData,userId)


	}
	async deleteProduct(pid,userId){
		return this.dao.deleteProduct(pid,userId)
	}
}

module.exports = productsRepository