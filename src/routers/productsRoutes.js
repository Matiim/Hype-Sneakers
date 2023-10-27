const { Router } = require("express");
const productsRouter = new Router();
const ProductsController = require('../controllers/productsController')
const uploader = require('../middlewares/uploader')
const {generateProducts} = require('../utils/faker')
const CustomError = require('../service/customErrors')
const EErrors = require('../service/enums')
const {generateProductErrorInfo} = require('../service/info')
const numberOfProducts = 100
let products = Array.from({length: numberOfProducts}, ()=> generateProducts())

class ProductsRouter {
	constructor(io){
		this.io = io
		this.productsController = new ProductsController()
	}

init(){
	this.get('/',(req,res) =>
	this.productsController.getProducts(req,res)
	)

	this.get('/:pid',(req,res) =>
	this.productsController.getProductById(req,res)
	)

	this.get('/mockingproducts',async(req,res)=>{
		res.send({quantity: products.length, payload:products})
	})
	this.post('/mockingproducts',async(req,res,next)=>{
		
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
					code: EErrors.INVALID_TYPE_ERROR
				});
				return next(error)
			}
			products.push({ ...newProduct, thumbnails: null });
			res.send({ message: 'Producto agregado con éxito', newProduct });
	})

	this.post('/', 
		uploader.array('thumbnails'),(req,res) =>
		this.productsController.addProduct(req,res)
	);

	this.put('/:pid',(req,res) =>
	this.productsController.updateProduct(req,res)
	)

	this.delete('/:pid',(req,res) =>
		this.productsController.deleteProduct(req,res)
	)
	}
}

module.exports = ProductsRouter;
