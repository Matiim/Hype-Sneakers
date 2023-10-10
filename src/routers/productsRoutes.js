const { Router } = require("express");
const productsRouter = new Router();
const ProductsController = require('../controllers/productsController')
const productsController = new ProductsController()
const uploader = require('../middlewares/uploader')
const {generateProducts} = require('../utils/faker')



productsRouter.get('/',
	productsController.getProducts.bind(productsController)
)

productsRouter.get('/:pid', 
	productsController.getProductById.bind(productsController)
)

productsRouter.get('/mockingproducts',async(req,res)=>{
	const numberOfProducts = 100
	const products = Array.from({length: numberOfProducts}, ()=> generateProducts())
	res.send({quantity: products.length,payload:products})
})

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
