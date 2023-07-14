const { Router } = require('express')
const ProductManager = require('../controllers/productManager')

const viewsRouterFn = (io) => {
    const viewsRouter = new Router()
    const productManager = new ProductManager('./products.json', io)
    viewsRouter.get('/', async (req, res) => {
        try {
            const products = await productManager.getProducts()
            const limit = req.query.limit

            if (products.length === 0) {
                return res.render('home', { title: 'Home', style: 'style.css', noProducts: true });
            }

            if (limit) {
                const productosLimitados = products.slice(0, parseInt(limit))
                return res.render('home', { title: 'Home', style: 'style.css', products: productosLimitados });
            }

            return res.render('home', { title: 'Home', style:'style.css', products: products });
        } catch (error) {
            console.error("Error ", error);

        }
    })

    viewsRouter.get('/realtimeproducts', async (req, res) => {
        try {
            const products = await productManager.getProducts()
            const limit = req.query.limit

            if (products.length === 0) {
                return res.render('realTimeProducts', { title: 'Real Time Products', style: 'style.css', noProducts: true });
            }

            if (limit) {
                const productosLimitados = products.slice(0, parseInt(limit))
                return res.render('realTimeProducts', { title: 'Real Time Products', style: 'style.css', products: productosLimitados });
            }

            return res.render('realTimeProducts', { title: 'Real Time Products', style: 'style.css', products: products });
        } catch (error) {
            console.error("Error ", error);
        }
    })

    return viewsRouter
}

module.exports = viewsRouterFn