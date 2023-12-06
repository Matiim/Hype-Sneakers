const local = require('passport-local')
const UsersRepository = require('../repository/usersRepository')
const usersRepository = new UsersRepository()
const {isValidPassword}=require('../utils/passwordHash')
const {generateToken} = require('../utils/jwt')

const LocalStrategy = local.Strategy;



const loginLocalStrategy = new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            let user = await usersRepository.getUserByFilter({ email })

            if (!user) {
                return done(null, false, { message: 'El usuario no existe en el sistema' })
            }

            if (!isValidPassword(password, user.password)) {
                return done(null, false, { message: 'Datos incorrectos' })
            }

            await usersRepository.updateUserLastConnection(user)
            delete user.password

            const token = generateToken({
                userId: user._id,
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                cart: user.cart
            })
            user.token = token
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }
);


module.exports = loginLocalStrategy