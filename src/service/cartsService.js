const CartRepository = require('../repository/cartRepository')
const productModel = require('../dao/models/productModel')

class cartsService {
	constructor(){
		this.repository = new CartRepository()
	}

	async getCarts(){
		try{
			return this.repository.getCarts()
		}catch(error){
			throw error
		}
	}
	async getCartById(id){
		try{
			return this.repository.getCartById(id)

		}catch(error){
			throw error
		}
	}
	async addCart(){
		try{
			return this.repository.addCart()
		}catch(error){
			throw error
		}
	}
	async addProductToCart(cid, pid){
		try{
			const cart = await this.repository.getCartById(cid)
            if (!cart) {
                throw new Error('No se encuentra el carrito')
            }
			return this.repository.addProductToCart(cid,pid)

		}catch(error){
			throw error
		}
	}
	async updateCartProducts(cid, newProducts){
		try{
			const cart = await this.repository.getCartById(cid)

			if(!cart){
				throw new Error('No se encuentra el carrito')
			}

			const products = await productModel.find()

			newProducts.forEach(p => {
				const pId = p.product
				const quantity = p.quantity

				if(!pId || !quantity){
				throw new Error('Cada producto debe tener su ID y su cantidad')
				}

				const inventoryProductId = products.find(p => p._id.toString() === pId)

				if(!inventoryProductId){
				throw new Error('Mirar los Ids cargados en el carrito')
				}
			});
			return this.repository.updateCartProducts(cid,newProducts)

		}catch(error){
			throw error
		}
	}
	async updateCartProduct(cid, pid, quantity){
		try{
			const cart = await this.repository.getCartById(cid)
            const product = await productModel.findById(pid)

            if (!cart) {
                throw new Error('No se encuentra el carrito')
            }

            if (!product) {
                throw new Error('Producto no encontrado en el inventario')
            }

            const existingProductInCart = cart[0].products.findIndex((p) => p.product._id.toString() === pid);
            if (existingProductInCart === -1) {
                throw new Error('El producto que intentas actualizar no existe en el carrito');
			}
			return this.repository.updateCartProduct(cid,pid,quantity)

		}catch(error){
			throw error
		}
	}
	async deleteProductFromCart(cid, pid){
		try{
			const product = await productModel.findById(pid)
            const cart = await this.repository.getCartById(cid)

            if (!cart) {
                throw new Error('No se encuentra el carrito')
            }

            if (!product) {
                throw new Error('Producto no encontrado en el inventario')
            }

            const existingProductInCart = cart[0].products.findIndex((p) => p.product._id.toString() === pid);
            if (existingProductInCart === -1) {
                throw new Error('El producto que intentas eliminar no existe en el carrito')
            }
			return this.repository.deleteProductFromCart(cid,pid)
		}catch(error){
			throw error
		}
	}
	async deleteProductsFromCart(cid){
		try{
			const cart = await this.repository.getCartById(cid);

			if (!cart) {
				throw new Error('No se encuentra el carrito');
			}
	
			if (cart.products.length === 0) {
				throw new Error('No hay productos a eliminar');
			}
			return this.repository.deleteProductsFromCart(cid)
		}catch(error){
			throw error
		}
	}

	
}

module.exports = cartsService