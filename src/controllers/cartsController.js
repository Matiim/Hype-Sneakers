const cartsService = require('../service/cartsService')
const {transportGmail}=require('../config/nodemailer')
const settings = require('../commands/commands')

class cartsController{
	constructor(){
		this.service = new cartsService
	}

	async getCarts(req,res){
		try {
			const carts = await this.service.getCarts()
			if (carts.lenght === 0) {
				return res.status(404).json({ status: 'error', message: 'carrito no encontrado' })
			}
			return res.status(200).json({ status: 'success', payload: carts })
		} catch (error) {
			return res.status(500).json({ status: 'error',  message: 'Error al recuperar el carrito' });
		}
	}
	async getCartById(req,res){
		const {cid} = req.params
		try {
			const cart = await this.service.getCartById(cid)
			if (cart.lenght === 0) {
				return res.status(404).json({ status: 'error', message: 'carrito no encontrado' })
			}
			return res.status(200).json({ status: 'success', payload: cart })
		} catch (error) {
			
			return res.status(500).json({ status: 'error', message: 'Error al recuperar el carrito' });
		}
	}


	async addCart(req,res){
		try {
			await this.service.addCart();
			return res.status(201).json({ status: 'success', message: 'Carrito agregado exitosamente' });
		} catch (error) {
			return res.status(500).json({ status:'error', message: 'Error al agregar el carrito' });
		}
	}


	async addProductToCart(req,res){
		const {cid,pid} = req.params
		
		try {
			await this.service.addProductToCart(cid, pid)
			return res.status(201).json({ status: 'success', message: 'Se ha guardado el producto en el carrito exitosamente' })
		} catch (error) {
			if (error.message === 'Producto no encontrado en el inventario') {
				return res.status(404).json({ status: 'error',message: error.message });
			}
			return res.status(500).json({ status: 'error', message:'Error al guardar el producto en el carrito' });
		}
	}



	async updateCartProducts(req,res){
		const {cid} = req.params
		const {newProducts} = req.body
		try {
			if(!newProducts){
				return res.status(409).json({status: 'error', message: 'No se puede actualizar sin producto'})
			}
			await this.service.updateCartProducts(cid,newProducts)
			return res.status(201).json({ status: 'success', message: 'Se ha actualizado el carrito', })
		} catch (error) {
			return res.status(500).json({ status: 'error', message: 'Error al actualizar el producto' });
		}
	}


	async updateCartProduct(req,res){
		const {cid,pid }= req.params
		const { quantity } = req.body
		try {
			if(quantity === null || quantity === undefined){
				return res.status(409).json({status:'error', message:'No se puede actualizar sin cantidad'})
			}
			if(quantity < 0){
				return res.status(409).json({status:'error', message:'La cantidad no puede ser menor a 0'})
			}
			await this.service.updateCartProduct(cid, pid, quantity)
			return res.status(201).json({ status: 'success', message: 'Se ha actualizado el carrito', })
		} catch (error) {
			if (error.message === 'Error al actualizar el producto') {
				return res.status(404).json({ status: 'error', message: error.message });
			}
			
			return res.status(500).json({ status: 'error', message: 'Error al actualizar el producto' });
		}
	}

	async finishPurchase(req,res){
			const {cid} = req.params
			const user = req.user

			try{
				if(cid !== user.cart){
					return res.status(500).json({status:'error', menssage:'No le corresponde el carrito'})
				}
				const order = await this.service.finishPurchase({cid,user})
				let result;
            try {
                if (order.productosSinSuficienteStock.length === 0) {
                    result = await transportGmail.sendMail({
                        from: `hype sneakers < ${settings.emailUser}>`,
                        to: user.email,
                        subject: 'Orden de compra',
                        html: `<div>
                                <h1>Gracias ${order.purchaser} por su compra</h1>
                                <p>Cantidad total: ${order.amount}</p>
                            </div>`,
                        attachments: []
                    });
					req.logger.info('Correo electrónico enviado con éxito:', result.response);
                } else {
                    result = await transportGmail.sendMail({
                        from: `Shop Ease < ${settings.emailUser}>`,
                        to: user.email,
                        subject: 'Partial Purchase',
                        html: `<div>
                                <h1>Gracias ${order.purchaser} por su compra</h1>
                                <p>Cantidad total : ${order.amount}</p>
                                <p>Algunos productos no se pudieron agregar por falta de stock .</p>
                                <p>Productos sin stock suficiente : ${order.productosSinSuficienteStock.join(', ')}</p>
                            </div>`,
                        attachments: []
                    });
					req.logger.info('Correo electrónico enviado con éxito:', result.response);
                }
            } catch (emailError) {
				req.logger.error('Error al enviar el correo electrónico:', emailError);
            }
				return res.status(201).json(order)
			}catch(error){
				if (error.message === 'Todos los productos en el carrito no tienen suficiente stock.') {
				return res.status(409).json({status:'error', menssage: error.message})
			}
			return res.status(500).json({status:'error', menssage:'Error en la compra'})
		}
	}

	async deleteProductFromCart(req,res){
		const {cid,pid }= req.params
		try {
			await this.service.deleteProductFromCart(cid, pid)
			return res.status(201).json({ status: 'success', message: 'Se ha eliminado el producto del carrito' })
		} catch (error) {
		
			if (error.message === 'Producto no encontrado') {
				return res.status(404).json({ status: 'error', message: error.message });
			}
			return res.status(500).json({ status: 'error', message: 'Error al eliminar el producto del carrito' });
		}
	}



	async deleteProductsFromCart(req,res){
		const {cid} = req.params
		try {
			await this.service.deleteProductsFromCart(cid)
			return res.status(200).json({ status: 'success', message: 'Se ha eliminado el producto del carrito' })
		} catch (error) {
			if (error.message === 'No se encuentra el carrito') {
				return res.status(404).json({ status: 'error',  message: error.message });
			}
			return res.status(500).json({ status: 'error',  message: "Error al eliminar los productos del carrito" });
		}
	}
}

module.exports = cartsController