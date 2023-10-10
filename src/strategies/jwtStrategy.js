const passportJwt = require('passport-jwt')
const settings=require('../commands/commands')
const JWT_KEY = settings.jwt_key


const JWTStrategy = passportJwt.Strategy
const extractJWT = passportJwt.ExtractJwt

const headerExtractor = (req) => {
    return req.headers && req.headers['authorization'] && req.headers['authorization'].replace('Bearer ', '')
}

const jwtStrategy = new JWTStrategy({

    jwtFromRequest: extractJWT.fromExtractors([headerExtractor]),
    secretOrKey: JWT_KEY
}, (jwtPayload, done) => {
	try{
		done(null, jwtPayload.user)
	}catch(error){
		return done(error)
	}
})

module.exports = jwtStrategy
