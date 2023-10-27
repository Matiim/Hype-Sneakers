const CartRepository = require('../repository/cartRepository')
const productModel = require('../DAOs/mongo/models/productModel')
const cartModel = require('../DAOs/mongo/models/cartModel')
const customError =require('../service/customErrors')
const {generateNotFoundError}=require('../service/info')
const EErrors = require('./enums')

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
	async addProductToCart(cid, pid,userId){
		try{
			return this.repository.addProductToCart(cid,pid,userId)
		}catch(error){
			throw error
		}
	}

	async finishPurchase(data) {
        const user = data.user
        let amountTotal = 0
        const productosSinSuficienteStock = []

        try {
            const cart = await cartModel.findById(data.cid)

            if (!cart) {
                throw new Error('No funciona el carrito');

            }
            const productsToPurchase = cart.products

            for (const productData of productsToPurchase) {
                const product = await productModel.findById(productData.product)

                if (!product) {
                    throw new Error(`Producto no encontrado: ${productData.product.title}`)
                }

                if (product.stock >= productData.quantity) {
                    const productTotal = product.price * productData.quantity
                    amountTotal += productTotal
                    product.stock -= productData.quantity
                    await product.save()
                } else {
                    productosSinSuficienteStock.push(product.id)
                }
            }

			if(productosSinSuficienteStock.length === cart.products.length){
				throw new Error ('No tienen stock suficiente')
			}

            cart.products = cart.products.filter((productData) =>
                productosSinSuficienteStock.includes(productData.id)
            );

            const dataOrder = {
                amount: amountTotal,
                purchaser: user.email || user.first_name,
                productosSinSuficienteStock,
            }

            await cart.save()
            return await this.repository.finishPurchase(dataOrder)

        } catch (error) {
            
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
                customError.createError({
                    name: 'Error al actualizar el producto',
                    cause: generateNotFoundError(cid, 'cart'),
                    message: 'Carrito no encontrado',
                    code: EErrors.DATABASE_ERROR
                });
            }

            if (!product) {
                customError.createError({
                    name: 'Error al actualizar el producto',
                    cause: generateNotFoundError(pid, 'product'),
                    message: 'Producto no encontrado en el inventario',
                    code: EErrors.DATABASE_ERROR
                });
            }

            const existingProductInCart = cart[0].products.findIndex((p) => p.product._id.toString() === pid);

            if (existingProductInCart === -1) {
                customError.createError({
                    name: 'Error al actualizar el producto',
                    cause: generateNotFoundError(pid, 'productCart'),
                    message: 'El producto que estás intentando actualizar no existe en el carrito',
                    code: EErrors.DATABASE_ERROR
                });
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