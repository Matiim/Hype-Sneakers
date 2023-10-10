const passport = require('passport')

const passportCall = (strategy) => {
    return (req, res, next) => {
        passport.authenticate(strategy, (err, user, info) => {

            if (err) {
                return next(err);
            }
            
            if (!user) {
                console.log(info.message);
                const errorMessage = (info && info.message) ? info.message : info ? info.toString() : 'Authentication failed';
                return res.status(401).json(errorMessage);
            }

            req.user = user;
            next();
        })(req,res,next) 
    }
}

module.exports = passportCall;