const { Router } = require("express");
const ProductManagerMongo = require("../dao/ProductManagerMongo");
const uploader = require('../utils/uploader')
const productsRouter = new Router();
const productManager = new ProductManagerMongo

//ANDAN bien 
productsRouter.get('/', async (req, res) => {
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

        const products = await productManager.getProducts(filters, query)

		const generatePageLink = (page) => {
            const newQuery = { ...req.query, ...filters, page: page };
            return '/api/products?' + new URLSearchParams(newQuery).toString();
        };

        return res.status(200).json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? generatePageLink(products.prevPage) : null,
            nextLink: products.hasNextPage ? generatePageLink(products.nextPage) : null
        })
        
    } catch (error) {
        return res.status(500).json({ status: 'error', error: 'Error al obtener los productos', message: error.message })
    }
})

productsRouter.get('/:pid', async (req, res) => {
    const pid = req.params.pid
    try {
        const product = await productManager.getProductById(pid)
        return res.status(200).json({ status: 'success', payload: product })
    } catch (error) {
        const commonErrorMessage = 'Error al obtener el producto'
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ status: 'error', error: commonErrorMessage, message: `El producto con el id ${pid} no se encuentra` })
        }
        return res.status(500).json({ status: 'error', error: commonErrorMessage, message: error.message });
    }
})

productsRouter.post('/', uploader.array('thumbnails', 3), async (req, res) => {
    const newProduct = req.body;
    const thumbnails = req.files.map((file) => file.path)
    try {
        await productManager.addProduct({ ...newProduct, thumbnails });
        return res.status(201).json({ status: 'success', message: 'Producto agregado exitosamente' });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: 'Error al agregar el producto', message: error.message });
    }
});

productsRouter.put('/:pid', async (req, res) => {
    const pid = req.params.pid
    const updatedProduct = req.body

    try {
        await productManager.updateProduct(pid, updatedProduct)
        return res.status(200).json({ status: 'success', message: 'Producto actualizado exitosamente' });
    } catch (error) {
        const commonErrorMessage = 'Error al actualizar el producto'
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ status: 'error', error: commonErrorMessage, message: `El producto con el id ${pid} no se encuentra` })
        }
        if (error.code === 11000) {
            return res.status(404).json({ status: 'error', error: commonErrorMessage, message: `El código ${updatedProduct.code} que ya se encuentra en uso` })
        }
        return res.status(500).json({ status: 'error', error: commonErrorMessage, message: error.message });
    }
})

productsRouter.delete('/:pid', async (req, res) => {
    const pid = req.params.pid
    try {
        await productManager.deleteProduct(pid)
        return res.status(200).json({ status: 'success', message: 'Producto borrado exitosamente' });
    } catch (error) {
        const commonErrorMessage = 'Error al borrar el producto'
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ status: 'error', error: commonErrorMessage, message: `El producto con el id ${pid} no se encuentra` })
        }
        return res.status(500).json({ status: 'error', error: commonErrorMessage, message: error.message });
    }
})

module.exports = productsRouter;
