const {Router} = require('express')
const sessionRouter = new Router()
const userManagerMongo = require('../dao/UserManagerMongo')
const userManager = new userManagerMongo()
const passport = require('passport')


//endpoint de registro
sessionRouter.post('/register',
    passport.authenticate('register', {
        failureRedirect: '/register',
        failureFlash: true
    }), (req, res) => {
        req.session.destroy()
        return res.redirect('/login')
    }
);


//endpoint de login 
sessionRouter.post('/login',
    passport.authenticate('login', {
        successRedirect: '/products',
        failureRedirect: '/login',
        failureFlash: true
    })
)
//github
sessionRouter.get('/github', 
	passport.authenticate('github', {scope: ['user: email']})
)
//github callback
sessionRouter.get('/github-callback', 
	passport.authenticate('github', { failureRedirect:'/login'}), async (req, res) => {
    req.session.user = req.user
    res.redirect('/products')
})

//current
sessionRouter.get('/current', (req,res)=>{
	const sessionModel = {
		session: req.session,
		user: req.session
	}
	res.status(200).json(sessionModel)
})

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
