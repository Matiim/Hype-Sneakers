const { Router } = require('express')
const viewsRouter = new Router()
const ProductsService = require('../service/productsService')
const productsService = new ProductsService()
const CartsService = require('../service/cartsService')
const cartsService = new CartsService()
const UsersService = require('../service/usersService')
const usersService = new UsersService()
const {isAuth,authorizationMiddleware}= require('../middlewares/sessionMiddleware')
const passportCall = require('../utils/passportCall')
const {verifyToken}= require('../utils/jwt')



//Productos
viewsRouter.get('/home',passportCall('jwt'),authorizationMiddleware(['ADMIN','USER', 'PREMIUM']), async (req, res) => {
   const user = req.user
   let roles = [];

   if (user.role === 'PREMIUM') {
	   roles.premiumRole = true
   } else if (user.role === 'ADMIN') {
	   roles.adminRole = true
   } else {
	   roles.userRole = true
   }
	
	try{ 
	res.render('home',{title:'home',style: 'styles.css',user,roles})
    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: error.message });
    }
})

viewsRouter.get('/realtimeproducts',passportCall('jwt'),authorizationMiddleware(['ADMIN','PREMIUM']), async (req, res) => {
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
			const productsData = await productsService.getProducts(filters, query);
			const products = productsData.products.map(p => p.toObject());

       
        return res.render('realTimeProducts', {title: 'Real Time Products', style:'styles.css',products: products, productsData, user: user,
			generatePaginationLink: (page) => {
                const newQuery = { ...req.query, ...filters, page: page };
                return '/realtimeproducts?' + new URLSearchParams(newQuery).toString();
            }
        });
    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: error.message });
    }
})

viewsRouter.get('/products',passportCall('jwt'),authorizationMiddleware(['USER','PREMIUM']), async (req, res) => {
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
		const productsData = await productsService.getProducts(filters, query);
		const products = productsData.products.map(p => p.toObject());

    
        return res.render('products', {title: 'Productos', style:'styles.css', products: products, productsData: productsData, user: user,
				generatePaginationLink: (page) => {
				const newQuery = { ...req.query, ...filters, page: page };
				return '/products?' + new URLSearchParams(newQuery).toString();
			}
        });
    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: error.message });
    }
})



viewsRouter.get('/products/:pid',passportCall('jwt'),authorizationMiddleware(['USER','PREMIUM']), async (req, res) => {
    const {pid} = req.params
	const user = req.user
    try {
        const product = await productsService.getProductById(pid)
		return res.render('productDetail',{ title: 'Detalle del producto',style:'styles.css', product ,user});
    } catch (error) {
        const errorMessage = req.query.message || 'Ha ocurrido un error';
		return res.render('error',{ title: 'Error', errorMessage: errorMessage });
    }
})


//Carrito
viewsRouter.get('/carts/:cid',passportCall('jwt'),authorizationMiddleware(['USER','PREMIUM']), async (req, res) =>{
	const user = req.user
	const { cid } = req.params
	try {
		const cart = await cartsService.getCartById(cid);

		if (req.user.cart !== cid) {
			const errorMessage = 'No tienes permiso para ver este carrito'
			res.render('error',{ title: 'Error', errorMessage: errorMessage },);
		}

		const productsInCart = cart[0].products.map(p => p.toObject());
		let { totalQuantity, totalPrice } = productsInCart.reduce((accumulator, item) => {
			accumulator.totalQuantity += item.quantity;
			accumulator.totalPrice += item.quantity * item.product.price;

			return accumulator;
		}, { totalQuantity: 0, totalPrice: 0 });
		totalPrice = totalPrice.toFixed(1)
		if (cart[0].products.length === 0) {
			const noProducts = true;	
			return res.render('cartDetail',{title: 'Carrito',style:'styles.css', noProducts ,user})
		}else{
			return res.render('cartDetail',{title:'Carrito', style:'styles.css',productsInCart,user,totalPrice,totalQuantity})
		}
	}catch (error){
		res.render('error',{title:'Error', errorMessage: error.message})
	}
})



