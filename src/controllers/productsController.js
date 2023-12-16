const ProductsService = require('../service/productsService')
const customError = require('../service/customErrors')
const EErrors = require('../service/enums')


class productsController {
	constructor(io){
		this.service = new ProductsService()
		this.io = io
	}

	async getProducts(req,res){
		const filters = {}
		const { page = 1, limit = 10, sort, category, availability } = req.query
		const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
		const availabilityOption = availability === 'available' ? true : availability === 'notavailable' ? false : undefined;
		const query = {
			page: parseInt(page),
			limit: parseInt(limit),
			sort: sortOption
		}
	
		try {
	
			if (category) {
				filters.category = category
			}
	
			if (availability) {
				filters.status = availabilityOption;
			}
	
			const products = await this.service.getProducts(filters, query)

			if(products.length === 0){
				return res.status(404).json('Error producto no encotrado')
			}
	
			const generatePageLink = (page) => {
				const newQuery = { ...req.query, ...filters, page: page };
				return '/api/products?' + new URLSearchParams(newQuery).toString();
			};

			const result = {
				...products, prevLink: products.prevPage ? generatePageLink(products.prevPage) : null,
				nextLink: products.nextPage ? generatePageLink(products.nextPage) : null
			}
	
			return res.status(200).json({ status: 'success', payload:result})
	
		} catch (error) {
			req.logger.error('Error al obtener los productos')
			return res.status(500).json({ status: 'error', error: 'Error al obtener los productos'})
		}
	}


	async getProductById(req,res,next){
		const {pid} = req.params
		try {
			const product = await this.service.getProductById(pid)
			if(!product){
				const error = customError.createError({
					name:'Error al recuperar el producto',
					cause:`Producto con id ${pid} no encontrado`,
					message:`Producto con id ${pid} no encontrado`,
					code: EErrors.DATABASE_ERROR
				})
				throw error
			}
			return res.status(200).json({ status: 'success', payload: product })
		} catch (error) {
			next(error)
		}
	}

	
	async addProduct(req,res){
		const newProduct = req.body;

        try {
			req.files && Array.isArray(req.files)
			? (newProduct.thumbnails = req.files.map((file) => file.path))
			: (newProduct.thumbnails = []);

            const productoNuevo = await this.service.addProduct(newProduct);

            this.io.emit('newProduct', JSON.stringify(productoNuevo))
       		 return res.status(201).json({ status: 'success', message: 'Producto agregado exitosamente' });
		} catch (error) {
			if(error.message === 'Todos los campos son obligatorios' || error.message === `Ya existe un producto con el codigo ${newProduct.code}`){
				return res.status(409).json({ status: 'error',  message: error.message });
			}
			return res.status(500).json({ status: 'error',  message:'Error al agregar el producto' });

		}
	}


	async updateProduct(req, res) {
        const { pid } = req.params;
        const { productData, userId } = req.body;
        try {
            const productUpdated = await this.service.updateProduct(pid, productData, userId);
            this.io.emit('updateProductInView', productUpdated);
			return res.status(200).json({ status: 'success', message: 'Producto actualizado exitosamente' });
		} catch (error) {
			if (error.message === 'Producto no encontrado') {
				return res.status(404).json({ status: 'error',  message: error.message })
			}
			return res.status(500).json({ status: 'error',  message:'Error al actualizar el producto' });
		}
	}


	async deleteProduct(req, res) {
        const { pid } = req.params;
        const { userId } = req.body
        try {
            await this.service.deleteProduct(pid, userId);
            req.logger.info('Succcessfully deleted')
			this.io.emit('productDeleted', pid)
			return res.status(200).json({ status: 'success', message: 'Producto eliminado correctamente' });
		} catch (error) {
			
			if (error.message === 'Producto no encontrado') {
				return res.status(404).json({ status: 'error', message: error.message })
			}
			return res.status(500).json({ status: 'error',  message: 'Error al borrar el producto' });
		}
	}
}

module.exports = productsController