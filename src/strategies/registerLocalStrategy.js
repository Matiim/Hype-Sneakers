const local = require('passport-local')
const UserManager = require('../DAOs/mongo/UserManagerMongo')
const userManager = new UserManager()


const LocalStrategy = local.Strategy;

const registerLocalStrategy = new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, username, password, done) => {
        const { first_name, last_name, age, email } = req.body

        try {
            let user = await userManager.getUserByUsername(username)
            
            if (user) {
                return done(null, false, { message: 'Ya existe un usuario con ese correo electrónico' });
            }

            if (!first_name || !last_name || !age || !password || !email) {
                return done(null, false, { message: 'Todos los campos son obligatorios' });
            }

            let newUser = { first_name, last_name, email, age, password }

            let result = await userManager.createUser(newUser)

            return done(null, result);
        } catch (error) {
            return done(error)
        }
    }
);

module.exports = registerLocalStrategy