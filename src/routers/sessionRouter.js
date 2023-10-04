const {Router} = require('express')
const sessionRouter = new Router()
const userManagerMongo = require('../dao/UserManagerMongo')
const userManager = new userManagerMongo()
const passport = require('passport')
const passportCall = require('../utils/passportCall')
const {authorizationMiddleware} = require('../middlewares/rolesMiddleware')
const UserDto = require('../dao/dto/usersDto')

//endpoint de registro
sessionRouter.post('/register',passportCall('register'),async(req,res) =>{
	try{
		return res.status(201).json({ status: 'success', message: 'El usuario se registro con exito' });
	}catch(error){
		return res.status(500).json({ status: 'error', message: 'Error al registrar' });
		
	}
}
);


//endpoint de login 
sessionRouter.post('/login',passportCall('login'),async(req,res) =>{
	const token = req.user.token
	const user = req.user
	try{
			 res.cookie('authTokenCookie',token,{
			maxAge: 60 * 60 * 1000
		}).res.status(201).json({user})
	}catch(error){
		return res.status(500).json({ status: 'error', message: 'Error al ingresar' });
	}
})


//github
sessionRouter.get('/github', 
	passport.authenticate('github', {scope: ['user: email']})
)
//github callback
sessionRouter.get('/github-callback',
	passport.authenticate('github', { session: false }),
	(req, res) => {

		const token = req.user.token;

		return res.cookie('authTokenCookie', token, {
			maxAge: 60 * 60 * 1000
		}).redirect('/home')
	}
);

//current
sessionRouter.get('/current',passportCall('jwt'),authorizationMiddleware(), (req,res)=>{
	try{
		const currentUser = req.user
		const first_name = currentUser.first_name
		const last_name = currentUser.last_name
		const age  = currentUser.age
		const userDto = new UserDto(first_name,last_name,age)
		res.status(200).json(userDto)
	}catch(error){
		return res.status(500).json({ status: 'error', message: 'Error con el user' })

	}
})

//carrito
sessionRouter.post('/addToCart', async (req, res) => {
	const { userId, productId } = req.body
	try {
		await userManager.addToMyCart(userId, productId)
		return res.status(201).json({ status: 'success', message: 'Producto agregado al carrito' });
	} catch (error) {
		return res.redirect(`/error?errorMessage=${error.message}`)
	}
})

//eliminar cuenta 
sessionRouter.delete('/:userId', async (req, res) => {
	const { userId } = req.params
	const contentType = req.headers['content-type']
	try {
		await userManager.deleteUser(userId)
		res.clearCookie('authTokenCookie');
		return res.status(201).json({ status: 'success', message: 'Usuario eliminado' });
	} catch (error) {
		if (contentType === 'application/json') {
		return res.status(500).json({ status: 'error', message: 'Error al eliminar usuario' });
		}
		return res.redirect(`/error?errorMessage=${error.message}`)
	}
});


//endpoint de recuperar password
sessionRouter.post('/recovery-password', async (req, res) => {	
	const { email, password } = req.body
    const contentType = req.headers['content-type'];
    try {
        await userManager.recoveryPassword(email, password)
        return res.redirect('/login')
    } catch (error) {
        const commonErrorMessage = 'Error al resetear la contraseña'
        if (contentType === 'application/json') {
            return res.status(500).json({ status: 'error', error: commonErrorMessage, message: error.message });
        }
        return res.redirect(`/error?errorMessage=${commonErrorMessage}: ${error.message}`);
    }
})

module.exports = sessionRouter
