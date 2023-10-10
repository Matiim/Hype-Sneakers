const { Router } = require('express')
const ProductManagerMongo = require('../dao/ProductManagerMongo')
const productManager = new ProductManagerMongo
const viewsRouter = new Router()
const CartManagerMongo = require('../dao/CartsManagerMongo')
const cartManager = new CartManagerMongo
const {loginRequire,authorizationMiddleware}= require('../middlewares/sessionMiddleware')
const passportCall = require('../utils/passportCall')




//Productos
viewsRouter.get('/home',loginRequire,authorizationMiddleware(['ADMIN','USER']), async (req, res) => {
   const user = req.user
   const admin = req.user.role === 'ADMIN'
	
	try{ 
	res.render('home',{title:'home',style: 'styles.css',user,admin})
    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: error.message });
    }
})

viewsRouter.get('/realtimeproducts',loginRequire,authorizationMiddleware('ADMIN'), async (req, res) => {
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
    
        if (category) {
            filters.category = category
        }
        if (availability) {
            filters.status = availabilityOption;
        }
		try {
        const productsData = await productManager.getProducts(filters, query);
        const products = productsData.docs.map(p => p.toObject());

        if (productsData.docs.length === 0) {
            return res.render('realTimeProducts', { title: 'Real Time Products', style:'styles.css', noProducts: true, user: user });
        }
        return res.render('realTimeProducts', {title: 'Real Time Products', style:'styles.css',products: products, productsData, user: user,generatePaginationLink: (page) => {
                const newQuery = { ...req.query, ...filters, page: page };
                return '/realtimeproducts?' + new URLSearchParams(newQuery).toString();
            }
        });
    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: error.message });
    }
})

viewsRouter.get('/products',loginRequire,authorizationMiddleware(['USER','ADMIN']), async (req, res) => {
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
            return res.render('products', { title: 'Products', style:'styles.css', noProducts: true, user: user });
        }
        return res.render('products', {title: 'Products', style:'styles.css', products: products, productsData: productsData, user: user, generatePaginationLink: (page) => {
                const newQuery = { ...req.query, ...filters, page: page };
                return '/products?' + new URLSearchParams(newQuery).toString();
            }
        });
    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: error.message });
    }
})



viewsRouter.get('/products/:pid',loginRequire,authorizationMiddleware('USER'), async (req, res) => {
    const {pid} = req.params
	const user = req.user
    try {
        const product = await productManager.getProductById(pid)
        return res.render('productDetail',{ title: 'Product Detail',style:'styles.css', product ,user});
    } catch (error) {
        const errorMessage = req.query.message || 'Ha ocurrido un error';
        res.render('error',{ title: 'Error', errorMessage: errorMessage });
    }
})


//Carrito
viewsRouter.get('/carts/:cid',passportCall('jwt'),authorizationMiddleware('USER'), async (req, res) =>{
	const {cid} = req.params
	const user = req.user
	try{
		const cart = await cartManager.getCartById(cid);
               
		if (req.user.cart !== cid) {
			const errorMessage = 'No tienes permiso para ver este carrito'
			res.render('error',{ title: 'Error', errorMessage: errorMessage },);
		}
		const productsInCart = cart[0].products.map(p => p.toObject());

		const { totalQuantity, totalPrice } = productsInCart.reduce((accumulator, item) => {
			accumulator.totalQuantity += item.quantity;
			accumulator.totalPrice += item.quantity * item.product.price;

			return accumulator;
		}, { totalQuantity: 0, totalPrice: 0 });

		if (cart[0].products.length === 0) {
			const noProducts = true;	
			return res.render('cartDetail',{title: 'Carrito', noProducts ,user})
		}else{
			const productsInCart = cart[0].products.map(p => p.toObject())
			return res.render('cartDetail',{title:'Carrito', style:'style.css',productsInCart,user,totalPrice,totalQuantity})
		}
	}catch (error){
		res.render('error',{title:'Error', errorMessage: error.message})
	}
})

//Chat
viewsRouter.get('/chat',authorizationMiddleware('USER'), async (req, res) => {
    try {
        
        return res.render('chat',{ title: 'Chat', style: 'styles.css' });
    } catch (error) {
		res.render('error',{title:'Error', errorMessage: error.message})
    }
})

viewsRouter.get('/carts/:cid/purchase',passportCall('jwt'),authorizationMiddleware('USER'),async(req,res)=>{
	const user = req.user
	const {cid}= req.params

	try{
		const cart = await cartManager.getCartById(cid)

		if(req.user.cart !== cid){
			res.render('error',{title:'Error', errorMessage: error.message})
		}

		const productsInCart = cart[0].products.map((item)=>{
			const product = item.product
			const quantity = item.quantity
			const totalProductPrice = product.price * quantity
			return {
				product:product.toObject(),
				quantity,
				totalProductPrice
			}
		})

		const {totalQuantity,totalPrice} = cart[0].products.reduce((accumulator,item)=>{
			accumulator.totalQuantity += item.quantity
			accumulator.totalPrice += item.quantity * item.product.price

			return accumulator
		},{totalQuantity:0,totalPrice:0})

		res.render('checkout',{title:'Checkout', style:'style.css',user,productsInCart,totalPrice,totalQuantity})
	}catch(error){
		res.render('error',{title:'Error', errorMessage: error.message})

	}
})


//Error
viewsRouter.get('/error', (req, res) => {
	const errorMessage = req.query.errorMessage || 'Ocurrio un error'
	if(errorMessage){
		res.render('error', { title: 'Error', errorMessage: errorMessage, style:'style.css' });
	}else{
		res.render('error', { title: 'Error', errorMessage: error.message });
	}
});






//ruta de register
viewsRouter.get('/register', async(req, res)=>{
	try{
		return res.render('register',{title: 'Registrarse', style:'style.css'})
	}catch(error){
		res.render('error', {title:'Error', errorMessage: error.message})
	}
})


//ruta de login

viewsRouter.get('/login', async (req, res) => {
		try {
			 res.render('login',{title: 'Login', style:'style.css'})
		} catch (error) {
			res.render('error', { title: 'Error', errorMessage: error.message });
		}
	})


//ruta para recuperar Contraseña
viewsRouter.get('/recovery-password', (req, res)=>{
	try{
		res.render('recovery-password',{title:'Recuperar password', style:'style.css'})
	}catch(error){
		res.render('error', { title: 'Error', errorMessage: error.message });
	}
		
})

viewsRouter.get('/profile',loginRequire,authorizationMiddleware(['USER','ADMIN']),async(req,res)=>{
	const user = req.user
	try{
		res.render('profile',{user,title:'Profile', style:'style.css'})
	}catch(error){
		res.render('error', { title: 'Error', errorMessage: error.message });

	}
})
//ruta para logout
viewsRouter.get('/logout',(req, res)=>{
	try{
		
		 res.redirect('/login')
	}catch(error){
		res.render('error',{title:'Error', errorMessage: error.message})
	}	
})

/*viewsRouter.get('*', (req,res) =>{
	res.redirect('notFound',{title:'Not found'})
})*/

module.exports = viewsRouter