const Dao = require('../dao/ProductManagerMongo')


class productsRepository{
	constructor(){
		this.dao = new Dao()
	}

	async getProducts(filters, query){
		try{
			const products = await this.dao.getProducts(filters,query)
			return products
		}catch(error){
			throw error
		}
	}

	async getProductById(pid){
		
		try{
			return await this.dao.getProductById(pid)
		}catch(error){
			throw error
		}
	}
	async addProduct(data){
		try{
			return await this.dao.addProduct(data)
		}catch(error){
			throw error
		}

	}
	async updateProduct(id, data){
		try{
			return await this.dao.updateProduct(id,data)
		}catch(error){
			throw error
		}
		

	}
	async deleteProduct(id){
		
		try{
			return await this.dao.deleteProduct(id)
		}catch(error){
			throw error
		}
	}
}

module.exports = productsRepository