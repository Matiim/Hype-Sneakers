const { Router } = require("express");
const productsRouter = new Router();
const ProductsController = require('../controllers/productsController')
const productsController = new ProductsController()
const uploader = require('../utils/uploader')



productsRouter.get('/',
	productsController.getProducts.bind(productsController)
)

productsRouter.get('/:pid', 
	productsController.getProductById.bind(productsController)
)

productsRouter.post('/', 
	uploader.array('thumbnails'),
	productsController.addProduct.bind(productsController)
);

productsRouter.put('/:pid',
	productsController.updateProduct.bind(productsController)
)

productsRouter.delete('/:pid',
	productsController.deleteProduct.bind(productsController)
)


module.exports = productsRouter;
