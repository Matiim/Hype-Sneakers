const { Router } = require('express');
const cartsRouter = Router();
const CartController = require('../controllers/cartsController')
const cartsController = new CartController()
const passportCall = require('../utils/passportCall')


cartsRouter.get('/',
	cartsController.getCarts.bind(cartsController)
)

cartsRouter.get('/:cid',
	cartsController.getCartById.bind(cartsController) 
)

cartsRouter.post('/',
	cartsController.addCart.bind(cartsController)
)

cartsRouter.post('/:cid/products/:pid', 
	cartsController.addProductToCart.bind(cartsController)
)

cartsRouter.post('/:cid/purchase',passportCall('jwt'),
	cartsController.finishPurchase.bind(cartsController)
)

//actualiza todo el carrito
cartsRouter.put('/:cid',
	cartsController.updateCartProducts.bind(cartsController)
)

//actualiza la cantidad de un producto
cartsRouter.put('/:cid/products/:pid',
	cartsController.updateCartProduct.bind(cartsController)
)

//elimina del carrito el producto seleccionado
cartsRouter.delete('/:cid/products/:pid',
	cartsController.deleteProductFromCart.bind(cartsController)
)

//elimina todos los productos
cartsRouter.delete('/:cid',
	cartsController.deleteProductsFromCart.bind(cartsController)
)
//elimina el cart
cartsRouter.delete('/delete/:cid',
	cartsController.deleteCart.bind(cartsController)
)



module.exports = cartsRouter
