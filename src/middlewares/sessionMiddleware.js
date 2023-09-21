//middleware para si esta iniciada la sesion, mandar a products
const sessionMiddleware = (req, res, next)=>{
	if(req.user){
		return res.redirect('/products')
	}
	return next ()
}

//middleware para login
const loginRequire = (req, res,next)=>{
	if(!req.user){
		return res.redirect('/login')
	}
	return next()
}

//middleware para admin
const adminRequire = (req, res,next)=>{
	if(req.user.role !== 'admin'){
		return res.redirect('/products')
	}
	return next()
}

module.exports = {
	sessionMiddleware,
	loginRequire,
	adminRequire
}