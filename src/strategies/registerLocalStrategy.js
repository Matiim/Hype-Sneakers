const local = require('passport-local')
const UsersRepository = require('../repository/usersRepository')
const usersRepository = new UsersRepository()


const LocalStrategy = local.Strategy;

const registerLocalStrategy = new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, username, password, done) => {
        const { first_name, last_name, age, email } = req.body

        try {
            let user = await usersRepository.getUserByFilter({email:username})
            
            if (user) {
                return done(null, false, { message: 'Ya existe un usuario con ese correo electrónico' });
            }

            if (!first_name || !last_name || !age || !password || !email) {
                return done(null, false, { message: 'Todos los campos son obligatorios' });
            }

            let newUser = { first_name, last_name, email, age, password }

            let result = await usersRepository.createUser(newUser)

            return done(null, result);
        } catch (error) {
            return done(error)
        }
    }
);

module.exports = registerLocalStrategy