const {Router} = require('express')
const sessionRouter = new Router()
const userManagerMongo = require('../dao/UserManagerMongo')
const userManager = new userManagerMongo()
const passport = require('passport')
const { loginRequire,authorizationMiddleware } = require('../middlewares/sessionMiddleware')
/*const passportCall = require('../utils/passportCall')
const {authorizationMiddleware} = require('../middlewares/rolesMiddleware')*/
const UserDto = require('../dao/dto/usersDto')





//endpoint de registro
sessionRouter.post('/register', passport.authenticate('register', {
	failureRedirect: '/register',
	failureFlash: true
}), (req, res) => {
	req.session.destroy()
	return res.redirect('/')
});


//endpoint de login 
sessionRouter.post('/login', passport.authenticate('login', {
	successRedirect: '/products',
	failureRedirect: '/login',
	failureFlash: true,
}));


//github
sessionRouter.get('/github', passport.authenticate('github', {
	scope: ['user:email']
}));


//github callback
sessionRouter.get('/github-callback', passport.authenticate('github', { failureRedirect: '/' }),
(req, res) => {
	req.session.user = req.user;
	res.redirect('/products')
});

//current
sessionRouter.get('/current', loginRequire,authorizationMiddleware('ADMIN'), (req, res) => {
	try {
		const currentUser = req.user
		const first_name = currentUser.first_name
		const last_name = currentUser.last_name || ''
		const age = currentUser.age
		const userDto = new UserDto(first_name, last_name, age)
		res.status(200).json(userDto)
	} catch (error) {
		res.status(500).json(error)
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
