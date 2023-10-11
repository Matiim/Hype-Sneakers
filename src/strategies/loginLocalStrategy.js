const local = require('passport-local')
const UserManager = require('../dao/UserManagerMongo')
const userManager = new UserManager()
const {isValidPassword}=require('../utils/passwordHash')


const LocalStrategy = local.Strategy;


const loginLocalStrategy = new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
		try {

            let user = await userManager.getUserByEmail(email)

            if (!user) {
                return done(null, false, { message: 'El usuario no existe en el sistema' })
            }

            if (!isValidPassword(password, user.password)) {
                return done(null, false, { message: 'Datos incorrectos' })
            }

            user = await userManager.userAuthenticate(user)

            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }
);

module.exports = loginLocalStrategy