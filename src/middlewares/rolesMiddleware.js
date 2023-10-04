
const isAuth = (req, res, next) => {
    if (req.headers && req.headers.cookie && req.headers.cookie.replace('authTokenCookie=', '')) {
        return res.redirect('/login');
    }
    return next();
}


	const authorizationMiddleware = (roles) => {
		return (req, res, next) => {
			const contentType = req.headers['content-type']
			if (!req.user) {
				if (contentType === 'application/json') {
					return res.status(401).json({
						error: 'Debes iniciar sesión'
					})
				}
				return res.redirect('/login')
			}
	
			if (!roles.includes(req.user.role)) {
				return res.status(403).json({
					error: 'No tienes permiso para consumir este recurso'
				});
			}
	
			next()
		};
	};
	


module.exports = {isAuth,authorizationMiddleware}