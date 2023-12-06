const passport = require('passport')
const customError = require('../service/customErrors')
const EErrors = require('../service/enums')



const passportCall = (strategy) => {
    return (req, res, next) => {
        passport.authenticate(strategy, (err, user, info) => {

            if (err) {
                return next(err);
            }

            if (!user) {
                const errorMessage = (info && info.message) ? info.message : info ? info.toString() : 'Autenticacion fallida';
                const error = customError.createError({
                    name: 'Error de autenticacion',
                    cause: errorMessage,
                    message: errorMessage,
                    code: EErrors.AUTHENTICATION_ERROR
                })
                return next(error)
            }

            req.user = user;
            next();
        })(req, res, next);
    }
}

module.exports = passportCall;