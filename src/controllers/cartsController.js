const cartsService = require('../service/cartsService')

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
			if (error.message = 'No se encuentran carritos en nuestra base de datos') {
				return res.status(404).json({ status: 'error', message: error.message });
			}
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
			const commonErrorMessage = 'Error al guardar el producto en el carrito'
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
				return res.status(409).json({status:'error', message:'No se puede actualizar'})
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
	async deleteProductFromCart(req,res){
		const {cid,pid }= req.params

    try {
        await this.service.deleteProductFromCart(cid, pid)
        return res.status(201).json({ status: 'success', message: 'Se ha eliminado el producto del carrito' })
    } catch (error) {
       
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ status: 'error', message: error.message });
        }
        if (error.message === 'No se encuentra el carrito') {
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