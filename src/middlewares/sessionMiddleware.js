//middleware para si esta iniciada la sesion, mandar a products
const haveSession = (req, res, next)=>{
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
const authorizationMiddleware = (roles) => {
    return (req, res, next) => {
        const contentType = req.headers['content-type']
        if (!req.user) {
            if (contentType === 'application/json') {
                return res.status(401).json({
                    error: 'Debes iniciar sesión'
                })
            }
            return res.redirect('/')
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'No tienes permiso para consumir este recurso'
            });
        }

        next()
    };
};

module.exports = {
	haveSession,
	loginRequire,
	authorizationMiddleware
}