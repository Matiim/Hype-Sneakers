const { Router } = require("express");
const productsRouter = new Router();
const ProductsController = require('../controllers/productsController')
const productsController = new ProductsController()
const uploader = require('../middlewares/uploader')
const {generateProducts} = require('../utils/faker')
const CustomError = require('../service/customErrors')
const EErrors = require('../service/enums')
const {generateProductErrorInfo} = require('../service/info')
const numberOfProducts = 100
let products = Array.from({length: numberOfProducts}, ()=> generateProducts())


productsRouter.get('/',
	productsController.getProducts.bind(productsController)
)

productsRouter.get('/:pid', 
	productsController.getProductById.bind(productsController)
)

productsRouter.get('/mockingproducts',async(req,res)=>{
	res.send({quantity: products.length,payload:products})
})
productsRouter.post('/mockingproducts',async(req,res)=>{
	
		const newProduct = req.body;
		if (
			!newProduct.title ||
			!newProduct.description ||
			!newProduct.code ||
			!newProduct.price ||
			!newProduct.status||
			!newProduct.stock ||
			!newProduct.category
		) {
		const error =CustomError.createError({
				name: 'Error de creación del producto',
				cause: generateProductErrorInfo(newProduct),
				message: 'Error al crear producto',
				code: EErrors.INVALID_TYPES_ERROR
			});
			return next(error)
		}
		products.push({ ...newProduct, thumbnails: null });
		res.send({ message: 'Producto agregado con éxito', newProduct });
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
