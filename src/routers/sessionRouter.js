const passport = require('passport')
const {Router} = require('express')
const sessionRouter = new Router()
const UserDto = require('../DAOs/DTOs/usersDto')
const passportCall = require('../utils/passportCall')
const {authorizationMiddleware } = require('../middlewares/sessionMiddleware')

//endpoint de registro
sessionRouter.post('/register',passportCall('register'), async (req, res) => {
	try {
		return res.status(201).json({status: 'success',message:'El usuario fue registrado!'})
	} catch (error) {
		next(error)
	}
});


//endpoint de login 
sessionRouter.post('/login', passportCall('login'),async (req, res) => {
    const {token,user} = req.user;
    try {
        return res.cookie('authTokenCookie', token, {
            maxAge: 60 * 60 * 1000
        }).status(201).json({status: 'success',payload:user})
    } catch (error) {
        next(error)
    }
});


//github
sessionRouter.get('/github', passport.authenticate('github', {
	scope: ['user:email']
}));


//github callback
sessionRouter.get('/github-callback', passport.authenticate('github', { session: false }), (req, res) => {
	const token = req.user.token;
	return res.cookie('authTokenCookie', token, {
		maxAge: 60 * 60 * 1000
	}).redirect('/home')
});

//current
sessionRouter.get('/current',passportCall('jwt'),authorizationMiddleware('ADMIN'), (req, res) => {
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




module.exports = sessionRouter
