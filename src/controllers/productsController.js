const productsService = require('../service/productsService')

class productsController {
	constructor(){
		this.service = new productsService()
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
	
			const generatePageLink = (page) => {
				const newQuery = { ...req.query, ...filters, page: page };
				return '/api/products?' + new URLSearchParams(newQuery).toString();
			};

			const result = {
				...products,prevLink: products.prevPage ? generatePageLink(products.prevPage) : null,
				nextLink: products.nextPage ? generatePageLink(products.nextPage) : null
			}
	
			return res.status(200).json({ status: 'success', payload:result })
	
		} catch (error) {
			return res.status(500).json({ status: 'error', error: 'Error al obtener los productos'})
		}
	}


	async getProductById(req,res){
		const {pid} = req.params
		try {
			const product = await this.service.getProductById(pid)
			return res.status(200).json({ status: 'success', payload: product })
		} catch (error) {
			if (error.message === 'Producto no encontrado') {
				return res.status(404).json({ status: 'error',  message: error.message })
			}
			return res.status(500).json({ status: 'error', message: 'Error al obtener el producto' });
		}
	}


	async addProduct(req,res){
		const newProduct = req.body;
		 try {
			(req.files && Array.isArray(req.files))
			? (newProduct.thumbnails = req.files.map((file) => file.path))
			: (newProduct.thumbnails = []);

			await this.service.addProduct(newProduct);
       		 return res.status(201).json({ status: 'success', message: 'Producto agregado exitosamente' });
		} catch (error) {
			return res.status(500).json({ status: 'error', error: 'Error al agregar el producto' });
		}
	}


	async updateProduct(req,res){
		const {pid} = req.params
		const updatedProduct = req.body

		try {
			await this.service.updateProduct(pid, updatedProduct)
			return res.status(200).json({ status: 'success', message: 'Producto actualizado exitosamente' });
		} catch (error) {
		
			if (error.message === 'Producto no encontrado') {
				return res.status(404).json({ status: 'error',  message: error.message })
			}
			return res.status(500).json({ status: 'error',  message:'Error al actualizar el producto' });
		}
	}


	async deleteProduct(req,res){
		const {pid} = req.params
		try {
			await this.service.deleteProduct(pid)
			return res.status(200).json({ status: 'success', message: 'Producto borrado exitosamente' });
		} catch (error) {
			
			if (error.message === 'Producto no encontrado') {
				return res.status(404).json({ status: 'error', message: error.message })
			}
			return res.status(500).json({ status: 'error',  message: 'Error al borrar el producto' });
		}
	}
}

module.exports = productsController