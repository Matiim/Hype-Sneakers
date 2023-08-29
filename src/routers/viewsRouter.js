const { Router } = require('express')
const ProductManagerMongo = require('../dao/ProductManagerMongo')
const productManager = new ProductManagerMongo
const viewsRouter = new Router()
const CartManagerMongo = require('../dao/CartsManagerMongo')
const cartManager = new CartManagerMongo
const {adminRequire,loginRequire,sessionMiddleware} = require('../middlewares/sessionMeddleware')



//Productos
viewsRouter.get('/home',loginRequire, async (req, res) => {
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
        res.render('error', { title: 'Error', errorMessage: error.message });
    }
})

viewsRouter.get('/realtimeproducts', loginRequire, adminRequire, async (req, res) => {
    const user = req.user
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
            return res.render('realTimeProducts', { title: 'Real Time Products', style: 'styles.css', noProducts: true, user: user });
        }

        return res.render('realTimeProducts', {
            title: 'Real Time Products', style: 'styles.css',
            products: products, productsData, user: user,
            generatePaginationLink: (page) => {
                const newQuery = { ...req.query, ...filters, page: page };
                return '/realtimeproducts?' + new URLSearchParams(newQuery).toString();
            }
        });
    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: error.message });
    }
})

viewsRouter.get('/products', loginRequire, async (req, res) => {
    const user = req.user
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
            return res.render('products', { title: 'Products', style: 'styles.css', noProducts: true, user: user });
        }

        return res.render('products', {
            title: 'Products', style: 'styles.css',
            products: products, productsData: productsData, user: user,
            generatePaginationLink: (page) => {
                const newQuery = { ...req.query, ...filters, page: page };
                return '/products?' + new URLSearchParams(newQuery).toString();
            }
        });

    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: error.message });
    }
})

viewsRouter.get('/products/:pid',loginRequire, async (req, res) => {
    const pid = req.params.pid
    try {
        const product = await productManager.getProductById(pid)
        return res.render('productDetail', { title: 'Product Detail', style: 'styles.css', product: product });
    } catch (error) {
        const errorMessage = req.query.message || 'Ha ocurrido un error';
        res.render('error', { title: 'Error', errorMessage: errorMessage });
    }
})


//Carrito
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

//Chat
viewsRouter.get('/chat', async (req, res) => {
    try {
        
        return res.render('chat', { title: 'Chat', style: 'styles.css' });
    } catch (error) {
		res.render('error', { title: 'Error', errorMessage: error.message });
    }
})


//Error
viewsRouter.get('/error', (req, res) => {
	const errorMessage = req.query.errorMessage || 'Ocurrio un error'
	if(errorMessage){
		res.render('error', { title: 'Error', errorMessage: errorMessage });
	}else{
		res.render('error', { title: 'Error', errorMessage: error.message });
	}
});





//ruta de register
viewsRouter.get('/register',sessionMiddleware, async(req, res)=>{
	try{
		return res.render('register',{title: 'Registrarse', style:'style.css'})
	}catch(error){
		res.render('error', {title:'Error', errorMessage: error.message})
	}
})


//ruta de login
viewsRouter.get('/login',sessionMiddleware,async (req, res)=>{
	try{
		return res.render('login',{title: 'Login', style:'style.css'})
	}catch(error){
		res.render('error', { title: 'Error', errorMessage: error.message });
	}

})
//ruta para recuperar Contraseña
viewsRouter.get('/recovery-password',sessionMiddleware, (req, res)=>{
	try{
		return res.render('recovery-password')
	}catch(error){
		res.render('error', { title: 'Error', errorMessage: error.message });
	}
		
})
//ruta para logout
viewsRouter.get('/logout',(req, res)=>{
	req.session.destroy(err =>{
		if(!err){
			return res.redirect('/login')
		}else{
			return res.status(500).json({status:'error'})
		}
	})
})
module.exports = viewsRouter