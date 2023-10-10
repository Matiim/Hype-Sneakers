const Dao = require('../dao/CartsManagerMongo')


class cartsRepository {
	constructor(){
		this.dao = new Dao()
	}

	async getCarts(){
		try{
			return this.dao.getCarts()
		}catch(error){
			throw error
		}
	}
	async getCartById(id){
		try{
			return this.dao.getCartById(id)

		}catch(error){
			throw error
		}
	}
	async addCart(){
		try{
			return this.dao.addCart()
		}catch(error){
			throw error
		}
	}
	async addProductToCart(cid, pid){
		try{
			return this.dao.addProductToCart(cid,pid)
		}catch(error){
			throw error
		}
	}

	async finishPurchase(data){
		try{
			return this.dao.finishPurchase(data)
		}catch(error){
			throw error
		}
	}
	async updateCartProducts(cid, newProducts){
		try{
			
			return this.dao.updateCartProducts(cid,newProducts)

		}catch(error){
			throw error
		}
	}


	async updateCartProduct(cid, pid, quantity){
		try{
			return this.dao.updateCartProduct(cid,pid,quantity)
		}catch(error){
			throw error
		}
	}


	async deleteProductFromCart(cid, pid){
		try{
			return this.dao.deleteProductFromCart(cid,pid)
		}catch(error){
			throw error
		}
	}
	async deleteProductsFromCart(cid){
		try{
			return this.dao.deleteProductsFromCart(cid)
		}catch(error){
			throw error
		}
	}

	
}

module.exports = cartsRepository