viewsRouter.get('/carts/:cid/purchase', passportCall('jwt'), authorizationMiddleware(['USER', 'PREMIUM']), async (req, res) => {
	const user = req.user
	const { cid } = req.params
	try {
		const cart = await cartsService.getCartById(cid);

		if (req.user.cart !== cid) {
			const errorMessage = 'You do not have permission to view this cart'
			res.renderView({
				view: 'error', locals: { title: 'Error', errorMessage: errorMessage },
			});
		}

		const productsInCart = cart[0].products.map((item) => {
			const product = item.product;
			const quantity = item.quantity;
			const totalProductPrice = product.price * quantity;
			return {
				product: product.toObject(),
				quantity,
				totalProductPrice,
			};
		});

		const { totalQuantity, totalPrice } = cart[0].products.reduce((accumulator, item) => {
			accumulator.totalQuantity += item.quantity;
			accumulator.totalPrice += item.quantity * item.product.price;

			return accumulator;
		}, { totalQuantity: 0, totalPrice: 0 });

		res.render('checkout',{title:'Checkout', style:'style.css',user,productsInCart,totalPrice,totalQuantity})
	}catch(error){
		res.render('error',{title:'Error', errorMessage: error.message})

	}
})
viewsRouter.get('/carts/:cid/checkout', passportCall('jwt'), authorizationMiddleware(['USER', 'PREMIUM']), async (req, res) => {
	const user = req.user
	const { cid } = req.params
	try {
		if (req.user.cart !== cid) {
			const errorMessage = 'No tienes permiso para ver esta informacion'
			res.render('error',{ title: 'Error', errorMessage: errorMessage },);
		}

			return res.render('checkout',{title: 'Checkout',style:'styles.css',user})		
	}catch (error){
		res.render('error',{title:'Error', errorMessage: error.message})
	}
})
//Chat
viewsRouter.get('/chat',passportCall('jwt'),authorizationMiddleware('USER'), async (req, res) => {
    try {
        
        return res.render('chat',{ title: 'Chat', style: 'styles.css' });
    } catch (error) {
		res.render('error',{title:'Error', errorMessage: error.message})
    }
})

//ruta de register
viewsRouter.get('/register', isAuth,async(req, res)=>{
	try{
		 res.render('register',{title: 'Registro', style:'styles.css'})
	}catch(error){
		res.render('error', {title:'Error', errorMessage: error.message})
	}
})


//ruta de login

viewsRouter.get('/login', isAuth,async (req, res) => {
		try {
			 res.render('login',{title: 'Login', style:'styles.css'})
		} catch (error) {
			res.render('error', { title: 'Error', errorMessage: error.message });
		}
	})


//ruta para recuperar Contraseña
viewsRouter.get('/passwordrecovery',isAuth, (req, res)=>{
	try{
		res.render('passwordRecovery',{title:'Recuperar password', style:'styles.css'})
	}catch(error){
		res.render('error', { title: 'Error', errorMessage: error.message });
	}
		
})

viewsRouter.get('/password/reset/:token', isAuth, async (req, res) => {
	const { token } = req.params
	try {
		await verifyToken(token)
		res.render('reset', { title: 'Reset Password',styles:'styles.css' } )
	} catch (error) {
		if (error.message === 'jwt expired') {
			error.message = 'The password reset link has expired'
		}
		res.render('error', { title: 'Error', errorMessage: error.message });

	}
})

viewsRouter.get('/profile',passportCall('jwt'),authorizationMiddleware(['USER','ADMIN','PREMIUM']),async(req,res)=>{
	const user = req.user
	try{
		res.render('profile',{user,title:'Profile', style:'styles.css'})
	}catch(error){
		res.render('error', { title: 'Error', errorMessage: error.message });

	}
})
//ruta para logout
viewsRouter.get('/logout',(req, res)=>{
	try{
		res.clearCookie('authTokenCookie')
		 res.redirect('/login')
	}catch(error){
		res.render('error',{title:'Error', errorMessage: error.message})
	}	
})
//Error
viewsRouter.get('/error', (req, res) => {
	const errorMessage = req.query.errorMessage || 'Ocurrio un error'
	if(errorMessage){
		res.render('error', { title: 'Error', errorMessage: errorMessage, styles:'style.css' });
	}else{
		res.render('error', { title: 'Error', errorMessage: error.message });
	}
});

viewsRouter.get('/users',passportCall('jwt'),authorizationMiddleware('ADMIN'),async(req,res) => {
	try{
		const users = await usersService.getUsers()
		let noUsers = false
		if (!users) noUsers = true
		res.render('users',{title:'Usuarios', style:'styles.css',users,noUsers})
	}catch(error){
		res.render('error',{title:'Error', errorMessage: error.message})
	}
})

viewsRouter.get('*',(req,res)=>{
	res.render('notFound',{title:'No encontrado'})
})



module.exports = viewsRouter