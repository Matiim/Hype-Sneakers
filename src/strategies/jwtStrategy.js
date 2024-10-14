const passportJwt = require('passport-jwt')
const jwt_key = require('../config/config')


const JWTStrategy = passportJwt.Strategy
const extractJWT = passportJwt.ExtractJwt

const headerExtractor = (req) => {
    const cookies = req.headers && req.headers.cookie ? req.headers.cookie.split(';') : [];
    let authTokenValue;

    cookies.forEach(cookie => {
        const [key, value] = cookie.trim().split('=');
        if (key === 'authTokenCookie') {
            authTokenValue = value;
        }
    });

    return authTokenValue;
};

const jwtStrategy = new JWTStrategy({

    jwtFromRequest: extractJWT.fromExtractors([headerExtractor]),
    secretOrKey: 'secretJwt'
}, (jwtPayload, done) => {
    try {
        done(null, jwtPayload)
    } catch (error) {
        return done(error)
    }

})

module.exports = {headerExtractor,jwtStrategy}
