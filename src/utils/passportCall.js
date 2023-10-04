const passport = require('passport')

const passportCall = (Strategy) => {
    return (req, res, next) => {
        passport.authenticate(Strategy, (err, user, info) => {

            if (err) {
                return next(err);
            }
            
            if (!user) {
                console.log(info.message);
                const errorMessage =  'Autenticacion falsa';
                return res.status(401).json(errorMessage);
            }

            req.user = user;
            next();
        })(req, res, next);
    }
}


module.exports = passportCall;