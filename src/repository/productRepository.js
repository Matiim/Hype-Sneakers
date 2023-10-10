const Dao = require('../dao/ProductManagerMongo')


class productsRepository{
	constructor(){
		this.dao = new Dao()
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
	async updateProduct(id, data){
		return this.dao.updateProduct(id, data)

		

	}
	async deleteProduct(id){
		
		return this.dao.deleteProduct(id)

	}
}

module.exports = productsRepository