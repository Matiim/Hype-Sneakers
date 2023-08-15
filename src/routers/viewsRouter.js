const { Router } = require('express')
const ProductManagerMongo = require('../dao/ProductManagerMongo')
const productManager = new ProductManagerMongo
const viewsRouter = new Router()
const CartManagerMongo = require('../dao/CartsManagerMongo')
const cartManager = new CartManagerMongo



viewsRouter.get('/home', async (req, res) => {
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

        const productsData = await productManager.getProducts(filters, query);
        const products = productsData.docs.map(p => p.toObject());

        if (products.length === 0) {
            return res.render('home', { title: 'Home', style: 'styles.css', noProducts: true });
        }

        return res.render('home', {
            title: 'Home', style: 'styles.css', products: products, productsData: productsData,
            generatePaginationLink: (page) => {
                const newQuery = { ...req.query, ...filters, page: page };
                return '/home?' + new URLSearchParams(newQuery).toString();
            }
        });
    } catch (error) {
        return res.redirect(`/error?message=Error al obtener los productos ${error}`);
    }
})

viewsRouter.get('/realtimeproducts', async (req, res) => {
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

        const productsData = await productManager.getProducts(filters, query);
        const products = productsData.docs.map(p => p.toObject());

        if (productsData.docs.length === 0) {
            return res.render('realTimeProducts', { title: 'Real Time Products', style: 'styles.css', noProducts: true });
        }

        return res.render('realTimeProducts', {
            title: 'Real Time Products', style: 'styles.css',
            products: products, productsData,
            generatePaginationLink: (page) => {
                const newQuery = { ...req.query, ...filters, page: page };
                return '/realtimeproducts?' + new URLSearchParams(newQuery).toString();
            }
        });
    } catch (error) {
        return res.redirect(`/error?message=Error al obtener los productos ${error}`);
    }
})

viewsRouter.get('/products', async (req, res) => {
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

        const productsData = await productManager.getProducts(filters, query);
        const products = productsData.docs.map(p => p.toObject());


        if (productsData.docs.length === 0) {
            return res.render('products', { title: 'Products', style: 'styles.css', noProducts: true });
        }

        return res.render('products', {
            title: 'Products', style: 'styles.css',
            products: products, productsData: productsData,
            generatePaginationLink: (page) => {
                const newQuery = { ...req.query, ...filters, page: page };
                return '/products?' + new URLSearchParams(newQuery).toString();
            }
        });

    } catch (error) {
        return res.redirect(`/error?message=Error al obtener los productos ${error}`);
    }
})

viewsRouter.get('/products/:pid', async (req, res) => {
    const pid = req.params.pid
    try {
        const product = await productManager.getProductById(pid)
        return res.render('productDetail', { title: 'Product Detail', style: 'styles.css', product: product });
    } catch (error) {
        const errorMessage = req.query.message || 'Ha ocurrido un error';
        res.render('error', { title: 'Error', errorMessage: errorMessage });
    }
})

viewsRouter.get('/carts/:cid', async (req, res) =>{
	const cid = req.params.cid
	try{
		const cart = await cartManager.getCartById(cid)
		const productsInCart = cart[0].products.map(p => p.toObject())
		return res.render('cartDetail',{title: 'Carrito', style:'style.css', productsInCart: productsInCart})
	}catch (error){
		res.render('error',{title:'Error', errorMessage: error.message})
	}
})

viewsRouter.get('/chat', async (req, res) => {
    try {
        
        return res.render('chat', { title: 'Chat', style: 'styles.css' });
    } catch (error) {
        console.log(error)
    }
})

viewsRouter.get('/error', (req, res) => {
    const errorMessage = req.query.message || 'Ha ocurrido un error';
    res.render('error', { title: 'Error', errorMessage: errorMessage });
});


module.exports = viewsRouter