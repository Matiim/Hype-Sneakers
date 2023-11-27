const CartRepository = require('../repository/cartRepository')
const ProductsRepository = require('../repository/productRepository')
const productsRepository = new ProductsRepository()
const productModel = require('../DAOs/mongo/models/productModel')
const customError =require('../service/customErrors')
const {generateNotFoundError}=require('../service/info')
const EErrors = require('./enums')
const {transportGmail} = require('../config/nodemailer')
const settings = require('../commands/commands')

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
				const cart = await this.repository.getCartById(cid)
	
				if (cart.length === 0) {
					throw new Error('Elcarrito no funciona')
				}
				const product = await productsRepository.getProductById(pid)
	
				if (!product) {
					throw new Error('Producto no encontrado')
				}
	
				if (userId === product.owner) {
					throw new Error('Eres el dueño del producto');
				}
	
				if (!userId || userId === '1') {
					throw new Error('Los usuarios ADMIN no pueden agregar productos al carrito.');
				}
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
            const cart = await this.repository.getCartById(data.cid)

            if (!cart) {
                throw new Error('No funciona el carrito');

            }
            const productsToPurchase = cart[0].products

            for (const productData of productsToPurchase) {
                const product = await productsRepository.getCartById(productData.product)

                if (!product) {
                    throw new Error(`Producto no encontrado: ${productData.product.title}`)
                }

                if (product.stock >= productData.quantity) {
                    const productTotal = product.price * productData.quantity
                    amountTotal += productTotal
                    product.stock -= productData.quantity
                    await productsRepository.updateCartProduct(product._id,{stock:product.stock})
                } else {
                    productosSinSuficienteStock.push(product.id)
                }
            }

			if(productosSinSuficienteStock.length === cart[0].products.length){
				throw new Error ('No tienen stock suficiente')
			}

           const filteresProducts = cart[0].products.filter((productData) => {
			return  productosSinSuficienteStock.some(id => id.equals(productData.product._id))

		   });

		   cart[0].products = filteresProducts

            const order = {
                amount: amountTotal,
                purchaser: user.email || user.first_name,
                productosSinSuficienteStock,
            }

			if (order.productosSinSuficienteStock.length === 0) {
                await transportGmail.sendMail({
                    from: `hype sneakers < ${settings.emailUser}>`,
                    to: user.email,
                    subject: 'Orden de compra',
                    html: `<div>
                             <h1>Gracias ${order.purchaser} por tu compra</h1>
                             <p>Cantidad total: ${order.amount}</p>
                         </div>`,
                    attachments: []
                });
            } else {
              await transportGmail.sendMail({
                    from: `hype sneakers < ${settings.emailUser}>`,
                    to: user.email,
                    subject: 'Compra parcial',
                    html: `<div>
                             <h1>Gracias ${order.purchaser} por tu compra</h1>
                             <p>TCantidad total: ${order.amount}</p>
                             <p>Algunos productos no se puedieron agregar</p>
                             <p>Productos sin stock suficiente : ${order.productosSinSuficienteStock.join(', ')}</p>
                         </div>`,
                    attachments: []
                });
            }

            await this.repository.updateCartProducts(data.cid,cart[0].products)
            return  this.repository.finishPurchase(order)

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


			const productsInInventory = await productsRepository.getProducts()
			const products = productsInInventory.products

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
                throw new Error('El carrito no funciona')
            }

            if (!product) {
                throw new Error('Producto no encontrado')
            }

            const existingProductInCart = cart[0].products.findIndex((p) => p.product._id.toString() === pid);

            if (existingProductInCart === -1) {
                throw new Error('El producto no existe')
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
	
			if (cart[0].products.length === 0) {
				throw new Error('No hay productos a eliminar');
			}
			return this.repository.deleteProductsFromCart(cid)
		}catch(error){
			throw error
		}
	}

	async deleteCart(cid){
		try{
			const cart = await this.repository.getCartById(cid)

			if(!cart){
				throw new Error('Carrito no encontrado')
			}
			return this.repository.deleteCart(cid)

		}catch(error){
			throw error
		}
	}

	
}

module.exports = cartsService