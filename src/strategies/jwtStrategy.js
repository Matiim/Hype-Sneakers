const passportJwt = require('passport-jwt')
const settings=require('../commands/commands')
const JWT_KEY = settings.jwt_key


const JWTStrategy = passportJwt.Strategy
const extractJWT = passportJwt.ExtractJwt

const headerExtractor = (req) => {
    return req.headers && req.headers.cookie && req.headers.cookie.replace('authTokenCookie=', '')
}

const jwtStrategy = new JWTStrategy({

    jwtFromRequest: extractJWT.fromExtractors([headerExtractor]),
    secretOrKey: JWT_KEY
}, (jwtPayload, done) => {
    try {
        done(null, jwtPayload)
    } catch (error) {
        return done(error)
    }

})

module.exports = jwtStrategy
