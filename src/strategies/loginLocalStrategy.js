const local = require('passport-local')
const UserManager = require('../DAOs/mongo/UserManagerMongo')
const userManager = new UserManager()
const {isValidPassword}=require('../utils/passwordHash')
const {generateToken} = require('../utils/jwt')

const LocalStrategy = local.Strategy;

const hardcodedUser = {
    userId: '1',
    first_name: 'Usuario',
    last_name: 'Admin',
    email: 'admin@example.com',
    password: '123',
    role: 'ADMIN',
    age: 30,
};

const loginLocalStrategy = new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {

            if (hardcodedUser.email === email && hardcodedUser.password === password) {
                const token = generateToken({
                    userId: hardcodedUser.userId,
                    role: hardcodedUser.role,
                    first_name: hardcodedUser.first_name,
                    last_name: hardcodedUser.last_name,
                    email: hardcodedUser.email,
                    age: hardcodedUser.age
                })

                hardcodedUser.token = token
                return done(null, hardcodedUser)
            }

            let user = await userManager.getUserByEmail(email)

            if (!user) {
                return done(null, false, { message: 'The user does not exist in the system' })
            }

            if (!isValidPassword(password, user.password)) {
                return done(null, false, { message: 'Incorrect data' })
            }

            user = await userManager.userAuthenticate(user)
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