const { Router } = require('express')
const ProductManagerMongo = require('../dao/ProductManagerMongo')
const MessageManagerMongo = require('../dao/MessageManagerMongo')
const viewsRouter = new Router()

const viewsRouterFn = (io) => {
    const productManager = new ProductManagerMongo(io)
    const messageManagerMongo = new MessageManagerMongo(io)

    viewsRouter.get('/', async (req, res) => {
        try {
            const products = await productManager.getProducts()
            const limit = req.query.limit

            if (products.length === 0) {
                return res.render('home', { title: 'Home', style: 'styles.css', noProducts: true });
            }

            if (limit) {
                const productosLimitados = products.slice(0, parseInt(limit))
                return res.render('home', { title: 'Home', style: 'styles.css', products: productosLimitados });
            }

            return res.render('home', { title: 'Home', style: 'styles.css', products: products });
        } catch (error) {
            return res.redirect('/error?message=Error al obtener los productos');
        }
    })

    viewsRouter.get('/realtimeproducts', async (req, res) => {

        try {
            const products = await productManager.getProducts()
            const limit = req.query.limit

            if (products.length === 0) {
                return res.render('realTimeProducts', { title: 'Real Time Products', style: 'styles.css', noProducts: true });
            }

            if (limit) {
                const productosLimitados = products.slice(0, parseInt(limit))
                return res.render('realTimeProducts', { title: 'Real Time Products', style: 'styles.css', products: productosLimitados });
            }

            return res.render('realTimeProducts', { title: 'Real Time Products', style: 'styles.css', products: products });
        } catch (error) {
            return res.redirect('/error?message=Error al obtener los productos');
        }
    })

    viewsRouter.get('/chat', async (req, res) => {
        try {
            return res.render('chat', { title: 'Chat', style: 'styles.css'});
        } catch (error) {
            console.log(error)
        }
    })

    viewsRouter.get('/error', (req, res) => {
        const errorMessage = req.query.message || 'Ha ocurrido un error';
        res.render('error', { title: 'Error', errorMessage: errorMessage });
    });

    return viewsRouter

}


module.exports = viewsRouterFn